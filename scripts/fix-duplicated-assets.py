
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def fix_duplicate_assets():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return

    # Limpa o parâmetro ?schema= do DATABASE_URL para evitar erro no psycopg2
    if "?schema=" in db_url:
        db_url = db_url.split("?")[0]

    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            print("--- Iniciando limpeza de bens duplicados ---")
            
            # 1. Identificar duplicatas (mesmo candidato, tipo, descrição e valor)
            # Mantemos o ID 'mínimo' de cada grupo e removemos os outros
            find_duplicates_query = text('''
                SELECT candidate_id, tipo_bem, descricao, valor, COUNT(*) 
                FROM "CandidateAsset"
                GROUP BY candidate_id, tipo_bem, descricao, valor
                HAVING COUNT(*) > 1
            ''')
            
            duplicates = conn.execute(find_duplicates_query).fetchall()
            print(f"Encontrados {len(duplicates)} grupos de duplicatas.")

            if len(duplicates) > 0:
                delete_query = text('''
                    DELETE FROM "CandidateAsset" a
                    WHERE a.id NOT IN (
                        SELECT MIN(id)
                        FROM "CandidateAsset"
                        GROUP BY candidate_id, tipo_bem, descricao, valor
                    )
                ''')
                
                result = conn.execute(delete_query)
                conn.commit()
                print(f"Sucesso! Removidos {result.rowcount} registros duplicados.")
                
                # 2. Recalcular patrimônio total na tabela Candidate para 2024
                print("Recalculando patrimônio_total dos candidatos de 2024...")
                update_patrimonio = text('''
                    UPDATE "Candidate"
                    SET patrimonio_total = COALESCE((
                        SELECT SUM(valor) 
                        FROM "CandidateAsset" 
                        WHERE "CandidateAsset".candidate_id = "Candidate".id
                    ), 0)
                    WHERE ano_ultima_eleicao = 2024
                ''')
                conn.execute(update_patrimonio)
                conn.commit()
                print("Patrimônio total atualizado.")
            else:
                print("Nenhuma duplicata encontrada para remover.")

    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    fix_duplicate_assets()
