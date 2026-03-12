import React from 'react';
import { Link } from '@tanstack/react-router';
import { useTheme } from 'next-themes';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Clock,
  ArrowUpRight,
  Activity,
  Landmark,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { useDashboardViewModel } from '../features/dashboard/viewmodels/use_dashboard_viewmodel';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Skeleton } from '../components/ui/skeleton';
import {
  getDashboardKpiTrendLabel,
  getDashboardPulseItems,
} from '../features/dashboard/view/dashboard.view';

const CHART_TICK_LIGHT = '#475569';
const CHART_TICK_DARK = '#94a3b8';
const CHART_GRID_LIGHT = 'rgba(0,0,0,0.06)';
const CHART_GRID_DARK = 'rgba(255,255,255,0.08)';

export function DashboardIndex() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';
  const chartTick = isDark ? CHART_TICK_DARK : CHART_TICK_LIGHT;
  const chartGrid = isDark ? CHART_GRID_DARK : CHART_GRID_LIGHT;
  const tooltipBg = '#1e293b';

  const { stats, financeSummary, pulse, kpiTrends, recentActivity, revenueHistory, userGrowth, isLoading, error } = useDashboardViewModel();
  const pulseItems = getDashboardPulseItems(stats, pulse);
  const now = new Date();
  const nowTime = now.toLocaleTimeString();
  const nowDate = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h3 className="text-xl font-bold">Failed to load dashboard</h3>
        <p className="text-slate-400">{error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="relative overflow-hidden rounded-2xl border border-[#7f7668] bg-[linear-gradient(172deg,#0E0F13_0%,#121625_60%,#0E0F13_100%)] p-6">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-[#afa89d]">Good evening, Admin</p>
            <h2 className="mt-1 bg-gradient-to-r from-[#c7f8e5] to-[#a7e8d2] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-[#9d9588]">Real-time platform metrics and system health.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="bg-gradient-to-r from-[#c7f8e5] to-[#8ed8ff] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              {nowTime}
            </p>
            <p className="mt-1 text-xs text-[#9d9588]">{nowDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<Users className="text-blue-600 dark:text-blue-400" size={24} />} 
          label="Total Users" 
          value={stats?.activeUsers.toLocaleString()} 
          trend={getDashboardKpiTrendLabel(kpiTrends?.activeUsers)}
          isLoading={isLoading}
        />
        <StatCard 
          icon={<DollarSign className="text-emerald-600 dark:text-emerald-400" size={24} />} 
          label="Fee Revenue Only" 
          value={stats ? `${Number(stats.feeRevenue).toLocaleString()} IQD` : undefined} 
          trend={getDashboardKpiTrendLabel(kpiTrends?.feeRevenue)}
          isLoading={isLoading}
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />} 
          label="Active Jobs" 
          value={stats?.activeJobs.toString()} 
          trend={getDashboardKpiTrendLabel(kpiTrends?.activeJobs)}
          isLoading={isLoading}
        />
        <StatCard 
          icon={<AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />} 
          label="Open Disputes" 
          value={stats?.openDisputes.toString()} 
          trend={getDashboardKpiTrendLabel(kpiTrends?.openDisputes)}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FinancialRealityCard
          icon={<Wallet className="h-5 w-5 text-sky-300" />}
          eyebrow="User Money We Hold"
          title="Platform-held user funds"
          description="These balances belong to clients or providers. They are liabilities, not company revenue."
          accentClass="from-sky-500/20 to-cyan-400/5"
          metrics={[
            {
              label: 'Held in escrow',
              value: financeSummary ? formatIqd(financeSummary.userFunds.heldInEscrow) : '--',
            },
            {
              label: 'Wallet balances',
              value: financeSummary ? formatIqd(financeSummary.userFunds.totalWalletBalances) : '--',
            },
            {
              label: 'Total owed to users',
              value: financeSummary ? formatIqd(financeSummary.userFunds.totalOwedToUsers) : '--',
              emphasized: true,
            },
          ]}
        />

        <FinancialRealityCard
          icon={<Landmark className="h-5 w-5 text-emerald-300" />}
          eyebrow="Company Money We Own"
          title="Platform-owned funds"
          description="Company funds come only from fees and commissions captured by the platform."
          accentClass="from-emerald-500/20 to-lime-400/5"
          metrics={[
            {
              label: 'Total fee revenue',
              value: financeSummary ? formatIqd(financeSummary.companyFunds.totalFeeRevenue) : '--',
            },
            {
              label: 'Net platform earnings',
              value: financeSummary ? formatIqd(financeSummary.companyFunds.netPlatformEarnings) : '--',
            },
            {
              label: 'Actual company-owned balance',
              value: financeSummary ? formatIqd(financeSummary.companyFunds.actualCompanyOwnedBalance) : '--',
              emphasized: true,
            },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#847a6c] bg-[rgba(9,13,11,0.65)]">
        <div className="flex items-center justify-between border-b border-[#847a6c] px-5 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[#cecac4]" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#cecac4]">Platform Pulse</p>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {pulseItems.map((item) => (
            <div
              key={item.id}
              className="flex h-20 flex-col items-center justify-center border-r border-t border-[#847a6c] px-3 text-center first:border-l-0"
            >
              <p className={`text-[31px] leading-none font-semibold ${item.toneClass}`}>{item.value}</p>
              <p className="mt-1 text-xs text-[#b1aaa0]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="glass-card min-h-[455px] p-6 lg:col-span-5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Fee Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Monthly platform fee revenue only · IQD</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-500/20">
                <ArrowUpRight size={10} /> Live
              </span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTick, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTick, fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card min-h-[455px] p-6 lg:col-span-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">User Growth</h3>
              <p className="text-xs text-muted-foreground">New registered profiles per month</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTick, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTick, fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px' }}
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                  />
                  <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card min-h-[455px] overflow-hidden p-0 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Recent Activity</h3>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/logs" className="text-[11px] font-semibold text-primary hover:underline">View all</Link>
              <RefreshCw className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="h-[412px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-3">
                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-0">
                {recentActivity?.map((activity: any) => (
                  <div key={activity.id} className="flex items-start justify-between border-b border-border/70 px-4 py-3 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 rounded-[10px] bg-muted dark:bg-white/5 flex items-center justify-center overflow-hidden border border-border dark:border-white/10">
                        {activity.user.avatar ? (
                          <img src={activity.user.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Users size={14} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user.name}</p>
                      </div>
                    </div>
                    <p className="pl-3 text-[11px] text-muted-foreground whitespace-nowrap">{activity.time}</p>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && recentActivity?.length === 0 && (
              <div className="p-4 text-center text-xs italic text-muted-foreground">No recent activity found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatIqd(value: number): string {
  return `${Number(value).toLocaleString()} IQD`;
}

function FinancialRealityCard({
  icon,
  eyebrow,
  title,
  description,
  accentClass,
  metrics,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accentClass: string;
  metrics: Array<{ label: string; value: string; emphasized?: boolean }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#7f7668] bg-[linear-gradient(180deg,#10141d_0%,#0d1017_100%)] p-5">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${accentClass}`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8b1a5]">{eyebrow}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 max-w-xl text-sm text-slate-300">{description}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {icon}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-2xl border px-4 py-4 ${
                metric.emphasized
                  ? 'border-white/15 bg-white/[0.06]'
                  : 'border-white/10 bg-black/20'
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{metric.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${metric.emphasized ? 'text-white' : 'text-slate-200'}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, isLoading }: { icon: React.ReactNode; label: string; value?: string; trend: string; isLoading: boolean }) {
  const trendToneClass = trend.startsWith('-')
    ? 'text-rose-500 dark:text-rose-300 bg-rose-500/15 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/10'
    : trend === 'No change'
      ? 'text-slate-500 dark:text-slate-300 bg-slate-500/15 dark:bg-slate-500/10 border-slate-500/20 dark:border-slate-500/10'
      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/10';

  return (
    <div className="glass-card flex flex-col gap-4 group hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-muted/80 dark:bg-white/5 rounded-xl border border-border dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {!isLoading && (
          <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${trendToneClass}`}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">{label}</span>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-3xl font-bold mt-1 tracking-tighter text-foreground">{value || "0"}</p>
        )}
      </div>
    </div>
  );
}
