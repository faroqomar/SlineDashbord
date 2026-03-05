# Master Report — PAGE 16 Dual Approval (Orchestrator)

**Scope:** PAGE_16_Dual_Approval  
**Plan:** `.TODO/PLAN_PAGE_16_Dual_Approval_Dangerous_Ops.md`  
**Orchestrator:** `.agent/workflows/orechestrator.md`  
**Date:** 2025-03-03

---

## A) Executive Summary

| Item | Status |
|------|--------|
| Scope reviewed | PAGE 16 — Dual Approval (admin_approvals, approval queue UI, API, wallet adjust gate) |
| Overall risk level | **MED** — No blockers; schema/audit/RBAC compliant; minor gaps and hardening items. |
| Final decision | **Ready** (with fix plan below for MED/LOW items) |
| @SecGuard | **APPROVED** — No service-role in admin-ui; RBAC and second-person enforced; audit atomic in RPCs. |
| @CodeWarden | **APPROVED** — View uses VM only; VM calls API only; no Supabase/server-only in UI. |
| @QA | **PASS** — Supertest coverage for approval routes; missing: execute-twice 409, Playwright. |

---

## B) Consolidated Findings (Deduplicated)

### Security
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| LOW | Error messages in API map RPC exceptions by string match (e.g. `error.message?.includes('different from requester')`); could break if RPC text changes. | @SysOp | Verified in dashboard code: `apps/api/src/routes/finance.ts` | Prefer error codes from RPC or structured meta; or document RPC exception text as contract. |
| MED | `(request as any).user` used in routes; no type for authenticated request. | @SysOp | Verified in dashboard code: finance.ts | Add typed request (e.g. `AuthenticatedRequest` with `user: AuthUser`) and use it in handlers. |
| — | No forbidden Supabase/admin imports in admin-ui for PAGE 16 code. | @SecGuard | Verified in dashboard code: finance_api.ts, useApprovals.vm.ts, FinanceApprovals.tsx | None. |
| — | RPCs write audit_logs in same transaction as mutation; no “write then audit”. | @SecGuard | Verified in SQL: 20260302150000_admin_approvals.sql | None. |

### Data Integrity / Schema Drift
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| MED | `admin_adjust_wallet` does not perform ledger/wallet mutation; only sets consumed_at + audit. Plan expected “performs ledger/wallet mutation”. | @SysOp | Verified in SQL: migration TODO comment | Add journal entry (or call existing ledger RPC) in app repo; or document as Phase 2 and leave migration as gate-only. |
| LOW | GET /approvals ordering uses `created_at desc, id desc`; plan said “pending first, then resolved_at desc”. Pending-first improves UX. | @SysOp | Verified in dashboard code: finance.ts | Optional: add order by status (pending first) then created_at desc; may require raw SQL or composite. |
| — | admin_approvals table and RPCs match plan; CHECK (approver ≠ requester); idempotency_key UNIQUE. | @SysOp | Verified in SQL | None. |

### Contracts / DTO Drift
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| LOW | admin-ui `finance_api.ts` defines local `ApprovalRow` and `ApprovalRequest`; shared has same shapes. Risk of drift. | @AdminArchitect | Verified in dashboard code: finance_api.ts | Import types from `@sline/shared` (ApprovalRow, ApprovalRequest) in finance_api if exported from shared index; or add a shared re-export used by UI. |
| — | packages/shared approval and audit schemas align with API and migration. | @SysOp | Verified in dashboard code | None. |

### Architecture / MVVM
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| LOW | FinanceApprovals.tsx calls `vm.loadApprovals()` in useEffect with empty deps; vm is recreated each render so effect runs once per mount (acceptable). ESLint may warn on missing vm dependency. | @CodeWarden | Verified in dashboard code: FinanceApprovals.tsx | Add loadApprovals to deps or use a ref to avoid stale closure; or keep empty deps and add comment “run once on mount”. |
| — | View has no DB/Supabase; VM has no server-only imports; VM calls only financeApi. | @CodeWarden | Verified in dashboard code | None. |

### Performance
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| — | GET /approvals uses cursor + limit (max 100); index on (status, resolved_at, id) exists. | @PerfOpt | Verified in SQL + dashboard code | None. |
| LOW | List query uses created_at for cursor, not (status, resolved_at, id); index admin_approvals_cursor may be underused. | @PerfOpt | Verified in dashboard code: finance.ts | Optional: use status, resolved_at, id for cursor to match index. |

