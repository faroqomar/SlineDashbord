# PerfOpt Report — PAGE 09 Chat (2025-03-02)

**Scope**: PAGE_09_Chat (Chat Moderation with Case-Gated Access)  
**Plan**: MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (PAGE 09)  
**Evidence**: Verified in app code and dashboard code

---

## 1) Pagination Strategy

- **GET thread**: Returns all messages for one thread in one response. No pagination. **Verified in app code**: `apps/api/src/routes/chat.ts` — single select from `messages` with `order('created_at', { ascending: true })`.
- **Risk**: **LOW** for typical moderation threads (hundreds of messages). If threads can grow to thousands, add cursor/limit later.
- **Recommendation**: Document as known limit; add optional `?limit=` and `cursor` in a future iteration if needed.

---

## 2) N+1 Risk

- **Verified in app code**: One query for access log check, one for case existence, one for conversation, one for messages. No loop over entities that triggers per-item queries. No N+1.
- **Status**: **PASS**.

---

## 3) Indexes / Queries

- **Verified in dashboard code**: Migration creates `idx_admin_chat_access_logs_thread_case` and `idx_admin_chat_access_logs_created_at`. Lookups by (thread_id, case_id) are indexed.
- **Recommendation**: Ensure `messages(conversation_id)` has an index (app repo schema); not in dashboard migration. Task for app repo if not present.

---

## 4) Bundle / Admin-UI

- Chat feature adds: ChatThread page, useChatThread hook, chat_api. No heavy deps. **Verified in dashboard code**.
- **Status**: **PASS** (no bundle bloat concern).

---

**Conclusion**: No blocking performance issues. Optional: document message limit or add pagination for very large threads later.
