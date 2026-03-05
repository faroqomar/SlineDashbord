# QA Report — Users / Users (2026-03-05)

## Scope
- Users-only blockers + regression verification for `/users` and `/users/$userId`.

## Automated Checks
- `Verified in app code`: `npm --prefix packages/shared run test -- src/schemas/users.test.ts` ✅
- `Verified in app code`: `npm --prefix apps/api run test -- src/routes/users.test.ts src/routes/team.test.ts` ✅
- `Verified in dashboard code`: `npm --prefix apps/admin-ui run test -- src/features/users/views/users.view.test.ts src/features/users/services/users_api.test.ts src/features/users/views/user-profile.view.test.ts` ✅
- `Verified in dashboard code`: `npm --prefix apps/admin-ui run test:e2e -- e2e/users.spec.ts` ✅
- `Verified in dashboard code`: `npm --prefix apps/admin-ui run typecheck` ✅

## Critical Regression Scenarios (Covered)
- Open row actions menu and verify `View Profile` action is present.
- Navigate to `/users/:id` from row menu.
- Verify profile sections render:
  - `Profile Facts`
  - `Tenders & Assignments`
  - `Bookings Overview`
  - `Wallet Situation`
- Execute moderation action (`Force Logout`) and verify request fire.
- Navigate back to `/users` and verify list renders.

## Manual Checklist
- `/users`: actions menu opens next to clicked row trigger, not top-left viewport corner.
- `/users/$userId`: valid user route does not show false page-level "User not found".
- profile activity sections show real data, warning, or explicit empty-state text without breaking layout.
- wallet block shows explicit no-wallet message when wallet account does not exist.
- no runtime UI crashes while opening menu/profile actions.

## Decision
- **PASS ✅**
