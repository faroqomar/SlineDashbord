"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { suspendUser } from "@/features/users/services/user_actions";
import { toast } from "sonner";

interface SuspendUserButtonProps {
  userId: string;
  currentStatus: string;
}

// Component for suspending/banning users
export function SuspendUserButton({ userId, currentStatus }: SuspendUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("24h");

  const isSuspended = currentStatus === 'suspended' || currentStatus === 'banned';

  const handleSuspend = async () => {
    if (!reason) {
      toast.error("Please provide a reason");
      return;
    }

    setLoading(true);
    try {
      const result = await suspendUser(userId, reason, duration);
      if (result.success) {
        toast.success("User suspended successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to suspend user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isSuspended) {
     return (
        <Button variant="outline" className="flex-1 md:flex-none gap-2" disabled>
            <CheckCircle2 className="h-4 w-4 text-green-500" /> User Suspended
        </Button>
     );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex-1 md:flex-none gap-2">
          <Ban className="h-4 w-4" /> Ban User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend User</DialogTitle>
          <DialogDescription>
            This action will prevent the user from accessing the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="permanent">Permanent Ban</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Violation of terms..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSuspend} disabled={loading}>
            {loading ? "Suspending..." : "Confirm Suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
