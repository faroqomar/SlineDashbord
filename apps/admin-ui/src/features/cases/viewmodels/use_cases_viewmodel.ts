import { useState, useCallback, useEffect } from 'react';
import type { AdminCase } from '@sline/shared';
import { casesApi } from '../services/cases_api';

export interface CasesFilters {
  page?: number;
  limit?: number;
}

export function useCasesViewModel(initialFilters: CasesFilters = { page: 1, limit: 10 }) {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CasesFilters>(initialFilters);

  const fetchCases = useCallback(async (currentFilters: CasesFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await casesApi.listCases({
        page: currentFilters.page ?? 1,
        limit: currentFilters.limit ?? 10,
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

  const changeFilters = useCallback((newFilters: Partial<CasesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchCases(filters);
  }, [filters.page, filters.limit, fetchCases]);

  return {
    cases,
    count,
    totalPages,
    isLoading,
    error,
    filters,
    changeFilters,
    refreshCases: () => fetchCases(filters),
  };
}
