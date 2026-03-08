# Feature Plan: Booking Server-Side Search, Filters, and Sort

## Feature Goal

Move Booking list toolbar behavior from in-memory filtering to server-side query execution for scalable, accurate result sets.

## UX Behavior From Design

1. Search field filters bookings by booking code, service title, category, client, and provider.
2. Status chips remain instant and reset pagination to page 1 on change.
3. Result count reflects server-filtered dataset, not only current page memory.
4. Sorting remains deterministic across pages (default by newest created).
5. Loading skeleton appears on each query/filter transition.

## Data Contracts Needed (API Endpoints / Schemas)

1. Extend existing endpoint:
- `GET /api/v1/bookings`

2. Query params (additive):
- `page`, `pageSize`, `status`
- `q`
- `sort` (`created_desc`, `created_asc`, `price_desc`, `price_asc`)

3. Shared schema updates in `packages/shared/src/schemas/bookings.ts`:
- Extend `BookingListQuerySchema` for `q` and `sort`
- Keep `BookingListResponseSchema` compatible

## Steps (Backend then Frontend)

### Backend

1. [@SysOp] Extend query validation for `q` and `sort` allowlist values.
2. [@SysOp] Add query builder logic for search across approved fields.
3. [@SysOp] Implement deterministic sort mapping with safe defaults.
4. [@SysOp] Ensure count/totalPages reflect filtered query.
5. [@PerfOpt] Verify query plan and add indexes if needed for search/sort paths.

### Frontend

1. [@AdminArchitect] Extend `bookingsApi.getList()` params in `bookings_api.ts`.
2. [@AdminArchitect] Update `use_bookings_viewmodel.ts` filter model to include `q` and `sort`.
3. [@UIExpert] Wire search input in `Bookings.tsx` to ViewModel filter state with debounce.
4. [@UIExpert] Remove local `filteredRows` logic for server-managed filtering (keep local fallback only if API missing).
5. [@CodeWarden] Verify pagination and count semantics match server results.

## Tests (Unit / Integration / Smoke)

### Unit

1. Query schema tests for valid/invalid sort values.
2. ViewModel tests for filter transitions and page reset behavior.

### Integration

1. API tests for list endpoint with combinations:
- `q` only
- `status` only
- `q + status + sort`
- invalid sort returns `400`

### Smoke

1. Manual flow on Bookings: type search, switch status chips, paginate.
2. Confirm list count and page behavior remain consistent.
3. Confirm loading skeleton appears during in-flight fetches.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep new query params optional and backward-compatible.
2. If server filtering regresses, temporarily disable `q/sort` from frontend while retaining status filter.
3. Preserve existing endpoint path and response envelope to avoid client breakage.
4. Monitor API latency/error rate for filter-heavy queries after rollout.
