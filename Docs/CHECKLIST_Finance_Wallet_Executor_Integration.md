# Checklist: Finance Wallet Executor Integration

Use this to verify what was done in the repo. **Why:** Align the dashboard with the critiqued Finance Wallet plan (Executor doc, Phase 0–1, Master Report fixes).

---

## What was added

| # | Where | What | Why |
|---|--------|------|-----|
| 1 | `Docs/CANONICAL_FINANCE_DEPENDENCY_MATRIX.md` | New doc: view/RPC → migration file; wallet-adjust execute = unavailable; freeze/unfreeze; note on `vw_wallet_activity_user` + `user_id` | Phase 0 deliverable so every Finance action has a known SQL source. |
| 2 | `apps/api/src/routes/finance/workflow.ts` | New file: `GET /finance/workflow/overview`, `GET /finance/workflow/cases`, `GET /finance/workflow/cases/:entityType/:entityId` (admin/super_admin only, overview/cases stubbed) | Phase 1 read-only workflow API. |
| 3 | `apps/admin-ui/src/features/finance/components/WalletActivityTable.tsx` | New component: table for wallet activity (journal_entry_id, event_type, status, counterparty, amount_gross, amount_net, date) with link to transaction | Show wallet timeline from `WalletActivityEntry` instead of reusing journal-ledger table. |
| 4 | `packages/shared/src/schemas/finance.ts` | `WalletActivityEntrySchema`, `WORKFLOW_BUCKETS`, `FinanceWorkflowOverviewSchema`, `FinanceWorkflowCaseSchema`, `FinanceWorkflowCaseDetailSchema`; optional `stub` on overview | Contract for wallet activity and workflow; stub flag so clients know when data is placeholder. |
| 5 | `apps/api/src/routes/finance.test.ts` | Tests: unfreeze (401, 400, 200); workflow overview/cases/case-detail (401, 403, 200) | Cover new routes and unfreeze. |
| 6 | `.TODO/MASTER_REPORT_2026-03-10_Finance_Wallet_Executor_Integration.md` | Orchestrator-style report: findings, fix plan, readiness | Single place to see what was reviewed and fixed. |

---

## What was removed

| # | Where | What | Why |
|---|--------|------|-----|
| 1 | `apps/api/src/routes/finance/wallets.ts` | Actual call to `admin_adjust_wallet` RPC (and success path) for wallet adjust | RPC does not move money (audit only); execute is gated until a real ledger mutation exists. |
| 2 | `apps/api/src/routes/finance.test.ts` | Old E2E test “execute wallet adjust twice → 409” | Replaced by test that expects 501 for adjust execute. |

---

## What was modified

### Executor (workflow doc only)

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `.agent/workflows/executor.md` | Read-First Rule: `/mnt/data/*` replaced by repo paths (`.agent/`, `Docs/`, `supabase/migrations`, `MIGRATIONS/for_sline_app`) | Those artifacts are not in the repo; use verifiable sources. |
| 2 | `.agent/workflows/executor.md` | Feature 6: “Finance” expanded to Phase 0–5 block (canonical SQL gate, contracts, read APIs, exception API, UI rebuild, cross-surface, QA/docs) with gates and fallback | Run Finance by the critiqued plan. |
| 3 | `.agent/workflows/executor.md` | Gate system: Finance-specific gates (lifecycle, exception-only, wallet activity = WalletActivityEntry, wallet-adjust gate, freeze/unfreeze, fallback) | Enforce invariants when executing Finance. |
| 4 | `.agent/workflows/executor.md` | New section: Risks & Mitigations (Finance); Delegation: Finance block owner alignment (Phase 0–5) | Align risks and owners with the plan. |

### API

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `apps/api/src/routes/finance/wallets.ts` | **Unfreeze:** `POST /wallets/:userId/unfreeze` → `admin_process_wallet_freeze(..., p_freeze: false)`; **Freeze/Unfreeze:** `const result = await withAudit(...); return reply.send(result)` | Support unfreeze and fix missing response (reply.send). |
| 2 | `apps/api/src/routes/finance/wallets.ts` | **Wallet adjust:** Always return 501 with message “ledger mutation not yet implemented” (no RPC call) | Do not expose execute until real ledger mutation exists. |
| 3 | `apps/api/src/routes/finance/users.ts` | Timeline: parse with `WalletActivityEntrySchema`; normalize `created_at` to string | Return wallet activity as WalletActivityEntry, not journal ledger. |
| 4 | `apps/api/src/routes/finance/users.ts` | Comment: `vw_wallet_activity_user` must expose `user_id` for filtering (see dependency matrix) | Document dependency for future view/RPC changes. |
| 5 | `apps/api/src/routes/finance.ts` | Register `registerWorkflowRoutes` | Mount workflow routes under `/finance`. |
| 6 | `apps/api/src/routes/finance/workflow.ts` | Overview/cases/detail responses include `stub: true` where data is placeholder | Clients can treat stub data differently. |

