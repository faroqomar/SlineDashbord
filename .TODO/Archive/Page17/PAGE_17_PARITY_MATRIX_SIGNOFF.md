# Page 17 — Parity Matrix Sign-Off (Repo-Verifiable)

**Source:** MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (Legacy parity matrix, lines 696–703)  
**Rule:** Do not run Phase 6 (Remove legacy-source) while any row has Status ❌.

| Legacy surface   | Vite route path                          | API route path              | Shared schema path              | Status |
|------------------|------------------------------------------|-----------------------------|----------------------------------|--------|
| Support/complaints | Missing `/support`                      | Missing `/api/v1/support`   | packages/shared: support.ts exists | ❌     |
| Logs             | apps/admin-ui/src/routes/Logs.tsx        | Missing `/api/v1/logs`      | packages/shared/src/schemas/logs.ts | ❌     |
| Team             | Missing `/team`                         | apps/api/src/routes/team.ts | packages/shared: team.ts         | ❌     |
| Notifications    | Missing `/notifications`                | Missing `/api/v1/notifications` | Missing dedicated contract   | ❌     |
| System health    | Missing `/system-health`                 | Only `/health`; no `/api/v1/observability` | Missing observability contract | ❌     |
| Finance audit    | Missing `/finance/audit`                 | Missing export/audit API    | finance.ts (no export contract) | ❌     |
| Finance user lookup | Missing `/finance/users/$userId`      | Missing user-lookup endpoint | finance.ts (no user-lookup contract) | ❌     |

**Additional parity (from Phase 3 table):** Users, Tasks, Disputes, Finance (list/transactions/withdrawals), Settings, Bookings, Reports, Cases, Chat — present in Vite and API. Not in the above Legacy parity matrix rows; full sign-off for Page 17 requires the seven rows above all ✅.

**Conclusion:** Parity matrix has **7 ❌**. Phase 6 (Remove legacy-source) is **blocked** until Pages 07–14 (Support, Logs, Team, Notifications, System health, Finance audit/export/user lookup) deliver and this file is updated to all ✅.
