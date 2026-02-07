'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { UserDTO, Profile } from '@/types/admin-types';

export interface UserFilter {
  query?: string;
  role?: string;
}

export interface UserListResponse {
  data: UserDTO[];
  count: number;
}

export async function getUsers(page: number = 1, pageSize: number = 10, filters?: UserFilter): Promise<UserListResponse> {
  const supabase = await createAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  if (filters?.query) {
    query = query.or(`full_name.ilike.%${filters.query}%,email.ilike.%${filters.query}%`);
  }

  if (filters?.role && filters.role !== 'all') {
    // Assuming 'active_role' or 'roles' column is used. 
    // Checking typescript definition: profiles has 'active_role' (string) and 'roles' (string[]).
    // Let's filter by active_role for simple view, or contains in roles.
    query = query.eq('active_role', filters.role);
  }

  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  // Map to DTO
  const userDTOs: UserDTO[] = (data as Profile[]).map(profile => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: profile.active_role,
    status: 'active', // 'status' might be in auth.users, profiles usually don't have it unless customized. Defaulting to active.
    created_at: profile.created_at,
  }));

  return {
    data: userDTOs,
    count: count || 0,
  };
}

export async function getUserFullProfile(id: string) {
    const supabase = await createAdminClient();

    const [profileResult, walletResult, tasksAsClient, tasksAsFreelancer] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('wallet_balances').select('*').eq('user_id', id).single(),
        supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }).limit(5),
        supabase.from('tasks').select('*').eq('freelancer_id', id).order('created_at', { ascending: false }).limit(5),
    ]);

    if (profileResult.error) {
        throw new Error(`Profile not found: ${profileResult.error.message}`);
    }

    // We can also try to fetch auth user data using supabase.auth.admin.getUserById(id) 
    // but that requires specific admin permission scope often.
    // Let's stick to public schema relations for now unless explicitly needed.

    return {
        profile: profileResult.data,
        wallet: walletResult.data || { available_balance: 0, held_balance: 0 },
        recentClientTasks: tasksAsClient.data || [],
        recentFreelancerTasks: tasksAsFreelancer.data || [],
    };
}
