# Feature Plan: Search KPI Live Analytics

## 0) Objective

- Replace `SEARCH_KPI_MOCK` with real KPI values for the Search page.
- Keep UI behavior identical to current design (labels, tones, deltas, sparkline blocks).
- Ensure KPI load does not block result search requests.

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: `apps/admin-ui/src/features/search/view/SearchScreen.tsx` renders `<SearchKpiGrid items={vm.kpis} />`.
- Verified in dashboard code: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` returns `kpis: SEARCH_KPI_MOCK`.
- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.mock.ts` defines `SEARCH_KPI_MOCK` with `isMock: true`.
- Verified in shared contracts: `packages/shared/src/schemas/search.ts` has request/results schemas only, no KPI/insights schema.
- Verified in API code: `apps/api/src/routes/search.ts` exposes only `GET /api/v1/search`.
- Missing repo evidence: canonical persisted search telemetry source for KPI metrics (searches/day, zero-result rate, instant match rate).

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery

- [ ] Step 0.1 (@SysOp): Discover canonical telemetry source for search events in app repo (`sline_app/supabase/migrations`) and document source-of-truth table/view and retention policy.
- [ ] Step 0.2 (@DevOps): Confirm baseline gates pass before changes: `npm --prefix packages/shared test`, `npm --prefix apps/api test`, `npm --prefix apps/admin-ui run typecheck`.
- Verification (@QA): Discovery note committed and baseline commands green.

### Phase 1: Contracts (Shared)

- [ ] Step 1.1 (@SysOp): Add KPI contract schemas in `packages/shared/src/schemas/search.ts` (or `search-insights.ts`), including:
  - `AdminSearchKpiKey` enum
  - `AdminSearchKpiItemSchema`
  - `AdminSearchKpiResponseSchema`
  - strict bounds for sparkline length and numeric ranges
- [ ] Step 1.2 (@SysOp): Export new schemas from `packages/shared/src/index.ts`.
- [ ] Step 1.3 (@QA): Add schema tests in `packages/shared/src/schemas/search.test.ts` (or dedicated `search-insights.test.ts`).
- Verification (@QA): Contract parse tests pass for valid/invalid payloads.

### Phase 2: Backend/API

- [ ] Step 2.1 (@SysOp): If no telemetry source exists, add app-repo migration for search event storage and required indexes (no direct SQL in dashboard repo; migration tracked in app repo).
- [ ] Step 2.2 (@SysOp): Add `GET /api/v1/search/insights` route in `apps/api/src/routes/search-insights.ts`, RBAC-guarded with `requireAdminRole`.
- [ ] Step 2.3 (@SysOp): Compute KPI metrics for agreed window (default `last_24h`) and return shared schema shape.
- [ ] Step 2.4 (@SysOp): Register route in `apps/api/src/app.ts`.
- [ ] Step 2.5 (@SecGuard): Verify read-only endpoint has no secret leakage and returns bounded payload only.
- Verification (@QA): Supertest coverage for 401/403/200 + schema validation + empty-data fallback.

### Phase 3: ViewModels

- [ ] Step 3.1 (@AdminArchitect): Add KPI fetch logic in `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` with separate loading/error state from result search.
- [ ] Step 3.2 (@AdminArchitect): Keep mock fallback only when endpoint fails or returns empty payload, with explicit `isMock` markers.
- Verification (@CodeWarden): VM remains API-client only, no Supabase imports, no view logic leakage.

### Phase 4: UI

- [ ] Step 4.1 (@UIExpert): Update `apps/admin-ui/src/features/search/view/components/SearchKpiGrid.tsx` to support:
  - loading skeleton
  - real delta formatting
  - stale/fallback visual handling without layout shift
- [ ] Step 4.2 (@UIExpert): Keep typography, spacing, tone mapping, and hover states consistent with Figma implementation.
- Verification (@QA): Visual parity check against Search Figma nodes for KPI section.

### Phase 5: Testing

- [ ] Step 5.1 (@QA): API tests in `apps/api/src/routes/search-insights.test.ts`.
- [ ] Step 5.2 (@QA): VM unit tests for fallback behavior and error transitions.
- [ ] Step 5.3 (@DataSmith): Seed deterministic KPI fixture data for staging smoke checks.
- Verification (@QA): End-to-end manual smoke confirms real KPI values render and page remains responsive during endpoint failures.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: shared/api/admin-ui typechecks and tests pass.
- [ ] Contracts Gate: KPI schemas exported from `@sline/shared`.
- [ ] Security Gate: RBAC enforced; no client-side secret/service-role usage.
- [ ] API Gate: `/api/v1/search/insights` returns schema-valid payload with graceful fallback.
- [ ] UI Gate: KPI cards render loading/real/fallback states without layout regression.
- [ ] QA Gate: automated tests cover auth, schema validation, and fallback behavior.

## 4) Risks & Mitigations

- Risk: No canonical search telemetry table exists.
  - Mitigation: explicit discovery step and migration path in app repo before API work.
- Risk: KPI query becomes slow on large datasets.
  - Mitigation: bounded windows, indexes, and optional cached aggregation view.
- Risk: KPI load blocks core search UX.
  - Mitigation: separate VM state and non-blocking fetch strategy.
- Risk: Delta calculations drift from product definition.
  - Mitigation: document formula and window in shared contract comments + tests.
- Risk: Mock fallback hides production API regressions.
  - Mitigation: add monitoring alert for repeated fallback activation.

## 5) Definition of Done (DoD)

- Search KPI cards consume real API response by default.
- Mock KPI data is used only as explicit fallback.
- Endpoint is RBAC protected and schema validated.
- All gates in section 3 pass.

