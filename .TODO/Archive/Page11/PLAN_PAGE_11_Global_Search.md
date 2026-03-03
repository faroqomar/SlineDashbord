# Feature Plan: PAGE 11 — Global Search (Plan Critic Rewrite)

**Source:** [MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](../../MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md) (Page 11)  
**Workflows:** `.agent/workflows/planner.md` → `.agent/workflows/plan_critic.md`

---

## A) Assumptions + Decision Needed (Blocking)

**Assumptions (safely inferred):**
- Search is read-only; no `audit_logs` write for the search request itself (per audit scope).
- RBAC reuses existing admin auth; no new role for “search” (Verified in dashboard code: other `/api/v1/*` routes use same middleware).
- DB truth lives in app repo; dashboard only consumes RPCs/views (canonical system rules).
- `search_profiles` exists in app repo (Verified in SQL); user search can reuse or align with it.

**Decision Needed (Blocking):**

| # | Missing decision | Options | Recommended | Plan impact |
|---|-------------------|---------|-------------|-------------|
| D1 | How is global search implemented? | (1) Single RPC in app repo `admin_global_search` (2) Dashboard API aggregates multiple Supabase queries/RPCs (3) Hybrid: RPC for users + API-side queries for others | **(2) API aggregation** — no app-repo migration dependency for first ship; Discovery can later recommend RPC if p95 fails. | Phase 0 Discovery must document exact tables/views/RPCs per entity; Step 2.3 becomes “if p95 fails, add RPC in app repo.” |
| D2 | Minimum query length / rate limit for search? | (1) No minimum (2) Min 2–3 chars (3) Min 2 chars + rate limit (e.g. 30/min per admin) | **(2) Min 2 chars** — reduces abuse and full-table scans; add rate limit in Phase 2 if abuse observed. | Request schema + API validate `q.length >= 2`; 400 for shorter. |
| D3 | “Transaction” search target? | (1) `journal_entries` by id/meta (2) Wallet/ledger view by user or ref (3) Both with type filter | **(1) journal_entries** — matches audit “transactions”; document column(s) in Discovery. | Response schema includes `entityType: 'transaction'` with id/link to finance detail. |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes required |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No explicit step for “test env can run API + shared build”; no fixture path or seed contract. | Add Phase 0 step: verify `npm run -w apps/api test` and `npm run -w packages/shared test` pass; document fixture path (e.g. `apps/api/src/routes/__fixtures__/search.ts` or DataSmith seed). |
| **1. Data/Contracts** | ❌ FAIL | Discovery (DB/search surface) is after no formal “contract first”; request schema fields (e.g. `limit` max) not bounded. | Order: Discovery → Contracts; add `limit` max (e.g. 50) and min `q` length in schema; add search.test.ts in shared. |
| **2. Security** | ⚠️ PASS (conditional) | RBAC and server-only are stated; no explicit “role matrix” or “forbidden to search X”. | Add one line: “Any authenticated admin role can call search; no per-entity role restriction.” No audit write for search (confirmed). |
| **3. Backend/API** | ❌ FAIL | Discovery outcome not an artifact; “if Discovery recommends” is ambiguous; no error taxonomy or request-id. | Discovery produces written artifact (e.g. `docs/search-discovery.md` or ADR); API returns 400 for invalid params, 503 on Supabase errors; add request-id in Fastify reply. |
| **4. UI/Integration** | ❌ FAIL | Debounce/cancel on re-type not specified; empty/error states mentioned but not “double submit” or timeout. | Add: debounce (e.g. 300ms); abort previous request on new query; timeout (e.g. 10s) and user-facing “Search timed out”; empty state copy. |
| **5. Release/QA** | ❌ FAIL | p95 “documented or asserted in CI” is vague; no rollback or feature-flag. | Add: p95 measured in CI or staging runbook step; “rollback = hide nav link + 404 /search”; optional feature flag for `/search` if desired. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix steps | Owner | Acceptance check |
|-----|----------------|-----------|--------|-------------------|
| Discovery not an artifact | Implementer guesses tables/RPCs; rework later. | Add Step 0.1 output: written doc (e.g. `docs/PAGE_11_search_discovery.md`) with: entities → table/RPC + columns, index list, decision (aggregation vs RPC). | @SysOp | Doc exists and is referenced in Step 2.1. |
| Test infra not verified first | Tests added in Phase 5 may not run (missing deps/env). | Add Phase 0 step: run `packages/shared test` and `apps/api test`; create fixture/seed contract for search (DataSmith). | @QA + @DataSmith | Both test commands pass; fixture path documented. |
| Request validation incomplete | Long `q` or huge `limit` can DoS or slow DB. | In schema: `q` min 2 chars, max 200; `limit` default 20, max 50; `types` optional array of enum. | @SysOp | Unit test: invalid q/limit rejected; API returns 400. |
| No error/timeout UX | User sees hang or generic error. | API: timeout wrapper (e.g. 8s); return 503 + message on Supabase error. UI: show “Search timed out” / “Something went wrong” with retry. | @SysOp + @UIExpert | Manual: simulate timeout → message shown; retry works. |
| p95 not objectively pass/fail | Gate is “documented or measured” — not a hard gate. | Define: “p95 &lt; 500ms over N runs (e.g. 20) in staging with seed data” or “CI job runs search 20x and asserts p95 &lt; 500ms”. | @PerfOpt + @QA | CI or runbook step; gate is PASS only if p95 &lt; 500ms. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Search is admin-only. | Fastify preHandler: same auth as other `/api/v1/*`; no public access. | Integration test: 401 without cookie; 403 if non-admin (if applicable). |
| Response shape is contract-bound. | API parses and serializes with `AdminGlobalSearchResultSchema`; UI types from shared. | Typecheck; integration test parses response with Zod. |
| No server-only or Supabase in admin-ui for search. | No `createAdminClient`, no `@/lib/supabase/*` in search VM/view. | Grep/CI: no supabase/admin in `apps/admin-ui/src` search code. |
| At least five entity types can be returned. | API implements user, task, booking, dispute, transaction; response schema discriminates. | Integration test: one query per type (or one query hitting all) and assert `entityType` and id present. |
| p95 latency &lt; 500ms (staging-sized data). | Indexes or RPC per Discovery; timeout in API. | Staging run or CI: measure p95 over N requests; fail if ≥ 500ms. |

