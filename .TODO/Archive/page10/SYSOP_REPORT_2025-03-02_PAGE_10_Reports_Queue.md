# SysOp Report — PAGE 10 Reports Queue

**Scope:** PAGE_10_Reports_Queue  
**Date:** 2025-03-02  
**Agent:** @SysOp (`.agent/workflows/architecture/sys_op.md`)

---

## 1) Endpoint inventory (Fastify)

| Method | Path | Evidence | RBAC |
|--------|------|----------|------|
| GET | /api/v1/reports | Verified in dashboard code: `apps/api/src/routes/reports.ts` | REPORTS_READ_ROLES |
| GET | /api/v1/reports/:reportId | Verified in dashboard code | REPORTS_READ_ROLES |
| POST | /api/v1/reports/:reportId/triage | Verified in dashboard code | REPORTS_WRITE_ROLES |
| POST | /api/v1/reports/:reportId/close | Verified in dashboard code | REPORTS_WRITE_ROLES |

Routes registered in `apps/api/src/app.ts` with prefix `/api/v1/reports`. **Verdict:** Endpoint inventory complete.

---

## 2) Contract map (packages/shared)

| Schema | Evidence | Used by |
|--------|----------|---------|
| ReportEntityTypeEnum, ReportStatusEnum, TriageActionEnum | Verified in dashboard code | reports.ts (shared), API validation |
| ReportRowSchema, ReportActionRowSchema | Verified in dashboard code | Type exports; API maps to ReportListItem / ReportDetail |
| ReportListItemSchema, ReportDetailSchema | Verified in dashboard code | GET list/detail response shape |
| ListReportsQuerySchema | Verified in dashboard code | GET / query params |
| TriageReportInputSchema, CloseReportInputSchema | Verified in dashboard code | POST triage/close body |
| REPORTS_READ_ROLES, REPORTS_WRITE_ROLES | Verified in dashboard code | requireAdminRole() in reports routes |

Exported from `packages/shared/src/index.ts`. **Verdict:** Contracts complete; no missing DTOs.

---

## 3) DB / RPC requirements

| Object | Evidence | Location |
|--------|----------|----------|
| reports table | Verified in dashboard code | `supabase/migrations/20260302130000_reports_queue.sql` — id, reporter_user_id, entity_type, entity_id, reason, category, status, created_at, updated_at, meta; RLS service_role only. |
| report_actions table | Verified in dashboard code | Same migration; FK to reports; RLS service_role only. |
| admin_triage_report RPC | Verified in dashboard code | Same migration; p_report_id, p_action, p_admin_id, p_reason; UPDATE reports + INSERT report_actions + INSERT audit_logs in one transaction. |
| admin_close_report RPC | Verified in dashboard code | Same migration; p_report_id, p_admin_id, p_reason; same atomic pattern. |
| related_entity_type_enum 'report' | Verified in dashboard code | Migration extends enum when present (DO block). |

**Ownership note:** Migration lives in dashboard repo; MIGRATIONS/README.md documents that equivalent SQL can be added to sline_app for production. **Verdict:** DB and RPC requirements met in dashboard migrations.

---

## 4) audit_logs atomicity compliance

| Mutation | Evidence | Result |
|----------|----------|--------|
| Triage | Verified in dashboard code | API calls `admin_triage_report` RPC only; RPC performs status update + report_actions insert + audit_logs insert in same transaction. No API-layer withAudit. |
| Close | Verified in dashboard code | API calls `admin_close_report` RPC only; same atomic pattern. |

**Verdict:** Privileged mutations are atomic with audit. **PASS**

---

## 5) Validation and No-Throw

| Input | Validation | Evidence |
|-------|------------|----------|
| GET / query | ListReportsQuerySchema.safeParse | Verified in dashboard code; 400 on failure. |
| GET /:reportId | UUID regex | Verified in dashboard code; 400 for invalid reportId. |
| POST triage body | TriageReportInputSchema.safeParse | Verified in dashboard code; 400 on failure. |
| POST close body | CloseReportInputSchema.safeParse | Verified in dashboard code; 400 on failure. |

Responses use `failure()` / `success()` from @sline/shared; no raw throw. **Verdict:** Zod first; No-Throw rule followed.

---

## 6) Exact file paths

- **API:** `apps/api/src/routes/reports.ts`, `apps/api/src/app.ts` (register)
- **Shared:** `packages/shared/src/schemas/reports.ts`, `packages/shared/src/schemas/audit.ts` (admin.report.triage, admin.report.resolve), `packages/shared/src/index.ts`
- **Migration:** `supabase/migrations/20260302130000_reports_queue.sql`
