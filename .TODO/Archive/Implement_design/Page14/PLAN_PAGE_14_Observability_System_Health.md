# Feature Plan: PAGE 14 — Observability / System Health (Plan Critic Rewrite)

**Source:** [MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](../MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md) (Page 14)  
**Planner:** `.agent/workflows/planner.md`  
**Critic:** `.agent/workflows/plan_critic.md`

---

# Part 1 — Plan Critic Audit

## A) Assumptions + Decision Needed (Blocking)

**Assumptions (safe):**
- Observability is read-only; no mutations → no audit_logs requirement for this page.
- RBAC for observability follows legacy health_actions: any admin role (support, moderator, admin, super_admin) can read.
- API test pattern: `buildApp({ testUser })` + `app.inject()` (Vitest); no Supertest in repo — use existing Vitest pattern.
- DB connectivity check must avoid depending on tables that may move (e.g. admin_users); neutral check preferred.
- SPA must not import server-only Supabase; all data via `GET /api/v1/observability`.

**Decision Needed (Blocking):**

| # | Missing decision | Options | Recommended | Plan impact |
|---|------------------|---------|-------------|-------------|
| D1 | Which RPC(s) to call for "RPC availability"? | (1) Single read-only RPC e.g. a "ping" or dashboard metric RPC (2) Two RPCs: one finance, one core (3) Document "none available" and return N/A | Option 1: One read-only RPC (e.g. existing dashboard/overview dependency or a trivial `select 1` RPC). | Plan must name the exact RPC or state "use `rpc('...')` with RPC name TBD in implementation; timeout 5s". |
| D2 | Source of "queue status"? | (1) Supabase Realtime / Edge / pg_catalog (2) External queue (e.g. Redis) (3) N/A for this page | N/A for this page unless queue exists in repo. | Contract and API return `queueStatus: { status: 'not_implemented' }` or omit; gate accepts. |
| D3 | Source of "error rates"? | (1) Count from audit_logs by action/level in last 1h/24h (2) Application error table if exists (3) N/A (zeros) | Option 1 if audit_logs has distinguishable error/failure actions; else Option 3. | Plan must state: derive from audit_logs or return zeros; schema allows optional counts. |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| 0. Test Infrastructure Gate | ✅ PASS | Vitest + buildApp + inject used in auth.test, finance.test, etc. | None. Plan must reference Vitest (not "Supertest") and same testUser pattern. |
| 1. Data/Contracts Gate | ❌ FAIL | ObservabilityResponseSchema not yet defined; optional queue/error shape ambiguous. | Add exact Zod fields; define N/A/not_implemented sentinels in schema. |
| 2. Security Gate | ✅ PASS | Plan requires RBAC and no server-only in SPA. | Add explicit role matrix table; add "no sensitive internal names in response body" as invariant. |
| 3. Backend/API Gate | ❌ FAIL | RPC name and queue/error source left open. | Lock RPC choice (or TBD with timeout); lock error source (audit_logs or zeros). |
| 4. UI/Integration Gate | ❌ FAIL | No explicit loading/empty/error/refetch behavior; no E2E selectors. | Add UX states and data-testid / role selectors for QA. |
| 5. Release/QA Gate | ❌ FAIL | "Optional Playwright" leaves release gate weak; no docs update step. | Make at least one E2E scenario required OR document waiver; add docs update step. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix | Owner | Acceptance |
|-----|----------------|-----|--------|------------|
| RPC for health not specified | Implementer may call a mutating or slow RPC. | Step: "Choose one read-only RPC (e.g. dashboard metric or neutral ping); document in route; 5s timeout." | @SysOp | Route comment or doc lists RPC name; test asserts no mutation. |
| Queue/error source ambiguous | API could block or return inconsistent shape. | Step: "Define queueStatus and errorRates in schema as optional; if no queue, return not_implemented; if no error store, return zeros." | @SysOp | Schema has optional fields; API returns valid schema in all cases. |
| UX states not specified | Page may have no loading/error/empty UI. | Step: "VM and UI must handle loading, error (message + retry), and empty (no services) states." | @UIExpert | QA checks: spinner/skeleton on load; message on API error; refetch button. |
| Test wording "Supertest" | Repo uses Vitest + inject. | Replace "Supertest" with "Vitest integration test (app.inject)". | @QA | Test file uses describe/it + buildApp + inject. |
| No docs update | Later devs won't know observability contract. | Step: "Update ADMIN_*.md or MIGRATIONS doc with observability endpoint and N/A rules." | @DocKeeper or @SysOp | One doc lists GET /api/v1/observability and queue/error N/A policy. |
| No E2E selector strategy | Playwright can't reliably assert. | Define data-testid or aria role for overall status and service list. | @UIExpert + @QA | At least one selector documented; E2E uses it. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Only admin roles can read observability. | requireAdminRole on GET /api/v1/observability. | 401 no cookie; 403 non-admin; 200 with admin testUser. |
| SPA never imports server-only Supabase or auth.admin. | Grep + CI. | No `createAdminClient`, `@/lib/supabase/admin`, service-role in apps/admin-ui. |
| Response body does not leak internal table/RPC names or stack traces. | API returns only status, latency, and aggregate counts. | @SecGuard review; grep response schema for string fields that could contain raw errors. |
| Health checks are read-only and timeout-bounded. | DB: select/limit 1; RPC: single read-only call, 5s timeout. | Code review; test with DB down or RPC slow. |
| Observability response matches shared Zod schema. | Parse with ObservabilityResponseSchema before reply. | Unit test: valid payload parses; invalid fails. |

