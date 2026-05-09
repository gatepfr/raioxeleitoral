import os
import requests
import zipfile
import logging
from pathlib import Path
from dotenv import load_dotenv

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
            # Delete ZIP file after successful extraction to save space
            if zip_file.exists():
                zip_file.unlink()
                logger.info(f"Deleted {zip_file} to save space.")
        else:
            logger.error("ETL Stage 1: FAILED (No files found)")
            
    except Exception as e:
        logger.error(f"Error during ETL: {e}")
        exit(1)
