# Plan Critic — System Health Figma Implementation (PAGE 14)

**Role:** @PlanCritic per `.agent/workflows/plan_critic.md`  
**Source plan:** `Docs/features/PLAN_System_Health_Figma_Implementation.md`  
**Design refs:** Figma nodes `2:38077`, `2:39244`, `2:40414` (SlineDashbord)

**Read-first alignment:** Repo context taken from `Docs/.chatgpt_context/DASHBOARD_PROJECT_CONTEXT.md`, `DASHBOARD_CURRENT_STATE.md`, `DASHBOARD_FEATURE_REQUIREMENTS.md`. No conflict with plan scope; observability/system-health is expected per requirements. [Verified in dashboard code] `GET /api/v1/observability` and `/system-health` route exist.

---

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (safe to infer)

- [Verified in dashboard code] Route `/system-health` and GET `/api/v1/observability` exist; shared schema `ObservabilityResponseSchema` and `ServiceStatusSchema` exist. No new route or prefix.
- [Verified in dashboard code] Observability is read-only; no audit writes; RBAC `support`, `moderator`, `admin`, `super_admin`. No change to auth model.
- [Verified in dashboard code] admin-ui uses Recharts and sparkline patterns (Bookings, DashboardIndex, etc.); no new chart lib.
- Figma defines exactly 12 named services and four KPIs; implementation will match that fixed set.

### Decision Needed (Blocking)

| # | Missing decision | Options | Recommended choice | Why | Plan impact |
|---|------------------|---------|--------------------|-----|-------------|
| D1 | Source of KPI and 90-day data | (1) API returns mock only (2) API returns real where available + mock for rest (3) UI-only mock, API unchanged | **(2) API returns real where available, mock for rest** | Single source of truth in API; UI stays dumb; future swap to real metrics is API-only. | Plan must explicitly add API steps to compute KPIs from services/errorRates and to build 90-day array (mock or derived); document mock in code and in `Docs/features/system_health.md`. |
| D2 | Default refetch interval when "Live" is off | (1) 30s (2) 0 / no auto-refresh (3) 60s | **(2) No auto-refresh when Live off** | Reduces load; user opts in to 15s with "Live (15s)". | Step: ViewModel uses `refetchInterval: liveInterval ?? false`; default `liveInterval = false`. |
| D3 | E2E wait strategy for 12 service cards | (1) Fixed timeout (2) Wait for `data-testid="system-health-services"` + count 12 (3) Wait for first card only | **(2) Wait for container + assert 12 cards** | Prevents flake from slow API; clear acceptance. | Plan must add: E2E asserts selector + `locator('[data-testid="system-health-service-card"]').count() === 12` (or equivalent); add `data-testid` per card in UI step. |

---

