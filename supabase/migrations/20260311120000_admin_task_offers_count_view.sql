-- Admin Task Queue: per-task offers count for list/table and App View.
-- Source: task_requests (bids/offers on tender tasks). Apply via Supabase MCP or CLI.
-- Requires: public.tasks, public.task_requests (canonical schema in sline_app).

-- View for admin list: task_id -> offers_count (non-deleted task_requests only).
CREATE OR REPLACE VIEW public.vw_admin_task_offers_count AS
SELECT
  tr.task_id,
  count(*)::int AS offers_count
FROM public.task_requests tr
WHERE tr.deleted_at IS NULL
GROUP BY tr.task_id;

COMMENT ON VIEW public.vw_admin_task_offers_count IS 'Admin-only: per-task count of task_requests (bids). Used by GET /api/v1/tasks list and App View.';
