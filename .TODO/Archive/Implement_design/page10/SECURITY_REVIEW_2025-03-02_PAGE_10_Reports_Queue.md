# Security Review — PAGE 10 Reports Queue

**Scope:** PAGE_10_Reports_Queue  
**Date:** 2025-03-02  
**Agent:** @SecGuard (Hard Security Gate)

---

## 1) Forbidden imports (admin-ui)

| Check | Evidence | Result |
|-------|----------|--------|
| No server-only Supabase in reports feature | Verified in dashboard code | `apps/admin-ui/src/features/reports/` — grep for supabase, service_role, createAdminClient, server, auth.admin: **0 matches**. |
| reports_api uses request() only | Verified in dashboard code | `reports_api.ts` — imports from `@/lib/api` and `@sline/shared`; no Supabase. |
| ReportsScreen imports | Verified in dashboard code | Only React, reportsApi, shared types, UI components, lucide-react. |

**Verdict:** No forbidden imports in reports feature. **APPROVED ✅**

---

## 2) RBAC enforcement

| Route | Required role | Evidence |
|-------|----------------|----------|
| GET /api/v1/reports | REPORTS_READ_ROLES (support, moderator, admin, super_admin) | Verified in dashboard code: `requireAdminRole(REPORTS_READ_ROLES)` on GET /. |
| GET /api/v1/reports/:reportId | same | Verified in dashboard code: preHandler on GET /:reportId. |
| POST /api/v1/reports/:reportId/triage | REPORTS_WRITE_ROLES (moderator, admin, super_admin) | Verified in dashboard code: `requireAdminRole(REPORTS_WRITE_ROLES)`. |
| POST /api/v1/reports/:reportId/close | same | Verified in dashboard code. |

**Verdict:** All reports endpoints protected by RBAC. **APPROVED ✅**

---

## 3) PII / case-gated chat

- **PAGE 10 scope:** Reports queue (task/user/chat report metadata). No chat content or PII in scope; reporter_user_id and entity_id are IDs. No case-gated chat in this feature.
- **Verdict:** N/A. No PII exposure beyond IDs (admin-only surface).

---

## 4) Audit compliance

| Rule | Evidence | Result |
|------|----------|--------|
| Privileged mutations produce audit atomically | Verified in dashboard code | Triage and close call RPCs only. RPCs (verified in migration SQL) perform UPDATE/INSERT report_actions + INSERT audit_logs in same transaction. No "write then audit" in API. |
| Canonical audit columns | Verified in dashboard code | Migration: INSERT audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta). No admin_logs. |
| No API-layer withAudit for triage/close | Verified in dashboard code | reports.ts does not call withAudit; only RPC. |

**Verdict:** Audit is atomic and canonical. **APPROVED ✅**

---

## 5) Input validation

| Input | Validation | Evidence |
|-------|------------|----------|
| GET / query | ListReportsQuerySchema.safeParse | Verified in dashboard code; 400 on parse failure. |
| :reportId param | UUID regex | Verified in dashboard code; 400 for non-UUID. |
| POST triage body | TriageReportInputSchema.safeParse (action, reason) | Verified in dashboard code; 400 on failure; reason required. |
| POST close body | CloseReportInputSchema.safeParse (reason) | Verified in dashboard code; 400 on failure. |

**Verdict:** All inputs validated with Zod; no raw body use. **APPROVED ✅**

---

## 6) Secrets

- Service-role client only in `apps/api` (createClient with env); not exposed to admin-ui. Verified in dashboard code.
- **Verdict:** No secret leakage. **APPROVED ✅**

---

## Decision: **APPROVED ✅**

No blockers. Reports queue implementation meets security gates: no server-only code in SPA, RBAC on all routes, atomic audit via RPC, Zod on all inputs.
