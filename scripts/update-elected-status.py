import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

EXTRACT_DIR = Path(os.getenv("DATA_DIR", "./shared-data/tmp")) / "extracted"

def update_elected_status():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    years = [2024, 2022, 2020, 2018]
    
    for year in years:
        logger.info(f"--- Updating Elected Status for {year} ---")
        cand_files = list(EXTRACT_DIR.glob(f"consulta_cand_{year}_*.csv"))
        
        if not cand_files:
            logger.warning(f"No candidate files found for {year} in {EXTRACT_DIR}")
            continue
            
        for csv_path in cand_files:
            logger.info(f"Processing {csv_path.name}...")
            try:
                # Read only needed columns to save memory
                df = pd.read_csv(csv_path, sep=';', encoding='latin1', 
                                 usecols=['SQ_CANDIDATO', 'DS_SIT_TOT_TURNO'])
                
                df['SQ_CANDIDATO'] = df['SQ_CANDIDATO'].astype(str)
                df['DS_SIT_TOT_TURNO'] = df['DS_SIT_TOT_TURNO'].astype(str).str.strip()
                
                with engine.connect() as conn:
                    # Use temporary table for batch update
                    conn.execute(text("CREATE TEMPORARY TABLE temp_status (sq TEXT, status TEXT) ON COMMIT DROP"))
                    
                    data = [{"sq": r['SQ_CANDIDATO'], "status": r['DS_SIT_TOT_TURNO']} 
                            for _, r in df.iterrows()]
                    
                    conn.execute(text("INSERT INTO temp_status (sq, status) VALUES (:sq, :status)"), data)
                    
                    result = conn.execute(text("""
                        UPDATE "Candidate" 
                        SET situacao_totalizacao = temp_status.status 
                        FROM temp_status 
                        WHERE "Candidate".sq_candidato = temp_status.sq 
                        AND "Candidate".ano_ultima_eleicao = :year
                    """), {"year": year})
                    
                    conn.commit()
                    logger.info(f"  Updated {result.rowcount} candidates from {csv_path.name}")
                    
            except Exception as e:
                logger.error(f"Error processing {csv_path.name}: {e}")

if __name__ == "__main__":
    update_elected_status()
