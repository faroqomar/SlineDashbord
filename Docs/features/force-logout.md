# Force Logout (Session Revocation)

## Purpose

Allows an admin or super_admin to **revoke a user’s session** so they are forced to sign in again. Used for security incidents, policy violations, or account recovery. The dashboard sets `profiles.force_logout_after`; the **marketplace app (Flutter) must enforce** it by clearing the session when the value is after the token’s issued-at time.

**For whom**: Admins and super_admins only (support cannot force-logout).

---

## Routes / Screens

- **User detail**: `apps/admin-ui/src/routes/UserDetail.tsx` — “Force logout” button in the **Administrative Actions** section. No dedicated force-logout route; action is performed from the user detail page.

---

## API

| Method | Path | Request body | Response |
|--------|------|--------------|----------|
| POST | `/api/v1/users/:userId/force-logout` | `{ reason?: string }` (optional) | `200` `{ ok: true, data: { userId } }`; `400` validation; `401` no auth; `403` not admin/super_admin; `404` profile not found; `500` DB error |

- **Contract**: `packages/shared` — `ForceLogoutInputSchema` (userId from path, optional reason, optional idempotency_key). Audit action enum: `admin.users.force_logout` in `schemas/audit.ts`.

---

## ViewModels / API Client

- **API client**: `apps/admin-ui/src/features/users/services/users_api.ts` — `forceLogoutUser(userId: string, reason?: string)` → calls `POST /users/:userId/force-logout`.
- **UI**: UserDetail uses `useMutation` with `forceLogoutUser(userId, reason)`; on success invalidates user detail query. Confirmation dialog and optional reason prompt before sending.

---

## Special Rules

- **RBAC**: Only `admin` and `super_admin` (USERS_WRITE_ROLES). API returns 403 for support.
- **Audit**: One row in `audit_logs` per call, written **inside the RPC** `admin_force_logout_user` in the same transaction as the profile update. API does **not** use `withAudit`.
- **Reason**: Optional in request body; recommended for audit. Stored in `audit_logs.meta.reason`.
- **Idempotency**: Not required in v1. Repeating the call updates `force_logout_after` again and returns 200.
- **App enforcement**: The Flutter app must read `profiles.force_logout_after` and force re-auth when it is set and after the session start. See `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`.

---

## Database

- **Migration**: `supabase/migrations/20260302140000_force_logout.sql` (dashboard); same SQL in `MIGRATIONS/for_sline_app/20260302140000_force_logout.sql` for app repo.
- **Column**: `profiles.force_logout_after` (timestamptz, nullable). Set to `now()` by RPC.
- **RPC**: `admin_force_logout_user(p_user_id, p_admin_id, p_reason)` — UPDATE profiles, INSERT audit_logs (`action = 'admin.users.force_logout'`, `related_entity_type = 'profile'`, `related_entity_id = p_user_id`, `meta`).

---

## Related Docs

- **User management**: `Docs/features/users.md`
- **Security**: `Docs/ADMIN_SECURITY_MANUAL.md` (Destructive Actions, Audit)
- **Database**: `Docs/ADMIN_DATABASE_REF.md` (profiles, RPCs, audit_logs)
- **App enforcement**: `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`
