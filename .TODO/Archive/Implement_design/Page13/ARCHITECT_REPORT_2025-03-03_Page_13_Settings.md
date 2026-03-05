# Architect Report — Page 13 (Settings / System Config + Feature Flags)

**Scope**: Page_13_Settings  
**Date**: 2025-03-03  
**Agent**: @AdminArchitect  
**Plan reference**: `.cursor/plans/PLAN_PAGE_13_Settings_System_Config_Feature_Flags.md`

---

## 1. MVVM boundary check

| Layer | Location | Evidence | Status |
|-------|----------|----------|--------|
| View | `apps/admin-ui/src/features/settings/view/SettingsScreen.tsx` | Uses only `useSettingsViewModel(initialConfigs)`; no fetch, no Supabase | **Verified in dashboard code** ✅ |
| ViewModel | `apps/admin-ui/src/features/settings/viewmodels/use_settings_viewmodel.ts` | Calls `updateSystemConfig` from `../services/settings_api` only; no RBAC, no DB | **Verified in dashboard code** ✅ |
| API client | `apps/admin-ui/src/features/settings/services/settings_api.ts` | `request('GET', CONFIG_URL)` / `request('PATCH', CONFIG_URL, { key, value })`; no server-only imports | **Verified in dashboard code** ✅ |

**Conclusion**: View → ViewModel → settings_api (HTTP only). No server-only code in feature. **APPROVED**.

---

## 2. Route parity (TanStack Router)

- **Verified in dashboard code**: Route exists at `path: '/settings'` in `App.tsx` (settingsRoute); component `SettingsPage` uses `useLoaderData()` and passes `configs`, `canManage` to `SettingsScreen`.
- Loader runs `Promise.all([request('GET', '/auth/me'), getSystemConfigs()])` and returns `{ configs, canManage }`; `pendingComponent` shows loading state.

**Conclusion**: Route and loader correctly wired. **APPROVED**.

---

## 3. Contract needs / schema alignment

- **Verified in app code**: API uses `GetSystemConfigResponseSchema` and `UpdateSystemConfigBodySchema` from `@sline/shared` in `apps/api/src/routes/settings.ts`.
- **Verified in dashboard code**: Feature has local `apps/admin-ui/src/features/settings/models/settings.schema.ts` defining `SystemConfig`, `MaintenanceMode`, `AppBanner` (Zod). `packages/shared/src/schemas/settings.ts` defines same shapes plus `GetSystemConfigResponseSchema` / `UpdateSystemConfigBodySchema`.
- **Finding (MED)**: Duplicate schema definitions: admin-ui `settings.schema.ts` vs `packages/shared` — risk of drift. Recommendation: have admin-ui import shared types for API response/request and keep only UI-specific derived types locally if needed.

**Conclusion**: Contracts work; deduplication recommended. **APPROVED with recommendation**.

---

## 4. Forbidden imports scan (admin-ui settings feature)

- **Verified in dashboard code**: Grep for `@/lib/supabase/admin`, `createAdminClient`, `'use server'`, `@/lib/supabase/server`, `auth.admin`, `@/types/supabase`, `next/*` in `apps/admin-ui/src/features/settings/`: **no matches**.

**Conclusion**: No forbidden imports. **APPROVED**.

---

## 5. Exact file paths (structure)

| Purpose | Path |
|---------|------|
| Settings route | `apps/admin-ui/src/routes/Settings.tsx` |
| Settings screen | `apps/admin-ui/src/features/settings/view/SettingsScreen.tsx` |
| ViewModel | `apps/admin-ui/src/features/settings/viewmodels/use_settings_viewmodel.ts` |
| API client | `apps/admin-ui/src/features/settings/services/settings_api.ts` |
| Feature schema (local) | `apps/admin-ui/src/features/settings/models/settings.schema.ts` |
| Loader / route def | `apps/admin-ui/src/App.tsx` (settingsRoute) |

---

## 6. Gate checklist

- [x] View has no DB/Supabase; uses only VM and props.
- [x] ViewModel uses only settings_api (no raw fetch elsewhere in feature).
- [x] settings_api uses central `request()` with `/settings/config` (baseURL `/api/v1` → `/api/v1/settings/config`).
- [x] No server-only code in settings feature.
- [ ] Optional: Align admin-ui config types with `packages/shared` to avoid drift.

**Decision**: **APPROVED** — architecture and boundaries comply. One MED recommendation (contract deduplication).
