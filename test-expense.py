import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

def test_expense_mapping():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    
    file_path = "shared-data/tmp/extracted/despesas_contratadas_candidatos_2024_AC.csv"
    print(f"Lendo arquivo: {file_path}")
    
    try:
        df = pd.read_csv(file_path, sep=';', encoding='latin1', nrows=100)
        print("Colunas encontradas:", df.columns.tolist())
        
        if 'SQ_CANDIDATO' in df.columns and 'VR_DESPESA_CONTRATADA' in df.columns:
            print("Colunas SQ_CANDIDATO e VR_DESPESA_CONTRATADA presentes.")
            sample_val = df['VR_DESPESA_CONTRATADA'].iloc[0]
            print(f"Exemplo de valor: {sample_val} (tipo: {type(sample_val)})")
            
            # Test conversion
            val_float = float(str(sample_val).replace(',', '.'))
            print(f"Valor convertido: {val_float}")
        else:
            print("Colunas esperadas NÃO encontradas!")
            
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    test_expense_mapping()
