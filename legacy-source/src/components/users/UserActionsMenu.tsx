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
import { useUserActionsViewModel } from "@/features/users/viewmodels/use_user_actions.vm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserActionsMenuProps {
  userId: string;
}

export function UserActionsMenu({ userId }: UserActionsMenuProps) {
  const vm = useUserActionsViewModel(userId);

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
            onSelect={() => vm.setShowBanDialog(true)}
          >
            Ban User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={vm.showBanDialog} onOpenChange={vm.setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will be logged out immediately and prevented from logging in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-2 py-4">
            <div className="space-y-1">
              <Label htmlFor="reason">Ban Reason</Label>
              <Input 
                id="reason" 
                placeholder="Violation of terms..." 
                value={vm.banReason}
                onChange={(e) => vm.setBanReason(e.target.value)}
              />
            </div>
            <div className="space-y-1 mt-4">
              <Label htmlFor="confirm" className="text-destructive font-semibold">Type &quot;CONFIRM&quot; to proceed with banning</Label>
              <Input 
                id="confirm" 
                placeholder="CONFIRM" 
                value={vm.confirmText}
                onChange={(e) => vm.setConfirmText(e.target.value)}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={vm.isBanning}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close
                vm.handleBan();
              }}
              disabled={vm.isBanning || vm.confirmText !== "CONFIRM"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {vm.isBanning ? "Banning..." : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
