# Architect Report — Users / Users (2026-03-05)

## Scope
- Users list page (`/users`) and View Profile page (`/users/$userId`) after regression fixes.

## Findings
- `Verified in dashboard code`: `UsersScreen` remains composition-only with presentational components under `apps/admin-ui/src/features/users/views/components`.
- `Verified in dashboard code`: `UserProfileScreen` remains MVVM-aligned; data/mutations are delegated to `useUserProfileViewModel` and rendered via page-only profile components.
- `Verified in dashboard code`: route parity is intact:
  - `/users` -> `apps/admin-ui/src/routes/Users.tsx`
  - `/users/$userId` -> `apps/admin-ui/src/routes/UserDetail.tsx`
- `Verified in dashboard code`: row actions menu rendering is anchored to the trigger element using portal + viewport-safe positioning in `apps/admin-ui/src/components/users/UserActionsMenu.tsx`.

## Blockers / Regressions
- None.

## Decision
- **APPROVED ✅**

## Evidence Paths
- `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
- `apps/admin-ui/src/features/users/views/UserProfileScreen.tsx`
- `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`
- `apps/admin-ui/src/features/users/viewmodels/useUserProfileViewModel.ts`
- `apps/admin-ui/src/components/users/UserActionsMenu.tsx`
