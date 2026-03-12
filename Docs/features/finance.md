# 💰 Finance & Payments Module

> **Status**: v1 — Complete (Phases 0–9) + PAGE 12 (Transaction Detail, Audit Export, User Lookup)
> **Last Updated**: 2026-03-03

## Overview

The Finance module provides full financial oversight for the SLine admin dashboard. It implements a **double-entry ledger** architecture with cursor-based pagination, role-gated data masking, and mandatory audit logging for all mutations.

**Who it's for**: Super Admins, Admins, Moderators, and Support staff — each with different levels of data access.

---

## Architecture

### File Structure

```
src/features/finance/
├── models/
│   ├── finance.model.ts    # Types, enums, role constants, UI utils
│   ├── finance.schema.ts   # Zod input schemas for every action
│   └── result.ts           # ServiceResult<T> (ok/fail helpers)
├── actions/
│   ├── mutations.ts        # Write operations (approve, reject, freeze, etc.)
│   └── queries.ts          # Read operations (metrics, transactions, audit)
├── services/
│   └── security_guards.ts  # requireAdminRole, enforceRateLimit, logAuditEvent, maskMetaForRole
├── viewmodels/
│   ├── useTransactions.vm.ts    # Pagination, selection, filter state
│   ├── useWithdrawals.vm.ts     # Approve/reject flow with loading states
│   └── useTransactionTrace.vm.ts # Detail drawer data fetching
└── components/
    ├── TransactionsTable.tsx       # Paginated ledger table
    ├── WithdrawalsTable.tsx        # Withdrawal request list with actions
    ├── TransactionTraceDrawer.tsx  # Side panel with full journal detail
    └── UserWalletCard.tsx          # User balance summary card
```

### Data Flow

```
Page (RSC) → queries.ts → ServiceResult<T> → Component (props)
                                                  ↓
Component → ViewModel (useXxxVM) → mutations.ts → ServiceResult<T> → toast
```

### Components

| Component                | Type   | Purpose                                               |
| ------------------------ | ------ | ----------------------------------------------------- |
| `TransactionsTable`      | Client | Paginated journal ledger with cursor navigation       |
| `WithdrawalsTable`       | Client | Withdrawal requests with approve/reject actions       |
| `TransactionTraceDrawer` | Client | Side sheet showing full transaction detail + metadata |
| `UserWalletCard`         | Client | Wallet balance summary card                           |

### Server Actions

#### Queries (`queries.ts`)

| Function                     | Input                                      | Returns                | Role  |
| ---------------------------- | ------------------------------------------ | ---------------------- | ----- |
| `getPlatformMetrics()`       | —                                          | `PlatformMetrics`      | READ  |
| `getTransactionsPaginated()` | `TransactionFilters`, `TransactionCursor?` | `{ data, nextCursor }` | READ  |
| `getTransactionDetails()`    | `journalId: UUID`                          | `JournalLedgerEntry`   | READ  |
| `getUserWalletSummary()`     | `userId: UUID`                             | `WalletSummary`        | READ  |
| `getUserFinanceTimeline()`   | `userId: UUID`, filters                    | `{ data, nextCursor }` | READ  |
| `getEntityTrace()`           | `entityType`, `entityId`                   | `{ data, nextCursor }` | READ  |
| `getWithdrawals()`           | `{ status?, limit? }`                      | `{ data, nextCursor }` | READ  |
| `getAuditLogs()`             | `{ limit? }`                               | `{ data, nextCursor }` | WRITE |

#### Mutations (`mutations.ts`)

| Function                  | Input                  | Audit Event                        | Role       |
| ------------------------- | ---------------------- | ---------------------------------- | ---------- |
| `approveWithdrawal()`     | `requestId, reason`    | `admin.finance.withdrawal_approve` | SUPERADMIN |
| `rejectWithdrawal()`      | `requestId, reason`    | `admin.finance.withdrawal_reject`  | SUPERADMIN |
| `freezeWallet()`          | `targetUserId, reason` | `admin.finance.wallet_freeze`      | WRITE      |
| `unfreezeWallet()`        | `targetUserId, reason` | `admin.finance.wallet_unfreeze`    | WRITE      |
| `softDeleteUser()`        | `targetUserId, reason` | `admin.users.soft_delete`          | WRITE      |
| `exportTransactionsCSV()` | `TransactionFilters`   | `admin.finance.tx_export_csv`      | WRITE      |

### Models

| Type                 | File               | Purpose                            |
| -------------------- | ------------------ | ---------------------------------- | -------------------------- |
| `JournalLedgerEntry` | `finance.model.ts` | Row from `vw_admin_journal_ledger` |
| `PlatformMetrics`    | `finance.model.ts` | Separated user-held liabilities vs company-owned funds |
| `WithdrawalRequest`  | `finance.model.ts` | Withdrawal request row             |
| `WalletSummary`      | `finance.model.ts` | User wallet balances               |
| `TransactionFilters` | `finance.model.ts` | Query filter interface             |
| `TransactionCursor`  | `finance.model.ts` | Cursor-based pagination token      |
| `AuditLogEntry`      | `finance.model.ts` | Audit trail row                    |
| `ServiceResult<T>`   | `result.ts`        | `{ success: true, data }           | { success: false, error }` |