---

## E) Risk Register

| Risk | Where | Prob | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|------|--------|--------------|--------------|------------|----------|
| Search timeout / slow | API + DB | Med | Med | Feature | p95 &gt; 500ms; slow query logs | Discovery indexes; limit result set; API timeout 8s | 503 + message; UI retry |
| Contract drift | shared vs API | Low | Med | Feature | Typecheck fails; test fails | Single source: shared Zod; API uses same schema | Fix schema + redeploy |
| Missing entity type | API implementation | Med | Med | Feature | Integration test fails | Explicit test per entity type | Add missing query branch |
| Abuse (heavy queries) | API | Med | Low | Feature | High request rate | Min query length 2; optional rate limit | Rate limit 30/min per admin |
| Discovery wrong (wrong table) | Backend | Med | High | Feature | Wrong results; RLS leak | Discovery doc + code review; use service-role only | Correct Discovery + patch |

---

## F) Pre-Mortem

- This fails when **Discovery is skipped or not written down**, and the implementer guesses tables and misses indexes → slow or wrong results.
- This fails when **contracts are defined after API**, so response shape drifts and UI breaks.
- This fails when **test infra doesn’t run** (e.g. missing env or shared build), so Phase 5 tests are written but never green.
- This fails when **no minimum query length** is enforced and someone sends `?q=a` repeatedly → full scans and slow DB.
- This fails when **p95 is not measured** and we only “document” → gate never actually passes in production.
- This fails when **UI has no debounce/abort** and every keystroke fires a request → overload and flaky results.
- This fails when **error/timeout** is not handled in API or UI and the user sees a blank spinner forever.
- This fails when **transaction** search is undefined and one of the five entity types is missing from the response.

---

## G) Plan Fixes (Concrete Additions)

