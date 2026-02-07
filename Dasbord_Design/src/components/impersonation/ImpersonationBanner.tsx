 import { useImpersonation } from "@/contexts/ImpersonationContext";
 import { AlertTriangle, X, Clock, User } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
 export function ImpersonationBanner() {
   const { isImpersonating, impersonatedUser, stopImpersonation, remainingTime } = useImpersonation();
 
   if (!isImpersonating || !impersonatedUser) return null;
 
   const formatTime = (seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins}:${secs.toString().padStart(2, "0")}`;
   };
 
   const isExpiringSoon = remainingTime <= 300; // 5 minutes
 
   return (
     <div
       className={cn(
         "fixed top-0 left-0 right-0 z-[100] px-4 py-2 flex items-center justify-between gap-4",
         "bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50",
         isExpiringSoon && "bg-red-500 text-white dark:bg-red-600"
       )}
     >
       <div className="flex items-center gap-3">
         <AlertTriangle className="w-5 h-5 shrink-0" />
         <span className="font-medium text-sm">
           Impersonating: <strong>{impersonatedUser.name}</strong> ({impersonatedUser.email})
         </span>
       </div>
 
       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 text-sm font-mono">
           <Clock className="w-4 h-4" />
           <span className={cn(isExpiringSoon && "animate-pulse font-bold")}>
             {formatTime(remainingTime)}
           </span>
         </div>
 
         <Button
           size="sm"
           variant="secondary"
           onClick={stopImpersonation}
           className="bg-white/20 hover:bg-white/30 text-inherit border-0"
         >
           <X className="w-4 h-4 mr-1" />
           Exit Impersonation
         </Button>
       </div>
     </div>
   );
 }