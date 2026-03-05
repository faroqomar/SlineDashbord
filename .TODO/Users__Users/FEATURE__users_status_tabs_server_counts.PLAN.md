# Feature Plan: Users Status Tabs Server Counts

## 0) Objective
- Convert Users tab filters (`All`, `Active`, `Inactive`) from page-local filtering to server-driven filtering/counts.
- Ensure tab badges show global totals, not only current page row counts.
- Keep pagination semantics correct per selected tab.

## 1) Current State (Evidence-labeled)
- Verified in dashboard code: tab counts are derived from the current page rows only.
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`
- Verified in dashboard code: tabs are UI-only filters over already-fetched users.
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
- Verified in API code: `/users` supports `query` and `role` but no `status tab` contract.
  - `apps/api/src/routes/users.ts`
- Verified in shared contracts: `GetUsersSchema` has `page`, `query`, `role`; no `status`/tab count fields.
  - `packages/shared/src/schemas/users.ts`

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Filter Contract Definition
- [ ] Step 0.1 (@SysOp): Define canonical tab-to-status mapping:
  - `all` -> no status filter
  - `active` -> `active`
  - `inactive` -> `suspended|banned`
- [ ] Step 0.2 (@SysOp): Decide whether to keep `role` query param or deprecate for Users page.
- Verification (@CodeWarden): Contract is unambiguous and backward-compatible.

### Phase 1: Shared Contracts
- [ ] Step 1.1 (@SysOp): Extend shared users query schema with `statusTab` enum.
- [ ] Step 1.2 (@SysOp): Add response tab count contract (example: `tabCounts.all/active/inactive`).
- Verification (@QA): Schema tests for enum parsing and response shape.

### Phase 2: Backend/API
- [ ] Step 2.1 (@SysOp): Update `/users` handler to apply server-side status filter before paging.
- [ ] Step 2.2 (@SysOp): Return tab counts independent from page size.
- [ ] Step 2.3 (@SysOp): Keep query search behavior consistent with current endpoint.
- Verification (@QA): Route tests for `statusTab=all|active|inactive`, pagination, and counts.

### Phase 3: Frontend ViewModel
- [ ] Step 3.1 (@AdminArchitect): Pass `statusTab` to `getUsers`.
- [ ] Step 3.2 (@AdminArchitect): Read tab badges from server `tabCounts`.
- [ ] Step 3.3 (@AdminArchitect): Remove page-local status count logic after API support is live.
- Verification (@CodeWarden): VM remains stateless about business filtering logic.

### Phase 4: UI
- [ ] Step 4.1 (@UIExpert): Keep existing tab visuals; switch badge source to server counts.
- [ ] Step 4.2 (@UIExpert): Ensure pagination resets to page 1 on tab change.
- Verification (@QA): Tab switching updates rows, counts, and URL state correctly.

### Phase 5: Testing
- [ ] Step 5.1 (@QA): Add regression tests for tab changes + pagination interplay.
- [ ] Step 5.2 (@QA): Add edge-case tests (empty active tab, empty inactive tab, deep page index).

## 3) Gate Checks (Must-Pass)
- Build Gate: typecheck/build pass for shared/api/admin-ui
- Contracts Gate: `statusTab` and `tabCounts` present and used consistently
- Security Gate: RBAC unchanged for read access
- API Gate: `/users` remains stable for existing consumers
- UI Gate: tab badge values and table data match backend response
- QA Gate: tab/pagination regression suite passes

## 4) Risks & Mitigations
- Risk: Different modules interpret “inactive” differently.
  - Mitigation: one centralized enum mapping in shared contracts.
- Risk: Count queries increase response latency.
  - Mitigation: combine count strategy with proper indexes and query plans.
- Risk: URL state drift (`tab` vs `statusTab`).
  - Mitigation: single parser/serializer in VM.

## 5) Definition of Done (DoD)
- Tab badges display global server counts.
- Selecting a tab performs server-filtered fetch and correct pagination.
- Current-page-only derived tab count logic is removed.
- Tests cover all tab modes and empty states.
