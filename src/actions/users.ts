'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-logger';
import { revalidatePath } from 'next/cache';

// ... existing imports ...

import { UserProfile, UserListResult } from '@/features/users/models/user.model';

export async function getUsers(
  page: number = 1,
  query: string = '',
  role: string = 'all',
  pageSize: number = 10
): Promise<UserListResult> {
  const supabase = createAdminClient();
  const offset = (page - 1) * pageSize;

  let dbQuery = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  if (role && role !== 'all') {
    // Assuming 'active_role' is the column to filter on, or we filter by 'roles' array
    // For simplicity using active_role matching or array contains
    // profiles.roles is text[]
    dbQuery = dbQuery.contains('roles', [role.toLowerCase()]);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  // Cast existing data to UserProfile[]
  const users = (data || []) as unknown as UserProfile[];

  return {
    users,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getUserDeepProfile(userId: string) {
  const supabase = createAdminClient();

  const [profileResult, tasksResult, walletResult] = await Promise.all([
    // 1. Profile
    supabase.from('profiles').select('*').eq('id', userId).single(),

    // 2. Job History (Tasks where user is involved)
    supabase
      .from('tasks')
      .select('*')
      .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10),

    // 3. Wallet Transactions (to calculate balance)
    supabase.from('wallet_transactions').select('amount').eq('user_id', userId),
  ]);

  if (profileResult.error) {
    throw new Error(`Failed to fetch profile: ${profileResult.error.message}`);
  }

  // Calculate balance on the fly
  const balance = (walletResult.data || []).reduce(
    (sum, txn) => sum + (Number(txn.amount) || 0),
    0
  );

  return {
    profile: profileResult.data,
    recentActivity: tasksResult.data || [],
    walletBalance: balance,
  };
}

export async function banUser(userId: string, reason: string) {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();

  // 1. Check Auth (Security)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  // 1b. Verify Admin Role (Double check)
  const { data: adminUser } = await supabaseAdmin.from('admin_users').select('role').eq('id', user.id).single();
  if (!adminUser) {
      throw new Error('Forbidden: Not an admin');
  }

  // 2. Update Profile Status
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ status: 'banned', metadata: { ban_reason: reason, banned_at: new Date().toISOString() } })
    .eq('id', userId);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  // 3. Revoke Auth Session (Ban in Auth)
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: "876600h", // ~100 years
  });

  if (authError) {
    console.error('Failed to ban user in Auth:', authError);
  }

  // 4. Audit Log
  await logAdminAction(user.id, 'ban_user', 'user', userId, { reason });

  revalidatePath('/dashboard/users');
  return { success: true };
}

