# Feature Plan: Users Screen Component Modularization (Tech Debt)

## 0) Objective
- Reduce `UsersScreen` complexity by extracting reusable presentational components.
- Improve maintainability without changing UI behavior or data contracts.

## 1) Current State (Evidence-labeled)
- Verified in dashboard code: `UsersScreen.tsx` currently contains banner, KPI cards, tabs, search, table rows, skeletons, and footer in one file.
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
- Verified in dashboard code: ViewModel already exposes stable state/actions that can be passed as props.
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`

## 2) Execution Checklist (Agent-assigned)

### Phase 1: Extraction Design
- [ ] Step 1.1 (@AdminArchitect): Define component boundaries and prop contracts.
- [ ] Step 1.2 (@UIExpert): Keep all components presentational and side-effect free.
- Verification (@CodeWarden): no new business logic leaks into view components.

### Phase 2: Component Split
- [ ] Step 2.1 (@UIExpert): Extract page-only components under `features/users/views/components/`:
  - `UsersHeroBanner`
  - `UsersKpiGrid`
  - `UsersToolbar`
  - `UsersTable`
  - `UsersTableFooter`
  - `UsersTableSkeleton`
- [ ] Step 2.2 (@UIExpert): Keep `UsersScreen` as composition container only.
- Verification (@QA): visual parity snapshot before/after.

### Phase 3: Tests/Regression
- [ ] Step 3.1 (@QA): Add minimal render tests for extracted components.
- [ ] Step 3.2 (@QA): Re-run Users E2E suite to confirm no interaction drift.

## 3) Gate Checks (Must-Pass)
- Build Gate: admin-ui typecheck/build pass
- UI Gate: no visual or behavior regressions
- QA Gate: existing Users tests unchanged or improved

## 4) Risks & Mitigations
- Risk: Prop drilling complexity.
  - Mitigation: group props by section view-model objects.
- Risk: Styling drift during extraction.
  - Mitigation: move markup unchanged first, refactor later.

## 5) Definition of Done (DoD)
- `UsersScreen.tsx` becomes thin composition.
- All extracted components are typed and presentational.
- No UI/behavior regressions after split.
