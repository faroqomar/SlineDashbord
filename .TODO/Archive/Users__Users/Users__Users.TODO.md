# Users / Users TODO Summary

## 1. Page Overview

- **Page:** Users
- **Tab:** Users
- **Scope:** Users list + View Profile regression stabilization (`/users`, `/users/$userId`)
- **Design baseline:** Figma Users vibe (`2:27082`)

## 2. Existing Features Linked (Real)

- Users list API with KPI + tab counts:
  - `GET /api/v1/users`
- User detail profile data:
  - `GET /api/v1/users/:userId`
- User investigation graph (activity blocks):
  - `GET /api/v1/users/:userId/investigation`
- User moderation actions:
  - `POST /api/v1/users/:userId/suspend|ban|unban|force-logout`
- User wallet lookup (existing finance path):
  - `GET /api/v1/finance/users/:userId`

## 3. Regressions Resolved (This Cycle)

1. Investigation/profile section false-negative "User not found" behavior:
- Resolved by safe profile fallback in:
  - `apps/api/src/routes/users.ts`

2. Wallet empty-state clarity:
- Resolved by explicit no-wallet copy in:
  - `apps/admin-ui/src/features/users/views/components/UserProfileWorkOverview.tsx`

3. Row actions menu corner-position issue:
- Resolved/validated using portal + trigger-relative positioning in:
  - `apps/admin-ui/src/components/users/UserActionsMenu.tsx`

## 4. Current Blocker Status

- Security blockers: none
- MVVM blockers: none
- QA critical-flow failures: none
- Schema drift blockers: none

## 5. Remaining TODOs (Blockers/Regressions Scope)

- None open.

## 6. Verification Snapshot

- `npm --prefix packages/shared run test -- src/schemas/users.test.ts` ✅
- `npm --prefix apps/api run test -- src/routes/users.test.ts src/routes/team.test.ts` ✅
- `npm --prefix apps/admin-ui run test -- src/features/users/views/users.view.test.ts src/features/users/services/users_api.test.ts src/features/users/views/user-profile.view.test.ts` ✅
- `npm --prefix apps/admin-ui run test:e2e -- e2e/users.spec.ts` ✅
- `npm --prefix apps/admin-ui run typecheck` ✅
