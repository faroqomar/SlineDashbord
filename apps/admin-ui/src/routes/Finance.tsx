import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRouteContext } from '@tanstack/react-router';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownCircle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  History,
  Landmark,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
} from 'lucide-react';
import { financeApi } from '../features/finance/services/finance_api';
import type { JournalLedgerEntry, WithdrawalRequest } from '../features/finance/models/finance.model';
import { TopUpApprovalDialog } from '../features/finance/components/TopUpApprovalDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type TrendTone = 'up' | 'down' | 'flat';

const MOCK_REVENUE_EXPENSE_DATA = [
  { month: 'Sep', revenue: 12000, expenses: 8000 },
  { month: 'Oct', revenue: 28000, expenses: 15000 },
  { month: 'Nov', revenue: 19000, expenses: 11000 },
  { month: 'Dec', revenue: 36000, expenses: 18000 },
  { month: 'Jan', revenue: 42000, expenses: 22000 },
  { month: 'Feb', revenue: 56000, expenses: 29000 },
  { month: 'Mar', revenue: 23000, expenses: 13000 },
];

const MOCK_DAILY_VOLUME_DATA = [
  { day: 'Mon', value: 8200 },
  { day: 'Tue', value: 6400 },
  { day: 'Wed', value: 9100 },
  { day: 'Thu', value: 7300 },
  { day: 'Fri', value: 11400 },
  { day: 'Sat', value: 5900 },
  { day: 'Sun', value: 3200 },
];

function formatIqd(value?: number): string {
  return `IQD ${(value ?? 0).toLocaleString()}`;
}

function formatEventType(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatStatus(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getTypePillClass(eventType: string): string {
  const normalized = eventType.toLowerCase();
  if (normalized.includes('withdraw')) return 'bg-[rgba(190,81,5,0.07)] text-[#fa7f2a]';
  if (normalized.includes('fee')) return 'bg-[rgba(34,5,118,0.07)] text-[#9c7df9]';
  if (normalized.includes('escrow')) return 'bg-[rgba(35,164,129,0.07)] text-[#47d7a3]';
  if (normalized.includes('top')) return 'bg-[rgba(5,67,145,0.07)] text-[#5eb1fa]';
  return 'bg-[rgba(27,158,75,0.07)] text-[#4ae081]';
}

function getStatusPillClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'failed') return 'bg-[rgba(159,14,14,0.07)] text-[#f04d4d]';
  if (normalized === 'pending' || normalized === 'processing') return 'bg-[rgba(195,126,8,0.07)] text-[#f6a823]';
  if (normalized === 'approved' || normalized === 'completed' || normalized === 'requested') {
    return 'bg-[rgba(27,158,75,0.07)] text-[#4ae081]';
  }
  return 'bg-[rgba(24,26,38,0.9)] text-[#b1aaa0]';
}

function getTrendClass(tone: TrendTone): string {
  if (tone === 'down') return 'bg-[#220c0c] text-[#f04d4d]';
  if (tone === 'flat') return 'bg-[rgba(24,26,38,0.9)] text-[#b1aaa0]';
  return 'bg-[#08190e] text-[#4ae081]';
}

function getUserLabel(tx: JournalLedgerEntry): string {
  const candidate = tx.payee_user_id ?? tx.payer_user_id;
  return candidate ? `${candidate.slice(0, 8)}...` : 'System';
}

function getUserInitials(value: string): string {
  if (value.length < 2) return value.toUpperCase();
  return `${value[0]}${value[1]}`.toUpperCase();
}

function FinanceDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Skeleton className="h-[228px] w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Skeleton className="h-[316px] w-full rounded-xl" />
        <Skeleton className="h-[316px] w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Skeleton className="h-[420px] w-full rounded-xl" />
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function FinancePage() {
  const routeContext = useRouteContext({ from: '__root__' });
  const userRole = ((routeContext as any).user?.role ?? '') as string;
  const canRequestTopUp = userRole === 'admin' || userRole === 'super_admin';
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = React.useState(false);

  const metricsQuery = useQuery({
    queryKey: ['finance', 'metrics'],
    queryFn: financeApi.getMetrics,
  });

  const transactionsQuery = useQuery({
    queryKey: ['finance', 'dashboard', 'transactions'],
    queryFn: () => financeApi.getTransactions({ limit: 10 }),
  });

  const withdrawalsQuery = useQuery({
    queryKey: ['finance', 'dashboard', 'withdrawals'],
    queryFn: () => financeApi.getWithdrawals({ limit: 5 }),
  });

  const metrics = metricsQuery.data;
  const recentTransactions = transactionsQuery.data?.data ?? [];
  const withdrawalQueue = withdrawalsQuery.data?.data ?? [];
  const pendingWithdrawalCount = withdrawalQueue.filter(
    (item) => item.status === 'requested' || item.status === 'processing'
  ).length;

  const isInitialLoading =
    (metricsQuery.isLoading && !metrics) ||
    (transactionsQuery.isLoading && recentTransactions.length === 0) ||
    (withdrawalsQuery.isLoading && withdrawalQueue.length === 0);

  const hasError = metricsQuery.isError || transactionsQuery.isError || withdrawalsQuery.isError;

  const refreshAll = () => {
    void Promise.all([metricsQuery.refetch(), transactionsQuery.refetch(), withdrawalsQuery.refetch()]);
  };

  if (isInitialLoading) return <FinanceDashboardSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Some finance sections failed to load. Showing available data.
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-[#7c7365] bg-[linear-gradient(165deg,#05151D_0%,#0C1222_40%,#081520_100%)] p-6">
        <div className="pointer-events-none absolute -right-14 -top-12 h-48 w-48 rounded-full bg-[#0677a9]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-[-32px] h-32 w-32 rounded-full bg-[#1b9e4b]/20 blur-3xl" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(133deg,rgba(6,119,169,0.19)_0%,rgba(27,158,75,0.13)_100%)] shadow-[0_0_24px_rgba(6,119,169,0.09)]">
                <Landmark className="h-6 w-6 text-[#42c0f8]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#e8e6e3]">Finance Dashboard</h2>
                <p className="mt-1 text-sm text-[#afa89d]">
                  Platform revenue, escrow, transactions & withdrawal management
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={refreshAll}
                className="h-10 rounded-xl border-[rgba(48,52,54,0.4)] bg-[rgba(24,26,27,0.3)] text-[#cecac4] hover:bg-[rgba(24,26,27,0.55)]"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl border-[rgba(48,52,54,0.4)] bg-[rgba(24,26,27,0.25)] text-[#3391ff] hover:bg-[rgba(24,26,27,0.55)]"
              >
                <Link to="/finance/audit">
                  <History className="mr-2 h-3.5 w-3.5" /> Audit Ledger
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl border-[rgba(6,111,158,0.45)] bg-[linear-gradient(153deg,rgba(6,119,169,0.19)_0%,rgba(6,119,169,0.08)_100%)] text-[#72cffc] hover:bg-[linear-gradient(153deg,rgba(6,119,169,0.28)_0%,rgba(6,119,169,0.12)_100%)]"
              >
                <Link to="/finance/users">
                  <Search className="mr-2 h-3.5 w-3.5" /> User Wallets
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(48,52,54,0.25)] bg-[rgba(24,26,27,0.2)] px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(6,119,169,0.12)]">
                <CircleDollarSign className="h-5 w-5 text-[#42c0f8]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6bd1ff]">Available Platform Cash</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-[#e8e6e3]">
                  {formatIqd(metrics?.platform_cash)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopUpDialogOpen(true)}
                disabled={!canRequestTopUp}
                className="h-10 rounded-xl border-[rgba(27,158,76,0.3)] bg-[rgba(27,158,75,0.08)] text-[#4ae081] disabled:opacity-80"
              >
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Top-up
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled
                className="h-10 rounded-xl border-[rgba(169,72,4,0.3)] bg-[rgba(190,81,5,0.08)] text-[#fa7f2a] disabled:opacity-80"
              >
                <ArrowDownCircle className="mr-2 h-3.5 w-3.5" /> Payout
              </Button>
              <Badge variant="outline" className="border-[#7f7668] bg-[rgba(24,26,27,0.35)] text-[#b1aaa0]">Payout mock</Badge>
            </div>
          </div>

        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(27,158,75,0.09)]">
              <ArrowUpRight className="h-4 w-4 text-[#4ae081]" />
            </div>
            <Badge className={`${getTrendClass('up')} border-none`}>+18% (Mock)</Badge>
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">Lifetime Revenue</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-[#e8e6e3]">{formatIqd(metrics?.lifetime_revenue)}</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(195,126,8,0.09)]">
              <Banknote className="h-4 w-4 text-[#f6a823]" />
            </div>
            <Badge className={`${getTrendClass('up')} border-none`}>0% (Mock)</Badge>
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">Escrow Held</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-[#e8e6e3]">{formatIqd(metrics?.escrow_held)}</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(5,67,145,0.09)]">
              <History className="h-4 w-4 text-[#5eb1fa]" />
            </div>
            <Badge className={`${getTrendClass('up')} border-none`}>+12 (Mock)</Badge>
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">Transactions</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-[#e8e6e3]">{recentTransactions.length}</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(34,5,118,0.09)]">
              <ArrowDownRight className="h-4 w-4 text-[#9c7df9]" />
            </div>
            <Badge className={`${getTrendClass('down')} border-none`}>+3 (Mock)</Badge>
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">Withdrawals</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-[#e8e6e3]">{withdrawalQueue.length}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-[#7f7668] bg-[#0e0f13] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#e8e6e3]">Revenue vs Expenses</h3>
              <p className="text-sm text-[#9d9588]">Last 7 months platform financials</p>
            </div>
            <Badge variant="outline" className="border-[#7f7668] bg-[rgba(24,26,27,0.35)] text-[#b1aaa0]">
              Mock
            </Badge>
          </div>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_EXPENSE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,149,136,0.32)" />
                <XAxis dataKey="month" tick={{ fill: '#9e9589', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9e9589', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12151c', border: '1px solid #7f7668', borderRadius: '10px', color: '#e8e6e3' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00f6a1" fill="rgba(27,158,75,0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ff4055" fill="rgba(159,14,14,0.12)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[#7f7668] bg-[#0e0f13] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#e8e6e3]">Daily Volume</h3>
              <p className="text-sm text-[#9d9588]">Transaction volume this week</p>
            </div>
            <Badge variant="outline" className="border-[#7f7668] bg-[rgba(24,26,27,0.35)] text-[#b1aaa0]">
              Mock
            </Badge>
          </div>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DAILY_VOLUME_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,149,136,0.32)" />
                <XAxis dataKey="day" tick={{ fill: '#9e9589', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9e9589', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12151c', border: '1px solid #7f7668', borderRadius: '10px', color: '#e8e6e3' }}
                />
                <Bar dataKey="value" fill="#0b87b6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13]">
          <div className="flex items-center justify-between border-b border-[#81786a] px-5 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#cecac4]" />
              <h3 className="text-base font-semibold text-[#e8e6e3]">Recent Transactions</h3>
              <span className="text-sm text-[#9d9588]">({recentTransactions.length})</span>
            </div>
            <Link to="/finance/transactions" className="text-xs font-medium text-[#42c0f8] hover:underline">
              View all
            </Link>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => {
                const isPositive = tx.net_amount >= 0;
                const amountClass = isPositive ? 'text-[#4ae081]' : 'text-[#f04d4d]';
                const amountPrefix = isPositive ? '+' : '';
                return (
                  <div key={tx.journal_id} className="grid grid-cols-[1.8fr_auto_auto_auto_auto] items-center gap-3 border-b border-[#81786a] px-5 py-3 text-xs last:border-b-0">
                    <div>
                      <p className="font-medium text-[#d9d6d1]">{formatEventType(tx.event_type)}</p>
                      <p className="mt-1 text-[#b1aaa0]">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`w-fit rounded px-2 py-1 text-[10px] font-medium ${getTypePillClass(tx.event_type)}`}>
                      {formatEventType(tx.event_type)}
                    </span>
                    <p className={`font-semibold ${amountClass}`}>
                      {amountPrefix}
                      {tx.net_amount.toLocaleString()}
                      <span className="ml-0.5 font-normal text-[#b1aaa0]">IQD</span>
                    </p>
                    <span className={`w-fit rounded px-2 py-1 text-[10px] font-medium ${getStatusPillClass(tx.status)}`}>
                      {formatStatus(tx.status)}
                    </span>
                    <div className="flex items-center gap-2 text-[#afa89d]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#181a26] text-[9px] font-bold">
                        {getUserInitials(getUserLabel(tx))}
                      </span>
                      <span>{getUserLabel(tx)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#9d9588]">No transactions found for this period.</div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13]">
          <div className="flex items-center justify-between border-b border-[#81786a] px-5 py-4">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-[#cecac4]" />
              <h3 className="text-base font-semibold text-[#e8e6e3]">Withdrawal Queue</h3>
            </div>
            <span className="rounded bg-[rgba(195,126,8,0.09)] px-2 py-1 text-[10px] font-bold text-[#f6a823]">
              {pendingWithdrawalCount} pending
            </span>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {withdrawalQueue.length > 0 ? (
              withdrawalQueue.map((item: WithdrawalRequest) => (
                <div key={item.id} className="border-b border-[#81786a] px-5 py-3 text-xs last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(190,81,5,0.08)] text-[9px] font-bold text-[#fa7f2a]">
                        {item.user_id.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-[#d9d6d1]">User {item.user_id.slice(0, 8)}...</p>
                        <p className="text-[#b1aaa0]">Bank details unavailable</p>
                      </div>
                    </div>
                    <span className={`w-fit rounded px-2 py-1 text-[10px] font-medium ${getStatusPillClass(item.status)}`}>
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-[#e8e6e3]">{formatIqd(item.amount)}</p>
                    <p className="text-[#b1aaa0]">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#9d9588]">No withdrawals in queue.</div>
            )}
          </div>
        </div>
      </section>

      <TopUpApprovalDialog
        open={isTopUpDialogOpen}
        onOpenChange={setIsTopUpDialogOpen}
        onCreated={() => {
          refreshAll();
        }}
      />
    </div>
  );
}
