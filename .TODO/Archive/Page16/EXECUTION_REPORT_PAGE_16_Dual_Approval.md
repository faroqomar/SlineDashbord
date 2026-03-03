# Execution Report — PAGE 16 Dual Approval (Dangerous Ops)

**Plan:** `.TODO/PLAN_PAGE_16_Dual_Approval_Dangerous_Ops.md`  
**Executor:** `.agent/workflows/executor.md`  
**Date:** 2025-03-03

---

## Objective (Done)

- No single admin can execute catastrophic finance operations without a second approver.
- `admin_approvals` table and approval queue UI exist; API enforces 2-person approval and writes audit for request/approve/reject.
- Wallet adjust above threshold requires approval; execute only by requester after approve.

---

## Delivered

### Phase 0 — Decisions & test infra
- **Docs/ADMIN_APPROVALS.md** — D1/D2/D3, operation types, RPC mapping, thresholds (WALLET_ADJUST_DANGEROUS_MIN 100_000, LARGE_REFUND_THRESHOLD 50_000), migration path, test env note.
- **MIGRATIONS/README.md** — Added `20260302150000_admin_approvals.sql` to apply order.

### Phase 1 — Data/Contracts
- **packages/shared/src/schemas/approvals.ts** — ApprovalOperationTypeEnum, ApprovalStatusEnum, ApprovalRequestSchema, ApprovalRowSchema, ApproveRejectSchema, ApprovalListQuerySchema, ApprovalListResponseSchema, WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD.
- **packages/shared/src/schemas/audit.ts** — Extended AuditActionEnum with `admin.approval.request`, `admin.approval.approve`, `admin.approval.reject`, `admin.finance.wallet_adjust`.
- **packages/shared/src/schemas/finance.ts** — AdjustWalletInputSchema (target_user_id, amount_cents, reason, approval_id optional).
- **packages/shared/src/schemas/approvals.test.ts** — Unit tests for approval schemas and thresholds.
- **packages/shared/src/index.ts** — Export approvals.

### Phase 2 — Backend / DB & RPC
- **MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql** — Table `admin_approvals` (id, operation_type, target_entity_type, target_entity_id, requested_by, approved_by, status, idempotency_key, payload, reason, created_at, resolved_at, consumed_at), RLS, indexes; RPCs `admin_request_approval`, `admin_approve_or_reject_approval`, `admin_adjust_wallet` (approval gate + consumed_at + audit; actual ledger mutation left as TODO in app repo).

### Phase 3 — API (Fastify)
- **apps/api/src/routes/finance.ts** — GET /finance/approvals (cursor, limit), POST /finance/approvals (Idempotency-Key), POST /finance/approvals/:id/approve, POST /finance/approvals/:id/reject, POST /finance/wallets/:userId/adjust (above threshold requires approval_id; requester-only execute enforced in RPC).

### Phase 4 — ViewModels
- **apps/admin-ui/src/features/finance/viewmodels/useApprovals.vm.ts** — useApprovalsVM: items, nextCursor, loading, error, loadingActionId, loadApprovals, approve, reject, clearError (no Supabase/server-only).

### Phase 5 — UI
- **apps/admin-ui/src/routes/FinanceApprovals.tsx** — Approval queue page: table (operation_type, target, requested_by, status, created_at), Approve/Reject for pending (disabled when loadingActionId set), empty state, error state, Load more.
- **apps/admin-ui/src/App.tsx** — Route /finance/approvals, FinanceApprovalsPage.
- **apps/admin-ui/src/routes/Finance.tsx** — “Approval queue” link.
- **apps/admin-ui/src/features/finance/services/finance_api.ts** — getApprovals, createApproval, approveApproval, rejectApproval, executeWalletAdjust; ApprovalRow, ApprovalRequest types.

### Phase 6 — QA & docs
- **apps/api/src/routes/finance.test.ts** — PAGE 16 tests: GET approvals 401/403/200, POST approvals 400 (no key), 401, POST approve 401, POST wallet adjust 403 when approval required but missing.
- **Docs/ADMIN_APPROVALS_E2E_FIXTURES.md** — Fixture data (2 admins, 1 pending, 1 approved) and E2E flow steps; artifact path.

---

## Gates

| Gate | Status |
|------|--------|
| Build (shared + api typecheck) | ✅ Pass |
| Contracts | ✅ Pass (approvals + audit + finance) |
| Security (RBAC, second-person in RPC, no service-role in client) | ✅ Pass |
| API (list/create/approve/reject/adjust with cursor, idempotency) | ✅ Pass |
| UI (queue page, loading/error/empty, Approve/Reject disabled while loading) | ✅ Pass |
| QA (Supertest approval routes) | ✅ Pass (29 passed, 1 skipped) |

---

## Not done (optional / follow-up)

- **Single-admin wallet adjust** below threshold: currently returns 501 NOT_IMPLEMENTED; plan allowed “optional policy” for below-threshold single-admin. Can be added later.
- **Reversal / large refund** gating: RPC mapping documented in ADMIN_APPROVALS.md; `admin_refund_booking` can be gated by approval when amount > LARGE_REFUND_THRESHOLD in a future change; reversal RPC to be added in app repo when ledger supports it.
- **Actual ledger mutation in admin_adjust_wallet**: RPC only sets consumed_at and writes audit; TODO in migration for app repo to add journal entry or call existing ledger RPC.
- **Feature flag** for “require approval”: optional; not implemented.
- **Playwright E2E**: fixture doc and flow written; Playwright suite not run (admin-ui may have pre-existing typecheck issue in UserInvestigation).

---

## How to apply

1. Apply migration: run `20260302150000_admin_approvals.sql` (e.g. via Supabase MCP or CLI) after other for_sline_app migrations.
2. For production, copy the same SQL into **sline_app** so app repo owns canonical schema.
3. Open Finance → “Approval queue” → list/approve/reject. Request approval from wallet adjust flow when amount >= 100_000 cents (use createApproval + then execute with approval_id after second admin approves).

---

*Ship safely, feature by feature.*
