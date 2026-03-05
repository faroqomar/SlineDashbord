import type { AdminSearchEntityType, AdminSearchInsightsResult } from '@sline/shared';
import {
  REAL_SEARCH_TYPES,
  type SearchApiItem,
  type SearchFilterKey,
  type SearchFilterChip,
  type SearchKpiCard,
  type SearchRecentSearch,
  type SearchResultRow,
  type SearchSavedSearch,
  type SearchShortcutHint,
  type SearchTip,
  type SearchTone,
  type SearchVolumePoint,
  isRealSearchType,
} from './search-ui.model';

export const SEARCH_SHORTCUT_HINTS: SearchShortcutHint[] = [
  { keyLabel: 'CMD+K', label: 'Quick search' },
  { keyLabel: 'ESC', label: 'Clear' },
  { keyLabel: 'TAB', label: 'Switch filter' },
];

export const SEARCH_KPI_MOCK: SearchKpiCard[] = [
  {
    id: 'searches_today',
    label: 'Searches Today',
    value: '284',
    delta: '+18%',
    tone: 'info',
    sparkline: [24, 32, 28, 40, 37, 44],
    isMock: true,
  },
  {
    id: 'avg_results',
    label: 'Avg. Results/Query',
    value: '8.3',
    delta: '+5%',
    tone: 'accent',
    sparkline: [18, 26, 22, 36, 30, 41],
    isMock: true,
  },
  {
    id: 'instant_matches',
    label: 'Instant Matches',
    value: '95%',
    delta: '+2%',
    tone: 'success',
    sparkline: [40, 42, 39, 43, 41, 45],
    isMock: true,
  },
  {
    id: 'zero_results',
    label: 'Zero Results',
    value: '4',
    delta: '-3',
    tone: 'warning',
    sparkline: [44, 26, 48, 20, 36, 18],
    isMock: true,
  },
];

function formatDeltaPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return '0%';
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

export function buildSearchKpiCardsFromInsights(insights: AdminSearchInsightsResult): SearchKpiCard[] {
  const stale = insights.stale;

  return [
    {
      id: 'searches_today',
      label: 'Searches Today',
      value: `${Math.round(insights.metrics.searchesToday.value)}`,
      delta: formatDeltaPercent(insights.metrics.searchesToday.deltaPercent),
      tone: 'info',
      sparkline: insights.metrics.searchesToday.sparkline,
      isMock: false,
      isStale: stale || insights.metrics.searchesToday.stale,
    },
    {
      id: 'avg_results',
      label: 'Avg. Results/Query',
      value: `${Math.round(insights.metrics.avgResultsPerQuery.value * 10) / 10}`,
      delta: formatDeltaPercent(insights.metrics.avgResultsPerQuery.deltaPercent),
      tone: 'accent',
      sparkline: insights.metrics.avgResultsPerQuery.sparkline,
      isMock: false,
      isStale: stale || insights.metrics.avgResultsPerQuery.stale,
    },
    {
      id: 'instant_matches',
      label: 'Instant Matches',
      value: `${Math.round(insights.metrics.instantMatchRate.value)}%`,
      delta: formatDeltaPercent(insights.metrics.instantMatchRate.deltaPercent),
      tone: 'success',
      sparkline: insights.metrics.instantMatchRate.sparkline,
      isMock: false,
      isStale: stale || insights.metrics.instantMatchRate.stale,
    },
    {
      id: 'zero_results',
      label: 'Zero Results',
      value: `${Math.round(insights.metrics.zeroResultQueries.value)}`,
      delta: formatDeltaPercent(insights.metrics.zeroResultQueries.deltaPercent),
      tone: insights.metrics.zeroResultQueries.deltaPercent > 0 ? 'warning' : 'success',
      sparkline: insights.metrics.zeroResultQueries.sparkline,
      isMock: false,
      isStale: stale || insights.metrics.zeroResultQueries.stale,
    },
  ];
}

export const SEARCH_SAVED_SEARCHES_MOCK: SearchSavedSearch[] = [
  { id: 'saved_1', title: 'Escalated disputes', resultLabel: '3 results', tone: 'warning', isMock: true },
  { id: 'saved_2', title: 'Active users Baghdad', resultLabel: '12 results', tone: 'info', isMock: true },
  { id: 'saved_3', title: 'Cancelled bookings', resultLabel: '7 results', tone: 'accent', isMock: true },
  { id: 'saved_4', title: 'Critical cases', resultLabel: '2 results', tone: 'danger', isMock: true },
];

