# Plan: PAGE 02 + PAGE 03 — Canonical Audit & Finance RPC (Critic-Revised)

**Source:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` (PAGE 02, PAGE 03)  
**Planner:** `.agent/workflows/planner.md`  
**Critic:** `.agent/workflows/plan_critic.md`  
**Context:** `.agent/PROJECT_CONTEXT.md`, `.chatgpt_context/EXECUTION_CHECKLIST.md`

---

# Part I — Plan Critic Audit

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (safe to infer)
- **Verified in dashboard code:** `apps/api` uses `withAudit` and `admin_logs`; task activity reads from `admin_logs`; team invite writes wrong columns to `audit_logs`.
- **Verified in SQL (app repo):** `audit_logs` has columns `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `journal_entry_id`, `meta`, `created_at`. `related_entity_type` is typed as **`related_entity_type_enum`** with values: `'booking'`, `'task_request'`, `'withdrawal_request'`, `'admin_adjustment'` only. There is **no** `'task'`, `'admin_user'`, or `'profile'`.
- **Verified in SQL (app repo):** `withdrawal_requests` has no `processed_by` or `admin_notes`; only `processed_at`, `meta`, etc.
- Dashboard repo does not own canonical DB; app repo (`sline_app/supabase/migrations`) is system-of-record.

### Decision Needed (Blocking)

**D1. How to store admin audit `related_entity_type` for task/team/user actions?**

- **Gap:** Plan says filter task activity by `related_entity_type = 'task'` and insert audit with `related_entity_type`; app schema uses enum with no `'task'` or `'admin_user'` or `'profile'`. Inserts would fail.
- **Options:**  
  - **Option 1:** Add app migration in **app repo** to extend `related_entity_type_enum` with values needed for admin audit (e.g. `'task'`, `'admin_user'`, `'profile'`, `'withdrawal_request'` already exists).  
  - **Option 2:** Use a separate `admin_audit_logs` table in app repo with TEXT `related_entity_type` (no enum) for admin-only events; keep `audit_logs` for ledger/finance only.  
  - **Option 3:** Store admin actions in `audit_logs` with `related_entity_type = 'admin_adjustment'` and put the real entity type in `meta.entity_type` (e.g. `task`, `admin_user`); task activity would filter by `meta->>'entity_type' = 'task'` and `related_entity_id = task_id`.
- **Recommendation:** Option 1 — extend enum in app repo. Single table, single schema, clear semantics; one migration. Option 3 is a workaround without schema change but muddies querying and indexing.
- **Plan impact:** Add explicit step: **App repo migration** to `ALTER TYPE related_entity_type_enum ADD VALUE 'task'` (and `'admin_user'`, `'profile'` if used). Order: Data/Contracts phase first.

**D2. withAudit: Option A (RPC-only) vs Option B (withAudit → audit_logs)?**

- **Gap:** Plan leaves "Either (A) or (B)" — execution cannot proceed without a single choice.
- **Options:**  
  - **A:** Remove `withAudit`; every privileged mutation becomes an RPC that does mutation + audit in one transaction.  
  - **B:** Keep `withAudit`, change it to insert into `audit_logs` with canonical columns only (non-atomic).
