# Feature Plan: Search Volume Timeseries (Real Data)

## 0) Objective

- Replace `SEARCH_VOLUME_MOCK` with real hourly volume data in the Search right rail.
- Preserve current visual design (same chart footprint, labels, and card layout).
- Support timezone-aware bucket labels and deterministic ordering.

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: `apps/admin-ui/src/features/search/view/SearchScreen.tsx` passes `volumeData={vm.searchVolume}` to `<SearchRightRail />`.
- Verified in dashboard code: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` returns `searchVolume: SEARCH_VOLUME_MOCK`.
- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.mock.ts` defines `SEARCH_VOLUME_MOCK`.
- Verified in API code: no dedicated `/api/v1/search/volume` or `/api/v1/search/insights` endpoint exists yet.
- Missing repo evidence: canonical endpoint contract for search volume buckets (hourly/daily), timezone, and default window.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery

- [ ] Step 0.1 (@SysOp): Define canonical bucket rules with product/ops: window (`24h` recommended), bucket size (`1h`), timezone policy (`UTC` or product timezone).
- [ ] Step 0.2 (@PerfOpt): Define p95 target for volume query (recommended `< 300ms` at staging scale).
- Verification (@QA): Discovery decision documented in `Docs/PAGE_11_search_volume_discovery.md`.

### Phase 1: Contracts (Shared)

- [ ] Step 1.1 (@SysOp): Add `AdminSearchVolumePointSchema` and `AdminSearchVolumeResponseSchema` to `packages/shared/src/schemas/search.ts` (or `search-insights.ts`).
- [ ] Step 1.2 (@SysOp): Include query schema for optional `window` and `tz` params with strict validation.
- [ ] Step 1.3 (@QA): Add schema tests for ordering, empty arrays, invalid params, and max points bound.
- Verification (@QA): Shared tests pass and schema export is available via `@sline/shared`.

### Phase 2: Backend/API

- [ ] Step 2.1 (@SysOp): Implement route in `apps/api/src/routes/search-insights.ts` (preferred shared endpoint) or `apps/api/src/routes/search-volume.ts` with RBAC.
- [ ] Step 2.2 (@SysOp): Aggregate counts per hour from canonical telemetry source with fixed bucket count (for example 8 or 24 points).
- [ ] Step 2.3 (@SysOp): Ensure stable sort by bucket start ascending and include human-readable `label`.
- [ ] Step 2.4 (@SysOp): Register route in `apps/api/src/app.ts`.
- Verification (@QA): Supertest validates auth, schema, and deterministic bucket ordering.

### Phase 3: ViewModels

- [ ] Step 3.1 (@AdminArchitect): Add volume fetch + state to `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`.
- [ ] Step 3.2 (@AdminArchitect): Keep fallback to `SEARCH_VOLUME_MOCK` only on endpoint failure and expose `isMock` state for UI labeling.
- Verification (@CodeWarden): VM preserves MVVM boundaries and avoids direct DB calls.

### Phase 4: UI

- [ ] Step 4.1 (@UIExpert): Update `apps/admin-ui/src/features/search/view/components/SearchRightRail.tsx` to handle:
  - loading state
  - real volume points
  - empty-data state (no activity)
- [ ] Step 4.2 (@UIExpert): Keep chart spacing/typography/colors consistent with Figma.
- Verification (@QA): Visual check confirms no layout drift in right rail.

### Phase 5: Testing

- [ ] Step 5.1 (@QA): Add API tests for window/tz query validation and payload shape.
- [ ] Step 5.2 (@QA): Add UI tests for loading + empty + fallback rendering in right rail.
- [ ] Step 5.3 (@DataSmith): Provide deterministic volume fixture for staging smoke.
- Verification (@QA): Smoke run confirms real chart data and correct label ordering.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: search volume changes compile across shared/api/admin-ui.
- [ ] Contracts Gate: volume schemas + query schemas are strict and exported.
- [ ] Security Gate: route RBAC enforced; no sensitive metadata in payload.
- [ ] API Gate: response ordering and point bounds are deterministic.
- [ ] UI Gate: chart card renders loading/real/empty/fallback states.
- [ ] QA Gate: automated tests cover auth, validation, and rendering states.

## 4) Risks & Mitigations

- Risk: Timezone mismatch causes wrong hourly labels.
  - Mitigation: lock timezone policy and test against fixed timestamps.
- Risk: Bucket query scans too much data.
  - Mitigation: bound time window and add targeted index in app repo if needed.
- Risk: Sparse data creates jagged/empty chart.
  - Mitigation: return zero-count buckets for missing hours.
- Risk: Volume endpoint and KPI endpoint diverge.
  - Mitigation: prefer one `search/insights` contract with versioned schema.
- Risk: Chart behavior differs on mobile width.
  - Mitigation: add viewport-specific visual checks in QA.

## 5) Definition of Done (DoD)

- Right rail volume chart uses real API data by default.
- Bucket labels/counts follow documented timezone and ordering rules.
- Fallback mock path remains explicit and non-breaking.
- All gates in section 3 pass.

