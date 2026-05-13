import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import uuid

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

EXTRACT_DIR = Path("./shared-data/tmp/extracted")

def import_candidates_fast(year, engine):
    logger.info(f"--- Importando Candidatos NOVOS: {year} ---")
    cand_files = list(EXTRACT_DIR.glob(f"consulta_cand_{year}_*.csv"))
    if not cand_files:
        logger.warning(f"Nenhum arquivo de candidato para {year}")
        return

    mapping = {
        'SQ_CANDIDATO': 'sq_candidato',
        'NM_CANDIDATO': 'nome_completo',
        'NM_URNA_CANDIDATO': 'nome_urna',
        'NR_TITULO_ELEITORAL_CANDIDATO': 'titulo_eleitor',
        'SG_PARTIDO': 'partido',
        'DS_CARGO': 'cargo',
        'SG_UF': 'uf',
        'NM_UE': 'municipio',
        'SG_UE': 'ue_id',
        'DS_SITUACAO_CANDIDATURA': 'situacao_candidatura'
    }

    for csv_path in cand_files:
        logger.info(f"Processando {csv_path.name}...")
        try:
            df = pd.read_csv(csv_path, sep=';', encoding='latin1')
            available_cols = [col for col in mapping.keys() if col in df.columns]
            df_filtered = df[available_cols].rename(columns={col: mapping[col] for col in available_cols})
            
            for target_col in mapping.values():
                if target_col not in df_filtered.columns:
                    df_filtered[target_col] = None

            df_filtered['titulo_eleitor'] = df_filtered['titulo_eleitor'].astype(str).str.zfill(12)
            df_filtered['sq_candidato'] = df_filtered['sq_candidato'].astype(str)
            df_filtered['ano_ultima_eleicao'] = year

            # Bulk insert using temporary table for speed
            data = df_filtered.to_dict('records')
            if data:
                with engine.connect() as conn:
                    conn.execute(text("""
                        CREATE TEMPORARY TABLE temp_cand_import (
                            sq_candidato TEXT, nome_completo TEXT, nome_urna TEXT, 
                            titulo_eleitor TEXT, partido TEXT, cargo TEXT, 
                            uf TEXT, municipio TEXT, ue_id TEXT, 
                            situacao_candidatura TEXT, ano_ultima_eleicao INTEGER
                        ) ON COMMIT DROP
                    """))
                    
                    batch_size = 5000
                    for i in range(0, len(data), batch_size):
                        conn.execute(text("""
                            INSERT INTO temp_cand_import 
                            (sq_candidato, nome_completo, nome_urna, titulo_eleitor, partido, cargo, uf, municipio, ue_id, situacao_candidatura, ano_ultima_eleicao)
                            VALUES (:sq_candidato, :nome_completo, :nome_urna, :titulo_eleitor, :partido, :cargo, :uf, :municipio, :ue_id, :situacao_candidatura, :ano_ultima_eleicao)
                        """), data[i:i+batch_size])
                    
                    # Protected upsert
                    conn.execute(text("""
                        INSERT INTO "Candidate" (id, sq_candidato, nome_completo, nome_urna, titulo_eleitor, partido, cargo, uf, municipio, ue_id, situacao_candidatura, ano_ultima_eleicao, "updatedAt")
                        SELECT MD5(random()::text || clock_timestamp()::text)::uuid, sq_candidato, nome_completo, nome_urna, titulo_eleitor, partido, cargo, uf, municipio, ue_id, situacao_candidatura, ano_ultima_eleicao, NOW()
                        FROM temp_cand_import
                        ON CONFLICT (titulo_eleitor) DO NOTHING
                    """))
                    conn.commit()
            logger.info(f"  {csv_path.name} concluído.")
        except Exception as e:
            logger.error(f"Erro em {csv_path.name}: {e}")

def run():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    for year in [2020, 2018]:
        import_candidates_fast(year, engine)

if __name__ == "__main__":
    run()
