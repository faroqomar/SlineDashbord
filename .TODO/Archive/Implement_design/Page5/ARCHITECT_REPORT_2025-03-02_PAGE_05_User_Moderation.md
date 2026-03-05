# Architect Report — PAGE 05 User Moderation (+ related user routes)

**Scope:** PAGE 05 (ban/unban/suspend → profiles + RPC) and user routes (including force-logout).  
**Date:** 2025-03-02  
**Agent:** @AdminArchitect

---

## MVVM boundary check

| Layer | Evidence | Status |
|-------|----------|--------|
| **View** | **Verified in dashboard code:** UserDetail.tsx, UsersScreen.tsx — no Supabase/DB calls; use `request()` via services or VM state. | OK |
| **ViewModel** | **Verified in dashboard code:** use_user_actions.vm.ts calls `banUser()` from users_api only; no direct DB. useUsersViewModel uses getUsers/getUserDetails from users_api. | OK |
| **Service (API client)** | **Verified in dashboard code:** users_api.ts uses `request()` to `/users/*` only; no `.from('profiles')` or Supabase in admin-ui. | OK |

## Route parity (TanStack Router)

- **Verified in dashboard code:** User list/detail routes consume API; no route changes required for PAGE 05. Force-logout is API-only; UI can add action later.

## Contract needs

- **Verified in app code:** BanUserSchema, UnbanUserSchema, SuspendUserSchema (userId, reason, duration) in packages/shared; used by API. ForceLogoutInputSchema present.
- No missing schemas for current scope.

## Exact file paths

- `apps/admin-ui/src/features/users/services/users_api.ts` — API client (ban, unban, suspend, forceLogoutUser).
- `apps/admin-ui/src/features/users/viewmodels/use_user_actions.vm.ts` — handleBan uses banUser.
- `apps/admin-ui/src/routes/UserDetail.tsx` — uses accountStatus from profile.
- `apps/admin-ui/src/features/users/views/UsersScreen.tsx` — uses vm.users (status from API).

---

## Finding

- **Severity:** —  
- **Conclusion:** MVVM preserved; ViewModels call services only; no DB in Views. No refactors required for PAGE 05 scope.
