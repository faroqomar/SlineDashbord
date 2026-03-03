# Audit: What Is Not Implemented & What We Need To Do

**Source:** [MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](../MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md)  
**Implementation score (audit vs codebase):** ~7/10 overall; ~8/10 for dashboard-only.

---

## 1. Not implemented (dashboard — this repo)

| # | What is not implemented | What we need to do |
|---|-------------------------|---------------------|
| 1 | **Support / complaints** | Add Vite route `/support` in `apps/admin-ui/src/App.tsx`; add Fastify routes in `apps/api/src/routes/support.ts` (or equivalent). Use legacy `legacy-source/src/app/dashboard/complaints/page.tsx` and `legacy-source/src/features/support/services/support_actions.ts` as reference. |
| 2 | **Logs API** | Confirm whether `GET /api/v1/logs` exists in `apps/api`; if missing, add logs route and register in `apps/api/src/index.ts`. Logs UI (`apps/admin-ui/src/routes/Logs.tsx`) already exists. |
| 3 | **Team UI route** | Add Vite route `/team` in `apps/admin-ui/src/App.tsx` and a Team page component. API already exists in `apps/api/src/routes/team.ts` (invite/remove); add Fastify role-update endpoint (e.g. `PATCH /api/v1/team/:userId/role`) if required. |
| 4 | **Notifications** | Add Vite route `/notifications` in `apps/admin-ui/src/App.tsx`; add Fastify notifications routes. Reference: `legacy-source/src/app/dashboard/notifications/page.tsx`, `apps/admin-ui/src/features/notifications/services/notification_actions.ts`. |
| 5 | **Finance transaction detail API** | Implement `GET /api/v1/finance/transactions/:journalId` in Fastify (e.g. in `apps/api/src/routes/finance/transactions.ts` or `finance.ts`). SPA already calls it from `apps/admin-ui/src/features/finance/services/finance_api.ts`. |
| 6 | **Idempotency-Key** | Enforce `Idempotency-Key` header on replay-sensitive privileged routes (refund, release, freeze, unfreeze, force-close, reveal-pii, etc.) and persist keys; document in API Contract Map. |
| 7 | **Atomic audit** | Replace post-fact `writeAuditLog` / `withAudit()` with same-transaction audit (e.g. SQL RPCs that write `audit_logs` in the same transaction as the mutation). Start from `apps/api/src/audit.ts` and high-impact routes. |

---

## 2. Not implemented (app backend/schema — sline_app repo)

These are in the **app** repo (marketplace/system-of-record), not in the dashboard repo. Coordinate with app migrations.

| # | What is not implemented | What we need to do |
|---|-------------------------|---------------------|
| 1 | **`admin_users` SQL** | Add or locate canonical app-side migration that creates `admin_users`. Dashboard auth and team depend on it (`apps/api/src/auth.ts`, `apps/api/src/routes/team.ts`). |
| 2 | **Canonical admin audit in `audit_logs`** | Extend app-side usage of `audit_logs` as the canonical audit trail for admin mutations (users, tasks, chats, cases, reports), not only payment actions. |
| 3 | **`reports` and `report_actions` tables** | Add app-side migrations for user/task/chat reports queues. |
| 4 | **`admin_cases` and `admin_case_entities`** | Add app-side migrations for case and investigation tables. |
| 5 | **`admin_notes`** | Add app-side table for internal admin notes on users/tasks/bookings/disputes. |
| 6 | **`admin_chat_access_logs`** | Add app-side case-gated chat access log table. |
| 7 | **`admin_pii_access_logs` (app side)** | Dashboard has migration `supabase/migrations/20260303100000_admin_pii_access_logs.sql`; ensure app repo has equivalent if it shares the same DB or document ownership. |
| 8 | **`admin_approvals`** | Add app-side dual-approval queue for dangerous finance/admin operations. |
| 9 | **`system_config`** | Add app-side table for settings; dashboard expects it (`apps/admin-ui/src/features/settings/services/settings_actions.ts`, `packages/shared/src/schemas/settings.ts`). |
| 10 | **Marketplace user moderation state** | Establish canonical place for ban/suspend/restrict (e.g. `profiles.account_status`, `banned_reason`, `banned_at`, `banned_by_admin_id` or `user_restrictions` table). Fix dashboard so it does not mutate `admin_users` for end-user moderation. |
| 11 | **Force-logout / session revocation** | Add app-side revocation table, session versioning, or admin RPC; wire dashboard API route if needed. |
| 12 | **Risk flags and fraud rules** | Add app-side `user_risk_flags`, fraud rules, or risk-events table. |
| 13 | **Device/IP footprint for investigation** | Add app-side (or edge/telemetry) device fingerprint, IP history, or auth-event table for investigation views. |
| 14 | **Explicit admin moderation columns** | Add hide/lock/force-close/reason fields for tasks, bookings, messages, chat attachments in canonical app SQL. |
| 15 | **`admin_resolve_dispute` SQL** | Add or locate app-side SQL for `admin_resolve_dispute`; dashboard disputes route and legacy types reference it. |
| 16 | **Canonical ownership of admin finance helpers** | Move or duplicate `vw_admin_journal_ledger`, `admin_process_withdrawal`, `admin_process_wallet_freeze` into app repo migrations if app repo is the system-of-record for ledger. |

