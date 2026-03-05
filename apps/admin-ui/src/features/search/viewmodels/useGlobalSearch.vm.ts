import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { request } from '@/lib/api';
import type { AdminGlobalSearchResultItem, AdminSearchEntityType } from '@sline/shared';
import {
  SEARCH_KPI_MOCK,
  SEARCH_RECENT_SEARCHES_MOCK,
  SEARCH_SAVED_SEARCHES_MOCK,
  SEARCH_SHORTCUT_HINTS,
  SEARCH_TIPS_MOCK,
  SEARCH_VOLUME_MOCK,
  buildSearchRowFromApiItem,
  createFilterChips,
  filterMockRows,
  isMockOnlyFilter,
  isKnownSearchFilter,
  toApiTypeFilter,
} from '../models/search-ui.mock';
import type { SearchFilterKey } from '../models/search-ui.model';

const DEBOUNCE_MS = 300;
const REQUEST_TIMEOUT_MS = 10000;

export function useGlobalSearchViewModel() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterKey>('all');
  const [results, setResults] = useState<AdminGlobalSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [recentSearches, setRecentSearches] = useState(SEARCH_RECENT_SEARCHES_MOCK);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string, typeFilter?: AdminSearchEntityType[]) => {
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setTimedOut(false);

    const params = new URLSearchParams({ q, limit: '20' });
    if (typeFilter?.length) params.set('types', typeFilter.join(','));

    const timeoutId = setTimeout(() => setTimedOut(true), REQUEST_TIMEOUT_MS);

    try {
      const result = await request<{ items: AdminGlobalSearchResultItem[] }>('GET', `/search?${params.toString()}`);
      clearTimeout(timeoutId);

      if (result.ok) {
        setResults(result.data.items ?? []);
      } else {
        setError(result.error?.message ?? 'Search failed');
      }
    } catch (cause) {
      clearTimeout(timeoutId);
      setError(cause instanceof Error ? cause.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const trimmed = query.trim();
    const shouldSearchRealApi = trimmed.length >= 2 && !isMockOnlyFilter(activeFilter);
    const typeFilter = toApiTypeFilter(activeFilter);

    if (!shouldSearchRealApi) {
      setResults([]);
      setLoading(false);
      setError(null);
      setTimedOut(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      runSearch(trimmed, typeFilter);
      timeoutRef.current = null;
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeFilter, query, runSearch]);

  const setActiveFilterSafe = useCallback((filter: SearchFilterKey) => {
    if (!isKnownSearchFilter(filter)) return;
    setActiveFilter(filter);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setTimedOut(false);
  }, []);

  const submitSearch = useCallback(() => {
    const trimmed = query.trim();
    const typeFilter = toApiTypeFilter(activeFilter);

    if (trimmed.length < 2 || isMockOnlyFilter(activeFilter)) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    runSearch(trimmed, typeFilter);

    setRecentSearches((previous) => {
      const withoutDuplicate = previous.filter((item) => item.text.toLowerCase() !== trimmed.toLowerCase());
      return [{ id: `recent_${Date.now()}`, text: trimmed, timeAgo: 'now', isMock: true }, ...withoutDuplicate].slice(
        0,
        6
      );
    });
  }, [activeFilter, query, runSearch]);

  const retry = useCallback(() => {
    const trimmed = query.trim();
    const typeFilter = toApiTypeFilter(activeFilter);

    setError(null);
    setTimedOut(false);

    if (trimmed.length >= 2 && !isMockOnlyFilter(activeFilter)) {
      runSearch(trimmed, typeFilter);
    }
  }, [activeFilter, query, runSearch]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const applyRecentSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const applySavedSearch = useCallback((savedSearchId: string) => {
    const selected = SEARCH_SAVED_SEARCHES_MOCK.find((item) => item.id === savedSearchId);
    if (!selected) return;
    setActiveFilter('all');
    setQuery(selected.title);
  }, []);

  const realRows = useMemo(() => results.map(buildSearchRowFromApiItem), [results]);

  const mockRowsForFilter = useMemo(() => filterMockRows(query, activeFilter), [activeFilter, query]);

  const visibleRows = useMemo(() => {
    const trimmed = query.trim();

    if (activeFilter === 'all') {
      if (trimmed.length < 2) return mockRowsForFilter;
      return [...realRows, ...mockRowsForFilter].sort((a, b) => b.relevance - a.relevance);
    }

    if (isMockOnlyFilter(activeFilter)) {
      return mockRowsForFilter;
    }

    if (trimmed.length < 2) {
      return filterMockRows('', activeFilter);
    }

    return [...realRows].sort((a, b) => b.relevance - a.relevance);
  }, [activeFilter, mockRowsForFilter, query, realRows]);

  const chipRows = useMemo(() => {
    const trimmed = query.trim();
    const mockRows = filterMockRows(query, 'all');

    if (trimmed.length < 2) return filterMockRows('', 'all');
    if (isMockOnlyFilter(activeFilter)) return mockRows;

    return [...realRows, ...mockRows];
  }, [activeFilter, query, realRows]);

  const chips = useMemo(() => createFilterChips(chipRows), [chipRows]);

  return {
    query,
    setQuery,
    activeFilter,
    setActiveFilter: setActiveFilterSafe,
    chips,
    results,
    resultRows: visibleRows,
    loading,
    error,
    timedOut,
    retry,
    submitSearch,
    clearSearch,
    applySavedSearch,
    recentSearches,
    applyRecentSearch,
    clearRecentSearches,
    kpis: SEARCH_KPI_MOCK,
    savedSearches: SEARCH_SAVED_SEARCHES_MOCK,
    searchVolume: SEARCH_VOLUME_MOCK,
    searchTips: SEARCH_TIPS_MOCK,
    shortcutHints: SEARCH_SHORTCUT_HINTS,
  };
}
