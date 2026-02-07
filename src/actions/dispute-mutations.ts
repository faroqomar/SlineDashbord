'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth-checks';
import { z } from 'zod';

const ResolveDisputeSchema = z.object({
  disputeId: z.string().uuid(),
  decision: z.enum(['refund_client', 'release_freelancer']),
});

/**
 * Resolves a dispute by calling the secure RPC function.
 */
export async function resolveDispute(prevState: any, formData: FormData) {
  // 1. Auth Check
  const adminId = await verifyAdminSession();
  if (!adminId) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Validation
  const parsed = ResolveDisputeSchema.safeParse({
    disputeId: formData.get('disputeId'),
    decision: formData.get('decision'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { disputeId, decision } = parsed.data;
  const supabase = await createAdminClient();

  // 3. Secure RPC Call
  const { error } = await supabase.rpc('admin_resolve_dispute', {
    p_dispute_id: disputeId,
    p_decision: decision
  });

  if (error) {
    console.error('Error resolving dispute:', error);
    return { success: false, error: 'Failed to resolve dispute' };
  }

  // 4. Audit Log
  try {
    await logAdminAction(adminId, 'dispute_resolved', disputeId, 'dispute', { decision });
  } catch (logError) {
    console.error('Audit log failed:', logError);
  }

  // 5. Revalidate
  revalidatePath('/dashboard/disputes');
  revalidatePath('/dashboard/finance');
  
  return { success: true };
}
