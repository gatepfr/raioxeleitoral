# Iceberg CRM - Foundation & ETL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup the core infrastructure (Docker, PostgreSQL, Prisma) and implement the Python-based ETL pipeline (Data Hunter) to ingest TSE data.

**Architecture:** Dockerized microservices consisting of a PostgreSQL database, a Python ETL engine, and a Next.js application. Data flows from TSE (via Python) -> Postgres -> Next.js.

**Tech Stack:** Docker, PostgreSQL 16, Python 3.11, Pandas, SQLAlchemy, Node.js, Prisma, Next.js.

---

### Task 1: Docker Infrastructure & Database
**Files:**
- Create: `docker-compose.yml`
- Create: `.env`

- [ ] **Step 1: Create .env file with database credentials**
```env
DATABASE_URL="postgresql://admin:admin123@db:5432/iceberg_db?schema=public"
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=iceberg_db
```

- [ ] **Step 2: Create docker-compose.yml**
```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    container_name: iceberg-db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  etl:
    build: ./etl
    container_name: iceberg-etl
    volumes:
      - ./etl:/app
      - ./shared-data:/data
    environment:
      DATABASE_URL: ${DATABASE_URL}
    depends_on:
      - db

volumes:
  postgres_data:
```

- [ ] **Step 3: Verify infrastructure boots up**
Run: `docker-compose up -d db`
Expected: Container `iceberg-db` is running.

- [ ] **Step 4: Commit**
```bash
git add docker-compose.yml .env
git commit -m "infra: setup docker-compose and postgres"
```

---

### Task 2: Prisma Schema Definition
**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Define the database schema based on PRD**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Candidate {
  id                  String            @id @default(uuid())
  sq_candidato        String            @unique
  nome_completo       String
  nome_urna           String
  cpf                 String
  email_tse           String?
  partido             String
  cargo               String
  uf                  String
  municipio           String
  situacao_candidatura String
  assets              CandidateAsset[]
  socials             CandidateSocial[]
  lead                Lead?
  updatedAt           DateTime          @updatedAt
}

model CandidateAsset {
  id           String    @id @default(uuid())
  candidate_id String
  candidate    Candidate @relation(fields: [candidate_id], references: [id])
  tipo_bem     String
  descricao    String
  valor        Float
}

model CandidateSocial {
  id           String    @id @default(uuid())
  candidate_id String
  candidate    Candidate @relation(fields: [candidate_id], references: [id])
  tipo_rede    String
  url          String
}

model Lead {
  id                   String           @id @default(uuid())
  candidate_id         String           @unique
  candidate            Candidate        @relation(fields: [candidate_id], references: [id])
  status               String           @default("PROSPECT") // PROSPECT, CONTATADO, REUNIAO, PROPOSTA, FECHADO, PERDIDO
  vendedor_responsavel String?
  valor_contrato       Float?
  data_proxima_acao    DateTime?
  interactions         Interaction[]
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
}

model Interaction {
  id            String   @id @default(uuid())
  lead_id       String
  lead          Lead     @relation(fields: [lead_id], references: [id])
  anotacao      String
  tipo_contato  String   // WHATSAPP, CALL, MEETING
  data_registro DateTime @default(now())
}
```

- [ ] **Step 2: Commit**
```bash
git add prisma/schema.prisma
git commit -m "db: define initial prisma schema"
```

---

### Task 3: ETL Setup & Data Hunter (Stage 1)
**Files:**
- Create: `etl/requirements.txt`
- Create: `etl/Dockerfile`
- Create: `etl/sync_tse.py`

- [ ] **Step 1: Create requirements.txt**
```text
pandas
sqlalchemy
psycopg2-binary
requests
python-dotenv
```

- [ ] **Step 2: Create etl/Dockerfile**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "sync_tse.py"]
```

- [ ] **Step 3: Implement minimal sync_tse.py (Download logic)**
```python
import requests
import zipfile
import os

def download_tse_data(url, target_path):
    print(f"Downloading {url}...")
    response = requests.get(url)
    with open(target_path, "wb") as f:
        f.write(response.content)
    print("Done.")

def extract_zip(zip_path, extract_to):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

if __name__ == "__main__":
    # URL de exemplo (Candidatos 2024 - Consulta)
    url = "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024.zip"
    os.makedirs("/data/tmp", exist_ok=True)
    download_tse_data(url, "/data/tmp/cand.zip")
    extract_zip("/data/tmp/cand.zip", "/data/tmp/extracted")
```

- [ ] **Step 4: Build and run test sync**
Run: `docker-compose build etl && docker-compose run etl`
Expected: Files extracted in `./shared-data/tmp/extracted`.

- [ ] **Step 5: Commit**
```bash
git add etl/
git commit -m "etl: setup python environment and basic download logic"
```

---

### Task 4: ETL Transformation & Carga (Stage 2 & 3)
**Files:**
- Modify: `etl/sync_tse.py`

- [ ] **Step 1: Implement Pandas transformation and SQL Alchemy load**
```python
import pandas as pd
from sqlalchemy import create_engine
import os

def load_to_db(df, table_name, engine):
    df.to_sql(table_name, engine, if_exists='append', index=False)

def process_candidates(csv_path, engine):
    df = pd.read_csv(csv_path, sep=';', encoding='latin1')
    # Mapeamento simplificado conforme schema
    mapping = {
        'SQ_CANDIDATO': 'sq_candidato',
        'NM_CANDIDATO': 'nome_completo',
        'NM_URNA_CANDIDATO': 'nome_urna',
        'NR_CPF_CANDIDATO': 'cpf',
        'NM_EMAIL': 'email_tse',
        'SG_PARTIDO': 'partido',
        'DS_CARGO': 'cargo',
        'SG_UF': 'uf',
        'NM_MUNICIPIO': 'municipio',
        'DS_SITUACAO_CANDIDATURA': 'situacao_candidatura'
    }
    df_clean = df[mapping.keys()].rename(columns=mapping)
    df_clean['id'] = [str(pd.util.hash_pandas_object(row)) for _, row in df_clean.iterrows()] # Provisório
    load_to_db(df_clean, 'Candidate', engine)

# Integrar no main...
```

- [ ] **Step 2: Run full ETL test**
Run: `docker-compose run etl`
Expected: Data present in `Candidate` table in Postgres.

- [ ] **Step 3: Commit**
```bash
git add etl/sync_tse.py
git commit -m "etl: implement data transformation and database load"
```
