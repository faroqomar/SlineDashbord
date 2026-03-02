# Chat Moderation (PAGE 09)

> **Status**: v1  
> **Last Updated**: 2025-03-02

## Purpose

Admins can view chat thread content only when it is **case-gated**: the thread must be linked to an investigation case, and the admin must open the thread via that case (passing `case_id`). Every thread **view** and every **access grant** is logged in `admin_chat_access_logs` for accountability. This prevents unfettered access to user conversations.

**Who it's for**: Support, Moderator, Admin, Super Admin (same as Cases).

---

## Flow

1. **Case exists**: Create or open a case (PAGE 08 — see `Docs/features/cases.md`).
2. **Link thread to case**: Either attach the conversation as an entity to the case (`entity_type: 'conversation'`, `entity_id: threadId`), or call **Grant access** (POST) to record the link and allow viewing.
3. **View thread**: From case detail, use "View thread" for a conversation entity, or open `/chat/threads/:threadId?case_id=:caseId`. The API returns messages only if the case is linked to the thread and logs the view in `admin_chat_access_logs`.

---

## Routes / Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/chat/threads/$threadId` | `ChatThreadPage` (ChatThread.tsx) | Thread messages. **Requires** `case_id` in query; otherwise shows "Thread content requires a case". Case comes from URL/query (e.g. from case detail "View thread" link). |

Entry point: Case detail screen — "View thread" when the selected entity is a conversation (`entity_type === 'conversation'`).

---

## API

| Method | Path | RBAC | Description |
|--------|------|------|-------------|
| POST | `/api/v1/chat/threads/:threadId/access` | support, moderator, admin, super_admin | Grant access: link case to thread. Body: `{ caseId, reason? }`. Inserts row in `admin_chat_access_logs` with `view_scope: 'grant'`. 400 if `threadId` or `caseId` invalid (e.g. not UUID). 403 if case not found. |
| GET | `/api/v1/chat/threads/:threadId` | same | Return thread metadata + messages. **Query**: `case_id` (required), `limit` (optional, 1–500, default 500). 400 if `threadId` not a valid UUID. 403 if `case_id` missing, case not found, or case not linked to thread. Inserts row in `admin_chat_access_logs` with `view_scope: 'view'` then returns data. |

- **threadId**: Path param must be a valid UUID (400 otherwise).
- **case_id**: Required for GET; case must exist and be linked to the thread (via prior grant or `admin_case_entities` with `entity_type = 'conversation'` and `entity_id = threadId`).
- **limit**: GET only; caps message count for large threads (default 500, max 500).

Request/response shapes: `packages/shared/src/schemas/chat.ts` (e.g. `GrantChatAccessInputSchema`, `ChatThreadResponseSchema`).

---

## ViewModels

- **useChatThreadViewModel** (`features/chat/viewmodels/useChatThread.vm.ts`): Thread state (thread, messages, isLoading, error), loadThread(caseId). Uses `chatApi` only; no DB. Requires `threadId` and `caseId` from route/query.

---

## Special Rules

- **RBAC**: Both endpoints use `CHAT_ADMIN_ROLES` (support, moderator, admin, super_admin) via `requireAdminRole` in `apps/api/src/routes/chat.ts`.
- **Audit**: Every view and every grant writes one row to `admin_chat_access_logs` (thread_id, case_id, viewer_admin_id, view_scope, reason, created_at). This is **not** `audit_logs`; it is a dedicated access log for chat moderation accountability.
- **Validation**: `threadId` must be a valid UUID (400 with `VALIDATION_ERROR`). GET requires `case_id`; missing or unlinked case returns 403.
- **Performance**: GET thread applies an optional `limit` (default 500) to the messages query to cap response size.

---

## Related

- **Cases (PAGE 08)**: `Docs/features/cases.md` — create case, attach conversation entity; cases are required for chat access.
- **Migration**: `supabase/migrations/20260302130000_admin_cases_and_chat_access.sql` creates `admin_chat_access_logs`. See `MIGRATIONS/README.md` (PAGE 08 / PAGE 09).