## B) Gate Status (Pass / Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| **0. Test Infrastructure Gate** | ✅ PASS | [Verified in dashboard code] `observability.test.ts` exists (vitest + buildApp); Playwright used elsewhere in admin-ui. | None. Add explicit fixture path for observability mock in Phase 5 if DataSmith step is used. |
| **1. Data/Contracts Gate** | ❌ FAIL | Schema extension not fully specified (exact Zod field names and `.optional()` vs required for new `data` fields). Existing test parses `body` with `ObservabilityResponseSchema` but current schema expects `ok` + `data`; extended response shape must remain parseable. | Add Step 1.3: Assert existing observability.test.ts still parses 200 response after schema change; add shared unit test for new schemas (SystemHealthKpisSchema, Uptime90DaySchema) with minimal valid payloads. |
| **2. Security Gate** | ✅ PASS | Route is read-only; RBAC unchanged; no audit; no sensitive internals in response required. | None. |
| **3. Backend/API Gate** | ❌ FAIL | Order of steps 2.1–2.5 allows implementing 12-service list before summary/kpis/90-day are defined in contract; API could ship without validating new fields. No explicit step to validate response with extended schema in handler. | Reorder: Contract (Phase 1) must define and export all new types; Step 2.x must validate response with extended schema before reply (same pattern as current `ObservabilityResponseSchema.safeParse(payload)`). Add explicit "validate extended payload" in Step 2.6. |
| **4. UI/Integration Gate** | ❌ FAIL | No explicit list of E2E selectors; "data-testid for status and services" exists but per-card selector missing; no stop condition for "matches Figma" (measurable). | Add: (1) List of required data-testids: `system-health-status`, `system-health-services`, `system-health-hero`, `system-health-kpi-*`, `system-health-service-card`. (2) Stop condition: "Visual or snapshot check that hero + 4 KPIs + chart + 12 cards render; E2E passes with above selectors." |
| **5. Release/QA Gate** | ❌ FAIL | No backward-compatibility test (old client without new fields); no rollback or feature-flag step. | Add: Backward compat test (200 response with only `data.services` still valid); document "no feature flag required—additive response only." Rollback = revert deploy; no DB migration. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix (exact add/reorder) | Owner | Acceptance |
|-----|----------------|-------------------------|--------|------------|
| **G1. Schema validation in API after extend** | Response could ship with wrong shape; 500 or broken UI. | In Phase 2, add step: "Before reply, run extended observability response schema (with optional summary, kpis, uptime90Day) .safeParse(payload); on failure return 500 and log." | @SysOp | observability.test.ts 200 case still passes; new fields present and valid. |
| **G2. Per-card E2E selector** | QA cannot reliably assert 12 cards; flaky E2E. | In Phase 4 (UI), add: "Each service card MUST have `data-testid=\"system-health-service-card\"` (and optionally `data-testid=\"system-health-service-card-{name}\"` for key services)." In Phase 5, add: "Playwright: wait for `system-health-services`, then assert 12 elements with `system-health-service-card`." | @UIExpert, @QA | E2E spec passes; 12 cards asserted. |
| **G3. Default Live = off** | Unclear behavior; possible 30s polling by default. | In Phase 3 ViewModel step, state explicitly: "Default `liveInterval = false` (no refetch). When user enables Live (15s), set `refetchInterval = 15000`. When off, `refetchInterval = false`." | @AdminArchitect | Manual or unit test: no request until Refresh or Live on. |
| **G4. Mock vs real data documented** | Future devs won’t know what’s real vs mock. | In Phase 2, add step: "In observability route file (or Docs/features/system_health.md), document which fields are mock: kpis (until metrics pipeline), uptime90Day (until history store), per-service uptimePct/sparkline (derived or mock)." | @SysOp, @DocKeeper | Comment in code or doc section "Data sources" listing mock vs real. |
| **G5. Build gate before any feature work** | Feature work can start on broken main. | Phase 0 must be first; gate: "Root `npm run build` and typecheck for admin-ui, api, shared pass." Block Phases 1–5 until Phase 0 passes. | @DevOps | CI or local run: build + typecheck green. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Observability is read-only; no mutations. | No POST/PATCH/DELETE on observability route; no audit_logs insert in observability handler. | Code review; grep for audit_logs in observability.ts. |
| RBAC: only support, moderator, admin, super_admin can call GET /observability. | requireAdminRole(['support','moderator','admin','super_admin']) on route. | observability.test.ts: 401 without auth, 403 for non-admin role. |
| Response shape is validated with shared schema before send. | Handler builds payload then safeParse with extended ObservabilityResponseSchema; on fail return 500. | Unit test: invalid payload triggers 500 or schema test. |
| UI does not call DB or Supabase directly. | View uses only useSystemHealth(); VM uses only observabilityApi. | Forbidden-imports or code review: no supabase or server imports in View/VM. |
| Existing 200 response with only services + queueStatus + errorRates remains valid. | New fields (summary, kpis, uptime90Day, per-service description/uptimePct/sparkline) are optional in schema. | Shared schema test: minimal payload (services only) still parses. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| Extended schema breaks existing API consumer | packages/shared, apps/api | Med | Med | Feature (observability UI) | 200 body fails parse in test | All new fields optional; existing test runs against same endpoint | Revert schema change; keep old response shape |
| 15s Live polling overloads API | useSystemHealth refetchInterval | Low | Med | Feature | High request rate in dev | Default Live off; optional rate limit on /observability | Cap refetchInterval at 15s; document |
| Mock 90-day/KPIs confuse ops | API response | Med | Low | Local | N/A | Document "mock" in code and Docs | Replace with real metrics in later PR |
| E2E flake (timing) | Playwright system-health | Med | Low | QA | Intermittent fail | Wait for data-testid + count 12; no fixed sleep | Retry budget in Playwright config |
| Recharts 90-bar chart perf on low-end | SystemHealthView | Low | Low | Local | Slow paint | Reuse existing BarChart pattern; 90 points is small | Accept or virtualize axis labels only |

