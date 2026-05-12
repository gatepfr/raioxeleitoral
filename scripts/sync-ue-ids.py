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

def sync_ue_ids():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    years = [2024, 2022]
    
    for year in years:
        logger.info(f"--- Sincronizando UE IDs para {year} ---")
        cand_files = list(EXTRACT_DIR.glob(f"consulta_cand_{year}_*.csv"))
        
        for csv_path in cand_files:
            logger.info(f"Processando {csv_path.name}...")
            df = pd.read_csv(csv_path, sep=';', encoding='latin1', usecols=['SQ_CANDIDATO', 'SG_UE'])
            
            # Remove duplicatas de SQ_CANDIDATO para ser mais rápido
            df = df.drop_duplicates(subset=['SQ_CANDIDATO'])
            
            data = [{"sq": str(int(r['SQ_CANDIDATO'])), "ue": str(r['SG_UE'])} for _, r in df.iterrows()]
            
            if data:
                with engine.connect() as conn:
                    conn.execute(text("CREATE TEMPORARY TABLE temp_ue (sq TEXT, ue TEXT) ON COMMIT DROP"))
                    
                    batch_size = 5000
                    for i in range(0, len(data), batch_size):
                        conn.execute(text("INSERT INTO temp_ue (sq, ue) VALUES (:sq, :ue)"), data[i:i+batch_size])
                    
                    result = conn.execute(text("""
                        UPDATE "Candidate" 
                        SET ue_id = temp_ue.ue 
                        FROM temp_ue 
                        WHERE "Candidate".sq_candidato = temp_ue.sq 
                        AND "Candidate".ano_ultima_eleicao = :year
                    """), {"year": year})
                    
                    conn.commit()
                    logger.info(f"  {result.rowcount} registros atualizados em {csv_path.name}")

if __name__ == "__main__":
    sync_ue_ids()
