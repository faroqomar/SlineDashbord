# PAGE 16 — E2E fixtures for approval queue

For Playwright or manual E2E of the dual-approval flow:

## Fixture data (apply in test DB or seed)

- **2 admin users** (e.g. A and B) in `admin_users` (or auth.users + admin_users):
  - A: `id = 00000000-0000-0000-0000-0000000000a1`, role `admin`
  - B: `id = 00000000-0000-0000-0000-0000000000a2`, role `admin`
- **1 pending approval** row in `admin_approvals`:
  - `requested_by` = A
  - `status` = `pending`
  - `operation_type` = `wallet_adjust`
  - `target_entity_type` = `profile`, `target_entity_id` = some user UUID
  - `idempotency_key` = `e2e-pending-1`
- **1 approved approval** (for execute test):
  - `requested_by` = A, `approved_by` = B, `status` = `approved`
  - `consumed_at` = NULL (so execute can run once)
  - `idempotency_key` = `e2e-approved-1`

## Flow to test

1. Log in as A → create approval request (wallet_adjust, above threshold) → see "Pending approval".
2. Log in as B → open Approval queue → approve the pending item.
3. Log in as A → open Finance / wallet adjust (or approval queue) → execute with the approved approval_id → success.
4. As A, try to execute again with same approval_id → 409 or error (already consumed).
5. As A, try to approve own request (same user) → 403.

## Artifact path

E2E screenshots/logs on failure: `apps/admin-ui/e2e/artifacts` (create dir if needed).

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See [ADMIN_DEVELOPER_GUIDE.md](./ADMIN_DEVELOPER_GUIDE.md) for the documentation index. See [ADMIN_APPROVALS.md](./ADMIN_APPROVALS.md) and [features/PAGE_16_approval_queue.md](./features/PAGE_16_approval_queue.md).*
