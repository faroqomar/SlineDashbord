# Architect Report — PAGE 06 Force Logout / Session Revocation

**Scope:** PAGE 06 (force-logout → profiles.force_logout_after + RPC admin_force_logout_user).  
**Date:** 2025-03-02  
**Agent:** @AdminArchitect

---

## MVVM boundary check

| Layer | Evidence | Status |
|-------|----------|--------|
| **View** | **Verified in dashboard code:** UserDetail.tsx — no Supabase/DB calls; uses `request()` for force-logout mutation. | OK |
| **ViewModel** | **Verified in dashboard code:** Force-logout in UserDetail uses useMutation calling users_api.forceLogoutUser(). | OK |
| **Service (API client)** | **Verified in dashboard code:** users_api.ts — forceLogoutUser() calls request('POST', `/users/${userId}/force-logout`, …); no Supabase in admin-ui. | OK |

## Route parity (TanStack Router)

- **Verified in dashboard code:** User detail route unchanged; force-logout is an action on UserDetail. No new routes; API POST /users/:userId/force-logout only.

## Contract needs

- **Verified in app code:** ForceLogoutInputSchema (userId, reason?, idempotency_key?) in packages/shared/schemas/users.ts; AuditActionEnum includes 'admin.users.force_logout' in audit.ts.
- No missing schemas for PAGE 06 scope.

## Exact file paths

- `apps/admin-ui/src/features/users/services/users_api.ts` — forceLogoutUser(userId, reason?).
- `apps/admin-ui/src/routes/UserDetail.tsx` — Force logout button, confirmation, useMutation with request() to force-logout.

---

## Finding

- **Severity:** —  
- **Conclusion:** MVVM preserved; no DB or server-only imports in admin-ui for force-logout. UserDetail now calls users_api.forceLogoutUser() for consistency with ban/suspend pattern (fix applied).
