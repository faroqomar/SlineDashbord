# Plan: PAGE 06 — Force Logout / Session Revocation (Critic-Revised)

**Source:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` (PAGE 06)  
**Planner:** `.agent/workflows/planner.md`  
**Critic:** `.agent/workflows/plan_critic.md`  
**Context:** `.agent/PROJECT_CONTEXT.md`, `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md`

---

# Part I — Plan Critic Audit

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (safe to infer)

- **Verified in dashboard code:** `apps/api` has users plugin at `/api/v1/users` with GET list, GET `:userId`, POST ban, POST unban; auth sets `(request as any).user` from `verifyToken` with `id`, `email`, `role`; `requireAdminRole` reads `request.user`; `withAudit` uses `request.user` for actor. Refs: `apps/api/src/app.ts`, `apps/api/src/middleware/rbac.ts`, `apps/api/src/audit.ts`, `apps/api/src/routes/users.ts`.
- **Verified in dashboard code:** `related_entity_type_enum` extended with `'profile'` in dashboard migrations (`supabase/migrations/20260302100000_extend_audit_related_entity_type_enum.sql`); RPC in same repo uses `'profile'` for profile-related audit. App repo is canonical for production; dashboard may mirror for local dev.
- **Verified in dashboard code:** `MutationAckSchema` exists in `packages/shared/src/schemas/audit.ts`; `AuditActionEnum` exists but does **not** currently include `'admin.users.force_logout'`.
- **Missing repo evidence:** No `profiles.force_logout_after` column or `admin_force_logout_user` RPC in dashboard or app repo migrations (per audit gap list).
- **Verified in audit doc:** API contract requires `Idempotency-Key` for force-logout; response `MutationAckSchema`; roles `admin`, `super_admin`; audit action `admin.users.force_logout`.

### Decision Needed (Blocking)

**D1. Where is idempotency enforced — API or RPC?**

- **Gap:** Plan says "check idempotency store (or RPC-side idempotency)" and "return 409 on replay". No idempotency middleware exists in API; finance uses RPC-side "already processed" semantics.
- **Options:**  
  - **A:** API stores `Idempotency-Key` (in-memory or DB table); same key within TTL → 409; RPC does not accept key.  
  - **B:** RPC accepts `p_idempotency_key text`; RPC checks/store returns existing result for same key (no second audit row); API passes header to RPC.  
  - **C:** No idempotency in v1; document as follow-up; return 200 every time (re-force-logout just updates timestamp again).
- **Recommendation:** **B** — RPC-side idempotency so one source of truth and no duplicate audit rows; aligns with finance pattern. If app repo cannot add idempotency table quickly, **C** for PAGE 06 and add idempotency in a follow-up.
- **Plan impact:** Add step: RPC signature includes `p_idempotency_key text default null`; RPC body: if key present and already used for this (admin_id, user_id) in a short window, return success without second update/audit; else update + audit and store key. Or lock to (C) and add "Idempotency-Key: optional; if implemented later return 409 on replay".

**D2. Force-logout self or other admins?**

- **Gap:** Plan does not say whether an admin can force-logout another admin or themselves.
- **Options:** Allow (any user id); Disallow self (403); Disallow other admins (403).
- **Recommendation:** Allow force-logout of any user id (including self and other admins). Simpler; no extra role lookup. Document in API doc.
- **Plan impact:** No extra step; add to DoD: "Target user may be any auth.users id (including admins); no 403 for same-user or admin target."

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No step ensuring test runner and env exist before adding tests. | Phase 0: @QA confirm `npm run -w @sline/api test` runs; document env for integration tests. |
| **1. Data/Contracts** | ❌ FAIL | `AuditActionEnum` in shared does not include `'admin.users.force_logout'`; plan does not add it. | Add step: extend `AuditActionEnum` (or document RPC uses string); add `ForceLogoutInputSchema` with explicit field list and path/body merge rule. |
| **2. Security** | ⚠️ WARN | Force-logout must be admin/super_admin only; current users plugin hook allows support/moderator. | Add step: force-logout route must use stricter RBAC (per-route override or inner check) so only admin/super_admin can call. |
| **3. Backend/API** | ❌ FAIL | Idempotency strategy undefined (D1); `request.user.id` not explicitly stated as source of p_admin_id. | Lock D1; add step: get admin id from `(request as any).user.id`; map RPC not_found → 404, DB error → 500. |
| **4. UI/Integration** | ✅ PASS | Optional UI with confirmation; MVVM and API-only from UI. | None. |
| **5. Release/QA** | ❌ FAIL | No rollback note; no explicit "app-repo enforcement" doc artifact. | Add: rollback = revert migration (additive only); add doc step for app repo (Flutter) enforcement. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix | Owner | Acceptance |
|-----|----------------|-----|--------|------------|
| related_entity_type enum in app repo | RPC insert into audit_logs uses `related_entity_type = 'profile'`; if app repo enum has no `'profile'`, insert fails. | Ensure app migration extends enum with `'profile'` (or reuse existing extension from PAGE 02 copy). Discovery step in Phase 0: verify app repo enum. | @SysOp | Query or migration shows `'profile'` in enum; RPC runs without error. |
| Stricter RBAC for force-logout | Plugin hook allows support/moderator; contract requires admin/super_admin only. | Implement POST `:userId/force-logout` with route-level check: after plugin, if `request.user.role` not in `['admin','super_admin']` return 403. Or register route in a separate prefix with stricter hook. | @SysOp | Test: support role → 403. |
| AuditActionEnum missing action | Shared schema and future validation may expect action in enum. | Add `'admin.users.force_logout'` to `AuditActionEnum` in `packages/shared/src/schemas/audit.ts`. | @SysOp | Grep shows enum contains value; unit test parses. |
| Idempotency undefined | Implementer may skip or implement inconsistently. | Lock D1 (e.g. RPC-side or defer); add explicit step and test (409 or 200 twice). | @SysOp + @QA | Test: same idempotency key twice → 409 or 200 with no duplicate audit. |
| Admin id source not explicit | Handler might use wrong identifier. | Step: "Get p_admin_id from (request as any).user.id (set by app.ts auth hook)." | @SysOp | Code review; test with testUser.id. |
| App-repo enforcement not documented | Flutter may never check force_logout_after; E2E will fail. | Add deliverable: short doc (e.g. `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md` or section in README) stating app must read profiles.force_logout_after and force re-auth. | @DocKeeper | File or section exists; DoD includes "app-repo enforcement documented". |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Exactly one audit_logs row per successful force-logout (no double audit). | RPC performs UPDATE + INSERT in one transaction; no withAudit in route. | Integration test: call once, count audit_logs for action = 'admin.users.force_logout' and related_entity_id = user_id; delta = 1. |
| Force-logout is only callable by admin or super_admin. | Route returns 403 for support/moderator. | API test: 403 for role support. |
| Revocation state is stored in app-owned schema (profiles). | RPC updates profiles.force_logout_after = now(); no Supabase Auth admin required for revocation storage. | Migration and RPC body; optional: Supabase Auth revoke as extra layer. |
| Request validation: userId from path is UUID. | ForceLogoutInputSchema (path merged) with userId.uuid(). | Unit test: invalid UUID → parse failure. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|---------------|---------------|------------|----------|
| App never enforces force_logout_after | Flutter app | Med | High | Feature (user stays logged in) | E2E fails; support tickets | Doc in dashboard + app repo; ticket for app implementation | Document; track in app backlog |
| Enum missing 'profile' in app DB | App migration | Low | High | Force-logout + any profile audit | RPC error on deploy | Apply enum extension before RPC; migration order doc | Rollback RPC; add enum value |
| Idempotency replay causes duplicate audit | RPC or API | Med | Med | Audit integrity | Two rows for same key | RPC-side idempotency or 409 in API | Idempotency test; fix RPC/API |
| Force-logout route allows support/moderator | users.ts | Low | Med | Security (over-privilege) | RBAC test fails | Explicit role check in route | Add check; release patch |
| RPC not found in production | App repo not deployed | Med | High | Force-logout 500 | 500 in staging/prod | Migration order: app repo first; doc | Deploy app migration; retry |

---

## F) Pre-Mortem

- This fails when **app repo migrations are not applied** before dashboard API is deployed, so RPC or column is missing and force-logout returns 500.
- This fails when **related_entity_type_enum** in app DB does not include `'profile'`, so audit insert in RPC raises.
- This fails when **RBAC is not tightened** for this route and support/moderator can call force-logout.
- This fails when **idempotency is not implemented** and duplicate calls write duplicate audit rows or inconsistent behavior.
- This fails when **Flutter app never checks force_logout_after**, so user appears to stay logged in after admin force-logout.
- This fails when **request.user is undefined** (e.g. route registered before auth hook) and p_admin_id is null.
- This fails when **tests assume real DB** and CI has no env, so tests are skipped or flaky.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Artifact | Stop condition |
|------|-----|-----|----------|------------------|
| Test infra gate | No fake progress. | Phase 0: Run `npm run -w @sline/api test`; document SUPABASE_* for integration. | CI or doc | Test command exits 0 or skip documented. |
| Enum and RPC in app repo | Single source of truth. | Discovery: verify app repo has `related_entity_type_enum` with 'profile'. Add migration in app repo: profiles.force_logout_after, admin_force_logout_user RPC. | App repo migration(s) | RPC callable; one audit row. |
| Stricter RBAC | Contract requires admin/super_admin. | In POST :userId/force-logout handler: if request.user.role not in ['admin','super_admin'] return 403. | users.ts | 403 for support in test. |
| AuditActionEnum | Consistent validation. | Add 'admin.users.force_logout' to AuditActionEnum in packages/shared/src/schemas/audit.ts. | audit.ts | Enum includes value. |
| Idempotency (lock) | Contract requires Idempotency-Key. | Option B: RPC accepts p_idempotency_key; dedupe in RPC. Or Option C: defer idempotency; document; add 409 step later. | RPC signature + body or doc | Test: replay behavior defined. |
| App enforcement doc | E2E and ops depend on it. | Add MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md (or section in README): app must read force_logout_after and force re-auth. | Doc file | File exists; DoD updated. |
| Rollback note | Release safety. | Add: Migration additive; rollback = revert migration; app that doesn’t check column unchanged until app deploy. | Plan section | Written in Corrected Plan. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict order: **0) Preconditions & Test Infra → 1) Data/Contracts → 2) Backend/API → 3) UI (optional) → 4) QA/Release.** Gate at end of each phase.

---

### Phase 0: Preconditions & Test Infra Gate

- **Goal:** Build and test infra are ready; app repo state known.
- **Steps:**
  - [ ] **0.1 (@DevOps):** Ensure `npm run -w @sline/api typecheck` and `npm run -w @sline/admin-ui build` pass. **Stop if fail.**
  - [ ] **0.2 (@QA):** Run `npm run -w @sline/api test`; document env (e.g. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) for integration tests if needed.
  - [ ] **0.3 (@SysOp):** Discovery — verify in **app repo** (or dashboard if app repo not available): `related_entity_type_enum` includes `'profile'`; `profiles` table exists. If PAGE 05 adds `force_logout_after`, note migration name; otherwise plan dedicated migration for column + RPC.
- **Gate 0:** Build and typecheck pass; test run passes or skip documented; column/RPC ownership and enum state documented. **Stop if fail.**

---

### Phase 1: Data & Contracts

- **Goal:** Shared contracts and audit enum support force-logout; app repo has revocation column and RPC.
- **Steps:**
  - [ ] **1.1 (@SysOp):** In `packages/shared/src/schemas/audit.ts`, add `'admin.users.force_logout'` to `AuditActionEnum`. Export unchanged.
  - [ ] **1.2 (@SysOp):** Add `ForceLogoutInputSchema` in `packages/shared/src/schemas/users.ts`: `userId: z.string().uuid()` (from path), `reason: z.string().max(500).optional()`, `idempotency_key: z.string().optional()`. Export from `packages/shared/src/index.ts`. Response: existing `MutationAckSchema`.
  - [ ] **1.3 (@SysOp) — App repo:** In **app repo** migration: ensure `profiles.force_logout_after timestamptz default null` exists (add if not from PAGE 05). Add RPC `admin_force_logout_user(p_user_id uuid, p_admin_id uuid, p_reason text default null, p_idempotency_key text default null)`. Body: (1) If p_idempotency_key present, check idempotency store for (p_admin_id, p_user_id, key); if found return success without mutation. (2) UPDATE profiles SET force_logout_after = now() WHERE id = p_user_id; if no row updated, raise not_found. (3) INSERT audit_logs (actor_user_id, action, related_entity_type, related_entity_id, meta) = (p_admin_id, 'admin.users.force_logout', 'profile', p_user_id, jsonb_build_object('reason', p_reason)). (4) If idempotency key provided, store it. All in one transaction. If idempotency table not in scope, omit key handling and allow 200 on every call (document "Idempotency-Key optional; 409 deferred").
  - [ ] **1.4 (@QA):** Unit test: `ForceLogoutInputSchema` — valid userId + optional reason/key; invalid userId fails.
- **Gate 1:** Enum extended; schema and RPC exist; unit test passes. **Stop if fail.**

---

### Phase 2: Backend/API

- **Goal:** POST /api/v1/users/:userId/force-logout implemented; RPC called; RBAC and errors correct.
- **Steps:**
  - [ ] **2.1 (@SysOp):** In `apps/api/src/routes/users.ts`, add POST `/:userId/force-logout`. Parse path `userId`; merge with body and validate with `ForceLogoutInputSchema`. **Before** calling RPC: if `(request as any).user.role` is not in `['admin','super_admin']`, return 403.
  - [ ] **2.2 (@SysOp):** Get `p_admin_id` from `(request as any).user.id`. Call RPC `admin_force_logout_user(p_user_id, p_admin_id, body.reason ?? null, request.headers['idempotency-key'] ?? null)`. Do **not** use `withAudit`. Map: RPC not_found → 404; RPC/DB error → 500; success → 200 with `MutationAckSchema` (e.g. `{ userId: userId }`).
  - [ ] **2.3 (@SysOp):** If RPC returns idempotency replay (e.g. same key already processed), return 409 with appropriate body. If idempotency not implemented in RPC, skip 409 for now; document.
  - [ ] **2.4 (@QA):** Supertest: 401 no token; 403 support role; 400 invalid userId; 404 non-existent user; 200 admin/super_admin + valid body; response shape MutationAckSchema; (if idempotency in RPC) 409 on replay.
- **Gate 2:** Route implemented; RPC called; RBAC and error mapping verified by tests. **Stop if fail.**

---

### Phase 3: UI (Optional)

- **Goal:** User detail page can trigger force-logout with confirmation.
- **Steps:**
  - [ ] **3.1 (@AdminArchitect):** Add ViewModel/API client method for POST force-logout (optional reason, Idempotency-Key). Use existing users API pattern.
  - [ ] **3.2 (@UIExpert):** On user detail page, add "Force logout" button (destructive), confirmation dialog ("User will need to sign in again"), optional reason field. Visible only for admin/super_admin.
  - [ ] **3.3 (@CodeWarden):** MVVM check: no DB/Supabase in view; ViewModel calls API only.
- **Gate 3:** Smoke: open user detail as admin, trigger force-logout, confirm; success feedback. **Stop if fail.**

---

### Phase 4: QA & Release

- **Goal:** Tests pass; app-repo enforcement documented; rollback known.
- **Steps:**
  - [ ] **4.1 (@QA):** API tests: 401, 403, 400, 404, 200, (409 if implemented). Assert one audit row on 200.
  - [ ] **4.2 (@QA):** E2E or doc: "After admin force-logout, user must re-auth." Document dependency on Flutter reading `profiles.force_logout_after`.
  - [ ] **4.3 (@DocKeeper):** Add `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md` (or equivalent): app must read `profiles.force_logout_after` and, if set and after token issued time, clear session and require re-auth. Link from plan DoD.
  - [ ] **4.4 (@SecGuard):** Confirm force-logout route uses service-role only in API; no revocation logic in admin-ui.
  - [ ] **4.5 (@DevOps):** Rollback note: migration is additive (new column, new RPC); rollback = revert migration; apps that do not yet check force_logout_after continue to work until app deploy.
- **Gate 4:** All gates pass; DoD met; app-repo enforcement documented. **Stop if fail.**

---

## 3) Gate Checks (Must-Pass)

| Gate | Criterion |
|------|-----------|
| **Build Gate** | `npm run -w @sline/api typecheck` and `npm run -w @sline/admin-ui build` pass. |
| **Test Infra Gate** | `npm run -w @sline/api test` runs (or skip documented). |
| **Contracts Gate** | `ForceLogoutInputSchema` in shared; `MutationAckSchema` response; `AuditActionEnum` includes `'admin.users.force_logout'`. |
| **Security Gate** | Only admin/super_admin can call force-logout; no service-role in admin-ui; audit written atomically by RPC. |
| **API Gate** | POST implemented; RPC called; 401/403/400/404/200/(409) per contract. |
| **UI Gate** | (Optional) Force logout button + confirmation; MVVM preserved. |
| **QA Gate** | API tests pass; E2E or doc for user re-auth; app-repo enforcement doc exists. |

---

## 4) Risks & Mitigations

| Risk | Prevention | Detection |
|------|------------|-----------|
| App never enforces | Doc in dashboard + app repo; DoD includes doc. | E2E fails; doc present. |
| Enum missing 'profile' | App migration order; discovery step. | RPC error; migration list. |
| Idempotency duplicate audit | RPC-side dedupe or 409 in API. | Test: replay → 409 or single audit. |
| Support can call force-logout | Explicit role check in route. | Test: 403 for support. |
| RPC missing in prod | App repo migration first; doc. | 500 in prod; deploy order. |

---

## 5) Definition of Done (DoD)

- [ ] `POST /api/v1/users/:userId/force-logout` in `apps/api/src/routes/users.ts`; 200 with `MutationAckSchema` on success.
- [ ] `ForceLogoutInputSchema` in shared; `AuditActionEnum` includes `'admin.users.force_logout'`.
- [ ] App repo: `profiles.force_logout_after` and RPC `admin_force_logout_user`; one transaction update + one audit row.
- [ ] RBAC: only admin/super_admin; 401/403 otherwise.
- [ ] Idempotency: Idempotency-Key supported (RPC or API); replay → 409 or documented deferral.
- [ ] API tests: 401, 403, 400, 404, 200, (409).
- [ ] App-repo enforcement documented (e.g. `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`).
- [ ] (Optional) User detail UI: Force logout + confirmation.
- [ ] Rollback note: additive migration; revert = rollback migration.

---

## 6) Dependencies and Order

- **PAGE 02 (Canonical audit):** Required. Audit row uses canonical columns; enum `'profile'` must exist (dashboard already has it; app repo must have it for production).
- **PAGE 05:** Optional. If PAGE 05 adds `profiles.force_logout_after`, reuse; else add in PAGE 06 app migration.
- **App repo:** RPC and column in app repo for production; dashboard may mirror in local migrations.

---

# Part II — Change Report (Diff-Style)

1. **Original issues:** (1) No test infra gate; (2) AuditActionEnum missing `admin.users.force_logout`; (3) RBAC not tightened for force-logout; (4) Idempotency strategy ambiguous; (5) p_admin_id source not explicit; (6) No app-repo enforcement doc deliverable; (7) No rollback note.
2. **Added steps:** Phase 0 test run and discovery (enum/column in app repo); add `admin.users.force_logout` to enum; route-level RBAC check for admin/super_admin only; explicit "get p_admin_id from request.user.id"; RPC idempotency (or defer and document); FORCE_LOGOUT_APP_ENFORCEMENT.md; rollback note.
3. **Removed steps:** None; optional UI retained.
4. **Reordered:** Phase 0 includes test infra and discovery before contracts; Phase 1 includes app repo migration in same phase as shared contracts.
5. **Expanded steps:** RPC signature and body (idempotency key optional; not_found; single transaction); error map 404/500; acceptance tests per gap.
6. **Why:** To make the plan execution-safe and repo-verifiable; avoid enum/RPC failures; enforce RBAC; clarify idempotency and admin id source; ensure app-side enforcement is documented.
7. **Residual risks:** App may still not implement enforcement (mitigated by doc); idempotency may be deferred (documented).

---

*Plan produced per `.agent/workflows/planner.md` and revised per `.agent/workflows/plan_critic.md`. Execution by Executor; assign steps to @SysOp, @AdminArchitect, @UIExpert, @QA, @SecGuard, @DevOps, @DocKeeper as above.*
