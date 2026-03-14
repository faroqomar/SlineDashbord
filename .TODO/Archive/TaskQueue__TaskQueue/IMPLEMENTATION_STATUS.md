# Task Queue — Implementation Status

## App View Plan (FEATURE__app_view_real_mode_PLAN_CRITIC.md)

**Status: Fully implemented.** No SQL was required by this plan.

- **Phase 0:** Build + appLogger — Done.
- **Phase 1–2:** Contracts/API unchanged for v1 — Done (v1 uses existing TaskDTO).
- **Phase 3:** View mode in URL (`?view=table` | `?view=app`) — Done (TanStack Router `validateSearch` on `/tasks`).
- **Phase 4:** TaskAppPreview (device frame, carousel, prev/next, dots, loading/empty) — Done.
- **Phase 5:** Tests (appLogger unit tests, API tests) — Done.

**SQL changes for App View:** None.

---

## Task Offers Count (FEATURE__task_offers_count.PLAN.md)

**Status: Implemented.** SQL applied via Supabase MCP.

### SQL (applied via Supabase MCP)

- **Migration:** `supabase/migrations/20260311120000_admin_task_offers_count_view.sql`
- **View:** `public.vw_admin_task_offers_count` (task_id, offers_count) from `task_requests` where `deleted_at IS NULL`.
- **Applied:** Yes — via `user-supabase` MCP `apply_migration` (project: Sline Project).

### API

- **GET /api/v1/tasks:** Returns `offers_count` per task (from view, or fallback query to `task_requests`; if both fail, field omitted).
- **Logging:** Request log for list; offers count path logs on skip if view/table missing.

### Contracts

- **packages/shared** and **apps/admin-ui** `TaskDTO`: optional `offers_count?: number`.

### UI

- **TaskTable:** “Offers” column shows `task.offers_count` when present, else mock.
- **TaskAppPreview:** “Offers” section shows count when present, else “—”.

---

## How to re-apply SQL via Supabase MCP

If you need to apply the migration to another project or re-run it:

1. **List projects:** `list_projects` (no args) → get `id` (project_id).
2. **Apply migration:** `apply_migration` with:
   - `project_id`: from step 1
   - `name`: `admin_task_offers_count_view`
   - `query`: contents of `supabase/migrations/20260311120000_admin_task_offers_count_view.sql`

Or use Supabase CLI: `supabase db push` (from repo root with linked project).
