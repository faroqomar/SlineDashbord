# PAGE 13 — Settings / System Config + Feature Flags (Plan Critic Rewrite)

**Source**: `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md` (Page 13).  
**Workflow**: `.agent/workflows/plan_critic.md` — execution-safe, repo-verifiable, gate-based.

---

## Mandatory Critique Checklist (5.1–5.10)

| # | Area | Result | Notes |
|---|------|--------|--------|
| 5.1 | Scope & requirements | ✅ Measurable goal (GET/PATCH + audit + no SPA DB). ❌ Non-goals and abuse cases (retries, double-submit) not stated. | Corrected plan adds loader + loading/error; double-submit mitigated by viewmodel/disable while isUpdating. Non-goal: app-side read of config (out of scope). |
| 5.2 | Dependencies & ordering | ✅ Fixed: Data/Contracts → Security → Backend → UI → QA. Migration and enum before any audit insert. | Phase order in §H enforces this. |
| 5.3 | Data model & contracts | ✅ Table + enum + RPC defined. ✅ DTOs: GetSystemConfigResponseSchema, UpdateSystemConfigBodySchema. | Invariants in §D; value is JSONB-serializable. |
| 5.4 | Security (AuthZ + RLS + Audit) | ✅ Role matrix: GET support+; PATCH super_admin only. ✅ RLS service-role-only. ✅ Audit atomic in RPC. | Rate limit on PATCH added. |
| 5.5 | Performance & scalability | ✅ Config is small; no pagination. N+1 not applicable. | No index needed for single table by key. |
| 5.6 | Error handling & observability | ⚠️ Request-id/correlation not specified. | API can reuse existing request.id in audit meta (already in audit.ts). |
| 5.7 | UX & state machine | ✅ Loading/error/empty addressed (loader + errorElement; viewmodel defaults). ✅ isUpdating prevents double submit. | Retry: user can retry on error toast. |
| 5.8 | Testing & QA | ✅ Test file location and audit assertion added. ✅ Seed/fixture optional. ⚠️ E2E selectors not named. | Playwright optional; can use role/text. |
| 5.9 | Release & migration safety | ✅ README + ADMIN_DATABASE_REF update. ⚠️ Rollback: revert migration loses data; prefer feature-flag. | Residual risk §I.7. |
| 5.10 | Developer workflow | ✅ DoD implied by gates. ✅ Docs update step (6.4). | Branch/PR not specified (repo-wide). |

---

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (inferred safely)
- **Verified in dashboard code**: `/settings` route exists; `SettingsScreen` + viewmodel + stub `settings_api` exist; shared schemas `SystemConfigSchema`, `MaintenanceModeSchema`, `AppBannerSchema` exist; legacy Next code uses `system_config` and audit.
- **Verified in dashboard code**: API uses `requireAdminRole(allowedRoles)`, `writeAuditLog` / `withAudit` with canonical `audit_logs` columns; `related_entity_type` is an enum in DB (task, admin_user, profile, report, admin_case, etc.).
- **Missing repo evidence**: Table `system_config` and Fastify settings routes do not exist; app repo does not create `system_config`.

### Decision Needed (Blocking)

