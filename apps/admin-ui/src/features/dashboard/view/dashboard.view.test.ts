import { describe, it, expect } from 'vitest';
import { getDashboardKpiTrendLabel, getDashboardPulseItems } from './dashboard.view';

describe('getDashboardPulseItems', () => {
  it('maps real pulse values', () => {
    const items = getDashboardPulseItems(
      {
        activeUsers: 100,
        feeRevenue: 2000,
        openDisputes: 4,
        activeJobs: 12,
      },
      {
        openReports: 7,
        openCases: 3,
        activeTasks: 12,
        openDisputes: 4,
        bookingsToday: 5,
        systemStatus: 'operational',
        updatedAt: new Date().toISOString(),
        timezone: 'UTC',
      }
    );

    expect(items).toHaveLength(6);
    expect(items.find((item) => item.id === 'system-status')?.value).toBe('OK');
  });

  it('falls back to placeholders when pulse fields are missing', () => {
    const items = getDashboardPulseItems(undefined, undefined);

    expect(items).toHaveLength(6);
    expect(items.find((item) => item.id === 'open-reports')?.value).toBe('--');
    expect(items.find((item) => item.id === 'open-cases')?.value).toBe('--');
    expect(items.find((item) => item.id === 'bookings-today')?.value).toBe('--');
    expect(items.find((item) => item.id === 'system-status')?.value).toBe('--');
  });

  it('maps degraded/down system status with warning tones', () => {
    const degraded = getDashboardPulseItems(undefined, {
      openReports: 0,
      openCases: 0,
      activeTasks: 0,
      openDisputes: 0,
      bookingsToday: 0,
      systemStatus: 'degraded',
      updatedAt: new Date().toISOString(),
      timezone: 'UTC',
    });

    const down = getDashboardPulseItems(undefined, {
      openReports: 0,
      openCases: 0,
      activeTasks: 0,
      openDisputes: 0,
      bookingsToday: 0,
      systemStatus: 'down',
      updatedAt: new Date().toISOString(),
      timezone: 'UTC',
    });

    expect(degraded.find((item) => item.id === 'system-status')?.value).toBe('DEGRADED');
    expect(down.find((item) => item.id === 'system-status')?.value).toBe('DOWN');
  });
});

describe('getDashboardKpiTrendLabel', () => {
  it('returns fallback when trend is missing', () => {
    expect(getDashboardKpiTrendLabel(undefined)).toBe('No change');
  });

  it('returns backend-provided trend label', () => {
    expect(
      getDashboardKpiTrendLabel({ direction: 'up', deltaPercent: 5.4, label: '+5.4%' })
    ).toBe('+5.4%');
  });
});
