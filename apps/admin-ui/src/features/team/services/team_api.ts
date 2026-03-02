import { request } from '@/lib/api';
import type { AdminUserDTO } from '../models/team.schema';

function toLegacyResult<T>(res: { ok: true; data: T } | { ok: false; error: { message: string } }): { success: true; data: T } | { success: false; error: string } {
  if (res.ok) return { success: true, data: res.data };
  return { success: false, error: res.error.message };
}

/** No list endpoint in API yet; stub returns empty array. */
export async function getTeamMembers(): Promise<{ success: true; data: AdminUserDTO[] } | { success: false; error: string }> {
  return { success: true, data: [] };
}

export async function inviteMember(email: string, role: string, fullName: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const res = await request<{ id: string }>('POST', '/team/invite', { email, role, fullName });
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { id: res.data.id } };
}

export async function removeMember(targetUserId: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const res = await request<unknown>('DELETE', `/team/${targetUserId}`);
  if (!res.ok) return toLegacyResult(res);
  return { success: true, data: { id: targetUserId } };
}

/** Not implemented in API yet. */
export async function updateRole(_targetUserId: string, _newRole: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  return { success: false, error: 'Update role not implemented in API yet' };
}
