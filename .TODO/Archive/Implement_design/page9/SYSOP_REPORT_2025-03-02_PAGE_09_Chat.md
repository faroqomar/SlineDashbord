# SysOp Report — PAGE 09 Chat (2025-03-02)

**Scope**: PAGE_09_Chat (Chat Moderation with Case-Gated Access)  
**Plan**: MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (PAGE 09)  
**Evidence**: Verified in app code and dashboard code

---

## 1) Endpoint Inventory (Fastify)

| Method | Path | Purpose | Evidence |
|--------|------|---------|----------|
| POST | `/api/v1/chat/threads/:threadId/access` | Grant access for case; log to admin_chat_access_logs (view_scope=grant) | Verified in app code: `apps/api/src/routes/chat.ts` |
| GET | `/api/v1/chat/threads/:threadId?case_id=` | Return thread messages when case linked; log view to admin_chat_access_logs | Verified in app code: same file |

Routes registered in `apps/api/src/app.ts` under prefix `/api/v1/chat`.

---

## 2) Contract Map (packages/shared)

| Schema | Used by | Evidence |
|--------|---------|----------|
| GrantChatAccessInputSchema | POST access body (caseId, reason?) | Verified in app code: chat.ts safeParse |
| ChatThreadAccessReceiptSchema | POST access response | Verified in app code: response shape |
| ChatThreadResponseSchema | GET thread response | Verified in app code: response shape |
| ChatMessageFullSchema | Part of ChatThreadResponse | Verified in dashboard code: chat.ts |

All exported from `packages/shared/src/schemas/chat.ts` and `packages/shared/src/index.ts`.

---

## 3) DB / RPC Requirements

| Object | Location | Evidence |
|--------|----------|----------|
| admin_cases | Dashboard repo migration | Verified in dashboard code: `supabase/migrations/20260302130000_admin_cases_and_chat_access.sql` |
| admin_case_entities | Same migration | Same file |
| admin_chat_access_logs | Same migration | Same file; indexes on (thread_id, case_id) and created_at |
| conversations, messages | App repo (existing) | Plan assumes app has these; chat route reads from them via service-role |

Migration is in dashboard repo; comment states it can be copied to sline_app for production. No RPC used for chat (direct inserts/selects).

---

## 4) Audit / Access Log Compliance

- **Verified in app code**: Every successful GET thread inserts one row into `admin_chat_access_logs` (view_scope = 'view') before returning messages. Every successful POST access inserts one row (view_scope = 'grant').
- **Atomicity**: Access log insert and message read are separate operations; if log insert fails, request returns 500 and no messages are returned. Log is not tied to audit_logs in this flow; plan required "every view logs access" in admin_chat_access_logs — satisfied.
- **No withAudit** used in chat routes; no audit_logs row for chat view/grant (plan did not require audit_logs for PAGE 09, only admin_chat_access_logs).

---

## 5) Schema / Drift

- **Verified**: POST body accepts `caseId` or `case_id` (normalized to caseId for schema). GET query uses `case_id`. API and shared schema align.
- **Thread identity**: thread_id = conversation id; messages selected by `conversation_id = threadId`. Plan states thread maps to conversation — correct.

---

## 6) Blocking Defects (SysOp)

- **None**. Endpoints exist, contracts in shared, migration present, access logging on every view/grant. If `conversations` or `messages` tables are missing in DB, GET returns 404 or 500 (documented behavior).

---

**Conclusion**: Backend/API/contracts/DB aligned with plan. No schema drift. **APPROVED**.
