'use server';

import { createAdminClient as supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdminRole, logAuditEvent, enforceRateLimit } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { 
  GetTasksSchema, 
  UpdateTaskStatusSchema,
  TASKS_READ_ROLES, 
  TASKS_WRITE_ROLES,
  TaskDTO,
  TaskDetailsDTO,
  TaskStatus
} from '../models/task.schema';

/**
 * Fetches a paginated list of tasks with filters and joins.
 */
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

    const supabase = supabaseAdmin();
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

    if (error) return fail(`Failed to fetch tasks: ${error.message}`);

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
      status: task.status as TaskStatus
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

/**
 * Fetches single task details with full metadata.
 */
export async function getTaskDetails(id: string): Promise<ServiceResult<TaskDetailsDTO>> {
  try {
    await requireAdminRole(TASKS_READ_ROLES);
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        client:owner_id(id, full_name, avatar_url),
        freelancer:assigned_freelancer_id(id, full_name, avatar_url)
      `)
      .eq('id', id)
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
      status: data.status as TaskStatus
    } as TaskDetailsDTO);

  } catch (error) {
    console.error('getTaskDetails error:', error);
    return fail(toErrorMessage(error));
  }
}

/**
 * Updates a task's status with audit logging.
 */
export async function updateTaskStatus(
    id: string, 
    status: TaskStatus, 
    reason: string
): Promise<ServiceResult<{id: string}>> {
  try {
    const parsed = UpdateTaskStatusSchema.safeParse({ id, status, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(TASKS_WRITE_ROLES);
    await enforceRateLimit('update_task_status', userId, 10, 60000);

    // If status is canceled, use the specialized forceCancel logic
    if (parsed.data.status === 'canceled') {
        return forceCancelTask(parsed.data.id, parsed.data.reason);
    }

    const supabase = supabaseAdmin();

    const { error: updateError } = await supabase
      .from('tasks')
      .update({ 
        status: parsed.data.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', parsed.data.id);

    if (updateError) return fail(`Failed to update task: ${updateError.message}`);

    await logAuditEvent({
        action: `admin.tasks.update_status.${parsed.data.status}`,
        actor_user_id: userId,
        related_entity_type: 'task',
        related_entity_id: parsed.data.id,
        meta: { status: parsed.data.status, reason: parsed.data.reason }
    });

    revalidatePath('/dashboard/tasks');
    revalidatePath(`/dashboard/tasks/${parsed.data.id}`);
    
    return ok({ id: parsed.data.id });
  } catch (error) {
    console.error('updateTaskStatus error:', error);
    return fail(toErrorMessage(error));
  }
}

/**
 * Fetches the activity history (audit logs) for a specific task.
 */
export async function getTaskActivity(id: string): Promise<ServiceResult<any[]>> {
    try {
        await requireAdminRole(TASKS_READ_ROLES);
        const supabase = supabaseAdmin();

        const { data, error } = await supabase
            .from('admin_logs')
            .select(`
                *,
                actor:actor_id(id, full_name, avatar_url)
            `)
            .eq('target_resource', 'task')
            .eq('target_id', id)
            .order('created_at', { ascending: false });

        if (error) return fail(`Failed to fetch activity: ${error.message}`);

        return ok(data || []);
    } catch (e: any) {
        return fail(toErrorMessage(e));
    }
}

/**
 * Administrative force-cancellation with Escrow Reversal (Ledger Sync).
 */
export async function forceCancelTask(id: string, reason: string): Promise<ServiceResult<{id: string}>> {
    try {
        const { userId } = await requireAdminRole(TASKS_WRITE_ROLES);
        await enforceRateLimit('force_cancel_task', userId, 5, 60000);
        
        const supabase = supabaseAdmin();

        // 1. Fetch Task and Payment State
        const taskRes = await getTaskDetails(id);
        if (!taskRes.success) return fail(taskRes.error);
        const task = taskRes.data;

        // 2. Resolve Financial Entity (Request or Booking)
        // Find assigned request with held funds
        const { data: request } = await supabase
            .from('task_requests')
            .select('id, payment_status')
            .eq('task_id', id)
            .eq('payment_status', 'held')
            .maybeSingle();

        // Find associated booking with held funds
        const { data: booking } = await supabase
            .from('bookings')
            .select('id, payment_status')
            .eq('task_id', id)
            .eq('payment_status', 'held')
            .maybeSingle();

        // 3. Trigger Financial Reversal if funds are held
        if (request || booking) {
            const entityType = request ? 'task_request' : 'booking';
            const entityId = request ? request.id : booking!.id;

            const { error: rpcError } = await supabase.rpc('process_payment_event_ledger', {
                p_event_type: 'refund',
                p_idempotency_key: `force-cancel-${id}-${crypto.randomUUID()}`,
                p_currency: 'IQD',
                p_related_entity_type: entityType,
                p_related_entity_id: entityId,
                p_meta: { 
                    refund_reason: `Admin forced cancellation: ${reason}`,
                    admin_id: userId 
                }
            });

            if (rpcError) {
                console.error('RPC Reversal Error:', rpcError);
                return fail(`Ledger reversal failed: ${rpcError.message}`);
            }
        }

        // 4. Update Task Status
        const { error: statusError } = await supabase
            .from('tasks')
            .update({ status: 'canceled' })
            .eq('id', id);

        if (statusError) return fail(`Failed to set task status: ${statusError.message}`);

        // 5. Log Significant Audit Event
        await logAuditEvent({
            action: 'admin.tasks.force_cancel',
            actor_user_id: userId,
            related_entity_type: 'task',
            related_entity_id: id,
            meta: { 
                reason, 
                reversed_funds: !!(request || booking),
                reversed_entity: request ? 'task_request' : (booking ? 'booking' : null)
            }
        });

        revalidatePath('/dashboard/tasks');
        revalidatePath(`/dashboard/tasks/${id}`);

        return ok({ id });
    } catch (e: any) {
        console.error('forceCancelTask error:', e);
        return fail(toErrorMessage(e));
    }
}

/**
 * Legacy cancel wrapper for backward compatibility.
 */
export async function cancelTask(id: string, reason: string): Promise<ServiceResult<{id: string}>> {
    return forceCancelTask(id, reason);
}
