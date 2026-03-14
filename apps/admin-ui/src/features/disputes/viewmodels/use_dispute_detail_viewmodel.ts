import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { disputesApi } from "../services/disputes_api";
import { toast } from "sonner";
import { useState } from "react";
import type { AdminResolveDisputeInput } from "@sline/shared";

export function useDisputeDetailViewModel(disputeId: string) {
  const queryClient = useQueryClient();
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  const { data: dispute, isLoading, error } = useQuery({
    queryKey: ["disputes", "detail", disputeId],
    queryFn: () => disputesApi.getDisputeDetails(disputeId),
    enabled: !!disputeId,
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["disputes", "detail", disputeId] }),
      queryClient.invalidateQueries({ queryKey: ["disputes", "list"] }),
    ]);
  };

  const acceptMutation = useMutation({
    mutationFn: () => disputesApi.acceptDispute(disputeId),
    onSuccess: async () => {
      await invalidate();
      toast.success("Dispute accepted");
      setDecisionModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to accept dispute");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => disputesApi.cancelDispute(disputeId, reason),
    onSuccess: async () => {
      await invalidate();
      toast.success("Dispute canceled");
      setDecisionModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to cancel dispute");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (data: Omit<AdminResolveDisputeInput, 'dispute_id'>) =>
      disputesApi.resolveDispute(disputeId, data, crypto.randomUUID()),
    onSuccess: async () => {
      await invalidate();
      toast.success("Dispute resolved");
      setDecisionModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to resolve dispute");
    },
  });

  const actionAvailability = dispute?.action_availability ?? {
    can_accept: false,
    can_cancel: false,
    can_resolve: false,
    requires_booking_id: false,
  };

  return {
    dispute,
    isLoading,
    error,
    actionAvailability,
    decisionModalOpen,
    setDecisionModalOpen,
    accept: acceptMutation.mutate,
    cancel: cancelMutation.mutate,
    resolve: resolveMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isCanceling: cancelMutation.isPending,
    isResolving: resolveMutation.isPending,
  };
}
