# Filter Bar 3-Line Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the FilterBar into 3 distinct lines for better grouping and usability.

**Architecture:** Refactor the JSX structure of `FilterBar` to use multiple grid rows within a flex column container.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Refactor FilterBar Layout

**Files:**
- Modify: `components/candidates/filter-bar.tsx`

- [ ] **Step 1: Replace the current grid with 3 separate rows**

```tsx
<form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border shadow-sm space-y-8">
  <div className="flex flex-col gap-6">
    {/* Linha 1: Localização */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado (UF)</label>
        {/* ... Select UF ... */}
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Município</label>
        {/* ... Select Município ... */}
      </div>
    </div>

    {/* Linha 2: Identificação */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome na Urna</label>
        <Input
          placeholder="Ex: Tiririca"
          value={nomeUrna}
          onChange={(e) => setNomeUrna(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Partido</label>
        <Input
          placeholder="Ex: PT, PL, MDB"
          value={partido}
          onChange={(e) => setPartido(e.target.value.toUpperCase())}
        />
      </div>
    </div>

    {/* Linha 3: Financeiro */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min. Bens Declarados</label>
        <Input
          type="number"
          placeholder="Min R$"
          value={minPatrimonio}
          onChange={(e) => setMinPatrimonio(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Max. Bens Declarados</label>
        <Input
          type="number"
          placeholder="Max R$"
          value={maxPatrimonio}
          onChange={(e) => setMaxPatrimonio(e.target.value)}
        />
      </div>
    </div>
  </div>

  <div className="flex justify-end pt-4 border-t border-border/50">
    <Button type="submit" size="lg" className="w-full md:w-auto flex items-center gap-2 px-8">
      <Search className="h-4 w-4" />
      Filtrar Candidatos
    </Button>
  </div>
</form>
```

- [ ] **Step 2: Verify visual alignment and responsiveness**

- [ ] **Step 3: Commit**

```bash
git add components/candidates/filter-bar.tsx
git commit -m "style: reorganize filter bar into 3 distinct lines"
```