---

## F) Pre-Mortem

- This fails when **schema is extended but API still returns old shape** and UI expects summary/kpis → runtime errors or blank sections.
- This fails when **E2E asserts "12 services" without a stable selector** → flaky when API or layout changes.
- This fails when **default refetch stays 30s** and many users leave tab open → unnecessary load and confusion with "Live (15s)".
- This fails when **Phase 1 is skipped or done after API** → API ships response that doesn’t match shared types.
- This fails when **Build/typecheck is broken** and feature work starts → merge conflicts and red CI.
- This fails when **no one documents mock vs real** → later "real metrics" work duplicates or breaks assumptions.
- This fails when **per-service card has no data-testid** → QA cannot target cards for a11y or visual regression.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Output artifact | Stop condition |
|------|-----|-----|-----------------|----------------|
| **G-F1. Explicit schema unit tests for new types** | Contracts gate must pass with proof. | Add in packages/shared: test that SystemHealthKpisSchema, Uptime90DaySchema, and extended data shape accept minimal valid objects; test that ObservabilityResponseSchema accepts payload with only services (backward compat). | packages/shared/src/schemas/observability.test.ts | All new schema tests pass; existing tests pass. |
| **G-F2. API validates extended payload** | Backend gate; prevent bad response. | In observability GET handler: build full payload (services, summary, kpis, uptime90Day, per-service extras), then run extended schema .safeParse; if !success return 500 and log. | apps/api/src/routes/observability.ts | 200 response passes extended parse; test updated. |
| **G-F3. Per-card data-testid** | E2E and a11y. | In SystemHealthView, each service card wrapper (e.g. Card or div for one service) gets data-testid="system-health-service-card". Optionally data-testid per name for key services. | apps/admin-ui/src/features/system-health/views/SystemHealthView.tsx | Grep confirms data-testid on card; E2E uses it. |
| **G-F4. Document mock data** | Ops and future devs. | In observability.ts add short comment or in Docs/features/system_health.md add "Data sources" subsection: KPIs mock until metrics pipeline; uptime90Day mock/derived; per-service uptimePct/sparkline derived or mock. | observability.ts + Docs/features/system_health.md | Comment or doc section present. |
| **G-F5. E2E: wait + assert 12 cards** | QA gate; no flake. | Playwright: after navigate to /system-health, wait for [data-testid="system-health-services"]; then assert locator('[data-testid="system-health-service-card"]').count() === 12 (or equivalent). | apps/admin-ui/e2e/*.spec.ts | E2E run passes; no fixed sleep. |
| **G-F6. Backward-compat test** | Release gate. | In observability.test.ts add: "returns 200 and valid when response has only data.services (no summary/kpis/uptime90Day)" using minimal payload and same schema. | apps/api/src/routes/observability.test.ts | Test passes with minimal body. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict dependency order: **Data/Contracts → Security (no new surface) → Backend API → ViewModels → UI → QA/Release.** Gate at end of each phase with measurable pass criteria.

---

### Phase 0: Build & Test Infra Gate (Precondition)

**Goal:** No feature work on broken main.  
**Why:** Avoids merge conflicts and red CI.  
**How:** Fix any existing type/build failures in system-health or observability code paths; ensure root build and typecheck pass.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 0.1 | @DevOps | Run `npm run build` and `npm run typecheck -w @sline/admin-ui` and `-w @sline/api` and `-w @sline/shared` from repo root. Fix failures in observability or system-health if any. | Build and typecheck green. |
| 0.2 | @QA | Run existing observability.test.ts and existing Playwright (if any) for /system-health. | All existing tests pass. |

**Gate 0:** ✅ Root build + typecheck pass; existing observability and system-health tests pass. **Stop:** If fail, block Phases 1–5.

---

### Phase 1: Data/Contracts (Shared)

**Goal:** Single source of truth for response shape; backward compatible.  
**Why:** API and UI must agree on types; old clients must not break.  
**How:** Extend observability schemas; add unit tests; export from shared.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 1.1 | @SysOp | In `packages/shared/src/schemas/observability.ts`: Add `'maintenance'` to ServiceStatusEnum. Add optional to service item: `description`, `uptimePct`, `sparkline` (array of number). Define SystemHealthKpisSchema (uptime30d, uptime30dDelta, avgLatencyMs, avgLatencyDeltaMs, errorRatePct, errorRateDeltaPct, requestsPerMin, requestsPerMinDelta; optional sparkline arrays). Define UptimeDaySchema (date, status: operational|degraded|outage), Uptime90DaySchema = array. Define SummarySchema (overallUptimePct, operationalCount, degradedCount, maintenanceCount). Extend ObservabilityResponseSchema data with optional summary, kpis, uptime90Day. All new fields optional. | New types and extended schema in code. |
| 1.2 | @SysOp | Export new schemas/types from packages/shared/src/index.ts. | Importable from @sline/shared. |
| 1.3 | @QA | In observability.test.ts (shared): Add tests for SystemHealthKpisSchema, Uptime90DaySchema, SummarySchema with minimal valid payloads. Add test that ObservabilityResponseSchema accepts body with only data.services (no summary/kpis/uptime90Day). | Schema unit tests pass; backward-compat parse test passes. |

**Gate 1:** ✅ Shared build passes; ObservabilityResponseSchema accepts both minimal and full payload; new schema tests pass. **Stop:** If fail, do not change API or UI.

---

### Phase 2: Backend/API

**Goal:** GET /api/v1/observability returns 12 services, summary, kpis, uptime90Day, per-service description/uptime/sparkline; response validated; RBAC unchanged.  
**Why:** UI needs single endpoint with full Figma data; mock/derived where real data missing.  
**How:** Extend handler; validate with extended schema; document mock.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 2.1 | @SysOp | Define fixed list of 12 services (API Gateway, Auth Service, Booking Service, File Storage (S3), Cron Scheduler, CDN Edge Network, Database (Postgres), Payment Engine, Notification Service, Search Index (ES), Rate Limiter (Redis), Admin Panel) with short descriptions. In GET handler: build 12 ServiceStatusItem entries; map current DB/Auth/Storage checks to Database, Auth Service, Storage; others maintenance or derived. Add description, optional uptimePct, sparkline (6–7 points) per service. | Response includes 12 named services with descriptions and optional metrics. |
| 2.2 | @SysOp | Compute summary: overallUptimePct (e.g. avg of per-service uptime or single source), operationalCount, degradedCount, maintenanceCount from 12-service list. Add to payload data.summary. | data.summary present; counts sum to 12. |
| 2.3 | @SysOp | Add data.kpis: uptime30d, avgLatencyMs, errorRatePct, requestsPerMin with deltas and optional sparkline arrays (real where available, mock otherwise). Document in code or Docs which are mock. | data.kpis present; schema validates. |
| 2.4 | @SysOp | Add data.uptime90Day: 90 entries with date and status (operational|degraded|outage). Mock or derived from current status. | data.uptime90Day length 90; schema validates. |
| 2.5 | @SysOp | Before reply: build full payload (services, summary, kpis, uptime90Day); run extended ObservabilityResponseSchema.safeParse(payload). On failure log and return 500. On success return 200 with parsed data. | No 200 with invalid shape; existing 200 test still passes. |
| 2.6 | @SysOp | Document mock data: in observability.ts or Docs/features/system_health.md list which fields are mock (kpis, uptime90Day, per-service uptime/sparkline) until real metrics exist. | Comment or doc section added. |
| 2.7 | @SecGuard | Confirm: no new mutation; no audit writes; RBAC unchanged; no sensitive internals in response. | Security gate pass. |

**Gate 2:** ✅ GET /observability returns 200 with 12 services, summary, kpis, uptime90Day; extended schema validation in handler; observability.test.ts (401, 403, 200 + schema) pass; backward-compat test passes. **Stop:** If fail, do not build UI against new shape.

---

### Phase 3: ViewModels

**Goal:** useSystemHealth exposes full data and Live (15s) toggle; default no auto-refresh.  
**Why:** View must stay dumb; single place for refetch policy.  
**How:** Extend VM state and options; wire refetchInterval to liveInterval.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 3.1 | @AdminArchitect | In useSystemHealth: Add liveInterval (number | false), default false. Add setLiveInterval. Use refetchInterval: liveInterval || false. Expose data.summary, data.kpis, data.uptime90Day, and per-service description, uptimePct, sparkline. Handle missing optional fields. | VM exposes new state and actions; no refetch when liveInterval false. |
| 3.2 | @CodeWarden | Verify: VM has no DB/API calls except via observabilityApi; view does not import supabase or server modules. | MVVM purity. |

**Gate 3:** ✅ useSystemHealth exposes summary, kpis, uptime90Day, per-service fields, Live toggle; default no polling; MVVM check pass. **Stop:** If fail, do not wire UI to new VM shape.

---

### Phase 4: UI

**Goal:** /system-health matches Figma: hero, 4 KPIs, 90-day chart, 12 service cards; loading/error/empty; required data-testids.  
**Why:** Acceptance is visual and testable.  
**How:** Rebuild SystemHealthView in sections; reuse Card, Recharts, sparkline patterns; add data-testids.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 4.1 | @UIExpert | Hero card: title "System Health", subtitle "Real-time infrastructure monitoring & service status". Live (15s) control (toggle/badge), Refresh button. Alert: Partial Degradation / All Operational from summary counts. Overall uptime % from summary. data-testid="system-health-status" on hero/status area. data-testid="system-health-hero" on hero container. | Hero matches Figma; Live and Refresh work. |
| 4.2 | @UIExpert | Four KPI cards in one row (responsive): Uptime (30D), Avg Latency, Error Rate, Req/min — value, delta, sparkline, icon. Data from data.kpis. data-testid="system-health-kpi-uptime", "-latency", "-error", "-reqmin" (or single "system-health-kpis" container). | Four cards render; loading skeleton for KPIs. |
| 4.3 | @UIExpert | 90-Day Uptime: title, BarChart 90 bars (green/yellow/red), legend, axis "90 days ago" → "Today". Data from data.uptime90Day. | Chart and legend match Figma. |
| 4.4 | @UIExpert | Service Status: title "Service Status (12 services)". Two-column grid. Each card: icon, name, description, status pill (Operational/Degraded/Maintenance), Latency, Uptime, Checked, mini sparkline. **Each card MUST have data-testid="system-health-service-card".** Container data-testid="system-health-services". | 12 cards; selectors present. |
| 4.5 | @UIExpert | Loading: skeleton for hero, KPIs, chart, grid. Error: message + retry. Empty: message when no services. | All states handled. |
| 4.6 | @MotionMaster (optional) | Subtle entrance/refresh animation if within guidelines. | No layout/performance regression. |

**Gate 4:** ✅ Page shows hero, 4 KPIs, 90-day chart, 12 cards; data-testid="system-health-status", "system-health-services", "system-health-service-card" (×12) present; loading/error/empty work. **Stop:** If fail, do not proceed to QA gate.

---

### Phase 5: QA / Release

**Goal:** Automated and doc proof; backward compat; E2E stable.  
**Why:** Release gate must pass; no regressions.  
**How:** Update API tests; add E2E with wait + 12-card assert; doc update.

| Step | Owner | Action | Result |
|------|--------|--------|--------|
| 5.1 | @QA | observability.test.ts: Add case "returns 200 with minimal body (only data.services) and parses" for backward compat. Ensure 401, 403, 200 + full schema pass. | All API tests pass. |
| 5.2 | @QA | Playwright: Login as admin, navigate to /system-health. Wait for [data-testid="system-health-services"]. Assert locator('[data-testid="system-health-service-card"]').count() === 12. Optionally assert "System Health" title, "Service Status" heading. | E2E passes; no fixed sleep. |
| 5.3 | @DataSmith (optional) | Fixture: full observability mock (12 services, summary, kpis, uptime90Day) for scale or storybook. | Fixture in repo; path documented. |
| 5.4 | @DocKeeper | Update Docs/features/system_health.md: new response shape (summary, kpis, uptime90Day, per-service fields); UI sections (hero, KPIs, 90-day, 12 services); data sources (mock vs real). | Doc reflects implementation. |

**Gate 5:** ✅ Observability API tests pass; Playwright system-health passes with 12-card assert; docs updated. **Stop:** If fail, do not merge.

---

## Mandatory Critique Checklist (5.1–5.10)

| # | Area | Result | Notes |
|---|------|--------|--------|
| 5.1 Scope & Requirements | ✅ | Measurable goal (Figma match + 4 sections + 12 services). Non-goals: real metrics pipeline, new route. Abuse: read-only; no retry/cancel flow beyond Refresh. | DoD in Corrected Plan. |
| 5.2 Dependencies & Ordering | ✅ | Contracts before API (Phase 1 → 2); no UI before stable contract. No DB migration. | Phase order in H. |
| 5.3 Data Model & Contracts | ✅ | Schemas defined (Step 1.1); optional fields; backward compat test (Step 1.3, 5.1). State: read-only; no transitions. | G-F1, Gate 1. |
| 5.4 Security (AuthZ + RLS + Audit) | ✅ | Role matrix: support, moderator, admin, super_admin only. Server-only: N/A (read-only). No audit. No chat/PII. | Gate 2, Step 2.7. |
| 5.5 Performance & Scalability | ✅ | No pagination (fixed 12 + 90 days). No new indexes. N+1: single GET; 12 services built in one handler. | Risk E: 15s polling optional. |
| 5.6 Error Handling & Observability | ⚠→✅ | Taxonomy: 500 on schema validation fail; existing 401/403. Request-id: Fastify default. UX: error state + retry in Step 4.5. | Fix: Step 2.5 explicit. |
| 5.7 UX & State Machine | ✅ | Loading/empty/error/success (Step 4.5). No double submit (read-only). Retry = Refresh or Live refetch. | Gate 4. |
| 5.8 Testing & QA | ✅ | Test infra gate (Phase 0). Fixtures optional (5.3). E2E selectors listed (G2, Step 4.4, 5.2). Bounded wait: wait for data-testid + count. | G-F5, Gate 5. |
| 5.9 Release & Migration | ✅ | Additive response only; backward-compat test (5.1). Rollback: revert deploy; no DB change. No feature flag. | Gate 5, Change Report. |
| 5.10 Developer Workflow | ✅ | DoD = Gate 5. Docs update Step 5.4. PR checklist = gates 0–5. Branch: not specified (repo default). | Phase 5. |

---

## I) Change Report (Diff-Style)

### 1) Original issues summary

- Schema extension and API validation not strict (response could be invalid).
- E2E selector for "12 cards" missing (flake risk).
- Default refetch behavior (Live off) not specified.
- Mock vs real data not documented.
- Test Infrastructure Gate and backward-compat test not explicit.
- Order allowed API work before contract proof (schema tests).

### 2) Added steps

- Phase 0.2: Run existing observability + system-health tests before feature work.
- Step 1.3: Shared schema unit tests for new types + backward-compat parse test.
- Step 2.5: Validate extended payload in handler before reply; 500 on failure.
- Step 2.6: Document mock data in code or Docs.
- Step 2.7: @SecGuard confirm no new security surface.
- Step 3.2: @CodeWarden MVVM check.
- Step 4.4: Mandatory data-testid="system-health-service-card" per card.
- Step 5.1: Backward-compat API test (minimal body).
- Step 5.2: E2E wait for container + assert 12 cards.
- Step 5.4: Doc update for response shape and data sources.

### 3) Removed steps

- None. Optional MotionMaster and DataSmith steps retained.

### 4) Reordered

- Phase 0 explicitly blocks 1–5 until build + existing tests pass.
- Phase 1 must complete (including schema tests) before API extends response.
- API Phase 2 includes validation step before reply (was implied, now explicit).

### 5) Expanded steps

- Phase 1: Explicit Zod field list and "all optional" for new data fields; schema tests with minimal and full payload.
- Phase 2: Explicit "safeParse before reply"; document mock.
- Phase 4: Explicit data-testid list (hero, status, kpis, services, service-card).
- Phase 5: E2E wait strategy and 12-card assertion; doc update.

### 6) Why

- To make the plan execution-safe and repo-verifiable: no guessing on schema, validation, selectors, or default behavior; gates have measurable pass criteria; mock data is explicit so future work can replace it safely.

### 7) Residual risks

- Recharts or sparkline regression in existing usage (mitigated by reusing current patterns).
- 90-bar chart perf on very low-end devices (low impact; 90 points is small).
- Mock data used as "real" by mistake (mitigated by documentation and code comments).

---

*Corrected plan produced per `.agent/workflows/plan_critic.md`. "Assume it will fail. Prove it won't."*
