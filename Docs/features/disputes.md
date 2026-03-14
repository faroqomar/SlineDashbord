# Disputes Center

## Purpose

The Disputes Center is the admin workflow for reviewing, accepting, canceling, and resolving disputes tied to marketplace work. It now supports real financial settlement, not just status changes.

Supported settlement targets:
- `booking`
- `task_request` for tender/task-paid flows
- `direct_offer`

Supported outcomes:
- `refund_client`
- `release_freelancer`
- `split_settlement`

## Routes / screens

- Admin list: `/disputes`
- Admin detail: `/disputes/$disputeId`
- Cases linkage: accepted disputes create or reuse an `admin_case` and appear in Cases with source `dispute`

Main UI components:
- Disputes list / queue
- Dispute detail screen
- Decision modal for accept / cancel / resolve
- Split settlement preview with automatic fee calculation

## API endpoints

- `GET /api/v1/disputes`
  - list disputes with tab counts
- `GET /api/v1/disputes/:id`
  - dispute detail, evidence, messages, action availability, settlement candidates
- `POST /api/v1/disputes/:id/accept`
  - open -> active
- `POST /api/v1/disputes/:id/cancel`
  - open|active -> canceled
- `POST /api/v1/disputes/:id/resolve`
  - active -> resolved with settlement
  - requires `Idempotency-Key`

## ViewModels / state ownership

- `apps/admin-ui/src/features/disputes/viewmodels/use_dispute_detail_viewmodel.ts`
  - owns dispute detail query
  - owns accept / cancel / resolve mutations
  - invalidates dispute detail + dispute list after mutation
- `apps/admin-ui/src/features/disputes/view/DisputeDetailScreen.tsx`
  - owns modal state
  - renders settlement candidates
  - auto-calculates split preview in the UI from held amount + fee rate

## Contracts / data flow

- Shared contracts live in `packages/shared/src/schemas/disputes.ts`
- Resolve contract supports:
  - `booking_id`
  - `task_request_id`
  - `client_refund_amount`
  - `freelancer_payout_amount`
- Detail contract exposes:
  - `settlement_candidates`
  - `requires_settlement_target`
  - `supports_split_resolution`

## DB / RPC references

- `admin_accept_dispute`
  - activates dispute and creates/reuses an `admin_case`
- `admin_cancel_dispute`
  - cancels open or active disputes
- `admin_resolve_dispute_settlement`
  - canonical dashboard RPC entrypoint
- `admin_resolve_dispute`
  - settlement implementation behind the wrapper
- `can_manage_disputes`
  - DB-side staff authorization aligned with `admin_users`

Settlement behavior:
- `booking`
  - held booking escrow is settled
- `task_request`
  - held tender/task escrow is settled
- `direct_offer`
  - held direct-offer escrow is settled

Wallet destinations:
- client funds -> `available_balance`
- freelancer funds -> `available_balance`
- platform fee -> `platform_revenue`

## Special rules

- Resolve is idempotent.
- Cancel and resolve require a reason.
- Split settlement keeps the full original platform fee.
- Split preview is now auto-calculated in UI:
  - gross held amount is read from the selected target
  - fee is derived from `fee_rate_bps`
  - admin enters client refund
  - freelancer payout is calculated automatically
- If there is exactly one held settlement target, the UI auto-selects it.
- If there are multiple held targets, the admin must choose one.
- If there is no held target, resolve is blocked.

## Important implementation notes

- Dashboard RBAC and DB RBAC are aligned through `admin_users`, not only `profiles.roles`.
- The live settlement RPC wrapper was de-overloaded so Supabase RPC resolution is deterministic.
- Task/tender disputes do not settle against `tasks` directly. They settle against held `task_requests`.

## Related docs

- `Docs/AppDigram/All_Diagrams/14_dispute-lifecycle.md`
- `Docs/AppDigram/All_Diagrams/25_dispute-resolution-wallet-settlement.md`
- `Docs/ADMIN_DATABASE_REF.md`
- `Docs/ADMIN_SECURITY_MANUAL.md`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
