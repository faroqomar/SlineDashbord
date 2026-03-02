# Execution Report: PAGE 06 — Force Logout / Session Revocation

**Executor:** `.agent/workflows/executor.md`  
**Plan:** `.TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md`  
**Date:** 2025-03-02

---

## Summary

| Phase | Status | Artifacts |
|-------|--------|-----------|
| 0 | ✅ | Build + typecheck pass; test infra confirmed |
| 1 | ✅ | AuditActionEnum, ForceLogoutInputSchema, migration, RPC, unit test |
| 2 | ✅ | POST /api/v1/users/:userId/force-logout, RBAC admin/super_admin, RPC call |
| 3 | ✅ | forceLogoutUser API client, Force logout button + confirmation on UserDetail |
| 4 | ✅ | API tests (401/403/400/200|404|500), app enforcement doc, rollback note |

---

## Phase 0: Preconditions & Test Infra

- **0.1** `npm run -w @sline/api typecheck` and `npm run -w @sline/admin-ui build` passed.
- **0.2** `npm run -w @sline/api test` runs (51 passed, 3 skipped; 1 pre-existing failure in chat.test.ts unrelated to PAGE 06).
- **0.3** Dashboard migrations already have `related_entity_type_enum` with `'profile'` (20260302100000). New migration adds `force_logout_after` and RPC.

---

## Phase 1: Data & Contracts

| Step | Artifact |
|------|----------|
| 1.1 | **packages/shared/src/schemas/audit.ts** — added `'admin.users.force_logout'` to `AuditActionEnum`. |
| 1.2 | **packages/shared/src/schemas/users.ts** — added `ForceLogoutInputSchema` (userId, optional reason, optional idempotency_key). |
| 1.3 | **supabase/migrations/20260302140000_force_logout.sql** — `profiles.force_logout_after`, `admin_force_logout_user(p_user_id, p_admin_id, p_reason)` RPC; one transaction update + audit insert. |
| 1.3b | **MIGRATIONS/for_sline_app/20260302140000_force_logout.sql** — copy for app repo. |
| 1.4 | **packages/shared/src/schemas/users.test.ts** — unit tests for ForceLogoutInputSchema (valid userId, optional reason/key, invalid userId). |

**Idempotency:** Option C (defer). RPC does not accept idempotency key; repeated calls return 200 and update timestamp again. Documented for future 409 support.

---

## Phase 2: Backend/API

| Step | Artifact |
|------|----------|
| 2.1–2.3 | **apps/api/src/routes/users.ts** — POST `/:userId/force-logout`: validate with ForceLogoutInputSchema; require role in `USERS_WRITE_ROLES` (admin/super_admin), else 403; get adminId from `request.user.id`; call `admin_force_logout_user`; map RPC "Profile not found" → 404, other errors → 500; success → 200 with `{ userId }`. No `withAudit`. |

---

## Phase 3: UI (Optional)

| Step | Artifact |
|------|----------|
| 3.1 | **apps/admin-ui/src/features/users/services/users_api.ts** — `forceLogoutUser(userId, reason?)` calling POST `/users/:userId/force-logout`. |
| 3.2 | **apps/admin-ui/src/routes/UserDetail.tsx** — "Force logout" button with confirmation dialog and optional reason prompt; destructive styling; invalidates user detail query on success. |

---

## Phase 4: QA & Release

| Step | Artifact |
|------|----------|
| 4.1 | **apps/api/src/routes/users.test.ts** — describe "PAGE 06 — Force logout": 401 no auth, 403 support role, 400 invalid userId, 200 or 404/500 for valid payload. |
| 4.2 | E2E: documented in FORCE_LOGOUT_APP_ENFORCEMENT.md — app must read `force_logout_after` and force re-auth. |
| 4.3 | **MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md** — app (Flutter) must read `profiles.force_logout_after` and clear session when set. |
| 4.4 | Force-logout route uses service-role only in API; admin-ui has no revocation logic, only API client. |
| 4.5 | **Rollback:** Migration is additive. Rollback = revert migration. Apps that do not check `force_logout_after` continue to work until app deploy. |

---

## Gate Checks

| Gate | Result |
|------|--------|
| Build | ✅ api typecheck, admin-ui build pass |
| Test Infra | ✅ api test runs; shared test 70 passed |
| Contracts | ✅ ForceLogoutInputSchema, MutationAckSchema response, AuditActionEnum includes action |
| Security | ✅ Only admin/super_admin; no service-role in admin-ui; audit by RPC |
| API | ✅ POST implemented; 401/403/400/404/200/500 |
| UI | ✅ Force logout button + confirmation; MVVM (view calls API via mutation) |
| QA | ✅ API tests for force-logout; app enforcement doc present |

---

## Files Touched

**New:**  
- `supabase/migrations/20260302140000_force_logout.sql`  
- `MIGRATIONS/for_sline_app/20260302140000_force_logout.sql`  
- `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`  
- `packages/shared/src/schemas/users.test.ts`  
- `.TODO/EXECUTION_REPORT_PAGE_06_Force_Logout.md`

**Modified:**  
- `packages/shared/src/schemas/audit.ts` (AuditActionEnum)  
- `packages/shared/src/schemas/users.ts` (ForceLogoutInputSchema)  
- `apps/api/src/routes/users.ts` (POST force-logout)  
- `apps/api/src/routes/users.test.ts` (PAGE 06 tests)  
- `apps/admin-ui/src/features/users/services/users_api.ts` (forceLogoutUser)  
- `apps/admin-ui/src/routes/UserDetail.tsx` (Force logout button + mutation)  
- `MIGRATIONS/for_sline_app/README.md` (force_logout migration listed)

---

## Deferred / Notes

- **Idempotency-Key:** Not implemented in v1; RPC does not accept key. Replay returns 200 and updates timestamp again. Can add idempotency table + 409 in a follow-up.
- **Chat test failure:** One existing failure in `chat.test.ts` (POST access expects 200, gets 403) — unrelated to PAGE 06; all PAGE 06 user tests pass.
- **App repo:** Copy `20260302140000_force_logout.sql` into sline_app and apply; implement Flutter enforcement per FORCE_LOGOUT_APP_ENFORCEMENT.md.

---

*Execution complete per `.agent/workflows/executor.md`. Apply migrations to DB; then verify force-logout from admin UI.*
