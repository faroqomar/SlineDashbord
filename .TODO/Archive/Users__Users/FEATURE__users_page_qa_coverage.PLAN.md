# Feature Plan: Users Page QA Coverage (E2E + Regression)

## 0) Objective
- Add stable automated coverage for Users page critical states and interactions.
- Cover both real-wired behavior and explicit mock-only behavior.
- Prevent regressions in future UI redesign cycles.

## 1) Current State (Evidence-labeled)
- Verified in dashboard code: Users page has loading/empty/error/table/tab/search/pagination states.
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`
- Verified in dashboard code: invite and some KPI values are mock-backed.
  - `apps/admin-ui/src/features/users/models/users-ui.mock.ts`
- Verified in test suite: no dedicated Users E2E spec currently exists.
  - `apps/admin-ui/e2e` (contains bookings/chat/finance/login/reports-cases specs only)

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Test Strategy
- [ ] Step 0.1 (@QA): Choose deterministic test mode for Users page:
  - API route stubbing in Playwright, or
  - controlled seeded test environment
- [ ] Step 0.2 (@DataSmith): Provide canonical fixtures for users list variants (active/inactive/mixed/empty/error).
- Verification (@CodeWarden): strategy avoids flaky dependence on live data drift.

### Phase 1: E2E Spec Creation
- [ ] Step 1.1 (@QA): Add `apps/admin-ui/e2e/users.spec.ts`.
- [ ] Step 1.2 (@QA): Implement scenarios:
  - loads Users page shell and key sections
  - search query updates URL and list
  - tab switch updates rows
  - pagination controls update page
  - row action opens detail link
  - empty state rendering
  - API error rendering
- Verification (@QA): all scenarios pass locally and in CI repeat runs.

### Phase 2: Mock/Real Assertions
- [ ] Step 2.1 (@QA): Assert mock-labeled behavior explicitly:
  - invite action currently toast/info only
  - KPI fields backed by mocked values (until feature replacement)
- [ ] Step 2.2 (@QA): Assert real API wiring for list/search/pagination endpoints.
- Verification (@SecGuard): no privileged flow tested via client bypass assumptions.

### Phase 3: Optional Component/VM Unit Tests
- [ ] Step 3.1 (@QA): Add unit tests for ViewModel URL state parser/serializer (`page`, `query`, `tab`).
- [ ] Step 3.2 (@QA): Add formatter tests for date and last-active rendering edge cases.

### Phase 4: CI Integration
- [ ] Step 4.1 (@DevOps): Add Users spec to default E2E job matrix.
- [ ] Step 4.2 (@DevOps): Capture trace/video on failure for triage.
- Verification (@QA): flaky threshold and retries documented.

## 3) Gate Checks (Must-Pass)
- Build Gate: `npm --prefix apps/admin-ui run typecheck`
- QA Gate: `npm --prefix apps/admin-ui run test:e2e -- users.spec.ts`
- Security Gate: no test-only bypass in production code
- UI Gate: all documented Users states have at least one automated assertion

## 4) Risks & Mitigations
- Risk: E2E flakiness from async data timing.
  - Mitigation: explicit network stubs and deterministic waits by UI text/role.
- Risk: brittle selectors due to style-heavy UI.
  - Mitigation: add stable `data-testid` attributes only where needed.
- Risk: CI duration increase.
  - Mitigation: keep Users spec focused and parallelizable.

## 5) Definition of Done (DoD)
- Dedicated `users.spec.ts` exists and runs in CI.
- Critical Users states (loading/empty/error/filtered/paginated) are covered.
- Mock-vs-real behavior is explicitly asserted to avoid accidental drift.
