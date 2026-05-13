
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def fix_name_spaces():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return

    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            print("--- Iniciando limpeza de espaços nos nomes ---")
            
            # 1. Verifica quantos nomes têm espaços sobrando
            check_query = text('''
                SELECT COUNT(*) FROM "Candidate" 
                WHERE nome_urna != TRIM(nome_urna) 
                OR nome_completo != TRIM(nome_completo)
            ''')
            count = conn.execute(check_query).scalar()
            print(f"Registros com espaços detectados: {count}")

            if count > 0:
                # 2. Executa o TRIM em todos os campos de texto importantes
                update_query = text('''
                    UPDATE "Candidate"
                    SET 
                        nome_urna = TRIM(nome_urna),
                        nome_completo = TRIM(nome_completo),
                        partido = TRIM(partido),
                        cargo = TRIM(cargo),
                        municipio = TRIM(municipio)
                    WHERE 
                        nome_urna != TRIM(nome_urna) 
                        OR nome_completo != TRIM(nome_completo)
                        OR partido != TRIM(partido)
                        OR cargo != TRIM(cargo)
                        OR municipio != TRIM(municipio)
                ''')
                
                result = conn.execute(update_query)
                conn.commit()
                print(f"Sucesso! {result.rowcount} registros foram corrigidos.")
            else:
                print("Nenhum registro precisou de correção de espaços.")

    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    fix_name_spaces()
