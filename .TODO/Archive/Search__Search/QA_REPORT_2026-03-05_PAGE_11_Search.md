# QA Report — PAGE 11 Search (2026-03-05)

## Scope
- Search and insights contracts/API/UI behavior verification for this feature scope.

## Automated Checks
- `Verified in app code`: `apps/api/src/routes/search.test.ts` passes including `/search/insights`.
- `Verified in dashboard code`: `apps/admin-ui/src/features/search/models/search-ui.mock.test.ts` passes (KPI mapping).
- `Verified in dashboard code`: typecheck/build/forbidden-imports pass for `apps/admin-ui`.
- `Verified in app code`: typecheck passes for `apps/api`; shared schema tests pass.

## Manual Checklist
- Open `/search`, confirm KPI cards show `Live` or `Live (stale)` instead of fixed mock text.
- Trigger search and confirm result flow still works.
- Confirm right rail still marks mock sections explicitly.

## Decision
- **PASS ✅**
