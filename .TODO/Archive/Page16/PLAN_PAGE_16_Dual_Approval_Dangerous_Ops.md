# PAGE 16 — Dual Approval (Dangerous Ops): Plan Critic Audit & Corrected Plan

**Source:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` (Page 16, Phase 6, API Contract Map, Risk Register).  
**Workflows:** `.agent/workflows/planner.md`, `.agent/workflows/plan_critic.md`.

---

# Part 1 — Plan Critic Audit

## A) Assumptions + Decision Needed (Blocking)

**Assumptions (inferred safely):**
- DB truth lives in app repo; dashboard repo holds migrations in `MIGRATIONS/for_sline_app` for application to shared DB, with option to copy into sline_app for canonical ownership. [Verified in dashboard code: MIGRATIONS/README.md, existing for_sline_app migrations.]
- `packages/shared/src/schemas/audit.ts` exists and defines `AuditActionEnum`, `MutationAckSchema`; approval actions must be added there. [Verified in dashboard code.]
- All privileged mutations must write `audit_logs` atomically via RPC (no `withAudit()` for approval flow). [Verified in unified audit.]
- Requester and approver must be different (second-person rule). [From Page 16 outcome.]

**Decision Needed (Blocking):**

| # | Missing decision | Options | Recommended | Why | Plan impact |
|---|-------------------|--------|-------------|-----|-------------|
| D1 | Where do “reversals” run? (ledger reversal vs booking refund vs both) | (1) Ledger-only RPC (2) Booking refund only (3) Both, with separate operation_type | (3) Both; add `reversal` and `large_refund_override` as distinct operation types | Audit lists “reversals” and “large refund override” separately; need clear operation_type for queue and audit | Plan must name exact RPC(s) and which existing RPCs (e.g. `admin_refund_booking`) get gated by approval when above threshold |
| D2 | Numeric “dangerous” thresholds (wallet adjust amount, refund amount) | (1) Config in DB (system_config) (2) Constants in shared + API (3) Per-operation in payload only | (2) Constants in shared + API, documented in ADMIN_APPROVALS.md | No system_config for PAGE 16 scope; constants are testable and auditable | Add step: define constants (e.g. WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD); add to contracts and API validation |
| D3 | After “approve”, who executes: requester only, any admin, or auto-execute? | (1) Requester only (2) Any admin with role (3) Auto-execute on approve | (1) Requester only | Reduces blast radius; requester already has context; audit shows requester + approver | Plan must state “execute” endpoint requires same auth as requester or explicit “executor” check |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes required |
|------|--------|---------|----------------|
| **0. Test Infrastructure Gate** | ❌ FAIL | No explicit check that Supertest/Playwright and test DB or mocks exist for approval flows; no fixture path for `admin_approvals` | Add Phase 0 step: confirm test runner and env (e.g. Supabase local or test project); add DataSmith step for approval + wallet fixture seeds; define artifact path for E2E screenshots/logs |
| **1. Data/Contracts Gate** | ❌ FAIL | “Reversals” and “large refund” not bound to specific RPC/entity; threshold not in contracts; audit.ts missing approval actions | Add ApprovalOperationTypeEnum with wallet_adjust, reversal, large_refund_override; add threshold constants to shared; extend AuditActionEnum with admin.approval.request, admin.approval.approve, admin.approval.reject, admin.finance.wallet_adjust |
| **2. Security Gate** | ⚠️ PARTIAL | Second-person rule stated but “execute” caller not specified; no explicit role matrix for request vs approve vs execute | Enforce in RPC and API: approver ≠ requested_by; executor for execute endpoint = requester only (or document if any admin); add role matrix to plan (admin/super_admin for request/approve/list; execute same) |
| **3. Backend/API Gate** | ❌ FAIL | GET /approvals pagination undefined (cursor/limit); error codes not listed; idempotency for execute not tied to approval id | Add cursor + limit to GET; define 400/403/404/409/422 for each route; require approval_id or idempotency_key on execute and link to single approval row |
| **4. UI/Integration Gate** | ❌ FAIL | Double-submit and loading/empty/error states only loosely implied; no explicit state machine | Add UI steps: disabled submit + loading state; empty queue state; error state and retry; explicit “Pending approval” vs “Approved – Execute” vs “Rejected” |
| **5. Release/QA Gate** | ❌ FAIL | No rollback or feature-flag step; no backward-compat note for existing finance routes | Add: optional feature flag to gate “require approval” so existing single-admin flows can be turned off; rollback = disable flag + no new approval rows; document that existing freeze/withdrawal remain unchanged until approval is wired |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix steps | Owner | Acceptance |
|-----|----------------|----------|--------|------------|
| Thresholds undefined | API cannot decide “above dangerous”; tests cannot assert | Define WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD in shared (or config); use in API and RPC | @SysOp + @AdminArchitect | Constants exported; API rejects or requires approval by amount |
| Reversal/large refund RPC not named | Implementer cannot wire approval to specific RPC | Pin: reversal = e.g. `admin_ledger_reversal` or reuse booking refund RPC with operation_type; large refund = `admin_refund_booking` when amount > threshold; document in plan | @SysOp | Plan lists exact RPC names and when approval is required |
| GET approvals pagination | Unbounded list can break performance and UI | Add cursor (e.g. resolved_at, id) + limit (default 50, max 100) to GET /api/v1/finance/approvals; response includes next_cursor | @SysOp | Contract and route support cursor + limit |
| Execute idempotency vs approval | Double execute could run twice if key only on request | Execute endpoint must accept approval_id and idempotency_key; RPC marks approval as “consumed” or execute is idempotent by (approval_id) so second call returns 409 | @SysOp | Same approval_id execute twice returns 409 or no-op |
| UI double-submit and error state | User can click Approve twice or see no feedback | Disable Approve/Reject after click; show loading; on error show message + “Retry”; empty queue = “No pending approvals” | @UIExpert | No double submit; error and empty states in UI |
| Test fixtures for approvals | E2E and integration tests need deterministic data | Add seed or fixture: 2 admin users, 1 pending approval, 1 approved; wallet adjust payload | @DataSmith | Fixture applied; test can assert approval flow |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| No dangerous op without an approved approval row | RPC that performs op checks approval row in same transaction (status = approved, approved_by ≠ requested_by, not expired/consumed) | Integration test: call execute without approval → fail; with approved row → succeed |
| Every approval request/approve/reject writes audit_logs | RPCs insert into audit_logs in same transaction as admin_approvals mutation | Query audit_logs for actor_user_id + action admin.approval.* after each action |
| Approver ≠ requester | API and RPC reject approve/reject when current user = requested_by | Supertest: same user approve → 403 |
| Idempotency: same key cannot create two approval rows | UNIQUE(idempotency_key) on admin_approvals; RPC returns existing row on conflict | Replay POST /approvals with same Idempotency-Key → 200/201 with same id |
| Execute at most once per approval | RPC or API marks approval as consumed, or execute is idempotent by approval_id | Second execute with same approval_id → 409 or no-op |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| Single admin bypasses approval | API or RPC | Med | High | Data-loss | Op succeeds with one actor in audit | All dangerous ops go through Fastify; RPC checks approval row | RLS + audit review; alert on single-actor dangerous op |
| Approver = requester | API approve/reject | Low | High | Security-breach | Same user_id in requested_by and approved_by | Enforce in RPC and API | Test + code review |
| Replay execute | Execute endpoint | Med | High | Data-loss | Duplicate ledger rows | Idempotency by approval_id or consumed flag | RPC idempotent; return 409 on replay |
| Threshold config wrong | Shared constants or config | Med | Med | Feature | Wrong ops require or skip approval | Document in ADMIN_APPROVALS.md; tests for threshold boundary | Review thresholds; feature flag to disable |
| GET approvals unbounded | List endpoint | High | Med | App-wide (perf) | Slow response; timeout | Cursor + limit | Add pagination before merge |
| UI double-submit | Approve/Reject button | Med | Low | Local | Two audit rows for one click | Disable button + loading state | Idempotency on API already limits damage |

---

## F) Pre-Mortem

- This fails when **reversals** or **large refund** are never mapped to a concrete RPC, so implementers add approval UI but dangerous op still runs without approval.
- This fails when **GET /approvals** has no pagination and the queue grows, so the page or API times out.
- This fails when **execute** is callable by any admin after approve, and a third admin runs it by mistake (or abuse).
- This fails when **thresholds** are only in docs and the API uses a different value, so some ops bypass approval.
- This fails when **approval RPC** does not write `audit_logs` in the same transaction, so we lose an audit row on crash.
- This fails when **idempotency** on execute is not enforced, so the same approval is executed twice and double credit/debit occurs.
- This fails when **UI** does not disable Approve/Reject on click, so double submit creates duplicate or confusing state.
- This fails when **tests** assume a live DB with no fixtures, so CI is flaky or cannot run approval E2E.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Output | Stop condition |
|------|-----|-----|--------|----------------|
| Bind operation types to RPCs | So approval gate is wired to real ops | Document: wallet_adjust → admin_adjust_wallet; reversal → admin_ledger_reversal or existing; large_refund_override → admin_refund_booking when amount > threshold | ADMIN_APPROVALS.md or plan table | Each dangerous op has one RPC and rule |
| Add threshold constants | So “dangerous” is testable and consistent | Add to packages/shared (e.g. approvals.ts or constants): WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD; use in API validation | Exported constants + API check | Unit test: above threshold → require approval_id |
| Cursor pagination for GET approvals | Avoid unbounded list | GET /api/v1/finance/approvals?cursor=&limit=50; response { items, next_cursor }; index on (status, resolved_at, id) | Route + schema | Max 100 items per request; tests with 0, 1, 101 rows |
| Consume approval on execute | Prevent double execute | RPC execute path: update approval set consumed_at = now() or status = executed in same txn as ledger op; second call returns 409 | Migration or RPC change | Integration test: second execute → 409 |
| UI loading and error states | Reliable UX | Approve/Reject: set loading true on click, disable button; on error set error message, re-enable Retry; empty list: show “No pending approvals” | Components + VM | Manual or E2E: click once, see loading; error shows message |
| Approval + audit test fixtures | Deterministic E2E | Seed: 2 admins (A, B), 1 pending approval (requested by A), 1 approved (for execute test); optional wallet user | Fixture file or seed SQL | Playwright runs full flow with fixture |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

*[See Part 2 below for the full rewritten plan.]*

---

## I) Change Report (Diff-Style)

1. **Original issues summary:** Thresholds and reversal/large-refund RPCs undefined; GET approvals unpaginated; execute idempotency and “who may execute” unclear; UI double-submit and error/empty states not required; test infra and fixtures not called out; audit.ts not explicitly extended; no feature-flag/rollback.
2. **Added steps:** Phase 0 test-infra and fixture step; threshold constants and ADMIN_APPROVALS.md; cursor/limit on GET approvals; consumed_at or executed status for approval row; UI loading/error/empty states; DataSmith fixture step; optional feature-flag and rollback note.
3. **Removed steps:** None; only refined and reordered.
4. **Reordered steps:** Discovery and decisions (thresholds, RPC mapping) before contracts; contracts before DB; DB and RPC before API; API before VM/UI; tests after UI with explicit fixture step.
5. **Expanded steps:** Contracts now name exact audit actions and extend audit.ts; DB step names columns and unique(idempotency_key), consumed_at; API step names query params and error codes; UI step names state machine and accessibility.
6. **Why:** To make the plan execution-safe, repo-verifiable, and gate-passable; to remove ambiguity that would cause wrong or incomplete implementation.
7. **Residual risks:** Threshold values may need product input; “reversal” may still need a new RPC if ledger has no admin reversal today. Mitigation: document in ADMIN_APPROVALS.md and D1/D2 decisions.

---

# Part 2 — Corrected Plan (Execution-Ready)

## 0) Objective & Non-Goals

- **Done:** No single admin can execute catastrophic finance operations. Wallet adjust, reversals, and large refund override require a second approver. Table `admin_approvals` and approval queue UI exist. API enforces 2-person approval and all approval actions write audit.
- **Measurable:** (1) Dangerous op without approval → 403 and no ledger/approval row. (2) Request/approve/reject each create audit row. (3) Queue UI lists pending/approved/rejected and allows approve/reject by a different admin; execute only by requester after approve.
- **Non-goals (this page):** Withdrawal approve/reject stay as-is (no change to existing routes); general PII/case/chat not in scope. Optional: feature flag to toggle “require approval” for rollout.

---

## 1) Current State (Evidence-labeled)

| Item | Evidence | Notes |
|------|----------|--------|
| `admin_approvals` table | Missing repo evidence | Not in app or dashboard migrations. Target: id, operation_type, target_entity_type, target_entity_id, requested_by, approved_by, status, idempotency_key, payload, reason, created_at, resolved_at, consumed_at (or status = executed). |
| Approval queue API | Missing repo evidence | No list/create/approve/reject/execute endpoints. |
| Approval queue UI | Missing repo evidence | No Vite route or component. |
| audit.ts | Verified in dashboard code | `packages/shared/src/schemas/audit.ts` has AuditActionEnum, MutationAckSchema; does not yet include admin.approval.* or admin.finance.wallet_adjust. |
| Wallet adjust / reversal / large refund | Missing repo evidence | No adjust RPC; reversal and large refund must be tied to existing or new RPC (see D1/D2). |
| Finance routes | Verified in dashboard code | `apps/api/src/routes/finance.ts` exists; no approval or adjust routes. |
| Migrations location | Verified in dashboard code | `MIGRATIONS/for_sline_app` holds app-owned migrations; apply order in MIGRATIONS/README.md. |

---

## 2) Execution Checklist (Strict Order, Gate-Based)

### Phase 0: Decisions & Test Infra (Blocking)

- [ ] **0.1 (@AdminArchitect):** Decide and document: (D1) Which RPC(s) for reversal and large refund (e.g. `admin_refund_booking` for refund; new or existing for ledger reversal). (D2) Numeric thresholds: e.g. WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD. (D3) Executor: requester only after approve. Write to `Docs/ADMIN_APPROVALS.md` or `.TODO/PLAN_PAGE_16_Dual_Approval_Dangerous_Ops.md` (this file).
- [ ] **0.2 (@SysOp):** Confirm migration path: add `admin_approvals` migration under `MIGRATIONS/for_sline_app` (e.g. `20260302150000_admin_approvals.sql`) for shared DB; document that sline_app can copy for canonical ownership.
- [ ] **0.3 (@QA + @DataSmith):** Confirm test runner (Supertest, Playwright) and env (e.g. Supabase local/test); define fixture: 2 admin users, 1 pending approval, 1 approved approval; artifact path for E2E (e.g. `apps/admin-ui/e2e/artifacts`).
- **Gate 0:** Decisions documented; migration path and test env confirmed. **Stop if not pass.**

---

### Phase 1: Data/Contracts

- [ ] **1.1 (@SysOp):** In `packages/shared/src/schemas/approvals.ts` (new): `ApprovalOperationTypeEnum` = `wallet_adjust` | `reversal` | `large_refund_override`; `ApprovalStatusEnum` = `pending` | `approved` | `rejected` | `consumed`; `ApprovalRequestSchema` (operation_type, target_entity_type, target_entity_id, payload, reason; idempotency_key from header in API); `ApprovalRowSchema` (id, operation_type, target_entity_type, target_entity_id, requested_by, approved_by, status, idempotency_key, payload, reason, created_at, resolved_at, consumed_at); `ApproveRejectSchema` (decision, reason); `ApprovalListQuerySchema` (cursor, limit 1..100 default 50); `ApprovalListResponseSchema` (items: ApprovalRowSchema[], next_cursor). Export types. Add threshold constants: `WALLET_ADJUST_DANGEROUS_MIN`, `LARGE_REFUND_THRESHOLD` (values from D2).
- [ ] **1.2 (@SysOp):** In `packages/shared/src/schemas/audit.ts`: extend `AuditActionEnum` with `admin.approval.request`, `admin.approval.approve`, `admin.approval.reject`, `admin.finance.wallet_adjust`. Keep using `MutationAckSchema` for mutation responses.
- [ ] **1.3 (@SysOp):** In `packages/shared/src/schemas/finance.ts`: add `AdjustWalletInputSchema` (target_user_id, amount_cents, reason, approval_id optional when above threshold). Amount sign: positive = credit, negative = debit.
- **Verification (@QA):** Unit tests for approval + audit schemas; threshold used in validation.  
- **Gate 1:** Contracts and constants exported; typecheck passes. **Stop if not pass.**

---

### Phase 2: Backend / DB & RPC

- [ ] **2.1 (@SysOp):** Add `MIGRATIONS/for_sline_app/20260302150000_admin_approvals.sql`: CREATE TABLE `admin_approvals` (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), operation_type text NOT NULL, target_entity_type text NOT NULL, target_entity_id uuid NOT NULL, requested_by uuid NOT NULL REFERENCES auth.users, approved_by uuid REFERENCES auth.users, status text NOT NULL DEFAULT 'pending', idempotency_key text NOT NULL UNIQUE, payload jsonb NOT NULL DEFAULT '{}', reason text, created_at timestamptz DEFAULT now(), resolved_at timestamptz, consumed_at timestamptz); RLS: service_role only for write; indexes on (status), (requested_by), (idempotency_key), (status, resolved_at, id) for cursor. Add CHECK (approved_by IS NULL OR approved_by != requested_by) or enforce in RPC.
- [ ] **2.2 (@SysOp):** Add RPC `admin_request_approval(p_operation_type, p_target_entity_type, p_target_entity_id, p_requested_by, p_idempotency_key, p_payload, p_reason)`: insert into admin_approvals; insert into audit_logs (action = 'admin.approval.request') in same transaction. On conflict (idempotency_key) return existing row (idempotent).
- [ ] **2.3 (@SysOp):** Add RPC `admin_approve_or_reject_approval(p_approval_id, p_actor_id, p_decision, p_reason)`: assert p_actor_id != requested_by; update admin_approvals set approved_by = p_actor_id, status = p_decision, resolved_at = now(); insert audit_logs (admin.approval.approve or .reject). Return updated row.
- [ ] **2.4 (@SysOp):** Add RPC for dangerous op (e.g. `admin_adjust_wallet`) that: accepts p_approval_id (or p_idempotency_key), p_actor_id; checks approval row (status = approved, approved_by != requested_by, requested_by = p_actor_id for “requester only” execute); checks consumed_at IS NULL then sets consumed_at = now() in same txn; performs ledger/wallet mutation; inserts audit_logs (admin.finance.wallet_adjust). Same pattern for reversal and large refund: gate existing or new RPC by approval.
- **Verification (@QA):** Integration test: request → approve as other user → execute as requester succeeds; execute without approval fails; execute twice returns 409 or no-op.  
- **Gate 2:** Migration applies; RPCs exist and write audit atomically; tests pass. **Stop if not pass.**

---

### Phase 3: API (Fastify)

- [ ] **3.1 (@SysOp):** `GET /api/v1/finance/approvals` — query params: cursor, limit (default 50, max 100). RBAC: admin, super_admin. Return ApprovalListResponseSchema. Order: pending first, then by resolved_at desc, id.
- [ ] **3.2 (@SysOp):** `POST /api/v1/finance/approvals` — body: ApprovalRequestSchema; header Idempotency-Key required. RBAC: admin, super_admin. Call admin_request_approval. Return 201 + approval row; 409 if idempotency replay (same id returned).
- [ ] **3.3 (@SysOp):** `POST /api/v1/finance/approvals/:id/approve` and `POST /api/v1/finance/approvals/:id/reject` — body: ApproveRejectSchema. Enforce current user ≠ requested_by. Call admin_approve_or_reject_approval. Return 200 + row; 403 if requester = current user; 404 if not found; 422 if status != pending.
- [ ] **3.4 (@SysOp):** `POST /api/v1/finance/wallets/:userId/adjust` — body: AdjustWalletInputSchema; header Idempotency-Key. If |amount_cents| >= WALLET_ADJUST_DANGEROUS_MIN then approval_id required and RPC checks approval; else single-admin allowed (optional policy). Return MutationAckSchema; 400/403/404/409/422 as per contract map.
- [ ] **3.5 (@SysOp):** Route reversal and large refund: e.g. `POST /api/v1/finance/bookings/:bookingId/refund` (or existing) — when amount > LARGE_REFUND_THRESHOLD require approval_id; call RPC that checks approval and performs refund. Same for reversal if separate endpoint.
- **Verification (@SecGuard):** RBAC and second-person check; no service-role in client.  
- **Gate 3:** All routes respond with correct status codes; Supertest 401/403/200/409. **Stop if not pass.**

---

### Phase 4: ViewModels

- [ ] **4.1 (@AdminArchitect):** VM/hooks for approval queue: load list (cursor pagination), create request, approve, reject. State: items, nextCursor, loading, error. Call Fastify only.
- [ ] **4.2 (@AdminArchitect):** VM for “request approval” from finance: submit → approval id → poll or redirect to queue; when status = approved, enable “Execute” for requester only; call execute endpoint.
- **Verification (@CodeWarden):** No Supabase/server-only in VM.  
- **Gate 4:** MVVM purity. **Stop if not pass.**

---

### Phase 5: UI

- [ ] **5.1 (@UIExpert):** Route `/finance/approvals`: Approval Queue page. Table: operation_type, target, requested_by, status, created_at; actions Approve/Reject for pending. Disable buttons on click; show loading; on error show message + Retry. Empty state: “No pending approvals.”
- [ ] **5.2 (@UIExpert):** From finance (wallet adjust / refund): “Request approval” flow → “Pending approval” + link to queue; when approved, show “Execute” (requester only); on execute, loading + success/error toast.
- [ ] **5.3 (@MotionMaster):** Loading and toasts for approve/reject/execute (non-optional for critical actions).
- **Verification (@QA):** Smoke: open queue, request, approve as second user, execute as requester; attempt op without approval fails with clear message.  
- **Gate 5:** UI states and navigation pass. **Stop if not pass.**

---

### Phase 6: QA & Release

- [ ] **6.1 (@QA):** Supertest: 401/403 for unauthenticated/wrong role; 403 when approver = requester; 200/201/409 for create and approve; cursor pagination; execute without approval 403; execute twice 409.
- [ ] **6.2 (@QA):** Playwright: full flow with fixture (2 admins, 1 pending approval); request → approve as second → execute as requester; attempt execute without approval → failure.
- [ ] **6.3 (@DataSmith):** Fixture: 2 admin users, 1 pending approval row, 1 approved (for execute test); document in test README or seed.
- [ ] **6.4 (@DevOps):** Optional: feature flag to require approval (so existing single-admin flows can stay until rollout). Rollback: disable flag; no new approval rows required.
- **Gate 6:** All tests pass; E2E artifact path defined. **Stop if not pass.**

---

## 3) Gate Summary (Must-Pass)

| Gate | Criteria |
|------|----------|
| **0. Test Infra** | Decisions (D1–D3) and thresholds documented; migration path and test env + fixtures confirmed. |
| **1. Data/Contracts** | approval + audit schemas and threshold constants exported; typecheck passes. |
| **2. Backend** | admin_approvals migration and RPCs exist; approval and execute write audit atomically; integration tests pass. |
| **3. API** | List/create/approve/reject/execute with RBAC, second-person, cursor, idempotency; Supertest pass. |
| **4. ViewModels** | No server-only/Supabase in VM. |
| **5. UI** | Queue page + request/approve/execute flows; loading/error/empty states; smoke pass. |
| **6. QA/Release** | Supertest + Playwright + fixtures; optional feature flag and rollback doc. |

---

## 4) Definition of Done

- [ ] D1/D2/D3 documented; thresholds and RPC mapping in ADMIN_APPROVALS.md or plan.
- [ ] `admin_approvals` migration in MIGRATIONS/for_sline_app; RPCs request/approve_reject and execute (or gated existing RPCs) with atomic audit.
- [ ] GET/POST /api/v1/finance/approvals (with cursor/limit), POST approve/reject, POST wallets/:userId/adjust (and reversal/refund when applicable) with approval gate and Idempotency-Key.
- [ ] Approval queue UI with list, request, approve, reject, execute; requester-only execute; loading/error/empty states.
- [ ] audit.ts extended with admin.approval.* and admin.finance.wallet_adjust.
- [ ] Supertest and Playwright cover unauthenticated/forbidden, second-approver, idempotency, “dangerous op without approval fails”, and double-execute 409.

---

*Assume it will fail. Prove it won’t.*
