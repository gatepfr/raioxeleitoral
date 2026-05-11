# Candidate Table Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the candidate table to a more compact, two-line layout with highlighted financial data ("Bens Declarados").

**Architecture:** Refactor the `CandidateTable` component to consolidate columns and use nested flex/grid layouts within rows for better information grouping.

**Tech Stack:** React, Tailwind CSS, Lucide React, Shadcn UI (Table).

---

### Task 1: Refactor Table Headers and Column Structure

**Files:**
- Modify: `components/candidates/candidate-table.tsx`

- [ ] **Step 1: Simplify table headers to 3 main columns**

```tsx
<TableHeader>
  <TableRow>
    <TableHead 
      className="cursor-pointer hover:bg-zinc-50 transition-colors"
      onClick={() => onSort("nome_urna")}
    >
      <div className="flex items-center">
        Candidato / Info Financeira
        {renderSortIcon("nome_urna")}
      </div>
    </TableHead>
    <TableHead 
      className="cursor-pointer hover:bg-zinc-50 transition-colors"
      onClick={() => onSort("cargo")}
    >
      <div className="flex items-center">
        Atuação / Localidade
        {renderSortIcon("cargo")}
      </div>
    </TableHead>
    <TableHead className="text-right">Ações</TableHead>
  </TableRow>
</TableHeader>
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-table.tsx
git commit -m "style: consolidate table headers for new layout"
```

---

### Task 2: Implement Multi-line Row Content

**Files:**
- Modify: `components/candidates/candidate-table.tsx`

- [ ] **Step 1: Refactor TableBody to use the new information grouping**

```tsx
<TableBody>
  {candidates.map((candidate) => (
    <TableRow key={candidate.id} className="group hover:bg-zinc-50/50">
      <TableCell className="py-4">
        <div className="flex flex-col gap-1.5">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">
            {candidate.nome_urna}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-tight font-medium">
            {candidate.partido}
          </div>
          <div className="mt-1 flex">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              Bens Declarados: {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(candidate.patrimonio_total)}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {candidate.cargo}
          </div>
          <div className="text-xs text-zinc-500">
            {candidate.municipio} - {candidate.uf}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {/* Keep existing buttons but ensure they are aligned */}
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDossier(candidate)}
          >
            Dossiê
          </Button>
          {/* ... existing capture/crm logic ... */}
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
```

- [ ] **Step 2: Verify alignment and styles**

Check if the "Bens Declarados" tag looks good and if the candidate name is prominent.

- [ ] **Step 3: Commit**

```bash
git add components/candidates/candidate-table.tsx
git commit -m "style: implement two-line table row with highlighted asset tag"
```
