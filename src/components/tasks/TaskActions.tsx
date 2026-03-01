"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Ban, CheckCircle, RotateCcw, ShieldAlert, ArrowUpRight } from "lucide-react";
import { useTaskActionsViewModel } from "@/features/tasks/viewmodels/use_task_actions.vm";
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
import { TaskStatus } from "@/features/tasks/models/task.schema";

interface TaskActionsProps {
  taskId: string;
  status: TaskStatus;
}

export function TaskActions({ taskId, status }: TaskActionsProps) {
  const vm = useTaskActionsViewModel(taskId);

  const isFinal = status === 'completed' || status === 'canceled';

  return (
    <>
      <div className="flex items-center gap-2">
           {/* Direct Quick Actions for common admin tasks */}
           {!isFinal && status !== 'open' && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-green-500/30 text-green-600 hover:bg-green-500/5"
                    onClick={() => vm.triggerAction('completed')}
                >
                    <CheckCircle className="mr-2 h-3.5 w-3.5" />
                    Complete
                </Button>
           )}

           {status === 'canceled' && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => vm.triggerAction('open')}
                >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                    Restore to Open
                </Button>
           )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Admin Actions</div>
              
              {!isFinal && (
                <>
                  <DropdownMenuItem onClick={() => vm.triggerAction('completed')} className="text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Force Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => vm.triggerAction('canceled')} className="text-red-600">
                    <Ban className="mr-2 h-4 w-4" />
                    Force Cancel
                  </DropdownMenuItem>
                </>
              )}

              {isFinal && (
                  <DropdownMenuItem onClick={() => vm.triggerAction('open')}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Re-open Task
                  </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="opacity-50">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Flag for Dispute
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      <Dialog open={vm.open} onOpenChange={vm.setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Administrative Override
            </DialogTitle>
            <DialogDescription>
              Changing task status to <strong>{vm.selectedStatus}</strong>. 
              This will bypass normal user workflows and trigger a system audit event.
              {vm.selectedStatus === 'canceled' && " Escrow reversal will be attempted automatically."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Motivation / Reason for Change
              </Label>
              <Textarea
                id="reason"
                placeholder="Briefly explain this administrative decision (e.g., terms violation, user request ticket #123)"
                value={vm.reason}
                onChange={(e) => vm.setReason(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => vm.setOpen(false)} disabled={vm.loading}>
              Abort
            </Button>
            <Button 
                variant={vm.selectedStatus === 'canceled' ? 'destructive' : 'default'} 
                onClick={vm.handleAction} 
                className="min-w-[120px]"
                disabled={vm.loading}
            >
              {vm.loading ? "Processing..." : `Confirm ${vm.selectedStatus}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