---

## E) Risk Register

| Risk | Where | Prob | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|------|--------|--------------|--------------|------------|----------|
| RPC check mutates state | Backend Step 2.2 | Med | High | Feature | Test fails or audit row appears | Use only read-only RPC; code review | Remove RPC check; return N/A |
| DB check uses wrong table | Backend Step 2.2 | Med | Med | Feature | Integration test fails after schema change | Use neutral check (e.g. select 1 or documented table) | Document and pin table in route |
| Observability leaks internal names | API response | Low | High | Security-breach | SecGuard review | Return only status/latency/counts | Redact in API before send |
| No loading/error UI | UI | High | Med | UX | User report | Explicit VM states + UI handling | Add in follow-up; gate still pass with minimal UI |
| Queue/error N/A forever | Contract | Low | Low | Local | Doc states N/A | Schema allows not_implemented; gate accepts | Extend in later page |

---

## F) Pre-Mortem

- This fails when the chosen RPC is not read-only and audit_logs grows on every health check.
- This fails when the DB check uses a table that gets dropped in a later migration.
- This fails when the UI assumes services array is always non-empty and throws.
- This fails when tests run without env (SUPABASE_URL/SERVICE_ROLE_KEY) and the route throws instead of returning degraded.
- This fails when observability response includes raw error.message and exposes internal paths.
- This fails when E2E has no stable selector and breaks on copy or layout change.
- This fails when queue/error are "N/A" but the gate is interpreted as "must implement" and blocks release.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Output | Stop condition |
|------|-----|-----|--------|-----------------|
| Lock RPC and error source | Avoid side effects and ambiguity. | Add step: decide and document RPC name and error source (audit_logs or zeros). | Route comment + schema default | Schema and route doc committed. |
| Define N/A for queue/error in schema | Contract must allow N/A. | Zod optional fields; enum or literal for not_implemented. | observability.ts schema | Schema test with N/A payload passes. |
| UX states (loading/error/empty) | 5.7 completeness. | VM exposes loading, error, data; UI renders skeleton, error message + retry, and list. | SystemHealth.tsx + VM | QA checks three states. |
| E2E selector | 5.8 selectors. | Add data-testid="system-health-status" and data-testid="system-health-services". | SystemHealth.tsx | Playwright uses them. |
| Docs update | 5.10 docs. | Add subsection: GET /api/v1/observability, RBAC, and N/A policy for queue/error. | ADMIN_*.md or MIGRATIONS | Doc PR merged. |
| Test infra wording | Match repo. | Use "Vitest integration test" and buildApp({ testUser }). | Plan + test file | Tests run with npm run test in api. |

