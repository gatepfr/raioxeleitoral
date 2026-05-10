# Iceberg CRM UI Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Executive Command" aesthetic update across the Iceberg CRM interface.

**Architecture:** We will update the global font to Inter, modify Tailwind CSS variables for a dark navy sidebar and icy blue accents, and create a reusable layout wrapper to apply this structure to all pages.

**Tech Stack:** Next.js (App Router), Tailwind CSS, shadcn/ui, Lucide Icons.

---

### Task 1: Update Global Typography

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update font imports and configuration in `app/layout.tsx`**

Replace `Geist` and `Geist_Mono` with `Inter`.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iceberg CRM", // Update title
  description: "Prospecção Política Inteligente",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR" // Update lang
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "style: update global font to Inter"
```

### Task 2: Update Tailwind Theme Variables

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update CSS variables for "Executive Command" aesthetic in `app/globals.css`**

Replace the existing `:root` and `.dark` variables with the new palette.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter); /* Update font-sans mapping */
  --font-heading: var(--font-inter);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  /* Iceberg Light Theme */
  --background: oklch(0.98 0 0); /* zinc-50 */
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  
  /* Icy Blue Primary */
  --primary: oklch(0.55 0.15 250); /* Custom Ice Blue */
  --primary-foreground: oklch(0.985 0 0);
  
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.55 0.15 250);
  
  --radius: 0.5rem;
  
  /* Deep Navy Sidebar */
  --sidebar: oklch(0.15 0.05 250); /* slate-950 equivalent with blue tint */
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.55 0.15 250);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.25 0.05 250); /* Lighter navy for hover */
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.25 0.05 250);
  --sidebar-ring: oklch(0.55 0.15 250);
}

.dark {
  /* Iceberg Dark Theme */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  
  --primary: oklch(0.65 0.15 250); /* Lighter Ice Blue for dark mode */
  --primary-foreground: oklch(0.145 0 0);
  
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.65 0.15 250);
  
  /* Sidebar dark */
  --sidebar: oklch(0.1 0.02 250);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.65 0.15 250);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.2 0.02 250);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.65 0.15 250);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: update tailwind theme variables to Executive Command aesthetic"
```

### Task 3: Create Main Layout Wrapper

**Files:**
- Create: `components/layout/main-layout.tsx`

- [ ] **Step 1: Create the layout wrapper component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Prospecção", href: "/", icon: UserPlus },
    { name: "Meus Candidatos", href: "/my-candidates", icon: Users },
    { name: "Quadro de Vendas", href: "/crm", icon: LayoutDashboard },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="p-6 flex items-center gap-3">
           {/* Replace with next/image for better optimization later if needed, simple img fine for now */}
          <div className="w-10 h-10 relative">
             <Image src="/logo.png" alt="Iceberg Logo" fill className="object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Iceberg CRM</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto py-8 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/main-layout.tsx
git commit -m "feat: create main layout wrapper with sidebar"
```

### Task 4: Refactor `app/page.tsx` to use MainLayout

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Wrap page content and remove old top navigation**

```tsx
"use client";

