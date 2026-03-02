import { useState } from "react";
import { tasksApi } from "../services/tasks_api";
import { TaskStatus } from "../models/task.schema";
import { toast } from "sonner";

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
      await tasksApi.updateTaskStatus(taskId, selectedStatus, reason);
      toast.success(`Task status updated to ${selectedStatus}`);
      setOpen(false);
      setReason("");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
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
