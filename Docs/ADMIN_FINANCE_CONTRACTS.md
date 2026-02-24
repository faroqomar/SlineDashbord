# Admin Finance Contracts & Decisions (@Architect)

This document serves as the absolute source of truth for the data contracts, security rules, and pagination standards for the SLine Admin Finance module. It fulfills the requirements of **Phase 0** from the Payment Gateway & Booking Linkage plan.

## 1. RBAC Permissions for Finance

The system enforces strict Role-Based Access Control via `profiles.role`. The Admin Server Actions MUST validate against these definitions:

| Access Type              | Allowed Roles                                  | Description                                                                                                                                        |
| :----------------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Masked Reads**         | `support`, `moderator`, `admin`, `super_admin` | Can view transaction lists, overviews, and basic traces where sensitive gateway meta is masked (e.g., `meta_masked`).                              |
| **Unmasked Reads**       | `admin`, `super_admin`                         | Can call `getTransactionDetails` to expose `meta_full`. **Requirement**: MUST trigger an audit log event (`admin.finance.tx_view_sensitive_meta`). |
| **Write: Freeze Wallet** | `admin`, `super_admin`                         | Can toggle `profile.is_wallet_frozen`.                                                                                                             |
| **Write: Withdrawals**   | `super_admin`                                  | Can approve/reject `withdrawal_requests`.                                                                                                          |

## 2. Standardized Audit Table

To eliminate fragmentation between `admin_logs` and `audit_logs`, the system will exclusively use **`audit_logs`**.

**Required Table Structure assumptions:**

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `actor_id` (uuid, FK to auth.users - The admin performing the action)
- `event_type` (text - e.g., `admin.wallet_freeze`, `admin.finance.tx_view_sensitive_meta`, `admin.withdrawal_approve`)
- `target_id` (uuid, optional - the affected user, journal, or withdrawal)
- `metadata` (jsonb, optional - reason, previous state)

## 3. Deterministic Ledger Event Patterns & Extraction Rules

The Database View (`vw_admin_journal_ledger`) MUST compute `payer_user_id`, `payee_user_id`, `gross_amount`, `fee_amount`, and `net_amount` exactly according to these event patterns based on the `ledger_lines` joined to `accounts`.

| Event Type               | Debit Account (Source)           | Credit Account (Destination)                                       | Extraction Formula (for View)                                                                                                                                         |
| :----------------------- | :------------------------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`deposit`**            | Gateway/External                 | `user_available:{client_id}` + `platform_cash`                     | Payer: None (External)<br>Payee: `user_available` owner<br>Gross: Total Credit<br>Net: Total Credit<br>Fee: 0                                                         |
| **`escrow_hold`**        | `user_available:{client_id}`     | `platform_escrow`                                                  | Payer: `user_available` owner<br>Payee: None (Held)<br>Gross: Total Debit<br>Net: 0<br>Fee: 0                                                                         |
| **`release_with_fee`**   | `platform_escrow`                | `user_available:{freelancer_id}` (Net)<br>`platform_revenue` (Fee) | Payer: Original Booking Client (from Entity)<br>Payee: `user_available` owner<br>Gross: Total Debit<br>Net: `user_available` Credit<br>Fee: `platform_revenue` Credit |
| **`refund`**             | `platform_escrow`                | `user_available:{client_id}`                                       | Payer: None (Refund)<br>Payee: `user_available` owner<br>Gross: Total Credit<br>Net: Total Credit<br>Fee: 0                                                           |
| **`withdrawal_request`** | `user_available:{freelancer_id}` | `user_pending_withdrawal:{freelancer_id}`                          | Payer: `user_available` owner<br>Payee: None<br>Gross: Total Debit<br>Net: 0<br>Fee: 0                                                                                |

_(Note: The view must compute payer/payee deterministically by looking at the account types (`user_available`, etc.) of the connected `ledger_lines`)._

## 4. Cursor Pagination Contract

To guarantee perfect pagination without duplicated or skipped rows during high-velocity writes, Finance API endpoints and SQL Views must use strict cursor logic.

- **Cursor Format**: A JSON object stringified/base64 encoded containing:
  ```json
  {
    "created_at": "2026-02-24T20:30:27Z",
    "journal_id": "uuid-of-journal"
  }
  ```
- **SQL Logic**:
  ```sql
  WHERE (created_at, id) < (cursorCreatedAt, cursorId)
  ORDER BY created_at DESC, id DESC
  LIMIT N;
  ```
- **Index Requirement**: An index on `(created_at DESC, id DESC)` is mandatory on the `journal_entries` table.

---

**Status**: DEFINED BY @Architect. Ready for Phase 1 (@Supabase_Ops).
