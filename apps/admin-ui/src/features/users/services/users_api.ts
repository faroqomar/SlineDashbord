import { request } from '@/lib/api';
import type { UsersKpiCounts, UsersStatusTab, UsersTabCounts } from '@sline/shared';
import type { UserInvestigationResponse } from '@sline/shared';
import type { JournalLedgerEntry, WalletSummary } from '@/features/finance/models/finance.model';

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
  metadata: Record<string, unknown>;
  auth_provider: string;
  banned_until: string | null;
}

type UserStatus = UserDTO['status'];

const USER_STATUS_VALUES: UserStatus[] = ['active', 'suspended', 'banned'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function normalizeUserStatus(value: unknown): UserStatus {
  if (typeof value === 'string' && USER_STATUS_VALUES.includes(value as UserStatus)) {
    return value as UserStatus;
  }
  return 'active';
}

function normalizeKpiCounts(raw: unknown): UsersKpiCounts | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const value = raw as Record<string, unknown>;

  const activeUsers = Number(value.activeUsers);
  const inactiveUsers = Number(value.inactiveUsers);
  const joinedThisMonth = Number(value.joinedThisMonth);

  if (!Number.isFinite(activeUsers) || !Number.isFinite(inactiveUsers) || !Number.isFinite(joinedThisMonth)) {
    return undefined;
  }

  return {
    activeUsers: Math.max(0, Math.trunc(activeUsers)),
    inactiveUsers: Math.max(0, Math.trunc(inactiveUsers)),
    joinedThisMonth: Math.max(0, Math.trunc(joinedThisMonth)),
  };
}

function normalizeTabCounts(raw: unknown): UsersTabCounts | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const value = raw as Record<string, unknown>;

  const all = Number(value.all);
  const active = Number(value.active);
  const inactive = Number(value.inactive);

  if (!Number.isFinite(all) || !Number.isFinite(active) || !Number.isFinite(inactive)) {
    return undefined;
  }

  return {
    all: Math.max(0, Math.trunc(all)),
    active: Math.max(0, Math.trunc(active)),
    inactive: Math.max(0, Math.trunc(inactive)),
  };
}

type ListResult = {
  users: UserDTO[];
  totalPages: number;
  totalUsers: number;
  kpiCounts?: UsersKpiCounts;
  tabCounts?: UsersTabCounts;
};
type IdResult = { userId: string };
export interface UserWalletLookupDTO {
  wallet: WalletSummary | null;
  timeline: { data: JournalLedgerEntry[]; nextCursor?: undefined };
}

function mapProfileToUserDTO(
  profile: {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    active_role?: string;
    roles?: string[];
    status?: string;
    account_status?: string;
    created_at?: string;
    updated_at?: string;
  },
): UserDTO {
  const roles = toStringArray(profile.roles);
  return {
    id: profile.id,
    email: profile.email ?? '',
    full_name: profile.full_name ?? 'Unknown',
    avatar_url: profile.avatar_url ?? '',
    role: profile.active_role ?? roles[0] ?? 'user',
    roles: roles.length > 0 ? roles : ['user'],
    active_role: profile.active_role ?? roles[0] ?? 'user',
    status: normalizeUserStatus(profile.account_status ?? profile.status),
    created_at: profile.created_at ?? '',
    last_sign_in_at: profile.updated_at ?? '',
  };
}

function toLegacyResult<T>(
  res: { ok: true; data: T } | { ok: false; error: { message?: string } },
): { success: true; data: T } | { success: false; error: string } {
  if (res.ok) return { success: true, data: res.data };
  return { success: false, error: res.error.message ?? 'Unknown error' };
}

export async function getUsers(
  page = 1,
  query = '',
  roleStr = 'all',
  statusTab: UsersStatusTab = 'all',
): Promise<{ success: true; data: ListResult } | { success: false; error: string }> {
  const params = new URLSearchParams({ page: String(page), query, role: roleStr, statusTab });
  const res = await request<{
    users: unknown[];
    totalUsers: number;
    totalPages: number;
    kpiCounts?: unknown;
    tabCounts?: unknown;
  }>(
    'GET',
    `/users?${params.toString()}`
  );
  if (!res.ok) return toLegacyResult(res);
  const users = (res.data.users ?? []).map((p: unknown) => mapProfileToUserDTO(p as Parameters<typeof mapProfileToUserDTO>[0]));
  const kpiCounts = normalizeKpiCounts(res.data.kpiCounts);
  const tabCounts = normalizeTabCounts(res.data.tabCounts);
  return {
    success: true,
    data: {
      users,
      totalPages: res.data.totalPages ?? 0,
      totalUsers: res.data.totalUsers ?? 0,
      kpiCounts,
      tabCounts,
    },
  };
}

export async function getUserDetails(id: string): Promise<{ success: true; data: UserDetailsDTO } | { success: false; error: string }> {
  const res = await request<{ auth: { id: string; email?: string; created_at?: string; last_sign_in_at?: string; user_metadata?: unknown; app_metadata?: unknown; banned_until?: string; phone?: string }; profile: Record<string, unknown> }>(
    'GET',
    `/users/${id}`
  );
  if (!res.ok) return toLegacyResult(res);
  const { auth, profile } = res.data;
  const profileMap = toRecord(profile);
  const userMetadata = toRecord(auth.user_metadata);
  const appMetadata = toRecord(auth.app_metadata);
  const roles = toStringArray(profileMap.roles);
  const activeRole =
    toStringValue(profileMap.active_role) ??
    roles[0] ??
    toStringValue(appMetadata.role) ??
    'user';
  const status =
    auth.banned_until != null && auth.banned_until !== ''
      ? 'banned'
      : normalizeUserStatus(profileMap.account_status ?? profileMap.status);

  const user: UserDetailsDTO = {
    id: auth.id,
    email: auth.email ?? '',
    full_name:
      toStringValue(profileMap.full_name) ??
      toStringValue(userMetadata.full_name) ??
      'Unknown',
    avatar_url:
      toStringValue(profileMap.avatar_url) ??
      toStringValue(userMetadata.avatar_url) ??
      '',
    role: activeRole,
    roles: roles.length > 0 ? roles : [activeRole],
    active_role: activeRole,
    status,
    created_at: auth.created_at ?? toStringValue(profileMap.created_at) ?? '',
    last_sign_in_at: auth.last_sign_in_at ?? toStringValue(profileMap.updated_at) ?? '',
    phone: auth.phone ?? toStringValue(profileMap.phone) ?? '',
    bio: toStringValue(profileMap.bio) ?? '',
    metadata: userMetadata,
    auth_provider: toStringValue(appMetadata.provider) ?? 'email',
    banned_until: auth.banned_until ?? null,
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

export async function getUserInvestigation(userId: string): Promise<{ success: true; data: UserInvestigationResponse } | { success: false; error: string }> {
  const res = await request<UserInvestigationResponse>('GET', `/users/${userId}/investigation`);
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: res.data };
}

export async function getUserWalletLookup(
  userId: string,
): Promise<{ success: true; data: UserWalletLookupDTO } | { success: false; error: string }> {
  const res = await request<UserWalletLookupDTO>('GET', `/finance/users/${userId}`);
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: res.data };
}
