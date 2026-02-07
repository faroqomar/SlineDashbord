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
 import { Label } from "@/components/ui/label";
 import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
 import { AlertTriangle, User, Shield } from "lucide-react";
 import { useImpersonation, ImpersonatedUser } from "@/contexts/ImpersonationContext";
 
 interface ImpersonationStartDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   user: ImpersonatedUser;
 }
 
 export function ImpersonationStartDialog({
   open,
   onOpenChange,
   user,
 }: ImpersonationStartDialogProps) {
   const [timeoutMinutes, setTimeoutMinutes] = useState("30");
   const { startImpersonation } = useImpersonation();
 
   const handleStart = () => {
     startImpersonation(user, parseInt(timeoutMinutes));
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
               <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
             </div>
             <DialogTitle>Start Impersonation</DialogTitle>
           </div>
           <DialogDescription>
             You are about to view the platform as <strong>{user.name}</strong> ({user.email}).
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
             <div className="flex gap-3">
               <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                   Important Restrictions
                 </p>
                 <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                   <li>All actions will be logged with your admin ID</li>
                   <li>Financial actions are blocked during impersonation</li>
                   <li>Session will auto-expire after the selected time</li>
                   <li>A visible banner will indicate active impersonation</li>
                 </ul>
               </div>
             </div>
           </div>
 
           <div className="space-y-3">
             <Label className="text-sm font-medium">Session Duration</Label>
             <RadioGroup
               value={timeoutMinutes}
               onValueChange={setTimeoutMinutes}
               className="grid grid-cols-3 gap-3"
             >
               {[
                 { value: "15", label: "15 min" },
                 { value: "30", label: "30 min" },
                 { value: "60", label: "60 min" },
               ].map((option) => (
                 <div key={option.value}>
                   <RadioGroupItem
                     value={option.value}
                     id={`duration-${option.value}`}
                     className="peer sr-only"
                   />
                   <Label
                     htmlFor={`duration-${option.value}`}
                     className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                   >
                     {option.label}
                   </Label>
                 </div>
               ))}
             </RadioGroup>
           </div>
         </div>
 
         <DialogFooter className="gap-2 sm:gap-0">
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleStart} className="bg-amber-600 hover:bg-amber-700">
             <Shield className="w-4 h-4 mr-2" />
             Start Impersonation
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }