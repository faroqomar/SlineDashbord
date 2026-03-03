import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '../services/observability_api';

export function useSystemHealth() {
  const query = useQuery({
    queryKey: ['observability', 'system-health'],
    queryFn: () => observabilityApi.getObservability(),
    refetchInterval: 30000,
  });

  return {
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? String(query.error) : null,
    data: query.data,
    refetch: query.refetch,
    isError: query.isError,
  };
}
