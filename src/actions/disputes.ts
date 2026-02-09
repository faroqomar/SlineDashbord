'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-logger';
import { revalidatePath } from 'next/cache';

import { Dispute, DisputeListResult } from '@/features/disputes/models/dispute.model';

export async function getDisputes(
  page: number = 1,
  status: string = 'open',
  pageSize: number = 10
): Promise<DisputeListResult> {
  const supabase = createAdminClient();
  const offset = (page - 1) * pageSize;

  let dbQuery = supabase
    .from('disputes')
    .select('*, initiator:profiles!initiator_id(*), task:tasks(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    throw new Error(`Failed to fetch disputes: ${error.message}`);
  }

  // Cast existing data to Dispute[]
  const disputes = (data || []) as unknown as Dispute[];

  return {
    disputes,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getDisputeDetails(disputeId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('disputes')
    .select(`
      *,
      initiator:profiles!initiator_id(*),
      task:tasks(*),
      messages:dispute_messages(*),
      evidence:dispute_evidence(*)
    `)
    .eq('id', disputeId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch dispute details: ${error.message}`);
  }

  return data;
}

export async function resolveDispute(disputeId: string, resolution: string, outcome: string, notes: string) {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Update Dispute
  const { error } = await supabaseAdmin
    .from('disputes')
    .update({ 
      status: 'resolved', 
      resolution: outcome, // e.g., 'refund_client', 'payout_freelancer'
      reason: notes, // Store admin notes in 'reason' or a new column? Schema has 'reason'.
      resolved_at: new Date().toISOString() 
    })
    .eq('id', disputeId);

  if (error) {
    throw new Error(`Failed to resolve dispute: ${error.message}`);
  }

  // 2. Log Action
  await logAdminAction(user.id, 'resolve_dispute', 'dispute', disputeId, { resolution, outcome, notes });

  revalidatePath('/dashboard/disputes');
  revalidatePath(`/dashboard/disputes/${disputeId}`);
  return { success: true };
}
