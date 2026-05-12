import requests
import os
from pathlib import Path

def download_expenses():
    url = "https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_2024.zip"
    target = Path("shared-data/tmp/expenses_2024.zip")
    
    if target.exists():
        target.unlink()
        
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print(f"Baixando despesas de 2024 de: {url}")
    try:
        with requests.get(url, stream=True, headers=headers, timeout=60) as r:
            r.raise_for_status()
            with open(target, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024*1024): # 1MB chunks
                    if chunk:
                        f.write(chunk)
                        print(".", end="", flush=True)
        print("\nDownload concluído com sucesso!")
        
        # Extração
        import zipfile
        extract_to = Path("shared-data/tmp/extracted")
        print(f"Extraindo para {extract_to}...")
        with zipfile.ZipFile(target, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print("Extração concluída!")
        
    except Exception as e:
        print(f"\nErro no download/extração: {e}")

if __name__ == "__main__":
    download_expenses()
