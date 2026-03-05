import type { SearchFilterKey, SearchTone } from '../models/search-ui.model';

export const SEARCH_SURFACE_CLASS =
  'border border-[#7f7668] bg-[#0e0f13] text-[#e8e6e3] shadow-[0_8px_24px_rgba(0,0,0,0.25)]';

export const SEARCH_SUBTLE_TEXT_CLASS = 'text-[#afa89d]';
export const SEARCH_MUTED_TEXT_CLASS = 'text-[#9d9588]';

const TONE_CLASS_MAP: Record<SearchTone, string> = {
  info: 'text-[#5eb1fa] bg-[rgba(5,67,145,0.09)] border-[rgba(5,68,147,0.2)]',
  success: 'text-[#4ae081] bg-[rgba(27,158,75,0.09)] border-[rgba(27,158,76,0.2)]',
  warning: 'text-[#f6a823] bg-[rgba(195,126,8,0.09)] border-[rgba(171,110,7,0.2)]',
  danger: 'text-[#f04d4d] bg-[rgba(159,14,14,0.09)] border-[rgba(150,13,13,0.2)]',
  neutral: 'text-[#9e9589] bg-[rgba(88,96,100,0.09)] border-[rgba(88,96,100,0.2)]',
  accent: 'text-[#9c7df9] bg-[rgba(34,5,118,0.09)] border-[rgba(38,6,133,0.2)]',
};

export function getToneBadgeClass(tone: SearchTone): string {
  return `border ${TONE_CLASS_MAP[tone]}`;
}

const ENTITY_TONE_MAP: Record<SearchFilterKey, SearchTone> = {
  all: 'neutral',
  user: 'info',
  booking: 'accent',
  task: 'success',
  dispute: 'warning',
  report: 'warning',
  case: 'danger',
  transaction: 'success',
};

export function getEntityTone(type: SearchFilterKey): SearchTone {
  return ENTITY_TONE_MAP[type];
}
