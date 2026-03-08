import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateDisputeInput } from "@sline/shared";
import { toast } from "sonner";
import type { DisputeDTO } from "../models/dispute.schema";
import { buildDisputesAnalytics } from "../models/disputes-analytics";
import { disputesApi } from "../services/disputes_api";

type DisputeStatusFilter = 'all' | 'open' | 'under_review' | 'escalated' | 'resolved';
type LaneKey = 'open' | 'investigating' | 'escalated' | 'resolved';

interface DisputeListResponse {
  disputes: DisputeDTO[];
  totalDisputes: number;
  totalPages: number;
}

export function useDisputesViewModel() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DisputeStatusFilter>("all");
  const searchQuery = searchTerm.trim();

  // Queries for Kanban columns
  const openQuery = useQuery<DisputeListResponse>({
    queryKey: ['disputes', 'kanban', 'open', searchQuery],
    queryFn: () => disputesApi.getDisputes({ status: 'open', limit: 50, query: searchQuery || undefined })
  });

  const investigatingQuery = useQuery<DisputeListResponse>({
    queryKey: ['disputes', 'kanban', 'in_progress', searchQuery],
    queryFn: () => disputesApi.getDisputes({ status: 'in_progress', limit: 50, query: searchQuery || undefined })
  });

  const resolvedQuery = useQuery<DisputeListResponse>({
    queryKey: ['disputes', 'kanban', 'resolved', searchQuery],
    queryFn: () => disputesApi.getDisputes({ status: 'resolved', limit: 50, query: searchQuery || undefined })
  });

  const escalatedQuery = useQuery<DisputeListResponse>({
    queryKey: ['disputes', 'kanban', 'escalated', searchQuery],
    queryFn: () => disputesApi.getDisputes({ status: 'escalated', limit: 50, query: searchQuery || undefined })
  });

  const isLoading = openQuery.isLoading || investigatingQuery.isLoading || resolvedQuery.isLoading || escalatedQuery.isLoading;
  const isFetching = openQuery.isFetching || investigatingQuery.isFetching || resolvedQuery.isFetching || escalatedQuery.isFetching;

  const columns = useMemo(() => ({
    open: openQuery.data?.disputes || [],
    investigating: investigatingQuery.data?.disputes || [],
    resolved: resolvedQuery.data?.disputes || [],
    escalated: escalatedQuery.data?.disputes || [],
  }), [openQuery.data?.disputes, investigatingQuery.data?.disputes, resolvedQuery.data?.disputes, escalatedQuery.data?.disputes]);

  const visibleColumns = useMemo<LaneKey[]>(() => {
    if (statusFilter === 'all') {
      return ['open', 'investigating', 'escalated', 'resolved'];
    }

    if (statusFilter === 'under_review') {
      return ['investigating'];
    }

    return [statusFilter];
  }, [statusFilter]);

  const summary = useMemo(() => {
    const openTotal = openQuery.data?.totalDisputes ?? columns.open.length;
    const investigatingTotal = investigatingQuery.data?.totalDisputes ?? columns.investigating.length;
    const resolvedTotal = resolvedQuery.data?.totalDisputes ?? columns.resolved.length;
    const escalatedTotal = escalatedQuery.data?.totalDisputes ?? columns.escalated.length;

    const totalAmount = [
      ...columns.open,
      ...columns.investigating,
      ...columns.escalated,
      ...columns.resolved,
    ].reduce((sum, dispute) => sum + Number(dispute?.amount || 0), 0);

    return {
      totalDisputes: openTotal + investigatingTotal + resolvedTotal + escalatedTotal,
      openActive: openTotal + investigatingTotal,
      resolved: resolvedTotal,
      totalAmount,
    };
  }, [
    openQuery.data?.totalDisputes,
    investigatingQuery.data?.totalDisputes,
    resolvedQuery.data?.totalDisputes,
    escalatedQuery.data?.totalDisputes,
    columns.open,
    columns.investigating,
    columns.escalated,
    columns.resolved,
  ]);

  const analytics = useMemo(() => {
    const allDisputes = [
      ...columns.open,
      ...columns.investigating,
      ...columns.escalated,
      ...columns.resolved,
    ];
    return buildDisputesAnalytics(allDisputes);
  }, [columns.open, columns.investigating, columns.escalated, columns.resolved]);

  const hasAnyData = columns.open.length > 0 || columns.investigating.length > 0 || columns.escalated.length > 0 || columns.resolved.length > 0;

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['disputes', 'kanban'] });
  };

  const createDisputeMutation = useMutation({
    mutationFn: (data: CreateDisputeInput) => disputesApi.createDispute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes', 'kanban'] });
      toast.success('Dispute created successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create dispute';
      toast.error(message);
    },
  });

  return {
    columns,
    visibleColumns,
    summary,
    analytics,
    hasAnyData,
    isLoading,
    isFetching,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    refreshAll,
    createDispute: createDisputeMutation.mutateAsync,
    isCreatingDispute: createDisputeMutation.isPending,
    error: openQuery.error || investigatingQuery.error || resolvedQuery.error || escalatedQuery.error
  };
}
