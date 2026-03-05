# Feature Plan: Users KPI Live Counts

## 0) Objective
- Replace Users-page KPI mock values with backend-driven counts for:
  - Active users
  - Inactive users
  - Joined this month
- Keep `totalUsers` as existing real value.
- Preserve current `/users` list behavior and pagination.

## 1) Current State (Evidence-labeled)
- Verified in dashboard code: Users KPI cards currently read mock constants from `users-ui.mock.ts`.
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
  - `apps/admin-ui/src/features/users/models/users-ui.mock.ts`
- Verified in API code: `GET /api/v1/users` returns only `users`, `totalUsers`, `totalPages`.
  - `apps/api/src/routes/users.ts`
- Verified in shared contracts: Users schema has no KPI aggregate contract.
  - `packages/shared/src/schemas/users.ts`
- Verified in tests: user route tests currently focus moderation/investigation, not list aggregates.
  - `apps/api/src/routes/users.test.ts`

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery
- [ ] Step 0.1 (@SysOp): Confirm canonical status fields in `profiles` (`status` vs `account_status`) and final inactive definition (`suspended` + `banned`).
- [ ] Step 0.2 (@SysOp): Confirm “joined this month” timezone rule (UTC vs product timezone) and freeze it in contract docs.
- Verification (@QA): Snapshot DB query examples and expected counts for one fixture window.

### Phase 1: Shared Contracts
- [ ] Step 1.1 (@SysOp): Extend shared users schema with additive list meta:
  - `kpiCounts.activeUsers`
  - `kpiCounts.inactiveUsers`
  - `kpiCounts.joinedThisMonth`
- [ ] Step 1.2 (@SysOp): Export types from `packages/shared/src/index.ts`.
- Verification (@QA): Schema tests for required numeric fields and non-negative constraints.

### Phase 2: Backend/API
- [ ] Step 2.1 (@SysOp): Extend `GET /api/v1/users` response to include `kpiCounts` while keeping existing fields unchanged.
- [ ] Step 2.2 (@SysOp): Compute counts server-side using indexed/filter-safe queries (no N+1 per row).
- [ ] Step 2.3 (@SysOp): Keep RBAC unchanged (`support+` read access) and avoid leaking raw DB errors.
- Verification (@QA): API tests for 200 shape + fallback behavior when DB is unavailable.

### Phase 3: Frontend ViewModel
- [ ] Step 3.1 (@AdminArchitect): Update Users API adapter + VM to consume `kpiCounts` from real response.
- [ ] Step 3.2 (@AdminArchitect): Keep temporary fallback to mocks only when `kpiCounts` is absent (for compatibility during rollout).
- Verification (@CodeWarden): VM remains state-only and API boundaries unchanged.

### Phase 4: UI
- [ ] Step 4.1 (@UIExpert): Replace KPI mock reads with VM-provided real values.
- [ ] Step 4.2 (@UIExpert): Keep card styling unchanged (pixel parity) while data source switches to real.
- Verification (@QA): Manual visual check against Figma + API stub check for values.

### Phase 5: Testing
- [ ] Step 5.1 (@QA): Add API tests for KPI counts in `/users` response.
- [ ] Step 5.2 (@QA): Add frontend test coverage for real vs fallback rendering.

## 3) Gate Checks (Must-Pass)
- Build Gate: `npm --prefix packages/shared run build`, `npm --prefix apps/api run build`, `npm --prefix apps/admin-ui run typecheck`
- Contracts Gate: Shared users schema exported and used by API/FE adapters
- Security Gate: No RBAC scope widening; no service-role exposure to client
- API Gate: `/users` remains backward-compatible for existing consumers
- UI Gate: KPI cards render real values with unchanged styling
- QA Gate: Added test cases for aggregate fields

## 4) Risks & Mitigations
- Risk: Status field drift (`status` vs `account_status`) causes wrong counts.
  - Mitigation: Single canonical mapping function in API.
- Risk: Month boundary timezone mismatch.
  - Mitigation: Document one timezone in contract and test around month edges.
- Risk: Added count queries increase latency.
  - Mitigation: Use focused count queries and profile indexes; verify p95.

## 5) Definition of Done (DoD)
- Users KPI cards no longer depend on `USERS_KPI_MOCK` for count values.
- `/users` returns stable `kpiCounts` for active/inactive/joined-this-month.
- Existing list/search/pagination behavior remains unchanged.
- Build/test gates pass with no regression in Users page.
