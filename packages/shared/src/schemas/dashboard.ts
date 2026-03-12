import { z } from 'zod';

export const DashboardSystemStatusEnum = z.enum(['operational', 'degraded', 'down']);
export type DashboardSystemStatus = z.infer<typeof DashboardSystemStatusEnum>;

export const DashboardStatsSchema = z.object({
  activeUsers: z.number().int().nonnegative(),
  feeRevenue: z.number(),
  openDisputes: z.number().int().nonnegative(),
  activeJobs: z.number().int().nonnegative(),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const DashboardFinanceSummarySchema = z.object({
  userFunds: z.object({
    heldInEscrow: z.number(),
    totalWalletBalances: z.number(),
    totalOwedToUsers: z.number(),
  }),
  companyFunds: z.object({
    totalFeeRevenue: z.number(),
    netPlatformEarnings: z.number(),
    actualCompanyOwnedBalance: z.number(),
  }),
});
export type DashboardFinanceSummary = z.infer<typeof DashboardFinanceSummarySchema>;

export const DashboardActivityItemSchema = z.object({
  id: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  action: z.string(),
  status: z.enum(['success', 'pending', 'error']),
  time: z.string(),
});
export type DashboardActivityItem = z.infer<typeof DashboardActivityItemSchema>;

export const DashboardRevenuePointSchema = z.object({
  name: z.string(),
  revenue: z.number(),
});
export type DashboardRevenuePoint = z.infer<typeof DashboardRevenuePointSchema>;

export const DashboardUserGrowthPointSchema = z.object({
  name: z.string(),
  newUsers: z.number(),
});
export type DashboardUserGrowthPoint = z.infer<typeof DashboardUserGrowthPointSchema>;

export const DashboardPulseSchema = z.object({
  openReports: z.number().int().nonnegative(),
  openCases: z.number().int().nonnegative(),
  activeTasks: z.number().int().nonnegative(),
  openDisputes: z.number().int().nonnegative(),
  bookingsToday: z.number().int().nonnegative(),
  systemStatus: DashboardSystemStatusEnum,
  updatedAt: z.string(),
  timezone: z.literal('UTC'),
});
export type DashboardPulse = z.infer<typeof DashboardPulseSchema>;

export const DashboardTrendDirectionEnum = z.enum(['up', 'down', 'flat']);
export type DashboardTrendDirection = z.infer<typeof DashboardTrendDirectionEnum>;

export const DashboardKpiTrendSchema = z.object({
  direction: DashboardTrendDirectionEnum,
  deltaPercent: z.number(),
  label: z.string().max(32),
});
export type DashboardKpiTrend = z.infer<typeof DashboardKpiTrendSchema>;

export const DashboardKpiTrendsSchema = z.object({
  activeUsers: DashboardKpiTrendSchema,
  feeRevenue: DashboardKpiTrendSchema,
  activeJobs: DashboardKpiTrendSchema,
  openDisputes: DashboardKpiTrendSchema,
  comparisonWindow: z.string().max(64),
});
export type DashboardKpiTrends = z.infer<typeof DashboardKpiTrendsSchema>;

export const DashboardOverviewDataSchema = z.object({
  stats: DashboardStatsSchema,
  financeSummary: DashboardFinanceSummarySchema,
  pulse: DashboardPulseSchema,
  kpiTrends: DashboardKpiTrendsSchema,
  recentActivity: z.array(DashboardActivityItemSchema),
  revenueHistory: z.array(DashboardRevenuePointSchema),
  userGrowth: z.array(DashboardUserGrowthPointSchema),
});
export type DashboardOverviewData = z.infer<typeof DashboardOverviewDataSchema>;

export const DashboardOverviewResponseSchema = z.object({
  ok: z.literal(true),
  data: DashboardOverviewDataSchema,
});
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;
