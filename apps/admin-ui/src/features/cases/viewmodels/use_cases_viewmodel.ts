import { useState, useCallback, useEffect, useMemo } from 'react';
import type { AdminCase, AdminCasesHeroSeries } from '@sline/shared';
import { casesApi } from '../services/cases_api';
import { CASES_KPI_MOCK, HERO_CLOSED_SERIES_MOCK, HERO_OPENED_SERIES_MOCK } from '../models/cases-ui.mock';

const KPI_LABELS: Record<'total' | 'open' | 'in_progress' | 'escalated', string> = {
  total: 'Total Cases',
  open: 'Open',
  in_progress: 'In Progress',
  escalated: 'Escalated',
};

export interface CasesFilters {
  page?: number;
  limit?: number;
  query?: string;
  status?: string;
  priority?: string;
  source?: string;
  sort?: 'created_desc' | 'created_asc';
}

export interface CasesKpiItem {
  id: 'total' | 'open' | 'in_progress' | 'escalated';
  label: string;
  value: number;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  sparkline: number[];
  isMock: boolean;
}

function createMockHeroSeries() {
  return {
    opened: [...HERO_OPENED_SERIES_MOCK],
    closed: [...HERO_CLOSED_SERIES_MOCK],
  };
}

function createFallbackKpis(cases: AdminCase[], count: number): CasesKpiItem[] {
  const counts = {
    total: count || cases.length,
    open: 0,
    in_progress: 0,
    escalated: 0,
  };

  for (const caseItem of cases) {
    const normalizedStatus = normalizeStatus(caseItem);
    if (normalizedStatus === 'open') counts.open += 1;
    if (normalizedStatus === 'in_progress') counts.in_progress += 1;
    if (normalizedStatus === 'escalated') counts.escalated += 1;
  }

  return CASES_KPI_MOCK.map((item) => ({
    ...item,
    value: counts[item.id],
    isMock: true,
  }));
}

function mapApiKpis(kpis: AdminCasesHeroSeries['kpis']): CasesKpiItem[] {
  return kpis.map((item) => ({
    id: item.id,
    label: KPI_LABELS[item.id],
    value: item.value,
    delta: item.delta,
    trend: item.trend,
    sparkline: item.sparkline,
    isMock: false,
  }));
}

export async function loadCasesHeroSeries(
  apiClient: Pick<typeof casesApi, 'getCasesAnalytics'>
): Promise<AdminCasesHeroSeries | null> {
  try {
    const data = await apiClient.getCasesAnalytics({ window: '7d' });
    if (data.is_stale === true) return null;
    if (data.opened.length !== 7 || data.closed.length !== 7 || data.kpis.length !== 4) return null;
    return data;
  } catch {
    return null;
  }
}

function normalizeStatus(caseItem: AdminCase): 'open' | 'in_progress' | 'escalated' | 'closed' {
  const status = String(caseItem.status ?? 'open').toLowerCase().replace(/\s+/g, '_');
  if (status === 'closed') return 'closed';
  if (status === 'in_progress') return 'in_progress';
  if (status === 'escalated') return 'escalated';
  if (String(caseItem.severity ?? '').toLowerCase() === 'critical') return 'escalated';
  return 'open';
}

function normalizePriority(caseItem: AdminCase): 'low' | 'medium' | 'high' | 'critical' {
  const priority = String(caseItem.priority ?? '').toLowerCase();
  const severity = String(caseItem.severity ?? '').toLowerCase();

  if (priority === 'urgent' || priority === 'critical' || severity === 'critical') return 'critical';
  if (priority === 'high' || severity === 'high') return 'high';
  if (priority === 'low' || severity === 'low') return 'low';
  return 'medium';
}

function normalizeSource(caseItem: AdminCase): string {
  const source = String(caseItem.source ?? 'manual').toLowerCase();
  if (source.includes('report')) return 'reports';
  if (source.includes('dispute')) return 'dispute';
  if (source.includes('system')) return 'system';
  if (source.includes('manual')) return 'manual';
  return source || 'manual';
}

