/**
 * UI-only fallback values for Cases page sections when analytics is unavailable.
 */

export interface CasesKpiMock {
  id: 'total' | 'open' | 'in_progress' | 'escalated';
  label: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  sparkline: number[];
  isMock: true;
}

export const CASES_KPI_MOCK: CasesKpiMock[] = [
  { id: 'total', label: 'Total Cases', delta: '+28%', trend: 'up', sparkline: [4, 5, 5, 6, 6, 7, 8], isMock: true },
  { id: 'open', label: 'Open', delta: '+1', trend: 'down', sparkline: [6, 5, 6, 5, 4, 4, 3], isMock: true },
  { id: 'in_progress', label: 'In Progress', delta: '+2', trend: 'up', sparkline: [2, 3, 3, 4, 4, 5, 5], isMock: true },
  { id: 'escalated', label: 'Escalated', delta: '+1', trend: 'down', sparkline: [1, 1, 2, 1, 2, 2, 2], isMock: true },
];

export const HERO_OPENED_SERIES_MOCK = [3, 3, 4, 3, 5, 4, 3];
export const HERO_CLOSED_SERIES_MOCK = [2, 3, 2, 4, 3, 5, 4];
