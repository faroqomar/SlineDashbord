import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { request } from '@/lib/api';
import {
  ArrowDownCircle,
  Banknote,
  CircleDollarSign,
  History,
  Landmark,
  Percent,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
  Wallet,
} from 'lucide-react';
import { financeApi } from '../features/finance/services/finance_api';
import type { JournalLedgerEntry, WithdrawalRequest } from '../features/finance/models/finance.model';
import { TopUpApprovalDialog } from '../features/finance/components/TopUpApprovalDialog';
import { PlatformFeeCard } from '../features/finance/components/PlatformFeeCard';
import { TransactionTraceDrawer } from '../features/finance/components/TransactionTraceDrawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
type JournalLedgerEntityCompat = JournalLedgerEntry & {
  related_entity_type?: string | null;
  related_entity_id?: string | null;
};

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

function getUserLabel(tx: JournalLedgerEntry): string {
  const candidate = tx.payee_user_id ?? tx.payer_user_id;
  return candidate ? `${candidate.slice(0, 8)}...` : 'System';
}

function getUserInitials(value: string): string {
  if (value.length < 2) return value.toUpperCase();
  return `${value[0]}${value[1]}`.toUpperCase();
}

function getEntityType(tx: JournalLedgerEntityCompat): string | null {
  return tx.entity_type ?? tx.related_entity_type ?? null;
}

function getEntityId(tx: JournalLedgerEntityCompat): string | null {
  return tx.entity_id ?? tx.related_entity_id ?? null;
}

function formatProfitSource(tx: JournalLedgerEntityCompat): string {
  const entityType = getEntityType(tx);
  if (entityType === 'booking') return 'Booking';
  if (entityType === 'task_request') return 'Task';
  return formatEventType(entityType ?? 'unknown');
}

function getProfitEntityLabel(tx: JournalLedgerEntityCompat): string {
  const prefix = formatProfitSource(tx);
  const suffix = getEntityId(tx)?.slice(0, 8) ?? 'unknown';
  return `${prefix} ${suffix}...`;
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

function HeadlineFinanceCard({
  icon,
  eyebrow,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9edfff]">{eyebrow}</p>
          <h3 className="text-base font-semibold text-[#e8e6e3]">{title}</h3>
        </div>
      </div>
      <p className="mt-4 text-4xl font-bold tracking-tight text-[#f6f4f1]">{value}</p>
      <p className="mt-2 text-sm text-[#b9b2a8]">{description}</p>
    </div>
  );
}

