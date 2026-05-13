import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import uuid
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

EXTRACT_DIR = Path("./shared-data/tmp/extracted")

def get_candidate_mapping(year, engine):
    """Retorna dicionário sq_candidato -> candidate_id para um ano específico."""
    logger.info(f"Carregando mapa de candidatos para {year}...")
    with engine.connect() as conn:
        res = conn.execute(text('SELECT id, sq_candidato FROM "Candidate" WHERE ano_ultima_eleicao = :year'), {"year": year})
        return {str(row[1]): row[0] for row in res}

def fix_2022_assets():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    year = 2022
    sq_to_id = get_candidate_mapping(year, engine)
    
    if not sq_to_id:
        logger.error("Nenhum candidato de 2022 encontrado no banco!")
        return

    asset_files = list(EXTRACT_DIR.glob(f"bem_candidato_{year}_*.csv"))
    if not asset_files:
        logger.warning(f"Nenhum arquivo de bens encontrado para {year}")
        return

    # Limpa bens de 2022 antes de re-importar
    with engine.connect() as conn:
        logger.info("Limpando bens de 2022 para re-importação corrigida...")
        candidate_ids = list(sq_to_id.values())
        for i in range(0, len(candidate_ids), 10000):
            conn.execute(text('DELETE FROM "CandidateAsset" WHERE candidate_id IN :ids'), {"ids": tuple(candidate_ids[i:i+10000])})
        conn.commit()

    for csv_path in asset_files:
        logger.info(f"Processando bens de {csv_path.name}...")
        try:
            # Lendo colunas específicas para performance
            df = pd.read_csv(
                csv_path, 
                sep=';', 
                encoding='latin1',
                usecols=['SQ_CANDIDATO', 'DS_TIPO_BEM_CANDIDATO', 'DS_BEM_CANDIDATO', 'VR_BEM_CANDIDATO']
            )
            
            # Normaliza o SQ_CANDIDATO para string
            df['sq_str'] = df['SQ_CANDIDATO'].astype(str)
            
            # Filtra apenas quem temos no banco
            df_active = df[df['sq_str'].isin(sq_to_id.keys())].copy()
            
            if not df_active.empty:
                data_to_insert = []
                for _, row in df_active.iterrows():
                    try:
                        valor = float(str(row['VR_BEM_CANDIDATO']).replace(',', '.'))
                    except:
                        valor = 0.0
                        
                    data_to_insert.append({
                        "id": str(uuid.uuid4()),
                        "candidate_id": sq_to_id[row['sq_str']],
                        "tipo": str(row['DS_TIPO_BEM_CANDIDATO']),
                        "desc": str(row['DS_BEM_CANDIDATO']),
                        "valor": valor
                    })
                
                if data_to_insert:
                    with engine.connect() as conn:
                        batch_size = 5000
                        for i in range(0, len(data_to_insert), batch_size):
                            conn.execute(text("""
                                INSERT INTO "CandidateAsset" (id, candidate_id, tipo_bem, descricao, valor)
                                VALUES (:id, :candidate_id, :tipo, :desc, :valor)
                            """), data_to_insert[i:i+batch_size])
                        conn.commit()
                        logger.info(f"  {len(data_to_insert)} bens inseridos de {csv_path.name}")
        except Exception as e:
            logger.error(f"Erro ao processar bens de {csv_path.name}: {e}")

    # Atualiza o patrimonio_total
    logger.info(f"Recalculando patrimônio total para 2022...")
    with engine.connect() as conn:
        conn.execute(text("""
            UPDATE "Candidate"
            SET patrimonio_total = COALESCE((
                SELECT SUM(valor) 
                FROM "CandidateAsset" 
                WHERE "CandidateAsset".candidate_id = "Candidate".id
            ), 0)
            WHERE ano_ultima_eleicao = 2022
        """))
        conn.commit()
    logger.info("Concluído!")

if __name__ == "__main__":
    fix_2022_assets()
