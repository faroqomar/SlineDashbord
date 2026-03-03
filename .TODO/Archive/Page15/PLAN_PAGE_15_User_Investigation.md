# PAGE 15 — User Investigation (Deep User Review)

**Source:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` (Page 15, Phase 5)  
**Planner:** `.agent/workflows/planner.md`  
**Critic:** `.agent/workflows/plan_critic.md` — execution-safe, gate-based rewrite.

---

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (safe to infer)

- **Verified in dashboard code:** `admin_cases`, `admin_case_entities`, `admin_chat_access_logs` exist in this repo: `supabase/migrations/20260302130000_admin_cases_and_chat_access.sql`. Cases and chat API routes and shared schemas exist: `apps/api/src/routes/cases.ts`, `chat.ts`; `packages/shared/src/schemas/cases.ts`, `chat.ts`. Ref: MIGRATIONS/README.md, grep results.
- **Verified in dashboard code:** No `/users/$userId/investigation` route; no `GET /api/v1/users/:userId/investigation`, `.../conversations`, or `.../evidence-pack`; no PII reveal endpoint or `admin_pii_access_logs` table. Ref: audit doc, App.tsx, api routes.
- Canonical DB truth remains `sline_app/supabase/migrations` per Plan Critic; dashboard migrations are applied to the same DB with copy-to-app path for production.

### Decision Needed (Blocking)

| # | Missing decision | Options | Recommended | Why | Plan impact |
|---|------------------|---------|-------------|-----|-------------|
| D1 | **Reports / support tickets in investigation graph** | (1) In scope: add reports slice to investigation response using existing `reports` + `report_actions`. (2) Out of scope: return empty/stub for “reports” in investigation; no new reports API for Page 15. | **(2) Out of scope** | PAGE 10 (Reports) already exists; investigation can show “Reports” tab with link to `/reports` and optional stub list. Reduces Page 15 scope and avoids duplicate reports API. | Plan: investigation response includes `reports: []` or `reportsStub: { count, linkToReports }`; no new reports endpoints in Phase 2. |
| D2 | **Who creates `admin_pii_access_logs` and where** | (1) Page 15 adds migration in dashboard repo (`supabase/migrations/...admin_pii_access_logs.sql`) and documents copy-to-app. (2) Block Page 15 until a separate “Phase 1 PII” delivers it from app repo. | **(1) Page 15 adds migration in dashboard repo** | MIGRATIONS/README already allows dashboard-owned migrations with copy-to-app; keeps Page 15 executable without waiting on another phase. | Plan: Phase 1 (Data) includes step to add `admin_pii_access_logs` migration in dashboard repo; audit action `admin.pii.reveal` and RPC or API insert. |
| D3 | **Investigation view audit: read-only vs mutation** | (1) Log every `GET .../investigation` as `admin.users.investigation_view`. (2) Log only when “sensitive” (e.g. after PII reveal or export). | **(1) Log every investigation view** | Audit checklist and API map require `admin.users.investigation_view`; consistent with “who looked at whom” for compliance. | Plan: GET investigation writes one `audit_logs` row per request (or via small RPC that does read + insert in one transaction if project rules require atomicity for reads). |

---

## B) Gate Status (Pass / Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No explicit step that test runner, env, and fixtures are available; no bounded waits/retry budget for E2E. | Add Phase 5.0: @QA verify `npm run test` (api + shared) and Playwright run; document env (e.g. TEST_USER_ID); add “max 2 retries, 5s wait” for investigation load in E2E. |
| **1. Data/Contracts** | ❌ FAIL | `admin_pii_access_logs` not present; masked/full DTO split for users and investigation not fully specified; evidence-pack response type unspecified. | Add migration for `admin_pii_access_logs`; add schemas: `UserSummaryMasked`, `UserDetailMasked`, `UserDetailRevealed`, `UserInvestigationResponseSchema`, `UserConversationsResponseSchema`, `EvidencePackExportSchema` (format + row limit). |
| **2. Security** | ❌ FAIL | Role matrix for investigation/conversations/evidence-pack/reveal/chat not in plan; “roles allowed to reveal” unspecified. | Add explicit role matrix: e.g. investigation_view/conversations list = support+; evidence-pack = moderator+; reveal PII = admin, super_admin; chat access = support+ with case. Enforce in routes and tests. |
| **3. Backend/API** | ❌ FAIL | Investigation and conversations endpoints missing; evidence-pack and reveal missing; audit for investigation_view not specified. | Implement GET investigation, GET conversations, GET evidence-pack, POST reveal-pii; add audit for investigation_view and export; use cursor pagination and row limits. |
| **4. UI/Integration** | ❌ FAIL | No `/users/$userId/investigation` route or UserInvestigation component; no loading/empty/error states in DoD. | Add route and page; define loading skeleton, empty (no data), and error (4xx/5xx) states; link from UserDetail. |
| **5. Release/QA** | ❌ FAIL | DoD does not require docs update or PR checklist. | Add step: update ADMIN_FEATURES.md or feature doc for Investigation; add PR checklist item “P15: investigation + PII + case gates”. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix (exact) | Owner | Acceptance |
|-----|----------------|-------------|--------|------------|
| PII table and reveal path missing | Reveal cannot be audited; Security Gate fails. | Add migration `admin_pii_access_logs`; add POST `/api/v1/users/:userId/reveal-pii` with body (reason, case_id?), insert log row, return revealed DTO; RBAC admin/super_admin. | @SysOp | 403 without role; 200 + row in `admin_pii_access_logs`; audit action `admin.pii.reveal`. |
| Role matrix not defined | Inconsistent RBAC; support might get reveal or export. | Document in plan: investigation_view + conversations list = support, moderator, admin, super_admin; evidence-pack = moderator+; reveal = admin, super_admin; chat access = support+ with case. Enforce in code and tests. | @SysOp + @SecGuard | 403 for support on reveal and for missing case on thread content. |
| No stop conditions on steps | Executor cannot know “done” per step. | Every phase step gets “Stop condition: [measurable]”. E.g. “Stop condition: GET /investigation returns 200 and schema validates.” | @Planner/Executor | Each step in Corrected Plan has “Stop condition”. |
| Test infra not asserted | Tests may not run or may be flaky. | Add Test Infrastructure Gate: run api + shared tests; run Playwright with one investigation scenario; document TEST_USER_ID or fixture. | @QA + @DevOps | `npm run test` and Playwright pass in CI or local. |
| Loading/empty/error UX not in DoD | UI may show blank or throw. | DoD: “Loading skeleton while fetching; empty state when no tasks/bookings/etc.; error state with message and retry for 4xx/5xx.” | @UIExpert | UI shows skeleton, empty, and error states in review. |
| Reports scope ambiguous | Scope creep or duplicate work with PAGE 10. | Decision D1: out of scope for Page 15; investigation returns stub (e.g. `reports: []` or link). | @AdminArchitect | No new reports API in Page 15; stub in response. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| PII is never returned unmasked unless reveal was called and logged. | API: investigation and user detail return masked DTOs; only POST reveal-pii returns revealed; insert into `admin_pii_access_logs` in same flow. | Test: call investigation → no email/phone in response; call reveal-pii → row in admin_pii_access_logs and revealed fields in response. |
| Chat thread content is never returned without a valid case and access log. | API: GET thread content requires case_id; check case linked to thread; insert `admin_chat_access_logs` (view_scope=view) before returning messages. | Test: GET thread without case_id → 403; with case_id and linked case → 200 and row in admin_chat_access_logs. |
| Every investigation view and evidence-pack export is audited. | API: after successful GET investigation or GET evidence-pack, write `audit_logs` (e.g. admin.users.investigation_view, admin.export.evidence_pack). | Test: GET investigation and GET evidence-pack → one audit_logs row each with correct action. |
| No service-role or server-only code in admin-ui. | CI/static: no import of admin client or server Supabase in apps/admin-ui. | Grep/CI: no `@/lib/supabase/admin`, no `createAdminClient` in admin-ui. |
| Investigation and evidence-pack use cursor pagination and row limits. | API: sub-feeds in investigation use cursor; evidence-pack has max rows (e.g. 10k) and streams. | Code review + test: no offset in investigation; evidence-pack response size bounded. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| PII leaked without audit | Investigation or user detail response | Med | High | Security-breach | Reveal without row in admin_pii_access_logs | Masked DTOs + single reveal endpoint + insert before response | Alert on missing log; revoke role |
| Chat content without case | GET thread content | Med | High | Security-breach | 200 without case_id or without access log | Require case_id; check case linked to thread; log before return | Deny by default; audit alert |
| Investigation endpoint N+1 or slow | GET investigation | High | Med | Feature | p95 > 800ms | Single RPC or bounded parallel reads; cursor per feed | Timeout 5s; return partial + next cursor |
| Evidence-pack overreach | GET evidence-pack | Med | Med | Data-loss / compliance | Large export by support role | RBAC moderator+; row limit; stream; audit | Reject > limit; log attempt |
| Missing admin_pii_access_logs table | Reveal endpoint | Med | High | Feature | 500 on reveal | Add migration in Phase 1 (Data) of this plan | Block release until migration applied |
| Flaky E2E | Playwright investigation flow | Med | Low | Local | Intermittent fail in CI | Bounded wait (e.g. 5s); max 2 retries; stable fixture user | Skip E2E in gate; run nightly |

---

## F) Pre-Mortem

- This fails when **GET /investigation** is implemented with N+1 queries and times out for users with many tasks/bookings.
- This fails when **support** can call reveal-pii or evidence-pack and we have no RBAC check.
- This fails when **thread content** is returned without validating that the case is linked to the thread and we don’t insert into admin_chat_access_logs.
- This fails when **admin_pii_access_logs** doesn’t exist and the reveal endpoint 500s.
- This fails when **UI** has no loading/error state and shows a blank screen on slow or failed fetch.
- This fails when **evidence-pack** has no row limit and someone exports 1M rows.
- This fails when **tests** assume a live DB or missing fixture and CI is red or skipped.
- This fails when **reports** are in scope and we duplicate PAGE 10 reports API.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Artifact | Stop condition |
|------|-----|-----|----------|----------------|
| Test infra gate | So QA gate is passable. | Run api + shared unit tests; run Playwright with one investigation flow; doc TEST_USER_ID or seed. | Passing CI step; README or test doc update | `npm run test` and Playwright investigation scenario pass. |
| admin_pii_access_logs | So PII reveal is auditable. | Add migration in dashboard repo: table (entity_type, entity_id, field_scope, viewer_admin_id, case_id, reason, created_at); RLS service-role only. | `supabase/migrations/...admin_pii_access_logs.sql` | Migration applies; table exists. |
| Role matrix | So Security Gate passes. | Document in plan and enforce in routes: investigation/conversations = support+; evidence-pack = moderator+; reveal = admin, super_admin; chat = support+ with case. | Plan section + rbac checks in routes | 403 tests for support on reveal and for no-case on thread. |
| Masked/revealed DTOs | So PII is never leaked by default. | Add UserSummaryMasked, UserDetailMasked, UserDetailRevealed in shared users schema; investigation response uses masked profile. | packages/shared schemas + API response types | Zod parse of response succeeds with masked shape. |
| Investigation + conversations + evidence-pack + reveal endpoints | So UI can show full graph and export. | Implement GET investigation (aggregate), GET conversations (masked list), GET evidence-pack (stream/limit), POST reveal-pii (log + return revealed). | apps/api routes + audit writes | 200 + schema valid; audit rows present. |
| Loading/empty/error states | So UX does not break. | Skeleton while loading; empty state per tab when no data; error state with message and retry. | UserInvestigation.tsx and children | Manual or E2E: all three states visible. |
| Docs + PR checklist | So Release/QA Gate passes. | Update ADMIN_FEATURES.md (or feature doc) with Investigation page; add PR item for P15. | Doc file + .github or CONTRIBUTING checklist | Doc mentions investigation; PR template includes P15. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict dependency order: **Data/Contracts → Security/RLS → Backend APIs → UI → QA/Release.** Gate at end of each phase with measurable pass criteria.

---

### Phase 0: Preconditions and test infra

**Goal:** Build and test infra are green; no fake progress.

**Why:** Block if admin-ui or api don’t build or tests don’t run.

**Steps:**

- **0.1 (@DevOps)** Ensure `npm run -w apps/admin-ui build` and `typecheck` pass.  
  **Stop condition:** Build and typecheck pass.
- **0.2 (@QA)** Ensure `npm run test` (api + shared) passes; ensure Playwright runs and one smoke (e.g. login → dashboard) passes. Document test user or seed if needed.  
  **Stop condition:** Unit tests and one Playwright scenario pass.
- **0.3 (@Planner/Executor)** Confirm: `admin_cases`, `admin_case_entities`, `admin_chat_access_logs` exist (Verified in dashboard code: `20260302130000_admin_cases_and_chat_access.sql`). Confirm cases and chat API + shared schemas exist.  
  **Stop condition:** Checklist signed off; no block.

**Gate 0 (Test Infrastructure):** ✅ PASS if 0.1–0.3 done and tests green. Else ❌ FAIL and block.

---

### Phase 1: Data and contracts

**Goal:** All required tables and shared schemas exist so API and UI can be implemented without guessing.

**Why:** API and UI must not depend on missing DTOs or tables.

**Steps:**

- **1.1 (@SysOp)** Add migration `supabase/migrations/YYYYMMDD_admin_pii_access_logs.sql`: table `admin_pii_access_logs` (id, entity_type, entity_id, field_scope, viewer_admin_id, case_id, reason, created_at); RLS service-role only.  
  **Stop condition:** Migration applies; table present.
- **1.2 (@SysOp)** In `packages/shared`: add/extend `users` schema with `UserSummaryMasked`, `UserDetailMasked`, `UserDetailRevealed`; add `investigation` schema (or under users) with `UserInvestigationResponseSchema` (profile masked, tasks, offers, bookings, disputes, ledger activity, reportsStub, conversationsSummary); `UserConversationsResponseSchema` (threads masked, case references); `EvidencePackExportQuerySchema` (e.g. format: csv|json, limit max 10k); response type for evidence-pack. Ensure cases/chat schemas exported (already exist).  
  **Stop condition:** Zod schemas parse; exported from shared; no broken imports in api/admin-ui.
- **1.3 (@QA)** Add unit tests for new schemas (valid/invalid payloads).  
  **Stop condition:** New schema tests pass.

**Gate 1 (Data/Contracts):** ✅ PASS if migration applied, schemas exported and tested. Else ❌ FAIL.

---

### Phase 2: Security and role matrix

**Goal:** Role matrix is explicit and enforced so no over-permission.

**Why:** Security Gate requires explicit RBAC.

**Steps:**

- **2.1 (@SysOp + @SecGuard)** Document and enforce role matrix:  
  - `GET /api/v1/users/:userId/investigation` → support, moderator, admin, super_admin.  
  - `GET /api/v1/users/:userId/conversations` → support, moderator, admin, super_admin.  
  - `GET /api/v1/users/:userId/evidence-pack` → moderator, admin, super_admin.  
  - `POST /api/v1/users/:userId/reveal-pii` → admin, super_admin.  
  - Chat thread content (GET thread messages) → support, moderator, admin, super_admin **and** valid case linked to thread; log in admin_chat_access_logs.  
  Implement in routes (e.g. requireAdminRole with correct list per route).  
  **Stop condition:** 403 for support on evidence-pack and reveal; 403 for thread content without valid case; tests added.
- **2.2 (@SysOp)** Ensure investigation view and evidence-pack write audit: `admin.users.investigation_view`, `admin.export.evidence_pack`; reveal writes `admin_pii_access_logs` and optional `audit_logs`; chat view writes `admin_chat_access_logs`.  
  **Stop condition:** Integration test: one audit/log row per sensitive action.

**Gate 2 (Security):** ✅ PASS if role matrix enforced and audit/log rows verified. Else ❌ FAIL.

---

### Phase 3: Backend APIs

**Goal:** Investigation, conversations, evidence-pack, and PII reveal are implemented and audited.

**Why:** UI depends on these endpoints.

**Steps:**

- **3.1 (@SysOp)** Add `GET /api/v1/users/:userId/investigation`: return aggregated graph (profile masked, tasks, offers, bookings, disputes, ledger activity, reportsStub per D1, conversations summary); cursor pagination for sub-feeds; write `audit_logs` with action `admin.users.investigation_view`. Target p95 < 800ms (single or bounded parallel reads).  
  **Stop condition:** 200 + body matches UserInvestigationResponseSchema; audit row exists; 401/403 tests pass.
- **3.2 (@SysOp)** Add `GET /api/v1/users/:userId/conversations`: masked thread summaries and case references; RBAC per matrix.  
  **Stop condition:** 200 + schema valid; 403 for insufficient role.
- **3.3 (@SysOp)** Add `GET /api/v1/users/:userId/evidence-pack`: query params format (csv|json), optional cursor/limit (max 10k rows); stream response; RBAC moderator+; audit `admin.export.evidence_pack`.  
  **Stop condition:** 200 + file/stream; 403 for support; audit row; row limit enforced.
- **3.4 (@SysOp)** Add `POST /api/v1/users/:userId/reveal-pii`: body (reason, case_id?); insert `admin_pii_access_logs`; return UserDetailRevealed (or subset); RBAC admin, super_admin.  
  **Stop condition:** 200 + revealed fields; row in admin_pii_access_logs; 403 for support/moderator.
- **3.5 (@SysOp)** If not already present: ensure GET thread content (case-gated) exists and writes `admin_chat_access_logs` (view_scope=view).  
  **Stop condition:** 403 without case; 200 with linked case + access log row.
- **3.6 (@QA)** Integration tests: 401/403/200 for all new endpoints; schema validation; audit and PII/chat log rows.  
  **Stop condition:** All new endpoint tests pass.

**Gate 3 (Backend/API):** ✅ PASS if all endpoints implemented, RBAC and audit/log verified by tests. Else ❌ FAIL.

---

### Phase 4: ViewModels and UI

**Goal:** One page at `/users/$userId/investigation` with tabs, loading/empty/error, evidence-pack and case-gated chat flow.

**Why:** DoD requires the page and UX.

**Steps:**

- **4.1 (@AdminArchitect)** Add VM/hook for User Investigation: load investigation, conversations; state for tabs; actions: switch tab, request evidence-pack, (optional) create case / request chat access / reveal PII. No DB/Supabase; call Fastify only.  
  **Stop condition:** @CodeWarden MVVM check: no server-only or DB in client.
- **4.2 (@UIExpert)** Add route `/users/$userId/investigation` and `UserInvestigation.tsx`: tabs Profile, Tasks, Offers, Bookings, Disputes, Finance, Reports (stub or link), Conversations. Profile and lists use masked data; “Reveal PII” only where allowed, wired to reveal endpoint. Conversations: list masked; thread content only after case-gated access.  
  **Stop condition:** Route exists; tabs render; navigation from UserDetail works.
- **4.3 (@UIExpert)** Loading: skeleton while fetching. Empty: per-tab empty state when no items. Error: message + retry on 4xx/5xx.  
  **Stop condition:** All three states implemented and reviewable.
- **4.4 (@UIExpert)** Evidence-pack: button to request export; progress or download link; RBAC.  
  **Stop condition:** Button works; download or error shown.
- **4.5 (@MotionMaster)** Optional: skeletons and light transitions.  
  **Stop condition:** Optional; no block.

**Gate 4 (UI/Integration):** ✅ PASS if page exists, tabs + loading/empty/error + evidence-pack work. Else ❌ FAIL.

---

### Phase 5: QA and release

**Goal:** Automated and manual checks pass; docs and checklist updated.

**Why:** Release/QA Gate and DoD.

**Steps:**

- **5.1 (@QA)** Playwright: navigate to user detail → Investigation → switch tabs; request evidence-pack; (if chat flow in scope) create case, grant access, view thread; assert no thread content without case.  
  **Stop condition:** Playwright investigation flow passes; bounded wait (e.g. 5s); max 2 retries.
- **5.2 (@DataSmith)** Optional: fixture user with many tasks/bookings for p95 and pagination check.  
  **Stop condition:** Optional.
- **5.3 (@Doc Keeper)** Update ADMIN_FEATURES.md (or feature doc) with User Investigation page: purpose, entry point, PII/case gates, evidence-pack.  
  **Stop condition:** Doc updated.
- **5.4 (@DevOps)** Add PR checklist item for P15 (investigation, PII mask, case gate, evidence-pack).  
  **Stop condition:** Checklist includes P15.

**Gate 5 (Release/QA):** ✅ PASS if E2E and docs/checklist done. Else ❌ FAIL.

---

## I) Change Report (Diff-Style)

1. **Original issues summary**  
   - Evidence was wrong: cases/chat tables and routes/schemas exist in dashboard repo; plan said “missing”.  
   - No Test Infrastructure Gate; no role matrix; no stop conditions; no admin_pii_access_logs; loading/empty/error and docs/PR checklist missing from DoD.  
   - Reports scope ambiguous; PII table ownership ambiguous.

2. **Added steps**  
   - Phase 0.2: Test infra verification (unit + Playwright).  
   - Phase 1.1: Migration for admin_pii_access_logs.  
   - Phase 2.1–2.2: Role matrix and audit/log enforcement.  
   - Phase 4.3: Loading/empty/error states.  
   - Phase 5.3–5.4: Docs update and PR checklist.  
   - All steps: explicit Stop condition.

3. **Removed steps**  
   - None; ordering and granularity changed.

4. **Reordered**  
   - Data/Contracts (Phase 1) before Security (Phase 2) before Backend (Phase 3) before UI (Phase 4) before QA/Release (Phase 5).  
   - “Confirm Phase 1 SQL” replaced by concrete 1.1 (add PII migration) and 0.3 (confirm cases/chat).

5. **Expanded steps**  
   - Phase 2: full role matrix and audit requirements.  
   - Phase 3: per-endpoint behavior (cursor, limit, audit).  
   - Phase 4: loading/empty/error and evidence-pack UX.  
   - DoD: aligned with invariants and gates.

6. **Why**  
   - To satisfy Plan Critic: no fake progress, repo-verifiable evidence, gate-based execution, explicit decisions, and measurable stop conditions.

7. **Residual risks**  
   - Device/IP footprint still out of scope (audit: “Missing device/IP evidence”); investigation page may not satisfy that baseline until a separate initiative.  
   - Flaky E2E possible; mitigated by bounded wait and retry budget.

---

## Definition of Done (DoD) — Final

- Route **`/users/$userId/investigation`** exists and renders with tabs: Profile, Tasks, Offers, Bookings, Disputes, Finance, Reports (stub/link), Conversations.
- **GET /api/v1/users/:userId/investigation** returns full aggregated graph (masked by default), audited (`admin.users.investigation_view`).
- **PII masked by default;** reveal only via **POST .../reveal-pii**, logged in **admin_pii_access_logs**; only admin/super_admin can reveal.
- **Chat thread content** only after valid case linked to thread; every view logged in **admin_chat_access_logs**; API returns 403 without case.
- **GET /api/v1/users/:userId/evidence-pack** exists; RBAC moderator+; row limit; audited (`admin.export.evidence_pack`).
- **Loading, empty, and error states** implemented on Investigation page.
- **Role matrix** documented and enforced; tests verify 403 for support on reveal and evidence-pack, and for thread without case.
- **Tests:** Integration tests for all new endpoints (401/403/200 + audit/log); Playwright for investigation flow.
- **Docs:** ADMIN_FEATURES.md (or feature doc) updated; PR checklist includes P15.
- **No service-role or server-only code** in admin-ui; CI/build and typecheck pass.

---

*Assume it will fail. Prove it won’t.*
