# Iceberg CRM - Candidates Dashboard UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the main dashboard interface for candidate prospecting, featuring a powerful data table, advanced filters, and a detailed dossier view.

**Architecture:** Client-side data fetching for the table to allow for dynamic filtering. Components will be organized by responsibility (Filters, Table, Dossier).

**Tech Stack:** Next.js (App Router), shadcn/ui, Lucide Icons, TanStack Table (implied by shadcn), React.

---

### Task 1: Icon Library & Types Setup
**Files:**
- Create: `types/index.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Lucide React for icons**
Run: `npm install lucide-react`

- [ ] **Step 2: Define Candidate and related types**
```typescript
export interface Asset {
  id: string;
  tipo_bem: string;
  descricao: string;
  valor: number;
}

export interface Social {
  id: string;
  tipo_rede: string;
  url: string;
}

export interface Candidate {
  id: string;
  sq_candidato: string;
  nome_completo: string;
  nome_urna: string;
  cpf: string;
  email_tse: string | null;
  partido: string;
  cargo: string;
  uf: string;
  municipio: string;
  situacao_candidatura: string;
  assets: Asset[];
  socials: Social[];
}
```

- [ ] **Step 3: Commit**
```bash
git add package.json types/index.ts
git commit -m "chore: setup icons and shared types"
```

---

### Task 2: Candidate Data Table Component
**Files:**
- Create: `components/candidates/candidate-table.tsx`

- [ ] **Step 1: Build the table component using shadcn UI primitives**
Implement a table that receives a list of candidates and displays: Nome de Urna, Partido, Cargo, UF/Município.

- [ ] **Step 2: Add "Action" button to open Dossier**
Include a button in each row to trigger the detail modal.

- [ ] **Step 3: Commit**
```bash
git add components/candidates/candidate-table.tsx
git commit -m "feat: add candidate table component"
```

---

### Task 3: "Gold" Filter Bar
**Files:**
- Create: `components/candidates/filter-bar.tsx`

- [ ] **Step 1: Implement the filter bar with inputs for UF and Municipio**
Use shadcn `Input` and `Button` components.

- [ ] **Step 2: Add callback logic for parent state update**
The component should notify the parent page when filters change.

- [ ] **Step 3: Commit**
```bash
git add components/candidates/filter-bar.tsx
git commit -m "feat: add filter bar component"
```

---

### Task 4: Candidate Dossier Modal
**Files:**
- Create: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Create a modal using shadcn Dialog**
Display all details: full name, CPF, total assets (calculated), and list of socials.

- [ ] **Step 2: Format currency for assets**
Use `Intl.NumberFormat` for BRL currency.

- [ ] **Step 3: Commit**
```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "feat: add candidate dossier modal"
```

---

### Task 5: Main Prospecting Page Assembly
**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Integrate FilterBar and CandidateTable**
Handle fetching state and error handling. Use `useEffect` to fetch from `/api/candidates`.

- [ ] **Step 2: Final Polish**
Add a loading skeleton or simple message.

- [ ] **Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "feat: assemble main prospecting dashboard"
```
