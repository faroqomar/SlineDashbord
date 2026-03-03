# Global Search (PAGE 11)

## Purpose

Admins can search **users**, **tasks**, **bookings**, **disputes**, and **transactions** from one place. Results link to the corresponding detail screens. Minimum 2 characters; optional type filter; read-only (no audit write for the search request).

## Routes / Screens

- **Search**: `apps/admin-ui/src/routes/Search.tsx` → `SearchScreen` at `/search`. Single input, optional type filters (when exposed in UI), results list with entity badge and link to detail.

## API Endpoints

| Method | Path | Description | RBAC |
|--------|------|-------------|------|
| GET | `/api/v1/search` | Global search. Query params: `q` (min 2, max 200 chars), `types` (optional comma-separated: user,task,booking,dispute,transaction), `limit` (default 20, max 50). | Any authenticated admin (support, moderator, admin, super_admin) |

## ViewModels / API Client

- **API client**: Uses shared `request()` from `apps/admin-ui/src/lib/api.ts` — `GET /search?q=...&types=...&limit=...`.
- **ViewModel**: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` — `query`, `setQuery`, `types`, `setTypes`, `results`, `loading`, `error`, `timedOut`, `retry`. Debounce 300ms; client timeout 10s.

## Contracts (packages/shared)

- **Request/query**: `AdminGlobalSearchQuerySchema` (q, types, limit).
- **Response**: `AdminGlobalSearchResultSchema` — `items: AdminGlobalSearchResultItem[]` (discriminated union by `entityType`: user, task, booking, dispute, transaction). Each item has `entityType`, `id`, `title`, optional `subtitle`, `link`.

## Special rules

- **RBAC**: Any authenticated admin role may call search; no per-entity restriction.
- **Audit**: Search is read-only; no `audit_logs` insert for the search request.
- **Input safety**: Query `q` is sanitized (%, _, single quote escaped) before use in PostgREST filters.
- **Timeout**: API timeout 8s (configurable via `SEARCH_TIMEOUT_MS`); 503 + `x-request-id` on timeout or Supabase error.

## DB / Migrations

- No new migration in dashboard or app repo for PAGE 11. Search aggregates from existing tables/views: `profiles`, `tasks`, `bookings`, `disputes`, `vw_admin_journal_ledger`. See **Docs/PAGE_11_search_discovery.md** for entities, columns, and index notes. p95 gate and rollback: **Docs/runbooks/search-p95.md**.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
