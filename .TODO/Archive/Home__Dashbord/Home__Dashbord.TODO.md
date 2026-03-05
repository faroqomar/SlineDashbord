# Home / Dashbord TODO Summary

## 1. Page Overview

- **Page:** Home
- **Tab:** Dashbord
- **UI target:** Figma dashboard redesign (dark control-room style).
- **Current implementation location:** `apps/admin-ui/src/routes/DashboardIndex.tsx`
- **Data flow:** `DashboardIndex` -> `useDashboardViewModel` -> `dashboardApi.getOverview()` -> `GET /api/v1/dashboard/overview`

This page now includes:
- Hero banner (greeting + title + live time/date block)
- KPI cards
- Platform Pulse strip
- Revenue Dynamics chart
- User Growth chart
- Recent Activity rail
- Sidebar/Topbar alignment improvements for this tab

## 2. Existing Features Already Linked

The following are wired to existing app features/APIs:

- **Dashboard route**
  - `/` route points to Dashboard page.
  - File: `apps/admin-ui/src/App.tsx`

- **Dashboard overview data (real)**
  - Uses existing API: `GET /dashboard/overview`
  - File: `apps/admin-ui/src/features/dashboard/services/dashboard_api.ts`
  - Consumed by: `apps/admin-ui/src/features/dashboard/viewmodels/use_dashboard_viewmodel.ts`

- **Real metrics currently used**
  - `stats.activeUsers`
  - `stats.platformRevenue`
  - `stats.activeJobs`
  - `stats.openDisputes`
  - `revenueHistory`
  - `userGrowth`
  - `recentActivity`
  - Files:
    - `apps/admin-ui/src/features/dashboard/services/dashboard_api.ts`
    - `apps/admin-ui/src/routes/DashboardIndex.tsx`

- **Tasks Queue navigation**
  - Sidebar now links to existing `/tasks` feature route.
  - File: `apps/admin-ui/src/components/layout/Sidebar.tsx`

- **Search entrypoint linkage**
  - Header search submit now navigates to existing `/search` page.
  - File: `apps/admin-ui/src/components/layout/Header.tsx`

- **Logs entrypoint linkage**
  - Dashboard activity header links to `/logs` route (existing page, currently placeholder).
  - Files:
    - `apps/admin-ui/src/routes/DashboardIndex.tsx`
    - `apps/admin-ui/src/routes/Logs.tsx`

## 3. Missing Features (Design References But Backend/Feature Not Implemented)

These design-referenced data points are not backed by dedicated dashboard-ready APIs yet:

- **Platform Pulse**
  - Open Reports (live count)
  - Open Cases (live count)
  - Bookings Today (live count)
  - System Status (live canonical status)

- **KPI trend deltas**
  - Card trend badges (e.g., `+12%`, `+5.4%`, `No change`) are not computed from backend analytics windows.

- **Logs destination parity**
  - `/logs` exists but is still a placeholder screen, not a full logs product experience.

## 4. What We Mocked And Why

Mocks are centralized in:
- `apps/admin-ui/src/features/dashboard/view/dashboard.mock.ts`

Mocked items:
- `openReports`
- `openCases`
- `bookingsToday`
- `systemStatus`
- KPI trend text badges (`totalUsers`, `totalRevenue`, `activeJobs`, `openDisputes`)

Why mocked:
- No dedicated, already-available dashboard endpoint contract currently returns these exact values in one stable shape.
- Scope rule for this task was UI-first with **no new backend feature implementation**.

Notes:
- `dashboard.mock.ts` marks each pulse item with `isMock` so UI can clearly label mocked data.
- `activeTasks` and `openDisputes` in Pulse are reused from real `stats` when available.

## 5. Implementation Plan For Missing Features (High-Level)

1. **Define dashboard pulse contract**
   - Extend existing `/dashboard/overview` response or add a small read-only `/dashboard/pulse` payload.
   - Include: `openReports`, `openCases`, `bookingsToday`, `systemStatus`.

2. **Define trend analytics contract**
   - Add trend fields for each KPI using agreed comparison windows.
   - Example shape: `{ value, deltaPercent, trendDirection, comparisonLabel }`.

3. **Wire frontend to real pulse + trend fields**
   - Replace mock constants in `dashboard.mock.ts` with API data.
   - Keep fallback-safe UI for missing/null values.

4. **Upgrade Logs page**
   - Replace current placeholder with paginated logs table/cards aligned with dashboard “View all”.

5. **Validation**
   - Add/extend UI tests for:
     - Real vs mock rendering behavior
     - Empty and loading states
     - Pulse and trend rendering when API responds with partial data

## 6. Risks / Dependencies / Required APIs

### Risks
- **Data inconsistency risk:** counts may not match across reports/cases/bookings screens unless query definitions are standardized.
- **Timezone risk:** `bookingsToday` needs a canonical timezone decision (UTC vs product local timezone).
- **Performance risk:** assembling pulse metrics from multiple heavy queries can slow dashboard load.
- **Permission risk:** all aggregates must remain admin-RBAC protected.

### Dependencies
- API route ownership for dashboard (`apps/api/src/routes/dashboard.ts`)
- Reports, Cases, Bookings data sources and status definitions
- Optional observability source for system status

### Required API Inputs (minimum)
- `openReportsCount`
- `openCasesCount`
- `bookingsTodayCount`
- `systemStatus` (enum or normalized string)
- KPI trend fields for each card (or enough historical values to compute in API)

