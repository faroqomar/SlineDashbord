# Runbook: Global Search p95 Latency Gate (PAGE 11)

**Plan:** [.TODO/PLAN_PAGE_11_Global_Search.md](../.TODO/PLAN_PAGE_11_Global_Search.md)  
**Gate:** p95 latency < 500ms over N runs in staging (or staging-sized data).

---

## 1. When to run

- After deploying search API/DB changes.
- Before release if PAGE 11 is in scope.
- When observability shows search p95 approaching 500ms.

## 2. Prerequisites

- Staging (or local with staging-like DB) has seed data for users, tasks, bookings, disputes, and transactions.
- Admin auth cookie or Bearer token for `GET /api/v1/search`.

## 3. Steps

1. **Run search 20 times** with a representative query (e.g. `q=test` or a known user name/task title).
   - Example (curl):
     ```bash
     for i in $(seq 1 20); do
       curl -s -o /dev/null -w "%{time_total}\n" -b "sb_session=YOUR_COOKIE" "https://STAGING_URL/api/v1/search?q=test&limit=20"
     done
     ```
   - Or use a script that collects response times.

2. **Compute p95** of the 20 response times (e.g. sort and take the 19th value, or use `percentile(times, 95)`).

3. **Pass criteria:** p95 < 500ms. If p95 ≥ 500ms:
   - Check slow query logs for search-related queries.
   - Per [Docs/PAGE_11_search_discovery.md](../PAGE_11_search_discovery.md), add or adjust indexes in the **app repo** (canonical DB).
   - Re-run this runbook after deploying index changes.

## 4. Rollback

- **Hide search:** Remove or comment the Search nav link in `apps/admin-ui` and optionally return 404 for `/search` until fixed.
- No data rollback; search is read-only.

## 5. Optional CI

To automate in CI: run the 20 requests in a job against a staging-like target, compute p95, and fail the job if p95 ≥ 500ms. Fixture/seed must provide enough data for representative latency.
