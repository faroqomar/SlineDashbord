'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole, logAuditEvent, enforceRateLimit } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { GetUsersSchema, GetUserDetailsSchema, SuspendUserSchema, BanUserSchema, UnbanUserSchema, VerifyUserSchema, USERS_READ_ROLES, USERS_WRITE_ROLES } from '../models/user.schema';

export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  roles: string[];
  active_role: string;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  last_sign_in_at: string;
}

export interface UserDetailsDTO extends UserDTO {
  phone: string;
  bio: string;
  rating: number;
  spent: number;
  earned: number;
  job_count: number;
  wallet_balance: number;
  recent_activity: any[];
  metadata: any;
}

export async function getUsers(
  page = 1, 
  query = '', 
  roleStr = 'all'
): Promise<ServiceResult<{ users: UserDTO[]; totalPages: number; totalUsers: number }>> {
  try {
    const parsed = GetUsersSchema.safeParse({ page, query, role: roleStr });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(USERS_READ_ROLES);

    const supabase = createAdminClient();
    const PAGE_SIZE = 10;
    const from = (parsed.data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (parsed.data.query) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${parsed.data.query}%,email.ilike.%${parsed.data.query}%`);
    }

    if (parsed.data.role && parsed.data.role !== 'all') {
       queryBuilder = queryBuilder.eq('role', parsed.data.role);
    }

    queryBuilder = queryBuilder.range(from, to).order('created_at', { ascending: false });

    const { data: profiles, error, count } = await queryBuilder;

    if (error) {
      console.error('Error fetching profiles:', error);
      return fail('Failed to fetch users');
    }
    
    const users: UserDTO[] = profiles.map((p: any) => ({
      id: p.id,
      email: p.email || '',
      full_name: p.full_name || 'Unknown',
      avatar_url: p.avatar_url || '',
      role: p.active_role || (p.roles && p.roles[0]) || 'user',
      roles: p.roles || ['user'],
      active_role: p.active_role || 'user',
      status: p.status || 'active',
      created_at: p.created_at,
      last_sign_in_at: p.updated_at,
    }));

    return ok({
      users,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      totalUsers: count || 0
    });

  } catch (error) {
    console.error('getUsers error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function getUserDetails(id: string): Promise<ServiceResult<UserDetailsDTO>> {
  try {
    const parsed = GetUserDetailsSchema.safeParse({ id });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(USERS_READ_ROLES);

    const supabase = createAdminClient();

    const [authRes, profileRes, tasksRes, walletRes] = await Promise.all([
      supabase.auth.admin.getUserById(parsed.data.id),
      supabase.from('profiles').select('*').eq('id', parsed.data.id).single(),
      supabase.from('tasks').select('*').or(`client_id.eq.${parsed.data.id},freelancer_id.eq.${parsed.data.id}`).order('created_at', { ascending: false }).limit(10),
      supabase.from('vw_wallet_balances_user').select('available_balance').eq('user_id', parsed.data.id).maybeSingle()
    ]);

    if (authRes.error || !authRes.data.user) return fail('User not found in Auth system');
    const authUser = authRes.data.user;
    const profile = profileRes.data || {};
    const recent_activity = tasksRes.data || [];
    const wallet_balance = walletRes.data?.available_balance || 0;
    const job_count = recent_activity.length; // Approximate for now

    const user: UserDetailsDTO = {
      id: authUser.id,
      email: authUser.email || '',
      full_name: profile.full_name || authUser.user_metadata?.full_name || 'Unknown',
      avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || '',
      role: profile.active_role || (profile.roles && profile.roles[0]) || authUser.app_metadata?.role || 'user',
      roles: profile.roles || ['user'],
      active_role: profile.active_role || 'user',
      status: authUser.banned_until ? 'banned' : (profile.status || 'active'),
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at || '',
      phone: authUser.phone || '',
      bio: profile.bio || '',
      rating: profile.rating || 0,
      spent: 0, 
      earned: 0,
      job_count,
      wallet_balance,
      recent_activity,
      metadata: authUser.user_metadata
    };

    return ok(user);

  } catch (error) {
    console.error('getUserDetails error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function suspendUser(id: string, reason: string, duration?: string): Promise<ServiceResult<{ id: string }>> {
  try {
    const parsed = SuspendUserSchema.safeParse({ id, reason, duration });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(USERS_WRITE_ROLES);
    await enforceRateLimit('suspend_user', userId, 5, 60000);

    const supabase = createAdminClient();
    
    const durationInput = parsed.data.duration;
    const banDurationStr = durationInput === 'permanent' ? '876000h' : durationInput === '30d' ? '720h' : '24h';

    // 1. Update Auth User (Ban)
    const { error: banError } = await supabase.auth.admin.updateUserById(parsed.data.id, {
      ban_duration: banDurationStr
    });
     
    if (banError) return fail(`Ban failed: ${banError.message}`);

    // 2. Update Public Profile Status
    await supabase.from('profiles').update({ status: 'suspended' }).eq('id', parsed.data.id);

    // 3. Log Action securely to audit_logs
    await logAuditEvent({
        action: 'admin.users.suspend',
        actor_user_id: userId,
        related_entity_type: 'profile',
        related_entity_id: parsed.data.id,
        meta: { reason: parsed.data.reason, duration: durationInput }
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${parsed.data.id}`);
    
    return ok({ id: parsed.data.id });
  } catch (error) {
    console.error('suspendUser error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function banUser(userId: string, reason: string): Promise<ServiceResult<{ userId: string }>> {
  try {
    const parsed = BanUserSchema.safeParse({ userId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId: adminId } = await requireAdminRole(USERS_WRITE_ROLES);
    await enforceRateLimit('ban_user', adminId, 5, 60000);
    const supabaseAdmin = createAdminClient();
    
    // Fetch existing metadata to avoid overwriting
    const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
    const currentMetadata = profile?.metadata || {};

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'banned',
        metadata: { ...currentMetadata, ban_reason: parsed.data.reason, banned_by: adminId, banned_at: new Date().toISOString() } 
      } as any)
      .eq('id', parsed.data.userId);

    if (profileError) return fail(`Failed to ban user profile: ${profileError.message}`);

    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(parsed.data.userId, {
      ban_duration: '876000h' // ~100 years
    });
     
    if (banError) console.error('Failed to ban user in Auth:', banError);

    await logAuditEvent({
        action: 'admin.users.ban',
        actor_user_id: adminId,
        related_entity_type: 'profile',
        related_entity_id: parsed.data.userId,
        meta: { reason: parsed.data.reason }
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${parsed.data.userId}`);
    
    return ok({ userId: parsed.data.userId });
  } catch (error) {
    console.error('banUser error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function unbanUser(userId: string): Promise<ServiceResult<{ userId: string }>> {
  try {
    const parsed = UnbanUserSchema.safeParse({ userId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId: adminId } = await requireAdminRole(USERS_WRITE_ROLES);
    await enforceRateLimit('unban_user', adminId, 5, 60000);
    const supabaseAdmin = createAdminClient();

    // Fetch existing metadata to avoid overwriting
    const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
    const currentMetadata = profile?.metadata || {};

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'active',
        metadata: { ...currentMetadata, unbanned_by: adminId, unbanned_at: new Date().toISOString() } 
      } as any)
      .eq('id', parsed.data.userId);

    if (profileError) return fail(`Failed to unban user profile: ${profileError.message}`);

    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(parsed.data.userId, {
      ban_duration: 'none'
    });
     
    if (banError) console.error('Failed to unban user in Auth:', banError);

    await logAuditEvent({
        action: 'admin.users.unban',
        actor_user_id: adminId,
        related_entity_type: 'profile',
        related_entity_id: parsed.data.userId,
        meta: {}
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${parsed.data.userId}`);
    
    return ok({ userId: parsed.data.userId });
  } catch (error) {
    console.error('unbanUser error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function verifyUser(userId: string): Promise<ServiceResult<{ userId: string }>> {
  try {
    const parsed = VerifyUserSchema.safeParse({ userId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId: adminId } = await requireAdminRole(USERS_WRITE_ROLES);
    await enforceRateLimit('verify_user', adminId, 10, 60000);
    const supabaseAdmin = createAdminClient();

    // Fetch existing metadata to avoid overwriting
    const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
    const currentMetadata = profile?.metadata || {};

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        metadata: { ...currentMetadata, is_verified: true, verified_by: adminId, verified_at: new Date().toISOString() } 
      } as any)
      .eq('id', parsed.data.userId);

    if (profileError) return fail(`Failed to verify user profile: ${profileError.message}`);

    await logAuditEvent({
        action: 'admin.users.verify',
        actor_user_id: adminId,
        related_entity_type: 'profile',
        related_entity_id: parsed.data.userId,
        meta: {}
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${parsed.data.userId}`);
    
    return ok({ userId: parsed.data.userId });
  } catch (error) {
    console.error('verifyUser error:', error);
    return fail(toErrorMessage(error));
  }
}