export const SEARCH_RECENT_SEARCHES_MOCK: SearchRecentSearch[] = [
  { id: 'recent_1', text: 'Eros Gray', timeAgo: '2m ago', isMock: true },
  { id: 'recent_2', text: 'Booking #B-9912', timeAgo: '15m ago', isMock: true },
  { id: 'recent_3', text: 'dispute escalated', timeAgo: '1h ago', isMock: true },
  { id: 'recent_4', text: 'payment failed', timeAgo: '3h ago', isMock: true },
  { id: 'recent_5', text: 'usr_c3d4e5f6', timeAgo: '5h ago', isMock: true },
  { id: 'recent_6', text: 'taxi app', timeAgo: '1d ago', isMock: true },
];

export const SEARCH_VOLUME_MOCK: SearchVolumePoint[] = [
  { label: '6AM', value: 12 },
  { label: '8AM', value: 22 },
  { label: '10AM', value: 36 },
  { label: '12PM', value: 44 },
  { label: '2PM', value: 38 },
  { label: '3PM', value: 42 },
  { label: '4PM', value: 47 },
  { label: '5PM', value: 40 },
];

export const SEARCH_TIPS_MOCK: SearchTip[] = [
  { id: 'tip_1', text: 'Use exact IDs like usr_e7a4... for direct lookup', isMock: true },
  { id: 'tip_2', text: 'Prefix with type: e.g. booking: airport', isMock: true },
  { id: 'tip_3', text: 'Use quotes for exact phrase matching', isMock: true },
  { id: 'tip_4', text: 'Combine filters with keywords for precision', isMock: true },
];

export const SEARCH_FILTER_ORDER: SearchFilterKey[] = [
  'all',
  'user',
  'booking',
  'task',
  'dispute',
  'report',
  'case',
  'transaction',
];

export const SEARCH_FILTER_LABELS: Record<SearchFilterKey, string> = {
  all: 'All',
  user: 'Users',
  booking: 'Bookings',
  task: 'Tasks',
  dispute: 'Disputes',
  report: 'Reports',
  case: 'Cases',
  transaction: 'Transactions',
};

const REAL_ENTITY_LABELS: Record<AdminSearchEntityType, string> = {
  user: 'User',
  task: 'Task',
  booking: 'Booking',
  dispute: 'Dispute',
  transaction: 'Transaction',
};

const REAL_STATUS_META: Record<
  AdminSearchEntityType,
  { statusLabel: string; statusTone: SearchTone; detailLine: string }
> = {
  user: { statusLabel: 'Active', statusTone: 'success', detailLine: 'Profile activity snapshot' },
  task: { statusLabel: 'In Progress', statusTone: 'info', detailLine: 'Assigned to moderation queue' },
  booking: { statusLabel: 'Confirmed', statusTone: 'success', detailLine: 'Booking lifecycle tracked' },
  dispute: { statusLabel: 'Escalated', statusTone: 'warning', detailLine: 'Priority dispute workflow' },
  transaction: { statusLabel: 'Completed', statusTone: 'success', detailLine: 'Payment ledger entry' },
};

