import type { AdminGlobalSearchResultItem, AdminSearchEntityType } from '@sline/shared';

export const REAL_SEARCH_TYPES: AdminSearchEntityType[] = [
  'user',
  'task',
  'booking',
  'dispute',
  'transaction',
];

export type MockSearchEntityType = 'report' | 'case';
export type SearchFilterKey = 'all' | AdminSearchEntityType | MockSearchEntityType;

export type SearchTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

export interface SearchShortcutHint {
  keyLabel: string;
  label: string;
}

export interface SearchKpiCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: SearchTone;
  sparkline: number[];
  isMock: boolean;
  isStale?: boolean;
}

export interface SearchFilterChip {
  key: SearchFilterKey;
  label: string;
  count: number;
  isMock?: boolean;
}

export interface SearchResultRow {
  id: string;
  entityType: SearchFilterKey;
  entityLabel: string;
  statusLabel: string;
  statusTone: SearchTone;
  detailLine: string;
  timeLabel: string;
  relevance: number;
  primaryText: string;
  secondaryText?: string;
  link?: string;
  isMock?: boolean;
}

export interface SearchSavedSearch {
  id: string;
  title: string;
  resultLabel: string;
  tone: SearchTone;
  isMock: boolean;
}

export interface SearchRecentSearch {
  id: string;
  text: string;
  timeAgo: string;
  isMock: boolean;
}

export interface SearchVolumePoint {
  label: string;
  value: number;
}

export interface SearchTip {
  id: string;
  text: string;
  isMock: boolean;
}

export interface SearchRealRowMeta {
  statusLabel: string;
  statusTone: SearchTone;
  detailLine: string;
}

export function isRealSearchType(type: SearchFilterKey): type is AdminSearchEntityType {
  return REAL_SEARCH_TYPES.includes(type as AdminSearchEntityType);
}

export function asSearchFilterKey(type: AdminSearchEntityType): SearchFilterKey {
  return type;
}

export type SearchApiItem = AdminGlobalSearchResultItem;
