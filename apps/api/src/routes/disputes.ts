import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { 
  CreateDisputeInputSchema,
  GetDisputesSchema,
  UpdateDisputeStatusSchema,
  DISPUTES_READ_ROLES,
  DISPUTES_WRITE_ROLES,
  failure, 
  success
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORY_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Harassment', keywords: ['harass', 'threat', 'abuse', 'insult'] },
  { label: 'Non-delivery', keywords: ['not deliver', 'did not deliver', 'non delivery', 'no delivery'] },
  { label: 'Quality', keywords: ['quality', 'below standard', 'poor work', 'bad quality'] },
  { label: 'Fraud', keywords: ['fraud', 'scam', 'fake', 'chargeback'] },
  { label: 'Payment', keywords: ['payment', 'refund', 'invoice', 'charge'] },
];

function mapCreateDisputeRpcError(error: { message?: string } | null) {
  const message = error?.message ?? 'Database error';
  const normalized = message.toLowerCase();

  if (normalized.includes('not found')) {
    return { status: 404, payload: failure('NOT_FOUND', message) };
  }
  if (normalized.includes('already exists') || normalized.includes('duplicate key')) {
    return { status: 409, payload: failure('CONFLICT', message) };
  }
  if (normalized.includes('invalid')) {
    return { status: 400, payload: failure('VALIDATION_ERROR', message) };
  }
  return { status: 500, payload: failure('DATABASE_ERROR', message) };
}

function deriveDisputeCategory(reason: unknown): string {
  const normalized = String(reason ?? '').toLowerCase();
  if (!normalized) return 'General';

  const matchedRule = CATEGORY_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return matchedRule?.label ?? 'Service';
}

function deriveDisputeSeverity(status: unknown, createdAt: unknown): 'low' | 'med' | 'high' | 'crit' {
  const normalizedStatus = String(status ?? '').toLowerCase();
  if (normalizedStatus === 'escalated') return 'crit';
  if (normalizedStatus === 'resolved') return 'low';

  const createdMs = Date.parse(String(createdAt ?? ''));
  if (Number.isNaN(createdMs)) return 'med';

  const ageDays = Math.max(0, Math.floor((Date.now() - createdMs) / (24 * 60 * 60 * 1000)));
  if (ageDays >= 14) return 'high';
  if (ageDays >= 7) return 'med';
  return 'low';
}

export default async function disputeRoutes(fastify: FastifyInstance) {
  /**
   * Create Dispute (Admin)
   */
  fastify.post('/', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)]
  }, async (request, reply) => {
    const validation = CreateDisputeInputSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    const adminId = (request as any).user?.id as string | undefined;
    if (!adminId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    }

    const { task_id, complainant_id, defendant_id, reason } = validation.data;
    const { data: createdId, error } = await supabase.rpc('admin_create_dispute', {
      p_admin_id: adminId,
      p_task_id: task_id,
      p_complainant_id: complainant_id,
      p_defendant_id: defendant_id,
      p_reason: reason,
    });

    if (error) {
      const mapped = mapCreateDisputeRpcError(error);
      return reply.status(mapped.status).send(mapped.payload);
    }

    if (!createdId || typeof createdId !== 'string') {
      return reply.status(500).send(failure('DATABASE_ERROR', 'Create dispute returned no id'));
    }

    return reply.status(201).send(success({ id: createdId }));
  });
  
  /**
   * Get Disputes List
   */
  fastify.get('/', {
    preHandler: [requireAdminRole(DISPUTES_READ_ROLES)]
  }, async (request, reply) => {
    const query = request.query as any;
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const status = query.status || 'all';
    const searchQuery = query.query || '';

    const validation = GetDisputesSchema.safeParse({ page, status, limit });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid parameters', validation.error.format()));
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let queryBuilder = supabase
      .from('disputes')
      .select(`
        *,
        task:tasks (
          id,
          title,
          budget,
          budget_cents
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
        defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        )
      `, { count: 'exact' });

    if (status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status);
    }

    if (searchQuery) {
      queryBuilder = queryBuilder.or(`reason.ilike.%${searchQuery}%,id.eq.${searchQuery}`);
    }

    const { data: disputes, error, count } = await queryBuilder
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const rows = disputes || [];
    const disputeIds = rows.map((row: { id: string }) => row.id);
    const commentCountByDispute = new Map<string, number>();

    if (disputeIds.length > 0) {
      const { data: messageRows, error: messagesError } = await supabase
        .from('dispute_messages')
        .select('dispute_id')
        .in('dispute_id', disputeIds);

      if (messagesError) {
        return reply.status(500).send(failure('DATABASE_ERROR', messagesError.message));
      }

      for (const message of messageRows || []) {
        const disputeId = (message as { dispute_id: string }).dispute_id;
        commentCountByDispute.set(disputeId, (commentCountByDispute.get(disputeId) ?? 0) + 1);
      }
    }

    return success({
      disputes: rows.map(d => ({
        ...d,
        amount: d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0,
        category: deriveDisputeCategory(d.reason),
        severity: deriveDisputeSeverity(d.status, d.created_at),
        comments_count: commentCountByDispute.get(d.id) ?? 0,
      })),
      totalDisputes: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    });
  });

  /**
   * Get Dispute Details
   */
  fastify.get('/:id', {
    preHandler: [requireAdminRole(DISPUTES_READ_ROLES)]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data: dispute, error } = await supabase
      .from('disputes')
      .select(`
        *,
        task:tasks (
          id,
          title,
          description,
          budget,
          budget_cents,
          deadline,
          status
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
        defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
        messages:dispute_messages (
          id,
          content,
          created_at,
          is_admin,
          sender:profiles!dispute_messages_sender_id_fkey (
             full_name
          )
        ),
        evidence:dispute_evidence (
          id,
          file_url,
          file_type,
          description,
          created_at,
          uploader:profiles!dispute_evidence_uploader_id_fkey (
             full_name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !dispute) return failure('NOT_FOUND', 'Dispute not found');

    return success({
      ...dispute,
      amount: dispute.task?.budget_cents ? dispute.task.budget_cents / 100 : dispute.task?.budget || 0
    });
  });

  /**
   * Resolve or Dismiss a Dispute
   */
  fastify.post('/:id/resolve', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body;

    const validation = UpdateDisputeStatusSchema.safeParse({ ...(body as any), id });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    const { status, resolution, decision } = validation.data;

    return withAudit(
      request,
      'admin.disputes.resolve',
      'dispute',
      id,
      async () => {
        if (status === 'resolved' && decision) {
          const { error: rpcError } = await supabase.rpc('admin_resolve_dispute', {
            p_dispute_id: id,
            p_decision: decision
          });
          
          if (rpcError) return failure('DATABASE_ERROR', rpcError.message);
          
          await supabase.from('disputes').update({ resolution }).eq('id', id);
        } else {
          const { error } = await supabase
            .from('disputes')
            .update({
              resolution,
              status,
              resolved_at: new Date().toISOString()
            })
            .eq('id', id);
  
          if (error) return failure('DATABASE_ERROR', error.message);
        }

        return success({ id });
      }
    );
  });
}
