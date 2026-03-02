---
description: Core project context and rules for SlineDashboard (Admin Plane) + Sline_App (Production App)
globs: ["SlineDashbord/**", "sline_admin/**", "sline_app/**"]
alwaysApply: true
---

# SlineDashboard (Admin Plane) Context

## 0) System Overview (Two repos = one system)
This admin dashboard is the internal Control Room for the SLine freelance marketplace.
It is a continuation of `sline_app` and must never drift from the canonical marketplace schema.

- **App repo (production surface)**: `/Users/eros/Dev/Eros_Projects/Sline/sline_app`
- **Dashboard repo (admin plane)**: `/Users/eros/Dev/Eros_Projects/SlineDashbord`

The dashboard must manage users, tasks, disputes, finance, and investigations safely.

---

## 1) Tech Stack (Current Target Architecture)
### Admin UI
- **Framework**: Vite + React + TypeScript
- **Routing**: TanStack Router
- **Data**: TanStack Query
- **UI**: shadcn/ui + Tailwind

### Admin API
- **Framework**: Fastify + TypeScript (REST)
- **Auth**: Supabase Auth JWT (cookie session exchange)
- **RBAC**: server-side role checks using `admin_users`

### Shared Contracts
- `packages/shared`
- Zod schemas for request/response DTOs
- `ServiceResult<T>` is the only API response envelope

### Database
- Supabase Postgres (shared with app)
- RLS is the default safety boundary for the mobile app.
- Admin plane uses Service Role **server-side only**.

---

## 2) Trust Boundaries (Non-Negotiable)
1) `apps/admin-ui` must NEVER have Service Role access.
2) `apps/admin-ui` must NEVER import any server-only Supabase helpers.
3) Privileged operations must flow:
   Admin UI → Fastify API → (Service Role) → DB RPC → audit_logs (same transaction)

---

## 3) Canonical Data Ownership
- The **canonical schema** lives in `sline_app/supabase/migrations`.
- Any admin views/RPCs must be implemented in the app repo migrations (or moved there).
- The dashboard repo may contain admin SQL for development, but production truth must be app-owned to prevent drift.

---

## 4) Audit Logging Rule (Hard Requirement)
Any privileged mutation MUST produce an audit record in `public.audit_logs` atomically:
- same transaction as the mutation
- single source of truth for audit
- no “write then audit later” helpers

`admin_logs` is considered legacy/drift unless repo-verified as canonical.

---

## 5) Strict MVVM (Admin UI)
- **View (Route/Component)**: presentational only (no fetch, no business rules)
- **ViewModel (hooks)**: state glue + calling API client
- **API Client**: typed calls to Fastify only
- No direct DB/Supabase usage in UI except anon login (session exchange flow)

---

## 6) Security Rules
- RBAC enforced on server for every privileged route
- PII masked by default in responses
- PII reveal must require explicit action + reason + audit log
- Chat viewing must be case-gated (no case_id = no access) and every view logged
- Idempotency required for replay-sensitive operations (refunds, freezes, withdrawals, dispute resolutions)

---

## 7) Operational Rules (Quality Gates)
Before moving to the next feature/page:
- Build + typecheck passes (admin-ui, api, shared)
- Forbidden import scan passes (no server-only imports in admin-ui)
- API route tests pass (401/403/200 + validation)
- E2E tests pass for destructive flows
- Pagination is cursor-based for large feeds

---

## 8) Agents (Current)
- @AdminArchitect: structure + ViewModels glue
- @UIExpert: UI routes/components/states
- @SysOp: Fastify routes + shared contracts + DB migrations/RPCs (in app repo)
- @QA: testing gates
- @DevOps: CI/env/build gates
- @SecGuard: security review
- @CodeWarden: MVVM/quality gate
- @PerfOpt: performance gate
- @Modernizer: dependency health
- @MotionMaster: micro-interactions (optional, perf-safe)
- @DataSmith: mock/seed data (type-safe)

---