'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type AdminUserDTO = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  status: string;
  last_active_at: string;
  created_at: string;
};

export async function getTeamMembers() {
  const supabase = createAdminClient();

  // Fetch admin users
  const { data: admins, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (adminError) {
    console.error('Error fetching admin users:', adminError);
    return [];
  }

  if (!admins || admins.length === 0) return [];

  const adminIds = admins.map(a => a.id);

  // Fetch profiles for these admins to get name and avatar
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, status')
    .in('id', adminIds);

  if (profileError) {
    console.error('Error fetching admin profiles:', profileError);
  }

  // Map data
  const profileMap = new Map(profiles?.map(p => [p.id, p]));

  const team: AdminUserDTO[] = admins.map(admin => {
    const profile = profileMap.get(admin.id);
    return {
      id: admin.id,
      email: admin.email,
      full_name: profile?.full_name || admin.email || 'Unknown',
      avatar_url: profile?.avatar_url || '',
      role: admin.role,
      status: profile?.status || 'Active', // Fallback
      last_active_at: admin.last_active_at || admin.created_at,
      created_at: admin.created_at,
    };
  });

  return team;
}

export async function inviteMember(email: string, role: string, fullName: string) {
    const supabase = createAdminClient();

    // 1. Invite user via Auth Admin
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (authError) {
        console.error('Error inviting user:', authError);
        throw new Error(authError.message);
    }

    const userId = authData.user.id;

    // 2. Add to admin_users table
    const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
            id: userId,
            email: email,
            role: role,
            created_at: new Date().toISOString()
        });

    if (adminError) {
        console.error('Error adding to admin_users:', adminError);
        // Clean up auth user if admin insert fails to avoid inconsistent state? 
        // For now, just throw.
        throw new Error('Failed to assign admin role');
    }

    // 3. Ensure profile exists or update it (if trigger didn't catch it or if we want to set name)
    // The trigger usually handles creation, but we might want to set full_name.
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            full_name: fullName,
            roles: [role.toLowerCase()], // admin users might strictly use admin_users table, but redundant roles in public profile is okay
            status: 'Invited'
        }, { onConflict: 'id' });
    
    if (profileError) {
         console.error('Error updating profile:', profileError);
    }

    revalidatePath('/dashboard/team');
    return { success: true };
}

export async function updateRole(userId: string, newRole: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('admin_users')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error('Error updating role:', error);
        throw new Error('Failed to update role');
    }

    revalidatePath('/dashboard/team');
    return { success: true };
}

export async function removeMember(userId: string) {
    const supabase = createAdminClient();

    // 1. Remove from admin_users
    const { error: dbError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

    if (dbError) {
        console.error('Error removing from admin_users:', dbError);
        throw new Error('Failed to remove admin access');
    }

    // 2. Remove from Auth (Optional: decide if we delete the user entirely or just revoke admin access)
    // "Remove Member" usually implies removing access. 
    // If they are strictly an admin, delete user.
    // If they could be a regular user too, maybe just delete from admin_users?
    // Let's assume for this admin dashboard, "Remove" means deleting their account or at least blocking them.
    // For now, let's just delete them from Auth to be safe/clean.
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
       
    if (authError) {
        console.error('Error deleting auth user:', authError);
        // Not throwing here since admin access is already gone.
    }

    revalidatePath('/dashboard/team');
    return { success: true };
}
