# Dashboard Current State

## Monorepo Layout Inventory

- [Verified in dashboard code] Root workspaces are `apps/*` and `packages/*`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json`.
- [Verified in dashboard code] `apps/admin-ui` is the Vite admin SPA. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json`.
- [Verified in dashboard code] `apps/api` is the Fastify admin API. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/package.json`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts`.
- [Verified in dashboard code] `packages/shared` contains shared Zod contracts and `ServiceResult<T>` helpers. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/index.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/result.ts`.
- [Verified in dashboard code] `legacy-source` is the old Next-based implementation still present for parity reference. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app`.

## Fastify Endpoints Inventory

- [Verified in dashboard code] Registered API route prefixes are `/api/v1/auth`, `/api/v1/users`, `/api/v1/finance`, `/api/v1/team`, `/api/v1/disputes`, `/api/v1/tasks`, `/api/v1/dashboard`, plus `/health`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/index.ts`.

| File | Routes |
| --- | --- |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/auth.ts` | [Verified in dashboard code] `POST /api/v1/auth/session`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts` | [Verified in dashboard code] `GET /api/v1/users/`, `GET /api/v1/users/:userId`, `POST /api/v1/users/:userId/ban`, `POST /api/v1/users/:userId/unban` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts` | [Verified in dashboard code] `POST /api/v1/finance/withdrawals/:requestId/approve`, `POST /api/v1/finance/withdrawals/:requestId/reject`, `POST /api/v1/finance/wallets/:userId/freeze`, `GET /api/v1/finance/metrics`, `GET /api/v1/finance/transactions`, `GET /api/v1/finance/withdrawals` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts` | [Verified in dashboard code] `POST /api/v1/team/invite`, `DELETE /api/v1/team/:userId` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts` | [Verified in dashboard code] `GET /api/v1/disputes/`, `GET /api/v1/disputes/:id`, `POST /api/v1/disputes/:id/resolve` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts` | [Verified in dashboard code] `GET /api/v1/tasks/`, `GET /api/v1/tasks/:id`, `GET /api/v1/tasks/:id/activity`, `POST /api/v1/tasks/:id/status` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts` | [Verified in dashboard code] `GET /api/v1/dashboard/overview` |

## Admin UI Route Inventory

- [Verified in dashboard code] Current TanStack Router routes are declared centrally in the SPA root. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.

| File | Route |
| --- | --- |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx` | [Verified in dashboard code] `/login` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/DashboardIndex.tsx` | [Verified in dashboard code] `/` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Users.tsx` | [Verified in dashboard code] `/users` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserDetail.tsx` | [Verified in dashboard code] `/users/$userId` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Finance.tsx` | [Verified in dashboard code] `/finance` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/FinanceTransactions.tsx` | [Verified in dashboard code] `/finance/transactions` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/FinanceWithdrawals.tsx` | [Verified in dashboard code] `/finance/withdrawals` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Disputes.tsx` | [Verified in dashboard code] `/disputes` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/DisputeDetail.tsx` | [Verified in dashboard code] `/disputes/$disputeId` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Settings.tsx` | [Verified in dashboard code] `/settings` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Tasks.tsx` | [Verified in dashboard code] `/tasks` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/TaskDetail.tsx` | [Verified in dashboard code] `/tasks/$taskId` |

## Shared Schemas Inventory

