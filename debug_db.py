
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def check_db():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in .env")
        return

    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            count = conn.execute(text('SELECT COUNT(*) FROM "CandidateSocial"')).scalar()
            print(f"Total Social Records: {count}")
            
            if count > 0:
                res = conn.execute(text('''
                    SELECT c.nome_urna, c.ano_ultima_eleicao, s.tipo_rede, s.url 
                    FROM "CandidateSocial" s 
                    JOIN "Candidate" c ON s.candidate_id = c.id 
                    LIMIT 5
                '''))
                print("\nExamples:")
                for row in res:
                    print(f"- [{row[1]}] {row[0]}: {row[2]} -> {row[3]}")
            else:
                print("No records found in CandidateSocial table.")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    check_db()
