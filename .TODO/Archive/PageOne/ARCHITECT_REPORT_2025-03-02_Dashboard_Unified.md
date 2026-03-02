# Admin Architect Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Verified in app code (dashboard repo)

---

## 1) MVVM Boundary Check

### View vs ViewModel
- **Verified in dashboard code**: Routes/views consume ViewModels only for data/actions.
  - `DashboardIndex.tsx` → `useDashboardViewModel()` (dashboard_api).
  - `UsersScreen` → `useUsersViewModel()` (users_api).
  - Disputes, Tasks, Finance, Support, Settings use feature viewmodels that call API clients.
- **Verified**: No `supabase`, `createAdminClient`, or server-only imports in `apps/admin-ui/src`.
- **Note**: Some view components import API functions directly (e.g. `InviteAdminDialog` → `inviteMember`, `AdminTable` → `removeMember`). These are action callbacks, not data-fetch; acceptable if triggered by user and not used for initial load. Recommendation: prefer routing all API calls through the feature ViewModel for consistency.

### Route parity (TanStack Router)
- **Verified**: Routes under `apps/admin-ui/src/routes/`: DashboardIndex, Users, UserDetail, Tasks, TaskDetail, Finance, FinanceWithdrawals, FinanceTransactions, Disputes, DisputeDetail, Logs, Settings, Login.
- **Evidence**: Plan references /users, /tasks, /finance, /disputes, /logs, /settings; routes exist and are wired.

---

## 2) Contract Needs (Missing / To Add)

| Contract | Status | Owner |
|----------|--------|--------|
| `packages/shared/src/schemas/audit.ts` | **Missing** | SysOp |
| AuditActionEnum, MutationAckSchema, AuditLogRowSchema | Required for PAGE 02 | SysOp |
| auth.ts (AdminRole enum) | If not present | SysOp |
| bookings.ts, cases.ts, reports.ts, chat.ts | Per later pages | SysOp |

**Evidence**: `packages/shared/src/schemas/` contains analytics, finance, settings, support, logs, team, tasks, disputes, users — no `audit.ts`. Verified in repo.

---

## 3) Exact File Paths (Structure)

- **Routes**: `apps/admin-ui/src/routes/*.tsx` (13 route files).
- **Features**: `apps/admin-ui/src/features/{dashboard,users,team,support,settings,disputes,tasks,finance,analytics,logs,core}/` with models, services (api), viewmodels, views/components.
- **API client entry**: Views/ViewModels call `*_api` in `features/<feature>/services/`; central `request()` likely in `lib/api.ts` or equivalent.

---

## 4) Blocking Defects (Architect)

- **None** in admin-ui for forbidden imports (no server-only Supabase, no next/*). Evidence: grep for `admin_logs`, `createAdminClient`, `@/lib/supabase`, `@/types/supabase`, `next/` in `apps/admin-ui/src` returned no matches.

---

## 5) Recommendations

1. Add `packages/shared/src/schemas/audit.ts` (SysOp) and wire audit DTOs where API returns audit data.
2. Prefer single entry point per feature: ViewModel calls API; views only call ViewModel (optional cleanup for InviteAdminDialog/AdminTable/TicketHeader).
3. Ensure route paths in Sidebar/navigation match TanStack route definitions (already aligned per current codebase).

---

**Conclusion**: Architecture is aligned with Vite SPA + ViewModel → API client. No blocking defects in admin-ui. Contract gap: audit schemas in shared (PAGE 02).
