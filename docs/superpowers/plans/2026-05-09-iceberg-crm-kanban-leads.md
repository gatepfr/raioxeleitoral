# Iceberg CRM - CRM Kanban & Lead Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the prospecting dashboard into a full CRM by adding lead conversion, an interactive Kanban board with drag-and-drop, and interaction logging.

**Architecture:** Full-stack implementation using Next.js Route Handlers for the API and `@dnd-kit` for the interactive UI. State management will handle real-time Kanban updates.

**Tech Stack:** Next.js, Prisma, shadcn/ui (Sheet, Badge, Button), @dnd-kit/core, @dnd-kit/sortable.

---

### Task 1: API Endpoints for Lead Management
**Files:**
- Create: `app/api/leads/route.ts`
- Create: `app/api/leads/[id]/route.ts`

- [ ] **Step 1: Create POST /api/leads to convert a candidate**
```typescript
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { candidateId } = await request.json()
  const lead = await db.lead.create({
    data: {
      candidate_id: candidateId,
      status: "PROSPECT",
    }
  })
  return NextResponse.json(lead)
}
```

- [ ] **Step 2: Create PATCH /api/leads/[id] to update status**
```typescript
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json()
  const lead = await db.lead.update({
    where: { id: params.id },
    data: { status }
  })
  return NextResponse.json(lead)
}
```

- [ ] **Step 3: Commit**
```bash
git add app/api/leads/
git commit -m "feat: add lead management api endpoints"
```

---

### Task 2: Drag-and-Drop Infrastructure
**Files:**
- Modify: `package.json`
- Create: `components/crm/kanban-board.tsx`

- [ ] **Step 1: Install dnd-kit dependencies**
Run: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

- [ ] **Step 2: Scafold Kanban Board component**
Setup the `DndContext` and basic column structure.

- [ ] **Step 3: Commit**
```bash
git add package.json components/crm/kanban-board.tsx
git commit -m "chore: setup dnd-kit and kanban structure"
```

---

### Task 3: Kanban Column & Card Components
**Files:**
- Create: `components/crm/kanban-column.tsx`
- Create: `components/crm/kanban-card.tsx`

- [ ] **Step 1: Implement KanbanCard with shadcn Card**
Display Lead name, Party, and Estimated Assets.

- [ ] **Step 2: Implement KanbanColumn with droppable logic**
Ensure cards can be dropped into columns.

- [ ] **Step 3: Commit**
```bash
git add components/crm/
git commit -m "feat: implement kanban column and card components"
```

---

### Task 4: Lead Interaction & Timeline (Sheet)
**Files:**
- Create: `components/crm/lead-details-sheet.tsx`
- Modify: `app/api/interactions/route.ts`

- [ ] **Step 1: Implement Interaction creation API**
- [ ] **Step 2: Build the Side Sheet UI for interactions**
Add a form to log notes and a list for the timeline.

- [ ] **Step 3: Commit**
```bash
git add components/crm/lead-details-sheet.tsx app/api/interactions/
git commit -m "feat: add lead interaction timeline and sheet"
```

---

### Task 5: CRM Page Assembly
**Files:**
- Create: `app/crm/page.tsx`
- Modify: `components/candidates/candidate-table.tsx` (Add "Capture" button)

- [ ] **Step 1: Add "Capture Lead" button to Candidate Table**
- [ ] **Step 2: Assemble the CRM page with the Kanban Board**
Fetch all leads grouped by status and handle the `onDragEnd` logic to call the API.

- [ ] **Step 3: Commit**
```bash
git add app/crm/page.tsx components/candidates/candidate-table.tsx
git commit -m "feat: assemble final crm kanban page"
```
