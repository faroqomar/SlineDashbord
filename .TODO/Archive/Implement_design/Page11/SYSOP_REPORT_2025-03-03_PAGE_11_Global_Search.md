# SysOp Report: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Evidence:** Verified in dashboard code / Verified in SQL per audit.

---

## 1. Endpoint inventory (Fastify)

| Method | Path | Handler | RBAC | Validation |
|--------|------|---------|------|------------|
| GET | /api/v1/search | search.ts (GET /) | requireAdminRole(['support','moderator','admin','super_admin']) | AdminGlobalSearchQuerySchema (q, types, limit) |

**Verified in dashboard code:** Route registered in app.ts with prefix `/api/v1/search`. Single handler; no other methods.

---

## 2. Contract map (packages/shared)

- **Verified in dashboard code:** `packages/shared/src/schemas/search.ts` — AdminSearchEntityTypeEnum, AdminGlobalSearchRequestSchema, AdminGlobalSearchQuerySchema, AdminGlobalSearchResultSchema, AdminGlobalSearchResultItemSchema (discriminated union), item schemas per entity type. Exported from `packages/shared/src/index.ts`.
- **Verified in dashboard code:** API uses AdminGlobalSearchQuerySchema for query params and AdminGlobalSearchResultSchema for response. No ad hoc shapes.

---

## 3. DB / RPC requirements

- **Verified in dashboard code:** Search uses Supabase client (service-role) against: `profiles`, `tasks`, `bookings`, `disputes`, `vw_admin_journal_ledger`. No new RPC introduced; aggregation in API only. Discovery doc: Docs/PAGE_11_search_discovery.md.
- **Verified in SQL (audit):** App repo has `search_profiles` RPC; dashboard does not use it (uses profiles table with ilike). No migration required in app repo for first ship; indexes “use existing” per discovery.

---

## 4. audit_logs atomicity

- **Verified in dashboard code:** Search is read-only. No mutations; no audit_logs write. Compliant (N/A for read-only).

---

## 5. Exact SQL object names + route paths

- Tables/views: `profiles`, `tasks`, `bookings`, `disputes`, `vw_admin_journal_ledger`.
- Route path: `GET /api/v1/search` (apps/api/src/routes/search.ts mounted at prefix `/api/v1/search`).

---

## 6. Findings (drift / gaps)

| Finding | Severity | Evidence | Recommendation |
|---------|----------|----------|----------------|
| Query string built with user input in `.or()` | MED | Verified in dashboard code: search.ts builds `full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`; only % and _ escaped. Single quotes in `q` could break or abuse filter. | Sanitize `q` (e.g. strip or escape single quotes) or use parameterized filter if Supabase client supports it. |
| Sequential entity queries | LOW | Verified in dashboard code: runSearch() awaits profiles, then tasks, then bookings, then disputes, then transactions in sequence. | Consider Promise.all for parallel queries to reduce latency (within same 8s timeout). |

---

**Decision:** No BLOCKER. API and contracts aligned; one MED finding (input in filter string).
