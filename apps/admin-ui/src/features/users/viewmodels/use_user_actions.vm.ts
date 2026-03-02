import { useState } from "react";
import { suspendUser } from "@/features/users/services/user_actions";
import { toast } from "sonner";

export function useUserActionsViewModel(userId: string) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isBanning, setIsBanning] = useState(false);

  const handleBan = async () => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason for the ban.");
      return;
    }

    setIsBanning(true);
    try {
      const res = await suspendUser(userId, banReason, 'permanent');
      if (res.success) {
        toast.success("User has been banned.");
        setShowBanDialog(false);
        setBanReason("");
        setConfirmText("");
      } else {
        toast.error(res.error || "Failed to ban user.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to ban user.");
    } finally {
      setIsBanning(false);
    }
  };

  return {
    showBanDialog,
    setShowBanDialog,
    banReason,
    setBanReason,
    confirmText,
    setConfirmText,
    isBanning,
    handleBan
  };
}
