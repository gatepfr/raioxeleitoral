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

load_dotenv()

DATA_DIR = Path("./shared-data/tmp")
EXTRACT_DIR = DATA_DIR / "extracted"

def download_tse_data(year, category):
    """Download ZIP file from TSE URL for a specific year and category."""
    base_url = "https://cdn.tse.jus.br/estatistica/sead/odsele"
    
    # URL patterns based on historical consistency
    urls = {
        "candidates": f"{base_url}/consulta_cand/consulta_cand_{year}.zip",
        "assets": f"{base_url}/bem_candidato/bem_candidato_{year}.zip",
        "socials": f"{base_url}/consulta_cand/rede_social_candidato_{year}.zip",
        "votes": f"{base_url}/votacao_candidato_munzona/votacao_candidato_munzona_{year}.zip",
        "expenses": f"{base_url}/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_{year}.zip"
    }
    
    url = urls.get(category)
    if not url:
        return None

    target_path = DATA_DIR / f"{category}_{year}.zip"
    
    if target_path.exists() and target_path.stat().st_size > 1024:
        logger.info(f"File {target_path} already exists, skipping download.")
        return target_path

    logger.info(f"Downloading {url}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, stream=True, timeout=(10, 60), headers=headers)
        response.raise_for_status()
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024*1024): # 1MB chunks
                if chunk:
                    f.write(chunk)
        logger.info(f"Downloaded to {target_path}")
        return target_path
    except Exception as e:
        logger.error(f"Failed to download {url}: {e}")
        return None

def extract_zip(zip_path, extract_to):
    """Extract ZIP file to target directory."""
    if not zip_path: return
    logger.info(f"Extracting {zip_path} to {extract_to}...")
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        logger.info(f"Extraction of {zip_path.name} complete.")
    except Exception as e:
        logger.error(f"Failed to extract {zip_path}: {e}")

def run_download_2020():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
    
    year = 2020
    categories = ["candidates", "assets", "socials", "votes", "expenses"]
    
    for cat in categories:
        logger.info(f"--- Iniciando 2020: {cat} ---")
        zip_path = download_tse_data(year, cat)
        if zip_path:
            extract_zip(zip_path, EXTRACT_DIR)

if __name__ == "__main__":
    run_download_2020()
