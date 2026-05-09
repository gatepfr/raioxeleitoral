# Iceberg CRM - Next.js & UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Next.js application in the root directory, configure shadcn/ui, and connect it to the existing Prisma schema.

**Architecture:** Next.js (App Router) as a full-stack framework. Server Actions or Route Handlers will be used for API logic with Prisma.

**Tech Stack:** Next.js, Tailwind CSS, shadcn/ui, Prisma, TypeScript.

---

### Task 1: Next.js & Tailwind Initialization
**Files:**
- Modify: `package.json` (created by npm init/next)
- Create: `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize Next.js project in the root**
Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes`
(Note: This will install dependencies in the current directory)

- [ ] **Step 2: Add Prisma as a dev dependency and sync**
Run: `npm install prisma --save-dev && npm install @prisma/client`
Expected: `package.json` updated.

- [ ] **Step 3: Generate Prisma Client**
Run: `npx prisma generate`
Expected: Client generated in `node_modules/.prisma/client`.

- [ ] **Step 4: Commit**
```bash
git add package.json package-lock.json tsconfig.json tailwind.config.ts next.config.mjs
git commit -m "feat: initialize next.js app in root"
```

---

### Task 2: shadcn/ui Setup
**Files:**
- Create: `components.json`
- Modify: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui CLI**
Run: `npx shadcn-ui@latest init --yes`
(This will use the default slate theme and configure `lib/utils.ts` and `globals.css`)

- [ ] **Step 2: Install base UI components (Button, Input, Card, Table, Dialog)**
Run: `npx shadcn-ui@latest add button input card table dialog`
Expected: Files created in `components/ui/`.

- [ ] **Step 3: Commit**
```bash
git add components.json components/ lib/ app/globals.css
git commit -m "feat: setup shadcn/ui base components"
```

---

### Task 3: Prisma Client & Data Fetching Utility
**Files:**
- Create: `lib/db.ts`

- [ ] **Step 1: Create a singleton Prisma client instance**
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

- [ ] **Step 2: Commit**
```bash
git add lib/db.ts
git commit -m "feat: add prisma singleton client"
```

---

### Task 4: API Route for Candidates (Cold Leads)
**Files:**
- Create: `app/api/candidates/route.ts`

- [ ] **Step 1: Create GET endpoint with filtering logic**
```typescript
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get("uf")
  const municipio = searchParams.get("municipio")

  const candidates = await db.candidate.findMany({
    where: {
      ...(uf && { uf }),
      ...(municipio && { municipio }),
    },
    take: 50,
    orderBy: { nome_completo: 'asc' }
  })

  return NextResponse.json(candidates)
}
```

- [ ] **Step 2: Commit**
```bash
git add app/api/candidates/route.ts
git commit -m "feat: add candidates api route"
```
