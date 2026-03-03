# Admin Approvals (PAGE 16 — Dual Approval for Dangerous Ops)

## Decisions (D1–D3)

### D1: Reversal and large refund RPC mapping
- **Reversal:** Use operation type `reversal`. RPC: `admin_ledger_reversal` (to be added in app repo when ledger supports it) or gate existing refund/reversal RPC by approval. For now, approval queue supports `reversal`; execute endpoint can be wired when RPC exists.
- **Large refund override:** Use operation type `large_refund_override`. RPC: `admin_refund_booking` (existing in `20260302120000_admin_booking_rpcs.sql`). When refund amount > `LARGE_REFUND_THRESHOLD`, require an approved approval row; pass `approval_id` and have RPC check approval and set `consumed_at` in same transaction.

### D2: Numeric thresholds (constants in shared + API)
- **WALLET_ADJUST_DANGEROUS_MIN:** `100_000` (cents, e.g. 1000.00 currency units). Any wallet adjust with `|amount_cents| >= 100_000` requires dual approval.
- **LARGE_REFUND_THRESHOLD:** `50_000` (cents). Refund above this requires approval.
- Defined in `packages/shared/src/schemas/approvals.ts` and used by API validation.

### D3: Who executes after approve
- **Requester only.** The admin who created the approval request is the only one who may call the execute endpoint (e.g. wallet adjust or refund with that approval_id). Enforced in API and RPC: `requested_by = p_actor_id` for execute.

## Operation types
| operation_type          | RPC / endpoint | When approval required |
|-------------------------|----------------|-------------------------|
| `wallet_adjust`         | `admin_adjust_wallet` | When \|amount_cents\| >= WALLET_ADJUST_DANGEROUS_MIN |
| `reversal`              | `admin_ledger_reversal` (TBD in app) | Always (when RPC exists) |
| `large_refund_override` | `admin_refund_booking` | When amount > LARGE_REFUND_THRESHOLD |

## Migration path
- Migration lives in dashboard repo: `MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql`.
- Apply after existing for_sline_app migrations (see MIGRATIONS/README.md). For production, the same SQL can be copied into **sline_app** so the app repo owns canonical schema.

## Test env and fixtures
- Test runner: Supertest (API), Playwright (E2E).
- Fixture: 2 admin users (A, B); 1 pending approval (requested by A); 1 approved approval (for execute test). Optional: wallet user for adjust flow.
- E2E artifact path: `apps/admin-ui/e2e/artifacts` (screenshots/logs on failure).

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See [ADMIN_DEVELOPER_GUIDE.md](./ADMIN_DEVELOPER_GUIDE.md) for the documentation index. Feature doc: [features/PAGE_16_approval_queue.md](./features/PAGE_16_approval_queue.md).*
