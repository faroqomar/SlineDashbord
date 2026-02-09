"use client";

import { useState } from "react";
// import { Dispute } from "@/data/mock/disputes"; 
// Using any for now as strict type might differ from DB.
// TODO: Define shared Dispute type
interface Dispute {
    id: string;
    amount: string | number;
    resolutionOptions?: {
        canRefund: boolean;
        canRelease: boolean;
        canSplit: boolean;
    };
    [key: string]: any;
}
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

interface ResolutionModalProps {
  dispute: Dispute;
  trigger?: React.ReactNode;
}

import { resolveDispute } from "@/actions/disputes";

// ...

export function ResolutionModal({ dispute, trigger }: ResolutionModalProps) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"refund" | "release" | "split" | null>(null);
  const [splitPercentage, setSplitPercentage] = useState(50); // Client percentage
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
        await resolveDispute(dispute.id, action, action, "Resolved via Admin Dashboard");
        toast.success(`Dispute resolved via ${action.toUpperCase()}`, {
            description: `Client: $${clientAmount.toFixed(2)} | Freelancer: $${freelancerAmount.toFixed(2)}`
        });
        setOpen(false);
    } catch (error: any) {
        toast.error(error.message || "Failed to resolve dispute");
    } finally {
        setIsProcessing(false);
    }
  };

  const options = dispute.resolutionOptions || { canRefund: true, canRelease: true, canSplit: true };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              onClick={() => setAction("refund")}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refund</span>
              <span className="text-[10px] text-muted-foreground">100% to Client</span>
            </Button>

            <Button
              variant={action === "release" ? "default" : "outline"}
              className={cn("flex flex-col h-20 gap-1", action === "release" && "border-primary")}
              disabled={!options.canRelease}
              onClick={() => setAction("release")}
            >
              <Check className="h-5 w-5" />
              <span>Release</span>
              <span className="text-[10px] text-muted-foreground">100% to Freelancer</span>
            </Button>

            <Button
              variant={action === "split" ? "default" : "outline"}
              className={cn("flex flex-col h-20 gap-1", action === "split" && "border-primary")}
              disabled={!options.canSplit}
              onClick={() => setAction("split")}
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
                  onChange={(e) => setSplitPercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
               />
            </div>
          )}

          {action && (
             <div className="bg-muted p-4 rounded-lg space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Client receives:</span>
                    <span className="font-mono font-medium text-green-600 dark:text-green-400">
                        ${clientAmount.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Freelancer receives:</span>
                    <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                        ${freelancerAmount.toFixed(2)}
                    </span>
                </div>
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
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!action || isProcessing} onClick={handleResolve}>
             {isProcessing ? "Processing..." : "Confirm Resolution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
