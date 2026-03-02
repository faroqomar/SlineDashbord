import { request } from '@/lib/api';

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
  recent_activity: unknown[];
  metadata: unknown;
}

type ListResult = { users: UserDTO[]; totalPages: number; totalUsers: number };
type IdResult = { userId: string };

function mapProfileToUserDTO(p: { id: string; email?: string; full_name?: string; avatar_url?: string; active_role?: string; roles?: string[]; status?: string; account_status?: string; created_at?: string; updated_at?: string }): UserDTO {
  const status = (p.account_status ?? p.status) as 'active' | 'suspended' | 'banned' | undefined;
  return {
    id: p.id,
    email: p.email ?? '',
    full_name: p.full_name ?? 'Unknown',
    avatar_url: p.avatar_url ?? '',
    role: p.active_role ?? (p.roles?.[0]) ?? 'user',
    roles: p.roles ?? ['user'],
    active_role: p.active_role ?? 'user',
    status: status ?? 'active',
    created_at: p.created_at ?? '',
    last_sign_in_at: p.updated_at ?? '',
  };
}

function toLegacyResult<T>(res: { ok: true; data: T } | { ok: false; error: { message: string } }): { success: true; data: T } | { success: false; error: string } {
  if (res.ok) return { success: true, data: res.data };
  return { success: false, error: res.error.message };
}

export async function getUsers(
  page = 1,
  query = '',
  roleStr = 'all'
): Promise<{ success: true; data: ListResult } | { success: false; error: string }> {
  const params = new URLSearchParams({ page: String(page), query, role: roleStr });
  const res = await request<{ users: unknown[]; totalUsers: number; totalPages: number }>(
    'GET',
    `/users?${params.toString()}`
  );
  if (!res.ok) return toLegacyResult(res);
  const users = (res.data.users ?? []).map((p: unknown) => mapProfileToUserDTO(p as Parameters<typeof mapProfileToUserDTO>[0]));
  return { success: true, data: { users, totalPages: res.data.totalPages ?? 0, totalUsers: res.data.totalUsers ?? 0 } };
}

export async function getUserDetails(id: string): Promise<{ success: true; data: UserDetailsDTO } | { success: false; error: string }> {
  const res = await request<{ auth: { id: string; email?: string; created_at?: string; last_sign_in_at?: string; user_metadata?: unknown; app_metadata?: unknown; banned_until?: string; phone?: string }; profile: Record<string, unknown> }>(
    'GET',
    `/users/${id}`
  );
  if (!res.ok) return toLegacyResult(res);
  const { auth, profile } = res.data;
  const profileMap = profile ?? {};
  const user: UserDetailsDTO = {
    id: auth.id,
    email: (auth.email as string) ?? '',
    full_name: (profileMap.full_name as string) ?? (auth.user_metadata as Record<string, unknown>)?.full_name ?? 'Unknown',
    avatar_url: (profileMap.avatar_url as string) ?? (auth.user_metadata as Record<string, unknown>)?.avatar_url ?? '',
    role: (profileMap.active_role as string) ?? (profileMap.roles as string[])?.[0] ?? (auth.app_metadata as Record<string, unknown>)?.role ?? 'user',
    roles: (profileMap.roles as string[]) ?? ['user'],
    active_role: (profileMap.active_role as string) ?? 'user',
    status: (auth.banned_until ? 'banned' : ((profileMap.account_status ?? profileMap.status) as string) ?? 'active') as UserDetailsDTO['status'],
    created_at: auth.created_at ?? '',
    last_sign_in_at: auth.last_sign_in_at ?? '',
    phone: (auth.phone as string) ?? '',
    bio: (profileMap.bio as string) ?? '',
    rating: (profileMap.rating as number) ?? 0,
    spent: 0,
    earned: 0,
    job_count: 0,
    wallet_balance: 0,
    recent_activity: [],
    metadata: auth.user_metadata ?? {},
  };
  return { success: true, data: user };
}

export async function banUser(userId: string, reason: string): Promise<{ success: true; data: IdResult } | { success: false; error: string }> {
  const res = await request<unknown>('POST', `/users/${userId}/ban`, { reason });
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { userId } };
}

export async function unbanUser(userId: string): Promise<{ success: true; data: IdResult } | { success: false; error: string }> {
  const res = await request<unknown>('POST', `/users/${userId}/unban`);
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { userId } };
}

/** Suspend a user (temporary). Calls POST /users/:userId/suspend with reason and duration. */
export async function suspendUser(userId: string, reason: string, duration: string = '24h'): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const res = await request<{ userId: string; duration?: string }>('POST', `/users/${userId}/suspend`, { reason, duration });
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { id: res.data.userId } };
}

/** Force logout user (admin/super_admin only). User must re-authenticate. POST /users/:userId/force-logout */
export async function forceLogoutUser(userId: string, reason?: string): Promise<{ success: true; data: IdResult } | { success: false; error: string }> {
  const res = await request<{ userId: string }>('POST', `/users/${userId}/force-logout`, reason ? { reason } : {});
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { userId: res.data.userId } };
}

/** Not implemented in API yet; returns failure. */
export async function verifyUser(userId: string): Promise<{ success: true; data: IdResult } | { success: false; error: string }> {
  return { success: false, error: 'Verify user not implemented in API yet' };
}