---

## How It Works

### Viewing Transactions

1. **Page loads** → Server Component calls `getTransactionsPaginated()`.
2. **Query validates** → Zod parses filters + cursor.
3. **Auth check** → `requireAdminRole(FINANCE_READ_ROLES)`.
4. **DB fetch** → Supabase queries `vw_admin_journal_ledger` with cursor pagination.
5. **Metadata masking** → `maskMetaForRole()` redacts `meta_full` for non-admin roles.
6. **Render** → `TransactionsTable` receives data as props, ViewModel manages UI state.
7. **Pagination** → "Next" button updates URL params, triggers server re-fetch.

### Approving a Withdrawal

1. Admin clicks "Approve" → `WithdrawalsTable` calls `vm.approveItem(id)`.
2. **ViewModel** → Shows browser `confirm()`, sets `processingId` loading state.
3. **Mutation** → `approveWithdrawal()` validates via Zod, checks `FINANCE_SUPERADMIN_ROLES`.
4. **Rate limit** → `enforceRateLimit` (5 per 60s).
5. **RPC call** → `admin_process_withdrawal` Supabase RPC. The **RPC is the single audit writer**: it updates the withdrawal and inserts exactly one row into `audit_logs` in the same transaction. The API does **not** wrap this in `withAudit` (to avoid double audit).
6. **UI update** → `router.refresh()` triggers server re-render, toast confirms.

---

## Security Patterns

| Pattern              | Implementation                                                          |
| -------------------- | ----------------------------------------------------------------------- |
| **Input Validation** | Zod schema as first line of every action                                |
| **Auth + RBAC**      | `requireAdminRole()` with typed role constants                          |
| **No-Throw**         | All actions return `ServiceResult<T>`, never throw                      |
| **Rate Limiting**    | `enforceRateLimit()` on sensitive mutations                             |
| **Metadata Masking** | `maskMetaForRole()` redacts sensitive fields per role                   |
| **Audit Trail**      | `logAuditEvent()` on every mutation                                     |
| **Typed Constants**  | `FINANCE_READ_ROLES`, `FINANCE_WRITE_ROLES`, `FINANCE_SUPERADMIN_ROLES` |

---

## Database Objects

### Views

| View                            | Purpose                                             |
| ------------------------------- | --------------------------------------------------- |
| `vw_admin_journal_ledger`       | Flattened journal entries with amounts and metadata |
| `vw_financial_metrics_realtime` | Raw ledger-derived cash, escrow, and fee balances used to derive user-held vs company-owned summaries |
| `vw_wallet_balances_user`       | Per-user wallet balances                            |
| `vw_wallet_activity_user`       | Per-user transaction history                        |

### Tables

| Table                 | Access     | Purpose                        |
| --------------------- | ---------- | ------------------------------ |
| `journal_entries`     | Read       | Double-entry ledger core table |
| `journal_lines`       | Read       | Debit/credit line items        |
| `withdrawal_requests` | Read/Write | Withdrawal approval queue      |
| `audit_logs`          | Write      | Admin action audit trail       |

### RPCs

| RPC                           | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `admin_process_withdrawal`    | Approve/reject withdrawal; writes **one** audit_logs row (atomic). API does not add a second audit row. |
| `admin_process_wallet_freeze` | Freeze/unfreeze user wallet                                             |

---

## PAGE 12 — Transaction Detail, Audit Export, User Lookup (Fastify API)

The dashboard API (`apps/api`) exposes the following finance routes. All require authentication; audit list/export and user lookup are restricted to **admin** and **super_admin** only.

### API Routes (Fastify)

| Method | Path | Purpose | RBAC | Notes |
|--------|------|---------|------|--------|
| GET | `/api/v1/finance/transactions` | Paginated transaction list | admin, super_admin | Query validated with `TransactionListQuerySchema` (limit, cursor, filters). Invalid query → 400. |
| GET | `/api/v1/finance/transactions/:journalId` | Single transaction detail | READ (support+); **reveal** = WRITE (admin, super_admin) | By default returns **masked** metadata. `?reveal=1` for admin/super_admin: inserts one row into `audit_logs` (action `admin.finance.tx_view_sensitive_meta`) then returns row with `meta_full`. UI shows confirmation dialog before reveal. |
| GET | `/api/v1/finance/audit` | Paginated audit log list | admin, super_admin only | Query: `limit`, `cursor`, filters (`action`, `actor_user_id`, `start_date`, `end_date`). Cursor is `(created_at, id)`. Same query builder as export. |
| GET | `/api/v1/finance/audit/export` | CSV export of audit logs | admin, super_admin only | Same filters as list; max `limit` 10000. Returns CSV with `Content-Disposition: attachment`. Export row set matches list for the same params (single `buildAuditQuery`). **Meta column is redacted** (action, related_entity_type, related_entity_id, journal_entry_id only) to avoid PII in exports. |
| GET | `/api/v1/finance/users/:userId` | User wallet + timeline | admin, super_admin only | Reads `vw_wallet_balances_user` and `vw_wallet_activity_user`. Returns 501 if views are not deployed. |