| # | Missing decision | Options | Recommended choice | Plan impact |
|---|------------------|---------|--------------------|-------------|
| D1 | Where does `system_config` migration live? | (1) Dashboard repo only `MIGRATIONS/for_sline_app/` for sline_app to copy. (2) Dashboard applies its own `supabase/migrations/` and app repo has separate copy. (3) Only in sline_app. | **Option 1**: Add `MIGRATIONS/for_sline_app/YYYYMMDD_system_config.sql`; document in `MIGRATIONS/README.md` that sline_app copies it for production. Dashboard can apply same SQL for local/shared DB. | Plan adds Step 1.1 (migration file path + README); no dual maintenance. |
| D2 | Atomic audit: API-only vs DB RPC? | (1) API: update `system_config` then `writeAuditLog` (non-atomic). (2) DB RPC that does UPDATE + INSERT audit in one transaction. | **Option 2**: Add RPC `admin_update_system_config(p_key, p_value, p_actor_user_id)` that updates row and inserts `audit_logs` in same transaction. Aligns with finance/booking/force_logout pattern. | Plan adds migration step for RPC; API only calls RPC. |
| D3 | Extend `related_entity_type_enum` for system_config? | (1) Add value `system_config` in same migration as table. (2) Use existing generic value if any. | **Option 1**: In `system_config` migration, `ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'system_config';` so audit insert is valid. | Plan adds one line in migration; no FK on enum needed for insert. |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes required |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No explicit step for settings test file location; no seed/fixture path for config keys. | Add: create `apps/api/src/routes/settings.test.ts`; define seed script or fixture for `system_config` keys (DataSmith). |
| **1. Data/Contracts** | ❌ FAIL | Contract for PATCH body (key + value) not explicitly defined; `value` type (unknown vs JSONB) ambiguous for validation. | Add: `UpdateSystemConfigBodySchema` and `GetSystemConfigResponseSchema` in shared; document that `value` is JSONB-serializable object. |
| **2. Security** | ❌ FAIL | Role matrix for GET vs PATCH not written in plan; rate limit marked optional but legacy had it. | Add: explicit matrix (GET: support+; PATCH: super_admin only); make rate limit on PATCH mandatory (e.g. 5/min) or document why skipped. |
| **3. Backend/API** | ❌ FAIL | Order wrong: API before DB RPC; atomic audit not enforced by step. | Reorder: Migration (table + enum + RPC) → then Fastify routes that call RPC. Add stop condition: RPC exists and test inserts audit row. |
| **4. UI/Integration** | ❌ FAIL | Loader vs client fetch for initial configs not decided; loading/error/empty states not specified. | Add: use route loader to fetch GET config + auth/me; pass `initialConfigs` and `canManage`; require loading + error + empty UI states. |
| **5. Release/QA** | ❌ FAIL | No rollback or backward-compat note; no docs-update step. | Add: doc update (ADMIN_DATABASE_REF.md / README); note: rollback = revert migration (table drop has data loss; prefer feature-flag off). |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix steps | Owner | Acceptance |
|-----|----------------|-----------|--------|------------|
| **related_entity_type for audit** | Insert into `audit_logs` with `related_entity_type = 'system_config'` will fail if enum has no such value. | In same migration as `system_config` table, add `ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'system_config';`. | @SysOp | Migration applies; API test inserts audit row with that type. |
| **Atomic audit** | Non-atomic update + audit allows config change without audit on second failure. | Introduce RPC `admin_update_system_config` that in one transaction updates `system_config` and inserts `audit_logs`. API calls RPC only. | @SysOp | Integration test: after PATCH, single new audit row; no config update without audit. |
| **settings_actions in SPA** | If `apps/admin-ui/src/features/settings/services/settings_actions.ts` exists with `createAdminClient` or `'use server'`, build fails and trust boundary is violated. | Delete or rewrite file: remove all server-only imports; implement only HTTP calls via `settings_api.ts` to Fastify. | @AdminArchitect | Grep: no `@/lib/supabase/admin`, no `'use server'` in `apps/admin-ui/src/features/settings/**`. |
| **Initial data for UI** | Empty `system_config` → GET returns [] → viewmodel derives defaults; UI works but "no data" vs "defaults" ambiguous. | Add seed step or migration INSERT for known keys: `maintenance_mode`, `app_banner`, `disable_signups`, `min_app_version` with default values. | @DataSmith / @SysOp | GET returns at least these keys after seed/migration. |
| **Loader vs client fetch** | Unclear how `SettingsPage` gets `initialConfigs` and `canManage`; duplicate fetch or missing auth possible. | Single source: TanStack Router loader for `/settings` that calls GET /api/v1/settings/config and GET /api/v1/auth/me (or equivalent), returns { configs, canManage }. Page renders `SettingsScreen` with that. | @UIExpert | One network round-trip for settings load; no useEffect for initial config fetch in view. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Every config update produces exactly one audit row. | DB RPC performs UPDATE + INSERT audit in same transaction. | Test: PATCH one key; SELECT COUNT(*) FROM audit_logs WHERE related_entity_type = 'system_config' AND related_entity_id = key increases by 1. |
| Only super_admin can mutate config. | Fastify route preHandler: `requireAdminRole(['super_admin'])` for PATCH. | Test: PATCH as support/mod → 403. |
| SPA never touches DB or service role. | No Supabase admin/server imports in admin-ui; settings only use `settings_api` HTTP. | Grep + build: no forbidden imports in `apps/admin-ui`. |
| Config keys are non-empty and known for UI. | Shared schema + optional seed for maintenance_mode, app_banner, disable_signups, min_app_version. | GET response validates against GetSystemConfigResponseSchema; UI does not crash on empty list (defaults in viewmodel). |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| SPA still imports server-only | admin-ui settings services | Med | High | Security-breach | Build fails; CI grep | Remove/rewrite settings_actions; only settings_api HTTP | Block merge until grep clean |
| Audit not atomic | API route | Med | High | App-wide (compliance) | Test: audit count | Use DB RPC for update+audit | Add RPC in follow-up; document risk |
| Enum missing system_config | Migration order | Low | High | Feature | Migration error on insert | Add ADD VALUE in same migration as table | Patch migration; re-run |
| Wrong role can PATCH | RBAC | Low | High | Security-breach | 403 test fails | requireAdminRole(['super_admin']) on PATCH | Add test; fix route |
| Empty config list breaks UI | Viewmodel/UI | Low | Med | Feature | Blank or error screen | Defaults in viewmodel; seed keys | Seed in migration or DataSmith |
| Stale UI after save | Viewmodel | Med | Low | Local | User reports | Update local state on 200; optional refetch | Document; optional refetch on focus |

