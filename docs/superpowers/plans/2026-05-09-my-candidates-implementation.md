# Iceberg CRM - 'My Candidates' Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a private candidate repository ("My Candidates") for the agency, supporting manual registration and intelligent capture from TSE data.

**Architecture:** Full-stack update using Prisma for the new `MyCandidate` model. The `Lead` model will now reference `MyCandidate` instead of the public `Candidate`.

**Tech Stack:** Next.js, Prisma, shadcn/ui (Form, Input, Dialog, DataTable), Tailwind CSS.

---

### Task 1: Schema Update & Migration
**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add MyCandidate model and update Lead model**
```prisma
model MyCandidate {
  id               String      @id @default(uuid())
  nome             String
  cpf              String?
  email            String?
  telefone         String
  uf               String
  municipio        String
  cargo            String
  origem_indicacao String?
  rede_social      String?
  tipo_origem      String      @default("MANUAL") // TSE, MANUAL
  tse_id           String?     // Link to Candidate.sq_candidato if from TSE
  lead             Lead?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

// Update Lead model to reference MyCandidate
model Lead {
  id                   String       @id @default(uuid())
  my_candidate_id      String       @unique
  my_candidate         MyCandidate  @relation(fields: [my_candidate_id], references: [id])
  status               String       @default("PROSPECT")
  vendedor_responsavel String?
  valor_contrato       Float?
  data_proxima_acao    DateTime?
  interactions         Interaction[]
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt
}
```

- [ ] **Step 2: Run Prisma DB Push**
Run: `$env:DATABASE_URL="postgresql://admin:admin123@localhost:5432/iceberg_db" ; npx prisma db push`
Expected: Database updated with new tables and relations.

- [ ] **Step 3: Commit**
```bash
git add prisma/schema.prisma
git commit -m "db: update schema to support MyCandidate"
```

---

### Task 2: Backend API for My Candidates
**Files:**
- Create: `app/api/my-candidates/route.ts`

- [ ] **Step 1: Implement GET and POST for My Candidates**
Include logic to create a Lead automatically when a MyCandidate is created.

- [ ] **Step 2: Commit**
```bash
git add app/api/my-candidates/route.ts
git commit -m "feat: add my-candidates crud api"
```

---

### Task 3: Intelligent Capture Logic
**Files:**
- Modify: `app/api/leads/route.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update Lead creation to copy data from TSE**
When capturing a TSE candidate, first create a `MyCandidate` entry with copied data, then link the `Lead`.

- [ ] **Step 2: Commit**
```bash
git add app/api/leads/route.ts app/page.tsx
git commit -m "feat: implement intelligent copy-from-tse capture"
```

---

### Task 4: 'My Candidates' Dashboard Page
**Files:**
- Create: `app/my-candidates/page.tsx`
- Create: `components/my-candidates/my-candidate-table.tsx`

- [ ] **Step 1: Build the Hot List table**
Display Name, Phone, Email, and Location. Add filters for UF/Município.

- [ ] **Step 2: Add navigation to sidebar/header**

- [ ] **Step 3: Commit**
```bash
git add app/my-candidates/ components/my-candidates/
git commit -m "feat: create my-candidates list page"
```

---

### Task 5: Manual Registration Form
**Files:**
- Create: `components/my-candidates/add-candidate-dialog.tsx`

- [ ] **Step 1: Create the manual entry form using shadcn Form/Dialog**
Fields: Nome, Telefone, Email, UF, Município, Cargo, CPF, Origem, Rede Social.

- [ ] **Step 2: Integrate with My Candidates page**

- [ ] **Step 3: Commit**
```bash
git add components/my-candidates/add-candidate-dialog.tsx
git commit -m "feat: add manual lead registration form"
```

---

### Task 6: Kanban Integration Update
**Files:**
- Modify: `app/api/leads/route.ts`
- Modify: `components/crm/kanban-card.tsx`

- [ ] **Step 1: Update Kanban fetching and cards**
Ensure the Kanban board now pulls data from `Lead` -> `MyCandidate`.

- [ ] **Step 2: Commit**
```bash
git add app/api/leads/route.ts components/crm/kanban-card.tsx
git commit -m "feat: update kanban to use my-candidate data"
```
