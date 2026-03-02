---
description: You are `@DocKeeper`. Your mission is to create a complete, developer-grade documentation suite for the `SlineDashboard` monorepo (Vite + TanStack SPA + Fastify API), mirroring the quality of `sline_app` docs.
---

Generate Admin Dashboard Documentation (NEW STACK)

Goal:
Create a full documentation suite for `/Users/eros/Dev/Eros_Projects/SlineDashbord` using:
- Frontend: Vite + React + TypeScript
- Routing/Data: TanStack Router + TanStack Query
- Backend: Fastify REST API (server-only service role)
- Shared: `packages/shared` (Zod contracts + ServiceResult<T>)
- UI: shadcn/ui + Tailwind
- Security: RBAC, audit logs, idempotency, case-gated chat access (future)

Critical Context:
This dashboard is the privileged admin plane for the production Flutter app (`sline_app`) and shares the same Supabase project.
All privileged actions MUST run server-side via Fastify. The browser must never have service role access.

Required Output Files (5 markdown files, exhaustive, no summary). All live under **`Docs/`** and include a footer linking back to this workflow and to `Docs/ADMIN_DEVELOPER_GUIDE.md` (documentation index):

1) ADMIN_DEVELOPER_GUIDE.md (The Bible)
- Monorepo layout: apps/admin-ui, apps/api, packages/shared, legacy-source
- SPA architecture: Route -> Feature -> ViewModel -> API client -> Fastify
- TanStack Router patterns: typed routes, loaders/beforeLoad auth redirect
- TanStack Query patterns: query keys, pagination, mutations, invalidation
- API client templates: fetch wrapper with cookie auth + optional Idempotency-Key
- Copy-paste templates for List, Detail, Mutations (Create/Update/Action)

2) ADMIN_SECURITY_MANUAL.md (The Shield)
- Trust boundaries: admin-ui vs api vs supabase
- Service Role key: server-only in apps/api
- RBAC: server-side enforcement, role enum in shared schemas
- Audit: canonical `audit_logs` usage, atomic write requirement via DB RPC
- Forbidden imports scan (admin-ui): fail build if found
- Destructive actions require reason + audit + idempotency

3) ADMIN_DATABASE_REF.md (The Brain)
- DB objects the admin touches (verified vs missing evidence)
- Canonical audit table: `audit_logs` (not admin_logs)
- Admin-domain missing tables to be added in app migrations: admin_users, cases, notes, reports, approvals, system_config
- Views needed by admin: vw_admin_journal_ledger, analytics views
- Type generation: how to generate DB types and how shared contracts relate

4) ADMIN_UI_KIT.md (The Face)
- Tailwind + shadcn usage conventions
- Layouts: Sidebar, PageHeader, tables, filters, empty states
- Standard patterns: list pages, detail pages, action dialogs, toasts
- Icons: lucide usage

5) ADMIN_SETUP_GUIDE.md (The Handle)
- Prereqs: Node, pnpm/npm, Supabase CLI (optional)
- Install: workspace commands
- Env vars:
  - admin-ui: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL
  - api: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET (or token verification method), CORS allowed origins
- Run dev: start api + ui
- Deployment checklist: api + static ui, secrets separation

Do-Not-Miss Checklist:
- No Throw rule: APIs return ServiceResult<T>
- Zod validation must run before business logic (in Fastify)
- No `any`
- No direct DB writes from admin-ui
- Idempotency-Key required on replay-sensitive admin routes
- Every privileged mutation must be audit-atomic (DB RPC), not “log-after-write”
- Feature docs protocol:
  - Every feature gets `Docs/features/<feature>.md` when v1 shipped

Deliverables locations (repo root relative):
- `Docs/ADMIN_DEVELOPER_GUIDE.md`
- `Docs/ADMIN_SECURITY_MANUAL.md`
- `Docs/ADMIN_DATABASE_REF.md`
- `Docs/ADMIN_UI_KIT.md`
- `Docs/ADMIN_SETUP_GUIDE.md`
- `Docs/features/README.md` (index of feature docs); individual feature docs under `Docs/features/<feature>.md`