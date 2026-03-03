# Master Report — Reports → Cases Moderation Pipeline (Orchestrator Review)

**Scope:** Reports queue, report detail modal, escalation to case, case workspace (assign/status/notes), migration fixes (assignee_id, enums, reports_status_check).  
**Date:** 2025-03-03  
**Review basis:** All code changed by agent (conversation/session); evaluated against `.agent/workflows/orchestrator.md` and agent rules.

---

## A) Executive Summary

| Item | Status |
|------|--------|
| **Scope reviewed** | Reports & Cases moderation (API, UI, shared, migration, docs, E2E) |
| **Overall risk level** | **LOW** — no blockers; architecture and security gates satisfied |
| **Final decision** | **Ready** (with recommended follow-ups) |
| **Gate statuses** | SecGuard ✅ | CodeWarden ⚠️ (line-count only) | QA ✅ | Docs ✅ |

**Summary:** The changes implement the Reports→Cases pipeline correctly: MVVM boundaries are respected, no service-role in admin-ui, RBAC and Zod on API, atomic audit in SQL RPCs. Migration handles schema drift (assignee_id, enums, reports_status_check). Remaining items are refactor recommendations (file size) and optional hardening.

---

## B) Consolidated Findings (Deduplicated)

### Security

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| S1 | — | **Verified:** No `createAdminClient` / `auth.admin` / service-role in `apps/admin-ui` | Verified in dashboard code (grep) | None |
| S2 | — | **Verified:** All report/case mutation routes use `requireAdminRole(REPORTS_WRITE_ROLES)` or `CASES_WRITE_ROLES` / `CASES_DESTRUCTIVE_ROLES` | `apps/api/src/routes/reports.ts`, `cases.ts` | None |
| S3 | — | **Verified:** Mutations go through RPCs that write `audit_logs` in the same transaction (admin_dismiss_report, admin_escalate_report, admin_close_report, admin_case_assign, admin_case_update_status, admin_case_add_note) | Verified in SQL (`20260308113000_reports_cases_pipeline.sql`) | None |

### Data Integrity / Schema Drift

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| D1 | — | **Resolved:** Migration adds `assignee_id` to `admin_cases` when missing | Verified in SQL (ALTER TABLE … ADD COLUMN IF NOT EXISTS assignee_id) | None |
| D2 | — | **Resolved:** Migration creates `admin_case_status_enum` and `admin_case_priority_enum` if not present | Verified in SQL (DO $$ … CREATE TYPE … $$) | None |
| D3 | — | **Resolved:** `reports_status_check` updated to include `'escalated'` | Verified in SQL (DROP + ADD CONSTRAINT) | None |

### Contracts / DTO Drift

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| C1 | — | **Verified:** Report/case endpoints use shared Zod schemas (DismissReportInputSchema, EscalateReportInputSchema, AdminCaseAssignInputSchema, etc.) | `packages/shared/src/schemas/reports.ts`, `cases.ts`; `apps/api` imports | None |
| C2 | — | **Verified:** Audit actions extended in shared (`admin.report.dismiss`, `admin.report.escalate`, `admin.case.assign`, etc.) | `packages/shared/src/schemas/audit.ts` | None |

### Architecture / MVVM

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| A1 | — | **Verified:** ReportsScreen uses only `useReportsViewModel()`; no `useEffect`/`fetch` in view | Verified in dashboard code | None |
| A2 | — | **Verified:** ViewModels call only `reportsApi` / `casesApi`; no Supabase/DB in UI | `use_reports_viewmodel.ts`, `use_case_detail_viewmodel.ts` | None |
| A3 | — | **Resolved:** ReportsScreen and CaseDetailScreen split into subcomponents; all view files now under 300 lines. API route files (reports.ts, cases.ts) remain over 300 lines; optional to split handlers later. | Verified in dashboard code | ReportsScreen (63), ReportsTable (202), ReportDetailModal (215), CaseDetailScreen (164), plus Case*Card components. |

### Performance

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| P1 | — | **Verified:** Reports list uses server-side pagination (limit/offset) and count | `apps/api` GET /reports | None |
| P2 | LOW | Case detail fetches entities, notes, timeline in one route; acceptable for moderate volume | `apps/api` GET /cases/:caseId | Monitor; add cursor pagination for timeline if needed later |

