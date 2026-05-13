import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

EXTRACT_DIR = Path("./shared-data/tmp/extracted")

def import_candidates_only_new(year, engine):
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
        logger.info(f"Lendo {csv_path.name}...")
        df = pd.read_csv(csv_path, sep=';', encoding='latin1')
        
        available_cols = [col for col in mapping.keys() if col in df.columns]
        df_filtered = df[available_cols].rename(columns={col: mapping[col] for col in available_cols})
        
        # Garante colunas mínimas
        for target_col in mapping.values():
            if target_col not in df_filtered.columns:
                df_filtered[target_col] = None

        df_filtered['titulo_eleitor'] = df_filtered['titulo_eleitor'].astype(str).str.zfill(12)
        df_filtered['sq_candidato'] = df_filtered['sq_candidato'].astype(str)
        df_filtered['ano_ultima_eleicao'] = year

        data = df_filtered.to_dict('records')
        
        with engine.connect() as conn:
            # Inserção com proteção: Se o Título já existe, NÃO FAZ NADA (mantém o dado mais recente de 2024)
            for row in data:
                conn.execute(text("""
                    INSERT INTO "Candidate" (id, sq_candidato, nome_completo, nome_urna, titulo_eleitor, partido, cargo, uf, municipio, ue_id, situacao_candidatura, ano_ultima_eleicao, "updatedAt")
                    VALUES (:id, :sq_candidato, :nome_completo, :nome_urna, :titulo_eleitor, :partido, :cargo, :uf, :municipio, :ue_id, :situacao_candidatura, :ano_ultima_eleicao, NOW())
                    ON CONFLICT (titulo_eleitor) DO NOTHING
                """), {**row, 'id': str(uuid.uuid4())})
            conn.commit()
            logger.info(f"  Processamento de {csv_path.name} concluído.")

def run_historical_import():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    # Processa 2020 (Municipal) e 2018 (Federal/Estadual)
    # Importante: O script usa ON CONFLICT DO NOTHING para não mexer em quem já está no banco
    for year in [2020, 2018]:
        import_candidates_only_new(year, engine)
    
    logger.info("Importação de Candidatos Históricos (2020/2018) concluída.")

if __name__ == "__main__":
    run_historical_import()