function FinanceRealityPanel({
  icon,
  eyebrow,
  title,
  description,
  toneClass,
  metrics,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  toneClass: string;
  metrics: Array<{ label: string; value: string; hint: string; emphasized?: boolean }>;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border p-5 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b1aaa0]">{eyebrow}</p>
          <h3 className="mt-1 text-xl font-semibold text-[#f6f4f1]">{title}</h3>
          <p className="mt-2 text-sm text-[#c5beb2]">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border px-4 py-4 ${
              metric.emphasized
                ? 'border-white/15 bg-white/[0.06]'
                : 'border-white/10 bg-black/20'
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#f6f4f1]">{metric.value}</p>
            <p className="mt-2 text-xs text-[#b1aaa0]">{metric.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactFinanceCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[#e8e6e3]">{value}</p>
      <p className="mt-2 text-xs text-[#7f7668]">{hint}</p>
    </div>
  );
}

export function FinancePage() {
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = React.useState(false);
  const [selectedJournalId, setSelectedJournalId] = React.useState<string | null>(null);

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await request<{ user: { role?: string } }>('GET', '/auth/me');
      if (!res.ok) return { user: { role: '' } };
      return res.data ?? { user: { role: '' } };
    },
  });
  const userRole = (meQuery.data?.user?.role ?? '') as string;
  const canRequestTopUp = userRole === 'admin' || userRole === 'super_admin';

  const metricsQuery = useQuery({
    queryKey: ['finance', 'metrics'],
    queryFn: financeApi.getMetrics,
  });

  const transactionsQuery = useQuery({
    queryKey: ['finance', 'dashboard', 'transactions'],
    queryFn: () => financeApi.getTransactions({ limit: 10 }),
  });

  const profitFeedQuery = useQuery({
    queryKey: ['finance', 'dashboard', 'profit-feed'],
    queryFn: () => financeApi.getTransactions({ event_type: 'release_with_fee', limit: 40 }),
  });

  const withdrawalsQuery = useQuery({
    queryKey: ['finance', 'dashboard', 'withdrawals'],
    queryFn: () => financeApi.getWithdrawals({ limit: 5 }),
  });

  const feeSettingsQuery = useQuery({
    queryKey: ['finance', 'fee-settings'],
    queryFn: () => financeApi.getFeeSettings(),
  });

  const metrics = metricsQuery.data;
  const recentTransactions = transactionsQuery.data?.data ?? [];
  const profitEntries = React.useMemo(
    () =>
      (profitFeedQuery.data?.data ?? []).filter(
        (tx) => {
          const entityType = getEntityType(tx as JournalLedgerEntityCompat);
          return (
            (entityType === 'booking' || entityType === 'task_request') &&
            Number(tx.fee_amount ?? 0) > 0
          );
        }
      ),
    [profitFeedQuery.data]
  );
  const profitFeeTotal = React.useMemo(
    () => profitEntries.reduce((sum, tx) => sum + Number(tx.fee_amount ?? 0), 0),
    [profitEntries]
  );
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
    void Promise.all([
      metricsQuery.refetch(),
      transactionsQuery.refetch(),
      profitFeedQuery.refetch(),
      withdrawalsQuery.refetch(),
      feeSettingsQuery.refetch(),
    ]);
  };

  const canEditFee = userRole === 'super_admin';
  const [feeEditOpen, setFeeEditOpen] = React.useState(false);

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
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(133deg,rgba(6,119,169,0.19)_0%,rgba(27,158,75,0.13)_100%)] shadow-[0_0_24px_rgba(6,119,169,0.09)]">
                <Landmark className="h-6 w-6 text-[#42c0f8]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#e8e6e3]">Finance Dashboard</h2>
                <p className="mt-1 max-w-3xl text-sm text-[#afa89d]">
                  User-held wallet liabilities and platform-owned earnings are shown separately. Held wallet money is never treated as company revenue.
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopUpDialogOpen(true)}
                disabled={!canRequestTopUp}
                className="h-10 rounded-xl border-[rgba(27,158,76,0.3)] bg-[rgba(27,158,75,0.08)] text-[#4ae081] disabled:opacity-80"
              >
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Wallet adjust
              </Button>
              {canEditFee && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFeeEditOpen(true)}
                  className="h-10 rounded-xl border-[rgba(156,125,249,0.4)] bg-[rgba(34,5,118,0.12)] text-[#9c7df9] hover:bg-[rgba(34,5,118,0.2)]"
                >
                  <Percent className="mr-2 h-3.5 w-3.5" /> Platform fee
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <HeadlineFinanceCard
              icon={<Wallet className="h-5 w-5 text-[#72cffc]" />}
              eyebrow="Money We Hold For Users"
              title="Total money owed to users"
              value={formatIqd(metrics?.userFunds.total_owed_to_users)}
              description="Wallet balances plus escrow liabilities. This is not company money."
            />
            <HeadlineFinanceCard
              icon={<Banknote className="h-5 w-5 text-[#4ae081]" />}
              eyebrow="Money We Actually Own"
              title="Actual company-owned balance"
              value={formatIqd(metrics?.companyFunds.actual_company_owned_balance)}
              description="Derived after excluding all user-owned liabilities from platform cash."
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FinanceRealityPanel
          icon={<CircleDollarSign className="h-5 w-5 text-[#72cffc]" />}
          eyebrow="User-Held Funds"
          title="User liabilities"
          description="These balances belong to clients or providers and must stay isolated from company performance."
          toneClass="border-sky-500/30 bg-[linear-gradient(180deg,rgba(8,32,48,0.96)_0%,#0e0f13_100%)]"
          metrics={[
            {
              label: 'Held client funds',
              value: formatIqd(metrics?.userFunds.held_in_escrow),
              hint: 'Escrow currently locked in work/payment flows',
            },
            {
              label: 'Total wallet balances',
              value: formatIqd(metrics?.userFunds.total_wallet_balances),
              hint: 'Available plus pending-withdrawal user wallet balances',
            },
            {
              label: 'Total owed to users',
              value: formatIqd(metrics?.userFunds.total_owed_to_users),
              hint: 'All user-owned money the platform is holding',
              emphasized: true,
            },
          ]}
        />

        <FinanceRealityPanel
          icon={<Landmark className="h-5 w-5 text-[#4ae081]" />}
          eyebrow="Company Funds"
          title="Platform-owned money"
          description="Only fees and commissions contribute to company earnings in this ledger model."
          toneClass="border-emerald-500/30 bg-[linear-gradient(180deg,rgba(7,34,21,0.96)_0%,#0e0f13_100%)]"
          metrics={[
            {
              label: 'Total fee revenue',
              value: formatIqd(metrics?.companyFunds.total_fee_revenue),
              hint: 'Lifetime fees and commissions captured by the platform',
            },
            {
              label: 'Net platform earnings',
              value: formatIqd(metrics?.companyFunds.net_platform_earnings),
              hint: 'Ledger earnings attributable to the company',
            },
            {
              label: 'Actual company-owned balance',
              value: formatIqd(metrics?.companyFunds.actual_company_owned_balance),
              hint: 'Company money after removing all user liabilities',
              emphasized: true,
            },
          ]}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CompactFinanceCard
          icon={<Receipt className="h-4 w-4 text-[#5eb1fa]" />}
          label="Recent transactions loaded"
          value={String(recentTransactions.length)}
          hint="Latest ledger rows in this dashboard view"
        />
        <CompactFinanceCard
          icon={<ArrowDownCircle className="h-4 w-4 text-[#f6a823]" />}
          label="Pending withdrawals"
          value={String(pendingWithdrawalCount)}
          hint="Requests waiting for processing or completion"
        />
        <CompactFinanceCard
          icon={<Banknote className="h-4 w-4 text-[#9c7df9]" />}
          label="Visible fee income"
          value={formatIqd(profitFeeTotal)}
          hint="Fee-bearing releases visible in the profit feed below"
        />
        <PlatformFeeCard
          feeSettings={feeSettingsQuery.data}
          isLoading={feeSettingsQuery.isLoading}
          canEdit={canEditFee}
          onUpdated={() => void feeSettingsQuery.refetch()}
          editOpen={feeEditOpen}
          onEditOpenChange={setFeeEditOpen}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13]">
          <div className="flex items-center justify-between border-b border-[#81786a] px-5 py-4">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-[#9c7df9]" />
              <div>
                <h3 className="text-base font-semibold text-[#e8e6e3]">Company Fee Revenue Feed</h3>
                <p className="text-xs text-[#9d9588]">Only platform-owned fees from booking and task releases</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#9d9588]">Visible company fees</p>
              <p className="text-lg font-bold text-[#9c7df9]">{formatIqd(profitFeeTotal)}</p>
            </div>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {profitEntries.length > 0 ? (
              profitEntries.map((tx) => (
                <div
                  key={tx.journal_id}
                  className="grid cursor-pointer grid-cols-[1.6fr_auto_auto] items-center gap-3 border-b border-[#81786a] px-5 py-3 text-xs transition-colors hover:bg-[rgba(255,255,255,0.03)] last:border-b-0"
                  onClick={() => setSelectedJournalId(tx.journal_id)}
                >
                  <div>
                    <p className="font-medium text-[#d9d6d1]">{getProfitEntityLabel(tx)}</p>
                    <p className="mt-1 text-[#b1aaa0]">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                  <span className="w-fit rounded px-2 py-1 text-[10px] font-medium bg-[rgba(34,5,118,0.12)] text-[#9c7df9]">
                    {formatProfitSource(tx)}
                  </span>
                  <p className="font-semibold text-[#9c7df9]">
                    +{Number(tx.fee_amount).toLocaleString()}
                    <span className="ml-0.5 font-normal text-[#b1aaa0]">IQD</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#9d9588]">
                No booking or task profit fees found.
              </div>
            )}
          </div>
        </div>

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
                  <div
                    key={tx.journal_id}
                    className="grid cursor-pointer grid-cols-[1.8fr_auto_auto_auto_auto] items-center gap-3 border-b border-[#81786a] px-5 py-3 text-xs transition-colors hover:bg-[rgba(255,255,255,0.03)] last:border-b-0"
                    onClick={() => setSelectedJournalId(tx.journal_id)}
                  >
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
      {selectedJournalId ? (
        <TransactionTraceDrawer
          journalId={selectedJournalId}
          open={Boolean(selectedJournalId)}
          onOpenChange={(open) => {
            if (!open) setSelectedJournalId(null);
          }}
        />
      ) : null}
    </div>
  );
}