---

# Part 2 — Corrected Plan (Execution-Ready, Gate-Based)

## 0) Objective & Non-Goals

- **Done:** Legacy system health replaced by Fastify-backed observability: `/system-health` (UI) and `GET /api/v1/observability` (API). Health shows **DB connectivity**, **RPC availability**, **queue status** (or N/A), **error rates** (or N/A). No server-only Supabase in SPA.
- **Non-goals:** Incident feed, historical charts, alerting, out-of-scope queues or external systems. Abuse: unauthenticated access → 401; non-admin → 403; rate limit per existing Fastify config.

**Evidence summary:** Legacy page and health_actions (Verified in dashboard code); Fastify only `GET /health` (Verified in dashboard code); no observability route/contract/UI (Missing repo evidence). DB check should be neutral; RPC/queue/error per decisions above.

---

## 1) Strict Dependency Order

1. **Data/Contracts** — shared schema first.
2. **Security/RBAC** — role matrix and response sanitization.
3. **Backend/API** — route and checks.
4. **UI wiring** — VM then route then page.
5. **QA/Release** — tests and docs.

---

## 2) Execution Phases (Gate-Based)

### Phase 0: Preconditions & Test Infrastructure Gate

**Goal:** Workspace builds; test pattern confirmed.  
**Why:** No point building observability if build is red.  
**How:** Run admin-ui build and api typecheck; confirm Vitest + buildApp + inject in existing tests.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 0.1 | @DevOps | Run `npm run -w apps/admin-ui build` and `npm run -w apps/api typecheck`. | Green CI or ticket for existing failures. | Both pass or block is documented. |
| 0.2 | @QA | Confirm observability tests will use Vitest + `buildApp({ testUser })` + `app.inject()`. | N/A (decision). | Test file pattern matches auth.test.ts. |

**Gate 0:** Build and typecheck pass. Test approach locked (Vitest, no Supertest).

---

### Phase 1: Data/Contracts

**Goal:** Single source of truth for observability response; N/A allowed for queue/error.  
**Why:** API and UI must share shape; N/A avoids scope creep.  
**How:** Add Zod schemas in packages/shared; export from index; add unit test.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 1.1 | @SysOp | Add `packages/shared/src/schemas/observability.ts`: `ServiceStatusSchema` (name, status: operational\|degraded\|down, latencyMs, lastChecked ISO). | observability.ts | Schema compiles and is exported. |
| 1.2 | @SysOp | Add `ObservabilityResponseSchema`: services (array of ServiceStatus), optional `rpcStatus` (status + optional latencyMs), optional `queueStatus` (status or literal 'not_implemented'), optional `errorRates` (e.g. last1h, last24h numbers or omitted). | observability.ts | All fields optional except services; N/A representable. |
| 1.3 | @SysOp | Export from `packages/shared` index. | index.ts update | Import in API and admin-ui works. |
| 1.4 | @QA | Unit test: valid payload parses; payload with queueStatus: 'not_implemented' and errorRates omitted parses. | observability.test.ts (or in schema file) | Tests pass. |

**Gate 1:** Contracts Gate — ObservabilityResponseSchema in shared, exported, tested; N/A shapes valid.

---

### Phase 2: Security / RBAC

**Goal:** Only admins read observability; response contains no sensitive internals.  
**Why:** Observability is operational data; must not leak table names or stack traces.  
**How:** Role matrix in plan; enforce in route; sanitize response.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 2.1 | @SysOp | Document role matrix: GET /api/v1/observability allowed for support, moderator, admin, super_admin. | This plan or ADMIN_*.md | Explicit. |
| 2.2 | @SysOp | In observability route: use requireAdminRole(['support','moderator','admin','super_admin']). No raw error.message or table/rpc names in response. | Route implementation | 401/403 without auth/wrong role; body only status/latency/counts. |
| 2.3 | @SecGuard | Review observability response shape and implementation for info leak. | Review note | No sensitive strings in response schema. |

