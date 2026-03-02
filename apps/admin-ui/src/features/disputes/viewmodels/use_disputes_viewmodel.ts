import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { disputesApi } from "../services/disputes_api";

export interface DisputeFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export function useDisputesViewModel() {
  const queryClient = useQueryClient();

  // Queries for Kanban columns
  const openQuery = useQuery({
    queryKey: ['disputes', 'kanban', 'open'],
    queryFn: () => disputesApi.getDisputes({ status: 'open', limit: 50 })
  });

  const investigatingQuery = useQuery({
    queryKey: ['disputes', 'kanban', 'in_progress'],
    queryFn: () => disputesApi.getDisputes({ status: 'in_progress', limit: 50 })
  });

  const resolvedQuery = useQuery({
    queryKey: ['disputes', 'kanban', 'resolved'],
    queryFn: () => disputesApi.getDisputes({ status: 'resolved', limit: 50 })
  });

  const escalatedQuery = useQuery({
    queryKey: ['disputes', 'kanban', 'escalated'],
    queryFn: () => disputesApi.getDisputes({ status: 'escalated', limit: 50 })
  });

  const isLoading = openQuery.isLoading || investigatingQuery.isLoading || resolvedQuery.isLoading || escalatedQuery.isLoading;

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['disputes', 'kanban'] });
  };

  return {
    columns: {
      open: openQuery.data?.disputes || [],
      investigating: investigatingQuery.data?.disputes || [],
      resolved: resolvedQuery.data?.disputes || [],
      escalated: escalatedQuery.data?.disputes || [],
    },
    isLoading,
    refreshAll,
    error: openQuery.error || investigatingQuery.error || resolvedQuery.error || escalatedQuery.error
  };
}
