# Checklist — Verify PAGE 16 Master Report Fixes (on actual app)

Use this to confirm all fixes work in the running admin-ui and API.

---

## Prerequisites

- [ ] API runs: `npm run dev` (or start from `apps/api`)
- [ ] Admin UI runs: `npm run dev` (or start from `apps/admin-ui`)
- [ ] You can log in as an admin or super_admin

---

## 1. API — Typed request & finance routes

- [ ] **No runtime errors** when hitting finance endpoints (approvals, withdrawals, wallet adjust) — typed `request.user` is used; auth still works.
- [ ] **GET /api/v1/finance/approvals** (with valid auth): returns 200 with `{ ok: true, data: { items, next_cursor } }` (or 500 if DB/table missing).
- [ ] **POST /api/v1/finance/approvals** with `Idempotency-Key` header and valid body: returns 201 with approval row (or 500 if DB missing).
- [ ] **POST /api/v1/finance/approvals/:id/approve** as a *different* admin: returns 200 (or 404/422 if approval missing or already resolved).
- [ ] **POST /api/v1/finance/wallets/:userId/adjust** with large amount and no `approval_id`: returns 403 “Approval required”.
- [ ] **Unit/integration tests**: run `npm run test --workspace=@sline/api -- --run routes/finance.test` → all non-skipped tests pass.

---

## 2. Admin UI — Approval queue & types

- [ ] **Finance dashboard**: open `/finance` → “Approval queue” button/link is visible and points to `/finance/approvals`.
- [ ] **Approval queue page**: open `/finance/approvals` (while logged in) → page shows “Approval queue” title and description; no blank or crash.
- [ ] **Back link**: “Back to Finance” link is present and goes to `/finance`.
- [ ] **List/actions**: if there are pending approvals, Approve/Reject buttons work and toasts appear; list refreshes after action.
- [ ] **Typecheck**: `cd apps/admin-ui && npm run typecheck` passes (no type errors for `/finance/approvals` or shared types).

---

## 3. Shared types (admin-ui ← @sline/shared)

- [ ] **No duplicate types**: `apps/admin-ui/src/features/finance/services/finance_api.ts` imports `ApprovalRow` and `ApprovalRequest` from `@sline/shared` and re-exports them (no local interface definitions for those).
- [ ] **Approval queue table**: rows render without type/runtime errors (ids, status, dates, etc.).

---

## 4. Docs & feature list

- [ ] **Feature doc exists**: `docs/features/PAGE_16_approval_queue.md` exists and describes purpose, routes, API, ViewModels, rules, and DB/migrations.
- [ ] **Feature list**: `docs/features/README.md` includes `PAGE_16_approval_queue.md` in “Current feature docs”.

---

## 5. E2E (Playwright)

- [ ] **Run E2E**: `cd apps/admin-ui && npm run test:e2e` (or `npx playwright test`).
- [ ] **finance-approvals.spec.ts**: at least one of:
  - When not logged in: navigating to `/finance/approvals` redirects to login, or
  - When logged in: approval queue page shows “Approval queue” heading and “Back to Finance” link.

---

## 6. Optional — Integration tests (real DB)

If you have a real Supabase DB and set `RUN_FINANCE_INTEGRATION=1`:

- [ ] **Idempotency**: POST `/api/v1/finance/approvals` twice with same `Idempotency-Key` → second response returns same approval `id` (200/201).
- [ ] **Execute twice**: create approval → approve as second user → execute wallet adjust as requester → execute again → API returns **409** with `error.code === 'CONFLICT'`.

---

## 7. Quick smoke (minimal)

If you only do a quick pass:

1. [ ] Log in to admin-ui → go to **Finance** → click **Approval queue** → page loads.
2. [ ] API finance tests: `npm run test --workspace=@sline/api -- --run routes/finance.test` → 31 passed, 3 skipped.
3. [ ] Admin-ui typecheck: `cd apps/admin-ui && npm run typecheck` → passes.

---

*After verification, you can tick off or archive this checklist.*
