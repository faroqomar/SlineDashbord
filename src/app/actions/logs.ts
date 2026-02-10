'use server';

import { createAdminClient } from "@/lib/supabase/admin";

export type LogDTO = {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
  actor: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  } | undefined;
};

export async function getSystemLogs(page = 1, actionFilter = 'all', limit = 20, query = '') {
  const supabase = createAdminClient();
  const PAGE_SIZE = limit;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let queryBuilder = supabase
    .from('admin_logs')
    .select(`
      *,
      actor:profiles!admin_logs_actor_id_fkey(id, full_name, email, avatar_url)
    `, { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (actionFilter !== 'all') {
    queryBuilder = queryBuilder.eq('action', actionFilter);
  }

  if (query) {
      queryBuilder = queryBuilder.ilike('target_resource', `%${query}%`);
  }

  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs');
  }

  const logs: LogDTO[] = (data || []).map((log: any) => ({
    id: log.id,
    event_type: log.action, // mapped to event_type
    entity_type: log.target_resource || 'system',
    entity_id: log.target_id,
    metadata: log.details || log.metadata || {}, // mapped to metadata
    created_at: log.created_at,
    actor: log.actor ? {
      id: log.actor.id,
      full_name: log.actor.full_name,
      email: log.actor.email,
      avatar_url: log.actor.avatar_url,
    } : undefined,
  }));

  return {
    logs,
    count: count || 0,
    totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0,
  };
}
export async function getLogsByTarget(targetId: string, limit = 20): Promise<LogDTO[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('admin_logs')
    .select(`
      *,
      actor:profiles!admin_logs_actor_id_fkey(id, full_name, email, avatar_url)
    `)
    .or(`target_id.eq.${targetId},actor_id.eq.${targetId}`) // User could be target (e.g. updated) or actor (e.g. logged in, but actor_id is usually admin_user? No, if we log user actions, actor_id is user. Checking schema/usage...)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching target logs:', error);
    return [];
  }

  return (data || []).map((log: any) => ({
    id: log.id,
    event_type: log.action,
    entity_type: log.target_resource || 'system',
    entity_id: log.target_id,
    metadata: log.details || log.metadata || {},
    created_at: log.created_at,
    actor: log.actor ? {
      id: log.actor.id,
      full_name: log.actor.full_name,
      email: log.actor.email,
      avatar_url: log.actor.avatar_url,
    } : undefined,
  }));
}
