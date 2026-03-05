# SecGuard — Security Review: PAGE 09 Chat (2025-03-02)

**Scope**: PAGE_09_Chat (Chat Moderation with Case-Gated Access)  
**Plan**: MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (PAGE 09)  
**Evidence**: Verified in dashboard code and app code

---

## 1) Forbidden Imports Scan (admin-ui)

- **Requirement**: admin-ui must NOT contain server-only Supabase, createAdminClient, auth.admin, service role.
- **Evidence**: Grep in `apps/admin-ui/src/features/chat` for `supabase`, `createClient`, `service_role`, `admin` → **no matches**. Chat feature uses only `request()` from `lib/api` (Fastify). Verified in dashboard code.
- **Status**: **PASS**.

---

## 2) RBAC Enforcement

- **Evidence**: Both chat routes use `requireAdminRole(CHAT_ADMIN_ROLES)` with `CHAT_ADMIN_ROLES = ['support', 'moderator', 'admin', 'super_admin']`. Verified in app code: `apps/api/src/routes/chat.ts` lines 62, 120.
- **Status**: **PASS** (RBAC on POST access and GET thread).

---

## 3) Case-Gated Chat Access

- **Requirement**: No thread content without case_id; every view and grant logged.
- **Evidence**: GET `/api/v1/chat/threads/:threadId` returns 403 if `case_id` missing; validates case exists and case linked to thread; inserts into `admin_chat_access_logs` (view_scope = 'view') before returning messages. POST access inserts (view_scope = 'grant'). Verified in app code.
- **Status**: **PASS**.

---

## 4) Input Validation (Zod)

- **Evidence**: POST body validated with `GrantChatAccessInputSchema.safeParse`; caseId required (UUID). GET rejects missing case_id. threadId from params not validated as UUID (Fastify path param). Optional: add UUID validation for threadId.
- **Status**: **PASS** (body validated); **LOW**: path param threadId could be validated.

---

## 5) Audit / Write-Then-Audit

- **Evidence**: Chat does not use `withAudit` or `audit_logs` for view/grant. It writes to `admin_chat_access_logs` only. Order: for GET, insert access log first; if insert fails return 500 (no messages returned). For POST, insert grant log; if fail return 500. No "write then audit" semantic; access log is the required side effect.
- **Status**: **PASS** (no privileged mutation without logging; log failure fails the request).

---

## 6) PII / Masking

- **Scope**: Plan mentioned "PII masking baseline" in DB scope. Implementation returns full message body when case-gated; no separate masked DTO path for chat in this scope. ChatMessageMaskedSchema exists in shared but is not used by GET response (GET returns full messages for case-gated view).
- **Status**: **LOW** — Acceptable for PAGE 09; optional follow-up: role-based masked vs full for support vs admin.

---

## Decision

**APPROVED**. No blockers. Case-gating and access logging enforced; no service-role in admin-ui; RBAC and Zod on endpoints.
