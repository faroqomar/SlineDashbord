import { useState } from "react";
import { updateTaskStatus } from "@/features/tasks/services/task_actions";
import { toast } from "sonner";
import { TaskStatus } from "@/features/tasks/models/task.schema";

export function useTaskActionsViewModel(taskId: string) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleAction = async () => {
    if (!selectedStatus) return;
    if (!reason.trim()) {
      toast.error("Please provide a reason for this administrative action");
      return;
    }

    setLoading(true);
    try {
      const res = await updateTaskStatus(taskId, selectedStatus, reason);
      if (res.success) {
        toast.success(`Task status updated to ${selectedStatus}`);
        setOpen(false);
        setReason("");
      } else {
        toast.error(res.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = (newStatus: TaskStatus) => {
    setSelectedStatus(newStatus);
    setOpen(true);
  };

  return {
    open,
    setOpen,
    selectedStatus,
    loading,
    reason,
    setReason,
    handleAction,
    triggerAction
  };
}
