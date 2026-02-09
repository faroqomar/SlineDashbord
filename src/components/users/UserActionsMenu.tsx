"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { banUser } from "@/actions/users";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserActionsMenuProps {
  userId: string;
}

export function UserActionsMenu({ userId }: UserActionsMenuProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [isBanning, setIsBanning] = useState(false);

  const handleBan = async () => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason for the ban.");
      return;
    }

    setIsBanning(true);
    try {
      await banUser(userId, banReason);
      toast.success("User has been banned.");
      setShowBanDialog(false);
      setBanReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to ban user.");
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
              <Link href={`/dashboard/users/${userId}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit User</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onSelect={() => setShowBanDialog(true)}
          >
            Ban User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will be logged out immediately and prevented from logging in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-2 py-4">
            <Label htmlFor="reason">Ban Reason</Label>
            <Input 
              id="reason" 
              placeholder="Violation of terms..." 
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBanning}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close
                handleBan();
              }}
              disabled={isBanning}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBanning ? "Banning..." : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
