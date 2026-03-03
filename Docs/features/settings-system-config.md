# Settings / System Config + Feature Flags — PAGE 13

## Purpose

Authoritative management of global platform settings and feature flags (maintenance mode, app banner, disable signups, minimum app version). Only **super_admin** can edit; **support**, **moderator**, and **admin** can view. All changes are audited atomically in `audit_logs`; no direct DB writes from the SPA.

---

## Routes / screens

- **Route:** `/settings` (TanStack Router under auth layout).
- **Route file:** `apps/admin-ui/src/routes/Settings.tsx` — thin shell using loader data.
- **View:** `apps/admin-ui/src/features/settings/view/SettingsScreen.tsx` — cards for maintenance mode, banner, signups, min app version; read-only message for non–super_admin.
- **Loader:** Fetches `GET /api/v1/settings/config` and `GET /api/v1/auth/me`; returns `{ configs, canManage }` with `canManage = (role === 'super_admin')`.
- **Sidebar:** "Settings" links to `/settings`.

---

## API

- **GET /api/v1/settings/config** — List all system config rows.
  - **Auth:** Required (cookie/session). 401 if unauthenticated.
  - **RBAC:** `support`, `moderator`, `admin`, `super_admin`. 403 otherwise.
  - **Response:** `GetSystemConfigResponseSchema` (array of `{ key, value, description?, updated_at, updated_by? }`).

- **PATCH /api/v1/settings/config** — Update one config key.
  - **Auth:** Required. 401 if unauthenticated.
  - **RBAC:** **super_admin only.** 403 for other roles.
  - **Body:** `UpdateSystemConfigBodySchema` — `{ key: string, value: Record<string, unknown> }`.
  - **Rate limit:** 5 requests per 60 seconds per user. 429 when exceeded.
  - **Audit:** Single RPC `admin_update_system_config` performs update/upsert and inserts one row into `audit_logs` in the same transaction.

---

## ViewModels

- **Hook:** `useSettingsViewModel(initialConfigs)` in `apps/admin-ui/src/features/settings/viewmodels/use_settings_viewmodel.ts`.
- **Exposes:** `maintenance`, `banner`, `disableSignups`, `appVersion`, `isUpdating`, and update actions (`toggleMaintenance`, `updateBannerText`, `toggleSignups`, `updateAppVersion`, etc.).
- **API client:** `apps/admin-ui/src/features/settings/services/settings_api.ts` — `getSystemConfigs()` (GET), `updateSystemConfig(key, value)` (PATCH) via central `request()`.

---

## Special rules

- **RBAC:** GET allowed for support+; PATCH only for super_admin. Enforced in API; UI shows restricted view for non–super_admin.
- **Audit:** Every PATCH is applied via DB RPC `admin_update_system_config`, which writes exactly one `audit_logs` row atomically (action `admin.system.update_config`, `related_entity_type = 'system_config'`).
- **No server-only in admin-ui:** Settings feature must not import `@/lib/supabase/admin`, `createAdminClient`, or `'use server'`; data flows only via Fastify endpoints.

---

## DB / migrations

- **Migration:** `MIGRATIONS/for_sline_app/20260303100000_system_config.sql`
  - Table: `public.system_config` (key PK, value jsonb, description, updated_by, updated_at). RLS enabled; no policies for anon/authenticated (service role only).
  - RPC: `public.admin_update_system_config(p_key, p_value, p_actor_user_id)` — upserts row and inserts one `audit_logs` row.
  - Enum: `related_entity_type_enum` extended with `system_config`.
- Copy to **sline_app** for production; see **MIGRATIONS/README.md** (PAGE 13) and **Docs/ADMIN_DATABASE_REF.md**.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
