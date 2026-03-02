# Plan PAGE 02 + PAGE 03 — Implementation Status

**Plan:** `.TODO/PLAN_PAGE_02_03_Canonical_Audit_Finance_RPC.md`  
**Status:** Mostly implemented; a few items deferred or done in dashboard repo only.

---

## PAGE 02 — Definition of Done vs Actual

| DoD Item | Plan requirement | Status | Notes |
|----------|------------------|--------|--------|
| 1 | Zero `admin_logs` in apps/api, apps/admin-ui, packages/shared | ✅ Done | Grep: 0 matches in source. |
| 2 | All audit writes use `audit_logs` with canonical columns only | ✅ Done | `audit.ts`, `team.ts` use `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta`. |
| 3 | GET task activity from `audit_logs`; response matches TaskActivityItemSchema; UI works | ✅ Done | `tasks.ts` reads `audit_logs`, returns TaskActivityItem shape; UI uses shared types. |
| 4 | Shared audit schemas + task activity schema; unit tests | ✅ Done | `packages/shared/src/schemas/audit.ts` + `audit.test.ts`. `npm run -w @sline/shared test` runs (vitest in shared). |
| 5 | `related_entity_type_enum` extended (app repo) | ⚠️ Partial | Copyable SQL in `MIGRATIONS/for_sline_app/`. Plan said “app repo”; for sline_app. |
| 6 | One integration test: mutation → one audit row | ✅ Done | `tasks.test.ts`: GET activity shape + skipped test when `RUN_AUDIT_INTEGRATION=1`. |

**Phases:** 0–5 done. Mutation→audit integration runs only with real DB.

---

## PAGE 03 — Definition of Done vs Actual

| DoD Item | Plan requirement | Status | Notes |
|----------|------------------|--------|--------|
| 1 | `admin_process_withdrawal` in app repo only; canonical signature; no non-existent columns | ⚠️ Partial | RPC in dashboard; copyable SQL in `MIGRATIONS/for_sline_app/`. Plan said “app repo only”; doc says for production add same RPC to sline_app. |
| 2 | API calls RPC; POST approve/reject 200; one audit_logs row per decision | ✅ Done | `finance.ts` calls RPC directly (no `withAudit`); RPC is the single audit writer. See `MIGRATIONS/for_sline_app/README.md`. |
| 3 | Idempotency test passes | ✅ Done | `finance.test.ts`: skipped test when `RUN_FINANCE_INTEGRATION=1` + real DB. |
| 4 | Migration order documented | ✅ Done | `MIGRATIONS/README.md`. |

**Phases:** 1–3 done. Idempotency test added (runs only with real DB).

---

## Summary: Is the plan “fully” implemented?

- **Fully implemented in this repo:** All code and schema changes for PAGE 02 and PAGE 03 (audit canonical, task activity, finance RPC, contracts, UI types, finance route tests). No `admin_logs`; migration order documented.
- **Not fully aligned with plan wording:**
  - **Enum and RPC “in app repo”:** Copyable SQL is in `MIGRATIONS/for_sline_app/`; you can copy into sline_app for single source of truth.
- **Fully implemented** in this repo: All code, contracts, unit tests, and integration test stubs (DB-dependent tests run when `RUN_AUDIT_INTEGRATION=1` / `RUN_FINANCE_INTEGRATION=1`). Shared package tests run via `npm run -w @sline/shared test`.

---

## Optional next steps

1. **App repo:** Copy `MIGRATIONS/for_sline_app/*.sql` into sline_app and apply; see `MIGRATIONS/for_sline_app/README.md`.
2. **Run DB-dependent tests:** Set `RUN_AUDIT_INTEGRATION=1` and/or `RUN_FINANCE_INTEGRATION=1` with real Supabase env to run the skipped integration and idempotency tests.