export function useCasesViewModel(
  initialFilters: CasesFilters = {
    page: 1,
    limit: 10,
    query: '',
    status: 'all',
    priority: 'all',
    source: 'all',
    sort: 'created_desc',
  }
) {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CasesFilters>(initialFilters);
  const [debouncedQuery, setDebouncedQuery] = useState(String(initialFilters.query ?? ''));
  const [heroOpenedSeries, setHeroOpenedSeries] = useState<number[]>(() => [...HERO_OPENED_SERIES_MOCK]);
  const [heroClosedSeries, setHeroClosedSeries] = useState<number[]>(() => [...HERO_CLOSED_SERIES_MOCK]);
  const [isHeroSeriesMock, setIsHeroSeriesMock] = useState(true);
  const [analyticsKpis, setAnalyticsKpis] = useState<CasesKpiItem[] | null>(null);

  const fetchCases = useCallback(async (currentFilters: CasesFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await casesApi.listCases({
        page: currentFilters.page ?? 1,
        limit: currentFilters.limit ?? 10,
        q: currentFilters.query?.trim() || undefined,
        status: currentFilters.status ?? 'all',
        priority: currentFilters.priority ?? 'all',
        source: currentFilters.source ?? 'all',
        sort: currentFilters.sort ?? 'created_desc',
      });
      setCases(data.cases);
      setCount(data.total);
      setTotalPages(data.totalPages ?? (data.limit ? Math.ceil(data.total / data.limit) : 0));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHeroAnalytics = useCallback(async () => {
    setIsHeroLoading(true);
    try {
      const data = await loadCasesHeroSeries(casesApi);
      if (!data) {
        const fallback = createMockHeroSeries();
        setHeroOpenedSeries(fallback.opened);
        setHeroClosedSeries(fallback.closed);
        setAnalyticsKpis(null);
        setIsHeroSeriesMock(true);
        return;
      }

      setHeroOpenedSeries(data.opened.map((point) => point.value));
      setHeroClosedSeries(data.closed.map((point) => point.value));
      setAnalyticsKpis(mapApiKpis(data.kpis));
      setIsHeroSeriesMock(false);
    } finally {
      setIsHeroLoading(false);
    }
  }, []);

  const changeFilters = useCallback((newFilters: Partial<CasesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(String(filters.query ?? '').trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.query]);

  useEffect(() => {
    void fetchCases({
      ...filters,
      query: debouncedQuery,
    });
  }, [
    debouncedQuery,
    fetchCases,
    filters.limit,
    filters.page,
    filters.priority,
    filters.sort,
    filters.source,
    filters.status,
  ]);

  useEffect(() => {
    void fetchHeroAnalytics();
  }, [fetchHeroAnalytics]);

  const filteredCases = useMemo(() => cases, [cases]);

  const kpis = useMemo<CasesKpiItem[]>(() => {
    if (analyticsKpis) return analyticsKpis;
    return createFallbackKpis(cases, count);
  }, [analyticsKpis, cases, count]);

  const availableSources = useMemo(() => {
    const defaultSources = ['reports', 'manual', 'system', 'dispute'];
    const dynamicSources = cases.map((caseItem) => normalizeSource(caseItem));
    return Array.from(new Set([...defaultSources, ...dynamicSources]));
  }, [cases]);

  return {
    cases,
    filteredCases,
    count,
    totalPages,
    isLoading,
    error,
    filters,
    changeFilters,
    resultCount: count,
    kpis,
    heroOpenedSeries,
    heroClosedSeries,
    isHeroSeriesMock,
    isHeroLoading,
    availableSources,
    normalizeStatus,
    normalizePriority,
    normalizeSource,
    refreshCases: () =>
      Promise.all([
        fetchCases({
          ...filters,
          query: String(filters.query ?? '').trim(),
        }),
        fetchHeroAnalytics(),
      ]),
  };
}
