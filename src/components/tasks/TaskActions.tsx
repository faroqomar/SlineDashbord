"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Ban } from "lucide-react";
import { cancelTask } from "@/app/actions/tasks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskActionsProps {
  taskId: string;
  status: string;
}

export function TaskActions({ taskId, status }: TaskActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    if (!reason) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      await cancelTask(taskId, reason);
      toast.success("Task canceled successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to cancel task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'canceled' || status === 'completed') {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancel Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this task? This action cannot be undone.
              Please provide a reason for the cancellation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Violation of terms, user request, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Back
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={loading}>
              {loading ? "Canceling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
