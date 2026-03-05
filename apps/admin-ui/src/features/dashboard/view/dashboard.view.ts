import type {
  DashboardKpiTrend,
  DashboardPulse,
  DashboardStats,
  DashboardSystemStatus,
} from '../services/dashboard_api';

export interface DashboardPulseItem {
  id: string;
  label: string;
  value: string;
  toneClass: string;
}

export function getDashboardKpiTrendLabel(trend?: DashboardKpiTrend): string {
  if (!trend) return 'No change';
  return trend.label || 'No change';
}

function formatPulseNumber(value: number | undefined): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return '--';
}

function formatSystemStatus(
  status: DashboardSystemStatus | undefined,
): { value: string; toneClass: string } {
  if (!status) {
    return { value: '--', toneClass: 'text-[#e2d5c2]' };
  }

  if (status === 'down') {
    return { value: 'DOWN', toneClass: 'text-rose-400' };
  }

  if (status === 'degraded') {
    return { value: 'DEGRADED', toneClass: 'text-amber-300' };
  }

  return { value: 'OK', toneClass: 'text-emerald-400' };
}

export function getDashboardPulseItems(
  stats?: DashboardStats,
  pulse?: DashboardPulse,
): DashboardPulseItem[] {
  const systemStatus = formatSystemStatus(pulse?.systemStatus);

  return [
    {
      id: 'open-reports',
      label: 'Open Reports',
      value: formatPulseNumber(pulse?.openReports),
      toneClass: 'text-amber-400',
    },
    {
      id: 'open-cases',
      label: 'Open Cases',
      value: formatPulseNumber(pulse?.openCases),
      toneClass: 'text-yellow-300',
    },
    {
      id: 'active-tasks',
      label: 'Active Tasks',
      value: formatPulseNumber(pulse?.activeTasks ?? stats?.activeJobs),
      toneClass: 'text-sky-400',
    },
    {
      id: 'open-disputes',
      label: 'Open Disputes',
      value: formatPulseNumber(pulse?.openDisputes ?? stats?.openDisputes),
      toneClass: 'text-violet-400',
    },
    {
      id: 'bookings-today',
      label: 'Bookings Today',
      value: formatPulseNumber(pulse?.bookingsToday),
      toneClass: 'text-teal-300',
    },
    {
      id: 'system-status',
      label: 'System Status',
      value: systemStatus.value,
      toneClass: systemStatus.toneClass,
    },
  ];
}
