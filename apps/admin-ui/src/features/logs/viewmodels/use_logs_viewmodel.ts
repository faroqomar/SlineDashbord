import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logsApi } from '../services/logs_api';

export type LogsFilters = {
  action: string;
  actorUserId: string;
  from: string;
  to: string;
};

const DEFAULT_LIMIT = 20;

export function useLogsViewModel() {
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState<LogsFilters>({
    action: '',
    actorUserId: '',
    from: '',
    to: '',
  });
  const [filters, setFilters] = useState<LogsFilters>({
    action: '',
    actorUserId: '',
    from: '',
    to: '',
  });

  const query = useQuery({
    queryKey: ['logs', page, filters],
    queryFn: () =>
      logsApi.getLogs({
        page,
        limit: DEFAULT_LIMIT,
        action: filters.action || undefined,
        actorUserId: filters.actorUserId || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      }),
  });

  const totalPages = query.data?.totalPages || 0;
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  const statusTone = useMemo(
    () => ({
      success: 'text-emerald-500',
      warning: 'text-amber-500',
      error: 'text-rose-500',
      info: 'text-sky-500',
    }),
    []
  );

  return {
    logs: query.data?.logs || [],
    count: query.data?.count || 0,
    totalPages,
    page,
    draftFilters,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    statusTone,
    setDraftFilters,
    applyFilters: () => {
      setPage(1);
      setFilters(draftFilters);
    },
    resetFilters: () => {
      const empty = { action: '', actorUserId: '', from: '', to: '' };
      setDraftFilters(empty);
      setFilters(empty);
      setPage(1);
    },
    goPrev: () => {
      if (canPrev) setPage((value) => value - 1);
    },
    goNext: () => {
      if (canNext) setPage((value) => value + 1);
    },
    canPrev,
    canNext,
  };
}
