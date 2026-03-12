import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  PlatformFeeSettingsSchema,
  UpdatePlatformFeeSettingsBodySchema,
  FINANCE_READ_ROLES,
  FINANCE_SUPERADMIN_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

const PATCH_RATE_LIMIT_MAX = 5;
const PATCH_RATE_LIMIT_WINDOW_MS = 60_000;
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

export async function registerFeeSettingsRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  /**
   * GET /api/v1/finance/fee-settings — current platform fee (admin/super_admin read).
   */
  fastify.get('/fee-settings', { preHandler: [requireAdminRole(FINANCE_READ_ROLES)] }, async (_request, reply) => {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by')
      .eq('key', 'default')
      .maybeSingle();

    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    if (!data) {
      return reply.status(200).send(
        success({
          fee_rate_default_bps: 1000,
          max_fee_rate_bps: 2000,
          updated_at: new Date().toISOString(),
          updated_by: null,
        })
      );
    }

    const row = {
      fee_rate_default_bps: data.fee_rate_default_bps,
      max_fee_rate_bps: data.max_fee_rate_bps,
      updated_at:
        typeof data.updated_at === 'string' ? data.updated_at : (data.updated_at as Date)?.toISOString?.() ?? '',
      updated_by: data.updated_by ?? null,
    };
    const parsed = PlatformFeeSettingsSchema.safeParse(row);
    if (!parsed.success) {
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid fee settings shape', parsed.error.format()));
    }
    return reply.send(success(parsed.data));
  });

  /**
   * PATCH /api/v1/finance/fee-settings — update platform fee rate (super_admin only); rate limit; audit via RPC.
   */
  fastify.patch('/fee-settings', { preHandler: [requireAdminRole(FINANCE_SUPERADMIN_ROLES)] }, async (request, reply) => {
    const userId = (request as any).user?.id as string | undefined;
    if (!userId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
    }

    if (!checkPatchRateLimit(userId)) {
      return reply.status(429).send(failure('RATE_LIMIT', 'Too many fee updates; try again in a minute'));
    }

    const validation = UpdatePlatformFeeSettingsBodySchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }

    const { fee_rate_default_bps, reason } = validation.data;

    const { error } = await supabase.rpc('admin_update_platform_fee_rate', {
      p_fee_rate_default_bps: fee_rate_default_bps,
      p_reason: reason,
      p_actor_user_id: userId,
    });

    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    return reply.send(success({ ok: true }));
  });
}
