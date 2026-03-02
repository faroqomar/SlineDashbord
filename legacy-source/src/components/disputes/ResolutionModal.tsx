"use client";

import { DisputeResolutionContext } from "@/features/disputes/viewmodels/use_resolution_modal.vm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider"; // Slider component missing, using native input
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Check, RefreshCw, Split } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Dispute } from "@/data/mock/disputes";

interface ResolutionModalProps {
  dispute: DisputeResolutionContext & Partial<Dispute>;
  trigger?: React.ReactNode;
}

import { useResolutionModalViewModel } from "@/features/disputes/viewmodels/use_resolution_modal.vm";

// ...

export function ResolutionModal({ dispute, trigger }: ResolutionModalProps) {
  const { state, actions } = useResolutionModalViewModel(dispute);
  const { open, action, splitPercentage, confirmText, isProcessing, clientAmount, freelancerAmount, options } = state;

  return (
    <Dialog open={open} onOpenChange={actions.setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Resolve Dispute</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve Dispute #{dispute.id}</DialogTitle>
          <DialogDescription>
            Select a resolution method. This action is irreversible.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={action === "refund" ? "default" : "outline"}
              className={cn("flex flex-col h-20 gap-1", action === "refund" && "border-primary")}
              disabled={!options.canRefund}
              onClick={() => actions.setAction("refund")}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refund</span>
              <span className="text-[10px] text-muted-foreground">100% to Client</span>
            </Button>

            <Button
              variant={action === "release" ? "default" : "outline"}
              className={cn("flex flex-col h-20 gap-1", action === "release" && "border-primary")}
              disabled={!options.canRelease}
              onClick={() => actions.setAction("release")}
            >
              <Check className="h-5 w-5" />
              <span>Release</span>
              <span className="text-[10px] text-muted-foreground">100% to Freelancer</span>
            </Button>

            <Button
              variant={action === "split" ? "default" : "outline"}
              className={cn("flex flex-col h-20 gap-1", action === "split" && "border-primary")}
              disabled={!options.canSplit}
              onClick={() => actions.setAction("split")}
            >
              <Split className="h-5 w-5" />
              <span>Split</span>
              <span className="text-[10px] text-muted-foreground">Partial refund</span>
            </Button>
          </div>

          {action === "split" && (
            <div className="space-y-4 pt-4 border-t">
               <div className="flex justify-between text-sm font-medium">
                  <span>Client: {splitPercentage}%</span>
                  <span>Freelancer: {100 - splitPercentage}%</span>
               </div>
               
               {/* Custom Range Input since Slider component might be missing */}
               <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={splitPercentage}
                  onChange={(e) => actions.setSplitPercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
               />
            </div>
          )}

          {action && (
             <div className="bg-muted p-4 rounded-lg space-y-2 mt-2">
                    <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-md">
                        <span className="text-muted-foreground">Client Returns:</span>
                        <span className="font-medium text-emerald-600">
                        IQD {clientAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-md">
                        <span className="text-muted-foreground">Freelancer Receives:</span>
                        <span className="font-medium text-emerald-600">
                        IQD {freelancerAmount.toFixed(2)}
                        </span>
                    </div>
             </div>
          )}

          {action && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="confirm" className="text-destructive font-semibold">Type &quot;RESOLVE&quot; to permanently close this dispute</Label>
              <input
                id="confirm"
                placeholder="RESOLVE"
                value={confirmText}
                onChange={(e) => actions.setConfirmText(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}

          {action === null && (
             <div className="flex items-center gap-2 p-3 text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-400 rounded-md">
                 <AlertTriangle className="h-4 w-4" />
                 Please select a resolution outcome.
             </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => actions.setOpen(false)}>Cancel</Button>
          <Button disabled={!action || isProcessing || confirmText !== "RESOLVE"} onClick={actions.handleResolve}>
             {isProcessing ? "Processing..." : "Confirm Resolution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