### Shared (contracts)

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `packages/shared/src/schemas/finance.ts` | `WalletActivityEntrySchema` (journal_entry_id, amount_gross, amount_net, counterparty_user_id, etc.); workflow schemas; optional `stub` on overview | One contract for wallet activity and workflow; stub flag. |

### Admin UI

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `apps/admin-ui/src/features/finance/models/finance.model.ts` | Import `WalletActivityEntry` from `@sline/shared`; re-export; add `getWalletActivityAmount(entry)` | Use shared type and one helper for wallet amounts. |
| 2 | `apps/admin-ui/src/features/users/services/users_api.ts` | `UserWalletLookupDTO.timeline.data` → `WalletActivityEntry[]`; import from `@sline/shared` | Type matches API response. |
| 3 | `apps/admin-ui/src/features/finance/services/finance_api.ts` | `UserFinanceLookupResult.timeline.data` → `WalletActivityEntry[]` | Same. |
| 4 | `apps/admin-ui/src/features/finance/viewmodels/useFinanceUserLookup.vm.ts` | `timeline` state and VM type → `WalletActivityEntry[]` | Same. |
| 5 | `apps/admin-ui/src/features/users/views/components/UserProfileWorkOverview.tsx` | `walletTimeline` type → `WalletActivityEntry[]`; timeline list uses `journal_entry_id`, `getWalletActivityAmount(entry)`; import `WalletActivityEntry`, `getWalletActivityAmount` | Show wallet activity with correct fields. |
| 6 | `apps/admin-ui/src/routes/FinanceUsers.tsx` | Replace `TransactionsTable` with `WalletActivityTable` for “Recent Activity”; pass `vm.timeline` as `data` | Wallet page uses wallet-activity table. |

### Docs

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `Docs/CANONICAL_FINANCE_DEPENDENCY_MATRIX.md` | Paragraph on `vw_wallet_activity_user` and `user_id` (view must expose it or use RPC) | Clarify API dependency on view shape. |

### Tests

| # | Where | Change | Why |
|---|--------|--------|-----|
| 1 | `apps/api/src/routes/finance.test.ts` | Wallet adjust: expect 501 and NOT_IMPLEMENTED message | Execute is disabled. |
| 2 | `apps/api/src/routes/finance.test.ts` | Unfreeze: 401, 400 (missing reason), 200 (with optional ok:false when DB fails) | Cover unfreeze. |
| 3 | `apps/api/src/routes/finance.test.ts` | Workflow: 401/403/200 for overview, cases, case-detail | Cover workflow routes. |

---

## Quick verification checklist

- [ ] **Executor:** `.agent/workflows/executor.md` has repo-based Read-First Rule, Finance Phase 0–5 block, Finance gates, and Risks/Delegation.
- [ ] **Matrix:** `Docs/CANONICAL_FINANCE_DEPENDENCY_MATRIX.md` exists and lists views/RPCs, wallet-adjust gate, freeze/unfreeze, and `vw_wallet_activity_user` note.
- [ ] **API unfreeze:** `POST /api/v1/finance/wallets/:userId/unfreeze` with body `{ reason }` returns 200 with `userId` when DB allows.
- [ ] **API wallet adjust:** `POST /api/v1/finance/wallets/:userId/adjust` (with approval_id) returns 501 and message about ledger mutation.
- [ ] **API workflow:** `GET /api/v1/finance/workflow/overview`, `/workflow/cases`, `/workflow/cases/:entityType/:entityId` return 200 for admin (overview/cases may have `stub: true`).
- [ ] **API users timeline:** `GET /api/v1/finance/users/:userId` timeline items have `journal_entry_id`, `amount_gross`, `amount_net`, `counterparty_user_id` (WalletActivityEntry shape).
- [ ] **Admin UI:** Finance user lookup page shows “Recent Activity” in `WalletActivityTable`; user profile “Wallet Situation” shows wallet timeline with amounts from `getWalletActivityAmount`.
- [ ] **Tests:** `npm run test -w @sline/api` includes unfreeze and workflow tests and passes (e.g. 203 passed).

---

## One-line summary

**Added:** Canonical finance matrix, workflow read routes, WalletActivityEntry contracts and UI table, tests and Master Report. **Removed:** Wallet-adjust execute path and old adjust E2E test. **Modified:** Executor doc (read-first, Finance block, gates, risks), freeze/unfreeze response send and unfreeze route, wallet timeline typed as WalletActivityEntry everywhere, FinanceUsers and UserProfileWorkOverview to use wallet activity types and table.
