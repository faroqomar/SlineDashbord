import { useState, useCallback, useRef, useEffect } from 'react';
import { request } from '@/lib/api';
import type { AdminGlobalSearchResultItem, AdminSearchEntityType } from '@sline/shared';

const DEBOUNCE_MS = 300;
const REQUEST_TIMEOUT_MS = 10000;

export function useGlobalSearchViewModel() {
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState<AdminSearchEntityType[] | undefined>(undefined);
  const [results, setResults] = useState<AdminGlobalSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

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
    setResults([]);

    const params = new URLSearchParams({ q, limit: '20' });
    if (typeFilter?.length) params.set('types', typeFilter.join(','));

    const timeoutId = setTimeout(() => setTimedOut(true), REQUEST_TIMEOUT_MS);

    try {
      const result = await request<{ items: AdminGlobalSearchResultItem[] }>(
        'GET',
        `/search?${params.toString()}`
      );
      clearTimeout(timeoutId);
      if (result.ok) {
        setResults(result.data.items ?? []);
      } else {
        setError(result.error?.message ?? 'Search failed');
      }
    } catch (e) {
      clearTimeout(timeoutId);
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      setTimedOut(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      runSearch(query.trim(), types);
      timeoutRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, types, runSearch]);

  const setQueryOnly = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const setTypesFilter = useCallback((t: AdminSearchEntityType[] | undefined) => {
    setTypes(t);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setTimedOut(false);
    if (query.trim().length >= 2) runSearch(query.trim(), types);
  }, [query, types, runSearch]);

  return {
    query,
    setQuery: setQueryOnly,
    types,
    setTypes: setTypesFilter,
    results,
    loading,
    error,
    timedOut,
    retry,
  };
}
