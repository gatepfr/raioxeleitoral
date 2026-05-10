import os
import requests
import zipfile
import logging
import pandas as pd
import uuid
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

DATA_DIR = Path(os.getenv("DATA_DIR", "./shared-data/tmp"))
EXTRACT_DIR = DATA_DIR / "extracted"

def setup_directories():
    """Create necessary directories for data storage."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)

def download_tse_data(year, category):
    """Download ZIP file from TSE URL for a specific year and category."""
    # Note: URLs vary by year and category. This is a simplified version.
    # For 2024: https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024.zip
    # For others, patterns change. We assume files are provided or we map them.
    base_url = "https://cdn.tse.jus.br/estatistica/sead/odsele"
    urls = {
        "candidates": f"{base_url}/consulta_cand/consulta_cand_{year}.zip",
        "assets": f"{base_url}/bem_candidato/bem_candidato_{year}.zip",
        "socials": f"{base_url}/rede_social_cand/rede_social_cand_{year}.zip"
    }
    
    url = urls.get(category)
    if not url:
        return None

    target_path = DATA_DIR / f"{category}_{year}.zip"
    
    if target_path.exists():
        logger.info(f"File {target_path} already exists, skipping download.")
        return target_path

    logger.info(f"Downloading {url}...")
    try:
        response = requests.get(url, stream=True, timeout=(5, 30))
        response.raise_for_status()
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
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
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    logger.info("Extraction complete")

def process_year(year, engine):
    """Process all files for a specific election year."""
    logger.info(f"--- Processing Election Year: {year} ---")
    
    # 1. Process Candidates
    cand_files = list(EXTRACT_DIR.glob(f"consulta_cand_{year}_*.csv"))
    if not cand_files:
        logger.warning(f"No candidate files for {year}")
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
        'NM_UE': 'municipio',
        'DS_SITUACAO_CANDIDATURA': 'situacao_candidatura'
    }

    for csv_path in cand_files:
        logger.info(f"Consolidating candidates from {csv_path.name}...")
        df = pd.read_csv(csv_path, sep=';', encoding='latin1')
        
        # Check which columns exist
        available_cols = [col for col in mapping.keys() if col in df.columns]
        actual_mapping = {col: mapping[col] for col in available_cols}
        
        # Prepare data
        df_filtered = df[available_cols].rename(columns=actual_mapping)
        
        # Add missing columns with None
        for target_col in mapping.values():
            if target_col not in df_filtered.columns:
                df_filtered[target_col] = None

        # Trim whitespace from string columns to fix sorting issues
        string_cols = ['nome_completo', 'nome_urna', 'partido', 'cargo', 'uf', 'municipio']
        for col in string_cols:
            if col in df_filtered.columns:
                df_filtered[col] = df_filtered[col].astype(str).str.strip()

        df_filtered['cpf'] = df_filtered['cpf'].astype(str).str.zfill(11)
        df_filtered['sq_candidato'] = df_filtered['sq_candidato'].astype(str)
        df_filtered['ano_ultima_eleicao'] = year
        df_filtered['updatedAt'] = pd.Timestamp.now()

        # UPSERT Logic using raw SQL for performance and CPF constraint
        # This will update the profile only if the election year is newer or same
        with engine.connect() as conn:
            for _, row in df_filtered.iterrows():
                conn.execute(text("""
                    INSERT INTO "Candidate" (id, sq_candidato, nome_completo, nome_urna, cpf, email_tse, partido, cargo, uf, municipio, situacao_candidatura, ano_ultima_eleicao, "updatedAt")
                    VALUES (:id, :sq_candidato, :nome_completo, :nome_urna, :cpf, :email_tse, :partido, :cargo, :uf, :municipio, :situacao_candidatura, :ano_ultima_eleicao, :updatedAt)
                    ON CONFLICT (cpf) DO UPDATE SET
                        sq_candidato = EXCLUDED.sq_candidato,
                        nome_completo = EXCLUDED.nome_completo,
                        nome_urna = EXCLUDED.nome_urna,
                        email_tse = EXCLUDED.email_tse,
                        partido = EXCLUDED.partido,
                        cargo = EXCLUDED.cargo,
                        uf = EXCLUDED.uf,
                        municipio = EXCLUDED.municipio,
                        situacao_candidatura = EXCLUDED.situacao_candidatura,
                        ano_ultima_eleicao = EXCLUDED.ano_ultima_eleicao,
                        "updatedAt" = EXCLUDED."updatedAt"
                    WHERE "Candidate".ano_ultima_eleicao <= EXCLUDED.ano_ultima_eleicao
                """), {**row.to_dict(), 'id': str(uuid.uuid4())})
            conn.commit()

    # 2. Process Assets (Only if it's the latest data for that candidate)
    asset_files = list(EXTRACT_DIR.glob(f"bem_candidato_{year}_*.csv"))
    for csv_path in asset_files:
        logger.info(f"Processing assets from {csv_path.name}...")
        df_assets = pd.read_csv(csv_path, sep=';', encoding='latin1')
        
        # We need to map SQ_CANDIDATO to Candidate.id
        # To ensure we only update assets if this is the newest election:
        # 1. Find candidates whose ano_ultima_eleicao == year
        # 2. Delete their old assets
        # 3. Insert new ones
        
        with engine.connect() as conn:
            # Get mapping of SQ -> ID for candidates from THIS year
            res = conn.execute(text('SELECT id, sq_candidato FROM "Candidate" WHERE ano_ultima_eleicao = :year'), {"year": year})
            sq_to_id = {row[1]: row[0] for row in res}
            
            # Filter assets for candidates we just updated/inserted
            df_assets['sq_candidato'] = df_assets['SQ_CANDIDATO'].astype(str)
            df_active_assets = df_assets[df_assets['sq_candidato'].isin(sq_to_id.keys())].copy()
            
            if not df_active_assets.empty:
                # Clear old assets for these candidates
                candidate_ids = list(sq_to_id.values())
                conn.execute(text('DELETE FROM "CandidateAsset" WHERE candidate_id IN :ids'), {"ids": tuple(candidate_ids)})
                
                # Insert new assets and track total
                totals = {}
                for _, row in df_active_assets.iterrows():
                    cid = sq_to_id[row['sq_candidato']]
                    
                    # Robust parsing for VR_BEM_CANDIDATO
                    raw_val = str(row['VR_BEM_CANDIDATO'])
                    try:
                        # TSE format: often uses comma for decimals
                        valor = float(raw_val.replace(',', '.'))
                    except (ValueError, TypeError):
                        valor = 0.0
                        
                    totals[cid] = totals.get(cid, 0) + valor
                    
                    conn.execute(text("""
                        INSERT INTO "CandidateAsset" (id, candidate_id, tipo_bem, descricao, valor)
                        VALUES (:id, :candidate_id, :tipo, :desc, :valor)
                    """), {
                        "id": str(uuid.uuid4()),
                        "candidate_id": cid,
                        "tipo": row['DS_TIPO_BEM_CANDIDATO'],
                        "desc": row['DS_BEM_CANDIDATO'],
                        "valor": valor
                    })
                
                # Update Candidate.patrimonio_total with the SUM of assets
                for cid, total in totals.items():
                    conn.execute(text('UPDATE "Candidate" SET patrimonio_total = :total WHERE id = :id'), {"total": total, "id": cid})
            conn.commit()

    # 3. Process Socials (Similar logic)
    social_files = list(EXTRACT_DIR.glob(f"rede_social_cand_{year}_*.csv"))
    for csv_path in social_files:
        logger.info(f"Processing socials from {csv_path.name}...")
        df_socials = pd.read_csv(csv_path, sep=';', encoding='latin1')
        
        with engine.connect() as conn:
            res = conn.execute(text('SELECT id, sq_candidato FROM "Candidate" WHERE ano_ultima_eleicao = :year'), {"year": year})
            sq_to_id = {row[1]: row[0] for row in res}
            
            df_socials['sq_candidato'] = df_socials['SQ_CANDIDATO'].astype(str)
            df_active_socials = df_socials[df_socials['sq_candidato'].isin(sq_to_id.keys())].copy()
            
            if not df_active_socials.empty:
                candidate_ids = list(sq_to_id.values())
                conn.execute(text('DELETE FROM "CandidateSocial" WHERE candidate_id IN :ids'), {"ids": tuple(candidate_ids)})
                
                for _, row in df_active_socials.iterrows():
                    conn.execute(text("""
                        INSERT INTO "CandidateSocial" (id, candidate_id, tipo_rede, url)
                        VALUES (:id, :candidate_id, :tipo, :url)
                    """), {
                        "id": str(uuid.uuid4()),
                        "candidate_id": sq_to_id[row['sq_candidato']],
                        "tipo": row['DS_TIPO_REDE_SOCIAL'],
                        "url": row['NM_URL_REDE_SOCIAL']
                    })
            conn.commit()

def run_full_sync():
    setup_directories()
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    # Years to process in order
    years = [2018, 2020, 2022, 2024]
    categories = ["candidates", "assets", "socials"]
    
    for year in years:
        logger.info(f"=== Starting Sync for {year} ===")
        for cat in categories:
            zip_path = download_tse_data(year, cat)
            if zip_path:
                extract_zip(zip_path, EXTRACT_DIR)
        
        process_year(year, engine)
        logger.info(f"=== Finished Sync for {year} ===")

if __name__ == "__main__":
    run_full_sync()
