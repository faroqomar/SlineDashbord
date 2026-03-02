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
import { FinanceWithdrawalsPage } from './routes/FinanceWithdrawals';
import { DisputesPage } from './routes/Disputes';
import { DisputeDetailPage } from './routes/DisputeDetail';
import { SettingsPage } from './routes/Settings';
import { TasksPage } from './routes/Tasks';
import { TaskDetailPage } from './routes/TaskDetail';
import { LogsPage } from './routes/Logs';
import { request } from './lib/api';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ThemeProvider } from './components/theme-provider';
import './index.css';

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="sline-admin-theme">
      <Outlet />
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

const financeWithdrawalsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/finance/withdrawals',
  component: FinanceWithdrawalsPage,
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

// Settings Route
const settingsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

// Tasks Route
const tasksRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/tasks',
  component: TasksPage,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/tasks/$taskId',
  component: TaskDetailPage,
});

// Logs Route (placeholder until logs API exists)
const logsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/logs',
  component: LogsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authLayoutRoute.addChildren([
    indexRoute, 
    usersRoute, 
    userDetailRoute, 
    financeRoute, 
    financeTransactionsRoute,
    financeWithdrawalsRoute,
    disputesRoute,
    disputeDetailRoute,
    settingsRoute,
    tasksRoute,
    taskDetailRoute,
    logsRoute,
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
