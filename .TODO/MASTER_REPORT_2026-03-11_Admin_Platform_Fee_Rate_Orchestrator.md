# Orchestrator Master Report — Admin Platform Fee Rate

**Workflow:** [.agent/workflows/orchestrator.md](.agent/workflows/orchestrator.md)  
**Feature scope:** Admin-controlled platform fee rate (single source `platform_settings`, Finance edit + Settings mirror, audited RPC).  
**Review date:** 2026-03-11.

---

## 1. Scope Collection

### Feature / page scope and impacted files

| Area | Files |
|------|--------|
| **SQL** | `supabase/migrations/20260311100000_platform_fee_settings.sql`, `supabase/migrations/20260311100001_platform_fee_settings_alter_existing.sql`, `MIGRATIONS/for_sline_app/20260311100000_platform_fee_settings.sql` |
| **Shared contracts** | `packages/shared/src/schemas/finance.ts` (PlatformFeeSettingsSchema, UpdatePlatformFeeSettingsBodySchema) |
| **API** | `apps/api/src/routes/finance/fee-settings.ts`, `apps/api/src/routes/finance.ts` (register) |
| **UI** | `apps/admin-ui/src/features/finance/components/PlatformFeeCard.tsx`, `PlatformFeeEditDialog.tsx`, `apps/admin-ui/src/features/finance/services/finance_api.ts`, `apps/admin-ui/src/routes/Finance.tsx`, `apps/admin-ui/src/features/settings/view/SettingsScreen.tsx` |
| **Tests** | `apps/api/src/routes/finance.test.ts` (GET/PATCH fee-settings) |
| **Docs** | `Docs/CANONICAL_FINANCE_DEPENDENCY_MATRIX.md` |

### Verification commands and outcomes

| Command | Outcome |
|--------|---------|
| `npm run build --workspace=@sline/shared` | Pass |
| `npm run test --workspace=@sline/shared -- --run` | 183 tests passed |
| `npm run test -- --run finance` (apps/api) | 49 passed, 2 skipped (integration) |
| Lint (ReadLints on touched UI/API) | No errors |

---

## 2. Integrity Audit

### Real vs mock wiring

- **Fee settings:** All live. GET reads from `platform_settings` via Supabase (service role); PATCH calls RPC `admin_update_platform_fee_rate`. No mock data.
- **Finance page:** Platform fee card uses `useQuery(['finance', 'fee-settings'], financeApi.getFeeSettings)` and editable dialog calls `financeApi.updateFeeSettings`.
- **Settings page:** Read-only fee card uses same `financeApi.getFeeSettings()` and same query key; no second mutation path.

### API contracts and frontend consistency

- Request/response: **GET** response validated with `PlatformFeeSettingsSchema` (shared). **PATCH** body validated with `UpdatePlatformFeeSettingsBodySchema` (shared). Both from `@sline/shared`.
- UI sends PATCH body as `{ fee_rate_default_bps, reason }`; dialog uses `UpdatePlatformFeeSettingsBodySchema.extend({ fee_rate_default_bps: z.coerce.number()... })` for the form resolver (single source of truth).

### Build / typecheck / lint / test

- Shared: build and tests pass.
- API: finance tests pass (including fee-settings 401/403/400/200).
- No new lint issues in touched files.

### Regressions and design parity

- **Design parity:** Finance = single edit surface; Settings = read-only mirror with “Edit in Finance” link. No duplicate write path.
- **Alter migration:** `20260311100001` adds columns, updates existing row, and inserts a default row when missing (handles both table shapes with/without `value` column). Fixed.

---

## 3. Risk Audit

### Security (auth/RBAC, privilege scope, exposed internals)

- **GET /api/v1/finance/fee-settings:** `requireAdminRole(FINANCE_READ_ROLES)` — support, moderator, admin, super_admin. Read-only; no privilege escalation.
- **PATCH /api/v1/finance/fee-settings:** `requireAdminRole(FINANCE_SUPERADMIN_ROLES)` only. Mandatory reason in body; RPC enforces non-empty reason and writes exactly one `audit_logs` row atomically. No use of `admin_logs` for this path.
- **Service role:** Used only in API (Supabase client in fee-settings route). No Supabase or service role in admin-ui; UI uses central `financeApi` only.
- **Rate limit:** PATCH limited to 5 requests per user per 60s (in-memory map). Adequate for single-instance; multi-instance would need a shared store for strict global limits.

### Data correctness (aggregation, fallbacks, edge cases)

- **GET when no row:** Returns 200 with default `{ fee_rate_default_bps: 1000, max_fee_rate_bps: 2000, updated_at: now(), updated_by: null }`. Schema accepts `updated_by` optional/nullable; response remains valid.
- **RPC:** Validates `p_fee_rate_default_bps` 0–10000 and non-empty `p_reason`; update and `audit_logs` insert in same transaction. Capping by `max_fee_rate_bps` is done in RPC.
- **Remote DB:** Applied via MCP to existing `platform_settings` (with `value` column). SELECT only uses fee columns; RPC INSERT (when no row) includes `value` where required by existing schema.

### Build stability

- No new failing checks. No new deps. No generated-file churn.

---

## 4. Output Template

### Master report (changes, risks, missing items, next actions)

**Changes (summary):**

- SQL: `platform_settings` (singleton or alter), `fn_get_default_fee_rate_bps()`, `admin_update_platform_fee_rate(...)` with atomic `audit_logs`.
- Shared: `PlatformFeeSettingsSchema`, `UpdatePlatformFeeSettingsBodySchema`.
- API: GET/PATCH `/api/v1/finance/fee-settings` with Zod, RBAC, and PATCH rate limit.
- UI: Finance fee card + edit dialog (reason required); Settings read-only fee card + link to Finance.
- Tests: fee-settings 401, 200 GET, 403/400/200 PATCH.
- Docs: Dependency matrix updated with platform fee section.

**Risks (accepted or mitigated):**

- In-memory rate limit: acceptable for current deployment; runbook note in dependency matrix for multi-instance.
- Alter migration (fixed): now inserts default row when missing; runbook note in dependency matrix. Was: “ensure default row exists or run main migration INSERT.”

**Missing items:**

- None.

**Fixes applied (post-review):**

- Dialog form now uses `UpdatePlatformFeeSettingsBodySchema.extend({ fee_rate_default_bps: z.coerce.number()... })` for single source of truth.
- Alter migration now inserts default row when missing (DO block for tables with or without `value` column).
- Dependency matrix updated with alter-migration behavior and runbook note for rate limit (multi-instance).

**Next actions:**

- When ledger/process_payment_event_ledger is updated to use `fn_get_default_fee_rate_bps()` at lock points (booking, direct_offer, task_request), ensure dependency matrix and app repo docs are updated.

---

### Blockers

**None.** No critical or major issues; verification passes.

---

### Final readiness status

**Ready.**

- Critical/major issues: none.
- Verification: shared build + tests, API finance tests, lint clean.
- Security: RBAC and super_admin-only PATCH, atomic audit in RPC, no service role in UI.
- Contracts: GET/PATCH use shared Zod schemas; UI uses same API and same read contract for Finance and Settings.

---

*Generated per [.agent/workflows/orchestrator.md](.agent/workflows/orchestrator.md).*
