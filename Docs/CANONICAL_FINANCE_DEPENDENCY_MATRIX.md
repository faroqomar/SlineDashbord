# Canonical Finance Dependency Matrix

This document maps every admin finance view and RPC used by the dashboard to its canonical migration source. It is the Phase 0 deliverable for the Finance Wallet Workflow (Executor plan).

**Verification:** Remote project `isddrknbjsgaantjojhm` (Supabase MCP `list_migrations`) already has equivalent migrations applied (from app repo). Dashboard repo migration files below are the **source of truth for dashboard-owned** SQL; app repo `sline_app/supabase/migrations` is canonical for production schema per `.agent/PROJECT_CONTEXT.md`.

---

## Views

| View / object | Purpose | Dashboard repo migration | Applied on remote (project isddrknbjsgaantjojhm) |
|---------------|---------|--------------------------|---------------------------------------------------|
| `vw_admin_journal_ledger` | Denormalized journal for admin transaction list/detail | `supabase/migrations/20260228000000_admin_views_rpcs.sql` | Yes (admin_views_rpcs) |
| `vw_financial_metrics_realtime` | Platform KPIs (platform_cash, escrow_held, revenue) | App repo (finance_intelligence_views_rpcs / add_financial_views) | Yes |
| `vw_wallet_activity_user` | Per-user wallet activity (spent semantics, counterparty) | App repo (create_wallet_views_core / recreate_wallet_views_with_correct_columns) | Yes |
| `vw_wallet_balances_user` | Per-user available/held/pending balances | App repo (same as above) | Yes |

**vw_wallet_activity_user and user_id:** The dashboard API filters timeline by `.eq('user_id', userId)`. The app repo view must expose a `user_id` column (or an equivalent) for per-user wallet activity; otherwise the API may error or return empty. If the view is RLS-filtered or parameterized differently, provide an RPC that accepts `p_user_id` and the dashboard can call that instead.

---

## RPCs

| RPC | Purpose | Dashboard repo migration | Applied on remote | Notes |
|-----|---------|--------------------------|-------------------|--------|
| `admin_process_withdrawal` | Approve/reject withdrawal request | `supabase/migrations/20260302110000_admin_process_withdrawal_canonical.sql` | Yes (admin_process_withdrawal_patch) | Signature: p_request_id, p_decision, p_admin_id, p_reason |
| `admin_process_wallet_freeze` | Freeze or unfreeze wallet (p_freeze boolean) | `supabase/migrations/20260228000000_admin_views_rpcs.sql` | Yes (admin_views_rpcs) | Unfreeze = same RPC with p_freeze = false |
| `admin_refund_booking` | Idempotent booking refund (admin exception) | `supabase/migrations/20260302120000_admin_booking_rpcs.sql` | Yes (admin_booking_rpcs) | Idempotency key required |
| `admin_adjust_wallet` | Consume approval + audit; **no ledger mutation** | `MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql` | Yes (admin_approvals) | **Execute unavailable:** RPC does not move money; approval queue only until real ledger mutation exists |
| `admin_resolve_booking_dispute` | Resolve disputed booking (completed/refunded) | App repo | Yes (admin_resolve_booking_dispute) | Admin-only |
| `admin_refund_direct_offer` | Admin refund for direct offer | App repo | Yes (admin_refund_direct_offer) | Idempotency + reason required |
| `admin_update_platform_fee_rate` | Update platform fee rate with reason; writes `audit_logs` atomically | `supabase/migrations/20260311100000_platform_fee_settings.sql` | TBD | super_admin only at API; mandatory reason |
| `fn_get_default_fee_rate_bps()` | Canonical fee rate in bps for new lock points (reads only `platform_settings`) | Same migration | TBD | Used at lock points: booking escrow, direct_offer accept, task_request award |

---

## Platform fee (admin-controlled)

- **Table:** `platform_settings` (singleton row `key = 'default'`): `fee_rate_default_bps`, `max_fee_rate_bps`, `updated_at`, `updated_by`. Single source of truth for global fee; no fee in `system_config`.
- **Dashboard:** `GET /api/v1/finance/fee-settings` (read), `PATCH /api/v1/finance/fee-settings` (super_admin only, reason required). Finance page = edit surface; Settings = read-only mirror with deep-link to Finance.
- **Lock points:** Booking = escrow/hold; direct offer = accept; task request = award. Fee changes affect only future locks; `release_with_fee` uses entity’s locked rate.
- **Copy into app:** `MIGRATIONS/for_sline_app/20260311100000_platform_fee_settings.sql` for canonical app ownership.
- **Alter existing table:** `supabase/migrations/20260311100001_platform_fee_settings_alter_existing.sql` adds fee columns and ensures a default row exists (inserts if missing, for both table shapes with/without `value` column).
- **Runbook:** PATCH rate limit is 5/min per user (in-memory). For multi-instance deployments, use a shared rate-limit store.

---

## Wallet-adjust execute gate

- **Status:** Unavailable.
- **Reason:** `admin_adjust_wallet` only consumes approval and writes audit; it does **not** perform a ledger mutation (see comment in `MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql`).
- **Dashboard action:** API route `POST /finance/wallets/:userId/adjust` returns `501 NOT_IMPLEMENTED` with message that ledger mutation is not yet implemented; approval queue remains visible and usable for request/approve flow.

---

## Freeze / unfreeze

- **Freeze:** `POST /finance/wallets/:userId/freeze` → `admin_process_wallet_freeze(p_user_id, p_freeze := true, ...)`.
- **Unfreeze:** `POST /finance/wallets/:userId/unfreeze` → `admin_process_wallet_freeze(p_user_id, p_freeze := false, ...)`.
- Both supported in SQL and API; wallet-state UI can show current state from `vw_wallet_balances_user.is_wallet_frozen` (or profiles.is_wallet_frozen).

---

## Phase 0 gate result

- Every planned Finance UI action is either:
  - Backed by a view/RPC above (with migration in this repo or app repo and applied on remote), or
  - Explicitly removed from scope (wallet-adjust execute).
- **PASS:** Proceed to Phase 1 (shared contracts + read APIs). Inline action buttons for withdrawals, freeze/unfreeze, disputed-booking resolve, and direct-offer refund are allowed; wallet-adjust execute remains hidden/501.
