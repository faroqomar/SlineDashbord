

import { AdminTable } from "@/components/admin/AdminTable";
import { InviteAdminDialog } from "@/components/admin/InviteAdminDialog";
import { PermissionMatrix } from "@/components/admin/PermissionMatrix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield } from "lucide-react";
import { getTeamMembers } from "@/app/actions/team";

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
            <p className="text-muted-foreground">Manage administrators and their access levels.</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <div className="flex items-center justify-between mb-4">
             <TabsList>
                <TabsTrigger value="members" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Members
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Roles & Permissions
                </TabsTrigger>
            </TabsList>
            
            <InviteAdminDialog />
        </div>
       
        <TabsContent value="members" className="mt-0">
             <AdminTable initialUsers={teamMembers} />
        </TabsContent>
        
        <TabsContent value="roles" className="mt-0">
             <PermissionMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}
