# Users / Users TODO Summary

## 1. Page Overview

- **Page:** Users
- **Tab:** Users
- **Design source:** Figma node `2:27082`
- **Scope:** UI-first implementation only (no new backend features)
- **Primary implementation files:**
  - `apps/admin-ui/src/routes/Users.tsx`
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`
  - `apps/admin-ui/src/features/users/models/users-ui.mock.ts`

This page now includes:
- Hero banner (Platform/Users + description + Invite User CTA)
- KPI cards row (Total Users, Active, Inactive, Joined This Month)
- Filter tabs (All/Active/Inactive)
- Search input wired to URL state
- Users table with columns: User, Role, Status, Joined, Last Active, Actions
- Skeleton, empty state, inline error message
- Footer count and pagination controls

## 2. Existing Features Linked (Real)

- **Users list API (real)**
  - Existing endpoint: `GET /users?page=&query=&role=`
  - Files:
    - `apps/admin-ui/src/features/users/services/users_api.ts`
    - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`

- **Search query + page in URL (real)**
  - Query updates URL params and triggers fetch.
  - File: `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`

- **Pagination (real)**
  - Uses existing `totalPages` + `totalUsers` from API response.
  - File: `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`

- **User detail navigation action (real)**
  - Row actions menu links to `/users/:userId`.
  - File: `apps/admin-ui/src/components/users/UserActionsMenu.tsx`

- **Active route wiring (real)**
  - `/users` now renders `UsersScreen`.
  - File: `apps/admin-ui/src/routes/Users.tsx`

## 3. Mocked Features (Intentional, UI-Only)

Mock data/behavior is centralized in:
- `apps/admin-ui/src/features/users/models/users-ui.mock.ts`

Mocked sections:
- **KPI card values (mock-only for now):**
  - `activeUsers`
  - `inactiveUsers`
  - `joinedThisMonth`
- **Invite User CTA behavior (mock-only):**
  - Shows informational toast, no API call.

Reason mocked:
- No dedicated existing Users-page API contract currently provides these KPI aggregates in one stable payload.
- No existing invite-user flow for this Users tab was scoped for backend implementation in this task.

## 4. Component Map (Implemented)

- **Route entry**
  - `apps/admin-ui/src/routes/Users.tsx`

- **Main page UI**
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`

- **ViewModel and URL state**
  - `apps/admin-ui/src/features/users/viewmodels/useUsersViewModel.ts`

- **API adapter**
  - `apps/admin-ui/src/features/users/services/users_api.ts`

- **Actions dropdown**
  - `apps/admin-ui/src/components/users/UserActionsMenu.tsx`

- **Mock source**
  - `apps/admin-ui/src/features/users/models/users-ui.mock.ts`

## 5. Remaining TODOs

1. Replace mock KPI values with real backend aggregates for active/inactive/joined-this-month.
2. Implement real Invite User flow for Users tab (or explicitly route to Team invite flow if product-approved).
3. Move status tab counts to server-side totals (currently tab filtering/counting is page-local to fetched rows).
4. Add dedicated visual regression/E2E coverage for Users page states (loading, empty, error, filtered, paginated).
5. Optional cleanup: extract `UsersScreen` internal UI blocks into smaller reusable components.

## 6. Verification Snapshot

Last verification run for this implementation:
- `npm --prefix apps/admin-ui run typecheck` ✅

## 7. Expanded Planner Files

- `/.TODO/Users__Users/FEATURE__users_kpi_live_counts.PLAN.md`
- `/.TODO/Users__Users/FEATURE__users_invite_flow_real_integration.PLAN.md`
- `/.TODO/Users__Users/FEATURE__users_status_tabs_server_counts.PLAN.md`
- `/.TODO/Users__Users/FEATURE__users_page_qa_coverage.PLAN.md`
- `/.TODO/Users__Users/FEATURE__users_screen_component_modularization.PLAN.md`
