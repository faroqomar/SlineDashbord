# Execution Checklist

## Phase 0. Normalize Evidence And Resolve Drift

- [Verified in dashboard code] Entry criteria: current route and schema inventory is captured, and the active drift points are known: `audit_logs` versus `admin_logs`, missing `admin_users` SQL evidence, and missing analytics or ledger views. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts`.
- [Verified in SQL] Work item: declare `public.audit_logs` canonical and remove dependence on `admin_logs` in dashboard code. Refs: SQL object `public.audit_logs` in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql`; dashboard drift in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts`.
- [Verified in dashboard code] Exit gate: no dashboard route reads or writes `admin_logs`; all audit consumers target canonical audit contracts. Refs: search target `/Users/eros/Dev/Eros_Projects/SlineDashbord` with `rg -n "admin_logs"`.
- [Verified in dashboard code] Rollback note: keep a compatibility adapter layer in the API temporarily if data migration is staged, but do not keep new writes going to `admin_logs`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts`.

## Phase 1. Add Admin Domain Tables And Functions In App Migrations

- [Missing repo evidence] Entry criteria: canonical audit destination is chosen and the list of missing admin SQL objects is approved. Missing objects include `public.admin_users`, `public.vw_admin_journal_ledger`, analytics views, investigation-case tables, and admin RPCs. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_users|vw_admin_journal_ledger|vw_analytics_monthly_revenue|vw_analytics_monthly_user_growth|admin_"`.
- [Missing repo evidence] Work item: add app migrations for `public.admin_users`, investigation-case tables, `public.vw_admin_journal_ledger`, analytics views, and atomic admin RPCs named in `APP_CONTRACTS_REQUIRED_BY_DASHBOARD.md`. Add files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`.
- [Missing repo evidence] Exit gate: every required admin SQL object has a verified migration, and every dangerous mutation has an atomic RPC with audit semantics and idempotency requirements documented in SQL. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "create or replace function .*admin_|create table .*admin_users|create or replace view .*vw_admin_journal_ledger"`.
- [Missing repo evidence] Rollback note: if a migration set needs to be backed out, reverse only the new admin domain objects and keep canonical finance objects intact. Add explicit down-plan notes in the matching migration review.

## Phase 2. Complete Fastify API Routes

- [Verified in dashboard code] Entry criteria: Phase 1 RPCs exist or have stubbed verified SQL definitions. Refs: Fastify routes currently needing RPC upgrades in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`.
- [Verified in dashboard code] Work item: replace direct table mutations with RPC calls, add missing modules for bookings, logs, system health, notifications, support, team listing, chat moderation, settings, exports, and investigations, and require `Idempotency-Key` on dangerous endpoints. Implement under `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` and shared middleware under `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src`.
- [Verified in dashboard code] Exit gate: every admin mutation route is server-only, RPC-backed, server-side RBAC-protected, canonical-audit-writing, and integration-tested. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "from\\('|update\\(|delete\\(|insert\\("` to confirm no remaining direct dangerous writes where RPCs are expected.
- [Verified in dashboard code] Rollback note: preserve old endpoints behind feature flags only if they are read-only; do not roll back to direct mutation handlers for production-dangerous operations.

## Phase 3. Reach Vite SPA Route Parity And Remove Next Leftovers

- [Verified in dashboard code] Entry criteria: Fastify route surface is sufficient to support parity pages. Refs: current missing Vite parity documented in `/Users/eros/Dev/Eros_Projects/SlineDashbord/.chatgpt_context/DASHBOARD_CURRENT_STATE.md`.
- [Verified in dashboard code] Work item: restore missing parity routes, replace server-action remnants with client-safe services, fix TanStack Router typing, and remove legacy Next dependencies from `apps/admin-ui`. Implement under `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src` and delete dead references once parity exists.
- [Verified in dashboard code] Exit gate: `npm run typecheck -w @sline/admin-ui` and `npm run build` pass, and every legacy page has Vite parity or an approved removal note. Refs: repo build scripts in `/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json`.
- [Verified in dashboard code] Rollback note: keep `legacy-source` read-only until parity is proven; do not delete it early.

