'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface LogListResult {
  logs: any[];
  total: number;
  totalPages: number;
}

export async function getSystemLogs(
  page: number = 1,
  type: string = 'all',
  pageSize: number = 20
): Promise<LogListResult> {
  const supabase = createAdminClient();
  const offset = (page - 1) * pageSize;

  let dbQuery = supabase
    .from('activity_log')
    .select('*, actor:profiles!actor_id(full_name, email, avatar_url)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (type && type !== 'all') {
    dbQuery = dbQuery.eq('event_type', type);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    throw new Error(`Failed to fetch logs: ${error.message}`);
  }

  return {
    logs: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