| # | Goal | Why | How | Output artifact | Stop condition |
|---|------|-----|-----|-----------------|-----------------|
| G1 | Test infra verified before building | Avoid writing tests that can’t run. | Run `npm run -w packages/shared test` and `npm run -w apps/api test`; define fixture/seed contract for search. | Green test runs; doc or comment with fixture path. | Both commands pass. |
| G2 | Discovery is a written artifact | Single source for tables/RPCs/indexes. | After Discovery steps, create `docs/PAGE_11_search_discovery.md` (or ADR) with: per-entity table/RPC, columns, indexes, aggregation vs RPC decision. | `docs/PAGE_11_search_discovery.md` | Doc committed and referenced in API step. |
| G3 | Request/response schema bounded | Prevent DoS and drift. | In shared schema: `q` min 2 max 200; `limit` default 20 max 50; response discriminated union by `entityType`. | `packages/shared/src/schemas/search.ts` + unit tests. | Unit tests pass; API validates and returns 400 for invalid. |
| G4 | API error and timeout behavior | Observable and safe UX. | Wrap search handler in timeout (8s); on Supabase error return 503 + message; ensure Fastify request-id on reply. | `apps/api/src/routes/search.ts` | 503 and timeout path tested; request-id present. |
| G5 | UI debounce, abort, and error state | Avoid request storm and stuck loading. | Debounce 300ms; abort previous fetch on new query; timeout show “Search timed out”; error show “Something went wrong” + retry. | `apps/admin-ui` search view + VM. | Manual or E2E: type fast → limited requests; timeout shows message. |
| G6 | p95 gate measurable | Gate is pass/fail, not “documented”. | Add CI job or runbook step: run search 20x in staging with seed data; compute p95; fail if ≥ 500ms. | CI config or `docs/runbooks/search-p95.md`. | Gate PASS only when p95 &lt; 500ms. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict order: **1) Data/Contracts → 2) Security/RLS → 3) Backend APIs → 4) UI → 5) QA/Release.**  
Gate at end of each phase; no phase N+1 until phase N gate passes.

---

### Phase 0: Preconditions and Discovery

**Goal:** Test infra works; Discovery is done and written; decisions D1–D3 resolved.  
**Why:** Prevents building on broken tests or wrong assumptions.  
**How:** Run test commands; run Discovery in app repo; write artifact; lock decisions.

**Steps:**

- **0.1 (@QA)** — **Test infrastructure gate.**  
  Run `npm run -w packages/shared test` and `npm run -w apps/api test`. If either fails, fix before proceeding. Document where search fixtures/seeds will live (e.g. DataSmith seed or `__fixtures__`).  
  **Result:** Both pass; fixture strategy documented.

- **0.2 (@SysOp)** — **Discovery — DB/search surface.**  
  In app repo: search migrations and SUPABASE_SETUP.md for RPCs/views for **tasks**, **bookings**, **disputes**, **journal_entries** (transactions). Confirm `search_profiles` signature and return shape. Decide: single RPC vs API aggregation (recommended: aggregation).  
  **Result:** List per entity: table or RPC + columns used for search.

- **0.3 (@SysOp)** — **Discovery — Indexes.**  
  List existing indexes on `profiles`, `tasks`, `bookings`, `disputes`, `journal_entries` (or equivalent) that support the search queries. If none, propose minimal index set for app repo.  
  **Result:** Index list or “use existing” + rationale.

- **0.4 (@SysOp)** — **Discovery artifact.**  
  Create `docs/PAGE_11_search_discovery.md` (or ADR): entities → table/RPC + columns, index list, aggregation vs RPC decision, and “transaction” = journal_entries (or agreed target).  
  **Result:** Doc committed; referenced in Phase 2.

**Gate 0:** Test infra passes; Discovery doc exists; D1–D3 recorded in plan or doc.  
**Pass criteria:** ✅ Both test commands pass; ✅ `docs/PAGE_11_search_discovery.md` exists and is linked from this plan.

---

### Phase 1: Data/Contracts

**Goal:** Request and response schemas are the single source of truth; bounded and tested.  
**Why:** Prevents API/UI drift and abuse (unbounded `q`/`limit`).  
**How:** Add shared search schema and unit tests; export from shared.

**Steps:**

- **1.1 (@SysOp)** — Add `packages/shared/src/schemas/search.ts`.  
  - **Request:** `AdminGlobalSearchRequestSchema`: `q` string min 2 max 200; optional `types` array of enum `('user'|'task'|'booking'|'dispute'|'transaction')`; optional `limit` default 20 max 50.  
  - **Response:** `AdminGlobalSearchResultSchema`: array of items with discriminated union by `entityType`; each item has `entityType`, `id`, and type-specific fields (e.g. title/summary, link slug).  
  - Export from `packages/shared/src/index.ts`.

- **1.2 (@SysOp)** — Add `packages/shared/src/schemas/search.test.ts`.  
  Parse request (valid + invalid: empty `q`, `q` too long, `limit` &gt; 50); parse response (each entity type); invalid types rejected.  
  **Result:** Unit tests pass.

**Gate 1:** Contracts gate.  
**Pass criteria:** ✅ `AdminGlobalSearchRequestSchema` and `AdminGlobalSearchResultSchema` exist and exported; ✅ `search.test.ts` passes; ✅ `npm run -w packages/shared build` and `test` pass.

---

### Phase 2: Security (Explicit)

**Goal:** Search is admin-only; no server-only or secrets in client.  
**Why:** Enforce canonical security rules.  
**How:** Reuse existing RBAC; document role rule; no audit write for search.

