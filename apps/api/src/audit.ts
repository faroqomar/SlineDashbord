import { createClient } from '@supabase/supabase-js';
import { failure, type ServiceResult } from '@sline/shared';
import type { FastifyRequest } from 'fastify';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined');
    }
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}

/**
 * Ensures a mutation and an audit log are performed.
 * Future improvement: Use Supabase RPC or a DB transaction for true atomicity.
 */
export async function withAudit<T>(
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId: string,
  handler: () => Promise<ServiceResult<T>>
): Promise<ServiceResult<T>> {
  const actor = (request as any).user;
  
  // 1. Run the actual handler (mutation)
  const result = await handler();

  if (result.ok) {
    // 2. Log the action if successful
    const { error: logError } = await (getSupabase().from('admin_logs') as any).insert({
      actor_id: actor?.id,
      action: action,
      target_resource: entityType,
      target_id: entityId,
      metadata: {
        ...(result.data as any),
        request_id: request.id,
        user_agent: request.headers['user-agent'],
      },
    });

    if (logError) {
      console.error('Failed to write audit log:', logError);
      // We don't fail the request if just the audit log fails, 
      // but in a strict system, you might want to.
    }
  }

  return result;
}
