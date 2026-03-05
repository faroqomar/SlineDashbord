# Feature Plan: Reports/Cases Search Entity Parity

## 0) Objective

- Promote `report` and `case` from mock-only filters to fully real searchable entities.
- Return `report` and `case` items from `GET /api/v1/search` with valid links and metadata.
- Remove mock-only restrictions for these filters in Search UI.

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.model.ts` defines `report` and `case` as mock entity types.
- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.mock.ts` marks `report`/`case` as mock-only via `isMockOnlyFilter`.
- Verified in shared contracts: `packages/shared/src/schemas/search.ts` `AdminSearchEntityTypeEnum` includes only `user`, `task`, `booking`, `dispute`, `transaction`.
- Verified in API code: `apps/api/src/routes/search.ts` searches only those five entity types.
- Verified in API code: existing pages/routes for reports and cases already exist:
  - reports route logic in `apps/api/src/routes/reports.ts`
  - cases route logic in `apps/api/src/routes/cases.ts`
  - admin-ui routes in `apps/admin-ui/src/App.tsx` (`/reports`, `/cases`, `/cases/$caseId`)
- Missing repo evidence: dedicated report detail route in admin-ui (`/reports/$reportId`) for direct deep-linking.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery

- [ ] Step 0.1 (@SysOp): Confirm canonical source tables/views for searching reports and cases (`reports`, `admin_cases`) and searchable columns.
- [ ] Step 0.2 (@AdminArchitect): Decide report deep-link format (`/reports?reportId=<id>` or new `/reports/$reportId` route).
- Verification (@QA): Discovery decision documented and accepted by product.

### Phase 1: Contracts (Shared)

- [ ] Step 1.1 (@SysOp): Extend `AdminSearchEntityTypeEnum` in `packages/shared/src/schemas/search.ts` to include `report` and `case`.
- [ ] Step 1.2 (@SysOp): Add `AdminSearchReportItemSchema` and `AdminSearchCaseItemSchema` to `AdminGlobalSearchResultItemSchema`.
- [ ] Step 1.3 (@QA): Update/extend shared schema tests in `packages/shared/src/schemas/search.test.ts`.
- Verification (@QA): Contract tests validate new entity types and reject unknown types.

### Phase 2: Backend/API

- [ ] Step 2.1 (@SysOp): Extend `apps/api/src/routes/search.ts` with `runReport()` and `runCase()` query branches.
- [ ] Step 2.2 (@SysOp): Support `types=report,case` filtering in query parsing and entity dispatch.
- [ ] Step 2.3 (@SysOp): Map result links:
  - report -> decided report deep-link
  - case -> `/cases/<id>`
- [ ] Step 2.4 (@SecGuard): Validate RBAC parity with reports/cases read roles and avoid exposing restricted fields.
- Verification (@QA): API tests show valid results for report/case searches and schema validation passes.

### Phase 3: ViewModels

- [ ] Step 3.1 (@AdminArchitect): Update filter logic in `apps/admin-ui/src/features/search/models/search-ui.mock.ts` and VM to stop treating `report`/`case` as mock-only.
- [ ] Step 3.2 (@AdminArchitect): Keep optional fallback mock rows only when endpoint cannot return the new entity types.
- Verification (@CodeWarden): VM behavior remains deterministic with no mixed mock/real misclassification.

### Phase 4: UI

- [ ] Step 4.1 (@UIExpert): Update chip badges and result rows so report/case entries render as real (no forced mock label).
- [ ] Step 4.2 (@UIExpert): Ensure click navigation works for both entity types and preserves existing hover/active styles.
- Verification (@QA): Manual smoke confirms report/case filters produce real rows and navigable links.

### Phase 5: Testing

- [ ] Step 5.1 (@QA): Extend `apps/api/src/routes/search.test.ts` with report/case coverage.
- [ ] Step 5.2 (@QA): Add admin-ui tests for chip behavior and navigation handling on report/case rows.
- [ ] Step 5.3 (@DataSmith): Provide report/case fixtures with varied statuses and severities.
- Verification (@QA): All tests pass and report/case coverage is present in regression suite.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: entity-type changes compile across shared/api/admin-ui.
- [ ] Contracts Gate: `report` and `case` are first-class shared schema members.
- [ ] Security Gate: role checks and field exposure align with moderation policies.
- [ ] API Gate: `/api/v1/search` returns report/case items when requested.
- [ ] UI Gate: filters and rows behave as real entities, not mock-only.
- [ ] QA Gate: tests cover query filtering, payload shape, and navigation.

## 4) Risks & Mitigations

- Risk: Report deep-link route is ambiguous.
  - Mitigation: settle one link strategy in Phase 0 before implementation.
- Risk: Search query on reports/cases is slow.
  - Mitigation: constrain fields, add targeted indexes if needed, cap per-entity result count.
- Risk: Sensitive moderation fields accidentally exposed.
  - Mitigation: explicit projection whitelist in search route mapping.
- Risk: Mixed mock + real rows confuse users during rollout.
  - Mitigation: temporary rollout flag and clear mock badge only for fallback rows.
- Risk: Contract drift between shared and API.
  - Mitigation: strict response parse with shared schema in route handler.

## 5) Definition of Done (DoD)

- `report` and `case` filters are fully real and API-backed.
- Shared schemas, API route, VM logic, and UI behavior are aligned.
- Navigation from search results works for both entity types.
- All gates in section 3 pass.

