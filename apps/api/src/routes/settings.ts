import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  GetSystemConfigResponseSchema,
  UpdateSystemConfigBodySchema,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const SETTINGS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
const SETTINGS_WRITE_ROLES = ['super_admin'];
const PATCH_RATE_LIMIT_MAX = 5;
const PATCH_RATE_LIMIT_WINDOW_MS = 60_000;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const patchRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkPatchRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = patchRateLimit.get(userId);
  if (!entry) {
    patchRateLimit.set(userId, { count: 1, resetAt: now + PATCH_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now >= entry.resetAt) {
    patchRateLimit.set(userId, { count: 1, resetAt: now + PATCH_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= PATCH_RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

export default async function settingsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/v1/settings/config — list all system config rows (admin roles)
   */
  fastify.get('/config', { preHandler: [requireAdminRole(SETTINGS_READ_ROLES)] }, async (_request, reply) => {
    const { data, error } = await supabase.from('system_config').select('key, value, description, updated_at, updated_by');

    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    const rows = (data ?? []).map((r: { key: string; value: unknown; description?: string; updated_at: string; updated_by?: string }) => ({
      key: r.key,
      value: r.value ?? {},
      description: r.description,
      updated_at: typeof r.updated_at === 'string' ? r.updated_at : new Date(r.updated_at).toISOString(),
      updated_by: r.updated_by,
    }));

    const parsed = GetSystemConfigResponseSchema.safeParse(rows);
    if (!parsed.success) {
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid config shape', parsed.error.format()));
    }
    return reply.send(success(parsed.data));
  });

  /**
   * PATCH /api/v1/settings/config — update one config key (super_admin only); rate limit 5/min per user; audit via RPC.
   */
  fastify.patch('/config', { preHandler: [requireAdminRole(SETTINGS_WRITE_ROLES)] }, async (request, reply) => {
    const userId = (request as any).user?.id as string | undefined;
    if (!userId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
    }

    if (!checkPatchRateLimit(userId)) {
      return reply.status(429).send(failure('RATE_LIMIT', 'Too many config updates; try again in a minute'));
    }

    const validation = UpdateSystemConfigBodySchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }

    const { key, value } = validation.data;

    const { data: rpcResult, error } = await supabase.rpc('admin_update_system_config', {
      p_key: key,
      p_value: value,
      p_actor_user_id: userId,
    });

    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    return reply.send(success({ key: rpcResult ?? key }));
  });
}