import { useState, useEffect } from "react";
import { FilterBar } from "@/components/candidates/filter-bar";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { CandidateDossier } from "@/components/candidates/candidate-dossier";
import { Candidate } from "@/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [filters, setFilters] = useState({ 
    uf: "", 
    municipio: "", 
    partido: "", 
    minPatrimonio: "", 
    maxPatrimonio: "",
    sortBy: "nome_urna",
    sortOrder: "asc",
    page: 1
  });

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.uf) params.append("uf", filters.uf);
      if (filters.municipio) params.append("municipio", filters.municipio);
      if (filters.partido) params.append("partido", filters.partido);
      if (filters.minPatrimonio) params.append("minPatrimonio", filters.minPatrimonio);
      if (filters.maxPatrimonio) params.append("maxPatrimonio", filters.maxPatrimonio);
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);
      params.append("page", filters.page.toString());

      const response = await fetch(`/api/candidates?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Falha ao carregar candidatos.");
      }
      
      setCandidates(data.candidates);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const handleSearch = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    // No window.scrollTo needed as main content area handles its own scrolling now
  };

  const handleViewDossier = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDossierOpen(true);
  };

  const handleCaptureLead = async (candidateId: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidate_id: candidateId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao capturar lead.");
      }

      alert("Lead capturado com sucesso!");
      fetchCandidates();
    } catch (error) {
      console.error("Error capturing lead:", error);
      alert(error instanceof Error ? error.message : "Erro ao capturar lead.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Prospecção de Candidatos
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Explore e analise candidatos das eleições municipais de 2024.
          </p>
        </div>

        <FilterBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-zinc-500 text-sm font-medium">
                Carregando candidatos...
              </p>
            </div>
          ) : (
            <CandidateTable 
              candidates={candidates} 
              onViewDossier={handleViewDossier} 
              onCaptureLead={handleCaptureLead}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
            />
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && candidates.length > 0 && (
          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-zinc-500">
              Mostrando <span className="font-medium text-zinc-900 dark:text-zinc-100">{candidates.length}</span> de <span className="font-medium text-zinc-900 dark:text-zinc-100">{pagination.totalCount}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Anterior
              </Button>
              <div className="text-sm text-zinc-500 font-medium px-2">
                {pagination.currentPage} / {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        <CandidateDossier
          candidate={selectedCandidate}
          isOpen={isDossierOpen}
          onOpenChange={setIsDossierOpen}
          onCaptureLead={handleCaptureLead}
        />
      </div>
    </MainLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: apply MainLayout to home page"
```

### Task 5: Refine Table Component Styling

**Files:**
- Modify: `components/ui/table.tsx`

- [ ] **Step 1: Update table styles for a cleaner, "zebra" look**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b bg-slate-50/50 dark:bg-slate-900/50", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 data-[state=selected]:bg-muted even:bg-slate-50/30 dark:even:bg-slate-900/20",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle font-semibold text-slate-600 dark:text-slate-400 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

- [ ] **Step 2: Commit**

```bash
### Task 6: Refactor `app/my-candidates/page.tsx`

**Files:**
- Modify: `app/my-candidates/page.tsx`

- [ ] **Step 1: Wrap page content in MainLayout and remove redundant navigation**

```tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { MyCandidateTable } from "@/components/my-candidates/my-candidate-table";
import { FilterBar } from "@/components/candidates/filter-bar";
import { AddCandidateDialog } from "@/components/my-candidates/add-candidate-dialog";
import { Loader2 } from "lucide-react";
import { MyCandidate } from "@/types";
import { MainLayout } from "@/components/layout/main-layout";

export default function MyCandidatesPage() {
  const [candidates, setCandidates] = useState<MyCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ uf: "", municipio: "" });

  const fetchCandidates = useCallback(async (currentFilters: { uf: string; municipio: string }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.uf) params.append("uf", currentFilters.uf);
      if (currentFilters.municipio) params.append("municipio", currentFilters.municipio);

      const response = await fetch(`/api/my-candidates?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates(filters);
  }, [fetchCandidates, filters]);

  const handleSearch = (newFilters: { uf: string; municipio: string }) => {
    setFilters(newFilters);
  };

  const handleAddSuccess = () => {
    fetchCandidates(filters);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Meus Candidatos
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Gerencie os candidatos que você capturou ou adicionou manualmente.
            </p>
          </div>
          
          <div className="flex gap-2">
            <AddCandidateDialog onSuccess={handleAddSuccess} />
          </div>
        </div>

        <FilterBar onSearch={handleSearch} />

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-zinc-500 text-sm font-medium">
                Carregando seus candidatos...
              </p>
            </div>
          ) : (
            <MyCandidateTable candidates={candidates} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/my-candidates/page.tsx
git commit -m "refactor: apply MainLayout to my-candidates page"
```

### Task 7: Refactor `app/crm/page.tsx`

**Files:**
- Modify: `app/crm/page.tsx`

- [ ] **Step 1: Wrap page content in MainLayout and remove redundant navigation**

```tsx
"use client"

import { KanbanBoard } from "@/components/crm/kanban-board"
import { LayoutDashboard } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

export default function CRMPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold uppercase tracking-wider text-xs">CRM de Vendas</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Quadro de Vendas
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Gerencie seus leads e acompanhe o progresso das negociações.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
          <KanbanBoard />
        </div>
      </div>
    </MainLayout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/crm/page.tsx
git commit -m "refactor: apply MainLayout to CRM page"
```

### Task 8: Refactor `app/dashboard/page.tsx`

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Wrap page content in MainLayout and remove redundant navigation**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MainLayout } from "@/components/layout/main-layout";

interface DashboardData {
  summary: {
    totalLeads: number;
    closedDeals: number;
    totalNegotiationValue: number;
  };
  funnel: Array<{ status: string; count: number }>;
  recentActivity: Array<{
    id: string;
    candidateName: string;
    type: string;
    note: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard Executivo</h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">Visão geral do desempenho da agência.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary?.totalLeads ?? 0}</div>
              <p className="text-xs text-muted-foreground">Capturados do TSE ou Manuais</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Fechados</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary?.closedDeals ?? 0}</div>
              <p className="text-xs text-muted-foreground">Clientes convertidos</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor em Negociação</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data?.summary?.totalNegotiationValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Status: Reunião & Proposta</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.summary?.totalLeads ? ((data.summary.closedDeals / data.summary.totalLeads) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Leads vs Clientes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Funnel Distribution */}
          <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Distribuição do Funil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.funnel?.map(f => (
                <div key={f.status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{f.status}</span>
                    <span className="text-muted-foreground">{f.count} leads</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${(f.count / (data.summary?.totalLeads || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data?.recentActivity?.map(activity => (
                  <div key={activity.id} className="relative pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-primary" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{activity.candidateName}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {format(new Date(activity.date), "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{activity.note}"
                    </p>
                    <div className="mt-1">
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-medium">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                ))}
                {(data?.recentActivity?.length === 0 || !data?.recentActivity) && (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    Nenhuma atividade registrada hoje.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "refactor: apply MainLayout to dashboard page"
```