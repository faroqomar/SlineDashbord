import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard_api';

export function useDashboardViewModel() {
  const query = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardApi.getOverview(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    stats: query.data?.stats,
    pulse: query.data?.pulse,
    kpiTrends: query.data?.kpiTrends,
    recentActivity: query.data?.recentActivity,
    revenueHistory: query.data?.revenueHistory,
    userGrowth: query.data?.userGrowth,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