**Gate 2:** Security Gate — RBAC enforced; response sanitized; SecGuard sign-off or no findings.

---

### Phase 3: Backend/API

**Goal:** GET /api/v1/observability returns DB, RPC, queue (or N/A), error (or N/A); validated with shared schema.  
**Why:** UI will consume this only.  
**How:** Create observability route; implement checks with timeouts; parse response with schema before send.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 3.1 | @SysOp | Create `apps/api/src/routes/observability.ts`. Register in `app.ts` with prefix `/api/v1/observability`. Hook: requireAdminRole (all four admin roles). | observability.ts, app.ts | Route registered; 401/403 without valid admin. |
| 3.2 | @SysOp | DB connectivity: run one neutral check (e.g. `supabase.from('admin_users').select('id').limit(1)` or app-repo-agreed table); measure latency; map to operational/degraded/down. Catch errors → down. | Route handler | DB status + latency in response. |
| 3.3 | @SysOp | RPC availability: call one read-only RPC (name TBD in implementation; e.g. dashboard metric or trivial RPC); timeout 5s; success → operational, failure/timeout → degraded/down. Document RPC name in route comment. | Route handler + comment | rpcStatus in response; no mutation. |
| 3.4 | @SysOp | Queue status: if no queue in stack, set queueStatus to { status: 'not_implemented' }. Else add one non-blocking check. | Route handler | queueStatus present; schema valid. |
| 3.5 | @SysOp | Error rates: if audit_logs has usable failure/error actions, count last 1h/24h; else return zeros or omit. | Route handler | errorRates optional; no throw. |
| 3.6 | @SysOp | Before reply: parse result with ObservabilityResponseSchema; on parse failure log and return 500. | Route handler | All 200 responses match schema. |

**Gate 3:** API Gate — 401/403/200 with correct body; DB and RPC checks run; queue/error N/A or values; schema validation on reply.

---

### Phase 4: ViewModels

**Goal:** UI has a single place that fetches observability and exposes loading/error/data/refetch.  
**Why:** MVVM; no Supabase in UI.  
**How:** Hook or VM that calls GET /api/v1/observability; states: loading, error (message), data, refetch.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 4.1 | @AdminArchitect | Add hook (e.g. useSystemHealth) in apps/admin-ui: call GET /api/v1/observability via api client; return { loading, error, data, refetch }. No Supabase or server imports. | useSystemHealth.ts (or under features/core) | VM used by page; Code Warden check. |

**Gate 4 (partial):** VM exists; only calls API; no forbidden imports.

---

### Phase 5: UI

**Goal:** Page at /system-health shows overall status, service list, and optional queue/error; handles loading/error/empty.  
**Why:** Parity with audit outcome; good UX.  
**How:** Add route; build page with status card + service list + optional sections; add nav link; add E2E selectors.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 5.1 | @UIExpert | Add route /system-health in TanStack Router; component SystemHealthPage using useSystemHealth. | SystemHealth.tsx, App.tsx route entry | Navigate to /system-health renders page. |
| 5.2 | @UIExpert | Page: overall status card (all operational vs some degraded); list of services (name, status, latency, lastChecked); if present show queueStatus and errorRates. | SystemHealth.tsx | All four areas (DB, RPC, queue, error) shown or N/A. |
| 5.3 | @UIExpert | Handle loading (skeleton/spinner), error (message + retry/refetch), empty (no services). Add data-testid="system-health-status" and data-testid="system-health-services". | SystemHealth.tsx | QA can assert three states and selectors. |
| 5.4 | @UIExpert | Add nav entry to /system-health in sidebar/layout (same pattern as other dashboard links). | DashboardLayout or nav config | Click nav opens /system-health. |
| 5.5 | @MotionMaster | (Optional) Refresh animation or skeleton for cards. | Same file or small component | Non-blocking. |

