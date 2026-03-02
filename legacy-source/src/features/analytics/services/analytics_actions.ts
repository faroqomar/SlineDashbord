'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { 
  OverviewStats, 
  ActivityItem, 
  PendingItem, 
  RevenueChartData, 
  UserGrowthChartData,
  ANALYTICS_READ_ROLES
} from '../models/analytics.schema';

export type DashboardOverview = {
  stats: OverviewStats;
  recentActivity: ActivityItem[];
  pendingItems: PendingItem[];
  revenueHistory: RevenueChartData[];
  userGrowth: UserGrowthChartData[];
};

export async function getDashboardOverview(): Promise<ServiceResult<DashboardOverview>> {
  try {
    await requireAdminRole(ANALYTICS_READ_ROLES);
    const supabase = createAdminClient();

    // Fetch all in parallel using the SAME admin client and AFTER a single auth check
    const [statsRes, activityRes, pendingRes, revenueRes, growthRes] = await Promise.all([
      getOverviewDataInternal(supabase),
      getRecentActivityInternal(supabase),
      getPendingItemsInternal(supabase),
      getRevenueHistoryInternal(supabase),
      getUserGrowthHistoryInternal(supabase),
    ]);

    return ok({
      stats: statsRes,
      recentActivity: activityRes,
      pendingItems: pendingRes,
      revenueHistory: revenueRes,
      userGrowth: growthRes,
    });
  } catch (error) {
    console.error('getDashboardOverview error:', error);
    return fail(toErrorMessage(error));
  }
}

// Internal helpers that don't perform re-authentication
async function getOverviewDataInternal(supabase: any): Promise<OverviewStats> {
    const [profilesResult, revenueResult, disputesResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('vw_financial_metrics_realtime').select('revenue_iqd').single(),
      supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating', 'mediation']),
    ]);
    return {
      activeUsers: profilesResult.count || 0,
      platformRevenue: revenueResult.data?.revenue_iqd || 0,
      openDisputes: disputesResult.count || 0,
      activeSubscriptions: 0,
    };
}

async function getRecentActivityInternal(supabase: any): Promise<ActivityItem[]> {
    const { data } = await supabase
      .from('audit_logs')
      .select(`id, action, created_at, meta, actor:profiles!actor_user_id(full_name, email, avatar_url)`)
      .order('created_at', { ascending: false })
      .limit(5);

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return seconds + "s ago";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
        return Math.floor(seconds / 86400) + "d ago";
    };

    return (data || []).map((log: any) => ({
      id: log.id,
      user: {
        name: log.actor?.full_name || 'System',
        email: log.actor?.email || '',
        avatar: log.actor?.avatar_url,
      },
      action: log.action.split(/[._]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      status: 'success', 
      time: timeAgo(log.created_at),
    }));
}

async function getPendingItemsInternal(supabase: any): Promise<PendingItem[]> {
    const [{ count: disputesCount }, { count: ticketsCount }] = await Promise.all([
        supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating']),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    ]);
    return [
      { id: '1', type: 'Disputes', count: disputesCount || 0, status: 'open' },
      { id: '2', type: 'Support Tickets', count: ticketsCount || 0, status: 'pending' },
    ];
}

async function getRevenueHistoryInternal(supabase: any): Promise<RevenueChartData[]> {
    const { data, error } = await supabase
        .from('vw_analytics_monthly_revenue')
        .select('name, revenue');

    if (error) {
        console.error('getRevenueHistoryInternal error:', error);
        return [];
    }

    return (data || []).map((row: any) => ({
        name: row.name,
        revenue: Number(row.revenue) || 0
    }));
}

async function getUserGrowthHistoryInternal(supabase: any): Promise<UserGrowthChartData[]> {
    const { data, error } = await supabase
        .from('vw_analytics_monthly_user_growth')
        .select('name, new_users');

    if (error) {
        console.error('getUserGrowthHistoryInternal error:', error);
        return [];
    }

    return (data || []).map((row: any) => ({
        name: row.name,
        newUsers: Number(row.new_users) || 0
    }));
}


export async function getOverviewStats(): Promise<ServiceResult<OverviewStats>> {
  try {
    await requireAdminRole(ANALYTICS_READ_ROLES);
    const supabase = createAdminClient();

    const [profilesResult, revenueResult, disputesResult] = await Promise.all([
      // 1. Count active profiles
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),

      // 2. Platform Revenue from Ledger
      supabase
        .from('vw_financial_metrics_realtime')
        .select('revenue_iqd')
        .single(),

      // 3. Count open disputes
      supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'investigating', 'mediation']),
    ]);

    const activeUsers = profilesResult.count || 0;
    const openDisputes = disputesResult.count || 0;
    const platformRevenue = revenueResult.data?.revenue_iqd || 0;

    return ok({
      activeUsers,
      platformRevenue,
      openDisputes,
      activeSubscriptions: 0,
    });
  } catch (error) {
    console.error('getOverviewStats error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function getRecentActivity(): Promise<ServiceResult<ActivityItem[]>> {
  try {
    await requireAdminRole(ANALYTICS_READ_ROLES);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('audit_logs') // Changed from admin_logs to newly standardized audit_logs
      .select(`
        id,
        action,
        created_at,
        meta,
        actor:profiles!actor_user_id(full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) return fail('Error fetching activity');

    const timeAgo = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
    };

    function formatActionName(action: string): string {
      return action.split(/[_.]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const activity: ActivityItem[] = (data || []).map((log: any) => ({
      id: log.id,
      user: {
        name: log.actor?.full_name || 'System',
        email: log.actor?.email || '',
        avatar: log.actor?.avatar_url,
      },
      action: formatActionName(log.action),
      status: 'success', 
      time: timeAgo(log.created_at),
    }));

    return ok(activity);
  } catch (error) {
    console.error('getRecentActivity error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function getPendingItems(): Promise<ServiceResult<PendingItem[]>> {
  try {
    await requireAdminRole(ANALYTICS_READ_ROLES);
    const supabase = createAdminClient();

    const { count: disputesCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating']);
    const { count: ticketsCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']);

    return ok([
      { id: '1', type: 'Disputes', count: disputesCount || 0, status: 'open' },
      { id: '2', type: 'Support Tickets', count: ticketsCount || 0, status: 'pending' },
    ]);
  } catch (error) {
    console.error('getPendingItems error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function getRevenueHistory(): Promise<ServiceResult<RevenueChartData[]>> {
    try {
        await requireAdminRole(ANALYTICS_READ_ROLES);
        const supabase = createAdminClient();
        
        const { data, error } = await supabase
            .from('vw_analytics_monthly_revenue')
            .select('name, revenue');

        if (error) return fail('Error fetching revenue history');

        return ok((data || []).map((row: any) => ({
            name: row.name,
            revenue: Number(row.revenue) || 0
        })));
    } catch (error) {
        console.error('getRevenueHistory error:', error);
        return fail(toErrorMessage(error));
    }
}

export async function getUserGrowthHistory(): Promise<ServiceResult<UserGrowthChartData[]>> {
    try {
        await requireAdminRole(ANALYTICS_READ_ROLES);
        const supabase = createAdminClient();
        
        const { data, error } = await supabase
            .from('vw_analytics_monthly_user_growth')
            .select('name, new_users');

        if (error) return fail('Error fetching user history');

        return ok((data || []).map((row: any) => ({
            name: row.name,
            newUsers: Number(row.new_users) || 0
        })));
    } catch (error) {
        console.error('getUserGrowthHistory error:', error);
        return fail(toErrorMessage(error));
    }
}
