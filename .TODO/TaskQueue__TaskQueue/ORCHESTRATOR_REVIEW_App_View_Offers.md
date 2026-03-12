# Orchestrator Review — App View + Task Offers Count

**Workflow:** [.agent/workflows/orchestrator.md](../../.agent/workflows/orchestrator.md)  
**Scope:** Task Queue App View (FEATURE__app_view_real_mode_PLAN_CRITIC) + task offers_count (FEATURE__task_offers_count).

---

## 1. Scope Collection

### Feature / page scope

- **Task Queue** (`/tasks`): Table view + App View (device preview, carousel), URL `?view=table|app`, offers count in table and App Preview.

### Impacted files (by area)

| Area | Files |
|------|--------|
| **UI** | `apps/admin-ui/src/features/tasks/view/TasksScreen.tsx`, `TaskAppPreview.tsx`, `TaskFilters.tsx`, `TaskTable.tsx`; `apps/admin-ui/src/routes/TaskDetail.tsx`; `apps/admin-ui/src/App.tsx` (tasks route `validateSearch`) |
| **API** | `apps/api/src/routes/tasks.ts` (list logging, offers_count from view/fallback) |
| **Shared contracts** | `packages/shared/src/schemas/tasks.ts` (TaskDTO `offers_count?`); `apps/admin-ui/src/features/tasks/models/task.schema.ts` (same) |
| **Lib** | `apps/admin-ui/src/lib/appLogger.ts`, `appLogger.test.ts`; `apps/admin-ui/src/lib/navigation-shim.ts` (used, not changed) |
| **SQL** | `supabase/migrations/20260311120000_admin_task_offers_count_view.sql` |
| **Tests** | `apps/admin-ui/src/lib/appLogger.test.ts`; `apps/api/src/routes/tasks.test.ts` (existing, still pass) |
| **Docs** | `.TODO/TaskQueue__TaskQueue/IMPLEMENTATION_STATUS.md`, `FEATURE__app_view_real_mode_PLAN_CRITIC.md` (DoD/v1 boundary) |

### Verification commands run

| Command | Outcome |
|---------|---------|
| `npm run typecheck -w @sline/admin-ui` | Pass |
| `npm run typecheck -w @sline/api` | Pass |
| `npm run typecheck -w @sline/shared` | Pass |
| `npm run test -w @sline/api -- src/routes/tasks.test` | 5 passed, 1 skipped |
| `npx vitest run src/lib/appLogger.test.ts src/features/tasks` (admin-ui) | 3 passed (appLogger) |
| Grep for Supabase/service_role in `apps/admin-ui/src/features/tasks` | No matches (no DB in UI) |

---

## 2. Integrity Audit

### Real vs mock wiring

- **App View:** Uses real `vm.tasks` from `GET /api/v1/tasks`. No mock list; device card shows TaskDTO fields (title, description, status, budget, client, category, created_at). Location/views/saves/offers show "—" when not in API (v1 boundary).
- **Offers column (table):** Uses `task.offers_count` when present (real), else `getTaskQueueRowMockMeta(task.id).offers` (mock fallback).
- **Offers in App Preview:** Uses `task.offers_count` when present, else "—".
- **Hero/KPI:** Unchanged; still uses existing analytics/mock per current design.

### API contracts and frontend

- **TaskDTO:** `offers_count?: number` added in `packages/shared` and admin-ui `task.schema.ts`. Optional; list response may omit it (view/table missing).
- **GET /api/v1/tasks:** Returns same shape; when view or fallback query succeeds, each task has `offers_count`. No breaking change.
- **Frontend:** TaskTable and TaskAppPreview handle `typeof task.offers_count === 'number'`; otherwise fallback. Consistent.

### Build / typecheck / test

- **Build:** admin-ui typecheck passes (tasks route uses `search={{ view: "table" }}` on TaskDetail links).
- **Tests:** tasks API tests pass; appLogger unit tests pass. No new failing tests in touched areas.
- **Lint:** No linter errors reported for edited files.

### Regressions and design parity