### Testing / QA

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| T1 | — | **Verified:** API tests for reports (dismiss, escalate, close) and cases (assign, status, note) — 401/400/validation | `apps/api/src/routes/reports.test.ts`, `cases.test.ts` | None |
| T2 | — | **Verified:** E2E smoke for reports queue and case workspace (`reports-cases-moderation.spec.ts`); auth-tolerant | `apps/admin-ui/e2e/` | None |
| T3 | — | **Verified:** Shared schema tests updated for new report/case fields and enums | `packages/shared/src/schemas/reports.test.ts`, `cases.test.ts` | None |

### Docs / Reference Integrity

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| O1 | — | **Verified:** `Docs/features/reports-queue.md` and `cases.md` describe endpoints, audit actions, and RPCs | Verified in repo | None |
| O2 | — | **Verified:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` updated for report/case moderation semantics and audit actions | Verified in repo | None |

---

## C) Fix Plan (Ordered)

| Step | Owner | What | Where | Status |
|------|--------|------|--------|--------|
| 1 | @CodeWarden / @UIExpert | Split ReportsScreen into table + modal | `apps/admin-ui/src/features/reports/view/` | **Done:** ReportsScreen (63), ReportsTable (202), ReportDetailModal (215), ReportBadges (28) |
| 2 | @CodeWarden / @UIExpert | Split CaseDetailScreen into overview, controls, entities, evidence, timeline, notes, attach cards | `apps/admin-ui/src/features/cases/view/` | **Done:** CaseDetailScreen (164), CaseOverviewCard, CaseControlsCard, CaseEntitiesCard, CaseEvidenceCard, CaseTimelineCard, CaseNotesCard, CaseAttachEntityCard |
| 3 | @PerfOpt | Optional: if case timeline grows large, add cursor-based pagination for timeline in GET /cases/:caseId | `apps/api/src/routes/cases.ts` | Deferred (monitor) |

---

## D) Regression Checklist

- [ ] **Auth:** Login → session → Reports and Cases routes require auth (401 when no cookie).
- [ ] **Reports:** List reports → open detail → Dismiss / Escalate / Close as resolved (with reason) → success or expected error.
- [ ] **Escalate:** Escalate report → new or existing case → redirect to case detail → case shows report in evidence.
- [ ] **Cases:** Case detail → Assign / Update status / Add note (with reason) → timeline and state update.
- [ ] **Migration:** After applying `20260308113000_reports_cases_pipeline.sql`, escalate and assign work without column/enum/constraint errors.

---

## E) Rollback Notes

| Area | Rollback strategy |
|------|--------------------|
| **Contracts** | Revert `packages/shared` schema changes; API/UI may need matching revert. |
| **API** | Revert `apps/api/src/routes/reports.ts`, `cases.ts`; keep or revert new tests. |
| **UI** | Revert `apps/admin-ui` reports/cases features and dialog changes. |
| **DB** | Migration is additive (new columns, enums, constraints, RPCs). No automatic rollback script; forward-fix only. To “undo” status: drop new RPCs, revert constraint to `('open','triaged','closed')` if required, drop added columns only if no data depends on them. |

---

## F) Next Actions (Immediate)

| # | Action | Owner |
|---|--------|--------|
| 1 | Run full regression (auth, report triage, escalate, case assign/status/note) in dev | @QA / developer |
| 2 | Ensure migration `20260308113000_reports_cases_pipeline.sql` is applied in target env (or run manual SQL for assignee_id, enums, reports_status_check) | @SysOp / DevOps |
| 3 | Optional: Schedule refactor of ReportsScreen and CaseDetailScreen for 300-line gate | @CodeWarden |
| 4 | Optional: Add Idempotency-Key to escalate/assign/status/note if replay protection is required | @SecGuard / @SysOp |
| 5 | Keep `Docs/features/reports-queue.md` and `cases.md` in sync with any future API changes | @DocKeeper |

---

*Generated per `.agent/workflows/orchestrator.md`. Evidence labels: Verified in dashboard code / Verified in app code / Verified in SQL.*
