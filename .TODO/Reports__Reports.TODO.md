# Reports / Reports TODO Summary

## 1. Page Overview

- Route: `/reports`
- Goal: triage, investigate, and resolve user reports with a queue-first moderation workflow.
- Current UI status:
  - Figma-inspired layout sections are now present (hero, KPI row, toolbar, queue table, detail modal).
  - Existing moderation flows are wired to real APIs.
  - Create-report, trend analytics, KPI analytics, and server-side search are wired to backend routes.
  - Mock datasets remain only as runtime fallback when analytics endpoints fail.

---

## 2. Existing Features Already Linked

- Reports queue list (real)
  - API: `GET /reports`
  - Supports: `status`, `entity_type`, `severity`, `assigned_to_me`, `page`, `limit`
  - UI wiring:
    - `apps/admin-ui/src/features/reports/services/reports_api.ts`
    - `apps/admin-ui/src/features/reports/viewmodels/use_reports_viewmodel.ts`
    - `apps/admin-ui/src/features/reports/view/ReportsTable.tsx`

- Server-side pagination (real)
  - UI controls wired to `page` and `limit`
  - Files:
    - `apps/admin-ui/src/features/reports/view/ReportsTable.tsx`
    - `apps/admin-ui/src/features/reports/viewmodels/use_reports_viewmodel.ts`

- Report detail modal (real)
  - API: `GET /reports/:reportId`
  - Files:
    - `apps/admin-ui/src/features/reports/view/ReportDetailModal.tsx`
    - `apps/admin-ui/src/features/reports/viewmodels/use_reports_viewmodel.ts`

- Moderation actions (real)
  - Dismiss: `POST /reports/:reportId/dismiss`
  - Escalate: `POST /reports/:reportId/escalate`
  - Close resolved: `POST /reports/:reportId/close`
  - Files:
    - `apps/admin-ui/src/features/reports/services/reports_api.ts`
    - `apps/admin-ui/src/features/reports/viewmodels/use_reports_viewmodel.ts`
    - `apps/admin-ui/src/features/reports/view/ReportDetailModal.tsx`

- Case linking (real)
  - Open case from detail/escalation result
  - File:
    - `apps/admin-ui/src/features/reports/view/ReportDetailModal.tsx`

- KPI absolute totals (real)
  - Derived from real list totals by status using existing API
  - File:
    - `apps/admin-ui/src/features/reports/viewmodels/use_reports_viewmodel.ts`

---

## 3. Missing Features (Design References but Backend/Feature Not Implemented)

- No known feature gap in current page scope.
- Remaining dependency: ensure the latest reports migrations are applied in target environments before release.

---

## 4. What We Mocked and Why

- Hero/KPI fallback visuals:
  - Mock source: `apps/admin-ui/src/features/reports/models/reports-ui.mock.ts`
  - Why: preserve stable UI if `/reports/trends` or `/reports/kpis` fails.
- Fallback is no longer primary behavior; real endpoints are the default data source.

---

## 5. Implementation Plan for Missing Features (High-Level Only)

1. Keep reports tests green in `shared`, `api`, and `admin-ui`.
2. Apply and verify migrations in all target environments.
3. Add e2e smoke coverage for create + search + analytics rendering.

---

## 6. Risks / Dependencies / Required APIs

- Deployment dependency:
  - `admin_create_report` RPC migration must be present in runtime database.
- Security dependency:
  - RPC execute privileges should stay restricted to `service_role`.
- Data/performance considerations:
  - analytics endpoints should be monitored for query latency under larger report volume.
- Consistency:
  - trend/KPI windows are currently fixed to UTC 7-day windows.
