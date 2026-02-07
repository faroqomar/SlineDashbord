 import { useState } from "react";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import {
   Monitor,
   Smartphone,
   Tablet,
   Globe,
   MoreHorizontal,
   LogOut,
   MapPin,
   Clock,
 } from "lucide-react";
 import { formatDistanceToNow } from "date-fns";
 import { toast } from "@/hooks/use-toast";
 
 interface Session {
   id: string;
   device: "desktop" | "mobile" | "tablet";
   browser: string;
   ip: string;
   location: string;
   lastActivity: Date;
   isCurrent: boolean;
 }
 
 interface SessionsTableProps {
   adminId: string;
   sessions: Session[];
   onForceLogout: (sessionId: string) => void;
   onForceLogoutAll: () => void;
 }
 
 const deviceIcons = {
   desktop: Monitor,
   mobile: Smartphone,
   tablet: Tablet,
 };
 
 export function SessionsTable({
   adminId,
   sessions,
   onForceLogout,
   onForceLogoutAll,
 }: SessionsTableProps) {
   const handleForceLogout = (sessionId: string) => {
     onForceLogout(sessionId);
     toast({
       title: "Session Terminated",
       description: "The session has been forcefully logged out.",
     });
   };
 
   const handleForceLogoutAll = () => {
     onForceLogoutAll();
     toast({
       title: "All Sessions Terminated",
       description: "All sessions except the current one have been logged out.",
     });
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <h3 className="text-sm font-medium text-foreground">Active Sessions</h3>
         {sessions.length > 1 && (
           <Button variant="outline" size="sm" onClick={handleForceLogoutAll}>
             <LogOut className="w-4 h-4 mr-2" />
             Logout All Others
           </Button>
         )}
       </div>
 
       <div className="border rounded-lg overflow-hidden">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Device</TableHead>
               <TableHead>IP Address</TableHead>
               <TableHead>Location</TableHead>
               <TableHead>Last Activity</TableHead>
               <TableHead className="w-[50px]"></TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {sessions.map((session) => {
               const DeviceIcon = deviceIcons[session.device];
               return (
                 <TableRow key={session.id}>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                         <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                       </div>
                       <div>
                         <div className="font-medium text-sm flex items-center gap-2">
                           {session.browser}
                           {session.isCurrent && (
                             <Badge variant="secondary" className="text-2xs">
                               Current
                             </Badge>
                           )}
                         </div>
                         <div className="text-xs text-muted-foreground capitalize">
                           {session.device}
                         </div>
                       </div>
                     </div>
                   </TableCell>
                   <TableCell>
                     <code className="text-xs bg-muted px-2 py-1 rounded">
                       {session.ip}
                     </code>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2 text-sm">
                       <MapPin className="w-3 h-3 text-muted-foreground" />
                       {session.location}
                     </div>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Clock className="w-3 h-3" />
                       {formatDistanceToNow(session.lastActivity, { addSuffix: true })}
                     </div>
                   </TableCell>
                   <TableCell>
                     {!session.isCurrent && (
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontal className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem
                             className="text-destructive"
                             onClick={() => handleForceLogout(session.id)}
                           >
                             <LogOut className="w-4 h-4 mr-2" />
                             Force Logout
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     )}
                   </TableCell>
                 </TableRow>
               );
             })}
           </TableBody>
         </Table>
       </div>
     </div>
   );
 }