**Steps:**

- **2.1 (@SecGuard / @SysOp)** — **Role matrix.**  
  Document: “Any authenticated admin role (support, moderator, admin, super_admin) may call GET /api/v1/search. No per-entity restriction.” Search is read-only; no `audit_logs` insert for the search request.  
  **Result:** One line in plan or in `docs/PAGE_11_search_discovery.md`; RBAC implemented in same way as other v1 routes.

**Gate 2:** Security gate.  
**Pass criteria:** ✅ Search route protected by same auth as other `/api/v1/*`; ✅ No service-role or secrets in admin-ui; ✅ Grep confirms no forbidden imports in search VM/view.

---

### Phase 3: Backend/API

**Goal:** `GET /api/v1/search` exists; validates input; returns typed results; handles errors and timeout.  
**Why:** Implement search per Discovery; meet p95 and safety.  
**How:** Implement route; validate with shared schema; aggregate per Discovery doc; timeout and 503 on failure.

**Steps:**

- **3.1 (@SysOp)** — Implement `apps/api/src/routes/search.ts`.  
  - `GET /api/v1/search?q=...&types=...&limit=...`. Validate with `AdminGlobalSearchRequestSchema` (400 for invalid).  
  - Use service-role Supabase only. Per Discovery doc: call `search_profiles` for users; run queries or RPCs for tasks, bookings, disputes, transactions.  
  - Assemble response and validate with `AdminGlobalSearchResultSchema`.  
  - Wrap in timeout (e.g. 8s); on Supabase error return 503 + message; ensure request-id on reply.  
  **Result:** Route file; 401/403/400/503 behavior.

- **3.2 (@SysOp)** — Register in `apps/api/src/app.ts`: `await server.register(searchRoutes, { prefix: '/api/v1/search' })` (or mount at `/api/v1` with path `search` so URL is `GET /api/v1/search`).  
  **Result:** Route registered and reachable.

- **3.3 (@SysOp)** — If Discovery recommended new indexes or RPC in app repo: add migration in **app repo** per MIGRATIONS/README.md. Dashboard only consumes.  
  **Result:** Migration in app repo if needed; else “no migration” recorded.

**Gate 3:** API gate.  
**Pass criteria:** ✅ 401 without auth; ✅ 403 if non-admin (if applicable); ✅ 200 with valid admin; ✅ response parses with `AdminGlobalSearchResultSchema`; ✅ 400 for invalid params; ✅ 503 on Supabase error or timeout; ✅ Integration test covers at least one result per entity type.

---

### Phase 4: UI Wiring

**Goal:** `/search` page exists; uses VM only; debounce, abort, timeout and error states.  
**Why:** Safe and predictable UX; no server-only in UI.  
**How:** ViewModel calls API; view is dumb; nav link added.

**Steps:**

- **4.1 (@AdminArchitect)** — ViewModel/hook for global search.  
  State: `query`, `types`, `results`, `loading`, `error`, `timedOut`. Actions: call `GET /api/v1/search` via existing api client; parse with shared schema; debounce 300ms; abort previous request on new query; on timeout (e.g. 10s) set `timedOut`; on error set `error`.  
  **Result:** No Supabase or server-only imports; MVVM pure.

- **4.2 (@UIExpert)** — Route `/search` and page.  
  Search input; optional type filters; results list (grouped or flat); each result links to correct detail route. Loading, empty, error (“Something went wrong” + retry), and “Search timed out” states.  
  **Result:** Page file; uses VM only.

- **4.3 (@UIExpert)** — Add `/search` to app shell (header or sidebar).  
  **Result:** Nav link; route reachable from anywhere.

**Gate 4:** UI gate.  
**Pass criteria:** ✅ `/search` in router and nav; ✅ No supabase/admin imports in search code; ✅ Debounce and abort; ✅ Timeout and error states shown; ✅ Smoke: type query → see results → click → correct detail page.

---

### Phase 5: QA/Release

**Goal:** Integration tests pass; p95 gate is measurable; DoD complete.  
**Why:** Regression safety and performance guarantee.  
**How:** Tests per entity type; p95 CI or runbook; optional feature flag/rollback.

**Steps:**

- **5.1 (@QA)** — Integration tests (Supertest).  
  401 without auth; invalid token; 403 if applicable; 200 with admin; response shape valid; 400 for `q` too short or `limit` &gt; 50; 503 on forced error path.  
  **Result:** `apps/api/src/routes/search.test.ts` (or equivalent); all pass.

