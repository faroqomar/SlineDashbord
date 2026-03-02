# Admin Security Manual (The Shield)

This document defines trust boundaries, RBAC, audit, and destructive-action protocols for the Sline Dashboard (Vite SPA + Fastify API). Security is the baseline—not an afterthought.

---

## Trust Boundaries: admin-ui vs api vs Supabase

| Layer        | Allowed | Forbidden |
|-------------|---------|-----------|
| **admin-ui** | React, TanStack Router/Query, `lib/api.ts` (fetch to same-origin API), cookie-based session | Service Role key; any Supabase server client; `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase`; any `next/*` import |
| **api**      | Fastify, Supabase client with Service Role key, Zod from `packages/shared`, RBAC middleware | Exposing Service Role key to client; skipping Zod or RBAC on privileged routes |
| **Supabase** | Used only by the API (server-side). RLS applies to app users; admin bypass is via Service Role in API only. | Admin UI must never connect to Supabase with elevated privileges |

**Rule**: The browser must never have Service Role access. All privileged operations flow: Admin UI → Fastify API → (Service Role) → DB/RPC → audit_logs (same transaction).

---

## Service Role Key: Server-Only in apps/api

- **Where**: `SUPABASE_SERVICE_ROLE_KEY` is read only in `apps/api` (e.g. when creating the Supabase client). Never in `apps/admin-ui` or in any bundle sent to the browser.
- **How we enforce**: Forbidden-import scan (CI or pre-commit) fails the build if admin-ui contains: `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase`, or `next/*` imports.
- **Env**: Store in `.env` or host env for the API process only; never in `VITE_*` or any variable that gets embedded in the frontend build.

---

## RBAC: Server-Side Enforcement

- **Where**: Fastify `preHandler` / middleware (e.g. `requireAdminRole(['admin', 'super_admin'])`) on every privileged route. Role comes from canonical source (e.g. `admin_users` table in app repo).
- **Contract**: Role enum and route-level requirements should be reflected in `packages/shared` (e.g. `schemas/auth.ts` with AdminRole enum) so API and docs stay in sync.
- **No client-side RBAC**: The UI may show/hide actions based on role for UX, but the API must enforce; never trust the client for authorization.

---

## Audit: Canonical `audit_logs` and Atomic Write

- **Canonical table**: `public.audit_logs` (not `admin_logs`). Single source of truth for all privileged actions.
- **Atomic requirement**: Every privileged mutation MUST produce an audit record **in the same transaction** as the mutation. Use a DB RPC that does both the mutation and the `audit_logs` insert, or a single transaction in the API that performs the mutation and insert together. **"Log after write" (non-atomic) is forbidden**—if the mutation succeeds but the audit write fails, we lose accountability.
- **Canonical columns** (align with app repo schema): e.g. `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta` (JSONB). No legacy columns like `actor_id`, `target_resource`, `target_id`, `metadata` for new code.

---

## Forbidden Imports Scan (admin-ui)

The build or CI must fail if any of the following appear in `apps/admin-ui/src`:

- `@/lib/supabase/admin`
- `@/lib/supabase/server`
- `createAdminClient`
- `auth.admin`
- `@/types/supabase`
- `next/*` (any Next.js import)

Use a script (e.g. `scripts/forbidden-imports.sh`) or ESLint rule to enforce. This prevents Service Role or server-only code from leaking into the SPA bundle.

---

## Destructive Actions: Reason + Audit + Idempotency

1. **Reason required**: High-impact actions (ban user, force-cancel task, approve/reject withdrawal, resolve dispute) MUST require a `reason` (or equivalent) from the admin. The reason is stored in the audit `meta` and optionally on the record.
2. **Audit**: Each such action produces exactly one audit row in `audit_logs`, atomically with the mutation.
3. **Idempotency**: Replay-sensitive operations (refunds, withdrawals, dispute resolution) MUST require an `Idempotency-Key` header. The API returns the same result for duplicate keys and does not apply the mutation twice.

---

## Data Isolation

The dashboard shares the same Postgres database as the production app (`sline_app`). Never run destructive operations (e.g. cascading deletes on core user tables) without explicit design and safeguards. Prefer status flags and soft updates where possible.
