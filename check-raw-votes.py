import pandas as pd
import os

def check_raw_votes():
    file_path = "shared-data/tmp/extracted/votacao_candidato_munzona_2024_PR.csv"
    print(f"Lendo arquivo: {file_path}")
    
    # SQ do Adan Lenharo: 160002139183
    sq_adan = 160002139183
    
    df = pd.read_csv(file_path, sep=';', encoding='latin1')
    adan_votes = df[df['SQ_CANDIDATO'] == sq_adan]
    
    print(f"Linhas encontradas para o SQ {sq_adan}: {len(adan_votes)}")
    print("Colunas de votos:")
    print(adan_votes[['NM_UE', 'NR_ZONA', 'QT_VOTOS_NOMINAIS']])
    
    total_pr = adan_votes['QT_VOTOS_NOMINAIS'].sum()
    print(f"Total de votos no arquivo PR: {total_pr}")
    
    # Check if BRASIL file exists and has the same data
    br_path = "shared-data/tmp/extracted/votacao_candidato_munzona_2024_BRASIL.csv"
    if os.path.exists(br_path):
        print(f"\nLendo arquivo BRASIL: {br_path}")
        # Only read needed columns for memory efficiency
        df_br = pd.read_csv(br_path, sep=';', encoding='latin1', usecols=['SQ_CANDIDATO', 'QT_VOTOS_NOMINAIS'])
        adan_br = df_br[df_br['SQ_CANDIDATO'] == sq_adan]
        print(f"Total de votos no arquivo BRASIL: {adan_br['QT_VOTOS_NOMINAIS'].sum()}")

if __name__ == "__main__":
    check_raw_votes()
