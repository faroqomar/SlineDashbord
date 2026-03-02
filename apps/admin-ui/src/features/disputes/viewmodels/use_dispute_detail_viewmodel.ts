import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { disputesApi } from "../services/disputes_api";
import { toast } from "sonner";
import { useState } from "react";

export function useDisputeDetailViewModel(disputeId: string) {
  const queryClient = useQueryClient();
  const [isResolving, setIsResolving] = useState(false);

  const { data: dispute, isLoading, error } = useQuery({
    queryKey: ['disputes', 'detail', disputeId],
    queryFn: () => disputesApi.getDisputeDetails(disputeId),
    enabled: !!disputeId
  });

  const resolveMutation = useMutation({
    mutationFn: (data: { status: string, resolution: string, decision?: string }) => 
      disputesApi.resolveDispute(disputeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes', 'detail', disputeId] });
      queryClient.invalidateQueries({ queryKey: ['disputes', 'kanban'] });
      toast.success("Dispute resolved successfully");
      setIsResolving(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to resolve dispute");
    }
  });

  return {
    dispute,
    isLoading,
    error,
    isResolving,
    setIsResolving,
    resolve: resolveMutation.mutate,
    isResolvingAction: resolveMutation.isPending
  };
}
