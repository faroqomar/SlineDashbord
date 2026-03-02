import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { 
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

export default async function disputeRoutes(fastify: FastifyInstance) {
  
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

    if (error) return failure('DATABASE_ERROR', error.message);

    return success({
      disputes: (disputes || []).map(d => ({
        ...d,
        amount: d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0
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
