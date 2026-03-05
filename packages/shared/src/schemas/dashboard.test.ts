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
          platformRevenue: 10500,
          openDisputes: 3,
          activeJobs: 9,
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
          platformRevenue: { direction: 'flat', deltaPercent: 0, label: 'No change' },
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
