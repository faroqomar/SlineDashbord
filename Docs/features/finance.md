# 💰 Finance & Payments Module

> **Status**: v1 — Complete (Phases 0–9)
> **Last Updated**: 2026-02-25

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
| `PlatformMetrics`    | `finance.model.ts` | Platform cash, escrow, revenue     |
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
5. **RPC call** → `admin_process_withdrawal` Supabase RPC.
6. **Audit log** → `logAuditEvent()` records action + reason.
7. **UI update** → `router.refresh()` triggers server re-render, toast confirms.

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
| `vw_financial_metrics_realtime` | Aggregated platform cash, escrow, revenue           |
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

| RPC                           | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `admin_process_withdrawal`    | Approve/reject withdrawal (atomic) |
| `admin_process_wallet_freeze` | Freeze/unfreeze user wallet        |

---

## Future Work

- [ ] Real-time metrics via Supabase Realtime subscriptions
- [ ] CSV export download (currently returns data, needs file generation)
- [ ] Withdrawal batch processing
- [ ] Advanced filters (date range, amount range)
- [ ] Chart visualizations for revenue trends
