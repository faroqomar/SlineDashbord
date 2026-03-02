import { request } from "../../../lib/api";

export interface DashboardStats {
  activeUsers: number;
  platformRevenue: number;
  openDisputes: number;
  activeJobs: number;
}

export interface DashboardActivity {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  status: string;
  time: string;
}

export interface ChartData {
  name: string;
  revenue?: number;
  newUsers?: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  revenueHistory: ChartData[];
  userGrowth: ChartData[];
}

export const dashboardApi = {
  getOverview: async () => {
    const res = await request<DashboardOverview>('GET', '/dashboard/overview');
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch dashboard overview');
    return res.data;
  }
};
