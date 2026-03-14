import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  RouterProvider, 
  Outlet, 
  redirect
} from '@tanstack/react-router';
import { LoginPage } from './routes/Login';
import { UsersPage } from './routes/Users';
import { UserDetailPage } from './routes/UserDetail';
import { DashboardIndex } from './routes/DashboardIndex';
import { FinancePage } from './routes/Finance';
import { FinanceTransactionsPage } from './routes/FinanceTransactions';
import { FinanceTransactionDetailPage } from './routes/FinanceTransactionDetail';
import { FinanceWithdrawalsPage } from './routes/FinanceWithdrawals';
import { FinanceApprovalsPage } from './routes/FinanceApprovals';
import { FinanceAuditPage } from './routes/FinanceAudit';
import { FinanceUsersPage, FinanceUserLookupPage } from './routes/FinanceUsers';
import { DisputesPage } from './routes/Disputes';
import { DisputeDetailPage } from './routes/DisputeDetail';
import { SettingsPage } from './routes/Settings';
import { TasksPage } from './routes/Tasks';
import { TaskDetailPage } from './routes/TaskDetail';
import { BookingsPage } from './routes/Bookings';
import { BookingDetailPage } from './routes/BookingDetail';
import { CasesPage } from './routes/Cases';
import { CaseDetailPage } from './routes/CaseDetail';
import { LogsPage } from './routes/Logs';
import { ReportsPage } from './routes/Reports';
import { ChatThreadPage } from './routes/ChatThread';
import { UserInvestigationPage } from './routes/UserInvestigation';
import { SystemHealthPage } from './routes/SystemHealth';
import { SearchPage } from './routes/Search';
import { request } from './lib/api';
import { getSystemConfigs } from './features/settings/services/settings_api';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import './index.css';

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="sline-admin-theme">
      <Outlet />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  ),
});

// Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Authenticated Layout Route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  beforeLoad: async ({ location }) => {
    const result = await request<{ user: any }>('GET', '/auth/me');
    if (!result.ok) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
    return { user: result.data.user };
  },
  component: DashboardLayout,
});

// Index Route
const indexRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/',
  component: DashboardIndex,
});

// Users Route
const usersRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/users',
  component: UsersPage,
});

// User Detail Route
const userDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/users/$userId',
  component: UserDetailPage,
});

// User Investigation (PAGE 15)
const userInvestigationRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/users/$userId/investigation',
  component: UserInvestigationPage,
});

// Finance Route
const financeRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance',
  component: FinancePage,
});

const financeTransactionsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/transactions',
  component: FinanceTransactionsPage,
});

const financeTransactionDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/transactions/$journalId',
  component: FinanceTransactionDetailPage,
});

const financeWithdrawalsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/withdrawals',
  component: FinanceWithdrawalsPage,
});

const financeApprovalsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/approvals',
  component: FinanceApprovalsPage,
});

const financeAuditRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/audit',
  component: FinanceAuditPage,
});

const financeUsersIndexRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/users',
  component: FinanceUsersPage,
});

const financeUserLookupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/users/$userId',
  component: FinanceUserLookupPage,
});

// Disputes Route
const disputesRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/disputes',
  component: DisputesPage,
});

const disputeDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/disputes/$disputeId',
  component: DisputeDetailPage,
});

// Settings Route (PAGE 13 — system config; loader fetches config + canManage via /auth/me)
const settingsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/settings',
  loader: async () => {
    const [meRes, configRes] = await Promise.all([
      request<{ user: { role?: string } }>('GET', '/auth/me'),
      getSystemConfigs(),
    ]);
    const configs = configRes.success ? configRes.data : [];
    const canManage = meRes.ok && meRes.data?.user?.role === 'super_admin';
    return { configs, canManage };
  },
  component: SettingsPage,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">Loading settings…</div>
  ),
});

// Tasks Route (search: view=table|app for App View persistence)
const tasksRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/tasks',
  validateSearch: (search: Record<string, unknown>) => ({
    view: search?.view === 'app' ? 'app' : 'table',
  }),
  component: TasksPage,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/tasks/$taskId',
  component: TaskDetailPage,
});

// Bookings Route
const bookingsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/bookings',
  component: BookingsPage,
});

const bookingDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/bookings/$bookingId',
  component: BookingDetailPage,
});

// Logs Route (placeholder until logs API exists)
const logsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/logs',
  component: LogsPage,
});

// Reports Route
const reportsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/reports',
  component: ReportsPage,
});

// Cases Route (PAGE 08)
const casesRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/cases',
  component: CasesPage,
});

const caseDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/cases/$caseId',
  component: CaseDetailPage,
});

// Chat thread (case-gated; requires ?caseId=...)
const chatThreadRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/chat/threads/$threadId',
  component: ChatThreadPage,
});

// System Health (PAGE 14 — Observability)
const systemHealthRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/system-health',
  component: SystemHealthPage,
});

// PAGE 11 — Global Search
const searchRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/search',
  component: SearchPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authLayoutRoute.addChildren([
    indexRoute, 
    usersRoute, 
    userDetailRoute, 
    userInvestigationRoute,
    financeRoute,
    financeTransactionsRoute,
    financeTransactionDetailRoute,
    financeWithdrawalsRoute,
    financeApprovalsRoute,
    financeAuditRoute,
    financeUsersIndexRoute,
    financeUserLookupRoute,
    disputesRoute,
    disputeDetailRoute,
    settingsRoute,
    tasksRoute,
    taskDetailRoute,
    bookingsRoute,
    bookingDetailRoute,
    casesRoute,
    caseDetailRoute,
    logsRoute,
    reportsRoute,
    chatThreadRoute,
    systemHealthRoute,
    searchRoute,
  ]),
]);

const router = createRouter({ 
  routeTree,
  context: {
    user: undefined,
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
