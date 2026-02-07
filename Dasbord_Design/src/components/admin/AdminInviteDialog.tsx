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
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Mail, UserPlus } from "lucide-react";
 import { toast } from "@/hooks/use-toast";
 
 interface AdminInviteDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }
 
 const roles = [
   { value: "super_admin", label: "Super Admin", description: "Full system access" },
   { value: "admin", label: "Admin", description: "Standard admin access" },
   { value: "support", label: "Support", description: "User support & tickets" },
   { value: "analyst", label: "Analyst", description: "Read-only analytics" },
   { value: "moderator", label: "Moderator", description: "Content moderation" },
 ];
 
 export function AdminInviteDialog({ open, onOpenChange }: AdminInviteDialogProps) {
   const [email, setEmail] = useState("");
   const [role, setRole] = useState("");
   const [isLoading, setIsLoading] = useState(false);
 
   const handleInvite = async () => {
     if (!email || !role) return;
 
     setIsLoading(true);
     // Simulate API call
     await new Promise((resolve) => setTimeout(resolve, 1000));
     setIsLoading(false);
 
     toast({
       title: "Invitation Sent",
       description: `An invite has been sent to ${email}`,
     });
 
     setEmail("");
     setRole("");
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
               <UserPlus className="w-5 h-5 text-primary" />
             </div>
             <DialogTitle>Invite Admin</DialogTitle>
           </div>
           <DialogDescription>
             Send an email invitation to add a new administrator to the team.
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           <div className="space-y-2">
             <Label htmlFor="email">Email Address</Label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 id="email"
                 type="email"
                 placeholder="admin@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="pl-10"
               />
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="role">Role</Label>
             <Select value={role} onValueChange={setRole}>
               <SelectTrigger>
                 <SelectValue placeholder="Select a role" />
               </SelectTrigger>
               <SelectContent>
                 {roles.map((r) => (
                   <SelectItem key={r.value} value={r.value}>
                     <div className="flex flex-col">
                       <span>{r.label}</span>
                       <span className="text-xs text-muted-foreground">{r.description}</span>
                     </div>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         <DialogFooter className="gap-2 sm:gap-0">
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleInvite} disabled={!email || !role || isLoading}>
             {isLoading ? "Sending..." : "Send Invitation"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }