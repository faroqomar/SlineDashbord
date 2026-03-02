'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole, logAuditEvent, enforceRateLimit } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { GetDisputesSchema, UpdateDisputeStatusSchema, USERS_READ_ROLES, USERS_WRITE_ROLES } from '../models/dispute.schema';
import { z } from 'zod';

export interface DisputeDTO {
  id: string;
  task_id: string;
  task_title: string;
  complainant: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
    role: string;
  };
  defendant: {
     id: string;
    full_name: string;
    avatar_url: string;
    email: string;
    role: string;
  };
  reason: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  amount: number;
  created_at: string;
}

export interface DisputeDetailsDTO extends DisputeDTO {
  resolution?: string;
  resolved_at?: string;
  task_details: {
    description: string;
    budget: number;
    deadline: string;
    status: string;
  };
  messages: any[];
  evidence: any[];
}

export async function getDisputes(
  page = 1, 
  status = 'all', 
  limit = 10, 
  query = ''
): Promise<ServiceResult<{ disputes: DisputeDTO[]; totalDisputes: number; totalPages: number }>> {
  try {
    const parsed = GetDisputesSchema.safeParse({ page, status, limit });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(USERS_READ_ROLES);

    const supabase = createAdminClient();
    const PAGE_SIZE = parsed.data.limit;
    const from = (parsed.data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('disputes')
      .select(`
        *,
        task:tasks (
          id,
          title,
          budget,
          budget_cents
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        ),
        defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        )
      `, { count: 'exact' });

    if (parsed.data.status && parsed.data.status !== 'all') {
      queryBuilder = queryBuilder.eq('status', parsed.data.status);
    }

    if (query) {
      queryBuilder = queryBuilder.or(`reason.ilike.%${query}%,id.eq.${query}`);
    }

    queryBuilder = queryBuilder.range(from, to).order('created_at', { ascending: false });

    const { data: disputesData, error, count } = await queryBuilder;

    if (error) return fail('Failed to fetch disputes');

    const disputes: DisputeDTO[] = (disputesData || []).map((d: any) => ({
      id: d.id,
      task_id: d.task?.id || d.task_id,
      task_title: d.task?.title || 'Unknown Task',
      complainant: {
        id: d.complainant?.id,
        full_name: d.complainant?.full_name || 'Unknown',
        avatar_url: d.complainant?.avatar_url || '',
        email: d.complainant?.email || '',
        role: d.complainant?.active_role || 'user'
      },
      defendant: {
        id: d.defendant?.id,
        full_name: d.defendant?.full_name || 'Unknown',
        avatar_url: d.defendant?.avatar_url || '',
        email: d.defendant?.email || '',
        role: d.defendant?.active_role || 'user'
      },
      reason: d.reason || 'No reason provided',
      status: d.status || 'open',
      amount: (d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0),
      created_at: d.created_at,
    }));

    return ok({
      disputes,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      totalDisputes: count || 0
    });
  } catch (error) {
    console.error('getDisputes error:', error);
    return fail(toErrorMessage(error));
  }
}

const GetDisputeDetailsSchema = z.object({ id: z.string().uuid("Invalid Dispute ID") });

export async function getDisputeDetails(id: string): Promise<ServiceResult<DisputeDetailsDTO>> {
  try {
    const parsed = GetDisputeDetailsSchema.safeParse({ id });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(USERS_READ_ROLES);

    const supabase = createAdminClient();

    const { data: d, error } = await supabase
      .from('disputes')
      .select(`
        *,
        task:tasks (
          id,
          title,
          description,
          budget,
          budget_cents,
          deadline,
          status
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
         defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
        messages:dispute_messages (
          id,
          content,
          created_at,
          is_admin,
          sender:profiles!dispute_messages_sender_id_fkey (
             full_name
          )
        ),
        evidence:dispute_evidence (
          id,
          file_url,
          file_type,
          description,
          created_at,
          uploader:profiles!dispute_evidence_uploader_id_fkey (
             full_name
          )
        )
      `)
      .eq('id', parsed.data.id)
      .single();

    if (error || !d) return fail('Dispute not found');

    const dispute: DisputeDetailsDTO = {
      id: d.id,
      task_id: d.task?.id || d.task_id,
      task_title: d.task?.title || 'Unknown Task',
      complainant: {
        id: d.complainant?.id,
        full_name: d.complainant?.full_name || 'Unknown',
        avatar_url: d.complainant?.avatar_url || '',
        email: d.complainant?.email || '',
         role: d.complainant?.active_role || 'user'
      },
      defendant: {
         id: d.defendant?.id,
        full_name: d.defendant?.full_name || 'Unknown',
        avatar_url: d.defendant?.avatar_url || '',
        email: d.defendant?.email || '',
         role: d.defendant?.active_role || 'user'
      },
      reason: d.reason || 'No reason provided',
      status: d.status || 'open',
      amount: (d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0),
      created_at: d.created_at,
      resolution: d.resolution,
      resolved_at: d.resolved_at,
      task_details: {
        description: d.task?.description || '',
        budget: (d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0),
        deadline: d.task?.deadline,
        status: d.task?.status || 'unknown'
      },
      messages: d.messages || [],
      evidence: d.evidence || []
    };

    return ok(dispute);
  } catch (error) {
    console.error('getDisputeDetails error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function resolveDispute(id: string, resolution: string, status: 'resolved' | 'dismissed', decision?: 'refund_client' | 'release_freelancer'): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = UpdateDisputeStatusSchema.safeParse({ id, status, resolution, decision });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(USERS_WRITE_ROLES);
        await enforceRateLimit('resolve_dispute', userId, 5, 60000);
        const supabase = createAdminClient();

        // If it's a financial resolution ('resolved') with a valid decision
        if (parsed.data.status === 'resolved' && parsed.data.decision) {
            const { error: rpcError } = await supabase.rpc('admin_resolve_dispute', {
                p_dispute_id: parsed.data.id,
                p_decision: parsed.data.decision
            });
            
            if (rpcError) return fail(`Failed to execute financial resolution: ${rpcError.message}`);
            
            // Still update the admin reasoning notes
            await supabase.from('disputes').update({ resolution: parsed.data.resolution }).eq('id', parsed.data.id);
        } else {
            // Non-financial resolution (e.g., dismissed)
            const { error } = await supabase
                .from('disputes')
                .update({
                    resolution: parsed.data.resolution,
                    status: parsed.data.status,
                    resolved_at: new Date().toISOString()
                })
                .eq('id', parsed.data.id);
    
            if (error) return fail('Failed to resolve dispute');
        }

        // Log action securely targeting audit_logs
        await logAuditEvent({
            action: 'admin.disputes.resolve',
            actor_user_id: userId,
            related_entity_type: 'dispute',
            related_entity_id: parsed.data.id,
            meta: { resolution: parsed.data.resolution, status: parsed.data.status, decision: parsed.data.decision }
        });

        revalidatePath('/dashboard/disputes');
        revalidatePath(`/dashboard/disputes/${parsed.data.id}`);
        
        return ok({id: parsed.data.id});
    } catch (error) {
        console.error('resolveDispute error:', error);
        return fail(toErrorMessage(error));
    }
}
