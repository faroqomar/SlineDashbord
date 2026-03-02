

⸻

PAGE 01 — Baseline Build & Security Hard Gates (Admin UI + API) done

Goal

Make the dashboard workspace safe to iterate: admin-ui builds, and SPA cannot import server-only Supabase helpers.

Outcome
	•	apps/admin-ui builds + typechecks.
	•	CI/static scan blocks forbidden imports.
	•	No privileged code can slip into the browser bundle.

Scope

UI
	•	Remove/replace all server-action-era leftovers in apps/admin-ui/src/features/**/services/*_actions.ts.
	•	Fix route mismatches in TanStack Router.
	•	Add missing dependency react-day-picker (or remove calendar component if not required).

API
	•	No change required besides keeping typecheck stable.

Contracts
	•	None.

DB
	•	None.

Gates
	•	npm run -w apps/admin-ui build passes.
	•	npm run -w apps/admin-ui typecheck passes.
	•	Forbidden-import scan passes:
	•	No @/lib/supabase/admin
	•	No @/lib/supabase/server
	•	No createAdminClient
	•	No auth.admin
	•	No @/types/supabase
	•	No next/* imports inside apps/admin-ui

Key defects to fix
	•	Unresolved Next-era imports and server-only modules in SPA.
	•	Missing dependency: react-day-picker.
	•	Route mismatches in TanStack router.

Tests
	•	Build + typecheck.
	•	Grep/CI rule.

⸻

PAGE 02 — Canonical Audit: Kill admin_logs Drift (Read + Write)

Goal

Normalize everything on audit_logs canonical schema and remove admin_logs shape from API/UI.

Outcome
	•	No API route reads/writes admin_logs.*.
	•	No API route inserts invalid columns into audit_logs.

Scope

API
	•	Fix apps/api/src/audit.ts (non-atomic withAudit) usage: stop using it for privileged writes.
	•	Update routes reading legacy columns, especially:
	•	/api/v1/tasks/:id/activity (currently expects admin_logs.target_resource etc.)

UI
	•	Any UI screens that depend on “task activity” or “logs”.

DB
	•	If needed, create temporary compatibility view for transition (optional, short-lived).

Contracts
	•	Add packages/shared/src/schemas/audit.ts:
	•	AuditActionEnum
	•	MutationAckSchema
	•	AuditLogRowSchema (matching canonical columns)

Gates
	•	No occurrences of admin_logs in:
	•	apps/api/src/**
	•	apps/admin-ui/src/**
	•	packages/shared/src/**
	•	audit_logs inserts use canonical columns:
	•	actor_user_id, action, related_entity_type, related_entity_id, meta

Key defects to fix
	•	withAudit() is non-atomic + wrong legacy columns.
	•	Team invite writes wrong audit columns.
	•	Task activity route reads legacy admin_logs fields.

Tests
	•	Unit tests for audit schema parsing.
	•	Integration test: a mutation must also create an audit row (or fail).

⸻

PAGE 03 — Fix Finance RPC Drift: admin_process_withdrawal + Withdrawal Columns

Goal

Make approve/reject withdrawal work reliably against canonical app schema.

Outcome
	•	POST /api/v1/finance/withdrawals/:requestId/approve works.
	•	POST /api/v1/finance/withdrawals/:requestId/reject works.
	•	No runtime mismatch between RPC args/columns.

Scope

DB (App repo owns truth)
	•	Move admin_process_withdrawal out of dashboard migration into app migrations.
	•	Fix signature to match the API contract (choose one canonical naming).
	•	Fix columns used inside RPC:
	•	remove processed_by / admin_notes unless you add them canonically to withdrawal_requests.

API
	•	Align Fastify call to the canonical signature.

Contracts
	•	Ensure ApproveWithdrawalSchema/RejectWithdrawalSchema match canonical.

Gates
	•	RPC call succeeds in staging without “unknown argument” errors.
	•	Approve/reject updates correct status and timestamps.
	•	Exactly one audit_logs row is written atomically per decision.

Key defects to fix
	•	Argument name drift: p_withdrawal_id/p_action vs p_request_id/p_decision
	•	Column drift: RPC writes columns not present in canonical ledger schema.

Tests
	•	Integration tests for approve/reject.
	•	Idempotency test (repeat request with same key must not double-process).

⸻

PAGE 04 — Admin Identity Domain: admin_users (Source of Truth)

Goal

Create canonical admin_users in the app repo, so RBAC and admin auth stop being “untracked dependency”.

Outcome
	•	admin_users exists as app-owned SQL migration.
	•	RBAC works consistently across environments.

Scope

DB
	•	Add /sline_app/supabase/migrations/*_admin_users.sql
	•	id references auth.users
	•	role enum: support|moderator|admin|super_admin
	•	status/created_at
	•	RLS enabled (service-role writes)

API
	•	RBAC middleware reads from canonical admin_users.

Contracts
	•	Add packages/shared/src/schemas/auth.ts with AdminRoleEnum (canonical).

Gates
	•	Admin login works and GET /api/v1/auth/me returns correct role.
	•	RBAC tests: support cannot do admin-only actions.

Key defects to fix
	•	admin_users missing SQL source of truth.

Tests
	•	RBAC integration tests: 401/403 paths and success path.

⸻

PAGE 05 — Fix User Moderation: Ban/Suspend Must Target Marketplace Users (Not admin_users)

Goal

Implement canonical moderation state for marketplace users.

Outcome
	•	/api/v1/users/:userId/ban bans a real user.
	•	/api/v1/users/:userId/unban unbans a real user.
	•	/api/v1/users/:userId/suspend (new) works.

Scope

DB (decision)
Pick canonical moderation storage:
	•	Option A (recommended): extend profiles with:
	•	account_status, moderation_reason, moderated_at, moderated_by_admin_id, restriction_scope
	•	Option B: create user_restrictions table.

API
	•	Replace current ban/unban implementation that mutates admin_users.
	•	Ensure audit is atomic.

Contracts
	•	Ensure BanUserSchema, SuspendUserSchema etc map to new model.

Gates
	•	Banned user can’t operate in app (server enforcement via RLS / app logic).
	•	Audit row exists for ban/unban/suspend.

Key defects to fix
	•	Current ban/unban changes the wrong table.

Tests
	•	Integration tests for ban/unban/suspend.
	•	RLS behavior tests (user can’t post tasks when banned).

⸻

PAGE 06 — Force Logout / Session Revocation

Goal

Admins can force logout a user.

Outcome
	•	POST /api/v1/users/:userId/force-logout works.
	•	User must re-authenticate immediately.

Scope

DB + Auth strategy
	•	Add a session_version or revoked_at mechanism.
	•	Decide enforcement:
	•	App reads profiles.force_logout_after and blocks, or
	•	Use Supabase Auth admin API if possible and track state in DB.

API
	•	Add endpoint.
	•	Audit.

Contracts
	•	ForceLogoutInputSchema.

Gates
	•	User token becomes invalid/blocked for app operations.
	•	Audit written.

Tests
	•	E2E: login as user, admin force logout, user request fails.

⸻

PAGE 07 — Bookings Admin Plane (List + Detail + Cancel + Refund)

Goal

Bring bookings under admin control (moderation + refunds).

Outcome
	•	/bookings, /bookings/$bookingId UI exists.
	•	/api/v1/bookings/* exists.
	•	Cancel/refund flows work.

Scope

API
	•	Add apps/api/src/routes/bookings.ts.
	•	Use existing booking RPCs where possible (rpc_finalize_booking_refund etc) or create admin wrapper RPCs.

UI
	•	Add routes and pages.

Contracts
	•	packages/shared/src/schemas/bookings.ts.

DB
	•	If admin RPCs missing: add in app migrations.

Gates
	•	List + detail works.
	•	Cancel writes audit atomically.
	•	Refund is idempotent.

Tests
	•	Integration: cancel/refund.
	•	Playwright: cancel flow.

⸻

PAGE 08 — Cases Domain (Case Management Core)

Goal

Introduce admin case management (required for chat access gating).

Outcome
	•	/cases, /cases/$caseId UI works.
	•	/api/v1/cases/* works.
	•	admin_cases tables exist.

Scope

DB
	•	admin_cases, admin_case_entities.

API
	•	apps/api/src/routes/cases.ts.

UI
	•	/cases routes.

Contracts
	•	packages/shared/src/schemas/cases.ts.

Gates
	•	Create case, attach entity works.
	•	Audit written per action.

Tests
	•	Integration: create case + attach entity.

⸻

PAGE 09 — Chat Moderation with Case-Gated Access

Goal

Admins can view chats only through a case, and every view is logged.

Outcome
	•	/chat/threads/$threadId exists.
	•	/api/v1/chat/* exists.
	•	No thread content without case_id.

Scope

DB
	•	admin_chat_access_logs + optional helper functions.
	•	PII masking baseline.

API
	•	apps/api/src/routes/chat.ts.

UI
	•	Thread viewer page.

Contracts
	•	packages/shared/src/schemas/chat.ts with masked/full DTOs.

Gates
	•	Deny without case.
	•	Allow with case and role.
	•	Every view logs access.

Tests
	•	Integration: denied/allowed.
	•	Playwright: open thread via case.

⸻

PAGE 10 — Reports Queue (Tasks/Users/Chats Reports)

Goal

Build moderation queue workflow.

Outcome
	•	/reports exists.
	•	/api/v1/reports/* exists.
	•	DB tables exist.

Scope

DB + API + UI + shared schemas.

Gates
	•	Can triage report -> action -> close.
	•	Audit for triage actions.

Tests
	•	Integration: report triage.

⸻

PAGE 11 — Global Search

Goal

Search everything quickly.

Outcome
	•	/search exists.
	•	/api/v1/search exists.
	•	AdminGlobalSearchResultSchema exists.

Scope

API + UI + shared schemas + indexes.

Gates
	•	Search returns users/tasks/bookings/disputes/transactions.
	•	p95 < 500ms in staging-sized data.

Tests
	•	Integration: query returns expected entity types.

⸻

PAGE 12 — Finance: Transaction Detail + Audit Export + User Lookup

Goal

Finish finance parity with legacy.

Outcome
	•	GET /api/v1/finance/transactions/:journalId exists.
	•	/finance/audit exists.
	•	/finance/users/$userId exists.
	•	CSV export exists via Fastify.

Gates
	•	Export matches list filters.
	•	Masked data by default, reveal requires audit.

Tests
	•	Export test + role gating.

⸻

PAGE 13 — Settings / System Config + Feature Flags

Goal

Make settings authoritative.

Outcome
	•	system_config exists in app repo.
	•	/settings uses real endpoints.

Gates
	•	Update config writes audit.
	•	No direct DB writes from SPA.

⸻

PAGE 14 — Observability / System Health

Goal

Replace legacy system health page with Fastify-backed observability.

Outcome
	•	/system-health
	•	/api/v1/observability

Gates
	•	Health shows DB connectivity, RPC availability, queue status, error rates.

⸻

PAGE 15 — User Investigation Page (Your “Deep User Review” Requirement)

Goal

One page that shows EVERYTHING about a user: posts, actions, transactions, and chats (case gated).

Outcome
	•	/users/$userId/investigation exists.
	•	Endpoints return a full aggregated graph.

Gates
	•	PII masked by default.
	•	Chat content requires case.
	•	Evidence-pack export exists.

⸻

PAGE 16 — Dual Approval (Dangerous Ops Control)

Goal

No single admin can do catastrophic finance operations.

Outcome
	•	admin_approvals exists.
	•	Approval queue UI exists.
	•	API enforces 2-person approval for:
	•	wallet adjust
	•	reversals
	•	large refund override

Gates
	•	Attempting dangerous op without approval fails.
	•	Approvals write audit.

⸻

PAGE 17 — Route Parity Complete + Remove legacy-source

Goal

Delete Next completely.

Outcome
	•	All legacy pages have Vite/Fastify parity.
	•	legacy-source removed safely.

Gates
	•	Parity matrix is all ✅
	•	Playwright suite passes.

⸻

How to use this list

ابدأ من PAGE 01 وامشي تسلسل.
كل ما تخلص صفحة، سوّي commit بعنوان واضح:
feat(admin): <page name>



# System Overview

**Audit scope**

- [Verified in dashboard code] This audit treats `/Users/eros/Dev/Eros_Projects/Sline/sline_app` and `/Users/eros/Dev/Eros_Projects/SlineDashbord` as one operational system: the Flutter marketplace is the production app surface, and the dashboard monorepo is the intended privileged admin plane. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart)
- [Verified in dashboard code] The dashboard monorepo exists at `/Users/eros/Dev/Eros_Projects/SlineDashbord` with `apps/admin-ui`, `apps/api`, and `packages/shared`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json)
- [Verified in dashboard code] One dashboard-side migration exists at `/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql)
- [Verified in dashboard code] The old Next dashboard source remains under `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source` and is still the only repo-verifiable source for several page inventories and server-action patterns. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard)
- [Verified in dashboard code] `apps/api` currently typechecks, but `apps/admin-ui` does not currently build because the SPA still contains unresolved Next-era imports, missing dependencies such as `react-day-picker`, and migration leftovers that reference removed server-only modules. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts)
- [Verified in app code] App-side schema evidence is split: foundational schema and many RLS policies are documented in `SUPABASE_SETUP.md`, while the ledger, wallet, booking authority, and direct-offer hardening live in migrations. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql)
- [Verified in dashboard code] Cross-repo drift is already present: app docs still describe `admin_logs`, ledger migrations create `audit_logs`, dashboard API/UI mixes both, dashboard auth expects `admin_users`, and the app repo does not contain repo-verified SQL that creates `admin_users`. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts)

**Evidence scope**

- [Verified in SQL] In this report, `Verified in SQL` means "verified in repository SQL migrations or SQL-adjacent setup docs only"; it does not prove the same object is deployed in the live Supabase project. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql)
- [Missing repo evidence] Deployed-schema reality is not repo-verifiable in this audit because there is no live schema dump, `supabase db dump`, or checked-in production DDL snapshot. Search next in a committed Supabase schema export or deployment artifact. References: Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase`

**Locked migration facts**

- [Verified in dashboard code] Dashboard monorepo exists in `/Users/eros/Dev/Eros_Projects/SlineDashbord` with `apps/admin-ui`, `apps/api`, and `packages/shared`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json)
- [Verified in dashboard code] One dashboard-side migration exists at `/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql)
- [Verified in dashboard code] Old Next dashboard exists under `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source)
- [Verified in dashboard code] `apps/api` currently typechecks successfully. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts)
- [Verified in dashboard code] `apps/admin-ui` does not currently build because unresolved imports point at removed Next-era modules, TanStack route parity is incomplete, `react-day-picker` is referenced but not declared in dependencies, and SPA files still contain server-action-era code paths. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx)
- [Verified in dashboard code] Current reachable Vite routes are `/`, `/login`, `/users`, `/users/$userId`, `/tasks`, `/tasks/$taskId`, `/disputes`, `/disputes/$disputeId`, `/finance`, `/finance/transactions`, `/finance/withdrawals`, `/settings`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx)
- [Verified in dashboard code] Legacy Next pages missing Vite parity include complaints/support, logs, team, notifications, system health, finance audit, and finance user lookup. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx)
- [Verified in app code] App-side canonical schema evidence is split between `SUPABASE_SETUP.md` and the repo migrations for ledger/direct-offer/booking-payment hardening. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql)
- [Verified in dashboard code] Cross-repo schema drift is already verified: app docs describe `admin_logs`, ledger migrations create and use `audit_logs`, dashboard API/UI mixes `admin_logs` and `audit_logs`, dashboard expects `admin_users`, and the app repo lacks repo-verified SQL source of truth for `admin_users`. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts)

**Trust boundaries**

| Boundary | Evidence | Current state | References |
| --- | --- | --- | --- |
| Flutter app -> Supabase Auth/Postgres/Realtime/Storage | Verified in app code | The mobile app uses the public anon key and direct Supabase sessions; normal user operations run client-side under RLS. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart) |
| Admin SPA -> Supabase Auth | Verified in dashboard code | The current login flow signs in with the browser anon client, then exchanges the access token for a Fastify cookie session. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/supabase.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/supabase.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts) |
| Admin SPA -> Fastify API | Verified in dashboard code | The intended admin surface is `/api/v1/*` via cookie-authenticated REST requests. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/api.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/api.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts) |
| Fastify API -> Supabase service-role client | Verified in dashboard code | The server uses `SUPABASE_SERVICE_ROLE_KEY` in `apps/api` for RBAC-guarded admin reads and writes. This is the correct trust boundary for privileged operations. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts) |
| Admin SPA -> server-only Supabase admin helpers | Verified in dashboard code | This boundary is currently violated by migration leftovers inside `apps/admin-ui` that still import `@/lib/supabase/admin` and `@/lib/supabase/server`. Those imports are not valid in the Vite target and would be a security defect if restored in-browser. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts) |
| Postgres financial core -> audit trail | Verified in SQL | Ledger RPCs write `audit_logs` atomically in the same function body; this is the correct pattern that privileged admin mutations should follow. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260307_fix_ledger_event_type_enum.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260307_fix_ledger_event_type_enum.sql) |
| Postgres privileged admin domain | Missing repo evidence | There is no repo-verified app-side SQL for `admin_users`, cases, chat-access logs, PII reveal logs, reports, dual approvals, or general admin action RPCs beyond narrow finance helpers. Search next in historical base migrations, Supabase SQL dump, or live project schema. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` for `admin_users`, `admin_cases`, `admin_notes`, `reports`, `admin_pii_access_logs`, `admin_chat_access_logs` |

**Session models**

- [Verified in app code] App session model: the Flutter app initializes `Supabase.initialize(...)` with the anon key and then relies on the user JWT for direct table/RPC access under RLS. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/core/services/supabase_config.dart)
- [Verified in dashboard code] Admin session model: the browser uses the anon client only for login, then exchanges the access token for the `sb_session` HttpOnly cookie through `POST /api/v1/auth/session`; Fastify does not keep a separate server-side session store in repo code, and instead re-verifies the cookie-carried token on each request via `supabase.auth.getUser(token)` before reading `admin_users.role`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts)
- [Verified in dashboard code] Trust rule: the service-role key is present only in `apps/api`; `apps/admin-ui` itself only declares `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/supabase.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/supabase.ts)
- [Missing repo evidence] JWT verification key-management strategy, JWKS usage, and token-rotation plan are not documented in repo code; the current implementation relies on Supabase token introspection via `auth.getUser(token)`, but there is no checked-in operational policy for secret rotation or offline JWT verification. Search next in deployment manifests, runbooks, or infrastructure docs. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts), Missing files under `/Users/eros/Dev/Eros_Projects/SlineDashbord`

# Verified Inventory

**Sline_App feature inventory**

| Feature | Evidence | Current purpose | References |
| --- | --- | --- | --- |
| Tasks | Verified in app code | Client-side task listing, creation, update, and status changes run directly against `public.tasks`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart) |
| Task offers/bids | Verified in app code | Tender offers are created, replaced, accepted, and queried via `public.task_requests` plus RPC wrappers such as `replace_task_request`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_requests_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_requests_service.dart) |
| Bookings | Verified in app code | Booking reads and state changes run through `public.bookings`, while payment events use the ledger RPC. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart) |
| Chat | Verified in app code | Conversations, DM/task-linked chat creation, archival, attachment access, and realtime message flows are implemented around `public.conversations` and `public.messages`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart) |
| Direct offers | Verified in app code | Direct-offer lifecycle and payment orchestration are implemented in the mobile app and backed by direct-offer SQL/RLS hardening. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/direct_offers/services/direct_offers_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/direct_offers/services/direct_offers_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql) |
| Wallet and ledger | Verified in app code | Wallet activity and balances are read from SQL views; withdrawals and releases use `process_payment_event_ledger`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/wallet/services/wallet_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/wallet/services/wallet_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql) |
| Work logs | Verified in app code | `public.work_logs` is used as a timeline/event stream for tasks, bookings, and direct offers. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/management/services/work_log_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/management/services/work_log_service.dart) |
| Notifications | Verified in app code | Notifications are treated as server-created and client read/update only. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/notifications/services/notification_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/notifications/services/notification_service.dart) |
| Unified work/dashboard | Verified in app code | The app dashboard consumes `vw_unified_work_items` and merges direct offers for user-facing activity summaries. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/data/dashboard_repository.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/data/dashboard_repository.dart) |
| Disputes | Missing repo evidence | Disputes are clearly present in documented DB shape and the dashboard admin plane, but the mobile-client integration is not clearly implemented or discoverable in the current Flutter repo snapshot. Search next in removed Flutter modules or live product branches. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/view/booking_details_screen.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/view/booking_details_screen.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/services/dashboard_permission_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/services/dashboard_permission_service.dart) |
| Support tickets | Missing repo evidence | Dedicated Flutter support-ticket services were not found in the current app feature tree even though tables are documented and the dashboard queries them. Search next in archived mobile modules or live project schema dump. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts) |

**Sline_App DB object inventory**

| DB object | Evidence | Current state | References |
| --- | --- | --- | --- |
| `profiles` | Verified in app code | Queried across task, dashboard, and profile-summary flows; foundational SQL DDL is documented but not present as a base migration in the repo snapshot. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/data/dashboard_repository.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/dashboard/data/dashboard_repository.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `tasks` | Verified in app code | Queried and mutated by the mobile task service; documented in `SUPABASE_SETUP.md`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `task_requests` | Verified in app code | Queried and mutated by the mobile offers service; documented in `SUPABASE_SETUP.md`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_requests_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/tasks/services/task_requests_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `conversations` | Verified in app code | Used by the chat service for DM and task-linked thread creation and lookup. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `messages` | Verified in app code | Used by the chat service and attachment logic; foundational SQL is documented and attachment helpers are migrated. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql) |
| `bookings` | Verified in app code | Used by the booking service and booking authority RPCs. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql) |
| `direct_offers` | Verified in SQL | Table, RLS, guard trigger, updated-at trigger, and work-log participant helper are in the repo. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql) |
| `work_logs` | Verified in app code | Used as a timeline/event store; docs describe indexes and participant policies. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/management/services/work_log_service.dart](/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/management/services/work_log_service.dart), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_add_management_work_logs_scope_index.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_add_management_work_logs_scope_index.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `support_tickets` | Verified in dashboard code | Admin support actions query this table, but app-side foundational SQL is only documented. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `ticket_messages` | Verified in dashboard code | Admin support actions query and insert ticket messages, but app-side foundational SQL is only documented. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `disputes` | Verified in dashboard code | Admin API and legacy actions query and update disputes, but no app-side SQL DDL is present in current migrations. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/disputes/services/dispute_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/disputes/services/dispute_actions.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `dispute_messages` | Verified in dashboard code | Joined by the dispute detail API route; app-side base migration is not in the repo. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `dispute_evidence` | Verified in dashboard code | Joined by the dispute detail API route; app-side base migration is not in the repo. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| `withdrawal_requests` | Verified in SQL | Canonical ledger-side withdrawal table exists with RLS and timestamp trigger. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql) |
| `accounts` | Verified in SQL | Canonical ledger account table exists. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| `journal_entries` | Verified in SQL | Canonical journal header table exists with entity linkage fields and idempotency key. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| `ledger_lines` | Verified in SQL | Canonical ledger line table exists with append-only constraints and RLS. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql) |
| `audit_logs` | Verified in SQL | Canonical repo-verified audit table exists, but it is currently scoped and described as payment-related, not yet a complete general admin audit domain. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql) |

**Sline_App RPCs, views, triggers, and RLS**

| Object | Evidence | Current state | References |
| --- | --- | --- | --- |
| `process_payment_event_ledger` | Verified in SQL | Canonical payment engine with idempotency and atomic `audit_logs` inserts. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260307_fix_ledger_event_type_enum.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260307_fix_ledger_event_type_enum.sql) |
| `rpc_create_booking_draft_validated` | Verified in SQL | Booking-draft creation is server-authoritative. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_remove_booking_slot_dependency.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_remove_booking_slot_dependency.sql) |
| `rpc_finalize_booking_refund` | Verified in SQL | Booking refund finalization exists as a dedicated RPC. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql) |
| `rpc_submit_delivery` | Verified in SQL | Delivery submission RPC exists and has booking-transition fixes. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260224_fix_rpc_submit_delivery_booking_transition.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260224_fix_rpc_submit_delivery_booking_transition.sql) |
| `rpc_approve_delivery` | Verified in SQL | Delivery approval RPC exists and has follow-up review-expiry and digest fixes. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260224_fix_rpc_approve_delivery_digest_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260224_fix_rpc_approve_delivery_digest_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_fix_rpc_approve_delivery_review_expiry.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_fix_rpc_approve_delivery_review_expiry.sql) |
| `search_profiles` | Verified in SQL | Safe profile search RPC exists and is explicitly permission-scoped. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_fix_search_profiles_safe_summary.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_fix_search_profiles_safe_summary.sql) |
| `rpc_get_profile_summaries` | Verified in SQL | Safe batched profile-summary RPC exists. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_create_rpc_get_profile_summaries.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_create_rpc_get_profile_summaries.sql) |
| `archive_conversation_v1` | Verified in SQL | Conversation archive RPC exists. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql) |
| `can_access_chat_attachment` | Verified in SQL | Attachment access helper exists for private chat-storage objects. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql) |
| `award_task_offer`, `pay_awarded_offer`, `get_client_awarded_unpaid_offers`, `get_freelancer_awarded_unpaid_offers` | Verified in SQL | Tender-award/payment RPCs exist. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260226_tender_award_payment_flow.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260226_tender_award_payment_flow.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_reconcile_orders_owner_contract.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260301_reconcile_orders_owner_contract.sql) |
| `vw_wallet_balances_user`, `vw_wallet_activity_user`, `vw_financial_metrics_realtime`, `vw_unified_work_items` | Verified in SQL | Wallet and dashboard views exist. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| Ledger append-only triggers | Verified in SQL | Ledger tables are explicitly frozen behind RPCs and append-only semantics. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_freeze_wallet_transactions.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_freeze_wallet_transactions.sql) |
| Withdrawal timestamp trigger | Verified in SQL | `update_withdrawal_requests_updated_at()` exists and the table is wired for `updated_at`. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| Direct-offer guard trigger | Verified in SQL | Direct-offer status/payment transitions are validated by trigger. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260306_direct_offer_guard_accept_to_active.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260306_direct_offer_guard_accept_to_active.sql) |
| Booking notification trigger | Missing repo evidence | `SUPABASE_SETUP.md` documents notification triggers, but the repo snapshot does not include the base migration that creates the booking-notification trigger body. Search next in the initial Supabase bootstrap migration or production SQL dump. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| Foundational RLS for `profiles`, `tasks`, `task_requests`, `conversations`, `messages`, `bookings`, `work_logs` | Missing repo evidence | Policy definitions are documented in `SUPABASE_SETUP.md`, but the originating base migration files are not present in the current repo snapshot. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |

**SlineDashboard inventory**

| Object | Evidence | Current purpose | References |
| --- | --- | --- | --- |
| Fastify auth routes | Verified in dashboard code | `POST /api/v1/auth/session`, `POST /api/v1/auth/logout`, and `GET /api/v1/auth/me` implement token exchange and cookie session introspection. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts) |
| Fastify user routes | Verified in dashboard code | `GET /api/v1/users`, `GET /api/v1/users/:userId`, `POST /api/v1/users/:userId/ban`, `POST /api/v1/users/:userId/unban` exist, but the mutation targets are incorrect for normal marketplace users. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts) |
| Fastify task routes | Verified in dashboard code | `GET /api/v1/tasks`, `GET /api/v1/tasks/:id`, `GET /api/v1/tasks/:id/activity`, `POST /api/v1/tasks/:id/status` exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts) |
| Fastify dispute routes | Verified in dashboard code | `GET /api/v1/disputes`, `GET /api/v1/disputes/:id`, `POST /api/v1/disputes/:id/resolve` exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts) |
| Fastify finance routes | Verified in dashboard code | `POST /api/v1/finance/withdrawals/:requestId/approve`, `POST /api/v1/finance/withdrawals/:requestId/reject`, `POST /api/v1/finance/wallets/:userId/freeze`, `GET /api/v1/finance/metrics`, `GET /api/v1/finance/transactions`, `GET /api/v1/finance/withdrawals` exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts) |
| Fastify team routes | Verified in dashboard code | `POST /api/v1/team/invite` and `DELETE /api/v1/team/:userId` exist; list and role-update routes are missing. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Fastify dashboard routes | Verified in dashboard code | `GET /api/v1/dashboard/overview` exists and reads dashboard metrics plus recent audit activity. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts) |
| Fastify auth/RBAC core | Verified in dashboard code | Token verification reads `admin_users.role`; route middleware is simple allow-list RBAC. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/middleware/rbac.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/middleware/rbac.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts) |
| Fastify audit helper | Verified in dashboard code | `withAudit()` is non-atomic and still writes to legacy `admin_logs` columns. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts) |
| Current Vite routes | Verified in dashboard code | Reachable route tree is limited to `/`, `/login`, `/users`, `/users/$userId`, `/tasks`, `/tasks/$taskId`, `/disputes`, `/disputes/$disputeId`, `/finance`, `/finance/transactions`, `/finance/withdrawals`, `/settings`. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx) |
| Current Vite page files | Verified in dashboard code | Only dashboard, users, tasks, disputes, finance, settings, and login route files exist under `apps/admin-ui/src/routes`. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes) |
| Legacy Next pages | Verified in dashboard code | The old page inventory still covers complaints/support, logs, team, notifications, system health, finance audit, finance users, and the current parity pages. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx) |
| Legacy Next server actions | Verified in dashboard code | The old Next app still contains server actions for analytics, auth, team, disputes, users, logs, health, support, finance queries/mutations, tasks, and settings. These are the migration source-of-truth for feature coverage. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/analytics/services/analytics_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/analytics/services/analytics_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/team/services/team_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/team/services/team_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/disputes/services/dispute_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/disputes/services/dispute_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/logs/services/log_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/logs/services/log_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/core/services/health_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/core/services/health_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/support/services/support_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/tasks/services/task_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/tasks/services/task_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/settings/services/settings_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/settings/services/settings_actions.ts) |
| Legacy route handler | Verified in dashboard code | The old Next app still has `GET /api/finance/export-audit` as a route handler for CSV export. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts) |
| Shared schemas present today | Verified in dashboard code | Present shared schema files are `analytics.ts`, `disputes.ts`, `finance.ts`, `logs.ts`, `settings.ts`, `support.ts`, `tasks.ts`, `team.ts`, `users.ts`. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/index.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas) |
| Vite migration leftovers in SPA | Verified in dashboard code | `apps/admin-ui` still contains server-action-era files that import `@/lib/supabase/admin`, `@/lib/supabase/server`, and `@/types/supabase`; these are not valid final-state Vite architecture. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/analytics/services/analytics_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/analytics/services/analytics_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts) |

# Gap Analysis

**Confirmed high-severity defects**

| Defect | Evidence | Impact | References |
| --- | --- | --- | --- |
| `admin_process_withdrawal` parameter contract drift | Verified in dashboard code | The only repo-verified SQL function takes `p_withdrawal_id` and `p_action`, but the API and legacy code call it with `p_request_id` and `p_decision`; this is a runtime failure unless an untracked live DB variant exists. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts) |
| `admin_process_withdrawal` updates non-existent columns | Verified in SQL | The dashboard migration writes `processed_by` and `admin_notes`, but the repo-verified `withdrawal_requests` table only contains `processed_at`, `meta`, and base gateway fields. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| Fastify `withAudit()` is non-atomic and writes legacy columns | Verified in dashboard code | Blocking defect: privileged mutations can succeed while audit insertion fails, and the helper still writes `admin_logs`-style fields (`actor_id`, `target_resource`, `target_id`, `metadata`) that do not match canonical `audit_logs`. No privileged mutation should ship on this path. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| Team invite route writes invalid `audit_logs` columns | Verified in dashboard code | `apps/api/src/routes/team.ts` inserts `actor_id`, `entity_type`, `entity_id`, and `metadata` into `audit_logs`, but the repo-verified table uses `actor_user_id`, `related_entity_type`, `related_entity_id`, and `meta`. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| User ban/unban API mutates `admin_users`, not marketplace-user state | Verified in dashboard code | `POST /api/v1/users/:userId/ban` and `/unban` update `admin_users`, which is the admin whitelist table, not the core marketplace user/account state. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts) |
| Task activity route still depends on `admin_logs` legacy shape | Verified in dashboard code | `GET /api/v1/tasks/:id/activity` reads `admin_logs.target_resource`, `target_id`, and `actor_id`, which do not match the repo-verified `audit_logs` schema. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| Server-only Supabase imports remain in the SPA | Verified in dashboard code | Blocking defect: `apps/admin-ui` still contains imports of `@/lib/supabase/admin`, `@/lib/supabase/server`, and related server-only helpers. Even though the current SPA does not build, these imports must be treated as forbidden and enforced by CI so no privileged Supabase path can re-enter the browser bundle. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts) |

**Missing in dashboard**

| Gap | Evidence | What is missing | References |
| --- | --- | --- | --- |
| Support parity | Verified in dashboard code | No Vite `/support` route and no Fastify support routes exist, even though legacy support actions and pages exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/support/services/support_actions.ts) |
| Logs parity | Verified in dashboard code | No Fastify `/api/v1/logs` routes and no Vite `/logs` route exist; only legacy Next actions/pages and leftover SPA services exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/logs/services/log_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/logs/services/log_actions.ts) |
| Team parity | Verified in dashboard code | No team list route, no Vite `/team`, and no Fastify role-update endpoint exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx) |
| Notifications parity | Verified in dashboard code | No Vite `/notifications` route and no Fastify notifications route exist, despite a legacy page and leftover SPA service. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/notifications/services/notification_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/notifications/services/notification_actions.ts) |
| System-health parity | Verified in dashboard code | No Fastify observability/health route beyond `/health`, and no Vite `/system-health` route exist; only legacy and leftover health actions exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/services/health_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/services/health_actions.ts) |
| Finance audit parity | Verified in dashboard code | No Vite `/finance/audit` route and no Fastify audit-export route exist, although legacy Next has both a page and a route handler. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts) |
| Finance user lookup parity | Verified in dashboard code | No Vite `/finance/users/$userId` route and no Fastify finance user-lookup endpoint exist, despite legacy query code and page coverage. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts) |
| Booking moderation UI/API | Verified in dashboard code | There is no `/api/v1/bookings` route file and no Vite bookings pages. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/bookings.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Bookings.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/BookingDetail.tsx` |
| Chat moderation UI/API | Verified in dashboard code | There is no `/api/v1/chat` route file, no Vite chat-thread viewer, and no admin-side case-gated thread access flow. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/ChatThread.tsx` |
| Reports queue UI/API | Verified in dashboard code | No reports routes, no reports page, and no shared reports schemas exist. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/reports.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Reports.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/reports.ts` |
| Case management UI/API | Verified in dashboard code | No case routes, no case pages, and no shared case schemas exist. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/cases.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Cases.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts` |
| Global search UI/API | Verified in dashboard code | No Fastify `/api/v1/search`, no `/search` route, and no shared search schema exists. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/search.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Search.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/search.ts` |
| Exports | Verified in dashboard code | CSV export only exists in a legacy Next route handler and ad hoc server actions; there is no Fastify export surface. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/mutations.ts) |
| Observability widgets | Verified in dashboard code | Dashboard overview is limited to summary stats; no Fastify `/api/v1/observability` surface or dedicated widgets for payment failures, fraud spikes, or auth anomalies exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts), Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/observability.ts` |
| User Investigation view | Verified in dashboard code | No `/users/$userId/investigation` route or corresponding API endpoints exist. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserInvestigation.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/cases.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts` |
| Finance transaction detail API parity | Verified in dashboard code | The SPA calls `GET /api/v1/finance/transactions/:journalId`, but Fastify does not implement it. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts) |

**Legacy parity matrix**

| Legacy surface | Evidence | Vite route | Fastify/API parity | Shared schema parity | Status | Blocking reason / references |
| --- | --- | --- | --- | --- | --- | --- |
| Support / complaints | Verified in dashboard code | Missing `/support` route | Missing support routes | `support.ts` exists | Blocked | UI and API parity both missing. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx), Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/support.ts`, [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx) |
| Logs | Verified in dashboard code | Missing `/logs` route | Missing `/api/v1/logs` | `logs.ts` exists | Blocked | No Vite route or Fastify route. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx), Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/logs.ts`, [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx) |
| Team | Verified in dashboard code | Missing `/team` route | Partial: invite/delete only | `team.ts` exists | Partial | List/update-role parity missing. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Notifications | Verified in dashboard code | Missing `/notifications` route | Missing notifications routes | Missing repo evidence for canonical shared contract | Blocked | Legacy page exists but parity route/API missing. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/notifications/services/notification_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/notifications/services/notification_actions.ts) |
| System health | Verified in dashboard code | Missing `/system-health` route | Missing `/api/v1/observability` and health detail routes | Missing repo evidence for observability contract | Blocked | Only `/health` exists in Fastify. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts) |
| Finance audit | Verified in dashboard code | Missing `/finance/audit` route | Missing export/audit API parity | `finance.ts` exists but not export contract | Blocked | Legacy page and route handler exist only in Next. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts) |
| Finance user lookup | Verified in dashboard code | Missing `/finance/users/$userId` route | Missing dedicated lookup endpoint | `finance.ts` exists but not user-lookup contract | Blocked | Legacy query/UI exists only in Next. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts) |

**Missing in app backend/schema**

| Gap | Evidence | What is missing | References |
| --- | --- | --- | --- |
| `admin_users` SQL source of truth | Missing repo evidence | Dashboard auth, team, and health logic all depend on `admin_users`, but no app-side migration creates it. Search next in the original bootstrap migration or production SQL export. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Canonical non-ledger admin audit flow in `audit_logs` | Verified in SQL | `audit_logs` exists, but the repo-verified schema/commentary scopes it to payment actions; there is no app-side admin mutation function set that uses it as the canonical audit trail for users/tasks/chats/cases/reports. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts) |
| `reports` and `report_actions` | Missing repo evidence | No repo-verified tables or functions exist for user/task/chat reports queues. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `admin_cases` and `admin_case_entities` | Missing repo evidence | No repo-verified case or investigation tables exist. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `admin_notes` | Missing repo evidence | No internal-note table exists for attaching admin notes to users/tasks/bookings/disputes. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `admin_chat_access_logs` | Missing repo evidence | No case-gated chat access log table exists. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `admin_pii_access_logs` | Missing repo evidence | No explicit PII reveal log table exists. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `admin_approvals` | Missing repo evidence | No dual-approval queue exists for dangerous finance/admin operations. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| `system_config` | Missing repo evidence | Settings code expects `system_config`, but the app repo does not create it. Search next in missing foundational migrations or live DB schema. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/settings.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/settings.ts) |
| Marketplace user moderation state | Missing repo evidence | The repo does not establish one canonical place for banning, suspending, or restricting marketplace users. No repo-verified `profiles.account_status`, `banned_reason`, `banned_at`, `banned_by_admin_id`, or equivalent `user_restrictions` table exists, and current dashboard code incorrectly mutates `admin_users`. Search next in foundational app migrations or a live schema dump. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| Force-logout/session revocation primitives | Missing repo evidence | No app-side revocation table, session versioning field, or admin RPC exists for forced logout. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`, no matching route in [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts) |
| Risk flags and fraud rules domain | Missing repo evidence | No repo-verified `user_risk_flags`, fraud rules, or risk-events table exists. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` |
| Device/IP footprint for admin review | Missing repo evidence | No repo-verified device fingerprint, IP history, or auth-event table exists for investigation views. Search next in edge functions, auth webhooks, or external telemetry pipeline. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api` |
| Explicit admin moderation columns | Missing repo evidence | Hide/lock/force-close/reason fields for tasks, bookings, messages, and chat attachments are not repo-verified in canonical app SQL. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations) |
| `admin_resolve_dispute` repo-verified SQL | Missing repo evidence | Dashboard code and generated legacy types reference `admin_resolve_dispute`, but no app-side SQL definition exists in the repo. Search next in historical migrations or live DB function dump. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts) |
| Canonical ownership of admin finance helpers | Verified in dashboard code | `vw_admin_journal_ledger`, `admin_process_withdrawal`, and `admin_process_wallet_freeze` exist only in the dashboard repo migration, but the app repo is the canonical system-of-record for the marketplace schema. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations) |

**Missing integration contracts**

| Gap | Evidence | What is missing | References |
| --- | --- | --- | --- |
| `packages/shared/src/schemas/auth.ts` | Missing repo evidence | No canonical admin role enum file exists; role constants are duplicated across multiple schema files. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/auth.ts`, present duplicates in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) |
| `packages/shared/src/schemas/audit.ts` | Missing repo evidence | No canonical audit action enum or mutation-ack schema exists. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/audit.ts` |
| `packages/shared/src/schemas/cases.ts` | Missing repo evidence | No case DTOs or case-gated chat access DTOs exist. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts` |
| `packages/shared/src/schemas/reports.ts` | Missing repo evidence | No reports queue DTOs exist. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/reports.ts` |
| `packages/shared/src/schemas/search.ts` | Missing repo evidence | No global search DTOs exist. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/search.ts` |
| `packages/shared/src/schemas/bookings.ts` | Missing repo evidence | No admin booking moderation DTOs exist. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/bookings.ts` |
| `packages/shared/src/schemas/chat.ts` | Missing repo evidence | No chat moderation DTOs, masked/full message DTOs, or access-grant DTOs exist. | Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts` |
| Masked/unmasked DTO split | Missing repo evidence | No shared `UserSummaryMasked`, `UserDetailMasked`, `UserDetailRevealed`, `ChatMessageMasked`, or `ChatMessageFull` schemas exist. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts), Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts` |
| Request/response drift between admin-ui and Fastify | Verified in dashboard code | Current request schemas exist, but response schemas are largely ad hoc `ServiceResult<any>`, and several callers target missing or mismatched endpoints/functions. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/result.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/result.ts) |

**Missing security controls**

| Gap | Evidence | Current issue | References |
| --- | --- | --- | --- |
| Direct Supabase admin access patterns remain in `apps/admin-ui` | Verified in dashboard code | Blocking security gate: the SPA still contains files that import server-only admin helpers and call `auth.admin` methods or direct admin writes. Add a CI forbidden-import check so any `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, or `auth.admin` usage in `apps/admin-ui` fails the build. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/services/health_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/services/health_actions.ts) |
| Server-action-era files remain inside SPA source | Verified in dashboard code | `apps/admin-ui/src/features/**/services/*_actions.ts` is still present and should not survive the Vite target except as rewritten API clients. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/analytics/services/analytics_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/analytics/services/analytics_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts) |
| Non-atomic audit trail | Verified in dashboard code | Blocking security gate: `withAudit()` does not guarantee same-transaction mutation and audit success, so every privileged mutation still using it should be considered non-compliant until replaced by RPC-backed atomic writes. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts) |
| Auth role source depends on untracked `admin_users` | Missing repo evidence | Fastify trusts `admin_users` but the app repo does not create it. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts) |
| Chat-view governance absent | Missing repo evidence | No admin-side case requirement, access log table, or thread-view logging path exists. | Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_chat_access*.sql` |
| PII masking and reveal audit incomplete | Verified in dashboard code | There is finance metadata masking in leftover SPA code, but no canonical shared DTO split or explicit reveal flow with audit persistence. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts), Missing file `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_pii_access*.sql` |
| Dangerous finance dual approval absent | Missing repo evidence | No `admin_approvals` table, approval queue endpoint, or dual-approval contract exists. | Missing files `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_approvals*.sql`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts` |

# Implementation Plan

**Phase 0: Normalize evidence and remove ambiguity**

| Action | Evidence | Exact implementation | References |
| --- | --- | --- | --- |
| Declare `audit_logs` canonical | Verified in SQL | Treat `public.audit_logs` in the app repo as the only canonical audit table for admin and finance actions, with the ledger-owned schema shape `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta`, and `created_at`; remove any manual API inserts that do not match this schema exactly or are not wrapped inside a DB RPC that writes it atomically. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts) |
| Mark `admin_logs` as legacy drift | Verified in dashboard code | Add a temporary compatibility view or translation layer only if required for zero-downtime cutover, then delete all `admin_logs` dependencies from Fastify, Vite, and any remaining legacy code. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts) |
| Use migrations over docs when conflicting | Verified in app code | Lock the rule that migrations win over `SUPABASE_SETUP.md` whenever the two disagree. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_rls_policies.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql) |
| Move dashboard-owned admin SQL into app repo | Verified in dashboard code | Re-home `vw_admin_journal_ledger`, `admin_process_withdrawal`, and `admin_process_wallet_freeze` into new app migrations under `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`, fixing the current signature and column drift while leaving a compatibility rollout window if needed. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql) |

**Phase 1: Create the admin security domain in app SQL**

| Build item | Evidence | Where and how to build it | Required tests / audit action |
| --- | --- | --- | --- |
| `admin_users` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_users.sql` with `id uuid primary key references auth.users`, `email`, `role`, `status`, `last_active_at`, `created_at`, RLS enabled, `service_role` full access, no direct browser mutation policies. | SQL policy tests for read/write isolation; audit action `admin.team.invite`, `admin.team.update_role`, `admin.team.remove_member` |
| `admin_cases`, `admin_case_entities` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_cases.sql` with case status, priority, assignee, subject, source, and typed entity attachments (`entity_type`, `entity_id`). | Integration tests for case creation, entity attach, chat-access gating; audit action `admin.case.create`, `admin.case.attach_entity` |
| `admin_notes` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_notes.sql` keyed by `entity_type`, `entity_id`, `author_admin_id`, `visibility`, `content`. | RLS tests for service-role-only writes; audit action `admin.note.create` |
| `admin_chat_access_logs` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_chat_access_logs.sql` keyed by `thread_id`, `case_id`, `viewer_admin_id`, `reason`, `view_scope`, `created_at`. | Denied-without-case and successful-view logging tests; audit action `admin.chat.access` |
| `admin_pii_access_logs` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_pii_access_logs.sql` keyed by `entity_type`, `entity_id`, `field_scope`, `viewer_admin_id`, `case_id`, `reason`, `created_at`. | PII reveal authorization tests; audit action `admin.pii.reveal` |
| `admin_approvals` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_admin_approvals.sql` with `operation_type`, `target_entity_type`, `target_entity_id`, `requested_by`, `approved_by`, `status`, `idempotency_key`, `payload`. | Dual-approval workflow tests; audit action `admin.approval.request`, `admin.approval.approve`, `admin.approval.reject` |
| `reports`, `report_actions` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_reports.sql` with queues for task/user/chat reports and triage history. | Report triage tests; audit action `admin.report.triage`, `admin.report.resolve` |
| `system_config` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_system_config.sql` with `key`, JSONB `value`, `description`, `updated_by`, `updated_at`. | Config read/update tests; audit action `admin.system.update_config` |
| Optional `user_risk_flags` | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260308_user_risk_flags.sql` with typed risk labels, scores, signals, and reviewer metadata. | User investigation aggregation tests; audit action `admin.user.risk_update` |
| Marketplace user moderation state | Missing repo evidence | Canonical implementation decision: extend `public.profiles` in a new app-owned migration with admin-managed moderation fields such as `account_status`, `moderation_reason`, `moderated_at`, `moderated_by_admin_id`, `restriction_scope`, and optional `force_logout_after`; keep any Supabase Auth disable/ban action as an enforcement layer, but store marketplace moderation state in app-owned data so dashboard reads, exports, and timelines stay queryable. | SQL migration tests for moderation state transitions; audit action `admin.users.suspend`, `admin.users.ban`, `admin.users.restrict` |
| Atomic admin RPCs | Missing repo evidence | Add `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260309_admin_action_rpcs.sql` implementing `admin_suspend_user`, `admin_ban_user`, `admin_force_logout_user`, `admin_update_task_status`, `admin_cancel_booking`, `admin_refund_booking`, `admin_resolve_dispute`, `admin_freeze_wallet`, `admin_unfreeze_wallet`, `admin_adjust_wallet`, `admin_redact_message`, `admin_delete_message_attachment`, `admin_create_case_for_chat_access`, `admin_grant_case_chat_access`. Each RPC must execute in one transaction, accept idempotency input where replay-sensitive, and write exactly one `audit_logs` row with `actor_user_id`, `related_entity_type`, `related_entity_id`, and `meta`. | SQL unit tests for success, replay, and rollback-on-audit-failure; audit actions by RPC name |

**Phase 2: Complete Fastify API as the only privileged admin mutation surface**

| Build item | Evidence | Where and how to build it | Required tests / audit action |
| --- | --- | --- | --- |
| Keep and refactor existing routes | Verified in dashboard code | Preserve `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts`, `users.ts`, `tasks.ts`, `disputes.ts`, `finance.ts`, `team.ts`, `dashboard.ts`, but convert privileged mutations to RPC-backed atomic flows and fix current schema drift. | Route integration tests against stubbed Supabase; audit per route |
| Add missing route files | Verified in dashboard code | Create `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/bookings.ts`, `chat.ts`, `cases.ts`, `reports.ts`, `logs.ts`, `settings.ts`, `search.ts`, `observability.ts`, and optionally `notes.ts`. | Contract tests for each route; audit per operation |
| Replace `withAudit()` | Verified in dashboard code | Delete or deprecate `apps/api/src/audit.ts` for privileged writes; call SQL RPCs that already persist audit rows atomically. Retain only lightweight request logging if needed. | Regression test that mutation fails if audit cannot be written |
| Fix finance drift | Verified in dashboard code | Implement `GET /api/v1/finance/transactions/:journalId`, add `POST /api/v1/finance/wallets/:userId/unfreeze`, and align RPC argument names with the canonical SQL. | Finance detail and unfreeze tests; audit `admin.finance.wallet_unfreeze`, `admin.finance.tx_view_sensitive_meta` |
| Fix user/admin drift | Verified in dashboard code | Replace ban/unban logic so normal marketplace users are suspended/banned through canonical user/account fields or auth admin APIs, not `admin_users`; add `POST /api/v1/users/:userId/force-logout`. | Ban/unban/force-logout tests; audit `admin.users.ban`, `admin.users.unban`, `admin.users.force_logout` |
| Add bookings/chat/cases/reports/search/logs/settings/observability endpoints | Missing repo evidence | Build resource-scoped REST modules under `apps/api` and keep all privileged actions server-side with RBAC + audit. | Integration tests and Playwright coverage across the dangerous flows |

**Phase 3: Reach route parity in the Vite SPA, then delete Next**

| Build item | Evidence | Where and how to build it | Required tests |
| --- | --- | --- | --- |
| Keep current working route candidates | Verified in dashboard code | Retain `/`, `/login`, `/users`, `/users/$userId`, `/tasks`, `/tasks/$taskId`, `/disputes`, `/disputes/$disputeId`, `/finance`, `/finance/transactions`, `/finance/withdrawals`, `/settings` as the migration base. | Vite route smoke tests |
| Add missing parity routes | Verified in dashboard code | Create `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Support.tsx`, `Logs.tsx`, `Team.tsx`, `Notifications.tsx`, `SystemHealth.tsx`, `FinanceAudit.tsx`, `FinanceUserLookup.tsx`, `Bookings.tsx`, `BookingDetail.tsx`, `Reports.tsx`, `Cases.tsx`, `CaseDetail.tsx`, `ChatThread.tsx`, `Search.tsx`, `UserInvestigation.tsx`. | Route rendering tests and Playwright navigation tests |
| Remove server-action leftovers | Verified in dashboard code | Convert `apps/admin-ui/src/features/**/services/*_actions.ts` into thin API clients or delete them once the feature is re-implemented. | Static search gate: no `createAdminClient`, no `auth.admin`, no `@/lib/supabase/server` in `apps/admin-ui` |
| Remove dead Next imports and aliases | Verified in dashboard code | Delete all references to `@/lib/supabase/admin`, `@/lib/supabase/server`, `@/types/supabase`, and any `next/*` modules in `apps/admin-ui`. | `npm run -w @sline/admin-ui build` and `typecheck` gates |
| Delete `legacy-source` only after parity | Verified in dashboard code | Keep `legacy-source` until a page/operation parity matrix reaches zero gaps. | Parity checklist review and E2E pass |

**Phase 4: Make Sline_App fully manageable by the dashboard**

| Build item | Evidence | Where and how to build it | Required tests / audit action |
| --- | --- | --- | --- |
| User risk state | Missing repo evidence | Add risk label tables or fields in app SQL, surface them in `/api/v1/users/:userId` and `/users/$userId/investigation`. | Risk-view tests; audit `admin.user.risk_update` |
| Moderation reasons and hide/lock/force-close markers | Missing repo evidence | Extend `tasks`, `bookings`, and moderated chat/storage entities with explicit admin-only fields plus reason codes instead of opaque metadata blobs. | State-transition tests; audit `admin.tasks.update_status`, `admin.bookings.cancel`, `admin.chat.redact` |
| Linkage keys for timelines and exports | Verified in SQL | Reuse `task_id`, `booking_id`, `conversation_id`, `direct_offers.conversation_id`, `journal_entries.related_entity_type/related_entity_id`, and `work_logs.related_entity_type/related_entity_id` before adding new linkage fields. | Investigation aggregation tests |
| Server-generated admin visibility events | Missing repo evidence | Emit moderation, chat access, PII reveal, report triage, and approval events from server-side SQL/API, not from the browser. | Timeline consistency tests; audit action names per event |
| Canonicalize `is_wallet_frozen` upstream | Verified in dashboard code | Move the `profiles.is_wallet_frozen` change out of the dashboard migration and into app-owned schema migrations. | Finance freeze/unfreeze tests |

**Phase 5: Build the User Investigation experience**

| Build item | Evidence | Where and how to build it | Required tests / audit action |
| --- | --- | --- | --- |
| Investigation aggregate endpoint | Missing repo evidence | Add `GET /api/v1/users/:userId/investigation` in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts` or a dedicated `investigations.ts`, returning profile summary, tasks, bids/offers, bookings, disputes, ledger activity, support tickets/reports, and related conversations grouped by task/booking/direct offer. | Integration test for full graph hydration; audit `admin.users.investigation_view` |
| Conversations endpoint | Missing repo evidence | Add `GET /api/v1/users/:userId/conversations` with masked-by-default thread summaries and case references. | Role/case gating tests |
| Case APIs | Missing repo evidence | Add `POST /api/v1/cases`, `POST /api/v1/cases/:caseId/entities`, `POST /api/v1/cases/:caseId/grant-chat-access`. | Case-attach tests; audit `admin.case.create`, `admin.case.attach_entity`, `admin.case.grant_chat_access` |
| Chat access API | Missing repo evidence | Add `POST /api/v1/chat/threads/:threadId/access` that refuses access without `case_id`, role, and log persistence. | Denied-without-case, denied-without-role, success-with-log tests; audit `admin.chat.access` |
| Evidence-pack export | Missing repo evidence | Add `GET /api/v1/users/:userId/evidence-pack` to return CSV/JSON or ZIP export with IDs, timestamps, and metadata references. | Export correctness tests; audit `admin.export.evidence_pack` |
| Investigation UI | Missing repo evidence | Create `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserInvestigation.tsx` with tabs for profile, tasks, offers, bookings, disputes, finance, reports/tickets, and case-gated conversations. | Playwright investigation navigation and gating tests |

**Phase 6: Observability, exports, and dangerous-op controls**

| Build item | Evidence | Where and how to build it | Required tests / audit action |
| --- | --- | --- | --- |
| CSV export surface | Verified in dashboard code | Replace legacy Next export handlers with Fastify export endpoints per resource or a generic `/api/v1/export/:resource` surface, all server-side and audit logged. | Export ACL and row-count tests; audit `admin.export` |
| Observability widgets | Missing repo evidence | Add `/api/v1/observability` and UI cards for API errors, payment failures, dispute spikes, auth anomalies, and fraud signals. | Alert-source integration tests |
| Dual approval for dangerous finance ops | Missing repo evidence | Route manual wallet adjustments, reversals, large refund overrides, and withdrawal overrides through `admin_approvals` and a second approver flow. | Approval workflow E2E tests; audit `admin.approval.*` |
| Performance hardening | Verified in dashboard code | Keep cursor pagination for finance feeds and extend the same principle to large admin logs and investigation timelines; avoid offset pagination for high-cardinality feeds. | p95 latency tracking and pagination regression tests |

# API Contract Map

| Operation | Evidence | Endpoint / method | Request schema | Response schema | Roles | Audit action | Idempotency | Error mapping | References |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Create admin session | Verified in dashboard code | `POST /api/v1/auth/session` | `SessionExchangeSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts) | `ServiceResult<{ user: { id; email; role } }>`; dedicated shared auth response schema missing | `support`, `moderator`, `admin`, `super_admin` | none | not required | `400 VALIDATION_ERROR`, `401 AUTH_ERROR` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts) |
| Suspend user | Missing repo evidence | `POST /api/v1/users/:userId/suspend` | Target `SuspendUserInputSchema`; current partial `SuspendUserSchema` exists in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts) | Target `MutationAckSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/audit.ts) | `moderator`, `admin`, `super_admin` | `admin.users.suspend` | `Idempotency-Key` required | `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 USER_NOT_FOUND`, `409 IDEMPOTENCY_REPLAY`, `422 INVALID_STATE` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts), Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts` implementation |
| Ban user | Verified in dashboard code | Current `POST /api/v1/users/:userId/ban`; target keep same path but replace mutation logic | Current `BanUserSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.users.ban` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts) |
| Force logout user | Missing repo evidence | `POST /api/v1/users/:userId/force-logout` | Target `ForceLogoutInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/auth.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.users.force_logout` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`, missing app SQL revocation primitive |
| Update task status | Verified in dashboard code | Current `POST /api/v1/tasks/:id/status`; target keep path but back it with `admin_update_task_status(...)` | Current `UpdateTaskStatusSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/tasks.ts) | Target `MutationAckSchema` | `moderator`, `admin`, `super_admin` | `admin.tasks.update_status` | `Idempotency-Key` required for replay-sensitive states such as force-cancel | `400`, `401`, `403`, `404`, `409`, `422`, `500` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts) |
| Cancel booking | Missing repo evidence | `POST /api/v1/bookings/:bookingId/cancel` | Target `AdminBookingCancelInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/bookings.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/bookings.ts) | Target `MutationAckSchema` | `moderator`, `admin`, `super_admin` | `admin.bookings.cancel` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/bookings.ts` |
| Refund booking | Missing repo evidence | `POST /api/v1/bookings/:bookingId/refund` | Target `AdminBookingRefundInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/bookings.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/bookings.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.bookings.refund` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/bookings.ts`, existing booking refund RPC [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql) |
| Resolve dispute | Verified in dashboard code | Current `POST /api/v1/disputes/:id/resolve`; target keep path but replace missing SQL dependency with repo-owned RPC | Current `UpdateDisputeStatusSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/disputes.ts) | Target `MutationAckSchema` | `moderator`, `admin`, `super_admin` | `admin.disputes.resolve` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts) |
| Freeze wallet | Verified in dashboard code | Current `POST /api/v1/finance/wallets/:userId/freeze`; target keep path but drop `withAudit()` wrapper | Current `FreezeWalletSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.finance.wallet_freeze` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql) |
| Unfreeze wallet | Missing repo evidence | `POST /api/v1/finance/wallets/:userId/unfreeze` | Current `UnfreezeWalletSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.finance.wallet_unfreeze` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route in [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts) |
| Approve withdrawal | Verified in dashboard code | Current `POST /api/v1/finance/withdrawals/:requestId/approve`; target keep path but fix RPC argument contract | Current `ApproveWithdrawalSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Target `MutationAckSchema` | `super_admin` | `admin.finance.withdrawal_approve` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422`, `500` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql) |
| Reject withdrawal | Verified in dashboard code | Current `POST /api/v1/finance/withdrawals/:requestId/reject`; target keep path but fix RPC argument contract | Current `RejectWithdrawalSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Target `MutationAckSchema` | `super_admin` | `admin.finance.withdrawal_reject` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422`, `500` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql) |
| Adjust wallet | Missing repo evidence | `POST /api/v1/finance/wallets/:userId/adjust` | Target `AdjustWalletInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Target `MutationAckSchema` | `admin`, `super_admin` plus second approver for dangerous thresholds | `admin.finance.wallet_adjust` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`, missing app RPC |
| Transaction details | Verified in dashboard code | `GET /api/v1/finance/transactions/:journalId` | Current `TransactionDetailsSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | Current `JournalLedgerEntrySchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts) | `support`, `moderator`, `admin`, `super_admin` with masked/full behavior by role | `admin.finance.tx_view_sensitive_meta` only when unmasked fields are revealed | no write idempotency | `400`, `401`, `403`, `404` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/services/finance_api.ts), missing API implementation in [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts) |
| Redact chat message | Missing repo evidence | `POST /api/v1/chat/messages/:messageId/redact` | Target `RedactMessageInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.chat.redact` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts` |
| Delete chat attachment | Missing repo evidence | `POST /api/v1/chat/messages/:messageId/delete-attachment` | Target `DeleteChatAttachmentInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts) | Target `MutationAckSchema` | `admin`, `super_admin` | `admin.chat.delete_attachment` | `Idempotency-Key` required | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts`, existing attachment access helper [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql) |
| Grant chat access | Missing repo evidence | `POST /api/v1/chat/threads/:threadId/access` | Target `GrantChatAccessInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/chat.ts) and `/packages/shared/src/schemas/cases.ts` | Target `ChatThreadAccessReceiptSchema` | `support`, `moderator`, `admin`, `super_admin` | `admin.chat.access` | Every grant/view must log; no replay suppression for views | `400`, `401`, `403`, `404`, `409`, `422` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts` |
| Create case | Missing repo evidence | `POST /api/v1/cases` | Target `AdminCaseCreateInput` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts) | Target `AdminCase` | `support`, `moderator`, `admin`, `super_admin` | `admin.case.create` | `Idempotency-Key` recommended | `400`, `401`, `403`, `409` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/cases.ts` |
| Attach entity to case | Missing repo evidence | `POST /api/v1/cases/:caseId/entities` | Target `AdminCaseAttachEntityInput` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/cases.ts) | Target `MutationAckSchema` | `support`, `moderator`, `admin`, `super_admin` | `admin.case.attach_entity` | `Idempotency-Key` recommended | `400`, `401`, `403`, `404`, `409` | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/cases.ts` |
| Update admin role | Missing repo evidence | `PATCH /api/v1/team/:userId/role` | Current `UpdateRoleSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts) | Target `MutationAckSchema` | `super_admin` | `admin.team.update_role` | `Idempotency-Key` recommended | `400`, `401`, `403`, `404`, `409` | Missing route in [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Invite admin | Verified in dashboard code | Current `POST /api/v1/team/invite`; target keep path but fix audit columns and add DB-backed admin domain | Current `InviteMemberSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts) | Target `MutationAckSchema` | `super_admin` | `admin.team.invite` | Email uniqueness or `Idempotency-Key` | `400`, `401`, `403`, `409`, `500` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Remove admin | Verified in dashboard code | Current `DELETE /api/v1/team/:userId`; target keep path but validate input and make audit atomic | Current `RemoveMemberSchema` in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts) | Target `MutationAckSchema` | `super_admin` | `admin.team.remove_member` | `Idempotency-Key` recommended | `400`, `401`, `403`, `404`, `409` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts) |
| Export CSV | Missing repo evidence | Resource-scoped `GET /api/v1/users/export`, `/api/v1/tasks/export`, `/api/v1/finance/transactions/export`, `/api/v1/logs/export` or a generic `/api/v1/export/:resource` | Current `ExportCSVSchema` exists only for finance in [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts); add shared `ExportQuerySchema` | Streamed CSV or `ExportReceiptSchema` | Role-specific | `admin.export` | `Idempotency-Key` not required; query hash logged | `400`, `401`, `403`, `429` | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts) |
| Reveal PII | Missing repo evidence | `POST /api/v1/users/:userId/reveal-pii` and analogous resource-scoped reveal endpoints | Target `RevealPiiInputSchema` in missing [/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts) or new `audit.ts` | Target `UserDetailRevealed` | `admin`, `super_admin` with explicit permission | `admin.pii.reveal` | `Idempotency-Key` recommended; every reveal logged | `400`, `401`, `403`, `404`, `409` | Missing route and missing `admin_pii_access_logs` table |

# Risk Register

| Risk | Evidence | Impact | Mitigation | Detection signal | References |
| --- | --- | --- | --- | --- | --- |
| Service-role logic leaks back into the browser via migration leftovers | Verified in dashboard code | High; privileged access could escape the intended API boundary if these imports are revived or shimmed incorrectly. | Delete all `createAdminClient` and `auth.admin` usage from `apps/admin-ui`; enforce a CI grep gate. | CI/static scan finds `createAdminClient`, `auth.admin`, or `@/lib/supabase/admin` in `apps/admin-ui`. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts) |
| Non-atomic audit logging on privileged mutations | Verified in dashboard code | High; admin writes can complete without durable audit. | Replace `withAudit()` with SQL RPCs that write `audit_logs` in the same transaction. | Mutation succeeds but audit row count does not change; DB trigger/monitor mismatch. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts) |
| `admin_logs` vs `audit_logs` drift | Verified in dashboard code | High; activity screens and audits will be incomplete or broken. | Normalize on `audit_logs`, add a temporary compatibility view only if needed, then remove `admin_logs` callers. | Queries fail on missing columns or return empty activity feeds. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md) |
| Undocumented `admin_users` dependency | Missing repo evidence | High; auth/RBAC can break between environments because the table is not managed in the app repo. | Add canonical app-side migration for `admin_users` and seed/bootstrap path. | Fastify auth returns fallback roles or 500s; migrations do not create required table. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts) |
| `admin_process_withdrawal` signature drift | Verified in dashboard code | High; approve/reject withdrawal endpoints fail at runtime. | Align the SQL signature with the API contract in the app repo and delete outdated generated types. | Supabase RPC errors for unknown named arguments. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql) |
| `admin_process_withdrawal` writes non-existent columns | Verified in SQL | High; even corrected RPC invocation can still fail against the canonical app schema. | Move the function into app repo migrations and update it to only use repo-verified columns or extend the table canonically first. | Postgres error on `processed_by` or `admin_notes` column lookup. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| Team invite audit insert uses invalid columns | Verified in dashboard code | High; admin invite can succeed with failed audit or hard-fail unexpectedly. | Replace manual insert with canonical SQL RPC or correct column names and same-transaction logic. | Insert errors on `audit_logs` from team invite path. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| User ban/unban targets the wrong table | Verified in dashboard code | High; admin can think a user is banned while the real user session remains active. | Re-implement against auth admin ban/session revocation and core user moderation state. | Banned user can still sign in or use app; `admin_users` row changes for non-admin targets. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts) |
| Missing `admin_resolve_dispute` SQL | Missing repo evidence | High; dispute resolution path depends on an untracked function. | Add canonical app-side `admin_resolve_dispute(...)` with ledger-safe settlement semantics and idempotency. | RPC not found / mismatch between legacy types and live schema. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/types/supabase.ts) |
| Chat moderation without case gating | Missing repo evidence | High; admins could inspect private conversations without workflow controls. | Require case creation/attachment and log every thread view in `admin_chat_access_logs`. | Thread content endpoint succeeds without `case_id`; no access rows exist. | Missing route `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts` |
| PII overexposure in investigation and finance views | Verified in dashboard code | High; current masking logic is ad hoc and not enforced via shared contracts or reveal logs. | Introduce masked/full DTOs and explicit reveal endpoints with `admin_pii_access_logs`. | Support/moderator sees unmasked fields; reveal events missing from audit. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts) |
| Finance replay without idempotency on admin operations | Missing repo evidence | High; duplicate refunds, reversals, or unfreeze/freeze events can occur. | Require `Idempotency-Key` on replay-sensitive admin routes and persist keys in the admin approval/action domain. | Duplicate journal entries or repeated status transitions for the same admin action. | Missing shared contract `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/audit.ts`, existing ledger idempotency refs in [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql) |
| Missing dual approval for dangerous operations | Missing repo evidence | High; single admin can execute irreversible finance changes. | Add `admin_approvals` workflow and second-approver enforcement. | Large refund/adjustment proceeds with only one actor and no approval rows. | Missing files `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_approvals*.sql` |
| Export data overreach | Verified in dashboard code | Medium-high; legacy CSV export fetches up to 10k audit rows with broad filter surface. | Scope exports per role/resource, stream output server-side, and log every export. | Large export jobs or unexpected row counts; export by low-privilege role. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts) |
| Storage attachment access bypass in admin tooling | Verified in SQL | Medium-high; app-side participant attachment checks exist, but admin moderation paths do not yet define safe override rules. | Reuse `can_access_chat_attachment` for participants and add explicit admin override paths that require case + audit. | Admin attachment fetches bypass any case/access log. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql) |
| Offset pagination on large admin feeds | Verified in dashboard code | Medium; users/tasks/disputes/logs will degrade and can reorder under load. | Switch to cursor pagination for audit logs, user feeds, task feeds, and investigation timelines. | Slow queries and duplicated/missed rows on page transitions. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts) |
| Deleting Next before parity | Verified in dashboard code | Medium-high; several management domains exist only in `legacy-source`. | Maintain a parity matrix and do not delete `legacy-source` until Vite/Fastify replacements pass E2E. | Feature regression list still contains support/logs/team/notifications/system-health/finance-audit/finance-users. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx) |
| Stale docs override live migrations | Verified in app code | Medium; engineers can target legacy `admin_logs` or outdated policy assumptions. | Document the migration authority rule and update `SUPABASE_SETUP.md` once canonical migrations land. | New code references `admin_logs` or untracked columns after migration. | [/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md](/Users/eros/Dev/Eros_Projects/Sline/sline_app/Sline_everything/SUPABASE_SETUP.md), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql) |
| Build instability blocks migration validation | Verified in dashboard code | Medium; the admin SPA cannot be used as a verification target until missing imports and dependencies are removed. | Remove Next-era files/imports and install required Vite dependencies only for retained UI components. | `npm run -w @sline/admin-ui build` fails. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx) |
| Missing device/IP evidence limits fraud investigation | Missing repo evidence | Medium; the investigation page cannot satisfy the baseline requirement for footprint review. | Add auth-event ingestion or edge logging that records IP/device hashes server-side with retention and masking rules. | Investigation page lacks any device/IP section or data source. | Missing files under `/Users/eros/Dev/Eros_Projects/Sline/sline_app`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api` |
| Current settings domain points at a missing table | Missing repo evidence | Medium; settings UI/API cannot be made authoritative without upstream schema. | Add `system_config` in app SQL and put Fastify settings routes in front of it. | Settings reads return table-not-found or empty results with no canonical seed. | [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts) |

# Verification Checklist

**Security**

- no `SUPABASE_SERVICE_ROLE_KEY` or service-role client code in `apps/admin-ui` — [Verified in dashboard code] current blockers are leftover imports of `@/lib/supabase/admin`, `@/lib/supabase/server`, and `auth.admin` usage in SPA source. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts)
- RBAC enforced server-side on every privileged route — [Verified in dashboard code] current baseline exists in `requireAdminRole(...)`, but route coverage is incomplete and still depends on untracked `admin_users`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/middleware/rbac.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/middleware/rbac.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts)
- chat thread view denied without role — [Missing repo evidence] no admin chat route exists yet. References: Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts`
- chat thread view denied without case — [Missing repo evidence] no cases domain or chat-access log domain exists yet. References: Missing files `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_case*.sql`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_chat_access*.sql`
- PII masked by default — [Verified in dashboard code] finance masking logic exists only as leftover app-side utility and must be elevated into shared DTO contracts plus API enforcement. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/data_masking.ts)
- PII reveal writes audit — [Missing repo evidence] no reveal endpoint or `admin_pii_access_logs` table exists yet. References: Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts` reveal route, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_pii_access*.sql`

**Correctness**

- every privileged mutation writes audit atomically — [Verified in dashboard code] currently false for Fastify routes; target pattern exists in `process_payment_event_ledger`. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql)
- idempotency prevents double refund, release, freeze, unfreeze, force-close — [Missing repo evidence] ledger idempotency exists, but admin contracts and tables do not yet enforce `Idempotency-Key` across privileged operations. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql), Missing file `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/audit.ts`
- ledger reconciliation matches journal, lines, and audit rows — [Verified in SQL] the financial core supports this; admin finance tooling must continue to read from canonical views and audit rows. References: [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql), [/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql](/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql)
- exports match filtered lists — [Verified in dashboard code] current legacy export is separate and can drift; the new API must export exactly the same filtered dataset as each list view. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts)
- investigation page shows all linked entities without orphan gaps — [Missing repo evidence] the required endpoints, cases domain, and reports domain do not exist yet. References: Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/cases.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/reports.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserInvestigation.tsx`

**Migration**

- `apps/admin-ui` builds and typechecks — [Verified in dashboard code] not currently true due missing dependency and unresolved Next-era imports. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts)
- all legacy Next pages have Vite and Fastify replacements — [Verified in dashboard code] not currently true; support/logs/team/notifications/system-health/finance-audit/finance-users are missing parity. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts)
- no remaining Next-only imports in `admin-ui` — [Verified in dashboard code] not currently true. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/logs/services/log_actions.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/logs/services/log_actions.ts)
- `legacy-source` removable without route loss — [Verified in dashboard code] not currently true. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes)

**E2E / Playwright**

- suspend user, ban user, force logout — [Missing repo evidence] force logout route is absent and current ban route targets the wrong table. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts)
- force-cancel task with held funds — [Verified in dashboard code] current task status route has partial refund logic and should be covered after RPC hardening. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts)
- approve withdrawal, reject withdrawal — [Verified in dashboard code] current routes exist but are blocked by RPC contract drift and missing canonical schema ownership. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql](/Users/eros/Dev/Eros_Projects/SlineDashbord/supabase/migrations/20260228000000_admin_views_rpcs.sql)
- resolve dispute with refund or release — [Missing repo evidence] `admin_resolve_dispute` is not repo-verified. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts)
- case-gated chat access, redact message — [Missing repo evidence] no chat admin domain exists yet. References: Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/chat.ts`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/*admin_chat_access*.sql`
- export CSV from users, tasks, finance, logs — [Missing repo evidence] export surface is still legacy Next-only. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/api/finance/export-audit/route.ts)

**Performance**

- admin search p95 under 500ms — [Missing repo evidence] no admin search endpoint or shared search contract exists yet. References: Missing files `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/search.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/search.ts`
- list pages p95 under 400ms — [Verified in dashboard code] current large list routes use offset pagination and will need cursor conversion or indexing work for scale. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts)
- heavy detail pages p95 under 800ms — [Verified in dashboard code] user investigation, finance trace, and dispute detail should be tested against grouped, joined, or precomputed read models rather than ad hoc N+1 fetches. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/features/finance/actions/queries.ts)
- audit and transaction feeds use cursor pagination, not offset pagination — [Verified in dashboard code] finance already uses cursors; logs, users, tasks, and disputes still need migration to cursor-based feeds for large datasets. References: [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts), [/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts](/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts) |
