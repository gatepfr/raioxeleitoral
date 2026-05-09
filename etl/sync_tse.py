import os
import requests
import zipfile
import logging
import pandas as pd
import uuid
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

TSE_URL = os.getenv("TSE_URL", "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024.zip")
DATA_DIR = Path(os.getenv("DATA_DIR", "/data/tmp"))
EXTRACT_DIR = DATA_DIR / "extracted"

def setup_directories():
    """Create necessary directories for data storage."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)

def download_tse_data(url, target_path):
    """Download ZIP file from TSE URL."""
    logger.info(f"Downloading {url}...")
    response = requests.get(url, stream=True, timeout=(5, 30))
    response.raise_for_status()
    with open(target_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    logger.info(f"Downloaded to {target_path}")

def extract_zip(zip_path, extract_to):
    """Extract ZIP file to target directory."""
    logger.info(f"Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    logger.info("Extraction complete")

def verify_extraction(extract_to):
    """Verify if files were extracted."""
    files = list(Path(extract_to).glob("*"))
    logger.info(f"Found {len(files)} files in {extract_to}")
    return len(files) > 0

def transform_and_load(extract_dir):
    """Read CSV, transform data and load into database."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL not found in environment")
        return

    # Create engine
    engine = create_engine(db_url)
    
    # Find candidate CSV files
    csv_files = list(Path(extract_dir).glob("consulta_cand_2024_*.csv"))
    
    if not csv_files:
        logger.error(f"No candidate CSV files found in {extract_dir}")
        return

    # Mapping from TSE CSV to Prisma Schema
    mapping = {
        'SQ_CANDIDATO': 'sq_candidato',
        'NM_CANDIDATO': 'nome_completo',
        'NM_URNA_CANDIDATO': 'nome_urna',
        'NR_CPF_CANDIDATO': 'cpf',
        'NM_EMAIL': 'email_tse',
        'SG_PARTIDO': 'partido',
        'DS_CARGO': 'cargo',
        'SG_UF': 'uf',
        'NM_MUNICIPIO': 'municipio',
        'DS_SITUACAO_CANDIDATURA': 'situacao_candidatura'
    }

    for csv_path in csv_files:
        logger.info(f"Processing {csv_path.name}...")
        
        try:
            # TSE CSVs use semicolon and latin1
            df = pd.read_csv(csv_path, sep=';', encoding='latin1')
            
            # Check if it's the right file by looking for SQ_CANDIDATO
            if 'SQ_CANDIDATO' not in df.columns:
                logger.info(f"Skipping {csv_path.name} (SQ_CANDIDATO column not found)")
                continue
                
            # Filter and rename
            cols_to_use = [col for col in mapping.keys() if col in df.columns]
            df_filtered = df[cols_to_use].copy()
            df_filtered.rename(columns=mapping, inplace=True)
            
            # Data cleaning
            df_filtered['sq_candidato'] = df_filtered['sq_candidato'].astype(str)
            df_filtered['cpf'] = df_filtered['cpf'].astype(str)
            
            # Generate UUIDs for new records
            df_filtered['id'] = [str(uuid.uuid4()) for _ in range(len(df_filtered))]
            
            logger.info(f"Loading {len(df_filtered)} records into database...")
            
            # Load to temporary table
            df_filtered.to_sql('temp_candidates', engine, if_exists='replace', index=False)
            
            with engine.begin() as conn:
                # Upsert query (PostgreSQL specific)
                upsert_query = text("""
                INSERT INTO "Candidate" (id, sq_candidato, nome_completo, nome_urna, cpf, email_tse, partido, cargo, uf, municipio, situacao_candidatura, "updatedAt")
                SELECT 
                    id, 
                    sq_candidato, 
                    nome_completo, 
                    nome_urna, 
                    cpf, 
                    email_tse, 
                    partido, 
                    cargo, 
                    uf, 
                    municipio, 
                    situacao_candidatura,
                    NOW()
                FROM temp_candidates
                ON CONFLICT (sq_candidato) DO UPDATE SET
                    nome_completo = EXCLUDED.nome_completo,
                    nome_urna = EXCLUDED.nome_urna,
                    cpf = EXCLUDED.cpf,
                    email_tse = EXCLUDED.email_tse,
                    partido = EXCLUDED.partido,
                    cargo = EXCLUDED.cargo,
                    uf = EXCLUDED.uf,
                    municipio = EXCLUDED.municipio,
                    situacao_candidatura = EXCLUDED.situacao_candidatura,
                    "updatedAt" = NOW();
                """)
                conn.execute(upsert_query)
                conn.execute(text("DROP TABLE temp_candidates"))
                
            logger.info(f"Successfully processed {csv_path.name}")
            
        except Exception as e:
            logger.error(f"Error processing {csv_path.name}: {e}")

def verify_load():
    """Verify if data was loaded into the database."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return
    
    engine = create_engine(db_url)
    try:
        with engine.connect() as conn:
            result = conn.execute(text('SELECT COUNT(*) FROM "Candidate"'))
            count = result.scalar()
            logger.info(f"Verification: Found {count} candidates in database.")
            return count
    except Exception as e:
        logger.error(f"Verification failed: {e}")
        return 0

if __name__ == "__main__":
    try:
        setup_directories()
        zip_file = DATA_DIR / "consulta_cand_2024.zip"
        
        # Only download if it doesn't exist to save time/bandwidth during dev
        if not zip_file.exists():
            download_tse_data(TSE_URL, zip_file)
        else:
            logger.info(f"File {zip_file} already exists, skipping download.")
            
        extract_zip(zip_file, EXTRACT_DIR)
        
        if verify_extraction(EXTRACT_DIR):
            logger.info("ETL Stage 1: DONE")
            
            # Stage 2 & 3: Transform and Load
            transform_and_load(EXTRACT_DIR)
            logger.info("ETL Stage 2 & 3: DONE")
            
            # Verification
            verify_load()
            
            # Cleanup
            if zip_file.exists():
                zip_file.unlink()
                logger.info(f"Deleted {zip_file} to save space.")
        else:
            logger.error("ETL Stage 1: FAILED (No files found)")
            
    except Exception as e:
        logger.error(f"Error during ETL: {e}")
        exit(1)
