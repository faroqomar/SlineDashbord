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
 * Writes to canonical audit_logs with: actor_user_id, action, related_entity_type, related_entity_id, meta.
 * Non-atomic: handler runs first, then audit insert. Audit insert failure is logged only; request still succeeds.
 * Prefer DB RPC with atomic audit for new privileged mutations.
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
    // 2. Log to canonical audit_logs (canonical columns only)
    const { error: logError } = await (getSupabase().from('audit_logs') as any).insert({
      actor_user_id: actor?.id ?? null,
      action,
      related_entity_type: entityType,
      related_entity_id: entityId,
      meta: {
        ...(typeof result.data === 'object' && result.data !== null ? (result.data as object) : {}),
        request_id: request.id,
        user_agent: request.headers['user-agent'] ?? undefined,
      },
    });

    if (logError) {
      console.error('Failed to write audit log:', logError);
    }
  }

  return result;
}

/**
 * Write a single audit_logs row (canonical columns only). Use when entity id is known only after the mutation (e.g. create case).
 */
export async function writeAuditLog(
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId: string,
  meta?: Record<string, unknown>
): Promise<void> {
  const actor = (request as any).user;
  await (getSupabase().from('audit_logs') as any).insert({
    actor_user_id: actor?.id ?? null,
    action,
    related_entity_type: entityType,
    related_entity_id: entityId,
    meta: {
      ...(meta ?? {}),
      request_id: request.id,
      user_agent: request.headers['user-agent'] ?? undefined,
    },
  }).then(({ error }: { error: unknown }) => {
    if (error) console.error('Failed to write audit log:', error);
  });
}
