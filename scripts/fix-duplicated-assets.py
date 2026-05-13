
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
                print("Iniciando limpeza rápida via tabela temporária...")
                # 0. Limpar tabela temporária anterior se existir
                conn.execute(text('DROP TABLE IF EXISTS "CandidateAsset_temp"'))
                
                # 1. Criar tabela temporária com dados únicos
                create_temp = text('''
                    CREATE TABLE "CandidateAsset_temp" AS
                    SELECT DISTINCT ON (candidate_id, tipo_bem, descricao, valor)
                        id, candidate_id, tipo_bem, descricao, valor
                    FROM "CandidateAsset"
                    ORDER BY candidate_id, tipo_bem, descricao, valor, id ASC
                ''')
                conn.execute(create_temp)
                print("Tabela temporária criada.")

                # 2. Truncar a tabela original
                conn.execute(text('TRUNCATE TABLE "CandidateAsset"'))
                print("Tabela original truncada.")

                # 3. Inserir dados limpos de volta
                conn.execute(text('INSERT INTO "CandidateAsset" (id, candidate_id, tipo_bem, descricao, valor) SELECT id, candidate_id, tipo_bem, descricao, valor FROM "CandidateAsset_temp"'))
                print("Dados limpos restaurados.")

                # 4. Remover tabela temporária
                conn.execute(text('DROP TABLE "CandidateAsset_temp"'))
                conn.commit()
                print("Tabela temporária removida e alterações confirmadas.")
                
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