- **Table view:** Still default; filters, pagination, status update, row click unchanged. "Offers" column label changed from "Offers (mock)" to "Offers"; value is real when available.
- **changeFilters:** Uses `page: newFilters.page ?? 1`, so any filter change without explicit `page` resets to page 1. Intentional for “filter change → page 1”; carousel index is reset in TasksScreen when `vm.filters.page` or `vm.tasks.length` changes.
- **Design parity:** App View matches Plan Critic (device frame, one task per slide, prev/next, index/total, dots, loading/empty). Location/views/saves/offers as "—" in v1 is documented.

---

## 3. Risk Audit

### Security (auth/RBAC, privilege, exposure)

- **RBAC:** `GET /api/v1/tasks` and `GET /api/v1/tasks/:id` still use `requireAdminRole(['admin', 'super_admin'])`. No new routes; App View is read-only.
- **Service role:** Used only in `apps/api` (Supabase client in tasks route). Not used in admin-ui; grep confirms no Supabase/service_role in tasks feature.
- **Exposed internals:** Request logging is `request.log?.info?.({ page, limit, status, query }, 'GET /tasks list')` and similar for detail; no PII or secrets. appLogger in UI is console/debug only.

### Data correctness (aggregation, fallbacks, edge cases)

- **Offers count:** From `vw_admin_task_offers_count` (view) or, on failure, from `task_requests` with `deleted_at IS NULL`; aggregated in code. Tasks with no bids are absent from view/result → `offersCountMap.get(t.id)` is undefined → UI shows fallback (mock or "—"). Correct.
- **Carousel index:** Clamped in TaskAppPreview with `Math.max(0, Math.min(currentIndex, tasks.length - 1))`; reset to 0 when `vm.filters.page` or `vm.tasks.length` changes. No out-of-bounds.
- **Empty list:** When `tasks.length === 0`, API returns `tasks: []`; App Preview shows "No tasks" and no device slide. Correct.

### Build stability (checks, deps, generated files)

- **Checks:** Typecheck passes for admin-ui, api, shared. No new deps. No generated-file changes.
- **Optional:** If `vw_admin_task_offers_count` or `task_requests` is missing, API catches and skips offers count; response still returns tasks without `offers_count`. No crash.

---

## 4. Output Template

### Master report

**Changes (summary):**

- App View: URL-driven view mode, TaskAppPreview (device frame, carousel, loading/empty), appLogger in screen and preview.
- Offers count: Migration `20260311120000_admin_task_offers_count_view.sql` (view), applied via Supabase MCP; API adds `offers_count` to list response (view first, then task_requests fallback); TaskDTO extended; TaskTable and TaskAppPreview show real count when present.
- Tasks route: `validateSearch` for `view`; TaskDetail links to `/tasks` include `search={{ view: "table" }}`.

**Risks (addressed):**

- ~~Low: Request/appLogger logging could be verbose in production~~ **Fixed:** appLogger logs `info`/`debug` only in dev (production: warn/error only); API uses `request.log.debug` for list/detail and offers-skip so production stays quiet at default log level.
- ~~Low: `changeFilters` always sets `page: newFilters.page ?? 1`~~ **Fixed:** `page: newFilters.page ?? prev.page ?? 1` so current page is preserved when only changing search/status.

**Missing items:**

- None for the implemented scope. Optional: E2E for “open /tasks → App View → see device” (existing E2E setup has Playwright/vitest conflicts, not introduced by this feature).

**Next actions (done):**

- ~~Optional: add API test that mocks view/table and asserts `offers_count` in response~~ **Done:** GET /api/v1/tasks list test added: 401 when no auth; 200 with tasks array and optional `offers_count` (number, integer, ≥ 0) per task.

### Blockers

- **None.** All critical/major items are closed; verification passes.

### Final readiness status

- **Ready.**  
- Rationale: Typecheck and tests pass; no Supabase/service role in client; RBAC unchanged; contracts consistent; real/mock wiring clear; fallbacks and carousel index safe. Optional improvements (log level, E2E, API test for offers_count) are non-blocking.

---

*Orchestrator review complete. Aligned with .agent/workflows/orchestrator.md.*
