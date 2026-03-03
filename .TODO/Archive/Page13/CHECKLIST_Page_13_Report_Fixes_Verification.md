# Checklist — Page 13 Report Fixes (Verify in App & Code)

Use this to confirm every fix from the Master Report was applied. Check off each item as you verify.

---

## 1. UI copy (Settings screen)

- [ ] **In the app:** Open `/settings` as super_admin. Scroll to the “Audit Persistence” card (right column, below the banner).
- [ ] **Verify:** The text says **“audit_logs”** (not “system_audit_log”).
- [ ] **In code:** `apps/admin-ui/src/features/settings/view/SettingsScreen.tsx` — search for `audit_logs`; the card body should contain `<strong>audit_logs</strong>`.

---

## 2. Banner type Select (no `any`)

- [ ] **In the app:** On `/settings`, enable “Public Announcement Banner”, then change the “Type & Styling” dropdown (Information, Warning, Critical, Success). Confirm it saves and updates.
- [ ] **In code:** `SettingsScreen.tsx` — line with `onValueChange` for the banner type Select: parameter should be typed as `(val: AppBanner['type'])`, and file should `import type { ..., AppBanner } from "../models/settings.schema"`.

---

## 3. ViewModel — `updateConfig` typed (no `any`)

- [ ] **In code:** `apps/admin-ui/src/features/settings/viewmodels/use_settings_viewmodel.ts` — find `updateConfig`. Signature should be:
  - `const updateConfig = async (key: string, newValue: Record<string, unknown>) => {`
- [ ] **In the app:** Toggle maintenance mode, change banner text, toggle signups, change iOS/Android version. All updates should still work.

---

## 4. API — typed request user (no `(request as any)`)

- [ ] **In code:** `apps/api/src/routes/settings.ts`:
  - [ ] There is an `interface AuthenticatedRequest extends FastifyRequest { user: AuthUser }` (or equivalent).
  - [ ] PATCH handler uses `async (request: AuthenticatedRequest, reply)` and `request.user?.id` (no `(request as any)`).
  - [ ] File imports `import type { AuthUser } from '../auth.js'`.
- [ ] **In the app:** As super_admin, change any setting and save. PATCH should still return 200 (or 500 if DB not migrated).

---

## 5. Schema alignment (admin-ui uses shared)

- [ ] **In code:** `apps/admin-ui/src/features/settings/models/settings.schema.ts`:
  - [ ] File only re-exports from `@sline/shared`: `SystemConfig`, `MaintenanceMode`, `AppBanner` (types) and `SystemConfigSchema`, `MaintenanceModeSchema`, `AppBannerSchema` (schemas).
  - [ ] No local Zod definitions for those (no duplicate schema in this file).
- [ ] **In the app:** `/settings` loads without errors; config cards show correct data when API returns rows.

---

## 6. Feature doc added

- [ ] **In repo:** File exists: `Docs/features/settings-system-config.md` (or `docs/features/settings-system-config.md` depending on casing).
- [ ] **Content:** Doc includes Purpose, Routes/screens, API (GET/PATCH, RBAC, rate limit), ViewModels, Special rules (audit, no server-only in admin-ui), DB/migrations (PAGE 13, migration name, RPC).
- [ ] **In repo:** `docs/features/README.md` (or `Docs/features/README.md`) “Current feature docs” list includes `settings-system-config.md`.

---

## 7. 429 rate-limit test

- [ ] **In code:** `apps/api/src/routes/settings.test.ts` has a test named like “returns 429 when PATCH rate limit exceeded”.
- [ ] **Test logic:** Builds app with SUPER_ADMIN, sends 5 PATCH requests (all 200 or 500), then 6th PATCH; expects status 429 and `body.error?.code === 'RATE_LIMIT'`.
- [ ] **Run tests:** From repo root, run the settings test suite (e.g. `pnpm --filter api test -- settings.test` or `npm run test -- apps/api/src/routes/settings.test.ts`). All tests, including the new one, pass.

---

## 8. Quick regression (app flows)

- [ ] **401:** Open app in incognito (or log out). Call GET and PATCH to `/api/v1/settings/config` with no auth → both return 401 (or use Network tab when visiting `/settings` while logged out).
- [ ] **403 on PATCH:** Log in as support (or non–super_admin). On `/settings` you see “Access Restricted”. If you can trigger a PATCH (e.g. via devtools), it should return 403.
- [ ] **200 GET / 200 or 500 PATCH:** Log in as super_admin. Visit `/settings` → loader runs, config cards show. Change one setting (e.g. maintenance message) and save → success toast; GET after refresh shows updated value if DB has migration applied (otherwise PATCH may 500).

---

## Summary

| # | Fix | Where to check |
|---|-----|----------------|
| 1 | “audit_logs” copy | Settings screen card + `SettingsScreen.tsx` |
| 2 | Select type `AppBanner['type']` | Banner dropdown + `SettingsScreen.tsx` |
| 3 | `updateConfig` typed | `use_settings_viewmodel.ts` + toggles/inputs on `/settings` |
| 4 | Typed request in API | `apps/api/src/routes/settings.ts` + PATCH works |
| 5 | Schema from shared | `settings.schema.ts` re-exports only |
| 6 | Feature doc | `Docs/features/settings-system-config.md` + README list |
| 7 | 429 test | `settings.test.ts` + test run |
| 8 | Regression | 401, 403, GET/PATCH and `/settings` flow |

When all boxes are checked, the Master Report fixes are verified in the actual app and code.
