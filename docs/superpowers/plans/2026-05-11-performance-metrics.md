# Performance Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate vote counts and campaign spending into candidate profiles and UI.

**Architecture:** Update DB schema, create complex ETL logic for vote/spending aggregation, and update UI components.

**Tech Stack:** Prisma, Python (Pandas/SQLAlchemy), React (Tailwind).

---

### Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add performance fields to Candidate model**

```prisma
model Candidate {
  // ... existing fields
  total_votos        Int      @default(0)
  total_despesas     Float    @default(0)
}
```

- [ ] **Step 2: Run migration**

Run: `npx prisma migrate dev --name add_performance_metrics`

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "db: add total_votos and total_despesas to candidate model"
```

---

### Task 2: Implement Vote and Spending Sync (ETL)

**Files:**
- Modify: `etl/sync_tse.py`

- [ ] **Step 1: Add logic to download and aggregate vote results**

- [ ] **Step 2: Add logic to download and aggregate campaign spending**

- [ ] **Step 3: Update Candidate records with aggregated totals**

- [ ] **Step 4: Commit**

```bash
git add etl/sync_tse.py
git commit -m "etl: implement aggregation for votes and campaign spending"
```

---

### Task 3: Update Candidate Table UI

**Files:**
- Modify: `components/candidates/candidate-table.tsx`

- [ ] **Step 1: Add Votos and Gastos badges to the identification column**

```tsx
<div className="flex gap-2 mt-1">
  {candidate.total_votos > 0 && (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
      🗳️ {candidate.total_votos.toLocaleString()} votos
    </span>
  )}
  {candidate.total_despesas > 0 && (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800">
      💸 Gasto: {(candidate.total_despesas / 1000).toFixed(0)}k
    </span>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-table.tsx
git commit -m "style: show votes and spending summary in candidate table"
```

---

### Task 4: Update Candidate Dossier UI

**Files:**
- Modify: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Implement "Desempenho Eleitoral" section**

- [ ] **Step 2: Calculate and display Cost per Vote**

- [ ] **Step 3: Commit**

```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "style: add electoral performance section to dossier"
```
