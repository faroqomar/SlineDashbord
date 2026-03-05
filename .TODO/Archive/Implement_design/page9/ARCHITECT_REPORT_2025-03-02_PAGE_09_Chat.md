# Admin Architect Report — PAGE 09 Chat (2025-03-02)

**Scope**: PAGE_09_Chat (Chat Moderation with Case-Gated Access)  
**Plan**: Plan in MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (PAGE 09)  
**Evidence**: Verified in dashboard code and app code

---

## 1) MVVM Boundary Check

### View vs ViewModel
- **Verified in dashboard code**: `ChatThread.tsx` (View) uses `useChatThread(threadId, caseId)` only; no direct API or DB calls. Data and loading/error come from the hook.
- **Verified in dashboard code**: `useChatThread.vm.ts` calls `chatApi.getThread()`; no Supabase or server-only imports. `chat_api.ts` uses `request()` from `lib/api` (Fastify only).
- **Conclusion**: View → ViewModel (hook) → chat_api → Fastify. MVVM boundary respected.

### Route parity (TanStack Router)
- **Verified in dashboard code**: Route `/chat/threads/$threadId` exists in `App.tsx` as `chatThreadRoute`; component `ChatThreadPage`. Entry from Case detail: `CaseDetailScreen.tsx` has "View thread" `Link` to `/chat/threads/$threadId` with `search={{ caseId }}` for `entity_type === 'conversation'`.
- **Evidence**: `apps/admin-ui/src/App.tsx` (chatThreadRoute), `apps/admin-ui/src/routes/ChatThread.tsx`, `apps/admin-ui/src/features/cases/view/CaseDetailScreen.tsx`.

---

## 2) Contract Needs

| Contract | Status | Evidence |
|----------|--------|----------|
| `packages/shared/src/schemas/chat.ts` | **Present** | Verified in dashboard code: GrantChatAccessInputSchema, ChatThreadAccessReceiptSchema, ChatMessageMasked/Full, ChatThreadSummary, ChatThreadResponseSchema. |
| cases.ts (caseId) | **Present** | Verified: cases schema exists; chat uses caseId from query/body. |

No missing contracts for PAGE 09 scope.

---

## 3) Exact File Paths (PAGE 09)

- **Route**: `apps/admin-ui/src/routes/ChatThread.tsx`
- **Feature**: `apps/admin-ui/src/features/chat/` — `services/chat_api.ts`, `viewmodels/useChatThread.vm.ts`
- **API**: `apps/api/src/routes/chat.ts` (registered under `/api/v1/chat`)
- **Contracts**: `packages/shared/src/schemas/chat.ts` (exported in index)
- **Migration**: `supabase/migrations/20260302130000_admin_cases_and_chat_access.sql`

---

## 4) Blocking Defects (Architect)

- **None**. View does not call API directly; no DB/Supabase in admin-ui chat feature. Route and case entry point present.

---

## 5) Recommendations

1. Optional: Add a dedicated chat feature route index (e.g. re-export from feature) for consistency with other features.
2. Case detail "View thread" correctly passes `caseId` via search; ChatThread reads `caseId` from URL (router + window fallback). No change required.

---

**Conclusion**: Architecture aligned with MVVM; View → VM (hook) → API client. No blocking defects. **APPROVED**.
