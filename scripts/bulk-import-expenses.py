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

def import_expenses_for_year(year, engine):
    logger.info(f"--- Iniciando Importação de Gastos: {year} ---")
    
    # Localiza arquivos de despesas contratadas
    expense_files = list(EXTRACT_DIR.glob(f"despesas_contratadas_candidatos_{year}_*.csv"))
    if not expense_files:
        logger.warning(f"Nenhum arquivo de despesa encontrado para {year}")
        return

    # Ordem de processamento: estados menores primeiro, BRASIL por último
    expense_files.sort(key=lambda x: os.path.getsize(x))
    
    for csv_path in expense_files:
        start_time = time.time()
        logger.info(f"Processando {csv_path.name} ({os.path.getsize(csv_path) / (1024*1024):.2f} MB)...")
        
        # Agregador local para o arquivo
        expenses_agg = {}
        
        try:
            # Lendo em chunks para economizar memória (especialmente para o arquivo de 2.6GB)
            chunk_iter = pd.read_csv(
                csv_path, 
                sep=';', 
                encoding='latin1', 
                usecols=['SQ_CANDIDATO', 'VR_DESPESA_CONTRATADA'],
                chunksize=100000
            )
            
            for chunk in chunk_iter:
                # Limpeza e conversão
                chunk['VR_DESPESA_CONTRATADA'] = chunk['VR_DESPESA_CONTRATADA'].astype(str).str.replace(',', '.').astype(float)
                
                # Agregação no chunk
                aggregated = chunk.groupby('SQ_CANDIDATO')['VR_DESPESA_CONTRATADA'].sum()
                
                # Merge com o agregador total do arquivo
                for sq, val in aggregated.items():
                    sq_str = str(int(sq))
                    expenses_agg[sq_str] = expenses_agg.get(sq_str, 0.0) + val
            
            logger.info(f"  Consolidação concluída. {len(expenses_agg)} candidatos únicos encontrados.")
            
            # Injeção no banco usando tabela temporária para performance
            if expenses_agg:
                with engine.connect() as conn:
                    conn.execute(text("CREATE TEMPORARY TABLE temp_expenses (sq TEXT, val FLOAT) ON COMMIT DROP"))
                    
                    # Prepara dados para inserção em massa
                    data = [{"sq": sq, "val": val} for sq, val in expenses_agg.items()]
                    
                    # Insere na temp table (em lotes de 10k para estabilidade da query)
                    batch_size = 10000
                    for i in range(0, len(data), batch_size):
                        conn.execute(text("INSERT INTO temp_expenses (sq, val) VALUES (:sq, :val)"), data[i:i+batch_size])
                    
                    # Update massivo baseado no SQ_CANDIDATO e ANO
                    result = conn.execute(text("""
                        UPDATE "Candidate" 
                        SET total_despesas = total_despesas + temp_expenses.val 
                        FROM temp_expenses 
                        WHERE "Candidate".sq_candidato = temp_expenses.sq 
                        AND "Candidate".ano_ultima_eleicao = :year
                    """), {"year": year})
                    
                    conn.commit()
                    logger.info(f"  Banco de dados atualizado: {result.rowcount} registros afetados.")
            
            duration = time.time() - start_time
            logger.info(f"--- Concluído {csv_path.name} em {duration:.2f}s ---")
            
        except Exception as e:
            logger.error(f"Erro ao processar {csv_path.name}: {e}")

def run_import():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL não encontrada no .env")
        return
        
    engine = create_engine(db_url)
    
    # Processa todos os anos na sequência
    for year in [2024, 2022, 2020, 2018]:
        import_expenses_for_year(year, engine)

if __name__ == "__main__":
    run_import()
