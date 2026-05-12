# Candidate Dossier Modal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the layout of the Candidate Dossier modal to prevent truncation and overlapping information.

**Architecture:** Increase modal width, replace rigid grids with flexible layouts, and remove forced text truncation in data-heavy tables.

**Tech Stack:** Next.js, Tailwind CSS, Lucide React, Radix UI.

---

### Task 1: Modal Shell and Identification Section

**Files:**
- Modify: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Increase Modal Width and Update Layout**

Change `DialogContent` max-width and refactor the identification grid to be more flexible.

```tsx
// Around line 62 in components/candidates/candidate-dossier.tsx
// Old: <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
// New:
<DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="flex items-center gap-2 text-2xl">
      <User className="h-6 w-6 text-primary" />
      Dossiê do Candidato
    </DialogTitle>
    <DialogDescription>
      Informações detalhadas sobre {candidate.nome_completo}
    </DialogDescription>
  </DialogHeader>

  <div className="grid gap-8 py-4">
    {/* Basic Info with Photo */}
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-56 h-72 relative rounded-xl overflow-hidden border-4 border-white shadow-xl bg-muted flex-shrink-0">
        <Image 
          src={getPhotoUrl(candidate)} 
          alt={candidate.nome_urna}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 space-y-6 w-full">
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div className="min-w-[240px] flex-1">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Nome Completo</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {candidate.nome_completo}
            </p>
          </div>
          <div className="min-w-[200px]">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Nome de Urna</p>
            <p className="text-2xl font-black text-primary uppercase leading-none">
              {candidate.nome_urna}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">CPF / TSE ID</p>
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              {candidate.cpf} <span className="text-zinc-300 mx-1">|</span> {candidate.sq_candidato}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Partido / Cargo</p>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
              <span className="text-primary">{candidate.partido}</span> — {candidate.cargo}
            </p>
          </div>
          <div>
             <p className="text-xs font-bold uppercase text-zinc-400 mb-1">Localidade</p>
             <p className="text-base font-medium">{candidate.municipio} - {candidate.uf}</p>
          </div>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "style: improve dossier modal identification layout and width"
```

---

### Task 2: Financial Assets Table and Performance Grid

**Files:**
- Modify: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Remove Truncation and Improve Performance Grid**

Modify the table cells to allow wrapping and adjust the performance grid for better legibility.

```tsx
// Financial Assets Section
// Around line 130
<div className="space-y-4">
  <div className="flex items-center gap-2 border-b pb-2">
    <Wallet className="h-5 w-5 text-primary" />
    <h3 className="text-lg font-semibold">Patrimônio Declarado</h3>
  </div>
  {/* ... (total assets box) */}
  {candidate.assets && candidate.assets.length > 0 ? (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
          <TableRow>
            <TableHead className="font-bold w-[200px]">Tipo de Bem</TableHead>
            <TableHead className="font-bold">Descrição</TableHead>
            <TableHead className="text-right font-bold w-[140px]">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidate.assets.map((asset) => (
            <TableRow key={asset.id} className="hover:bg-zinc-50/50">
              <TableCell className="font-medium align-top">{asset.tipo_bem}</TableCell>
              <TableCell className="whitespace-normal break-words py-3 leading-relaxed">
                {asset.descricao}
              </TableCell>
              <TableCell className="text-right font-semibold align-top">
                {formatCurrency(asset.valor)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (/* ... */)}
</div>

// Electoral Performance Section
// Around line 175
<div className="space-y-4">
  <div className="flex items-center gap-2 border-b pb-2">
    <FileText className="h-5 w-5 text-primary" />
    <h3 className="text-lg font-semibold">Desempenho Eleitoral ({candidate.ano_ultima_eleicao})</h3>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Performance cards - ensure p-5 and responsive gap */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Total de Votos</p>
      <p className="text-3xl font-black text-blue-800 dark:text-blue-300">
        {candidate.total_votos?.toLocaleString() ?? 0}
      </p>
    </div>
    {/* ... Repeat for other cards with same p-5 and font-black classes */}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "style: remove truncation from asset descriptions and polish performance grid"
```

---

### Task 3: Final Polish and Footer Actions

**Files:**
- Modify: `components/candidates/candidate-dossier.tsx`

- [ ] **Step 1: Adjust Section Spacing and Footer**

Increase gaps and ensure actions are properly spaced.

```tsx
// Final sections gap
<div className="grid gap-10 py-4"> {/* Increased from gap-6/gap-8 */}
  {/* Identification */}
  {/* Assets */}
  {/* Performance */}
  {/* Social Media */}
</div>

// Actions Section
<div className="flex flex-wrap justify-end gap-3 pt-6 border-t mt-4">
  {/* Buttons... */}
</div>
```

- [ ] **Step 2: Verify and Commit**

```bash
git add components/candidates/candidate-dossier.tsx
git commit -m "style: final polish of dossier modal spacing"
```
