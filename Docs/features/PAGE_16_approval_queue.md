# PAGE 16 — Approval queue (Dual approval for dangerous ops)

> **Status**: v1  
> **See also**: [Docs/ADMIN_APPROVALS.md](../../Docs/ADMIN_APPROVALS.md) (decisions, thresholds, RPC mapping)

## Purpose

Dangerous finance operations (wallet adjust above threshold, reversal, large refund) require **two admins**: one requests, a **different** admin approves, then only the **requester** may execute. This reduces single-point-of-failure and enforces audit and idempotency.

**Who it’s for**: Admins and Super Admins (finance write roles). Support cannot access the approval queue.

---

## Routes / screens

| Route | Screen | Description |
|-------|--------|-------------|
| `/finance` | Finance | Entry; link to “Approval queue”. |
| `/finance/approvals` | Approval queue | List pending/approved/rejected approvals; Approve / Reject as second admin. |

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/finance/approvals` | List approvals (cursor, optional status). |
| `POST` | `/api/v1/finance/approvals` | Create approval request (requires `Idempotency-Key` header). |
| `POST` | `/api/v1/finance/approvals/:id/approve` | Approve (second person only). |
| `POST` | `/api/v1/finance/approvals/:id/reject` | Reject (second person only). |
| `POST` | `/api/v1/finance/wallets/:userId/adjust` | Execute wallet adjust when amount ≥ threshold (requires `approval_id`; only requester). |

---

## ViewModels

| Hook | Purpose |
|------|---------|
| `useApprovalsVM()` | List items, nextCursor, loading, error, loadingActionId; `loadApprovals(cursor?)`, `approve(id, reason?)`, `reject(id, reason?)`, `clearError()`. |

---

## Special rules

- **Idempotency**: Create approval requires `Idempotency-Key` header; replay returns same approval row.
- **Second person**: Approve/reject must be done by an admin who is **not** the requester (enforced in RPC and API).
- **Executor**: Only the **requester** may call the execute endpoint (e.g. wallet adjust with that `approval_id`).
- **Double execute**: RPC sets `consumed_at` on first execute; second execute returns 409.
- **Audit**: All request / approve / reject / execute actions write to `audit_logs` in the same transaction as the RPC.
- **RBAC**: All approval and wallet-adjust endpoints require `admin` or `super_admin`.

---

## DB / migrations

- **Migration**: `MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql`
- **Table**: `admin_approvals` (RLS: service_role only)
- **RPCs**: `admin_request_approval`, `admin_approve_or_reject_approval`, `admin_adjust_wallet`
- **Cross-ref**: [MIGRATIONS/README.md](../../MIGRATIONS/README.md), [ADMIN_APPROVALS.md](../ADMIN_APPROVALS.md), [ADMIN_DATABASE_REF.md](../ADMIN_DATABASE_REF.md).

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See [ADMIN_DEVELOPER_GUIDE.md](../ADMIN_DEVELOPER_GUIDE.md) for the documentation index.*