---

## 3. Not implemented (shared / integration — dashboard repo)

| # | What is not implemented | What we need to do |
|---|-------------------------|---------------------|
| 1 | **`packages/shared/src/schemas/auth.ts`** | Add canonical admin role enum; deduplicate role constants from `team.ts`, `users.ts`, `finance.ts`. |
| 2 | **`packages/shared/src/schemas/audit.ts`** | Add canonical audit action enum and mutation-ack schema; use for Idempotency-Key and audit responses. |
| 3 | **Masked/unmasked DTO split** | Add shared `UserSummaryMasked`, `UserDetailMasked`, `UserDetailRevealed`, `ChatMessageMasked`, `ChatMessageFull` (or equivalent) in shared schemas. |
| 4 | **Request/response contract alignment** | Replace ad hoc `ServiceResult<any>` with typed response schemas; fix admin-ui ↔ Fastify endpoint/schema drift (e.g. finance_api.ts vs finance routes). |

*Note: The audit also lists `packages/shared/src/schemas/cases.ts`, `reports.ts`, `search.ts`, `bookings.ts`, `chat.ts` as missing; the evidence tables state these exist in the dashboard. If any are still partial, add missing DTOs (case-gated chat access, reports queue, global search, booking moderation, chat moderation) per API Contract Map.*

---

## 4. Security / quality (dashboard)

| # | What is not implemented / at risk | What we need to do |
|---|------------------------------------|---------------------|
| 1 | **CI forbidden-import check** | Add CI step that fails the build if `apps/admin-ui` contains `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, or `auth.admin`. As of last scan the SPA was clean; enforce so it stays that way. |
| 2 | **Server-action-era `*_actions.ts` files** | Migrate or remove `apps/admin-ui/src/features/**/services/*_actions.ts` so the Vite SPA uses only API clients (no server-only patterns). |
| 3 | **Non-atomic audit** | Same as §1 item 7: move to same-transaction audit writes for privileged mutations. |
| 4 | **Chat-view governance (app side)** | Ensure case requirement, access log table, and thread-view logging exist (app migrations + dashboard chat route compliance). |

---

## 5. Quick reference — where things live

- **Dashboard app:** `apps/admin-ui` (Vite SPA), `apps/api` (Fastify).
- **Audit doc:** `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md`.
- **Legacy reference:** `legacy-source/`.
- **Shared schemas:** `packages/shared/src/schemas/`.
- **Dashboard migrations:** `supabase/migrations/` (this repo).
- **App migrations:** sline_app repo `supabase/migrations/` (for §2 items).

---

## 6. Suggested order of work (dashboard-only)

1. **Logs API** — confirm/add `GET /api/v1/logs`.
2. **Finance transaction detail** — add `GET /api/v1/finance/transactions/:journalId`.
3. **Team UI** — add `/team` route and page.
4. **Support** — add `/support` route and support API.
5. **Notifications** — add `/notifications` route and API.
6. **CI forbidden-import** — add gate so admin-ui stays clean.
7. **Idempotency-Key** — document and enforce on critical routes.
8. **Atomic audit** — plan and implement same-transaction audit for high-impact mutations.

App-backend items (§2) and shared/schema gaps (§3) can be scheduled in parallel with app-repo and shared-package owners.