### Testing / QA
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| MED | No Supertest that executes wallet adjust twice and expects 409 (double-execute). | @QA | Missing repo evidence: finance.test.ts | Add test: create approval → approve as second user → execute as requester → execute again → expect 409. |
| MED | No Playwright E2E for full approval flow (request → approve as other → execute). | @QA | Fixture doc exists; no test file | Add Playwright spec using ADMIN_APPROVALS_E2E_FIXTURES.md; or mark as follow-up. |
| LOW | createApproval idempotency: no test that replays same Idempotency-Key and expects 200/201 with same id. | @QA | Verified in dashboard code: finance.test.ts | Add Supertest: POST approvals twice with same key; expect second 200/201 and same approval id. |

### Docs / Reference Integrity
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|--------|----------|-----|
| LOW | No `docs/features/` page for PAGE 16 (approval queue). | @DocKeeper | Verified: docs/features/README.md exists; no approval feature doc | Add `docs/features/PAGE_16_approval_queue.md` with flow, roles, and links to ADMIN_APPROVALS.md. |
| — | ADMIN_APPROVALS.md and ADMIN_APPROVALS_E2E_FIXTURES.md exist and are accurate. | @DocKeeper | Verified in dashboard code | None. |

---

## C) Fix Plan (Ordered)

| Step | Owner | What to change | Where | Verification |
|------|--------|----------------|-------|--------------|
| 1 | @SysOp | Add typed authenticated request (e.g. extend Fastify type with user) and use in finance approval handlers instead of `(request as any).user`. | apps/api/src (types + finance.ts) | typecheck; no (request as any).user in new code |
| 2 | @QA | Add Supertest: execute wallet adjust twice with same approval_id; expect 409 on second call. | apps/api/src/routes/finance.test.ts | npm run test (api) |
| 3 | @QA | Add Supertest: POST /approvals twice with same Idempotency-Key; expect 201 then 200/201 with same id. | apps/api/src/routes/finance.test.ts | npm run test (api) |
| 4 | @AdminArchitect | Use shared ApprovalRow/ApprovalRequest in admin-ui (import from @sline/shared or re-export from shared) so UI does not duplicate types. | apps/admin-ui/src/features/finance/services/finance_api.ts | typecheck; single source of types |
| 5 | @DocKeeper | Add docs/features/PAGE_16_approval_queue.md (flow, roles, link to ADMIN_APPROVALS). | docs/features/ | Doc exists and linked |
| 6 | @QA (follow-up) | Add Playwright E2E for request → approve (second user) → execute (requester); use fixture from ADMIN_APPROVALS_E2E_FIXTURES.md. | apps/admin-ui/e2e or similar | E2E run |
| 7 | @SysOp (app repo) | Implement ledger/wallet mutation inside admin_adjust_wallet or call existing ledger RPC after approval gate (per migration TODO). | sline_app or MIGRATIONS/for_sline_app | Integration test with real DB |

---

## D) Regression Checklist

- [ ] Auth: login and /auth/me still work; no change to auth flow.
- [ ] Finance: withdrawals approve/reject, freeze, transactions list, audit list/export unchanged.
- [ ] Approval: GET /finance/approvals returns 401 without auth, 403 for support; POST create/approve/reject require admin/super_admin.
- [ ] Wallet adjust: without approval_id for large amount returns 403; with valid approved approval returns 200 (or 500 if RPC/table missing).

---

## E) Rollback Notes

| Area | Rollback strategy |
|------|--------------------|
| Contracts | Revert packages/shared approvals.ts and audit.ts extension; remove AdjustWalletInputSchema if unused elsewhere. |
| API | Revert approval and wallet-adjust routes in finance.ts; redeploy API. |
| DB | Migration adds table + RPCs; rollback = do not call new RPCs; table can remain. Reverse migration (DROP RPCs, DROP table) only if no data to preserve. |
| UI | Revert FinanceApprovals.tsx, useApprovals.vm.ts, finance_api approval methods, App route and Finance link; rebuild admin-ui. |

---

## F) Next Actions (Immediate)

| # | Action | Owner |
|---|--------|--------|
| 1 | Add Supertest for execute-twice 409 and for create-approval idempotency replay. | @QA |
| 2 | Replace `(request as any).user` with typed authenticated request in finance approval routes. | @SysOp |
| 3 | Use shared ApprovalRow/ApprovalRequest in admin-ui finance_api (or re-export from shared). | @AdminArchitect |
| 4 | Add docs/features/PAGE_16_approval_queue.md. | @DocKeeper |
| 5 | (App repo) Implement or wire ledger mutation in admin_adjust_wallet when ready. | @SysOp |

---

*One agent at a time. One truth at the end.*
