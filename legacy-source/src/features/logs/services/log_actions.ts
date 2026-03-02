'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { GetSystemLogsSchema, GetLogsByTargetSchema, LOGS_READ_ROLES, LogDTO } from '../models/log.schema';

export async function getSystemLogs(
  page = 1, 
  actionFilter = 'all', 
  limit = 20, 
  query = ''
): Promise<ServiceResult<{ logs: LogDTO[]; count: number; totalPages: number }>> {
  try {
    const parsed = GetSystemLogsSchema.safeParse({ page, actionFilter, limit, query });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(LOGS_READ_ROLES);

    const supabase = createAdminClient();
    const PAGE_SIZE = parsed.data.limit;
    const from = (parsed.data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('audit_logs') // standardizing against audit_logs
      .select(`
        *,
        actor:profiles!actor_user_id(id, full_name, email, avatar_url)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (parsed.data.actionFilter !== 'all') {
      queryBuilder = queryBuilder.eq('action', parsed.data.actionFilter);
    }

    if (parsed.data.query) {
      queryBuilder = queryBuilder.ilike('related_entity_type', `%${parsed.data.query}%`);
    }

    const { data, error, count } = await queryBuilder;

    if (error) return fail('Failed to fetch logs');

    const logs: LogDTO[] = (data || []).map((log: any) => ({
      id: log.id,
      event_type: log.action,
      entity_type: log.related_entity_type || 'system',
      entity_id: log.related_entity_id,
      metadata: log.meta || {},
      created_at: log.created_at,
      actor: log.actor ? {
        id: log.actor.id,
        full_name: log.actor.full_name,
        email: log.actor.email,
        avatar_url: log.actor.avatar_url,
      } : undefined,
    }));

    return ok({
      logs,
      count: count || 0,
      totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0,
    });
  } catch (error) {
    console.error('getSystemLogs error:', error);
    return fail(toErrorMessage(error));
  }
}

export async function getLogsByTarget(
  targetId: string, 
  limit = 20
): Promise<ServiceResult<LogDTO[]>> {
  try {
    const parsed = GetLogsByTargetSchema.safeParse({ targetId, limit });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(LOGS_READ_ROLES);

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        actor:profiles!actor_user_id(id, full_name, email, avatar_url)
      `)
      .or(`related_entity_id.eq.${parsed.data.targetId},actor_user_id.eq.${parsed.data.targetId}`)
      .order('created_at', { ascending: false })
      .limit(parsed.data.limit);

    if (error) return fail('Error fetching target logs');

    return ok((data || []).map((log: any) => ({
      id: log.id,
      event_type: log.action,
      entity_type: log.related_entity_type || 'system',
      entity_id: log.related_entity_id,
      metadata: log.meta || {},
      created_at: log.created_at,
      actor: log.actor ? {
        id: log.actor.id,
        full_name: log.actor.full_name,
        email: log.actor.email,
        avatar_url: log.actor.avatar_url,
      } : undefined,
    })));
  } catch (error) {
    console.error('getLogsByTarget error:', error);
    return fail(toErrorMessage(error));
  }
}