- [Verified in dashboard code] Shared package exports the current admin contracts from `src/index.ts`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/index.ts`.
- [Verified in dashboard code] Users contracts: `GetUsersSchema`, `GetUserDetailsSchema`, `SuspendUserSchema`, `BanUserSchema`, `UnbanUserSchema`, `VerifyUserSchema`, `USERS_READ_ROLES`, `USERS_WRITE_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts`.
- [Verified in dashboard code] Tasks contracts: `TaskStatusSchema`, `TaskDTO`, `TaskDetailsDTO`, `GetTasksSchema`, `UpdateTaskStatusSchema`, `TASKS_READ_ROLES`, `TASKS_WRITE_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/tasks.ts`.
- [Verified in dashboard code] Finance contracts: `ApproveWithdrawalSchema`, `RejectWithdrawalSchema`, `FreezeWalletSchema`, `UnfreezeWalletSchema`, `SoftDeleteUserSchema`, `ExportCSVSchema`, `TransactionDetailsSchema`, `UserLookupSchema`, `EntityTraceSchema`, `TransactionFiltersSchema`, `JournalLedgerEntrySchema`, `WithdrawalRequestSchema`, `FINANCE_READ_ROLES`, `FINANCE_WRITE_ROLES`, `FINANCE_SUPERADMIN_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts`.
- [Verified in dashboard code] Dispute contracts: `DisputeDTO`, `GetDisputesSchema`, `UpdateDisputeStatusSchema`, `DISPUTES_READ_ROLES`, `DISPUTES_WRITE_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/disputes.ts`.
- [Verified in dashboard code] Team contracts: `AdminUserDTO`, `InviteMemberSchema`, `UpdateRoleSchema`, `RemoveMemberSchema`, `TEAM_READ_ROLES`, `TEAM_WRITE_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/team.ts`.
- [Verified in dashboard code] Logs contracts: `LogDTO`, `GetSystemLogsSchema`, `GetLogsByTargetSchema`, `LOGS_READ_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/logs.ts`.
- [Verified in dashboard code] Support contracts: `SupportTicketSchema`, `SupportTicketDTO`, `GetTicketsSchema`, `UpdateTicketStatusSchema`, `SUPPORT_READ_ROLES`, `SUPPORT_WRITE_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/support.ts`.
- [Verified in dashboard code] Settings contracts: `SystemConfigSchema`, `MaintenanceModeSchema`, `AppBannerSchema`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/settings.ts`.
- [Verified in dashboard code] Analytics contracts: `OverviewStats`, `ActivityItem`, `PendingItem`, `RevenueChartData`, `UserGrowthChartData`, `ANALYTICS_READ_ROLES`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/analytics.ts`.

## Current Build Failures And Root Causes

- [Verified in dashboard code] Root build currently fails because `@sline/admin-ui` fails typecheck during `npm run build` and `npm run typecheck -w @sline/admin-ui`. Refs: repo scripts in `/Users/eros/Dev/Eros_Projects/SlineDashbord/package.json`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json`.
- [Verified in dashboard code] Missing dependency or typings: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx` imports `react-day-picker`, but the module is not resolved by the current workspace typecheck. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/calendar.tsx`.
- [Verified in dashboard code] Invalid Lucide icon imports: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/sonner.tsx` imports `CircleCheckIcon`, `OctagonXIcon`, and `TriangleAlertIcon`, which are not exported by the installed `lucide-react` package version used by the repo. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/ui/sonner.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/package.json`.
- [Verified in dashboard code] Next-only server-action remnants still exist in the Vite app, including imports of `@/lib/supabase/admin`, `@/lib/supabase/server`, `next/cache`, and `use server`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/dashboard/services/analytics_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/health/services/health_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/logs/services/log_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/services/support_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/team/services/team_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/services/user_actions.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/core/security/security_guards.ts`.
- [Verified in dashboard code] Missing migrated component modules break the Vite app, including `@/components/users/UserSearch`, `@/components/users/PaginationControls`, `@/components/users/UserActionsMenu`, `@/components/dashboard/StatusBadge`, and `@/data/mock/complaints`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/users/views/UsersScreen.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/view/components/TicketList.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/support/view/components/TicketNotes.tsx`.
- [Verified in dashboard code] Missing generated or shared type modules break finance code, including unresolved `@/types/supabase` and `@sline/shared`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance/models/finance.model.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/lib/api.ts`.
- [Verified in dashboard code] TanStack Router typed route references are incorrect in several files because `useSearch` and `useParams` refer to un-prefixed route IDs rather than the generated typed route paths. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/FinanceTransactions.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/FinanceWithdrawals.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserDetail.tsx`.
- [Verified in dashboard code] Additional type issues remain in async transition handlers and prop mismatches, including the `filters` prop passed to `WithdrawalsTable`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/FinanceWithdrawals.tsx` and related finance components under `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/finance`.

## Known Drift Points

- [Verified in dashboard code] `audit_logs` versus `admin_logs` drift is active today because overview and some manual inserts target `audit_logs`, while `withAudit(...)` and task activity target `admin_logs`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`.
- [Missing repo evidence] `admin_users` is expected throughout dashboard auth and team flows, but app SQL evidence is missing. Refs: dashboard usage in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/auth.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/team.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`; search app SQL with `rg -n "admin_users" /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`.
- [Missing repo evidence] `vw_admin_journal_ledger` and analytics views are assumed by dashboard code without app migration evidence. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts`; search app SQL with `rg -n "vw_admin_journal_ledger|vw_analytics_monthly_revenue|vw_analytics_monthly_user_growth" /Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations`.
- [Verified in dashboard code] Several dangerous mutations are still table-updates plus best-effort audit inserts, not single atomic RPCs. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/audit.ts`.

## Legacy Next Pages Inventory And Missing Vite Parity

| Legacy page file | Legacy route | Vite parity status |
| --- | --- | --- |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/login/page.tsx` | [Verified in dashboard code] `/login` | [Verified in dashboard code] Present in Vite at `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Login.tsx` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/page.tsx` | [Verified in dashboard code] `/dashboard` | [Verified in dashboard code] Rebased to `/` in Vite at `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/DashboardIndex.tsx` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/users/page.tsx` | [Verified in dashboard code] `/dashboard/users` | [Verified in dashboard code] Present as `/users` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/users/[id]/page.tsx` | [Verified in dashboard code] `/dashboard/users/[id]` | [Verified in dashboard code] Partial parity as `/users/$userId`; legacy page contains broader audit and wallet investigation tabs than the Vite route |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/tasks/page.tsx` | [Verified in dashboard code] `/dashboard/tasks` | [Verified in dashboard code] Present as `/tasks` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/tasks/[id]/page.tsx` | [Verified in dashboard code] `/dashboard/tasks/[id]` | [Verified in dashboard code] Present as `/tasks/$taskId` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/disputes/page.tsx` | [Verified in dashboard code] `/dashboard/disputes` | [Verified in dashboard code] Present as `/disputes` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/disputes/[id]/page.tsx` | [Verified in dashboard code] `/dashboard/disputes/[id]` | [Verified in dashboard code] Present as `/disputes/$disputeId` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/page.tsx` | [Verified in dashboard code] `/dashboard/finance` | [Verified in dashboard code] Present as `/finance` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/transactions/page.tsx` | [Verified in dashboard code] `/dashboard/finance/transactions` | [Verified in dashboard code] Present as `/finance/transactions` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/withdrawals/page.tsx` | [Verified in dashboard code] `/dashboard/finance/withdrawals` | [Verified in dashboard code] Present as `/finance/withdrawals` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/overview/page.tsx` | [Verified in dashboard code] `/dashboard/finance/overview` | [Verified in dashboard code] Partial parity; current Vite `/finance` route covers overview but not all legacy navigation affordances |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx` | [Verified in dashboard code] `/dashboard/finance/audit` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx` | [Verified in dashboard code] `/dashboard/finance/users` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx` | [Verified in dashboard code] `/dashboard/logs` | [Verified in dashboard code] Missing Vite parity; current sidebar still links to `/dashboard/logs` from `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/components/layout/Sidebar.tsx` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/complaints/page.tsx` | [Verified in dashboard code] `/dashboard/complaints` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/notifications/page.tsx` | [Verified in dashboard code] `/dashboard/notifications` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/settings/page.tsx` | [Verified in dashboard code] `/dashboard/settings` | [Verified in dashboard code] Present as `/settings` |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx` | [Verified in dashboard code] `/dashboard/system-health` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/team/page.tsx` | [Verified in dashboard code] `/dashboard/team` | [Verified in dashboard code] Missing Vite parity |
| `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/unauthorized/page.tsx` | [Verified in dashboard code] `/unauthorized` | [Verified in dashboard code] Missing Vite parity |
