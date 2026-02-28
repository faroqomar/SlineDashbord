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

export async function getOverviewStats(): Promise<ServiceResult<OverviewStats>> {
  try {
    await requireAdminRole(ANALYTICS_READ_ROLES);
    const supabase = createAdminClient();

    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    
    // Revenue logic using completed tasks proxy
    const { data: revenueData } = await supabase.from('tasks').select('budget').eq('status', 'completed');
    let revenue = 0;
    if (revenueData) {
        revenue = revenueData.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
    }

    const { count: disputeCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating', 'mediation']);

    return ok({
      activeUsers: userCount || 0,
      platformRevenue: revenue,
      openDisputes: disputeCount || 0,
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
            .from('tasks')
            .select('budget, created_at') 
            .eq('status', 'completed')
            .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()); 

        if (error) return fail('Error fetching revenue history');

        const monthlyData: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${months[d.getMonth()]}`;
            monthlyData[key] = 0;
        }

        data?.forEach((task: any) => {
            const d = new Date(task.created_at);
            const key = months[d.getMonth()];
            if (monthlyData[key] !== undefined) {
                monthlyData[key] += Number(task.budget) || 0;
            }
        });

        return ok(Object.entries(monthlyData).map(([name, revenue]) => ({ name, revenue })));
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
            .from('profiles')
            .select('created_at')
            .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

        if (error) return fail('Error fetching user history');

        const monthlyData: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${months[d.getMonth()]}`;
            monthlyData[key] = 0;
        }

        data?.forEach((user: any) => {
            const d = new Date(user.created_at);
            const key = months[d.getMonth()];
            if (monthlyData[key] !== undefined) {
                 monthlyData[key]++;
            }
        });

        return ok(Object.entries(monthlyData).map(([name, newUsers]) => ({ name, newUsers })));
    } catch (error) {
        console.error('getUserGrowthHistory error:', error);
        return fail(toErrorMessage(error));
    }
}