---

## F) Pre-Mortem

- This fails when **the migration is applied without extending `related_entity_type_enum`**, and the first PATCH triggers an audit insert that violates the enum.
- This fails when **the API updates the row and then writes audit in a separate call**, and the process dies in between — config changes with no audit.
- This fails when **SettingsPage never receives `initialConfigs`** because the loader was not added or the route still renders the placeholder only.
- This fails when **settings_actions.ts remains in the SPA** and the build or security scan catches Supabase admin imports after merge.
- This fails when **GET is allowed for anon** and system config (e.g. maintenance_mode) leaks to unauthenticated clients if route is mis-wired.
- This fails when **rate limit is skipped** and a compromised super_admin account floods config updates.
- This fails when **docs are not updated** and the next developer does not know that system_config lives in for_sline_app and must be copied to sline_app.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Output artifact | Stop condition |
|------|-----|-----|-----------------|-----------------|
| Add `system_config` + enum + RPC in one migration | Single source of truth; atomic audit; valid audit_logs insert. | Create `MIGRATIONS/for_sline_app/YYYYMMDD_system_config.sql`: CREATE TABLE (key PK, value jsonb, description, updated_by, updated_at); ADD VALUE 'system_config'; CREATE OR REPLACE FUNCTION admin_update_system_config(...) that UPDATEs row and INSERTs audit_logs. | SQL migration file | Migration applies; manual or test call to RPC creates audit row. |
| Define GET/PATCH contracts in shared | API and UI must agree on request/response shape; validation. | In packages/shared: GetSystemConfigResponseSchema (array of SystemConfig), UpdateSystemConfigBodySchema (key string, value record). Export. | packages/shared/src/schemas/settings.ts | Schema used by Fastify and by admin-ui types. |
| Add Fastify routes after migration | API must not run before DB is ready. | Register routes in dependency order: after migration step. GET uses service role select; PATCH calls admin_update_system_config RPC. GET: requireAdminRole support+; PATCH: requireAdminRole super_admin + rate limit. | apps/api/src/routes/settings.ts | 401/403/200 tests pass; audit test passes. |
| Seed default config keys | UI and app can rely on known keys. | In migration or separate seed: INSERT default rows for maintenance_mode, app_banner, disable_signups, min_app_version. | Migration or seed file | GET returns these keys. |
| Remove SPA server-only settings code | Trust boundary. | Delete or rewrite apps/admin-ui/.../settings_actions.ts; keep only settings_api.ts calling fetch to Fastify. | No server-only file in settings feature | Grep and build pass. |
| Loader provides config + canManage | Single fetch; no duplicate auth. | Settings route: loader calls GET /api/v1/settings/config and auth context (or /me); returns { configs, canManage }. SettingsPage renders SettingsScreen with those props. | apps/admin-ui route + loader | One load; no useEffect for initial config. |
| Explicit loading/error/empty UI | UX and state machine. | Loader can throw or return error; route errorElement or component shows error. Empty configs: viewmodel already uses defaults. Add loading state while loader is pending. | Settings route + SettingsScreen | No blank screen; user sees loading or error or content. |
| Tests and docs | QA gate; release clarity. | settings.test.ts: 401, 403, 200 GET, 200 PATCH + audit count. Update MIGRATIONS/README.md and optionally ADMIN_DATABASE_REF.md for system_config. | Test file + README/ADMIN_DATABASE_REF | Tests pass; README lists system_config migration. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict dependency order: **Data/Contracts → Security/RLS → Backend APIs → UI → QA/Release**. Gate at end of each phase.

---

### Phase 1: Data & Contracts

**Goal**: Canonical schema for `system_config` and API contracts; no API or UI implementation yet.

**Why**: Backend and UI depend on shared types and DB shape; enum must exist before any audit insert.

