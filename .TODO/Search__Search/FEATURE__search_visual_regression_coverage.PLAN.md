# Feature Plan: Search Visual Regression Coverage

## 0) Objective

- Add automated visual regression coverage for Search page critical states.
- Prevent UI drift from Figma-aligned implementation during future changes.
- Cover desktop and mobile breakpoints for major states.

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: Search page has multiple visual states (loading, empty, error, timed-out, mixed real/mock rows) in `apps/admin-ui/src/features/search/view/SearchScreen.tsx`.
- Verified in dashboard tooling: Playwright is available (`apps/admin-ui/playwright.config.ts`, `apps/admin-ui/package.json` script `test:e2e`).
- Verified in dashboard tooling: Storybook is available (`apps/admin-ui/package.json` scripts `storybook`, `build-storybook`).
- Verified in repo tests: no Search-specific visual test file currently exists under `apps/admin-ui/e2e/`.
- Missing repo evidence: approved baseline snapshot strategy for Search page states.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Baseline Strategy

- [ ] Step 0.1 (@QA): Choose primary visual runner (Playwright snapshots recommended for route-level states).
- [ ] Step 0.2 (@DevOps): Define snapshot update policy and CI artifact retention for diffs.
- Verification (@QA): Testing strategy documented in `apps/admin-ui/e2e/README.md` (Search section).

### Phase 1: Contracts (State Fixtures)

- [ ] Step 1.1 (@DataSmith): Create deterministic fixture scenarios for Search states:
  - default with query + results
  - loading/skeleton
  - empty (no matches)
  - API error
  - timeout
  - mock-only filters (`report`, `case`)
- [ ] Step 1.2 (@AdminArchitect): Ensure fixtures can be injected via test routing/mocking without backend mutation.
- Verification (@QA): Fixture catalog committed and referenced by tests.

### Phase 2: Test Harness

- [ ] Step 2.1 (@QA): Add `apps/admin-ui/e2e/search-visual.spec.ts` with route interception for `/api/v1/search` and any new insights/preferences endpoints.
- [ ] Step 2.2 (@QA): Capture deterministic screenshots per state for:
  - desktop (for example 1440x900)
  - mobile (for example 390x844)
- [ ] Step 2.3 (@QA): Stabilize dynamic values (clock text, random ids, animated transitions) during snapshots.
- Verification (@QA): Local run produces stable screenshots across two consecutive runs.

### Phase 3: UI Support for Testability

- [ ] Step 3.1 (@UIExpert): Add minimal stable selectors (`data-testid`) only where needed for snapshot state control.
- [ ] Step 3.2 (@UIExpert): Gate or disable non-deterministic visual noise in test mode if required.
- Verification (@CodeWarden): Testability additions do not alter production UX behavior.

### Phase 4: CI Integration

- [ ] Step 4.1 (@DevOps): Wire Search visual tests into CI job (nightly or PR-required for `apps/admin-ui/src/features/search/**` changes).
- [ ] Step 4.2 (@DevOps): Publish snapshot diff artifacts on failure.
- Verification (@QA): CI job fails on visual diff and provides artifact links for review.

### Phase 5: Acceptance and Governance

- [ ] Step 5.1 (@QA): Run baseline approval pass with design owner and capture accepted snapshots.
- [ ] Step 5.2 (@Modernizer): Add guardrail notes for intentional UI changes (how to update baseline).
- Verification (@QA): Team can distinguish expected snapshot updates from regressions.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: e2e suite compiles and runs in CI environment.
- [ ] Contracts Gate: fixture scenarios are deterministic and documented.
- [ ] Security Gate: test mocks do not bypass auth in production code paths.
- [ ] API Gate: intercepted responses mirror shared schemas for realism.
- [ ] UI Gate: snapshots cover all critical Search states and breakpoints.
- [ ] QA Gate: flake rate is acceptable and diff artifacts are actionable.

## 4) Risks & Mitigations

- Risk: Visual tests become flaky due to dynamic timestamps/animations.
  - Mitigation: freeze time and reduce motion in test mode.
- Risk: Snapshot noise causes alert fatigue.
  - Mitigation: narrow capture regions and keep deterministic fixtures.
- Risk: CI runtime increases too much.
  - Mitigation: scope visual tests to Search route and changed files.
- Risk: Baselines become stale after intended redesigns.
  - Mitigation: baseline update checklist with design-owner signoff.
- Risk: Route intercepts drift from real contracts.
  - Mitigation: derive fixtures from shared Zod schemas and validate in tests.

## 5) Definition of Done (DoD)

- Search page has automated visual snapshots for all major states.
- Snapshots run in CI and block regressions.
- Fixture and baseline update process is documented and repeatable.
- All gates in section 3 pass.

