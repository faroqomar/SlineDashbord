'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

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
  amount: number; // Derived from task budget
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
}

export async function getDisputes(page = 1, status = 'all', limit = 10, query = '') {
  const supabase = createAdminClient();
  const PAGE_SIZE = limit;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  try {
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

    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status);
    }

    if (query) {
      queryBuilder = queryBuilder.or(`reason.ilike.%${query}%,id.eq.${query}`);
    }

    queryBuilder = queryBuilder.range(from, to).order('created_at', { ascending: false });

    const { data: disputesData, error, count } = await queryBuilder;

    if (error) {
      console.error('Error fetching disputes:', error);
      throw new Error('Failed to fetch disputes');
    }

    const disputes: DisputeDTO[] = disputesData.map((d: any) => ({
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

    return {
      disputes,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      totalDisputes: count || 0
    };

  } catch (error) {
    console.error('getDisputes error:', error);
    return { disputes: [], totalPages: 0, totalDisputes: 0 };
  }
}

export async function getDisputeDetails(id: string) {
  const supabase = createAdminClient();

  try {
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
        )
      `)
      .eq('id', id)
      .single();

    if (error || !d) {
        // If not found, return null or throw
        throw new Error('Dispute not found');
    }

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
      }
    };

    return dispute;

  } catch (error) {
    console.error('getDisputeDetails error:', error);
    return null;
  }
}

export async function resolveDispute(id: string, resolution: string, status: 'resolved' | 'dismissed') {
    const supabase = createAdminClient();

    try {
        const { error } = await supabase
            .from('disputes')
            .update({
                resolution,
                status,
                resolved_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        // Log action
        await supabase.from('admin_logs').insert({
            action: 'RESOLVE_DISPUTE',
            target_resource: 'dispute',
            target_id: id,
            metadata: { resolution, status }
        });

        revalidatePath('/dashboard/disputes');
        revalidatePath(`/dashboard/disputes/${id}`);
        return { success: true };

    } catch (error) {
        console.error('resolveDispute error:', error);
        return { success: false, error: 'Failed to resolve dispute' };
    }
}
