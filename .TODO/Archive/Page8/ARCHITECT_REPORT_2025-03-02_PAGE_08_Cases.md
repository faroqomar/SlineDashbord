# Architect Report — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases (Case Management Core)  
**Date:** 2025-03-02  
**Agent:** @AdminArchitect (`.agent/workflows/architecture/admin_architect.md`)

---

## 1) MVVM boundary check

| Layer | Evidence | Finding |
|-------|----------|---------|
| **View** | Verified in dashboard code | `CasesScreen.tsx`, `CaseDetailScreen.tsx` — no direct DB/Supabase; no `useEffect` for data fetch. Views use ViewModel hooks only. |
| **ViewModel** | Verified in dashboard code | `use_cases_viewmodel.ts`, `use_case_detail_viewmodel.ts` — state + handlers; all data via `cases_api`. |
| **API client** | Verified in dashboard code | `cases_api.ts` — calls `request()` (Fastify only); types from `@sline/shared`. |

**Verdict:** MVVM boundaries respected. Views are presentational; ViewModels own state and call API only.

---

## 2) Route parity

| Route | Evidence | Status |
|-------|----------|--------|
| `/cases` | Verified in dashboard code | `App.tsx` — `casesRoute`; `Cases.tsx` → `CasesScreen`. |
| `/cases/$caseId` | Verified in dashboard code | `caseDetailRoute`; `CaseDetail.tsx` → `CaseDetailScreen`. |
| Sidebar | Verified in dashboard code | "Cases" link to `/cases` in `Sidebar.tsx`. |

**Verdict:** TanStack Router parity for cases list and detail; no missing routes.

---

## 3) Contract needs

| Contract | Evidence | Note |
|----------|----------|------|
| Create input | Verified in dashboard code | `AdminCaseCreateInputSchema` — subject is `.optional()`; API/DB require subject. Recommend make subject required for create. |
| List response | Verified in dashboard code | API returns `{ cases, count, totalPages }`; `AdminCaseListResponseSchema` has `{ cases, total, page, limit }`. Optional alignment. |
| Detail | Verified in dashboard code | `AdminCaseDetail` = AdminCase & entities; API and UI use same shape. |

**Verdict:** Contracts sufficient; one optional hardening (subject required on create).

---

## 4) File paths (exact)

- **Features:** `apps/admin-ui/src/features/cases/` — `services/cases_api.ts`, `viewmodels/use_cases_viewmodel.ts`, `viewmodels/use_case_detail_viewmodel.ts`, `view/CasesScreen.tsx`, `view/CaseDetailScreen.tsx`
- **Routes:** `apps/admin-ui/src/routes/Cases.tsx`, `CaseDetail.tsx`
- **Shared:** `packages/shared/src/schemas/cases.ts`, exported in `index.ts`

---

## 5) Required refactors (Architect)

- None blocking. Optional: make `subject` required in `AdminCaseCreateInputSchema` (`.min(1)` and remove `.optional()`).
