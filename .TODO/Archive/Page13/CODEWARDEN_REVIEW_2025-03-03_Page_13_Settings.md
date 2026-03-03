# Code Warden Review — Page 13 (Settings / System Config + Feature Flags)

**Scope**: Page_13_Settings  
**Date**: 2025-03-03  
**Agent**: @CodeWarden  
**Plan reference**: `.cursor/plans/PLAN_PAGE_13_Settings_System_Config_Feature_Flags.md`

---

## 1. Iron architecture rule

**Allowed flow**: Route/View → ViewModel → Client API wrapper → Fastify → DB RPC (atomic audit).

- **Verified in dashboard code**: Settings route → SettingsScreen (view) → useSettingsViewModel → settings_api (request GET/PATCH) → Fastify. No direct Supabase in admin-ui settings. **PASS**.
- **Verified in app code**: API uses RPC for mutation; audit inside RPC. **PASS**.

**No forbidden flows detected.**

---

## 2. Admin UI restrictions (apps/admin-ui)

- **Verified in dashboard code**: No `@/lib/supabase/admin`, `createAdminClient`, `auth.admin`, `@/types/supabase`, `next/*` in settings feature. **PASS**.

---

## 3. ViewModel standards

- **Verified in dashboard code**: ViewModel calls only `updateSystemConfig` (settings_api); no RBAC logic; no raw fetch. **PASS**.
- **Finding (LOW)**: ViewModel uses `any` in `updateConfig(key, newValue: any)`. Prefer typed value (e.g. `Record<string, unknown>` or union) for consistency. **Not blocking**.

---

## 4. API standards (apps/api)

- **Verified in app code**: PATCH uses Zod (`UpdateSystemConfigBodySchema`) for input. **PASS**.
- **Verified in app code**: RBAC on both GET and PATCH. **PASS**.
- **Verified in app code**: Mutation via RPC only; audit atomic. **PASS**.
- Idempotency-Key: Plan does not require it for config updates; rate limit suffices. **PASS**.

---

## 5. File size / God file

- **Verified in dashboard code**: SettingsScreen.tsx ~255 lines; use_settings_viewmodel.ts ~76 lines; settings.ts (API) ~96 lines. All under 300. **PASS**.

---

## 6. Violations list

| Severity | Item | Location | Fix |
|----------|------|----------|-----|
| LOW | `any` in updateConfig | `use_settings_viewmodel.ts` | Type `newValue` as `Record<string, unknown>` or shared type |
| LOW | `(val: any)` in SettingsScreen | `SettingsScreen.tsx` (Select onValueChange) | Type as `AppBanner['type']` |

**No BLOCKER or HIGH.**

---

## Decision

**APPROVED ✅** — MVVM and API standards satisfied. Two LOW nits (replace `any` with proper types). **Not blocked.**
