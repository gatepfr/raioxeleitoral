# Design Spec - Candidate Dossier Modal Redesign

**Status:** Draft
**Date:** 2026-05-12
**Author:** Gemini CLI

## 1. Goal
Fix the layout of the Candidate Dossier modal (`components/candidates/candidate-dossier.tsx`). The current layout is truncated and contains overlapping information, especially in the identification and financial assets sections.

## 2. Context
The dossier is a critical part of the Iceberg CRM, providing "Intelligence" on electoral candidates. The user reported that the visual representation in the modal is "truncated" and "overlapping", making it hard to read.

## 3. Proposed Changes

### 3.1. Modal Shell
- Increase `DialogContent` max-width from `3xl` to `4xl` (approx. 896px). This provides more horizontal space for data-dense sections.
- Ensure `max-h-[90vh]` and `overflow-y-auto` are working correctly to prevent footer clipping.

### 3.2. Identification Section
- **Flex Layout:** Replace the rigid `grid-cols-2` in the identification area with a more flexible structure.
- **Label/Value Treatment:** Use a consistent vertical stack for Label (uppercase, small, muted) and Value (bold, larger).
- **Wrapping:** Allow fields like "Nome Completo" and "Cargo" to take full width if they are too long, instead of forcing them into a narrow column.

### 3.3. Financial Assets (Patrimônio)
- **Table Column Widths:** Adjust the `Table` to allocate more space to the "Descrição" column.
- **Remove Truncate:** Remove `truncate` and `max-w-xs` from the description cell. Use `whitespace-normal` or `break-words` to ensure long descriptions are fully visible across multiple lines.
- **Cell Alignment:** Ensure numeric values remain right-aligned and legible.

### 3.4. Electoral Performance Section
- **Responsive Grid:** Ensure the 3-column grid (`Votos`, `Total Gasto`, `Custo por Voto`) breaks down to 1 column earlier if needed, preventing numbers from overlapping their card boundaries.

### 3.5. Styling & Spacing
- Increase vertical gaps (`gap-8`) between major sections (Identification, Assets, Performance, Social).
- Improve contrast between section headers and content.

## 4. Technical Details
- **File to modify:** `components/candidates/candidate-dossier.tsx`
- **Tech Stack:** Next.js, Tailwind CSS, Radix UI (Dialog), Lucide React.
- **Dependencies:** None (uses existing project components).

## 5. Success Criteria
- No text overlaps in the identification section regardless of name/role length.
- Asset descriptions are fully readable without being cut off.
- The modal feels spacious and professional on desktop resolutions.
- Footer actions are always reachable.
