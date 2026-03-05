# Feature Plan: Saved and Recent Search Persistence

## 0) Objective

- Replace in-memory/mock saved and recent searches with user-scoped persistent data.
- Ensure all mutations are auditable and RBAC-protected.
- Preserve current right-rail interactions (apply, clear recent, save scenarios).

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.mock.ts` defines `SEARCH_SAVED_SEARCHES_MOCK` and `SEARCH_RECENT_SEARCHES_MOCK`.
- Verified in dashboard code: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` uses local React state for recent searches and mock constants for saved searches.
- Verified in dashboard code: `apps/admin-ui/src/features/search/view/components/SearchRightRail.tsx` exposes save/recent UI actions.
- Verified in API code: no `/api/v1/search/preferences`, `/saved-searches`, or `/recent-searches` routes currently exist.
- Missing repo evidence: canonical persistence tables/RPCs for admin search preferences/history.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery

- [ ] Step 0.1 (@SysOp): Discover whether app repo already has search preference tables/RPCs; if missing, define safe migration design.
- [ ] Step 0.2 (@SecGuard): Define retention and privacy policy for recent searches (for example 30-90 days, per admin user).
- Verification (@QA): Discovery doc created at `Docs/PAGE_11_search_preferences_discovery.md`.

### Phase 1: Contracts (Shared)

- [ ] Step 1.1 (@SysOp): Add schemas in `packages/shared/src/schemas/search.ts` (or dedicated file):
  - `AdminSavedSearchSchema`
  - `AdminRecentSearchSchema`
  - list response schemas
  - mutation input schemas (`create`, `delete`, `clear`)
- [ ] Step 1.2 (@SysOp): Export contracts via `packages/shared/src/index.ts`.
- [ ] Step 1.3 (@QA): Add schema tests for limits, string bounds, and invalid payloads.
- Verification (@QA): Shared contract tests pass.

### Phase 2: Backend/API

- [ ] Step 2.1 (@SysOp): If DB objects are missing, add app-repo migration for:
  - `admin_saved_searches`
  - `admin_recent_searches`
  - user-scoped indexes and uniqueness constraints
- [ ] Step 2.2 (@SysOp): Implement Fastify route file `apps/api/src/routes/search-preferences.ts`:
  - `GET /api/v1/search/preferences`
  - `POST /api/v1/search/preferences/saved`
  - `DELETE /api/v1/search/preferences/saved/:id`
  - `POST /api/v1/search/preferences/recent`
  - `DELETE /api/v1/search/preferences/recent`
- [ ] Step 2.3 (@SysOp): Enforce per-admin scope using authenticated admin id from request context.
- [ ] Step 2.4 (@SysOp): Add audit entries for mutations (create/delete/clear) following admin audit rules.
- [ ] Step 2.5 (@SysOp): Register route in `apps/api/src/app.ts`.
- Verification (@QA): Supertest covers authz, scoping, create/delete/clear, and audit side effects.

### Phase 3: ViewModels

- [ ] Step 3.1 (@AdminArchitect): Refactor `useGlobalSearch.vm.ts` to load saved/recent data from new preferences API.
- [ ] Step 3.2 (@AdminArchitect): Wire `applySavedSearch`, `applyRecentSearch`, and `clearRecentSearches` to real endpoints.
- [ ] Step 3.3 (@AdminArchitect): Keep temporary fallback to mocks when API unavailable; expose explicit fallback state.
- Verification (@CodeWarden): VM remains pure client state + service calls; no direct data-source coupling.

### Phase 4: UI

- [ ] Step 4.1 (@UIExpert): Update right-rail interactions to reflect real persistence outcomes:
  - optimistic update with rollback on failure
  - empty state when no saved/recent entries
  - disabled state during in-flight mutation
- [ ] Step 4.2 (@UIExpert): Add confirmation affordance before destructive "clear recent" action if required by UX policy.
- Verification (@QA): UI behavior matches design and mutation responses.

### Phase 5: Testing

- [ ] Step 5.1 (@QA): API integration tests for all preference endpoints with user scoping checks.
- [ ] Step 5.2 (@QA): VM tests for fetch/mutate/fallback flows.
- [ ] Step 5.3 (@DataSmith): Seed fixtures with varied saved/recent sets for manual smoke and e2e.
- Verification (@QA): End-to-end flow proves persistence across refresh and login sessions.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: shared/api/admin-ui compile after preference wiring.
- [ ] Contracts Gate: preference schemas and mutation payloads are strict and exported.
- [ ] Security Gate: user-scoped data only; RBAC + audit for mutations.
- [ ] API Gate: all preference endpoints validated and stable.
- [ ] UI Gate: right rail behaves correctly for loading/empty/success/error.
- [ ] QA Gate: tests cover persistence, scoping, and destructive actions.

## 4) Risks & Mitigations

- Risk: Preferences leak across admins.
  - Mitigation: enforce actor-id scoping in every query and test cross-user denial.
- Risk: Mutation path misses audit logs.
  - Mitigation: centralized helper for audit writes and required integration assertion.
- Risk: Retention policy not defined.
  - Mitigation: explicit policy step in discovery before schema freeze.
- Risk: Clear action causes accidental loss.
  - Mitigation: confirmation UX and undo window (optional enhancement).
- Risk: DB growth from recent events.
  - Mitigation: capped per-user recents + cleanup job/TTL policy.

## 5) Definition of Done (DoD)

- Saved and recent search data persist per admin user.
- All preference mutations are audited and RBAC protected.
- Search right rail no longer relies on static mock arrays in normal operation.
- All gates in section 3 pass.

