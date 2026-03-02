# App test checklist — SLine Dashboard (PAGE 02 + PAGE 03)

Use this to verify the dashboard app and API after canonical audit and finance RPC changes.

---

## 1. Prerequisites

- [ ] Node/npm available; from repo root: `npm install` (or already done).
- [ ] Optional for full flows: `.env` (or env vars) with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for API; admin-ui may need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for login.

---

## 2. Build & automated tests

| Step | Command | Expected |
|------|---------|----------|
| 2.1 | `npm run -w @sline/shared test` | 17 tests pass (audit + finance schemas). |
| 2.2 | `npm run -w @sline/api test` | 9 passed, 2 skipped (finance + tasks route tests). |
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

## 5. Task activity (PAGE 02)

| Step | Action | Expected |
|------|--------|----------|
| 5.1 | Go to a task detail page that shows **Activity** (or equivalent). | Activity section loads (may be empty if no audit rows for that task). |
| 5.2 | If possible, trigger an action that writes to audit (e.g. force-cancel a task). | One new activity entry appears (canonical audit from `audit_logs`). |
| 5.3 | (API only) `GET /api/v1/tasks/:id/activity` with valid auth and task id. | 200; body is `{ ok: true, data: [ ... ] }`; each item has `id`, `action`, `actor_user_id`, `created_at`, `meta`, etc. |

---

## 6. Finance — withdrawals (PAGE 03)

| Step | Action | Expected |
|------|--------|----------|
| 6.1 | As super_admin, open Finance / Withdrawals (or equivalent). | List loads (or empty state). |
| 6.2 | Approve or reject a withdrawal (if you have a test request). | Success; single audit row written by RPC (no double audit). |
| 6.3 | (API only) `POST /api/v1/finance/withdrawals/:requestId/approve` with no auth. | 401. |
| 6.4 | (API only) Same with invalid `requestId` (e.g. not a UUID). | 400, validation error. |
| 6.5 | (API only) Same with valid auth and body `{ "reason": "OK" }`. | 200; either `{ ok: true, data: { requestId } }` or `{ ok: false, error: { code: "DATABASE_ERROR", ... } }` if DB unreachable. |

---

## 7. Optional — DB-backed integration tests

Requires real Supabase (no placeholder URL).

| Step | Command / action | Expected |
|------|------------------|----------|
| 7.1 | Set `RUN_AUDIT_INTEGRATION=1` and run `npm run -w @sline/api test`. | Task mutation → one audit row test runs (if task and DB allow). |
| 7.2 | Set `RUN_FINANCE_INTEGRATION=1` and run `npm run -w @sline/api test`. | Idempotency test runs; second approve same requestId does not double-process. |

---

## 8. Optional — E2E (Playwright)

| Step | Command | Expected |
|------|---------|----------|
| 8.1 | `npm run -w @sline/admin-ui test:e2e` (if Playwright is configured). | E2E tests pass; no critical flow regressions. |

---

## Quick copy-paste commands

```bash
# From repo root
npm install
npm run -w @sline/shared test
npm run -w @sline/api test
npm run -w @sline/api build
npm run -w @sline/admin-ui build
# Then run app
npm run dev:api    # terminal 1
npm run dev:admin  # terminal 2
```

---

*Ref: PAGE 02 + PAGE 03 implementation; `.TODO/MASTER_REPORT_2025-03-02_PAGE_02_03.md`*
