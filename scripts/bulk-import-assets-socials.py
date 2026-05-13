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
        return {row[1]: row[0] for row in res}

def import_assets(year, engine, sq_to_id):
    logger.info(f"--- Iniciando Importação de BENS: {year} ---")
    asset_files = list(EXTRACT_DIR.glob(f"bem_candidato_{year}_*.csv"))
    if not asset_files:
        logger.warning(f"Nenhum arquivo de bens encontrado para {year}")
        return

    # Limpa bens existentes para o ano para evitar duplicatas se rodar de novo
    if sq_to_id:
        with engine.connect() as conn:
            logger.info("Limpando bens antigos para re-importação limpa...")
            candidate_ids = list(sq_to_id.values())
            # Deletando em lotes de 10k para evitar erro de limite de parâmetros
            for i in range(0, len(candidate_ids), 10000):
                conn.execute(text('DELETE FROM "CandidateAsset" WHERE candidate_id IN :ids'), {"ids": tuple(candidate_ids[i:i+10000])})
            conn.commit()

    for csv_path in asset_files:
        logger.info(f"Processando bens de {csv_path.name}...")
        try:
            df = pd.read_csv(csv_path, sep=';', encoding='latin1')
            df['sq_candidato'] = df['SQ_CANDIDATO'].astype(str)
            
            # Filtra apenas bens de candidatos que temos no banco
            df_active = df[df['sq_candidato'].isin(sq_to_id.keys())].copy()
            
            if not df_active.empty:
                data_to_insert = []
                for _, row in df_active.iterrows():
                    try:
                        valor = float(str(row['VR_BEM_CANDIDATO']).replace(',', '.'))
                    except:
                        valor = 0.0
                        
                    data_to_insert.append({
                        "id": str(uuid.uuid4()),
                        "candidate_id": sq_to_id[row['sq_candidato']],
                        "tipo": str(row['DS_TIPO_BEM_CANDIDATO']),
                        "desc": str(row['DS_BEM_CANDIDATO']),
                        "valor": valor
                    })
                
                if data_to_insert:
                    with engine.connect() as conn:
                        batch_size = 5000
                        for i in range(0, len(data_to_insert), batch_size):
                            # Usamos um sub-select para evitar duplicatas baseadas nos campos de negócio
                            # Como a tabela não tem uma constraint UNIQUE composta, fazemos a checagem no INSERT
                            conn.execute(text("""
                                INSERT INTO "CandidateAsset" (id, candidate_id, tipo_bem, descricao, valor)
                                SELECT :id, :candidate_id, :tipo, :desc, :valor
                                WHERE NOT EXISTS (
                                    SELECT 1 FROM "CandidateAsset" 
                                    WHERE candidate_id = :candidate_id 
                                    AND tipo_bem = :tipo 
                                    AND descricao = :desc 
                                    AND valor = :valor
                                )
                            """), data_to_insert[i:i+batch_size])
                        conn.commit()
                        logger.info(f"  Processamento de lotes concluído para {csv_path.name}")
        except Exception as e:
            logger.error(f"Erro ao processar bens de {csv_path.name}: {e}")

def import_socials(year, engine, sq_to_id):
    logger.info(f"--- Iniciando Importação de REDES SOCIAIS: {year} ---")
    social_files = list(EXTRACT_DIR.glob(f"rede_social_cand*_{year}_*.csv"))
    if not social_files:
        social_files = list(EXTRACT_DIR.glob(f"rede_social_candidato_{year}_*.csv"))

    if sq_to_id:
        with engine.connect() as conn:
            logger.info("Limpando redes sociais antigas...")
            candidate_ids = list(sq_to_id.values())
            for i in range(0, len(candidate_ids), 10000):
                conn.execute(text('DELETE FROM "CandidateSocial" WHERE candidate_id IN :ids'), {"ids": tuple(candidate_ids[i:i+10000])})
            conn.commit()

    for csv_path in social_files:
        logger.info(f"Processando redes sociais de {csv_path.name}...")
        try:
            df = pd.read_csv(csv_path, sep=';', encoding='latin1')
            df['sq_candidato'] = df['SQ_CANDIDATO'].astype(str)
            
            # Detecta colunas (2024 vs 2022)
            url_col = 'DS_URL' if 'DS_URL' in df.columns else 'NM_URL_REDE_SOCIAL'
            type_col = 'DS_TIPO_REDE_SOCIAL' if 'DS_TIPO_REDE_SOCIAL' in df.columns else None

            # Remove duplicatas exatas no próprio arquivo para evitar falha no batch
            df = df.drop_duplicates(subset=['sq_candidato', url_col])

            df_active = df[df['sq_candidato'].isin(sq_to_id.keys())].copy()
            
            if not df_active.empty:
                data_to_insert = []
                for _, row in df_active.iterrows():
                    url = str(row[url_col])
                    
                    if type_col and pd.notna(row[type_col]):
                        tipo = str(row[type_col])
                    else:
                        # Infer tipo pela URL
                        u = url.lower()
                        if 'instagram' in u: tipo = 'INSTAGRAM'
                        elif 'facebook' in u: tipo = 'FACEBOOK'
                        elif 'twitter' in u or 'x.com' in u: tipo = 'X / TWITTER'
                        elif 'youtube' in u: tipo = 'YOUTUBE'
                        elif 'tiktok' in u: tipo = 'TIKTOK'
                        else: tipo = 'OUTRO'

                    data_to_insert.append({
                        "id": str(uuid.uuid4()),
                        "candidate_id": sq_to_id[row['sq_candidato']],
                        "tipo": tipo,
                        "url": url
                    })

                if data_to_insert:
                    with engine.connect() as conn:
                        batch_size = 5000
                        for i in range(0, len(data_to_insert), batch_size):
                            conn.execute(text("""
                                INSERT INTO "CandidateSocial" (id, candidate_id, tipo_rede, url)
                                VALUES (:id, :candidate_id, :tipo, :url)
                                ON CONFLICT (candidate_id, url) DO NOTHING
                            """), data_to_insert[i:i+batch_size])
                        conn.commit()
                        logger.info(f"  {len(data_to_insert)} redes sociais inseridas de {csv_path.name}")
        except Exception as e:
            logger.error(f"Erro ao processar redes sociais de {csv_path.name}: {e}")

def run_import():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    # Processa todos os anos na sequência correta
    for year in [2024, 2022, 2020, 2018]:
        sq_to_id = get_candidate_mapping(year, engine)
        if sq_to_id:
            import_assets(year, engine, sq_to_id)
            import_socials(year, engine, sq_to_id)
            
            # Atualiza o patrimônio_total na tabela Candidate baseada na soma dos bens inseridos
            logger.info(f"Recalculando patrimônio total para {year}...")
            with engine.connect() as conn:
                conn.execute(text("""
                    UPDATE "Candidate"
                    SET patrimonio_total = COALESCE((
                        SELECT SUM(valor) 
                        FROM "CandidateAsset" 
                        WHERE "CandidateAsset".candidate_id = "Candidate".id
                    ), 0)
                    WHERE ano_ultima_eleicao = :year
                """), {"year": year})
                conn.commit()
                logger.info(f"Patrimônio total atualizado para {year}.")

if __name__ == "__main__":
    run_import()