- **Recommendation:** **B for PAGE 02** scope; document "non-atomic" and add a follow-up work item to migrate high-value mutations to RPC (PAGE 02 DoD does not require full RPC migration). Option A would expand scope (users, tasks, team, disputes, finance all need new RPCs) and delay PAGE 02 gates.
- **Plan impact:** Remove "Either (A) or (B)". Specify: **Step: Change `withAudit` to insert into `audit_logs` with canonical columns only; same handler-then-insert order; document non-atomic.** Add invariant: "Future: privileged mutations SHOULD move to DB RPC with atomic audit."

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No step that ensures test runner, env, and fixtures exist before adding tests. | Add Phase 0 step: @DevOps/@QA confirm `apps/api` and `packages/shared` test scripts run and env (e.g. Supabase URL/key) is injectable for integration tests. |
| **1. Data/Contracts** | ❌ FAIL | Task activity assumes `related_entity_type = 'task'` but enum has no `'task'`. Contract phase does not include app-repo enum extension. | Add Data phase: app migration extends `related_entity_type_enum`; Contracts phase adds `AuditLogRowSchema` and explicit TaskActivityResponseSchema (DTO). |
| **2. Security** | ✅ PASS | No service-role in client; RBAC on routes; audit required. | None. |
| **3. Backend/API** | ❌ FAIL | withAudit choice ambiguous; no stop condition "audit insert fails → request fails or alert". | Fix D2; add stop condition: if using (B), either fail request on audit insert failure or document + add log/alert. |
| **4. UI/Integration** | ❌ FAIL | Task activity response shape not defined as a shared DTO before API change; UI could break. | Define TaskActivityItemSchema (or equivalent) in Phase 1 Contracts; API and UI both use it. |
| **5. Release/QA** | ❌ FAIL | No rollback or backward-compat note for "dashboard migration RPC removed or overridden by app migration". | Add step: document migration order (app migration applied first); idempotent RPC so re-run is safe. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix | Owner | Acceptance |
|-----|----------------|-----|--------|------------|
| `related_entity_type_enum` has no `task`/`admin_user`/`profile` | INSERT into `audit_logs` and SELECT by `related_entity_type = 'task'` will fail (enum constraint). | App repo migration: extend enum with required values. Execute before any API writes/reads. | @SysOp | Query `pg_enum` for `related_entity_type_enum` includes new values; one insert/select test. |
| Task activity response DTO undefined | API and UI may disagree on field names (actor_id vs actor_user_id, target_resource vs related_entity_type). | Add `TaskActivityItemSchema` (and export type) in `packages/shared` in Phase 1; API returns that shape; UI consumes it. | @SysOp + @AdminArchitect | Typecheck and one integration test assert response shape. |
| withAudit A vs B not decided | Implementer may choose differently per route or leave both paths. | Lock to (B) for PAGE 02 with documented non-atomicity and future RPC migration; add single "audit insert failure" behavior (fail or log). | @SysOp | All call sites use same withAudit; doc comment in audit.ts. |
| PAGE 03 RPC location and migration order unclear | Dashboard and app both have migrations; production may apply only app. If dashboard defines RPC and app later overwrites, order matters. | Explicit: RPC is **defined only in app repo**; dashboard migration either drops the function from dashboard DB or is not run in prod. Document "Apply app migrations to shared DB; dashboard does not define admin_process_withdrawal." | @SysOp | Readme or migration header states order; grep shows RPC created only in app repo. |
| No test infra gate | Tests added without confirming runner/env; CI may be red or flaky. | Phase 0: Run `npm run test` (or equivalent) for api and shared; document env vars for integration tests. | @QA + @DevOps | CI or local test run passes before new tests are merged. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| No API/UI reads or writes `admin_logs`. | Grep in apps/api, apps/admin-ui, packages/shared; CI step. | `rg admin_logs apps/api apps/admin-ui packages/shared` → 0 matches. |
| Every audit insert uses only canonical columns: `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta` (and optionally `journal_entry_id`). | Code review; Zod parse before insert if desired. | Grep insert into audit_logs; no `actor_id`, `target_resource`, `target_id`, `metadata`. |
| Withdrawal approve/reject is idempotent: second call with same request id does not double-process. | RPC: lock row where status = 'requested'; NOT FOUND → raise or return. | Integration test: approve twice, second returns error or no-op; single audit row. |
| Exactly one `audit_logs` row per withdrawal decision. | RPC inserts audit in same transaction as status update. | Integration test: count audit_logs for request_id before/after; delta = 1. |
| Task activity returns only rows from `audit_logs` with `related_entity_type` and `related_entity_id` matching task. | Route filters by `related_entity_type = 'task'` and `related_entity_id = id`. | Integration test: create audit row for task, GET activity, assert presence and shape. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|---------------|---------------|------------|----------|
| Enum extension breaks existing inserts | App DB | Low | High | App-wide | Migration error on deploy | Add values with ADD VALUE (safe in PG); deploy app migration first | Rollback migration (remove enum values only if no rows use them — PG allows only add) |
| withAudit audit insert fails after mutation | audit.ts | Med | High | Feature (audit gap) | Log "Failed to write audit log" | Prefer RPC later; for (B) add retry or fail request | Alert on log; manual reconciliation |
| Task activity empty after cutover | tasks route | Med | Med | Feature | UI shows "No activity" for tasks that had admin_logs | Backfill audit_logs from admin_logs once (optional) or accept history cut | Document "activity from date X only" |
| RPC argument mismatch in production | finance.ts vs DB | Med | High | Finance | "unknown argument" or RPC error in logs | Align names in one place; integration test against real DB | Feature flag or quick patch to match deployed RPC |
| Double withdrawal processing | admin_process_withdrawal | Low | High | Data / money | Duplicate audit rows or status flip | Lock + status check; idempotency test | Idempotency test in CI; manual correction if ever happens |

