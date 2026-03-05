# User Management (Users Page + View Profile)

## Purpose

Manage platform users from the admin plane with server-enforced moderation controls and profile-level operational visibility.

## Routes / Screens

- List page: `/users`
  - Route: `apps/admin-ui/src/routes/Users.tsx`
  - Screen: `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
- Profile page: `/users/$userId`
  - Route: `apps/admin-ui/src/routes/UserDetail.tsx`
  - Screen: `apps/admin-ui/src/features/users/views/UserProfileScreen.tsx`
- Investigation page: `/users/$userId/investigation`
  - Triggered from profile hero and row action menu

## UI Coverage

### Users list
- Hero banner + invite CTA
- KPI cards
- Server-backed status tabs (`All`, `Active`, `Inactive`) with tab counts
- Search input + paginated table
- Row actions menu (`View Profile`, `Investigation`, moderation actions)

### View Profile
- Breadcrumb + back action
- Hero/identity block
- Facts grid (email, phone, joined, last active, roles, provider, bio)
- Administrative actions panel (`Suspend 24h`, `Ban User`, `Unban User`, `Force Logout`)
- Work overview:
  - `Tenders & Assignments`
  - `Bookings Overview`
  - `Wallet Situation`
- Explicit loading/error/empty behavior for each section

## API Endpoints (No new endpoint surface)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/users` | List users with KPI counts and tab counts |
| GET | `/api/v1/users/:userId` | User detail payload (auth + profile map) |
| GET | `/api/v1/users/:userId/investigation` | Aggregated activity graph for profile sections |
| POST | `/api/v1/users/:userId/suspend` | Suspend user (reason required) |
| POST | `/api/v1/users/:userId/ban` | Ban user (reason required) |
| POST | `/api/v1/users/:userId/unban` | Unban user |
| POST | `/api/v1/users/:userId/force-logout` | Force session revoke |
| GET | `/api/v1/finance/users/:userId` | Wallet summary + recent activity for profile wallet block |

## ViewModels / Services

- Services:
  - `apps/admin-ui/src/features/users/services/users_api.ts`
- ViewModels:
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`
  - `apps/admin-ui/src/features/users/viewmodels/useUsersInviteViewModel.ts`
  - `apps/admin-ui/src/features/users/viewmodels/useUserProfileViewModel.ts`

## Contracts (packages/shared)

- Users list/status contracts:
  - `packages/shared/src/schemas/users.ts`
- Investigation graph contracts:
  - `packages/shared/src/schemas/investigation.ts`

## Security / Rules

- RBAC enforced server-side (`requireAdminRole` in API routes).
- Browser does not use service-role DB access.
- Moderation actions require reason where policy requires.
- Investigation payload uses masked profile semantics.

## Regression Notes

Resolved in current implementation:
- Row action menu placement regression (menu opened in viewport corner) fixed by trigger-relative portal positioning.
- Investigation/profile section false-negative behavior mitigated by safe profile fallback in API.
- Wallet block now shows explicit no-wallet message when wallet account does not exist.

## Verification

- `npm --prefix apps/api run test -- src/routes/users.test.ts src/routes/team.test.ts`
- `npm --prefix apps/admin-ui run test -- src/features/users/services/users_api.test.ts src/features/users/views/users.view.test.ts src/features/users/views/user-profile.view.test.ts`
- `npm --prefix apps/admin-ui run test:e2e -- e2e/users.spec.ts`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