## Phase 4. Add Manageability Fields And Events In App

- [Verified in SQL] Entry criteria: admin RPC boundaries exist, and dashboard parity work has identified missing entity linkages. Refs: existing linkage keys `related_entity_type`, `related_entity_id` in `public.journal_entries` and `public.audit_logs` from `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql`.
- [Missing repo evidence] Work item: add missing linkage fields and views needed for investigations, including booking-to-conversation linkage if absent, unified timeline sources, explicit reveal events, and action naming normalization. Implement in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` and update affected app services under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features`.
- [Missing repo evidence] Exit gate: every investigation route can resolve user activity, conversations, ledger entries, disputes, and audit history without heuristic joins or implicit naming. Validate with cross-domain fixtures in both repos.
- [Missing repo evidence] Rollback note: additive fields and views are safer than destructive rewrites; if an event taxonomy needs revision, keep backward-compatible aliases during the cutover window.

## Phase 5. Build Investigation Experience

- [Missing repo evidence] Entry criteria: case and grant SQL primitives, reveal logging, and unified timeline sources exist. Search the app migrations with `rg -n "case|grant|reveal|timeline" /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`.
- [Missing repo evidence] Work item: build user-review and case-driven investigation pages covering activity history, grouped conversations by task or booking or direct offer, masked-by-default PII, reveal flows, and chat-moderation actions. Implement in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features` and `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes`.
- [Missing repo evidence] Exit gate: investigators can complete a case workflow without direct SQL access, and access is denied when no case grant exists. Test with role-based and case-grant integration tests.
- [Missing repo evidence] Rollback note: keep reveal actions behind explicit UI affordances and feature flags until audit and access tests are stable.

## Phase 6. Add Observability, Exports, And Dual Approval

- [Verified in dashboard code] Entry criteria: parity routes and investigation primitives are working. Refs: missing observability and export surfaces currently evidenced by legacy pages and absent API routes in `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes`.
- [Missing repo evidence] Work item: add logs UI, system health, export jobs or endpoints, and dual approval for dangerous finance operations. Implement in both repos: SQL approval model in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`, API routes in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes`, and UI routes in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes`.
- [Missing repo evidence] Exit gate: admins can export authorized datasets, operators can observe system health, and finance actions requiring two approvers cannot complete with one actor. Test with end-to-end approval and export scenarios plus observability smoke tests.
- [Missing repo evidence] Rollback note: dual approval should be introduced in a backward-compatible pending state first; if rollback is required, keep the audit trail of partially approved actions.

## Appendix: Search Commands

```bash
rg -n "SUPABASE_SERVICE_ROLE_KEY|service_role|createClient\\(" /Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase /Users/eros/Dev/Eros_Projects/Sline/sline_app/lib
rg -n "admin_logs" /Users/eros/Dev/Eros_Projects/SlineDashbord /Users/eros/Dev/Eros_Projects/Sline/sline_app
rg -n "audit_logs" /Users/eros/Dev/Eros_Projects/SlineDashbord /Users/eros/Dev/Eros_Projects/Sline/sline_app
rg -n "'use server'|\"use server\"|next/cache|from 'next/|from \"next/" /Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src /Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src
rg -n "fastify\\.(get|post|put|patch|delete)\\(" /Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes
rg -n "createRoute\\(|path:" /Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx /Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes
rg -n "createClient\\(|Supabase\\.initialize|Supabase\\.instance\\.client" /Users/eros/Dev/Eros_Projects/SlineDashbord /Users/eros/Dev/Eros_Projects/Sline/sline_app
rg -n "admin_users|vw_admin_journal_ledger|vw_analytics_monthly_revenue|vw_analytics_monthly_user_growth|admin_" /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations
rg -n "case|investigation|chat access|redact_message|delete_message_attachment|reveal|mask" /Users/eros/Dev/Eros_Projects/SlineDashbord /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations
```