---

## F) Pre-Mortem

- This fails when **we deploy API before app migration**, so `audit_logs` still has enum without `'task'` and inserts fail.
- This fails when **task activity DTO is not in shared** and UI keeps using `actor_id` / `target_resource`, so response parsing breaks.
- This fails when **we remove dashboard RPC but app RPC is not yet applied** to shared DB, so approve/reject return 500.
- This fails when **withAudit is left as "either A or B"** and one route is refactored to RPC and another keeps withAudit, causing inconsistent audit semantics.
- This fails when **integration tests assume a real Supabase** and CI has no env, so tests are skipped or flaky.
- This fails when **we add `processed_by` in RPC** without adding the column in app schema, so RPC errors in production.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Artifact | Stop condition |
|------|-----|-----|----------|------------------|
| Resolve related_entity_type for admin audit | Inserts/reads would fail without enum values. | App repo migration: `ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'task';` (and `admin_user`, `profile` as needed). | New migration file in sline_app/supabase/migrations | Enum contains new values; one manual or automated check. |
| Define task activity response contract | Avoid UI/API shape drift. | Add in packages/shared: TaskActivityItemSchema (id, actor_user_id or actor object, action, related_entity_type, related_entity_id, created_at, meta). Export type. | packages/shared/src/schemas/audit.ts or tasks.ts | Type used by API response and UI; test asserts shape. |
| Lock withAudit to (B) and document | Single behavior; no ambiguity. | In audit.ts: insert into audit_logs only, canonical columns; JSDoc "Non-atomic; audit failure is logged. Prefer DB RPC with atomic audit for new code." Optional: return failure if audit insert fails. | apps/api/src/audit.ts | No insert to admin_logs; comment present; all call sites unchanged except table/columns. |
| Test infra gate | Tests must run. | Step 0: Run `npm run test` (or test:integration) for api and shared; document SUPABASE_URL/KEY for integration. | CI or local doc | Test command exits 0 or skip is explicit and documented. |
| Migration order for RPC | Avoid "RPC not found" or wrong version. | Document: "Apply sline_app migrations first; dashboard 20260228000000 may be run for local dev only; production DB gets RPC from app repo." Optional: in dashboard migration, DROP IF EXISTS before app migration is applied, or do not create admin_process_withdrawal in dashboard. | README or migration header | Written; grep confirms RPC created in app repo only. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict dependency order: **1) Data/Contracts → 2) Security (no change) → 3) Backend/API → 4) UI → 5) QA/Release.** Gate at end of each phase.

---

### PAGE 02 — Canonical Audit: Kill admin_logs Drift

#### Phase 0: Preconditions & Test Infra Gate

- **Goal:** Workspace and test infra are ready; no fake progress.
- **Steps:**
  - [ ] **0.1 (@DevOps):** Ensure `npm run -w apps/api typecheck` and `npm run -w apps/admin-ui build` pass (PAGE 01 done).
  - [ ] **0.2 (@QA):** Confirm test runner for `apps/api` and `packages/shared` works (`npm run test` or equivalent); document env (e.g. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) for integration tests.
- **Gate 0:** Build and typecheck pass; test command runs (or skip documented). **Stop if fail.**

#### Phase 1: Data & Contracts

- **Goal:** Canonical schema supports admin audit; shared contracts define audit and task activity shape.
- **Steps:**
  - [ ] **1.1 (@SysOp) — App repo:** In **sline_app** (canonical DB owner), add migration extending `related_entity_type_enum`: add values `'task'`, `'admin_user'`, `'profile'` (or minimal set for current routes). Use `ALTER TYPE ... ADD VALUE IF NOT EXISTS` so migration is idempotent.
  - [ ] **1.2 (@SysOp):** Add `packages/shared/src/schemas/audit.ts`: `AuditActionEnum` (z.enum of known actions), `AuditLogRowSchema` (actor_user_id, action, related_entity_type, related_entity_id, meta, optional journal_entry_id), `MutationAckSchema` (minimal ack). Add **TaskActivityItemSchema** and export type (fields: id, actor_user_id, action, related_entity_type, related_entity_id, created_at, meta; or actor object if API joins profiles).
  - [ ] **1.3 (@QA):** Unit test(s) for audit schema parsing (valid/invalid).
