import os
import pandas as pd
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

EXTRACT_DIR = Path("./shared-data/tmp/extracted")

def fix_votes_for_year(year, engine):
    logger.info(f"--- Iniciando Correção de Votos (Sem Duplicidade): {year} ---")
    
    # Localiza arquivos de votação
    # EVITAMOS o arquivo BRASIL.csv se existirem arquivos por estado, ou vice-versa, para não somar duas vezes.
    # A melhor estratégia é usar APENAS os arquivos de estados individuais.
    vote_files = list(EXTRACT_DIR.glob(f"votacao_candidato_munzona_{year}_*.csv"))
    
    # Filtro crítico: Se houver arquivos por estado, ignoramos o "BRASIL.csv" para não duplicar
    state_files = [f for f in vote_files if "BRASIL.csv" not in f.name]
    
    if state_files:
        logger.info(f"Encontrados {len(state_files)} arquivos de estado. Ignorando arquivo BRASIL (se existir) para evitar duplicidade.")
        files_to_process = state_files
    else:
        files_to_process = vote_files # Usa o que tiver (provavelmente apenas o BRASIL)

    if not files_to_process:
        logger.warning(f"Nenhum arquivo de votação encontrado para {year}")
        return

    # Agregador global para o ano
    total_votes_agg = {}
    
    for csv_path in files_to_process:
        logger.info(f"Lendo {csv_path.name}...")
        try:
            # Lendo colunas necessárias
            df = pd.read_csv(
                csv_path, 
                sep=';', 
                encoding='latin1', 
                usecols=['SQ_CANDIDATO', 'QT_VOTOS_NOMINAIS']
            )
            
            # Agregação no arquivo
            aggregated = df.groupby('SQ_CANDIDATO')['QT_VOTOS_NOMINAIS'].sum()
            
            # Merge com o agregador total
            for sq, val in aggregated.items():
                sq_str = str(int(sq))
                total_votes_agg[sq_str] = total_votes_agg.get(sq_str, 0) + int(val)
                
        except Exception as e:
            logger.error(f"Erro ao ler {csv_path.name}: {e}")

    logger.info(f"Consolidação concluída. {len(total_votes_agg)} candidatos únicos processados.")

    # Injeção no banco
    if total_votes_agg:
        with engine.connect() as conn:
            # Primeiro, zeramos os votos do ano para garantir que o novo valor seja absoluto (não incremental)
            logger.info(f"Zerando votos de {year} no banco para recalcular...")
            conn.execute(text('UPDATE "Candidate" SET total_votos = 0 WHERE ano_ultima_eleicao = :year'), {"year": year})
            
            conn.execute(text("CREATE TEMPORARY TABLE temp_fix_votes (sq TEXT, votes INTEGER) ON COMMIT DROP"))
            
            data = [{"sq": sq, "votes": val} for sq, val in total_votes_agg.items()]
            
            # Inserção em massa na temp table
            batch_size = 10000
            for i in range(0, len(data), batch_size):
                conn.execute(text("INSERT INTO temp_fix_votes (sq, votes) VALUES (:sq, :votes)"), data[i:i+batch_size])
            
            # Update absoluto
            result = conn.execute(text("""
                UPDATE "Candidate" 
                SET total_votos = temp_fix_votes.votes 
                FROM temp_fix_votes 
                WHERE "Candidate".sq_candidato = temp_fix_votes.sq 
                AND "Candidate".ano_ultima_eleicao = :year
            """), {"year": year})
            
            conn.commit()
            logger.info(f"Banco de dados corrigido para {year}: {result.rowcount} registros atualizados.")

def run_fix():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    fix_votes_for_year(2024, engine)
    fix_votes_for_year(2022, engine)

if __name__ == "__main__":
    run_fix()
