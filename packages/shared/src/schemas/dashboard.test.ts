import { describe, it, expect } from 'vitest';
import { DashboardOverviewResponseSchema, DashboardPulseSchema } from './dashboard.js';

describe('dashboard schemas', () => {
  it('parses valid pulse payload', () => {
    const payload = {
      openReports: 3,
      openCases: 1,
      activeTasks: 8,
      openDisputes: 2,
      bookingsToday: 4,
      systemStatus: 'operational',
      updatedAt: new Date().toISOString(),
      timezone: 'UTC',
    };

    expect(DashboardPulseSchema.safeParse(payload).success).toBe(true);
  });

  it('rejects invalid pulse status', () => {
    expect(
      DashboardPulseSchema.safeParse({
        openReports: 3,
        openCases: 1,
        activeTasks: 8,
        openDisputes: 2,
        bookingsToday: 4,
        systemStatus: 'ok',
        updatedAt: new Date().toISOString(),
        timezone: 'UTC',
      }).success
    ).toBe(false);
  });

  it('parses dashboard overview response with pulse block', () => {
    const response = {
      ok: true as const,
      data: {
        stats: {
          activeUsers: 42,
          feeRevenue: 10500,
          openDisputes: 3,
          activeJobs: 9,
        },
        financeSummary: {
          platformCashPosition: 10500,
          userFunds: {
            heldInEscrow: 6000,
            totalWalletBalances: 2400,
            totalOwedToUsers: 8400,
            freelancerPayablesAvailable: 1800,
            pendingPayouts: 600,
            freelancerPayablesTotal: 2400,
            otherUserWalletLiabilities: 0,
            totalPlatformObligations: 8400,
          },
          companyFunds: {
            totalFeeRevenue: 10500,
            netPlatformEarnings: 10500,
            actualCompanyOwnedBalance: 10500,
            platformRevenue: 10500,
            actualCompanyOwnedCash: 10500,
          },
          reconciliation: {
            gapToPlatformRevenue: 0,
          },
        },
        pulse: {
          openReports: 3,
          openCases: 1,
          activeTasks: 9,
          openDisputes: 3,
          bookingsToday: 2,
          systemStatus: 'degraded',
          updatedAt: new Date().toISOString(),
          timezone: 'UTC',
        },
        kpiTrends: {
          activeUsers: { direction: 'up', deltaPercent: 12.4, label: '+12.4%' },
          feeRevenue: { direction: 'flat', deltaPercent: 0, label: 'No change' },
          activeJobs: { direction: 'down', deltaPercent: -4.2, label: '-4.2%' },
          openDisputes: { direction: 'flat', deltaPercent: 0, label: 'No change' },
          comparisonWindow: 'last 30d vs previous 30d',
        },
        recentActivity: [],
        revenueHistory: [],
        userGrowth: [],
      },
    };

    expect(DashboardOverviewResponseSchema.safeParse(response).success).toBe(true);
  });
});
