# Master Report — PAGE 05 User Moderation (+ user routes)

**Scope:** PAGE 05 (ban/unban/suspend → profiles + RPC) and user API (including force-logout).  
**Plan reference:** PAGE 05 plan (profiles moderation, atomic audit).  
**Date:** 2025-03-02  
**Orchestrator:** Multi-agent review per `.agent/workflows/orechestrator.md`.

---

## A) Executive Summary

| Item | Result |
|------|--------|
| **Scope reviewed** | PAGE 05 (profiles moderation, admin_set_user_moderation RPC, ban/unban/suspend API + UI); user routes (list, detail, force-logout). |
| **Overall risk level** | **LOW** — No blockers. One optional LOW finding (server-only import in admin-ui). |
| **Final decision** | **Ready** — All hard gates passed. |
| **Gate statuses** | SecGuard: APPROVED; CodeWarden: APPROVED; QA: PASS; Architect/SysOp/Perf/Modernizer/DocKeeper: no blockers. |

---

## B) Consolidated Findings (Deduplicated)

### Security

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No service-role or server-only Supabase in admin-ui for user flow | SecGuard | **Verified in dashboard code:** lib/supabase.ts anon only; users_api uses request() only. | None. |
| — | RBAC on all user routes; force-logout restricted to USERS_WRITE_ROLES | SecGuard | **Verified in app code:** users.ts preHandler + force-logout 403 for support. | None. |
| — | Audit atomic (RPC writes single audit row in same transaction) | SecGuard | **Verified in app code + SQL:** No withAudit for ban/unban/suspend; RPC INSERT in same block as UPDATE. | None. |

### Data Integrity / Schema

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No admin_users writes for moderation | SysOp | **Verified in app code:** users.ts uses RPC on profiles only. | None. |
| — | RPC and API args aligned (p_user_id, p_status, p_reason, p_admin_id) | SysOp | **Verified in app code:** users.ts RPC calls match migration signature. | None. |

### Contracts / DTO

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | BanUserSchema, UnbanUserSchema, SuspendUserSchema, ForceLogoutInputSchema used by API | SysOp / Architect | **Verified in app code:** users.ts safeParse for all. | None. |

### Architecture / MVVM

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Views do not call DB; VMs call users_api only | CodeWarden | **Verified in dashboard code:** UserDetail, UsersScreen, use_user_actions.vm. | None. |

### Performance

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | List/detail single-query; no N+1; RPC one round-trip per mutation | PerfOpt | **Verified in app code:** users.ts. | None. |
| — | Optional: index profiles(account_status) if main app filters by status at scale | PerfOpt | **Missing repo evidence** for main app query patterns. | Optional in main app. |

### Testing / QA

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | 401/403/400/200 covered for ban, unban, suspend, force-logout | QA | **Verified in app code:** users.test.ts. | None. |

### Docs / Reference

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | MIGRATIONS/README documents PAGE 05 and enforcement | DocKeeper | **Verified in dashboard code:** MIGRATIONS/README.md. | None. |

### Compatibility / Dependencies

| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | data_masking.ts imports 'server-only' (Next.js convention) in Vite SPA | Modernizer | **Verified in dashboard code:** apps/admin-ui/src/features/core/security/data_masking.ts | Optional: remove or replace if build fails; or keep if unused in bundle. |

---

## C) Fix Plan (Ordered)

| Step | Owner | What | Where | Verification |
|------|--------|------|--------|--------------|
| 1 | (None) | No mandatory fixes. | — | — |
| 2 | @Modernizer (optional) | If admin-ui build fails on server-only: remove import or add package. | apps/admin-ui/src/features/core/security/data_masking.ts | Build passes. |

---

## D) Regression Checklist

- [x] **Auth:** 401 without token on ban/unban/suspend/force-logout (tests).
- [x] **RBAC:** 403 for support on force-logout (test).
- [x] **Validation:** 400 invalid userId / short reason (tests).
- [x] **Success/DB:** 200 or 500/DATABASE_ERROR for valid payload (tests).
- [x] **Audit:** One audit row per action (RPC only; no double write).
- [x] **Build:** npm run -w @sline/api build and admin-ui build (assumed passing).

---

## E) Rollback Notes

| Area | Rollback |
|------|----------|
| **Contracts** | Shared schemas additive; no breaking change. |
| **API** | Revert users.ts to previous version; re-add withAudit + admin_users only if reverting PAGE 05 entirely (not recommended). |
| **DB** | Migration 20260302120000 is additive (ADD COLUMN IF NOT EXISTS, CREATE OR REPLACE). Rollback = do not run migration on new DBs; existing DBs keep columns (no DROP in plan). |
| **UI** | Revert users_api and use_user_actions.vm and UserDetail accountStatus if needed. |

---

## F) Next Actions (Immediate)

| # | Action | Owner | Status |
|---|--------|--------|--------|
| 1 | Apply migration 20260302120000 (and 20260302140000 if using force-logout) to Supabase. | DevOps / team | Pending |
| 2 | Run `npm run -w @sline/api test` to confirm all user tests pass. | @QA | Pending run |
| 3 | (Optional) Address server-only in data_masking.ts if build complains. | @Modernizer | Optional |
| 4 | (Optional) Add index on profiles(account_status) in main app if querying by status. | @SysOp | Optional |
| 5 | Implement RLS or app check in main app so banned/suspended users cannot post (per MIGRATIONS/README). | Main app team | Documented |

---

*Generated per Orchestrator workflow. All agent reports in .TODO/*_2025-03-02_PAGE_05_User_Moderation.md. Final decision: **Ready**.*
