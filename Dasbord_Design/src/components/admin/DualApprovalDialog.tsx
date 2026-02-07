 import { useState } from "react";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { Users, AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
 import { toast } from "@/hooks/use-toast";
 
 interface DualApprovalDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   actionTitle: string;
   actionDescription: string;
   requesterName: string;
   requesterAvatar?: string;
   requestedAt: Date;
   onApprove: (notes: string) => void;
   onReject: (reason: string) => void;
 }
 
 export function DualApprovalDialog({
   open,
   onOpenChange,
   actionTitle,
   actionDescription,
   requesterName,
   requestedAt,
   onApprove,
   onReject,
 }: DualApprovalDialogProps) {
   const [notes, setNotes] = useState("");
   const [isApproving, setIsApproving] = useState(false);
   const [isRejecting, setIsRejecting] = useState(false);
 
   const handleApprove = async () => {
     setIsApproving(true);
     await new Promise((resolve) => setTimeout(resolve, 500));
     onApprove(notes);
     setIsApproving(false);
     onOpenChange(false);
     toast({
       title: "Action Approved",
       description: "The action has been approved and executed.",
     });
   };
 
   const handleReject = async () => {
     if (!notes.trim()) {
       toast({
         title: "Reason Required",
         description: "Please provide a reason for rejection.",
         variant: "destructive",
       });
       return;
     }
     setIsRejecting(true);
     await new Promise((resolve) => setTimeout(resolve, 500));
     onReject(notes);
     setIsRejecting(false);
     onOpenChange(false);
     toast({
       title: "Action Rejected",
       description: "The action has been rejected.",
     });
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-lg">
         <DialogHeader>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
               <Users className="w-5 h-5 text-primary" />
             </div>
             <div>
               <DialogTitle>Approval Required</DialogTitle>
               <Badge variant="outline" className="mt-1">
                 4-Eyes Principle
               </Badge>
             </div>
           </div>
           <DialogDescription>
             This action requires approval from a second administrator.
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           <div className="bg-muted/50 rounded-lg p-4 space-y-3">
             <div className="flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-medium text-sm">{actionTitle}</h4>
                 <p className="text-sm text-muted-foreground">{actionDescription}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
               <span>Requested by: <strong className="text-foreground">{requesterName}</strong></span>
               <span className="flex items-center gap-1">
                 <Clock className="w-3 h-3" />
                 {requestedAt.toLocaleString()}
               </span>
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="notes">Notes / Reason (required for rejection)</Label>
             <Textarea
               id="notes"
               placeholder="Add any notes or provide a reason if rejecting..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               rows={3}
             />
           </div>
         </div>
 
         <DialogFooter className="gap-2 sm:gap-0">
           <Button
             variant="outline"
             onClick={handleReject}
             disabled={isApproving || isRejecting}
             className="text-destructive hover:text-destructive"
           >
             <XCircle className="w-4 h-4 mr-2" />
             {isRejecting ? "Rejecting..." : "Reject"}
           </Button>
           <Button
             onClick={handleApprove}
             disabled={isApproving || isRejecting}
           >
             <CheckCircle2 className="w-4 h-4 mr-2" />
             {isApproving ? "Approving..." : "Approve"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }