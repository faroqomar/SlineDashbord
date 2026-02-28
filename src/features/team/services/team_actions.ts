'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdminRole, logAuditEvent } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { 
  InviteMemberSchema, 
  UpdateRoleSchema, 
  RemoveMemberSchema, 
  TEAM_READ_ROLES, 
  TEAM_WRITE_ROLES, 
  AdminUserDTO 
} from '../models/team.schema';

export async function getTeamMembers(): Promise<ServiceResult<AdminUserDTO[]>> {
  try {
    await requireAdminRole(TEAM_READ_ROLES);
    const supabase = createAdminClient();

    const { data: admins, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) return fail('Error fetching admin users');
    if (!admins || admins.length === 0) return ok([]);

    const adminIds = admins.map(a => a.id);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, status')
      .in('id', adminIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]));

    const team: AdminUserDTO[] = admins.map(admin => {
      const profile = profileMap.get(admin.id);
      return {
        id: admin.id,
        email: admin.email,
        full_name: profile?.full_name || admin.email || 'Unknown',
        avatar_url: profile?.avatar_url || '',
        role: admin.role,
        status: profile?.status || 'Active',
        last_active_at: admin.last_active_at || admin.created_at,
        created_at: admin.created_at,
      };
    });

    return ok(team);
  } catch (error) {
    console.error('getTeamMembers error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function inviteMember(email: string, role: string, fullName: string): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = InviteMemberSchema.safeParse({ email, role, fullName });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(TEAM_WRITE_ROLES);
        const supabase = createAdminClient();

        // 1. Invite user via Auth Admin
        const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(parsed.data.email);

        if (authError) return fail(authError.message);

        const newUserId = authData.user.id;

        // 2. Add to admin_users table
        const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
                id: newUserId,
                email: parsed.data.email,
                role: parsed.data.role,
                created_at: new Date().toISOString()
            });

        if (adminError) return fail('Failed to assign admin role');

        // 3. Ensure profile exists or update it
        await supabase
            .from('profiles')
            .upsert({
                id: newUserId,
                email: parsed.data.email,
                full_name: parsed.data.fullName,
                roles: [parsed.data.role.toLowerCase()],
                status: 'Invited'
            }, { onConflict: 'id' });
        
        await logAuditEvent({
            action: 'admin.team.invite',
            actor_user_id: userId,
            related_entity_type: 'admin_user',
            related_entity_id: newUserId,
            meta: { email: parsed.data.email, role: parsed.data.role }
        });

        revalidatePath('/dashboard/team');
        return ok({id: newUserId});
    } catch (error) {
        console.error('inviteMember error:', error);
        return fail(toErrorMessage(error));
    }
}

export async function updateRole(targetUserId: string, newRole: string): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = UpdateRoleSchema.safeParse({ userId: targetUserId, newRole });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(TEAM_WRITE_ROLES);
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('admin_users')
            .update({ role: parsed.data.newRole })
            .eq('id', parsed.data.userId);

        if (error) return fail('Failed to update role');

        await logAuditEvent({
            action: 'admin.team.update_role',
            actor_user_id: userId,
            related_entity_type: 'admin_user',
            related_entity_id: parsed.data.userId,
            meta: { newRole: parsed.data.newRole }
        });

        revalidatePath('/dashboard/team');
        return ok({id: parsed.data.userId});
    } catch (error) {
        console.error('updateRole error:', error);
        return fail(toErrorMessage(error));
    }
}

export async function removeMember(targetUserId: string): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = RemoveMemberSchema.safeParse({ userId: targetUserId });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(TEAM_WRITE_ROLES);
        const supabase = createAdminClient();

        // 1. Remove from admin_users
        const { error: dbError } = await supabase
            .from('admin_users')
            .delete()
            .eq('id', parsed.data.userId);

        if (dbError) return fail('Failed to remove admin access');

        // 2. Remove from Auth 
        await supabase.auth.admin.deleteUser(parsed.data.userId);

        await logAuditEvent({
            action: 'admin.team.remove_member',
            actor_user_id: userId,
            related_entity_type: 'admin_user',
            related_entity_id: parsed.data.userId,
        });

        revalidatePath('/dashboard/team');
        return ok({id: parsed.data.userId});
    } catch (error) {
        console.error('removeMember error:', error);
        return fail(toErrorMessage(error));
    }
}
