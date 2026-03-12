import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateDisputeInput } from "@sline/shared";
import { toast } from "sonner";
import type { DisputeListResponse } from "../services/disputes_api";
import { disputesApi } from "../services/disputes_api";

export type DisputeTab = 'all' | 'open' | 'active' | 'resolved' | 'canceled';

const PAGE_SIZE = 10;

export function useDisputesViewModel() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DisputeTab>("all");
  const [page, setPage] = useState(1);
  const searchQuery = searchTerm.trim();

  const listQuery = useQuery<DisputeListResponse>({
    queryKey: ['disputes', 'list', statusFilter, page, searchQuery],
    queryFn: () =>
      disputesApi.getDisputes({
        status: statusFilter,
        page,
        limit: PAGE_SIZE,
        query: searchQuery || undefined,
      }),
  });

  const tabCounts = listQuery.data?.tabCounts ?? {
    all: 0,
    open: 0,
    active: 0,
    resolved: 0,
    canceled: 0,
  };
  const disputes = listQuery.data?.disputes ?? [];
  const totalDisputes = listQuery.data?.totalDisputes ?? 0;
  const totalPages = listQuery.data?.totalPages ?? 0;

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['disputes'] });
  };

  const createDisputeMutation = useMutation({
    mutationFn: (data: CreateDisputeInput) => disputesApi.createDispute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      toast.success('Dispute created successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create dispute';
      toast.error(message);
    },
  });

  return {
    tabCounts,
    disputes,
    totalDisputes,
    totalPages,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    refreshAll,
    createDispute: createDisputeMutation.mutateAsync,
    isCreatingDispute: createDisputeMutation.isPending,
    error: listQuery.error,
  };
}
