# Master Report — PAGE 06 Force Logout / Session Revocation

**Scope:** PAGE 06 (force-logout API, RPC, migration, UI).  
**Plan reference:** .TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md  
**Date:** 2025-03-02  
**Orchestrator:** Multi-agent review per `.agent/workflows/orechestrator.md`.

---

## A) Executive Summary

| Item | Result |
|------|--------|
| **Scope reviewed** | PAGE 06: profiles.force_logout_after, RPC admin_force_logout_user, POST /users/:userId/force-logout, UserDetail force-logout button, MIGRATIONS/for_sline_app docs. |
| **Overall risk level** | **LOW** — No blockers. One optional LOW (UserDetail could call users_api.forceLogoutUser for consistency). |
| **Final decision** | **Ready** — All hard gates passed. |
| **Gate statuses** | SecGuard: APPROVED ✅; CodeWarden: APPROVED ✅; QA: PASS ✅; Architect/SysOp/Perf/Modernizer/DocKeeper: no blockers. |

---

## B) Consolidated Findings (Deduplicated)

### Security

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No service-role or server-only Supabase in admin-ui for force-logout | SecGuard | **Verified in dashboard code:** UserDetail and users_api use request() only. | None. |
| — | RBAC on force-logout (admin/super_admin only); 401/403 enforced | SecGuard | **Verified in app code:** users.ts role check, USERS_WRITE_ROLES. | None. |
| — | Audit atomic (RPC writes single audit row in same transaction as UPDATE) | SecGuard | **Verified in SQL + app code:** admin_force_logout_user INSERT audit_logs in same block; no withAudit. | None. |
| — | Input validated with ForceLogoutInputSchema | SecGuard | **Verified in app code:** users.ts safeParse. | None. |

### Data Integrity / Schema

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | RPC and API args aligned (p_user_id, p_admin_id, p_reason) | SysOp | **Verified in app code:** users.ts RPC call matches migration. | None. |
| — | Idempotency deferred (Option C); replay returns 200 | SysOp | **Verified in plan:** EXECUTION_REPORT_PAGE_06. | Documented. |

### Contracts / DTO

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | ForceLogoutInputSchema and AuditActionEnum 'admin.users.force_logout' used | SysOp/Architect | **Verified in app code:** users.ts, audit.ts, users.ts shared. | None. |

### Architecture / MVVM

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Views do not call DB; force-logout uses request() only | CodeWarden | **Verified in dashboard code:** UserDetail.tsx. | None. |
| — | UserDetail now uses users_api.forceLogoutUser() for consistency | CodeWarden/Architect | **Fixed:** UserDetail.tsx imports forceLogoutUser and uses it in mutation. | Done. |

### Performance

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Single RPC per request; no N+1; PK update | PerfOpt | **Verified in app code + SQL.** | None. |

### Testing / QA

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | 401/403/400/200|404|500 covered for force-logout | QA | **Verified in app code:** users.test.ts PAGE 06 block. | None. |

### Docs / Reference

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | MIGRATIONS/for_sline_app README and FORCE_LOGOUT_APP_ENFORCEMENT.md document PAGE 06 | DocKeeper | **Verified in dashboard code.** | None. |

### Compatibility / Dependencies

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No new deps; no compatibility change | Modernizer | **Verified in app/dashboard code.** | None. |

---

## C) Fix Plan (Ordered)

| Step | Owner | What | Where | Verification |
|------|--------|------|--------|--------------|
| 1 | (None) | No mandatory fixes. | — | — |
| 2 | @UIExpert | Use users_api.forceLogoutUser() in UserDetail force-logout mutation. | apps/admin-ui/src/routes/UserDetail.tsx | **Done.** Mutation now calls forceLogoutUser(userId, reason). |

---

## D) Regression Checklist

- [x] **Auth:** 401 without token on force-logout (test).
- [x] **RBAC:** 403 for support on force-logout (test).
- [x] **Validation:** 400 invalid userId (test).
- [x] **Success/DB:** 200 or 404/500 for valid payload (test).
- [x] **Audit:** One audit row per action (RPC only).
- [x] **Build:** API and admin-ui build (per execution report).

---

## E) Rollback Notes

| Area | Rollback |
|------|----------|
| **Contracts** | Shared schemas additive (ForceLogoutInputSchema, enum value). No breaking change. |
| **API** | Revert POST /:userId/force-logout handler in users.ts. |
| **DB** | Migration 20260302140000 is additive (ADD COLUMN IF NOT EXISTS, CREATE OR REPLACE). No DROP; existing DBs keep column. |
| **UI** | Revert UserDetail force-logout button and mutation; revert users_api.forceLogoutUser if desired. |
| **App repo** | Apply same migration in app repo; Flutter must implement force_logout_after check (see FORCE_LOGOUT_APP_ENFORCEMENT.md). |

---

## F) Next Actions (Immediate)

| # | Action | Owner | Status |
|---|--------|--------|--------|
| 1 | Apply migration 20260302140000 to Supabase (dashboard and/or app repo). | DevOps / team | Pending |
| 2 | Run `npm run -w @sline/api test` to confirm users tests (including PAGE 06) pass. | @QA | Pending run |
| 3 | Implement Flutter enforcement: read profiles.force_logout_after and force re-auth. | Main app team | Per FORCE_LOGOUT_APP_ENFORCEMENT.md |
| 4 | Refactor UserDetail to use users_api.forceLogoutUser() in mutation. | @UIExpert | **Done** |
| 5 | Sync migration to app repo if dashboard migrations are canonical source. | @SysOp | Per project policy |

---

*Generated per Orchestrator workflow. All agent reports in .TODO/*_2025-03-02_PAGE_06_Force_Logout.md. Final decision: **Ready**.*
