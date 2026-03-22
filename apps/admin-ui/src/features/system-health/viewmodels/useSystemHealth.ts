import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createScopedLogger } from '../../../lib/appLogger';
import { observabilityApi } from '../services/observability_api';

const log = createScopedLogger('SystemHealth:VM');

const LIVE_INTERVAL_MS = 15000;

export function useSystemHealth() {
  const [liveInterval, setLiveIntervalState] = useState<number | false>(false);

  const query = useQuery({
    queryKey: ['observability', 'system-health'],
    queryFn: async () => {
      log.info('Fetching observability');
      const data = await observabilityApi.getObservability();
      log.info('Observability loaded', { servicesCount: data.services?.length, hasSummary: !!data.summary });
      return data;
    },
    refetchInterval: liveInterval || false,
  });

  const setLiveInterval = useCallback((value: number | false) => {
    log.debug(value ? 'Live refresh on (15s)' : 'Live refresh off', { value });
    setLiveIntervalState(value);
  }, []);

  if (query.isError) {
    log.error('Observability fetch failed', { error: String(query.error) });
  }

  return {
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? String(query.error) : null,
    data: query.data,
    refetch: query.refetch,
    isError: query.isError,
    liveInterval: liveInterval ?? false,
    setLiveInterval,
    liveIntervalMs: LIVE_INTERVAL_MS,
  };
}
