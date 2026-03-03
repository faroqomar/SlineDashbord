# PAGE 11 — Global Search: Discovery Artifact

**Plan:** [.TODO/PLAN_PAGE_11_Global_Search.md](../.TODO/PLAN_PAGE_11_Global_Search.md)  
**Decisions:** D1 = API aggregation, D2 = min 2 chars, D3 = transactions via journal/view.

---

## 1. Implementation decision (D1)

**Choice: API aggregation.** Dashboard API aggregates multiple Supabase queries (no single `admin_global_search` RPC in app repo for first ship). If p95 fails, add RPC in app repo later.

---

## 2. Per-entity table/RPC and columns

| Entity       | Source (table/view/RPC)     | Search columns / method |
|-------------|-----------------------------|--------------------------|
| **user**    | `profiles`                  | `full_name`, `email` — `.or(\`full_name.ilike.%q%,email.ilike.%q%\`)`; align with existing users list (apps/api/src/routes/users.ts). App repo has `search_profiles` RPC; if available and contract matches, prefer RPC. |
| **task**    | `tasks`                     | `title`, `id` — `.ilike('title', \`%q%\`)` or `.eq('id', q)` when q looks like UUID; same as tasks list. |
| **booking** | `bookings`                  | `id` (UUID); optional: join tasks for title. Search by id or task_id; list uses `id, task_id, client_id, provider_id, status, ...`. |
| **dispute** | `disputes`                  | `id`; optional: filter by status. List uses select with task/complainant; for search use id or simple text on id. |
| **transaction** | `vw_admin_journal_ledger` | `journal_id`, `entity_id`, `entity_type`; search by journal_id (UUID) or entity_id. Same view as finance transactions list. |

---

## 3. Indexes (existing or propose)

- **profiles:** Existing indexes on `full_name`, `email` or generic btree; if slow, add GIN/btree for ilike (app repo).
- **tasks:** Typically `created_at`, `status`; add index on `title` for ilike if p95 fails (app repo).
- **bookings:** Usually `created_at`, `status`; search by id is primary key.
- **disputes:** Usually `created_at`, `status`; search by id is primary key.
- **vw_admin_journal_ledger:** View; underlying `journal_entries` / ledger tables—indexes per app repo. Search by journal_id is key lookup.

**Decision:** Use existing indexes first. If p95 ≥ 500ms in staging, add indexes in **app repo** per MIGRATIONS/README.md.

---

## 4. Security (Phase 2)

- **Role matrix:** Any authenticated admin role (support, moderator, admin, super_admin) may call `GET /api/v1/search`. No per-entity restriction. Search is read-only; no `audit_logs` insert for the search request.

---

## 5. Fixture / test strategy

- **Integration tests:** Use existing API test pattern (buildApp with testUser). Search fixtures: rely on existing DB seed or mock Supabase responses; fixture path documented in tests (apps/api/src/routes/search.test.ts). DataSmith: minimal seed for users/tasks/bookings/disputes/transactions so “returns expected entity types” is deterministic.

---

## 6. References

- Users list: `apps/api/src/routes/users.ts` (profiles, ilike)
- Tasks list: `apps/api/src/routes/tasks.ts` (tasks, ilike title)
- Bookings: `apps/api/src/routes/bookings.ts` (bookings table)
- Disputes: `apps/api/src/routes/disputes.ts` (disputes table)
- Finance/transactions: `apps/api/src/routes/finance.ts` (vw_admin_journal_ledger)
- Audit (search_profiles): SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md — `search_profiles` RPC in app repo (Verified in SQL).