- **Gate 1:** Enum extended in app repo; audit schemas and TaskActivityItemSchema exist; unit tests pass. **Stop if fail.**

#### Phase 2: Backend/API — Audit Only

- **Goal:** No admin_logs; all audit writes and task activity read use audit_logs with canonical columns and defined DTO.
- **Steps:**
  - [ ] **2.1 (@SysOp):** Fix `apps/api/src/audit.ts`: Remove insert into `admin_logs`. Insert into `audit_logs` with **canonical columns only**: `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta`. Map handler args: entityType → related_entity_type, entityId → related_entity_id; put request_id/user_agent in meta. Add JSDoc: "Non-atomic; audit insert failure is logged. Prefer DB RPC with atomic audit for new privileged mutations."
  - [ ] **2.2 (@SysOp):** Update `apps/api/src/routes/team.ts`: Replace manual audit insert with canonical columns (actor_user_id, action, related_entity_type, related_entity_id, meta).
  - [ ] **2.3 (@SysOp):** Update GET `/api/v1/tasks/:id/activity`: Read from `audit_logs`; filter `related_entity_type = 'task'` and `related_entity_id = id`; return array matching **TaskActivityItemSchema** (join profiles for actor if needed).
  - [ ] **2.4 (@QA):** Grep: zero `admin_logs` in `apps/api/src/**`. All audit inserts use only canonical columns.
- **Gate 2:** No admin_logs in API; task activity from audit_logs; response shape matches shared schema. **Stop if fail.**

#### Phase 3: ViewModels / API Contract (glue)

- **Goal:** UI and API agree on task activity type.
- **Steps:**
  - [ ] **3.1 (@AdminArchitect):** Wire task activity API response type to shared TaskActivityItemSchema (or derived type); ensure TaskActivity and tasks_api use it. Remove any use of target_resource, target_id, actor_id in UI for this feature.
- **Gate 3:** @CodeWarden MVVM check; no legacy audit field names in UI. **Stop if fail.**

#### Phase 4: UI

- **Goal:** Task detail activity list works with new API shape.
- **Steps:**
  - [ ] **4.1 (@UIExpert):** Update TaskDetail.tsx and TaskActivity.tsx to consume new response (actor from actor_user_id + profiles, action, created_at). Handle loading/empty/error states.
  - [ ] **4.2 (@QA):** Smoke: open task detail, activity list renders without error.
- **Gate 4:** No admin_logs in apps/admin-ui; task activity UI works. **Stop if fail.**

#### Phase 5: QA & Release

- **Goal:** Regression coverage and no admin_logs anywhere in scope.
- **Steps:**
  - [ ] **5.1 (@QA):** Grep `admin_logs` in `apps/api`, `apps/admin-ui`, `packages/shared` → 0.
  - [ ] **5.2 (@QA):** Integration test: one mutation (e.g. task force-cancel or team remove) produces exactly one audit_logs row with canonical columns.
  - [ ] **5.3 (@QA):** Integration test: GET task/:id/activity returns TaskActivityItemSchema-shaped array when audit rows exist.
- **Gate 5:** All gates pass; DoD for PAGE 02 met. **Stop if fail.**

---

### PAGE 03 — Fix Finance RPC Drift

**Precondition:** PAGE 02 gates passed.

#### Phase 0: Preconditions

- [ ] PAGE 02 Gate 5 passed. **Stop if not.**

#### Phase 1: Data (App Repo) — RPC Canonical

