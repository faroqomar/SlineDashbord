import { z } from 'zod';

export type OverviewStats = {
  activeUsers: number;
  platformRevenue: number;
  openDisputes: number;
  activeSubscriptions: number;
};

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

export type RevenueChartData = {
  name: string;
  revenue: number;
};

export type UserGrowthChartData = {
  name: string;
  newUsers: number;
};

export const ANALYTICS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
