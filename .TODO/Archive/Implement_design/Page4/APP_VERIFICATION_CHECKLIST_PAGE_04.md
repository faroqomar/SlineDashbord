# App verification checklist — PAGE 04 (Admin Identity) + report fixes

Use this to verify PAGE 04 implementation and the Master Report fix (AuthUser.role → AuthRole) on the actual app and codebase.

**Ref:** [.TODO/MASTER_REPORT_2025-03-02_PAGE_04_Admin_Identity.md](.TODO/MASTER_REPORT_2025-03-02_PAGE_04_Admin_Identity.md)

---

## 1. Prerequisites

- [ ] Node/npm available; from repo root: `npm install` (or already done).
- [ ] For running the app: `.env` (or env vars) with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the API; admin-ui may need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for login.
- [ ] (Optional) Supabase project with migration `20260302120000_admin_users.sql` applied if you want real GET /me with role from `admin_users`.

---

## 2. Build & typecheck

| Step | Command | Expected |
|------|---------|----------|
| 2.1 | `npm run -w apps/api typecheck` | Exits 0 (no TypeScript errors). |
| 2.2 | `npm run -w @sline/admin-ui build` (or `npm run -w apps/admin-ui build`) | Build succeeds. |
| 2.3 | (Optional) `npm run build` at root | Turbo builds all workspaces. |

---

## 3. Automated tests

| Step | Command | Expected |
|------|---------|----------|
| 3.1 | `npm run -w @sline/shared test` | All tests pass (includes auth schema tests). |
| 3.2 | `npm run -w @sline/api test` | API tests pass (auth, finance, tasks, etc.); some may be skipped (e.g. DB-dependent). |
| 3.3 | In API test output, confirm auth tests run | e.g. auth.test.ts: 401 no token, 401 invalid token, 403 support on finance approve, 200 GET /me, 200 GET /users as support, 200 finance approve as super_admin. |

---

## 4. Code verification (what was implemented)

| Step | What to check | Expected |
|------|----------------|----------|
| 4.1 | `apps/api/src/auth.ts`: `AuthRole` and `AuthUser.role` | `AuthRole = AdminRole \| 'authenticated'`; `AuthUser { role: AuthRole }`. |
| 4.2 | `packages/shared/src/schemas/auth.ts` | `AdminRoleEnum`, `AuthMeUserSchema`, `AuthMeResponseSchema` exist and are exported. |
| 4.3 | `apps/api/src/routes/auth.ts` | GET /me validates response with `AuthMeResponseSchema` before sending. |
| 4.4 | `apps/api/src/auth.ts` | After token verification, role is resolved from `admin_users` and validated with `AdminRoleEnum.safeParse`; invalid → `'authenticated'`. |
| 4.5 | Grep: `admin_users` or `service_role` in `apps/admin-ui/src` | 0 matches (admin-ui never talks to admin_users or service-role). |
| 4.6 | `supabase/migrations/20260302120000_admin_users.sql` | Exists; defines `admin_role_enum`, table `admin_users`, RLS. |

---

## 5. Run the app locally

| Step | Command | What to check |
|------|---------|----------------|
| 5.1 | Terminal 1: `npm run dev:api` or `npm run dev -w @sline/api` | API starts; `GET /health` returns 200. |
| 5.2 | Terminal 2: `npm run dev:admin` or `npm run dev -w @sline/admin-ui` | Admin UI starts; login page loads. |

---

## 6. Auth & GET /me (manual)

| Step | Action | Expected |
|------|--------|----------|
| 6.1 | Call `GET /api/v1/auth/me` with **no** cookie/Authorization header. | 401 Unauthorized. |
| 6.2 | Log in via admin UI (Supabase auth), then call `GET /api/v1/auth/me` with the session cookie (or same-origin request so cookie is sent). | 200; body matches `AuthMeResponseSchema`: `{ user: { id, email?, role }, ok: true }`; `role` is an admin role (e.g. `super_admin`, `admin`) if user is in `admin_users`, or `'authenticated'` if not. |
| 6.3 | Open admin UI without logging in; go to a protected route (e.g. dashboard, users, finance). | Redirect to login or 401. |
| 6.4 | Log in with a user that exists in `admin_users` with role e.g. `super_admin`. | Dashboard (or home) loads; no 401 on protected pages. |

---

## 7. RBAC (manual)

| Step | Action | Expected |
|------|--------|----------|
| 7.1 | As a user with role **support**: open Finance → Withdrawals and try to approve/reject a withdrawal (or call `POST .../withdrawals/:id/approve` with support session). | 403 Forbidden. |
| 7.2 | As a user with role **super_admin** (or admin): same approve/reject. | 200 (or success). |
| 7.3 | As **support**: open Users list (or `GET /api/v1/users` with support session). | 200; list loads. |
| 7.4 | Call `GET /api/v1/users` with no auth. | 401. |

---

## 8. Optional — DB and migration

| Step | Action | Expected |
|------|--------|----------|
| 8.1 | If using real Supabase: ensure migration `20260302120000_admin_users.sql` is applied. | Table `admin_users` exists; enum `admin_role_enum` has expected values. |
| 8.2 | After login, confirm GET /me returns a role from `admin_users` for that user (not only `'authenticated'`). | Role is one of the enum values (e.g. `super_admin`, `admin`, `support`). |

---

## Quick copy-paste commands

```bash
# From repo root
npm install
npm run -w apps/api typecheck
npm run -w @sline/admin-ui build
npm run -w @sline/shared test
npm run -w @sline/api test

# Run app
npm run dev:api    # terminal 1
npm run dev:admin  # terminal 2
```

---

## Summary of what this checklist verifies

- **PAGE 04:** `admin_users` as source of truth, shared auth schemas, API GET /me and role resolution, RBAC (401/403/200).
- **Report fix:** `AuthUser.role` typed as `AuthRole` (`AdminRole | 'authenticated'`) in `apps/api/src/auth.ts`; typecheck and tests still pass.

*Ref: PAGE 04 implementation; Master Report 2025-03-02; MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md*
