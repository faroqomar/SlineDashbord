'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth-checks';
import { z } from 'zod';

const BanUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

const UnbanUserSchema = z.object({
  userId: z.string().uuid(),
});

const VerifyUserSchema = z.object({
  userId: z.string().uuid(),
});

/**
 * Bans a user by updating their profile status and logging the action.
 */
export async function banUser(prevState: any, formData: FormData) {
  // 1. Auth Check
  const adminId = await verifyAdminSession();
  if (!adminId) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Validate Input
  const parsed = BanUserSchema.safeParse({
    userId: formData.get('userId'),
    reason: formData.get('reason'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { userId, reason } = parsed.data;
  const supabase = await createAdminClient();

  // 3. Perform Mutation
  const { error } = await supabase
    .from('profiles')
    .update({ 
      status: 'banned',
      metadata: { ban_reason: reason, banned_by: adminId, banned_at: new Date().toISOString() } 
    } as any)
    .eq('id', userId);

  if (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }

  // 4. Audit Log
  try {
    await logAdminAction(adminId, 'user_banned', userId, 'user', { reason });
  } catch (logError) {
    console.error('Audit log failed:', logError);
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function unbanUser(prevState: any, formData: FormData) {
  const adminId = await verifyAdminSession();
  if (!adminId) return { success: false, error: 'Unauthorized' };

  const parsed = UnbanUserSchema.safeParse({
    userId: formData.get('userId'),
  });

  if (!parsed.success) return { success: false, error: 'Invalid Input' };
  const { userId } = parsed.data;

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ 
      status: 'active',
      metadata: { unbanned_by: adminId, unbanned_at: new Date().toISOString() } 
    } as any)
    .eq('id', userId);

  if (error) return { success: false, error: error.message };

  await logAdminAction(adminId, 'user_unbanned', userId, 'user');
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function verifyUser(prevState: any, formData: FormData) {
    const adminId = await verifyAdminSession();
    if (!adminId) return { success: false, error: 'Unauthorized' };
  
    const parsed = VerifyUserSchema.safeParse({
      userId: formData.get('userId'),
    });
  
    if (!parsed.success) return { success: false, error: 'Invalid Input' };
    const { userId } = parsed.data;
  
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('profiles')
      .update({ 
        metadata: { is_verified: true, verified_by: adminId, verified_at: new Date().toISOString() } 
      } as any)
      .eq('id', userId);
  
    if (error) return { success: false, error: error.message };
  
    await logAdminAction(adminId, 'user_verified', userId, 'user');
    revalidatePath('/dashboard/users');
    return { success: true };
  }