### UI Routes (admin-ui)

| Route | Page | Purpose |
|-------|------|--------|
| `/finance/audit` | Finance Audit | Filters, paginated table, "Export CSV" (single-click, disabled while loading). |
| `/finance/users` | Finance Users index | Search by User ID; submit navigates to `/finance/users/:userId`. |
| `/finance/users/:userId` | Finance User Lookup | UserWalletCard + transaction timeline (from `vw_wallet_activity_user`). |
| `/finance/transactions/:journalId` | Transaction Detail | Full detail; "Reveal sensitive" (with confirmation) for admin/super_admin, triggers audit then shows `meta_full`. |

Transaction detail is also available via the **drawer** from the transactions list (row click); same API and reveal behavior.

### ViewModels (admin-ui, PAGE 12)

| ViewModel | File | Exposes | Used by |
|-----------|------|--------|--------|
| `useTransactionDetailVM` | `features/finance/viewmodels/useTransactionDetail.vm.ts` | `detail`, `loading`, `error`, `load(journalId, reveal?)`, `clear` | Transaction detail page and drawer |
| `useAuditLogsVM` | `features/finance/viewmodels/useAuditLogs.vm.ts` | `data`, `nextCursor`, `filters`, `setFilters`, `load(append?)`, `exportCsv`, `loading`, `exportLoading`, `error` | Finance Audit page |
| `useFinanceUserLookupVM` | `features/finance/viewmodels/useFinanceUserLookup.vm.ts` | `userId`, `wallet`, `timeline`, `setUserId`, `search`, `loading`, `error` | Finance User Lookup page |

All call `financeApi` in `features/finance/services/finance_api.ts` only; no direct DB or RBAC logic.

### Special rules (PAGE 12)

- **Transaction list:** Query params validated with `TransactionListQuerySchema`; invalid (e.g. non-UUID filter) → 400.
- **Transaction detail reveal:** UI must show a confirmation dialog before calling API with `?reveal=1`; API then inserts one `audit_logs` row and returns `meta_full`.
- **Audit export:** CSV meta column is redacted (action, related_entity_type, related_entity_id, journal_entry_id only); full `audit_logs.meta` must not be exported (PII). See `ADMIN_SECURITY_MANUAL.md`.
- **RBAC:** GET `/finance/audit`, `/finance/audit/export`, `/finance/users/:userId` and reveal are admin/super_admin only.

### Contracts (packages/shared)

- **Audit:** `AuditActionEnum` includes `'admin.finance.tx_view_sensitive_meta'`. `AuditLogListEntrySchema`, `AuditLogListFiltersSchema`, `AuditExportQuerySchema` for list/export.
- **Finance:** `TransactionListQuerySchema` for GET `/finance/transactions` list (limit, cursor_created_at, cursor_id, event_type, status, payer_user_id, payee_user_id, entity_type, entity_id); invalid query → 400. `WalletSummarySchema` for user lookup response.
- **Discovery:** `MIGRATIONS/PAGE_12_audit_logs_and_wallet_views_columns.md` documents expected `audit_logs` and wallet view columns (canonical DDL in sline_app repo).

### API implementation (Fastify)

Finance routes are split by domain under `apps/api/src/routes/`:

- **Entry:** `finance.ts` — creates Supabase client and registers sub-routes.
- **Sub-routes:** `finance/transactions.ts` (list + detail by journalId), `finance/audit.ts` (list + export, shared `buildAuditQuery`), `finance/users.ts` (GET users/:userId), `finance/withdrawals.ts` (approve, reject, GET withdrawals), `finance/wallets.ts` (freeze, metrics, adjust), `finance/approvals.ts` (PAGE 16 approval queue).

All use Zod from `packages/shared`, `requireAdminRole` in preHandler, and return `ServiceResult<T>`. Audit export CSV uses a **redacted meta** column (action, related_entity_type, related_entity_id, journal_entry_id only) to avoid PII in exports.

---

## Future Work

- [ ] Real-time metrics via Supabase Realtime subscriptions
- [x] ~~CSV export download~~ — Implemented in PAGE 12 (`GET /finance/audit/export`).
- [ ] Withdrawal batch processing
- [ ] Advanced filters (date range, amount range)
- [ ] Chart visualizations for revenue trends

## Accounting Separation Rule

- **User-held funds** include escrow, wallet balances, and pending withdrawals. They are liabilities owed to users and must never be shown as company revenue or company balance.
- **Company-owned funds** come only from platform fees / commissions.
- The finance dashboard now exposes:
  - `userFunds.held_in_escrow`
  - `userFunds.total_wallet_balances`
  - `userFunds.total_owed_to_users`
  - `companyFunds.total_fee_revenue`
  - `companyFunds.net_platform_earnings`
  - `companyFunds.actual_company_owned_balance`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
