import { AdminTable } from "@/features/team/views/components/AdminTable";
import { InviteAdminDialog } from "@/features/team/views/components/InviteAdminDialog";
import { PermissionMatrix } from "@/features/team/views/components/PermissionMatrix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield } from "lucide-react";
import { getTeamMembers } from "@/features/team/services/team_actions";
import { requireAdminRole } from "@/features/core/security/security_guards";
import { TEAM_READ_ROLES } from "@/features/team/models/team.schema";

export default async function TeamPage() {
  // Ensure access at the page level and get the current user's identity/role
  const { role: currentUserRole } = await requireAdminRole(TEAM_READ_ROLES);

  const res = await getTeamMembers();
  const teamMembers = res.success ? res.data : [];

  const canManage = currentUserRole === 'super_admin';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Team & Governance</h1>
            <p className="text-sm text-muted-foreground">Manage administrative staff and define granular access control.</p>
        </div>
        {canManage && <InviteAdminDialog />}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="members" className="flex items-center gap-2 px-4">
                <Users className="h-4 w-4" /> Members
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2 px-4">
                <Shield className="h-4 w-4" /> Permissions Matrix
            </TabsTrigger>
        </TabsList>
       
        <TabsContent value="members" className="mt-6">
             <AdminTable initialUsers={teamMembers} canManage={canManage} />
        </TabsContent>
        
        <TabsContent value="roles" className="mt-6">
             <PermissionMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}
