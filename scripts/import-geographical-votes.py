import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import uuid
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

EXTRACT_DIR = Path("./shared-data/tmp/extracted")

def get_candidate_mapping(year, engine):
    logger.info(f"Carregando mapa de candidatos para {year}...")
    with engine.connect() as conn:
        res = conn.execute(text('SELECT id, sq_candidato FROM "Candidate" WHERE ano_ultima_eleicao = :year'), {"year": year})
        return {str(row[1]): row[0] for row in res}

def import_geographical_votes(year, engine):
    logger.info(f"--- Iniciando Importação de Votos por Cidade: {year} ---")
    sq_to_id = get_candidate_mapping(year, engine)
    
    if not sq_to_id:
        logger.warning(f"Nenhum candidato de {year} encontrado no banco.")
        return

    vote_files = list(EXTRACT_DIR.glob(f"votacao_candidato_munzona_{year}_*.csv"))
    state_files = [f for f in vote_files if "BRASIL.csv" not in f.name]
    
    files_to_process = state_files if state_files else vote_files
    
    if not files_to_process:
        logger.warning(f"Nenhum arquivo de votação encontrado para {year}")
        return

    for csv_path in files_to_process:
        logger.info(f"Processando {csv_path.name}...")
        try:
            # Lendo colunas: SQ_CANDIDATO, NM_MUNICIPIO, QT_VOTOS_NOMINAIS
            df = pd.read_csv(
                csv_path, 
                sep=';', 
                encoding='latin1', 
                usecols=['SQ_CANDIDATO', 'NM_MUNICIPIO', 'QT_VOTOS_NOMINAIS']
            )
            
            # Agrega votos por candidato e cidade (zona eleitoral não importa aqui)
            df_grouped = df.groupby(['SQ_CANDIDATO', 'NM_MUNICIPIO'])['QT_VOTOS_NOMINAIS'].sum().reset_index()
            
            df_grouped['sq_str'] = df_grouped['SQ_CANDIDATO'].astype(str)
            df_active = df_grouped[df_grouped['sq_str'].isin(sq_to_id.keys())].copy()
            
            if not df_active.empty:
                data_to_insert = []
                for _, row in df_active.iterrows():
                    data_to_insert.append({
                        "id": str(uuid.uuid4()),
                        "candidate_id": sq_to_id[row['sq_str']],
                        "municipio": str(row['NM_MUNICIPIO']),
                        "votos": int(row['QT_VOTOS_NOMINAIS'])
                    })
                
                if data_to_insert:
                    with engine.connect() as conn:
                        batch_size = 5000
                        for i in range(0, len(data_to_insert), batch_size):
                            conn.execute(text("""
                                INSERT INTO "CandidateVote" (id, candidate_id, municipio, votos)
                                VALUES (:id, :candidate_id, :municipio, :votos)
                            """), data_to_insert[i:i+batch_size])
                        conn.commit()
                        logger.info(f"  {len(data_to_insert)} registros de votos inseridos de {csv_path.name}")
        except Exception as e:
            logger.error(f"Erro ao processar {csv_path.name}: {e}")

def run():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    # Limpa tabela para re-importação limpa
    with engine.connect() as conn:
        logger.info("Limpando tabela de votos por cidade...")
        conn.execute(text('DELETE FROM "CandidateVote"'))
        conn.commit()

    # Processa os anos históricos (onde votos por cidade é mais relevante)
    for year in [2022, 2018]:
        import_geographical_votes(year, engine)
    
    logger.info("Importação Geográfica concluída!")

if __name__ == "__main__":
    run()