**Gate 4 (UI):** UI Gate — /system-health exists; loading/error/empty handled; selectors present; nav works.

---

### Phase 6: QA & Release

**Goal:** Automated 401/403/200; optional E2E; docs updated.  
**Why:** Regression safety and discoverability.  
**How:** Vitest integration test; Playwright (one scenario or documented waiver); doc update.

| Step | Owner | Action | Output | Stop condition |
|------|--------|--------|--------|-----------------|
| 6.1 | @QA | Vitest integration test for GET /api/v1/observability: 401 no cookie, 403 wrong role (e.g. testUser with role not in list), 200 with testUser admin; assert body matches ObservabilityResponseSchema. | observability.test.ts | Tests in apps/api; run with npm run test. |
| 6.2 | @QA | Playwright (or equivalent): login as admin, go to /system-health, assert element with data-testid="system-health-status" or "system-health-services" present. Optional: assert "All Systems Operational" or "Some Systems Degraded" text. | E2E spec | One passing E2E or waiver in DoD. |
| 6.3 | @DocKeeper or @SysOp | Update ADMIN_*.md or MIGRATIONS doc: GET /api/v1/observability, RBAC (roles), and N/A policy for queue/error. | Doc PR | Merged or linked in DoD. |

**Gate 5:** QA Gate — 401/403/200 tests pass; E2E or waiver; docs updated.

---

## 3) Gate Summary (Must-Pass)

| Gate | Criteria |
|------|----------|
| **Gate 0** | Build + typecheck pass; test approach Vitest + buildApp. |
| **Gate 1** | ObservabilityResponseSchema in shared; N/A valid; schema test passes. |
| **Gate 2** | RBAC on observability; no sensitive data in response; SecGuard OK. |
| **Gate 3** | GET /api/v1/observability returns DB, RPC, queue, error; schema-validated. |
| **Gate 4** | VM + /system-health page; loading/error/empty; selectors; nav. |
| **Gate 5** | 401/403/200 tests; E2E or waiver; docs updated. |

---

## 4) Definition of Done

- [x] Contracts: ObservabilityResponseSchema (and ServiceStatus) in packages/shared, exported, tested.
- [x] API: GET /api/v1/observability implemented, RBAC, DB + RPC + queue (or N/A) + error (or N/A), response validated with schema.
- [x] VM: useSystemHealth (or equivalent) calls API only; loading/error/data/refetch.
- [x] UI: /system-health route and page; status card + services + queue/error or N/A; loading/error/empty states; data-testid for status and services; nav link.
- [x] Tests: Vitest 401/403/200 and body schema; Playwright one scenario or waiver.
- [x] Docs: Observability endpoint and N/A policy documented.
- [x] All gates 0–5 pass.

---

## 5) Change Report (Diff-Style)

| Category | Detail |
|----------|--------|
| **Original issues** | RPC/queue/error underspecified; Test infra gate and E2E selectors missing; UX states and docs update not explicit; "Supertest" vs Vitest. |
| **Added steps** | Phase 0 test-infra confirmation; Phase 2 security (role matrix, SecGuard); schema N/A and unit test; RPC name and timeout; queue/error N/A policy; loading/error/empty + selectors; docs update; E2E or waiver. |
| **Removed steps** | None; optional steps made explicit or waived. |
| **Reordered** | Strict order: Contracts → Security → Backend → VM → UI → QA; Security phase inserted. |
| **Expanded steps** | Each step has Owner, Action, Output, Stop condition; gates have measurable criteria; invariants and risk register added. |
| **Why** | Plan Critic: execution-safe, repo-verifiable, gate-passable; no guessing on RPC/queue/error; test and docs required. |
| **Residual risks** | RPC choice may need app-repo input; E2E can be waived with DoD note. |

---

*Assume it will fail. Prove it won’t.*
