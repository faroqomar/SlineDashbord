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
- **Finance approve/reject**: The RPC `admin_process_withdrawal` is the **single** writer to `audit_logs` for these actions (one row per decision). The API does **not** wrap these calls in `withAudit`; doing so would create a double audit row. Other mutations (e.g. task force-cancel, team remove, cases create/attach) use the API’s `withAudit` or `writeAuditLog` helper when no RPC performs the audit; these are non-atomic (handler then audit). Prefer adding a DB RPC that does mutation + audit in one transaction when the feature is critical or high-volume.

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

1. **Reason required**: High-impact actions (ban user, force-logout user, force-cancel task, approve/reject withdrawal, resolve dispute, cancel/refund booking) MUST require a `reason` (or equivalent) from the admin. The reason is stored in the audit `meta` and optionally on the record.
2. **Audit**: Each such action produces exactly one audit row in `audit_logs`, atomically with the mutation (via DB RPC; API does not use "log after write").
3. **Idempotency**: Replay-sensitive operations (refunds, withdrawals, dispute resolution) MUST support idempotency (e.g. `Idempotency-Key` header or request body `idempotency_key`). The API returns the same result for duplicate keys and does not apply the mutation twice.

**Examples**: Force Logout (PAGE 06) and Bookings Cancel/Refund (PAGE 07) follow the above: reason in request body, single audit row written inside the RPC in the same transaction. Refund supports optional `idempotency_key` in body; RPC deduplicates by key.

**Dual approval (PAGE 16)**: Dangerous ops (wallet adjust above threshold, reversal, large refund) require a second admin: create approval (with `Idempotency-Key`), a *different* admin approves/rejects, then only the *requester* may execute. All request/approve/reject/execute write one audit row in the same transaction as the RPC. See `Docs/ADMIN_APPROVALS.md` and `Docs/features/PAGE_16_approval_queue.md`.

---

## Audit log export and PII (PAGE 12)

- **Endpoint:** GET `/api/v1/finance/audit/export` (admin, super_admin only). Returns CSV of `audit_logs` rows with same filters as the list endpoint.
- **PII rule:** The CSV **meta** column must not contain full JSON from `audit_logs.meta` (which may hold PII or sensitive payloads). The API exports a **redacted** meta object: only `action`, `related_entity_type`, `related_entity_id`, `journal_entry_id` are included in the export. See `apps/api/src/routes/finance/audit.ts` and `Docs/features/finance.md`.

---

## Force logout / session revocation (PAGE 06)

- **RPC**: `admin_force_logout_user(p_user_id, p_admin_id, p_reason)` sets `profiles.force_logout_after = now()` and inserts one row into `audit_logs` (action `admin.users.force_logout`), atomically.
- **App enforcement**: The main app (e.g. Flutter) must read `profiles.force_logout_after` and force re-auth when it is set and greater than the token’s issued_at. See `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`.
- **Feature doc**: `Docs/features/users.md` (User Management, Force logout).

---

## PII masking and reveal (PAGE 15 — User Investigation)

- **Principle**: In User Investigation, profile PII (email, phone) is **masked by default** in all GET responses. Revealing PII is a separate, privileged action.
- **Reveal**: Only **admin** and **super_admin** may call POST `/api/v1/users/:userId/reveal-pii`. Body must include `reason` (required for audit). The API inserts a row into `admin_pii_access_logs` (entity_type, entity_id, field_scope, viewer_admin_id, case_id, reason) and writes to `audit_logs` with action `admin.pii.reveal`, then returns the revealed email/phone.
- **No PII in GET**: GET `/api/v1/users/:userId/investigation` and GET evidence-pack return masked profile (e.g. `[MASKED]` for email/phone). Chat thread content remains case-gated (PAGE 09); investigation only returns masked conversation summaries.
- **Feature doc**: `Docs/features/user-investigation.md`.

---

## Case-gated chat access (PAGE 09)

- **Principle**: Viewing chat thread content is allowed only when the thread is linked to an investigation case and the admin opens it via that case. There is no “browse all conversations” endpoint.
- **Logging**: Every thread **view** and every **access grant** is recorded in `admin_chat_access_logs` (thread_id, case_id, viewer_admin_id, view_scope, created_at). This table is insert-only by the API; no client can bypass it.
- **Enforcement**: GET `/api/v1/chat/threads/:threadId` requires query `case_id`; the API checks that the case exists and is linked to the thread (via a prior grant or an `admin_case_entities` row). Missing or unlinked case returns 403. POST grant also requires a valid case and logs the grant.
- **Contracts**: Request/response shapes and RBAC are in `packages/shared` and `apps/api/src/routes/chat.ts`. **DB**: `admin_chat_access_logs` and `admin_cases` / `admin_case_entities` from migration `20260302130000_admin_cases_and_chat_access.sql`. See `Docs/ADMIN_DATABASE_REF.md` and Cases/chat feature docs.

---

## Observability / System Health (PAGE 14)

- **Endpoint:** GET `/api/v1/observability` only; no mutations.
- **RBAC:** Allowed roles: `support`, `moderator`, `admin`, `super_admin`. 401 unauthenticated; 403 when role not in list. Enforced in Fastify via `requireAdminRole(['support', 'moderator', 'admin', 'super_admin'])`.
- **No audit writes:** This route is read-only (service health checks and optional read of `audit_logs` for error counts). No Idempotency-Key required.
- **Error responses:** On 500, the API must return a generic message (e.g. "An error occurred") to the client; full error details must be logged server-side only (`fastify.log.error`) to avoid leaking internal table names, SQL, or stack traces.

---

## Data Isolation

The dashboard shares the same Postgres database as the production app (`sline_app`). Never run destructive operations (e.g. cascading deletes on core user tables) without explicit design and safeguards. Prefer status flags and soft updates where possible.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
