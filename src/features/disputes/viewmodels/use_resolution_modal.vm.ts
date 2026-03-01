import { useState } from "react";
import { resolveDispute } from "@/features/disputes/services/dispute_actions";
import { toast } from "sonner";

export interface DisputeResolutionContext {
    id: string;
    amount: string | number;
    resolutionOptions?: {
        canRefund: boolean;
        canRelease: boolean;
        canSplit: boolean;
    };
}

export function useResolutionModalViewModel(dispute: DisputeResolutionContext) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"refund" | "release" | "split" | null>(null);
  const [splitPercentage, setSplitPercentage] = useState(50); // Client percentage
  const [confirmText, setConfirmText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = typeof dispute.amount === 'string'
      ? parseFloat(dispute.amount.replace(/,/g, ""))
      : Number(dispute.amount) || 0;

  const clientAmount = action === "refund"
    ? totalAmount
    : action === "release"
        ? 0
        : (totalAmount * splitPercentage) / 100;

  const freelancerAmount = totalAmount - clientAmount;

  const handleResolve = async () => {
    if (!action) return;

    setIsProcessing(true);
    try {
        let decision: 'refund_client' | 'release_freelancer' | undefined;
        if (action === 'refund') decision = 'refund_client';
        else if (action === 'release') decision = 'release_freelancer';

        const result = await resolveDispute(
            dispute.id,
            `Resolved via Admin Dashboard: ${action}`,
            'resolved',
            decision
        );
        
        if (!result.success) {
            toast.error(result.error || "Failed to resolve dispute");
            return;
        }

        toast.success(`Dispute resolved via ${action.toUpperCase()}`, {
            description: `Client: IQD ${clientAmount.toFixed(2)} | Freelancer: IQD ${freelancerAmount.toFixed(2)}`
        });
        setOpen(false);
        setAction(null);
        setConfirmText("");
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to resolve dispute");
    } finally {
        setIsProcessing(false);
    }
  };

  const options = dispute.resolutionOptions || { canRefund: true, canRelease: true, canSplit: true };

  return {
    state: {
        open,
        action,
        splitPercentage,
        confirmText,
        isProcessing,
        clientAmount,
        freelancerAmount,
        options
    },
    actions: {
        setOpen,
        setAction,
        setSplitPercentage,
        setConfirmText,
        handleResolve
    }
  };
}
