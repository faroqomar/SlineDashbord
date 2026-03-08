export type ReportsKpiKey = 'total' | 'open' | 'escalated' | 'closed';

export interface ReportsKpiVisualMock {
  deltaLabel: string;
  deltaDirection: 'up' | 'down';
  sparkline: number[];
}

export const REPORTS_KPI_VISUAL_MOCK: Record<ReportsKpiKey, ReportsKpiVisualMock> = {
  total: {
    deltaLabel: '+31%',
    deltaDirection: 'up',
    sparkline: [8, 9, 10, 11, 10, 12, 13],
  },
  open: {
    deltaLabel: '+2',
    deltaDirection: 'down',
    sparkline: [7, 8, 8, 7, 9, 8, 9],
  },
  escalated: {
    deltaLabel: '+1',
    deltaDirection: 'down',
    sparkline: [2, 3, 2, 4, 3, 5, 4],
  },
  closed: {
    deltaLabel: '+3',
    deltaDirection: 'up',
    sparkline: [4, 5, 6, 7, 6, 8, 7],
  },
};

export const REPORTS_HERO_TREND_MOCK = {
  windowLabel: 'Last 7 days',
  incoming: [52, 58, 55, 64, 50, 60, 54, 56],
  resolved: [48, 55, 53, 58, 57, 59, 52, 55],
};