**How**:
1. **Step 1.1 (@SysOp)** Add migration `MIGRATIONS/for_sline_app/YYYYMMDD_system_config.sql`:
   - `CREATE TABLE system_config (key text PRIMARY KEY, value jsonb NOT NULL, description text, updated_by uuid, updated_at timestamptz DEFAULT now());`
   - `ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'system_config';`
   - RPC `admin_update_system_config(p_key text, p_value jsonb, p_actor_user_id uuid)`:
     - UPDATE system_config SET value = p_value, updated_by = p_actor_user_id, updated_at = now() WHERE key = p_key;
     - INSERT INTO audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta) VALUES ('admin.system.update_config', p_actor_user_id, 'system_config', p_key, jsonb_build_object('key', p_key, 'value', p_value));
     - Return key or raise.
   - Optional: INSERT default rows for maintenance_mode, app_banner, disable_signups, min_app_version (or separate seed step).
2. **Step 1.2 (@SysOp)** In `packages/shared/src/schemas/settings.ts`: add `GetSystemConfigResponseSchema` (z.array(SystemConfigSchema)), `UpdateSystemConfigBodySchema` (z.object({ key: z.string(), value: z.record(z.unknown()) })). Export from shared index.
3. **Step 1.3 (@SysOp)** Update `MIGRATIONS/README.md`: list `YYYYMMDD_system_config.sql` and note "Copy to sline_app for production."

**Result**: Migration file; extended enum; RPC; shared request/response schemas; README updated.

**Gate 1 — Data/Contracts**: Migration applies without error. Shared schemas export and parse. README lists migration. ✅/❌

---

### Phase 2: Security & RLS

**Goal**: Table and RLS so only service role (and thus API) can read/write; no direct app-user access.

**Why**: system_config is admin-only; app may need to read some keys (e.g. maintenance_mode) via different path later — for this page, API is sole reader/writer.

**How**:
1. **Step 2.1 (@SysOp)** In same migration (or next): enable RLS on `system_config`. Policy: service role only (no SELECT/INSERT/UPDATE for anon/authenticated). If app repo will expose read to app clients later, add separate read-only policy later; for PAGE 13, service-role-only is sufficient.

**Result**: RLS enabled; only service role can access.

**Gate 2 — Security**: RLS enabled; no policy for anon/authenticated write. ✅/❌

---

### Phase 3: Backend APIs

**Goal**: Fastify GET and PATCH for settings; PATCH uses RPC; GET uses service-role select; RBAC and rate limit enforced.

**Why**: SPA must call only these endpoints; audit must be atomic via RPC.

**How**:
1. **Step 3.1 (@SysOp)** Create `apps/api/src/routes/settings.ts`:
   - GET `/api/v1/settings/config`: preHandler `requireAdminRole(['support','moderator','admin','super_admin'])`. Use service-role client: select * from system_config; return body validated with GetSystemConfigResponseSchema.
   - PATCH `/api/v1/settings/config`: preHandler `requireAdminRole(['super_admin'])`; body validated with UpdateSystemConfigBodySchema. Call Supabase RPC `admin_update_system_config(key, value, request.user.id)`. Return 200 with { key } or 4xx on RPC error.
2. **Step 3.2 (@SysOp)** Add rate limit for PATCH (e.g. 5 requests per 60s per user). Return 429 when exceeded.
3. **Step 3.3 (@SysOp)** Register settings routes under `/api/v1/settings` in app (e.g. in `app.ts` or index).

**Result**: GET and PATCH live; audit is atomic via RPC; RBAC and rate limit in place.

**Gate 3 — Backend/API**: 401 without auth; 403 for non–super_admin on PATCH; 200 GET returns array; 200 PATCH creates exactly one audit row; 429 when rate limit exceeded. ✅/❌

---

### Phase 4: ViewModels & API Client (SPA)

**Goal**: admin-ui settings feature uses only HTTP to Fastify; no server-only code; loader provides initial data.

**Why**: Trust boundary; MVVM: view → viewmodel → settings_api (fetch only).

**How**:
1. **Step 4.1 (@AdminArchitect)** In `apps/admin-ui/src/features/settings/services/settings_api.ts`: implement `getSystemConfigs()` → GET /api/v1/settings/config (with credentials). Implement `updateSystemConfig(key, value)` → PATCH /api/v1/settings/config with body { key, value } (with credentials). Use shared types for response/body.
2. **Step 4.2 (@AdminArchitect)** Remove or delete `apps/admin-ui/src/features/settings/services/settings_actions.ts` if it exists; ensure no file in settings feature imports `@/lib/supabase/admin`, `createAdminClient`, or `'use server'`.
3. **Step 4.3 (@AdminArchitect)** Ensure viewmodel uses only settings_api; no direct fetch in view. Initial configs and canManage come from outside (loader).

**Result**: settings_api is the only data path; no server-only code in settings feature.

