'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string; // From metadata or custom claim
  roles: string[]; // For UI compatibility
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
  metadata: any;
}

export async function getUsers(page = 1, query = '', roleStr = 'all') {
  const supabase = createAdminClient();
  const PAGE_SIZE = 10;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  try {
    // 1. Fetch from auth.users (List users)
    // Note: listUsers() does not support complex filtering/sorting efficiently on the server side 
    // without using the experimental listUsers() params or fetching all and filtering. 
    // For scale, we should index profiles, but for now we'll fetch from profiles which is joined to auth in refined arch.
    // HOWEVER, the plan said "Source: auth.users (joined with public.profiles)". 
    // Direct Access to auth.users implies using admin API.
    
    // Better Approach for Admin Dashboard: Query the `public.profiles` table which should duplicate key auth info 
    // OR use listUsers for Auth info and map profiles.
    
    // Let's use `public.profiles` as the primary source for the LIST view if it exists and has email,
    // otherwise we accept the limitation of listUsers or we join manually.
    // Based on previous files, `profiles` has `id, name, email` usually.
    
    // Let's check profiles columns first? No, let's assume standard Supabase pattern:
    // Profiles table is usually the source of truth for app data.
    
    let queryBuilder = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (query) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    // Role filtering (assuming role column exists on profile or we need to check metadata)
    if (roleStr && roleStr !== 'all') {
      // Assuming 'role' column on profiles or metadata check.
      // Let's assume a 'role' column for now based on standard schemas, or ignore if specific to claims.
       queryBuilder = queryBuilder.eq('role', roleStr);
    }

    queryBuilder = queryBuilder.range(from, to).order('created_at', { ascending: false });

    const { data: profiles, error, count } = await queryBuilder;

    if (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch users');
    }

    // If profiles don't contain email/status, we might need to fetch auth users too. 
    // But typically `profiles` copies email via trigger.
    // Let's assume profiles has what we need for the list.
    
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
      last_sign_in_at: p.updated_at, // Approximation
    }));

    return {
      users,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      totalUsers: count || 0
    };

  } catch (error) {
    console.error('getUsers error:', error);
    return { users: [], totalPages: 0, totalUsers: 0 };
  }
}

export async function getUserDetails(id: string) {
  const supabase = createAdminClient();

  try {
    // Parallel fetch: Auth User (for sensitive metadata) + Profile (public info)
    const [authRes, profileRes] = await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase.from('profiles').select('*').eq('id', id).single()
    ]);

    if (authRes.error || !authRes.data.user) throw new Error('User not found in Auth');
    const authUser = authRes.data.user;
    const profile = profileRes.data || {};

    // Get aggregated stats (mocked logic or real tables later)
    // const { count: taskCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', id);

    const user: UserDetailsDTO = {
      id: authUser.id,
      email: authUser.email!,
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
       // These would come from a 'wallets' or 'transactions' table
      spent: 0, 
      earned: 0,
      job_count: 0, // taskCount || 0
      metadata: authUser.user_metadata
    };

    return user;

  } catch (error) {
    console.error('getUserDetails error:', error);
    return null;
  }
}

export async function suspendUser(id: string, reason: string, duration?: string) {
  const supabase = createAdminClient();

  try {
     const banDuration = duration === 'permanent' ? '9999-12-31' : 
                        duration === '30d' ? new Date(Date.now() + 30*24*60*60*1000).toISOString() :
                        new Date(Date.now() + 24*60*60*1000).toISOString(); // 24h default

     // 1. Update Auth User (Ban)
    const { error: banError } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: duration === 'permanent' ? '876000h' : '720h' // 100 years or 30 days
    });
     
     if (banError) throw banError;

     // 2. Update Public Profile Status
     await supabase.from('profiles').update({ status: 'suspended' }).eq('id', id);

     // 3. Log Action
     await supabase.from('admin_logs').insert({
        action: 'BAN_USER',
        target_resource: 'user',
        target_id: id,
        metadata: { reason, duration }
     });

     revalidatePath('/dashboard/users');
     revalidatePath(`/dashboard/users/${id}`);
     return { success: true };
  } catch (error) {
    console.error('suspendUser error:', error);
    return { success: false, error: 'Failed to suspend user' };
  }
}