- **5.2 (@QA)** — “Query returns expected entity types.”  
  With DataSmith seed or fixtures: run search that can return users, tasks, bookings, disputes, transactions; assert each `entityType` appears in schema and has id/link.  
  **Result:** Test asserts all five types.

- **5.3 (@DataSmith)** — Minimal seed/fixtures for search (if not already).  
  Enough data so integration tests can assert entity types without production.  
  **Result:** Fixture or seed contract; tests deterministic.

- **5.4 (@PerfOpt / @QA)** — **p95 gate.**  
  In staging (or CI with staging-like DB): run search 20x; compute p95; fail if ≥ 500ms. Document in CI or `docs/runbooks/search-p95.md`. If fail: add indexes (Phase 3.3) and re-run.  
  **Result:** p95 &lt; 500ms; gate is PASS only when proven.

- **5.5 (@DevOps / @UIExpert)** — Rollback: hide nav link and return 404 for `/search` if needed; optional feature flag.  
  **Result:** One-line rollback plan in doc or runbook.

**Gate 5:** Release/QA gate.  
**Pass criteria:** ✅ All integration tests pass; ✅ p95 &lt; 500ms (measured); ✅ Build Gate + Contracts + Security + API + UI gates still pass; ✅ DoD checklist complete.

---

## I) Change Report (Diff-Style)

**1) Original issues summary**  
- Discovery was not a written artifact; risk of wrong tables/RPCs.  
- Test infra gate missing; tests might not run.  
- Request/response not bounded (min/max q, limit); DoS and drift risk.  
- Error/timeout and UX (debounce, abort) not specified.  
- p95 gate was “documented or measured,” not a hard pass/fail.  
- Security role matrix and non-goals/abuse (min length, rate limit) not explicit.  
- Phase order was Discovery → Contracts → API → VM → UI → Test; critic order is Test infra + Discovery → Contracts → Security → API → UI → QA/Release with gates.

**2) Added steps**  
- Phase 0: Test infrastructure gate (0.1); Discovery artifact (0.4).  
- Phase 2 (Security): Explicit role matrix step (2.1).  
- Phase 3: Timeout and 503 behavior; request-id.  
- Phase 4: Debounce, abort, timeout and error states (G5).  
- Phase 5: p95 as measurable gate (5.4); rollback/feature flag (5.5).  
- Decisions D1–D3 (aggregation vs RPC; min query length; transaction target).  
- Plan Fixes G1–G6 as concrete additions.

**3) Removed steps**  
- None removed; several reordered or expanded.

**4) Reordered steps**  
- Test infra (0.1) before any build.  
- Discovery artifact (0.4) immediately after Discovery steps.  
- Security phase (Phase 2) made explicit between Contracts and Backend.  
- p95 moved to Phase 5 with explicit “fail if ≥ 500ms.”

**5) Expanded steps**  
- Discovery: output is now a doc `docs/PAGE_11_search_discovery.md`.  
- Contracts: `q` min 2 max 200; `limit` default 20 max 50; unit tests for invalid.  
- API: timeout 8s; 503 + message; request-id.  
- UI: debounce 300ms; abort previous; timeout and error copy.  
- QA: p95 measured over 20 runs; rollback plan.

**6) Why**  
- To satisfy Plan Critic: no fake progress; gates with measurable criteria; explicit decisions; error and UX behavior; test infra first; Discovery as artifact; bounded contracts; pass/fail p95.

**7) Residual risks**  
- App repo may not have indexes or RPCs we need; Discovery might force a migration in app repo and delay.  
- Staging “staging-sized data” is not defined in repo; runbook or CI must define it.  
- Rate limit (e.g. 30/min) deferred to “if abuse observed”; may need to add later.

---

## Definition of Done (DoD)

- [ ] Phase 0 gate: test infra passes; Discovery doc exists; D1–D3 recorded.  
- [ ] Phase 1 gate: search schemas in shared, bounded, tested; shared build + test pass.  
- [ ] Phase 2 gate: search admin-only; no server-only in UI; role rule documented.  
- [ ] Phase 3 gate: `GET /api/v1/search` implemented, validated, timeout/503; integration tests pass.  
- [ ] Phase 4 gate: `/search` in router and nav; VM-only; debounce/abort/timeout/error.  
- [ ] Phase 5 gate: integration tests green; p95 &lt; 500ms measured; rollback plan.  
- [ ] Search returns users, tasks, bookings, disputes, transactions (five entity types).  
- [ ] Build Gate + Contracts + Security + API + UI + QA gates all PASS.

*Assume it will fail. Prove it won’t.*
