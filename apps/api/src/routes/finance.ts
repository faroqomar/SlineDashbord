import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { 
  ApproveWithdrawalSchema, 
  RejectWithdrawalSchema,
  FreezeWalletSchema,
  UnfreezeWalletSchema,
  FINANCE_WRITE_ROLES,
  FINANCE_SUPERADMIN_ROLES,
  failure, 
  success
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function financeRoutes(fastify: FastifyInstance) {
  
  /**
   * Approve Withdrawal (Superadmin only)
   */
  fastify.post('/withdrawals/:requestId/approve', {
    preHandler: [requireAdminRole(FINANCE_SUPERADMIN_ROLES)]
  }, async (request, reply) => {
    const { requestId } = request.params as { requestId: string };
    const body = request.body;

    const validation = ApproveWithdrawalSchema.safeParse({ ...(body as any), requestId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    // RPC writes the single canonical audit row; no API-layer withAudit (avoids double audit)
    const { error } = await supabase.rpc('admin_process_withdrawal', {
      p_request_id: validation.data.requestId,
      p_decision: 'approve',
      p_reason: validation.data.reason,
      p_admin_id: (request as any).user.id,
    });

    if (error) return reply.send(failure('DATABASE_ERROR', error.message));
    return reply.send(success({ requestId: validation.data.requestId }));
  });

  /**
   * Reject Withdrawal
   */
  fastify.post('/withdrawals/:requestId/reject', {
    preHandler: [requireAdminRole(FINANCE_SUPERADMIN_ROLES)]
  }, async (request, reply) => {
    const { requestId } = request.params as { requestId: string };
    const body = request.body;

    const validation = RejectWithdrawalSchema.safeParse({ ...(body as any), requestId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    // RPC writes the single canonical audit row; no API-layer withAudit (avoids double audit)
    const { error } = await supabase.rpc('admin_process_withdrawal', {
      p_request_id: validation.data.requestId,
      p_decision: 'reject',
      p_reason: validation.data.reason,
      p_admin_id: (request as any).user.id,
    });

    if (error) return reply.send(failure('DATABASE_ERROR', error.message));
    return reply.send(success({ requestId: validation.data.requestId }));
  });

  /**
   * Wallet Freeze
   */
  fastify.post('/wallets/:userId/freeze', {
    preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)]
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body;

    const validation = FreezeWalletSchema.safeParse({ ...(body as any), targetUserId: userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    return withAudit(
      request,
      'admin.finance.wallet_freeze',
      'profile',
      userId,
      async () => {
        const { error } = await supabase.rpc('admin_process_wallet_freeze', {
          p_user_id: validation.data.targetUserId,
          p_freeze: true,
          p_reason: validation.data.reason,
          p_admin_id: (request as any).user.id,
        });

        if (error) return failure('DATABASE_ERROR', error.message);
        return success({ userId: validation.data.targetUserId });
      }
    );
  });

  /**
   * Platform Metrics
   */
  fastify.get('/metrics', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const { data, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    return success({
      platform_cash: data?.platform_cash_iqd || 0,
      escrow_held: data?.escrow_held_iqd || 0,
      lifetime_revenue: data?.revenue_iqd || 0,
      pending_withdrawals: 0,
    });
  });

  /**
   * Paginated Transactions
   */
  fastify.get('/transactions', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const query = (request.query as any) || {};
    const limit = query.limit ? parseInt(query.limit) : 50;
    
    let dbQuery = supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .order('journal_id', { ascending: false });

    if (query.event_type) dbQuery = dbQuery.eq('event_type', query.event_type);
    if (query.status) dbQuery = dbQuery.eq('status', query.status);
    if (query.payer_user_id) dbQuery = dbQuery.eq('payer_user_id', query.payer_user_id);
    if (query.payee_user_id) dbQuery = dbQuery.eq('payee_user_id', query.payee_user_id);
    if (query.entity_type) dbQuery = dbQuery.eq('entity_type', query.entity_type);
    if (query.entity_id) dbQuery = dbQuery.eq('entity_id', query.entity_id);
    
    if (query.cursor_created_at && query.cursor_id) {
       dbQuery = dbQuery.or(
        `created_at.lt.${query.cursor_created_at},and(created_at.eq.${query.cursor_created_at},journal_id.lt.${query.cursor_id})`
      );
    }
    
    const { data, error } = await dbQuery.limit(limit);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const nextCursor = data.length === limit
        ? { created_at: data[data.length - 1].created_at, journal_id: data[data.length - 1].journal_id }
        : undefined;

    return success({ data, nextCursor });
  });

  /**
   * Withdrawals
   */
  fastify.get('/withdrawals', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const query = (request.query as any) || {};
    const limit = query.limit ? parseInt(query.limit) : 50;
    
    let dbQuery = supabase
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (query.status) dbQuery = dbQuery.eq('status', query.status);
    if (query.cursor_created_at && query.cursor_id) {
       dbQuery = dbQuery.or(`created_at.lt.${query.cursor_created_at},and(created_at.eq.${query.cursor_created_at},id.lt.${query.cursor_id})`);
    }

    const { data, error } = await dbQuery.limit(limit);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const nextCursor = data.length === limit
      ? { created_at: data[data.length - 1].created_at, id: data[data.length - 1].id }
      : undefined;

    return success({ data, nextCursor });
  });
}
