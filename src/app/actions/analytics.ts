'use server';

import { createAdminClient } from "@/lib/supabase/admin";

export type OverviewStats = {
  activeUsers: number;
  platformRevenue: number;
  openDisputes: number;
  activeSubscriptions: number;
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = createAdminClient();

  // 1. Total Users (where status is active or maybe all users?)
  // Let's count all profiles for now.
  const { count: userCount, error: userError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (userError) {
      console.error('Error fetching user count:', userError);
  }

  // 2. Platform Revenue
  // Summing up 'amount' from 'wallet_transactions' where type might be 'fee' or 'commission'?
  // For MVP, if we don't have fee specific transactions, let's sum up completed tasks budget as a proxy for "Volume", or actual revenue if we had a field.
  // Let's assume 'wallet_transactions' with type='payment' or similar represents money moving.
  // Actually, let's look at `wallet_transactions` types.
  // Valid types might be 'deposit', 'withdrawal', 'transfer', 'payment', 'refund'.
  // Without knowing the exact business logic for "Revenue" (is it 10% cut?), let's just sum up all completed task budgets for "Gross Volume".
  
  // Alternative: Sum 'budget' of tasks with status 'completed'.
  const { data: revenueData, error: revenueError } = await supabase
    .from('tasks')
    .select('budget')
    .eq('status', 'completed');

  let revenue = 0;
  if (!revenueError && revenueData) {
      revenue = revenueData.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
  } else if (revenueError) {
      console.error('Error fetching revenue:', revenueError);
  }

  // 3. Active Disputes
  const { count: disputeCount, error: disputeError } = await supabase
    .from('disputes')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'investigating', 'mediation']);

  if (disputeError) {
      console.error('Error fetching dispute count:', disputeError);
  }

  // 4. Active Subscriptions
  // We don't have a subscriptions table yet, returning 0.
  
  return {
    activeUsers: userCount || 0,
    platformRevenue: revenue,
    openDisputes: disputeCount || 0,
    activeSubscriptions: 0,
  };
}

export type ActivityItem = {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  amount?: string;
  status: "success" | "pending" | "error";
  time: string;
};

export type PendingItem = {
  id: string;
  type: string;
  count: number;
  status: "pending" | "warning" | "open";
};

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('admin_logs')
    .select(`
      id,
      action,
      created_at,
      metadata,
      actor:profiles!admin_logs_actor_id_fkey(full_name, email, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  // Helper to format relative time (simple version)
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

  return (data || []).map((log: any) => ({
    id: log.id,
    user: {
      name: log.actor?.full_name || 'System',
      email: log.actor?.email || '',
      avatar: log.actor?.avatar_url,
    },
    action: formatActionName(log.action),
    status: 'success', // Logs usually record successful actions
    time: timeAgo(log.created_at),
  }));
}

function formatActionName(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function getPendingItems(): Promise<PendingItem[]> {
  const supabase = createAdminClient();

  // 1. Open Disputes
  const { count: disputesCount } = await supabase
    .from('disputes')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'investigating']);

  // 2. Open Support Tickets
  const { count: ticketsCount } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'in_progress']);

  return [
    {
      id: '1',
      type: 'Disputes',
      count: disputesCount || 0,
      status: 'open',
    },
    {
      id: '2',
      type: 'Support Tickets',
      count: ticketsCount || 0,
      status: 'pending',
    },
    // Add Complaints or Verification when tables exist
  ];
}

export type RevenueChartData = {
  name: string;
  revenue: number;
};

export type UserGrowthChartData = {
  name: string;
  newUsers: number;
};

export async function getRevenueHistory(): Promise<RevenueChartData[]> {
    const supabase = createAdminClient();
    
    // For MVP, using completed tasks budget as revenue proxy
    const { data, error } = await supabase
        .from('tasks')
        .select('budget, created_at') 
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()); 

    if (error) {
        console.error('Error fetching revenue history:', error);
        return [];
    }

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

    return Object.entries(monthlyData).map(([name, revenue]) => ({ name, revenue }));
}

export async function getUserGrowthHistory(): Promise<UserGrowthChartData[]> {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

    if (error) {
        console.error('Error fetching user history:', error);
        return [];
    }

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

    return Object.entries(monthlyData).map(([name, newUsers]) => ({ name, newUsers }));
}