- **Goal:** RPC lives in app repo only; signature and columns match API and canonical schema.
- **Steps:**
  - [ ] **1.1 (@SysOp) — App repo:** In **sline_app/supabase/migrations**, add migration: create or replace `admin_process_withdrawal(p_request_id uuid, p_decision text, p_admin_id uuid, p_reason text)`. Body: lock row where id = p_request_id and status = 'requested'; if not found, raise. Update `withdrawal_requests` set status = approve→'completed' / reject→'failed', processed_at = now(); do **not** set processed_by or admin_notes (store in meta if needed: e.g. meta = meta || jsonb_build_object('processed_by', p_admin_id, 'reason', p_reason)). Single INSERT into audit_logs (actor_user_id, action, related_entity_type, related_entity_id, meta) in same transaction.
  - [ ] **1.2 (@SysOp):** In **dashboard** repo: Remove creation of `admin_process_withdrawal` from `supabase/migrations/20260228000000_admin_views_rpcs.sql` (or add comment "RPC defined in app repo; do not create here in production"). Document migration order: apply app migrations first.
  - [ ] **1.3 (@QA):** In staging or local app DB, call RPC with canonical args; verify no "unknown argument" or "column does not exist"; one audit_logs row per decision.
- **Gate 1:** RPC in app repo only; uses only canonical columns; idempotent. **Stop if fail.**

#### Phase 2: API & Contracts

- **Goal:** Fastify calls RPC with same parameter names; contracts match.
- **Steps:**
  - [ ] **2.1 (@SysOp):** Ensure `apps/api/src/routes/finance.ts` calls RPC with `p_request_id`, `p_decision`, `p_reason`, `p_admin_id` (already so; verify and add test).
  - [ ] **2.2 (@SysOp):** Confirm ApproveWithdrawalSchema / RejectWithdrawalSchema match (requestId, reason). No change if already correct.
  - [ ] **2.3 (@QA):** Integration tests: approve success, reject success, invalid request_id 4xx, already-processed idempotency (second call does not double-process; single audit row).
- **Gate 2:** POST approve/reject 200; RPC errors none; idempotency test passes. **Stop if fail.**

#### Phase 3: UI & Release

- **Goal:** Finance UI still works; release safe.
- **Steps:**
  - [ ] **3.1 (@UIExpert):** Smoke: approve/reject from finance withdrawals UI (no contract change required if API unchanged).
  - [ ] **3.2 (@DevOps):** Document: apply app migrations before dashboard in shared DB; RPC is app-owned.
- **Gate 3:** UI smoke pass; migration order documented. **Stop if fail.**

---

## I) Change Report (Diff-Style)

1. **Original issues:** (1) related_entity_type enum missing 'task' etc.; (2) withAudit (A) vs (B) ambiguous; (3) task activity DTO not in shared; (4) no test infra gate; (5) RPC migration order unclear; (6) gate list not aligned with critic’s 0–5.
2. **Added steps:** App repo migration to extend related_entity_type_enum (Phase 1 PAGE 02); TaskActivityItemSchema in shared (Phase 1); test infra gate (Phase 0); explicit migration order and dashboard RPC removal/deprecation (PAGE 03); JSDoc and single (B) behavior for withAudit.
3. **Removed steps:** Optional compatibility view (deferred); "Either (A) or (B)" — replaced by locked (B).
4. **Reordered:** Data/Contracts (including enum and DTO) before any API change; gate 0 before new tests.
5. **Expanded steps:** Enum extension with exact values; RPC body "do not write processed_by/admin_notes" and meta merge; stop conditions per phase; acceptance checks per gap.
6. **Why:** To make the plan execution-safe and repo-verifiable; avoid enum and RPC failures in production; ensure UI does not break on response shape; enforce "no fake progress" with test infra gate.
7. **Residual risks:** withAudit remains non-atomic (accepted for PAGE 02); backfilling old admin_logs into audit_logs not in scope (task activity may be empty for pre-cutover data).

---

# Part II — Definition of Done (Unchanged Intent)

- **PAGE 02:** (1) Zero `admin_logs` in apps/api, apps/admin-ui, packages/shared. (2) All audit writes use audit_logs with canonical columns only. (3) GET task activity reads from audit_logs; response matches TaskActivityItemSchema; UI works. (4) Shared audit schemas + task activity schema; unit tests. (5) related_entity_type_enum extended in app repo. (6) One integration test: mutation → one audit row.
- **PAGE 03:** (1) admin_process_withdrawal in app repo only; canonical signature and no non-existent columns. (2) API calls RPC; POST approve/reject 200; one audit_logs row per decision. (3) Idempotency test passes. (4) Migration order documented.

---

*Assume it will fail. Prove it won’t.*
