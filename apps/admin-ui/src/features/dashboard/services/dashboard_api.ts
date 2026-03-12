import { request } from "../../../lib/api";

export interface DashboardStats {
  activeUsers: number;
  feeRevenue: number;
  openDisputes: number;
  activeJobs: number;
}

export interface DashboardFinanceSummary {
  userFunds: {
    heldInEscrow: number;
    totalWalletBalances: number;
    totalOwedToUsers: number;
  };
  companyFunds: {
    totalFeeRevenue: number;
    netPlatformEarnings: number;
    actualCompanyOwnedBalance: number;
  };
}

export type DashboardSystemStatus = 'operational' | 'degraded' | 'down';
export type DashboardTrendDirection = 'up' | 'down' | 'flat';

export interface DashboardPulse {
  openReports: number;
  openCases: number;
  activeTasks: number;
  openDisputes: number;
  bookingsToday: number;
  systemStatus: DashboardSystemStatus;
  updatedAt: string;
  timezone: 'UTC';
}

export interface DashboardKpiTrend {
  direction: DashboardTrendDirection;
  deltaPercent: number;
  label: string;
}

export interface DashboardKpiTrends {
  activeUsers: DashboardKpiTrend;
  feeRevenue: DashboardKpiTrend;
  activeJobs: DashboardKpiTrend;
  openDisputes: DashboardKpiTrend;
  comparisonWindow: string;
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
  financeSummary: DashboardFinanceSummary;
  pulse: DashboardPulse;
  kpiTrends: DashboardKpiTrends;
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
