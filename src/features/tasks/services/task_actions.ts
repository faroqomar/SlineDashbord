'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdminRole, logAuditEvent } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { GetTasksSchema, TASKS_READ_ROLES, TASKS_WRITE_ROLES } from '../models/task.schema';
import { z } from 'zod';

export type TaskDTO = {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'canceled' | 'review';
  created_at: string;
  deadline?: string;
  client: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  freelancer?: {
    id: string;
    full_name: string;
    avatar_url: string;
  } | null;
  category?: string;
};

export type TaskDetailsDTO = TaskDTO & {
  skills: string[];
  image_paths: string[];
};

export async function getTasks(
  page = 1, 
  status = 'all', 
  limit = 10, 
  query = ''
): Promise<ServiceResult<{ tasks: TaskDTO[]; count: number; totalPages: number }>> {
  try {
    const parsed = GetTasksSchema.safeParse({ page, status, limit, query });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(TASKS_READ_ROLES);

    const supabase = createAdminClient();
    const PAGE_SIZE = parsed.data.limit;
    const from = (parsed.data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        budget,
        status,
        created_at,
        deadline,
        category,
        client:owner_id(id, full_name, avatar_url),
        freelancer:assigned_freelancer_id(id, full_name, avatar_url)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (parsed.data.status !== 'all') {
      queryBuilder = queryBuilder.eq('status', parsed.data.status);
    }

    if (parsed.data.query) {
      queryBuilder = queryBuilder.ilike('title', `%${parsed.data.query}%`);
    }

    const { data, error, count } = await queryBuilder;

    if (error) return fail('Failed to fetch tasks');

    const tasks: TaskDTO[] = (data || []).map((task: any) => ({
      ...task,
      client: {
        id: task.client?.id || 'unknown',
        full_name: task.client?.full_name || 'Unknown Client',
        avatar_url: task.client?.avatar_url || '',
      },
      freelancer: task.freelancer ? {
        id: task.freelancer.id,
        full_name: task.freelancer.full_name,
        avatar_url: task.freelancer.avatar_url,
      } : null,
    }));

    return ok({
      tasks,
      count: count || 0,
      totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0,
    });
  } catch (error) {
    console.error('getTasks error:', error);
    return fail(toErrorMessage(error));
  }
}

const GetTaskDetailsSchema = z.object({ id: z.string().uuid("Invalid Task ID") });

export async function getTaskDetails(id: string): Promise<ServiceResult<TaskDetailsDTO>> {
  try {
    const parsed = GetTaskDetailsSchema.safeParse({ id });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(TASKS_READ_ROLES);

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        client:owner_id(id, full_name, avatar_url),
        freelancer:assigned_freelancer_id(id, full_name, avatar_url)
      `)
      .eq('id', parsed.data.id)
      .single();

    if (error || !data) return fail('Task not found');

    return ok({
      ...data,
      skills: data.skills || [],
      image_paths: data.image_paths || [],
      client: {
        id: data.client?.id || 'unknown',
        full_name: data.client?.full_name || 'Unknown Client',
        avatar_url: data.client?.avatar_url || '',
      },
      freelancer: data.freelancer ? {
        id: data.freelancer.id,
        full_name: data.freelancer.full_name,
        avatar_url: data.freelancer.avatar_url,
      } : null,
    } as TaskDetailsDTO);

  } catch (error) {
    console.error('getTaskDetails error:', error);
    return fail(toErrorMessage(error));
  }
}

const CancelTaskSchema = z.object({
  id: z.string().uuid("Invalid Task ID"),
  reason: z.string().min(5, "Reason required")
});

export async function cancelTask(id: string, reason: string): Promise<ServiceResult<{id: string}>> {
  try {
    const parsed = CancelTaskSchema.safeParse({ id, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(TASKS_WRITE_ROLES);

    const supabase = createAdminClient();

    // 1. Update task status
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ status: 'canceled' })
      .eq('id', parsed.data.id);

    if (updateError) return fail('Failed to cancel task');

    // 2. Log action securely targeting audit_logs
    await logAuditEvent({
        action: 'admin.tasks.cancel',
        actor_user_id: userId,
        related_entity_type: 'task',
        related_entity_id: parsed.data.id,
        meta: { reason: parsed.data.reason }
    });

    revalidatePath('/dashboard/tasks');
    revalidatePath(`/dashboard/tasks/${parsed.data.id}`);
    
    return ok({ id: parsed.data.id });
  } catch (error) {
    console.error('cancelTask error:', error);
    return fail(toErrorMessage(error));
  }
}
