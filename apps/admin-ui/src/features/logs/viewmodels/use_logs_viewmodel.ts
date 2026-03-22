import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LogLevel, LogSort } from '@sline/shared';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/appLogger';
import { logsApi } from '../services/logs_api';

const log = createScopedLogger('Logs:VM');

export type LogsFilters = {
  q: string;
  source: string;
  level: 'all' | LogLevel;
  sort: LogSort;
};

const DEFAULT_LIMIT = 10;

export function useLogsViewModel() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LogsFilters>({
    q: '',
    source: '',
    level: 'all',
    sort: 'newest',
  });
  const [isLive, setIsLive] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmedSearch = searchInput.trim();
      setFilters((current) => {
        if (current.q === trimmedSearch) return current;
        log.debug('search filter applied', { q: trimmedSearch });
        return { ...current, q: trimmedSearch };
      });
      setPage(1);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useQuery({
    queryKey: ['logs', page, filters],
    queryFn: () =>
      logsApi.getLogs({
        page,
        limit: DEFAULT_LIMIT,
        q: filters.q || undefined,
        source: filters.source || undefined,
        level: filters.level,
        sort: filters.sort,
      }),
    placeholderData: (previousData) => previousData,
    refetchInterval: isLive ? 15000 : false,
  });

  useEffect(() => {
    if (!expandedRowId) return;
    const rowStillVisible = query.data?.logs.some((l) => l.id === expandedRowId) ?? false;
    if (!rowStillVisible) setExpandedRowId(null);
  }, [expandedRowId, query.data?.logs]);

  useEffect(() => {
    if (query.error) {
      log.error('logs query failed', { error: String(query.error) });
    }
  }, [query.error]);

  const totalPages = query.data?.totalPages || 0;
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;
  const count = query.data?.count || 0;
  const showingFrom = count === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const showingTo = count === 0 ? 0 : Math.min(page * DEFAULT_LIMIT, count);
  const paginationPages = Array.from(
    new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (value) => value >= 1 && value <= totalPages
      )
    )
  ).sort((left, right) => left - right);

  async function refresh() {
    log.info('refresh requested');
    await query.refetch();
  }

  async function exportLogs() {
    try {
      await logsApi.exportLogs({
        limit: 10000,
        q: filters.q || undefined,
        source: filters.source || undefined,
        level: filters.level,
        sort: filters.sort,
      });
      toast.success('System logs export downloaded.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export logs';
      log.error('export failed', { error: message });
      toast.error(message);
    }
  }

  return {
    logs: query.data?.logs || [],
    count,
    totalPages,
    page,
    summary: query.data?.summary || {
      total: 0,
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      debug: 0,
    },
    hourlyBuckets: query.data?.hourlyBuckets || [],
    sourceOptions: query.data?.sourceOptions || [],
    filters,
    searchInput,
    showingFrom,
    showingTo,
    paginationPages,
    isLive,
    expandedRowId,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? String(query.error)
          : null,
    setSearchInput,
    setSource: (source: string) => {
      log.debug('source filter changed', { source: source === 'all' ? '' : source });
      setPage(1);
      setFilters((current) => ({
        ...current,
        source: source === 'all' ? '' : source,
      }));
    },
    setLevel: (level: 'all' | LogLevel) => {
      log.debug('level filter changed', { level });
      setPage(1);
      setFilters((current) => ({ ...current, level }));
    },
    setSort: (sort: LogSort) => {
      log.debug('sort changed', { sort });
      setPage(1);
      setFilters((current) => ({ ...current, sort }));
    },
    resetFilters: () => {
      setSearchInput('');
      setFilters({
        q: '',
        source: '',
        level: 'all',
        sort: 'newest',
      });
      setExpandedRowId(null);
      setPage(1);
    },
    goPrev: () => {
      if (canPrev) setPage((value) => value - 1);
    },
    goNext: () => {
      if (canNext) setPage((value) => value + 1);
    },
    goToPage: (nextPage: number) => {
      if (nextPage >= 1 && nextPage <= totalPages) setPage(nextPage);
    },
    refresh,
    exportLogs,
    toggleLive: () => {
      setIsLive((current) => {
        log.info('live toggle', { isLive: !current });
        return !current;
      });
    },
    toggleExpandedRow: (rowId: string) => {
      setExpandedRowId((current) => {
        const next = current === rowId ? null : rowId;
        log.debug('expand row toggled', { rowId: next });
        return next;
      });
    },
    canPrev,
    canNext,
  };
}
