# PerfOpt Report — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Agent:** @PerfOpt

---

## 1) Pagination strategy

| Endpoint / UI | Strategy | Evidence |
|---------------|----------|----------|
| GET investigation | Single response (no pagination) | [Verified in dashboard code] apps/api/src/routes/users.ts — returns full graph (profile, tasks, offers, bookings, disputes, ledger, reportsStub, conversationsSummary). |
| GET conversations | Single response | [Verified in dashboard code] Same file — list of conversation summaries. |
| GET evidence-pack | Query param `limit` (max 10k) | [Verified in dashboard code] EvidencePackExportQuerySchema; no cursor. |

**Finding:** Investigation and conversations are unbounded in count; for heavy users, response size could grow. Plan did not require cursor pagination; acceptable for MVP. **Recommendation (task):** If product requires scale, add cursor/limit to investigation sub-feeds (e.g. tasks, bookings) and document in API contract.

---

## 2) N+1 risk

| Code path | Risk | Evidence |
|-----------|------|----------|
| GET investigation | Multiple sequential Supabase calls (profile, tasks, offers, bookings, disputes, ledger, reportsStub, conversations) | [Verified in dashboard code] users.ts — separate .from() / .select() calls. MED: consider single RPC or batched reads if latency becomes an issue. |
| POST reveal-pii | One profile select + one insert (admin_pii_access_logs) | [Verified in dashboard code] No N+1. |

---

## 3) Bundle bloat

| Area | Status | Evidence |
|------|--------|----------|
| admin-ui PAGE 15 | No new heavy deps | [Verified in dashboard code] UserInvestigation.tsx uses existing stack (React, TanStack Query/Router, request, lucide-react). No new chart/vendor libs. |
| API | No new runtime deps | [Verified in dashboard code] users.ts uses existing @sline/shared, supabase-js, audit. |

---

## 4) Indexes / queries (tasks only, no code)

| Task | Owner | Note |
|------|-------|------|
| If vw_admin_journal_ledger is slow for entity_id filter | @SysOp | Ensure index on underlying table(s) for entity_id (or view definition optimized). |
| If investigation aggregation becomes slow | @SysOp | Consider materialized view or dedicated RPC that returns one JSON payload. |

---

**Decision:** No blocker. Pagination is single-shot by design; N+1 and bundle are acceptable for scope. Recommendations are optional follow-ups.
