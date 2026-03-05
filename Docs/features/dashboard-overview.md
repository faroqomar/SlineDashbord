# Dashboard Overview

## Purpose

Show high-level platform status and trends for admin operators with live KPI cards, pulse strip, charts, and recent activity.

## Route / Screen

- Route: `/`
- Route file: `apps/admin-ui/src/routes/DashboardIndex.tsx`
- ViewModel: `apps/admin-ui/src/features/dashboard/viewmodels/use_dashboard_viewmodel.ts`

## API Endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/dashboard/overview` | Aggregated dashboard payload (stats, pulse, trends, charts, recent activity) |

## Dashboard Payload

- `stats`: active users, platform revenue, open disputes, active jobs
- `pulse`: open reports, open cases, active tasks, open disputes, bookings today, system status
- `kpiTrends`: trend direction + delta labels for key metrics
- `recentActivity`: latest activity feed
- `revenueHistory`: chart series
- `userGrowth`: chart series

## Shared Contracts

- `packages/shared/src/schemas/dashboard.ts`
  - `DashboardOverviewDataSchema`
  - `DashboardPulseSchema`
  - `DashboardKpiTrendsSchema`

## Security / Rules

- Endpoint protected by admin RBAC middleware.
- Read-only aggregation route; no privileged mutation from dashboard overview.

## Verification

- `npm --prefix apps/api run test -- src/routes/dashboard.test.ts`
- `npm --prefix apps/admin-ui run test -- src/features/dashboard/view/dashboard.view.test.ts`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
