# App test checklist — SLine Dashboard

Use this to verify the dashboard app and API after changes. Aligns with `.agent/workflows/architecture/doc_keeper.md` and `Docs/ADMIN_SETUP_GUIDE.md`.

---

## 1. Prerequisites

- [ ] Node/npm available; from repo root: `npm install` (or already done).
- [ ] Optional for full flows: `.env` (or env vars) with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for API; admin-ui may need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for login.

---

## 2. Build & automated tests

| Step | Command | Expected |
|------|---------|----------|
| 2.1 | `npm run -w @sline/shared test` | Shared schema tests pass (audit, finance, etc.). |
| 2.2 | `npm run -w @sline/api test -- --run` | API route tests pass (auth, finance, tasks, users, bookings, cases, reports, chat). |
| 2.3 | `npm run -w @sline/api build` | Build succeeds (no TypeScript errors). |
| 2.4 | `npm run -w @sline/admin-ui build` | `tsc && vite build` succeeds. |
| 2.5 | (Optional) `npm run -w @sline/admin-ui test` | If present, unit/vitest tests pass. |
| 2.6 | (Optional) `npm run build` (root) | Turbo builds all workspaces. |

---

## 3. Run app locally

| Step | Command | What to check |
|------|---------|----------------|
| 3.1 | `npm run dev:api` (or `npm run dev -w @sline/api`) | API starts; `GET /health` returns 200. |
| 3.2 | In another terminal: `npm run dev:admin` (or `npm run dev -w @sline/admin-ui`) | Admin UI starts; login page loads. |

---

## 4. Auth & protected routes

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | Open admin UI; do **not** log in. Visit a protected route (e.g. tasks or finance). | Redirect to login or 401. |
| 4.2 | Log in with valid Supabase-backed user (admin/super_admin). | Dashboard or home loads; no 401 on protected pages. |

---

## 5. Feature smoke (optional)

| Area | Action | Expected |
|------|--------|----------|
| Task activity | Go to task detail → Activity section | Loads (may be empty); no errors. |
| Finance | Open Finance / Withdrawals | List or empty state; approve/reject if test data exists. |
| Users | Open Users; user detail; ban/suspend/force-logout (if role allows) | List/detail load; actions return success or expected error. |
| Bookings | Open Bookings; detail; cancel/refund if available | List/detail load; RPC-backed actions work. |
| Cases | Open Cases | List or empty state. |
| Reports | Open Reports queue | List or empty state. |

---

## 6. Optional — DB-backed integration tests

Requires real Supabase (no placeholder URL).

| Step | Command / action | Expected |
|------|------------------|----------|
| 6.1 | Set `RUN_AUDIT_INTEGRATION=1` and run `npm run -w @sline/api test`. | Task mutation → one audit row test runs (if task and DB allow). |
| 6.2 | Set `RUN_FINANCE_INTEGRATION=1` and run `npm run -w @sline/api test`. | Idempotency test runs; second approve same requestId does not double-process. |

---

## 7. Optional — E2E (Playwright)

| Step | Command | Expected |
|------|---------|----------|
| 7.1 | `npm run -w @sline/admin-ui test:e2e` (if Playwright is configured). | E2E tests pass; no critical flow regressions. |

---

## Quick copy-paste commands

```bash
# From repo root
npm install
npm run -w @sline/shared test
npm run -w @sline/api test -- --run
npm run -w @sline/api build
npm run -w @sline/admin-ui build
# Then run app
npm run dev:api    # terminal 1
npm run dev:admin  # terminal 2
```

---

*Ref: `Docs/ADMIN_SETUP_GUIDE.md`, `.agent/workflows/architecture/doc_keeper.md`*