**Gate 4 (partial) — Security**: Grep: no forbidden imports in apps/admin-ui/src/features/settings. Build passes. ✅/❌

---

### Phase 5: UI Wiring

**Goal**: `/settings` shows System Config UI with real data; loading and error states; only super_admin can edit.

**Why**: User-facing outcome of the page.

**How**:
1. **Step 5.1 (@UIExpert)** Add TanStack Router loader for `/settings`: fetch GET /api/v1/settings/config and auth (e.g. /me or existing auth context). Compute canManage = (role === 'super_admin'). Return { configs, canManage } or throw for error.
2. **Step 5.2 (@UIExpert)** Change Settings route component to use loader data: render `SettingsScreen` with initialConfigs = loaderData.configs, canManage = loaderData.canManage. Show loading state while loader is pending; use route errorElement or error boundary for loader failure.
3. **Step 5.3 (@UIExpert)** Handle empty configs: viewmodel already derives defaults from empty list; ensure SettingsScreen does not crash when configs = [].

**Result**: Navigating to /settings shows maintenance, banner, signups, version; super_admin can toggle; changes persist; loading/error handled.

**Gate 5 — UI/Integration**: Manual or E2E: load /settings → see config; as super_admin change maintenance → refresh → still updated. Non–super_admin sees restricted view. ✅/❌

---

### Phase 6: Testing & QA

**Goal**: Automated tests and docs; release-ready.

**Why**: Regression and compliance.

**How**:
1. **Step 6.1 (@QA)** Add `apps/api/src/routes/settings.test.ts`: 401 for GET/PATCH without auth; 403 for PATCH as support; 200 for GET with admin role; 200 for PATCH as super_admin; assert one new audit_logs row for that key after PATCH; 400 for invalid body; 429 when rate limit exceeded (if feasible).
2. **Step 6.2 (@QA)** Optional: Playwright — login as super_admin, open /settings, toggle maintenance, assert success and GET reflects change.
3. **Step 6.3 (@DataSmith)** Optional: seed or fixture for system_config keys for local/staging.
4. **Step 6.4 (@Doc Keeper)** Update `Docs/ADMIN_DATABASE_REF.md` (or equivalent): list system_config table and RPC; reference migration in MIGRATIONS/for_sline_app.

**Result**: settings.test.ts passes; docs list system_config; optional E2E and seed.

**Gate 6 — Release/QA**: All tests pass; docs updated; no residual "TODO" for settings. ✅/❌

---

## I) Change Report (Diff-Style)

1. **Original issues summary**
   - Phase order allowed API before migration/RPC; atomic audit was not mandated.
   - related_entity_type_enum extension for system_config was not specified.
   - Contracts for GET response and PATCH body were implied, not explicit.
   - Loader vs client fetch for initial data was ambiguous; loading/error/empty not required.
   - settings_actions removal was "ensure/remove" without a definitive delete step.
   - Test infra gate and seed/fixture paths were missing.
   - Rate limit was optional; security matrix not written.
   - Docs update and rollback note were missing.

2. **Added steps**
   - Migration step: ADD VALUE 'system_config' and RPC admin_update_system_config in same file.
   - GetSystemConfigResponseSchema and UpdateSystemConfigBodySchema in shared.
   - Explicit RLS step (Phase 2).
   - Rate limit on PATCH (mandatory).
   - Loader for /settings returning configs + canManage.
   - Loading and error state requirement for UI.
   - settings.test.ts and audit assertion.
   - README and ADMIN_DATABASE_REF update.

3. **Removed steps**
   - None; optional items made explicit (seed, E2E) as optional sub-steps.

4. **Reordered steps**
   - Migration (table + enum + RPC) before any API.
   - Contracts (Phase 1) before Backend (Phase 3).
   - Security/RLS (Phase 2) between Data and Backend.
   - UI after ViewModels/API client.

5. **Expanded steps**
   - Migration: full RPC signature and behavior (UPDATE + INSERT audit).
   - RBAC: explicit role list for GET (support+) and PATCH (super_admin only).
   - Loader: what to fetch and what to return.

6. **Why**
   - To satisfy Plan Critic: execution-safe, repo-verifiable, gate-passable; no ambiguous "should"; atomic audit and enum fix prevent production failures; loader and states prevent UX and duplicate-fetch bugs.

7. **Residual risks**
   - Rate limit implementation detail (in-memory vs Redis) not specified; may need follow-up for multi-instance.
   - App-side consumption of system_config (e.g. Flutter reading maintenance_mode) is out of scope for PAGE 13 but may require a separate read path and policy later.

---

*Assume it will fail. Prove it won’t.*
