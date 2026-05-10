# Filtros Avançados de Prospecção Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement advanced filters for candidate prospecting, including state/municipality dropdowns (IBGE data) and ballot name search.

**Architecture:** Create a server-side proxy for IBGE data with caching, update the candidate search API, and refactor the frontend filter bar to use interactive dropdowns.

**Tech Stack:** Next.js (App Router), Prisma, Tailwind CSS, Lucide React.

---

### Task 1: Create Locations API Proxy

**Files:**
- Create: `app/api/locations/route.ts`

- [ ] **Step 1: Create the API route with IBGE integration and simple cache**

```typescript
import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, any>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'states' or 'cities'
  const uf = searchParams.get("uf");

  const cacheKey = `${type}-${uf || ""}`;
  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }

  try {
    let url = "";
    if (type === "states") {
      url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
    } else if (type === "cities" && uf) {
      url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`;
    } else {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    // Map to a simpler format
    const result = data.map((item: any) => ({
      id: item.id,
      nome: item.nome,
      sigla: item.sigla || item.id // 'sigla' for states, 'id' for cities
    }));

    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from IBGE" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify the API manually**

Run: `curl "http://localhost:3000/api/locations?type=states"`
Expected: JSON list of Brazilian states.

Run: `curl "http://localhost:3000/api/locations?type=cities&uf=SP"`
Expected: JSON list of municipalities in SP.

- [ ] **Step 3: Commit**

```bash
git add app/api/locations/route.ts
git commit -m "feat: add locations api proxy for IBGE data"
```

---

### Task 2: Update Candidate Search API

**Files:**
- Modify: `app/api/candidates/route.ts`

- [ ] **Step 1: Update API to support `nomeUrna` parameter**

```typescript
// Inside GET function in app/api/candidates/route.ts
const nomeUrna = searchParams.get("nomeUrna");

// Update where clause
const where: any = {
  ...(uf && { uf: { equals: uf, mode: 'insensitive' } }),
  ...(municipio && { municipio: { equals: municipio, mode: 'insensitive' } }),
  ...(nomeUrna && { nome_urna: { contains: nomeUrna, mode: 'insensitive' } }), // New filter
  ...(cargo && { cargo: { contains: cargo, mode: 'insensitive' } }),
  // ... rest of the filters
}
```

- [ ] **Step 2: Verify the new filter**

Run: `curl "http://localhost:3000/api/candidates?nomeUrna=TESTE"`
Expected: List of candidates containing "TESTE" in their ballot name.

- [ ] **Step 3: Commit**

```bash
git add app/api/candidates/route.ts
git commit -m "feat: support nomeUrna filter in candidates api"
```

---

### Task 3: Refactor FilterBar (States Dropdown)

**Files:**
- Modify: `components/candidates/filter-bar.tsx`

- [ ] **Step 1: Update state and fetch states on mount**

```typescript
// Inside FilterBar component
const [states, setStates] = useState<{sigla: string, nome: string}[]>([]);
const [nomeUrna, setNomeUrna] = useState(""); // New state

useEffect(() => {
  fetch("/api/locations?type=states")
    .then(res => res.json())
    .then(data => setStates(data));
}, []);

// Update interface
interface FilterBarProps {
  onSearch: (filters: { 
    uf: string; 
    municipio: string;
    partido: string;
    nomeUrna: string; // New
    minPatrimonio: string;
    maxPatrimonio: string;
  }) => void;
}
```

- [ ] **Step 2: Replace UF Input with Select**

```tsx
<div class="space-y-2">
  <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">UF</label>
  <select 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    value={uf}
    onChange={(e) => {
      setUf(e.target.value);
      setMunicipio(""); // Reset city when UF changes
    }}
  >
    <option value="">Selecione...</option>
    {states.map(s => (
      <option key={s.sigla} value={s.sigla}>{s.sigla} - {s.nome}</option>
    ))}
  </select>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add components/candidates/filter-bar.tsx
git commit -m "feat: replace UF input with dropdown"
```

---

### Task 4: Refactor FilterBar (Cities Dropdown)

**Files:**
- Modify: `components/candidates/filter-bar.tsx`

- [ ] **Step 1: Fetch cities when UF changes**

```typescript
const [cities, setCities] = useState<{nome: string}[]>([]);

useEffect(() => {
  if (uf) {
    fetch(`/api/locations?type=cities&uf=${uf}`)
      .then(res => res.json())
      .then(data => setCities(data));
  } else {
    setCities([]);
  }
}, [uf]);
```

- [ ] **Step 2: Replace Municipio Input with Select**

```tsx
<div class="space-y-2 lg:col-span-2">
  <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Município</label>
  <select 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    value={municipio}
    onChange={(e) => setMunicipio(e.target.value)}
    disabled={!uf}
  >
    <option value="">{uf ? "Selecione o município..." : "Selecione uma UF primeiro"}</option>
    {cities.map(c => (
      <option key={c.nome} value={c.nome}>{c.nome}</option>
    ))}
  </select>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add components/candidates/filter-bar.tsx
git commit -m "feat: replace municipality input with dropdown"
```

---

### Task 5: Add Ballot Name Filter to UI

**Files:**
- Modify: `components/candidates/filter-bar.tsx`
- Modify: `app/page.tsx` (to pass the new filter)

- [ ] **Step 1: Add Nome de Urna field to FilterBar**

```tsx
<div className="space-y-2">
  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome de Urna</label>
  <Input
    placeholder="Ex: João da Silva"
    value={nomeUrna}
    onChange={(e) => setNomeUrna(e.target.value)}
  />
</div>
```

- [ ] **Step 2: Update handleSubmit in FilterBar**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSearch({ 
    uf, 
    municipio,
    partido,
    nomeUrna, // Pass the new value
    minPatrimonio,
    maxPatrimonio
  });
};
```

- [ ] **Step 3: Commit**

```bash
git add components/candidates/filter-bar.tsx
git commit -m "feat: add ballot name filter to UI"
```
