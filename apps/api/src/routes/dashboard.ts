import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import {
  DashboardOverviewDataSchema,
  failure,
  success,
  type DashboardKpiTrend,
  type DashboardSystemStatus,
} from '@sline/shared';
import { getFinanceMetricsSnapshot } from './finance/metrics-summary.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatTrendLabel(direction: 'up' | 'down' | 'flat', deltaPercent: number): string {
  if (direction === 'flat') return 'No change';
  const rounded = Math.round(Math.abs(deltaPercent) * 10) / 10;
  const value = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return direction === 'up' ? `+${value}%` : `-${value}%`;
}

function computeKpiTrend(current: number, previous: number): DashboardKpiTrend {
  if (previous <= 0 && current <= 0) {
    return { direction: 'flat', deltaPercent: 0, label: 'No change' };
  }

  if (previous <= 0 && current > 0) {
    return { direction: 'up', deltaPercent: 100, label: '+100%' };
  }

  const deltaPercent = ((current - previous) / previous) * 100;
  const epsilon = 0.05;
  const direction =
    Math.abs(deltaPercent) < epsilon ? 'flat' : deltaPercent > 0 ? 'up' : 'down';

  return {
    direction,
    deltaPercent: Math.round(deltaPercent * 10) / 10,
    label: formatTrendLabel(direction, deltaPercent),
  };
}

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook(
    'preHandler',
    requireAdminRole(['support', 'moderator', 'admin', 'super_admin'])
  );

  /**
   * Get Dashboard Overview Stats
   */
  fastify.get('/overview', async (request, reply) => {
    try {
      const startOfDayUtc = new Date();
      startOfDayUtc.setUTCHours(0, 0, 0, 0);
      const endOfDayUtc = new Date(startOfDayUtc);
      endOfDayUtc.setUTCDate(endOfDayUtc.getUTCDate() + 1);
      const now = new Date();
      const currentWindowStart = new Date(now);
      currentWindowStart.setUTCDate(currentWindowStart.getUTCDate() - 30);
      const previousWindowStart = new Date(now);
      previousWindowStart.setUTCDate(previousWindowStart.getUTCDate() - 60);

      const [profilesRes, financeMetricsRes, disputesRes, jobsRes, openReportsRes, openCasesRes, bookingsTodayRes, signalLogsRes, usersCurrentRes, usersPreviousRes, jobsCurrentRes, jobsPreviousRes, disputesCurrentRes, disputesPreviousRes] = await Promise.all([
        // Core KPI stats
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        getFinanceMetricsSnapshot(supabase),
        supabase
          .from('disputes')
          .select('*', { count: 'exact', head: true })
          .in('status', ['open', 'investigating', 'mediation']),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),

        // Platform Pulse metrics
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase
          .from('admin_cases')
          .select('*', { count: 'exact', head: true })
          .in('status', ['open', 'in_progress', 'pending']),
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDayUtc.toISOString())
          .lt('created_at', endOfDayUtc.toISOString()),

        // Signal for pulse status
        supabase
          .from('audit_logs')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .ilike('action', '%fail%'),

        // KPI trend windows: last 30d vs previous 30d
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .gte('created_at', currentWindowStart.toISOString()),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .gte('created_at', previousWindowStart.toISOString())
          .lt('created_at', currentWindowStart.toISOString()),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_progress')
          .gte('created_at', currentWindowStart.toISOString()),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_progress')
          .gte('created_at', previousWindowStart.toISOString())
          .lt('created_at', currentWindowStart.toISOString()),
        supabase
          .from('disputes')
          .select('*', { count: 'exact', head: true })
          .in('status', ['open', 'investigating', 'mediation'])
          .gte('created_at', currentWindowStart.toISOString()),
        supabase
          .from('disputes')
          .select('*', { count: 'exact', head: true })
          .in('status', ['open', 'investigating', 'mediation'])
          .gte('created_at', previousWindowStart.toISOString())
          .lt('created_at', currentWindowStart.toISOString()),
      ]);

      const [activityRes, revenueHistoryRes, userGrowthRes] = await Promise.all([
        supabase
          .from('audit_logs')
          .select(`id, action, created_at, meta, actor:profiles!actor_user_id(full_name, email, avatar_url)`)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('vw_analytics_monthly_revenue').select('name, revenue').order('name', { ascending: true }),
        supabase.from('vw_analytics_monthly_user_growth').select('name, new_users').order('name', { ascending: true })
      ]);

      const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return seconds + "s ago";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
        return Math.floor(seconds / 86400) + "d ago";
      };

      const errorCount =
        [
          profilesRes.error,
          financeMetricsRes.error,
          disputesRes.error,
          jobsRes.error,
          openReportsRes.error,
          openCasesRes.error,
          bookingsTodayRes.error,
          signalLogsRes.error,
          usersCurrentRes.error,
          usersPreviousRes.error,
          jobsCurrentRes.error,
          jobsPreviousRes.error,
          disputesCurrentRes.error,
          disputesPreviousRes.error,
          activityRes.error,
          revenueHistoryRes.error,
          userGrowthRes.error,
        ].filter(Boolean).length;

      const failureSignals = signalLogsRes.count ?? 0;

      let systemStatus: DashboardSystemStatus = 'operational';
      if (errorCount >= 2) {
        systemStatus = 'down';
      } else if (errorCount > 0 || failureSignals > 0) {
        systemStatus = 'degraded';
      }

      const revenueSeries = (revenueHistoryRes.data || []).map((row: any) => ({
        name: row.name,
        revenue: Number(row.revenue) || 0,
      }));

      const currentRevenue = revenueSeries.length > 0 ? revenueSeries[revenueSeries.length - 1].revenue : 0;
      const previousRevenue = revenueSeries.length > 1 ? revenueSeries[revenueSeries.length - 2].revenue : 0;
      const financeSummary = financeMetricsRes.data;

      const kpiTrends = {
        activeUsers: computeKpiTrend(usersCurrentRes.count || 0, usersPreviousRes.count || 0),
        feeRevenue: computeKpiTrend(currentRevenue, previousRevenue),
        activeJobs: computeKpiTrend(jobsCurrentRes.count || 0, jobsPreviousRes.count || 0),
        openDisputes: computeKpiTrend(disputesCurrentRes.count || 0, disputesPreviousRes.count || 0),
        comparisonWindow: 'last 30d vs previous 30d',
      };

      const payload = {
        stats: {
          activeUsers: profilesRes.count || 0,
          feeRevenue: financeSummary?.companyFunds.total_fee_revenue || 0,
          openDisputes: disputesRes.count || 0,
          activeJobs: jobsRes.count || 0
        },
        financeSummary: financeSummary
          ? {
              userFunds: {
                heldInEscrow: financeSummary.userFunds.held_in_escrow,
                totalWalletBalances: financeSummary.userFunds.total_wallet_balances,
                totalOwedToUsers: financeSummary.userFunds.total_owed_to_users,
              },
              companyFunds: {
                totalFeeRevenue: financeSummary.companyFunds.total_fee_revenue,
                netPlatformEarnings: financeSummary.companyFunds.net_platform_earnings,
                actualCompanyOwnedBalance: financeSummary.companyFunds.actual_company_owned_balance,
              },
            }
          : {
              userFunds: {
                heldInEscrow: 0,
                totalWalletBalances: 0,
                totalOwedToUsers: 0,
              },
              companyFunds: {
                totalFeeRevenue: 0,
                netPlatformEarnings: 0,
                actualCompanyOwnedBalance: 0,
              },
            },
        pulse: {
          openReports: openReportsRes.count || 0,
          openCases: openCasesRes.count || 0,
          activeTasks: jobsRes.count || 0,
          openDisputes: disputesRes.count || 0,
          bookingsToday: bookingsTodayRes.count || 0,
          systemStatus,
          updatedAt: new Date().toISOString(),
          timezone: 'UTC' as const,
        },
        kpiTrends,
        recentActivity: (activityRes.data || []).map((log: any) => ({
          id: String(log.id ?? ''),
          user: {
            name: log.actor?.full_name || 'System',
            email: log.actor?.email || '',
            avatar: log.actor?.avatar_url,
          },
          action: String(log.action || 'system.event')
            .split(/[._]/)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          status: 'success' as const,
          time: timeAgo(log.created_at),
        })),
        revenueHistory: revenueSeries,
        userGrowth: (userGrowthRes.data || []).map((row: any) => ({
          name: row.name,
          newUsers: Number(row.new_users) || 0
        }))
      };

      const parsed = DashboardOverviewDataSchema.safeParse(payload);
      if (!parsed.success) {
        fastify.log.warn({ err: parsed.error }, 'Dashboard response schema validation failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid dashboard payload'));
      }

      return reply.status(200).send(success(parsed.data));
    } catch (err: any) {
      fastify.log.error({ err }, 'Dashboard overview route error');
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to load dashboard overview'));
    }
  });
}
