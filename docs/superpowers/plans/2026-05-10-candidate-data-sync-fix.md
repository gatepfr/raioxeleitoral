# Candidate Data Sync and UI Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix candidate data linkage across elections using Voter ID (Título de Eleitor) and improve financial data display in UI.

**Architecture:** Update Prisma schema, refactor ETL script for Voter ID upsert, and update UI components for better data visibility.

**Tech Stack:** Prisma, Python (Pandas/SQLAlchemy), React (Tailwind).

---

### Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add titulo_eleitor and adjust unique constraints**

```prisma
model Candidate {
  id                   String            @id @default(uuid())
  sq_candidato         String
  nome_completo        String
  nome_urna            String
  cpf                  String            // Remove @unique
  titulo_eleitor       String            @unique // New unique key
  // ... rest of fields
}
```

- [ ] **Step 2: Run migration**

Run: `npx prisma migrate dev --name add_titulo_eleitor`

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "db: change unique key to titulo_eleitor to support masked CPFs"
```

---

### Task 2: Update ETL Sync Script

**Files:**
- Modify: `etl/sync_tse.py`

- [ ] **Step 1: Update mapping and UPSERT logic**

```python
# Update mapping
mapping = {
    'SQ_CANDIDATO': 'sq_candidato',
    'NM_CANDIDATO': 'nome_completo',
    'NM_URNA_CANDIDATO': 'nome_urna',
    'NR_CPF_CANDIDATO': 'cpf',
    'NR_TITULO_ELEITORAL_CANDIDATO': 'titulo_eleitor', # New
    'NM_EMAIL': 'email_tse',
    # ...
}

# Update SQL UPSERT
# Change ON CONFLICT (cpf) to ON CONFLICT (titulo_eleitor)
```

- [ ] **Step 2: Run sync for 2024 PR to verify fix (e.g. Rodolfo Mota)**

- [ ] **Step 3: Commit**

```bash
git add etl/sync_tse.py
git commit -m "etl: update sync logic to use titulo_eleitor as unique key"
```

---

### Task 3: Fix Candidate Dossier UI

**Files:**
- Modify: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Update display logic and labels**

```tsx
// Use candidate.patrimonio_total directly
const displayValue = candidate.patrimonio_total;

// Update labels to "Bens Declarados"
// Remove assets table
// Add election year to header
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "style: rename to Bens Declarados and simplify dossier layout"
```

---

### Task 4: Update Candidate Table (Election Year)

**Files:**
- Modify: `components/candidates/candidate-table.tsx`

- [ ] **Step 1: Add election year to candidate info column**

```tsx
<div className="text-xs text-zinc-500 uppercase tracking-tight font-medium flex gap-2">
  <span>{candidate.partido}</span>
  <span>•</span>
  <span className="text-blue-600 dark:text-blue-400">Eleição {candidate.ano_ultima_eleicao}</span>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-table.tsx
git commit -m "style: show last election year in candidate table"
```
