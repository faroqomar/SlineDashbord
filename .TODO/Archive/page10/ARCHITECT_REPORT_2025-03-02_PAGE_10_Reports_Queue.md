# Architect Report — PAGE 10 Reports Queue

**Scope:** PAGE_10_Reports_Queue  
**Date:** 2025-03-02  
**Agent:** @AdminArchitect (`.agent/workflows/architecture/admin_architect.md`)

---

## 1) MVVM boundary check

| Layer | Evidence | Finding |
|-------|----------|---------|
| **View** | Verified in dashboard code | `ReportsScreen.tsx` — no direct DB/Supabase; uses `reportsApi` only. State (list, filters, selected report, loading, error) held in component. No `useEffect` for data beyond `loadList()` on mount/deps. |
| **ViewModel** | Verified in dashboard code | No dedicated ViewModel hook. Screen acts as View + state; calls `reportsApi` directly. Pattern matches some other screens (e.g. simple list + detail). Optional: add `useReportsViewModel` for consistency with Cases/Tasks. |
| **API client** | Verified in dashboard code | `reports_api.ts` — uses `request()` from `@/lib/api`; types from `@sline/shared`. No Supabase or server-only imports. |

**Verdict:** MVVM boundaries respected. View does not touch DB; all data via API client. No blocking defect; optional refactor: extract `useReportsViewModel` for consistency.

---

## 2) Route parity

| Route | Evidence | Status |
|-------|----------|--------|
| `/reports` | Verified in dashboard code | `App.tsx` — `reportsRoute`; `Reports.tsx` → `ReportsScreen`. |
| Sidebar | Verified in dashboard code | "Reports" link to `/reports` in `Sidebar.tsx` (Flag icon). |

**Verdict:** TanStack Router parity for reports; no missing routes.

---

## 3) Contract needs

| Contract | Evidence | Note |
|----------|----------|------|
| List query | Verified in dashboard code | `ListReportsQuerySchema` — status, entity_type, page, limit; exported from `packages/shared/src/schemas/reports.ts`. |
| List response | Verified in dashboard code | API returns `{ reports, total, page, limit }`; `ReportListItemSchema` shapes items. |
| Detail | Verified in dashboard code | `ReportDetailSchema` — report fields + `actions` array; API and UI use same shape. |
| Triage/Close input | Verified in dashboard code | `TriageReportInputSchema`, `CloseReportInputSchema`; Zod in API. |

**Verdict:** Contracts sufficient; all request/response shapes in shared.

---

## 4) File paths (exact)

- **Features:** `apps/admin-ui/src/features/reports/` — `services/reports_api.ts`, `view/ReportsScreen.tsx`
- **Routes:** `apps/admin-ui/src/routes/Reports.tsx`
- **Shared:** `packages/shared/src/schemas/reports.ts`, exported in `index.ts`

---

## 5) Required refactors (Architect)

- None blocking. Optional: add `viewmodels/use_reports_viewmodel.ts` and have `ReportsScreen` consume it for consistency with Cases/Tasks pattern.