export const SEARCH_RESULT_ROWS_MOCK: SearchResultRow[] = [
  {
    id: 'mock_report_under_review',
    entityType: 'report',
    entityLabel: 'Report',
    statusLabel: 'Under Review',
    statusTone: 'warning',
    detailLine: 'Category: Content',
    timeLabel: 'Filed 1d ago',
    relevance: 82,
    primaryText: 'Content report',
    secondaryText: 'Category: Content',
    isMock: true,
  },
  {
    id: 'mock_case_open',
    entityType: 'case',
    entityLabel: 'Case',
    statusLabel: 'Open',
    statusTone: 'danger',
    detailLine: 'Severity: Critical',
    timeLabel: 'Opened 2d ago',
    relevance: 79,
    primaryText: 'Account',
    secondaryText: 'Account takeover investigation',
    isMock: true,
  },
  {
    id: 'mock_task_progress',
    entityType: 'task',
    entityLabel: 'Task',
    statusLabel: 'In Progress',
    statusTone: 'info',
    detailLine: 'Assigned: admin_02',
    timeLabel: 'Due Mar 6, 2026',
    relevance: 76,
    primaryText: 'UI',
    secondaryText: 'UI/UX review for new driver interface',
    isMock: true,
  },
  {
    id: 'mock_tx_completed',
    entityType: 'transaction',
    entityLabel: 'Transaction',
    statusLabel: 'Completed',
    statusTone: 'success',
    detailLine: '$45.00 - Stripe',
    timeLabel: 'Mar 3, 2026',
    relevance: 74,
    primaryText: 'Payment',
    secondaryText: 'Payment from Eros Gray -> Platform',
    isMock: true,
  },
  {
    id: 'mock_user_inactive',
    entityType: 'user',
    entityLabel: 'User',
    statusLabel: 'Inactive',
    statusTone: 'neutral',
    detailLine: '0 tasks - 1 booking',
    timeLabel: 'Last active 30d ago',
    relevance: 71,
    primaryText: 'shahad@gmail.com',
    secondaryText: 'Najaf, IQ',
    isMock: true,
  },
  {
    id: 'mock_booking_cancelled',
    entityType: 'booking',
    entityLabel: 'Booking',
    statusLabel: 'Cancelled',
    statusTone: 'danger',
    detailLine: '$0.00 - Refunded',
    timeLabel: 'Mar 1, 2026',
    relevance: 69,
    primaryText: 'City Tour',
    secondaryText: 'Zahraa Firas -> Driver Ali',
    isMock: true,
  },
  {
    id: 'mock_dispute_resolved',
    entityType: 'dispute',
    entityLabel: 'Dispute',
    statusLabel: 'Resolved',
    statusTone: 'success',
    detailLine: 'Resolution: Refund issued',
    timeLabel: 'Resolved Mar 2',
    relevance: 64,
    primaryText: 'Overcharge claim',
    secondaryText: 'Booking #B-9901',
    isMock: true,
  },
];

const TIME_LABELS = [
  'Opened 2h ago',
  'Created 3h ago',
  'Filed 1d ago',
  'Resolved Mar 2',
  'Updated 15m ago',
  'Last active 4h ago',
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickTimeLabel(seed: number): string {
  return TIME_LABELS[seed % TIME_LABELS.length];
}

export function buildSearchRowFromApiItem(item: SearchApiItem): SearchResultRow {
  const seed = hashString(`${item.entityType}-${item.id}`);
  const meta = REAL_STATUS_META[item.entityType];
  const suffix = item.id.slice(0, 8);
  const fallbackSecondary = `${REAL_ENTITY_LABELS[item.entityType]} - ${suffix}`;

  return {
    id: item.id,
    entityType: item.entityType,
    entityLabel: REAL_ENTITY_LABELS[item.entityType],
    statusLabel: meta.statusLabel,
    statusTone: meta.statusTone,
    detailLine: item.subtitle || meta.detailLine,
    timeLabel: pickTimeLabel(seed),
    relevance: 45 + (seed % 50),
    primaryText: item.title,
    secondaryText: item.subtitle || fallbackSecondary,
    link: item.link,
    isMock: false,
  };
}

export function filterMockRows(query: string, type: SearchFilterKey): SearchResultRow[] {
  const normalized = query.trim().toLowerCase();
  const byType =
    type === 'all'
      ? SEARCH_RESULT_ROWS_MOCK
      : SEARCH_RESULT_ROWS_MOCK.filter((row) => row.entityType === type);

  if (!normalized) return byType;

  return byType.filter((row) => {
    const haystack = [
      row.entityLabel,
      row.statusLabel,
      row.detailLine,
      row.primaryText,
      row.secondaryText,
      row.timeLabel,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function createFilterChips(rows: SearchResultRow[]): SearchFilterChip[] {
  const counts: Record<SearchFilterKey, number> = {
    all: rows.length,
    user: 0,
    booking: 0,
    task: 0,
    dispute: 0,
    report: 0,
    case: 0,
    transaction: 0,
  };

  for (const row of rows) {
    counts[row.entityType] += 1;
  }

  return SEARCH_FILTER_ORDER.map((key) => ({
    key,
    label: SEARCH_FILTER_LABELS[key],
    count: counts[key],
    isMock: key === 'report' || key === 'case',
  }));
}

export function toApiTypeFilter(type: SearchFilterKey): AdminSearchEntityType[] | undefined {
  if (type === 'all') return undefined;
  if (!isRealSearchType(type)) return undefined;
  return [type];
}

export function isMockOnlyFilter(type: SearchFilterKey): boolean {
  return type === 'report' || type === 'case';
}

export function isKnownSearchFilter(type: string): type is SearchFilterKey {
  return ['all', ...REAL_SEARCH_TYPES, 'report', 'case'].includes(type);
}
