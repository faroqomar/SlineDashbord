 import { useState } from "react";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
 } from "@/components/ui/sheet";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import {
   Search,
   Plus,
   MoreHorizontal,
   Shield,
   ShieldCheck,
   ShieldOff,
   Key,
   Monitor,
   UserX,
   UserCheck,
   Users,
   Clock,
   Activity,
 } from "lucide-react";
 import { formatDistanceToNow } from "date-fns";
 import { AdminInviteDialog } from "@/components/admin/AdminInviteDialog";
 import { SessionsTable } from "@/components/admin/SessionsTable";
 import { PermissionOverridePanel } from "@/components/admin/PermissionOverridePanel";
 import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
 import { toast } from "@/hooks/use-toast";
 
 // Mock data
 const mockAdmins = [
   {
     id: "1",
     name: "Sarah Johnson",
     email: "sarah@marketplace.com",
     avatar: "",
     role: "super_admin",
     status: "active",
     mfaEnabled: true,
     lastLogin: new Date(Date.now() - 1000 * 60 * 30),
     createdAt: new Date(2023, 0, 15),
     sessionsCount: 2,
   },
   {
     id: "2",
     name: "Michael Chen",
     email: "michael@marketplace.com",
     avatar: "",
     role: "admin",
     status: "active",
     mfaEnabled: true,
     lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
     createdAt: new Date(2023, 3, 22),
     sessionsCount: 1,
   },
   {
     id: "3",
     name: "Emily Davis",
     email: "emily@marketplace.com",
     avatar: "",
     role: "support",
     status: "active",
     mfaEnabled: false,
     lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
     createdAt: new Date(2023, 6, 10),
     sessionsCount: 0,
   },
   {
     id: "4",
     name: "James Wilson",
     email: "james@marketplace.com",
     avatar: "",
     role: "moderator",
     status: "disabled",
     mfaEnabled: true,
     lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
     createdAt: new Date(2023, 2, 5),
     sessionsCount: 0,
   },
   {
     id: "5",
     name: "Anna Martinez",
     email: "anna@marketplace.com",
     avatar: "",
     role: "analyst",
     status: "active",
     mfaEnabled: true,
     lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4),
     createdAt: new Date(2023, 8, 1),
     sessionsCount: 1,
   },
 ];
 
 const mockSessions = [
   {
     id: "s1",
     device: "desktop" as const,
     browser: "Chrome 120",
     ip: "192.168.1.105",
     location: "San Francisco, US",
     lastActivity: new Date(Date.now() - 1000 * 60 * 5),
     isCurrent: true,
   },
   {
     id: "s2",
     device: "mobile" as const,
     browser: "Safari iOS",
     ip: "10.0.0.42",
     location: "San Francisco, US",
     lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
     isCurrent: false,
   },
 ];
 
 const mockPermissions = [
   {
     id: "users.view",
     label: "View Users",
     description: "Access the users management page",
     category: "Users",
     defaultValue: true,
     currentValue: true,
     isOverridden: false,
   },
   {
     id: "users.edit",
     label: "Edit Users",
     description: "Modify user profiles and settings",
     category: "Users",
     defaultValue: true,
     currentValue: true,
     isOverridden: false,
   },
   {
     id: "users.ban",
     label: "Ban Users",
     description: "Suspend or ban user accounts",
     category: "Users",
     defaultValue: false,
     currentValue: true,
     isOverridden: true,
   },
   {
     id: "financial.view",
     label: "View Financials",
     description: "Access wallet and transaction data",
     category: "Financial",
     defaultValue: true,
     currentValue: true,
     isOverridden: false,
   },
   {
     id: "financial.adjust",
     label: "Manual Adjustments",
     description: "Credit or debit user wallets",
     category: "Financial",
     defaultValue: false,
     currentValue: false,
     isOverridden: false,
   },
   {
     id: "disputes.resolve",
     label: "Resolve Disputes",
     description: "Make final decisions on disputes",
     category: "Disputes",
     defaultValue: true,
     currentValue: true,
     isOverridden: false,
   },
   {
     id: "system.settings",
     label: "System Settings",
     description: "Access and modify system configuration",
     category: "System",
     defaultValue: false,
     currentValue: false,
     isOverridden: false,
   },
 ];
 
 const roleLabels: Record<string, { label: string; color: string }> = {
   super_admin: { label: "Super Admin", color: "bg-primary text-primary-foreground" },
   admin: { label: "Admin", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
   support: { label: "Support", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
   moderator: { label: "Moderator", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
   analyst: { label: "Analyst", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
 };
 
 export default function AdminManagementPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
   const [selectedAdmin, setSelectedAdmin] = useState<typeof mockAdmins[0] | null>(null);
   const [detailsOpen, setDetailsOpen] = useState(false);
   const [confirmDialog, setConfirmDialog] = useState<{
     open: boolean;
     title: string;
     description: string;
     type: "danger" | "warning";
     onConfirm: () => void;
   }>({
     open: false,
     title: "",
     description: "",
     type: "danger",
     onConfirm: () => {},
   });
 
   const filteredAdmins = mockAdmins.filter(
     (admin) =>
       admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       admin.email.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleToggleStatus = (admin: typeof mockAdmins[0]) => {
     const action = admin.status === "active" ? "disable" : "enable";
     setConfirmDialog({
       open: true,
       title: `${action === "disable" ? "Disable" : "Enable"} Admin Account`,
       description: `Are you sure you want to ${action} ${admin.name}'s admin account? ${
         action === "disable"
           ? "They will lose access to the admin dashboard immediately."
           : "They will regain access to the admin dashboard."
       }`,
       type: action === "disable" ? "danger" : "warning",
       onConfirm: () => {
         toast({
           title: `Admin ${action === "disable" ? "Disabled" : "Enabled"}`,
           description: `${admin.name}'s account has been ${action}d.`,
         });
         setConfirmDialog((prev) => ({ ...prev, open: false }));
       },
     });
   };
 
   const handleResetMFA = (admin: typeof mockAdmins[0]) => {
     setConfirmDialog({
       open: true,
       title: "Reset MFA",
       description: `This will reset MFA for ${admin.name}. They will need to set up MFA again on their next login.`,
       type: "warning",
       onConfirm: () => {
         toast({
           title: "MFA Reset",
           description: `MFA has been reset for ${admin.name}.`,
         });
         setConfirmDialog((prev) => ({ ...prev, open: false }));
       },
     });
   };
 
   const openAdminDetails = (admin: typeof mockAdmins[0]) => {
     setSelectedAdmin(admin);
     setDetailsOpen(true);
   };
 
   return (
     <div className="p-6 space-y-6">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
           <h1 className="text-2xl font-semibold text-foreground">Admin Management</h1>
           <p className="text-sm text-muted-foreground mt-1">
             Manage administrator accounts, permissions, and sessions
           </p>
         </div>
         <Button onClick={() => setInviteDialogOpen(true)}>
           <Plus className="w-4 h-4 mr-2" />
           Invite Admin
         </Button>
       </div>
 
       {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card>
           <CardContent className="pt-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Users className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <p className="text-2xl font-semibold">{mockAdmins.length}</p>
                 <p className="text-sm text-muted-foreground">Total Admins</p>
               </div>
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                 <Activity className="w-6 h-6 text-green-600" />
               </div>
               <div>
                 <p className="text-2xl font-semibold">
                   {mockAdmins.filter((a) => a.status === "active").length}
                 </p>
                 <p className="text-sm text-muted-foreground">Active</p>
               </div>
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                 <Monitor className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                 <p className="text-2xl font-semibold">
                   {mockAdmins.reduce((acc, a) => acc + a.sessionsCount, 0)}
                 </p>
                 <p className="text-sm text-muted-foreground">Active Sessions</p>
               </div>
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                 <ShieldOff className="w-6 h-6 text-orange-600" />
               </div>
               <div>
                 <p className="text-2xl font-semibold">
                   {mockAdmins.filter((a) => !a.mfaEnabled).length}
                 </p>
                 <p className="text-sm text-muted-foreground">MFA Disabled</p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Admin Table */}
       <Card>
         <CardHeader>
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div>
               <CardTitle>Administrators</CardTitle>
               <CardDescription>All admin accounts with their roles and status</CardDescription>
             </div>
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 placeholder="Search admins..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10"
               />
             </div>
           </div>
         </CardHeader>
         <CardContent>
           <div className="border rounded-lg overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Admin</TableHead>
                   <TableHead>Role</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>MFA</TableHead>
                   <TableHead>Last Login</TableHead>
                   <TableHead>Sessions</TableHead>
                   <TableHead className="w-[50px]"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredAdmins.map((admin) => (
                   <TableRow
                     key={admin.id}
                     className="cursor-pointer hover:bg-muted/50"
                     onClick={() => openAdminDetails(admin)}
                   >
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                           <AvatarImage src={admin.avatar} />
                           <AvatarFallback>
                             {admin.name
                               .split(" ")
                               .map((n) => n[0])
                               .join("")}
                           </AvatarFallback>
                         </Avatar>
                         <div>
                           <div className="font-medium text-sm">{admin.name}</div>
                           <div className="text-xs text-muted-foreground">{admin.email}</div>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <Badge className={roleLabels[admin.role]?.color || ""}>
                         {roleLabels[admin.role]?.label || admin.role}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <Badge
                         variant={admin.status === "active" ? "default" : "secondary"}
                         className={
                           admin.status === "active"
                             ? "bg-green-500/10 text-green-600 dark:text-green-400"
                             : "bg-muted text-muted-foreground"
                         }
                       >
                         {admin.status === "active" ? "Active" : "Disabled"}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       {admin.mfaEnabled ? (
                         <ShieldCheck className="w-4 h-4 text-green-600" />
                       ) : (
                         <ShieldOff className="w-4 h-4 text-muted-foreground" />
                       )}
                     </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <Clock className="w-3 h-3" />
                         {formatDistanceToNow(admin.lastLogin, { addSuffix: true })}
                       </div>
                     </TableCell>
                     <TableCell>
                       <Badge variant="outline">{admin.sessionsCount}</Badge>
                     </TableCell>
                     <TableCell>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontal className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => openAdminDetails(admin)}>
                             <Shield className="w-4 h-4 mr-2" />
                             View Details
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleResetMFA(admin)}>
                             <Key className="w-4 h-4 mr-2" />
                             Reset MFA
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                             onClick={() => handleToggleStatus(admin)}
                             className={admin.status === "active" ? "text-destructive" : ""}
                           >
                             {admin.status === "active" ? (
                               <>
                                 <UserX className="w-4 h-4 mr-2" />
                                 Disable Account
                               </>
                             ) : (
                               <>
                                 <UserCheck className="w-4 h-4 mr-2" />
                                 Enable Account
                               </>
                             )}
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>
 
       {/* Invite Dialog */}
       <AdminInviteDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
 
       {/* Confirm Dialog */}
       <ConfirmDialog
         open={confirmDialog.open}
         onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
         title={confirmDialog.title}
         description={confirmDialog.description}
         confirmLabel="Confirm"
         type={confirmDialog.type}
         onConfirm={confirmDialog.onConfirm}
       />
 
       {/* Admin Details Sheet */}
       <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
         <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
           {selectedAdmin && (
             <>
               <SheetHeader>
                 <div className="flex items-center gap-4">
                   <Avatar className="h-14 w-14">
                     <AvatarImage src={selectedAdmin.avatar} />
                     <AvatarFallback className="text-lg">
                       {selectedAdmin.name
                         .split(" ")
                         .map((n) => n[0])
                         .join("")}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <SheetTitle className="flex items-center gap-2">
                       {selectedAdmin.name}
                       {selectedAdmin.status === "disabled" && (
                         <Badge variant="secondary">Disabled</Badge>
                       )}
                     </SheetTitle>
                     <SheetDescription>{selectedAdmin.email}</SheetDescription>
                   </div>
                 </div>
               </SheetHeader>
 
               <Tabs defaultValue="sessions" className="mt-6">
                 <TabsList className="grid w-full grid-cols-2">
                   <TabsTrigger value="sessions">Sessions</TabsTrigger>
                   <TabsTrigger value="permissions">Permissions</TabsTrigger>
                 </TabsList>
                 <TabsContent value="sessions" className="mt-4">
                   <SessionsTable
                     adminId={selectedAdmin.id}
                     sessions={mockSessions}
                     onForceLogout={(sessionId) => {
                       console.log("Force logout session:", sessionId);
                     }}
                     onForceLogoutAll={() => {
                       console.log("Force logout all sessions");
                     }}
                   />
                 </TabsContent>
                 <TabsContent value="permissions" className="mt-4">
                   <PermissionOverridePanel
                     adminId={selectedAdmin.id}
                     adminName={selectedAdmin.name}
                     roleName={roleLabels[selectedAdmin.role]?.label || selectedAdmin.role}
                     permissions={mockPermissions}
                     onSave={(permissions) => {
                       console.log("Save permissions:", permissions);
                     }}
                   />
                 </TabsContent>
               </Tabs>
             </>
           )}
         </SheetContent>
       </Sheet>
     </div>
   );
 }