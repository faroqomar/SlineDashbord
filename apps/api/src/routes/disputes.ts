import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  CreateDisputeInputSchema,
  GetDisputesSchema,
  AdminAcceptDisputeInputSchema,
  AdminCancelDisputeInputSchema,
  AdminResolveDisputeInputSchema,
  AdminResolveDisputeResultSchema,
  DISPUTES_READ_ROLES,
  DISPUTES_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CANONICAL_STATUSES = ['open', 'active', 'resolved', 'canceled'] as const;

const MAX_SEARCH_QUERY_LENGTH = 200;

/** Sanitize list search query: trim, length-limit, escape single quotes for filter safety. */
function sanitizeDisputeSearchQuery(raw: unknown): string {
  const s = String(raw ?? '').trim();
  const limited = s.length > MAX_SEARCH_QUERY_LENGTH ? s.slice(0, MAX_SEARCH_QUERY_LENGTH) : s;
  return limited.replace(/'/g, "''");
}

const CATEGORY_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Harassment', keywords: ['harass', 'threat', 'abuse', 'insult'] },
  { label: 'Non-delivery', keywords: ['not deliver', 'did not deliver', 'non delivery', 'no delivery'] },
  { label: 'Quality', keywords: ['quality', 'below standard', 'poor work', 'bad quality'] },
  { label: 'Fraud', keywords: ['fraud', 'scam', 'fake', 'chargeback'] },
  { label: 'Payment', keywords: ['payment', 'refund', 'invoice', 'charge'] },
];

function mapRpcError(error: { message?: string } | null) {
  const message = error?.message ?? 'Database error';
  const normalized = message.toLowerCase();
  if (normalized.includes('only admin can') || normalized.includes('not authorized') || normalized.includes('forbidden')) {
    return { status: 403, payload: failure('FORBIDDEN', message) };
  }
  if (normalized.includes('not found')) return { status: 404, payload: failure('NOT_FOUND', message) };
  if (normalized.includes('already exists') || normalized.includes('duplicate key')) return { status: 409, payload: failure('CONFLICT', message) };
  if (normalized.includes('must satisfy') || normalized.includes('must be non-negative')) return { status: 400, payload: failure('VALIDATION_ERROR', message) };
  if (normalized.includes('invalid') || normalized.includes('required')) return { status: 400, payload: failure('VALIDATION_ERROR', message) };
  if (normalized.includes('only open') || normalized.includes('only active') || normalized.includes('can be accepted') || normalized.includes('can be canceled') || normalized.includes('can be resolved')) return { status: 400, payload: failure('VALIDATION_ERROR', message) };
  return { status: 500, payload: failure('DATABASE_ERROR', message) };
}

function deriveDisputeCategory(reason: unknown): string {
  const normalized = String(reason ?? '').toLowerCase();
  if (!normalized) return 'General';
  const matchedRule = CATEGORY_RULES.find((rule) => rule.keywords.some((k) => normalized.includes(k)));
  return matchedRule?.label ?? 'Service';
}

function deriveDisputeSeverity(status: unknown, createdAt: unknown): 'low' | 'med' | 'high' | 'crit' {
  const s = String(status ?? '').toLowerCase();
  if (s === 'active') return 'high';
  if (s === 'resolved' || s === 'canceled') return 'low';
  const createdMs = Date.parse(String(createdAt ?? ''));
  if (Number.isNaN(createdMs)) return 'med';
  const ageDays = Math.max(0, Math.floor((Date.now() - createdMs) / (24 * 60 * 60 * 1000)));
  if (ageDays >= 14) return 'high';
  if (ageDays >= 7) return 'med';
  return 'low';
}

export default async function disputeRoutes(fastify: FastifyInstance) {
  /**
   * Create Dispute (Admin) — RPC only
   */
  fastify.post('/', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)],
  }, async (request, reply) => {
    const validation = CreateDisputeInputSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const adminId = (request as any).user?.id as string | undefined;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));

    const { task_id, complainant_id, defendant_id, reason } = validation.data;
    const { data: createdId, error } = await supabase.rpc('admin_create_dispute', {
      p_admin_id: adminId,
      p_task_id: task_id,
      p_complainant_id: complainant_id,
      p_defendant_id: defendant_id,
      p_reason: reason,
    });
    if (error) {
      const mapped = mapRpcError(error);
      return reply.status(mapped.status).send(mapped.payload);
    }
    if (!createdId || typeof createdId !== 'string') {
      return reply.status(500).send(failure('DATABASE_ERROR', 'Create dispute returned no id'));
    }
    return reply.status(201).send(success({ id: createdId }));
  });

  /**
   * Get Disputes List — with tab counts (canonical statuses only)
   */
  fastify.get('/', {
    preHandler: [requireAdminRole(DISPUTES_READ_ROLES)],
  }, async (request, reply) => {
    const query = request.query as any;
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const status = query.status || 'all';
    const searchQuery = sanitizeDisputeSearchQuery(query.query);

    const validation = GetDisputesSchema.safeParse({ page, status, limit });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid parameters', validation.error.format()));
    }
    const validStatus = validation.data.status;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Tab counts (parallel)
    const [openRes, activeRes, resolvedRes, canceledRes] = await Promise.all([
      supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
      supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'canceled'),
    ]);
    const openCount = openRes.count ?? 0;
    const activeCount = activeRes.count ?? 0;
    const resolvedCount = resolvedRes.count ?? 0;
    const canceledCount = canceledRes.count ?? 0;
    const tabCounts = {
      all: openCount + activeCount + resolvedCount + canceledCount,
      open: openCount,
      active: activeCount,
      resolved: resolvedCount,
      canceled: canceledCount,
    };

    let queryBuilder = supabase
      .from('disputes')
      .select(
        `*,
        task:tasks (id, title, budget, budget_cents),
        complainant:profiles!disputes_initiator_id_fkey (id, full_name, email, avatar_url, active_role),
        defendant:profiles!disputes_defendant_id_fkey (id, full_name, email, avatar_url, active_role)`,
        { count: 'exact' }
      );

    if (validStatus !== 'all') {
      queryBuilder = queryBuilder.eq('status', validStatus);
    }
    if (searchQuery) {
      queryBuilder = queryBuilder.or(`reason.ilike.%${searchQuery}%,id.eq.${searchQuery}`);
    }

    const { data: disputes, error, count } = await queryBuilder
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const rows = disputes || [];
    const disputeIds = rows.map((r: { id: string }) => r.id);
    const commentCountByDispute = new Map<string, number>();
    if (disputeIds.length > 0) {
      const { data: messageRows, error: msgErr } = await supabase
        .from('dispute_messages')
        .select('dispute_id')
        .in('dispute_id', disputeIds);
      if (!msgErr && messageRows) {
        for (const m of messageRows) {
          const did = (m as { dispute_id: string }).dispute_id;
          commentCountByDispute.set(did, (commentCountByDispute.get(did) ?? 0) + 1);
        }
      }
    }

    const list = rows.map((d: any) => ({
      ...d,
      amount: d.task?.budget_cents != null ? d.task.budget_cents / 100 : d.task?.budget ?? 0,
      category: deriveDisputeCategory(d.reason),
      severity: deriveDisputeSeverity(d.status, d.created_at),
      comments_count: commentCountByDispute.get(d.id) ?? 0,
    }));

    return reply.send(
      success({
        disputes: list,
        totalDisputes: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
        tabCounts,
      })
    );
  });

  /**
   * Get Dispute Detail — with booking_candidates and action_availability
   */
  fastify.get('/:id', {
    preHandler: [requireAdminRole(DISPUTES_READ_ROLES)],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data: dispute, error } = await supabase
      .from('disputes')
      .select(
        `*,
        task:tasks (id, title, description, budget, budget_cents, deadline, status),
        complainant:profiles!disputes_initiator_id_fkey (id, full_name, email, avatar_url, active_role),
        defendant:profiles!disputes_defendant_id_fkey (id, full_name, email, avatar_url, active_role),
        messages:dispute_messages (id, content, created_at, is_admin, sender:profiles!dispute_messages_sender_id_fkey (full_name)),
        evidence:dispute_evidence (id, file_url, file_type, description, created_at, uploader:profiles!dispute_evidence_uploader_id_fkey (full_name))`
      )
      .eq('id', id)
      .single();

    if (error || !dispute) {
      return reply.status(404).send(failure('NOT_FOUND', 'Dispute not found'));
    }

    const taskId = dispute.task_id ?? undefined;
    let booking_candidates: Array<{ booking_id: string; status: string; client_id?: string; provider_id?: string; amount_cents?: number }> = [];
    let settlement_candidates: Array<{
      target_type: 'booking' | 'task_request' | 'direct_offer';
      target_id: string;
      status: string;
      payment_status?: string;
      client_id?: string | null;
      provider_id?: string | null;
      amount_cents?: number;
      fee_rate_bps?: number;
    }> = [];
    if (taskId) {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, status, payment_status, client_id, provider_id, price, fee_rate_applied_bps')
        .eq('task_id', taskId);
      if (bookings?.length) {
        booking_candidates = bookings.map((b: any) => ({
          booking_id: b.id,
          status: b.status,
          client_id: b.client_id,
          provider_id: b.provider_id,
          amount_cents: b.price != null ? Number(b.price) : undefined,
        }));
        settlement_candidates.push(
          ...bookings.map((b: any) => ({
            target_type: 'booking' as const,
            target_id: b.id,
            status: b.status,
            payment_status: b.payment_status ?? undefined,
            client_id: b.client_id ?? null,
            provider_id: b.provider_id ?? null,
            amount_cents: b.price != null ? Number(b.price) : undefined,
            fee_rate_bps: b.fee_rate_applied_bps != null ? Number(b.fee_rate_applied_bps) : undefined,
          }))
        );
      }

      const { data: taskRequests } = await supabase
        .from('task_requests')
        .select('id, status, payment_status, client_id, freelancer_id, amount, price, fee_rate_applied_bps')
        .eq('task_id', taskId)
        .is('deleted_at', null);
      if (taskRequests?.length) {
        settlement_candidates.push(
          ...taskRequests.map((tr: any) => ({
            target_type: 'task_request' as const,
            target_id: tr.id,
            status: tr.status,
            payment_status: tr.payment_status ?? undefined,
            client_id: tr.client_id ?? null,
            provider_id: tr.freelancer_id ?? null,
            amount_cents: tr.amount != null ? Number(tr.amount) : tr.price != null ? Number(tr.price) : undefined,
            fee_rate_bps: tr.fee_rate_applied_bps != null ? Number(tr.fee_rate_applied_bps) : undefined,
          }))
        );
      }
    }

    if (dispute.direct_offer_id) {
      const { data: directOffer } = await supabase
        .from('direct_offers')
        .select('id, status, payment_status, client_id, freelancer_id, price, fee_rate_applied_bps')
        .eq('id', dispute.direct_offer_id)
        .maybeSingle();
      if (directOffer) {
        settlement_candidates.push({
          target_type: 'direct_offer',
          target_id: directOffer.id,
          status: directOffer.status,
          payment_status: directOffer.payment_status ?? undefined,
          client_id: directOffer.client_id ?? null,
          provider_id: directOffer.freelancer_id ?? null,
          amount_cents: directOffer.price != null ? Number(directOffer.price) : undefined,
          fee_rate_bps: directOffer.fee_rate_applied_bps != null ? Number(directOffer.fee_rate_applied_bps) : undefined,
        });
      }
    }

    const status = String(dispute.status ?? '').toLowerCase();
    const isDirectOfferDispute = Boolean(dispute.direct_offer_id);
    const heldSettlementCandidates = settlement_candidates.filter((candidate) => String(candidate.payment_status ?? '').toLowerCase() === 'held');
    const action_availability = {
      can_accept: status === 'open',
      can_cancel: status === 'open' || status === 'active',
      can_resolve: status === 'active',
      requires_booking_id: status === 'active' && !isDirectOfferDispute && heldSettlementCandidates.some((candidate) => candidate.target_type === 'booking'),
      requires_settlement_target: status === 'active' && !isDirectOfferDispute,
      supports_split_resolution: status === 'active',
    };

    const payload = {
      ...dispute,
      amount: dispute.task?.budget_cents != null ? dispute.task.budget_cents / 100 : dispute.task?.budget ?? 0,
      booking_candidates: booking_candidates.length ? booking_candidates : undefined,
      settlement_candidates: settlement_candidates.length ? settlement_candidates : undefined,
      action_availability,
    };
    return reply.send(success(payload));
  });

  /**
   * Accept dispute (open → active) — RPC only, audit inside RPC
   */
  fastify.post('/:id/accept', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const adminId = (request as any).user?.id as string | undefined;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));

    const validation = AdminAcceptDisputeInputSchema.safeParse({ dispute_id: id });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    const { error } = await supabase.rpc('admin_accept_dispute', {
      p_admin_id: adminId,
      p_dispute_id: id,
    });
    if (error) {
      const mapped = mapRpcError(error);
      return reply.status(mapped.status).send(mapped.payload);
    }
    return reply.send(success({ id }));
  });

  /**
   * Cancel dispute (open|active → canceled) — RPC only
   */
  fastify.post('/:id/cancel', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const adminId = (request as any).user?.id as string | undefined;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));

    const validation = AdminCancelDisputeInputSchema.safeParse({ dispute_id: id, ...(request.body as any) });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { reason } = validation.data;

    const { error } = await supabase.rpc('admin_cancel_dispute', {
      p_admin_id: adminId,
      p_dispute_id: id,
      p_reason: reason,
    });
    if (error) {
      const mapped = mapRpcError(error);
      return reply.status(mapped.status).send(mapped.payload);
    }
    return reply.send(success({ id }));
  });

  /**
   * Resolve dispute (active → resolved) — RPC only; optional outcome and booking_id
   */
  fastify.post('/:id/resolve', {
    preHandler: [requireAdminRole(DISPUTES_WRITE_ROLES)],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const adminId = (request as any).user?.id as string | undefined;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    const idempotencyKey = (request.headers['idempotency-key'] as string | undefined)?.trim();
    if (!idempotencyKey) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Idempotency-Key header required'));
    }

    const body = request.body as any;
    const validation = AdminResolveDisputeInputSchema.safeParse({
      dispute_id: id,
      reason: body.reason ?? body.resolution ?? '',
      outcome: body.outcome ?? body.decision,
      booking_id: body.booking_id,
      task_request_id: body.task_request_id,
      client_refund_amount: body.client_refund_amount,
      freelancer_payout_amount: body.freelancer_payout_amount,
    });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { reason, outcome, booking_id, task_request_id, client_refund_amount, freelancer_payout_amount } = validation.data;

    const { data, error } = await supabase.rpc('admin_resolve_dispute_settlement', {
      p_admin_id: adminId,
      p_dispute_id: id,
      p_reason: reason,
      p_outcome: outcome,
      p_booking_id: booking_id ?? null,
      p_task_request_id: task_request_id ?? null,
      p_client_refund_amount: client_refund_amount ?? null,
      p_freelancer_payout_amount: freelancer_payout_amount ?? null,
      p_idempotency_key: idempotencyKey,
    });
    if (error) {
      const mapped = mapRpcError(error);
      return reply.status(mapped.status).send(mapped.payload);
    }
    const parsed = AdminResolveDisputeResultSchema.safeParse(data);
    if (!parsed.success) {
      return reply.status(500).send(failure('DATABASE_ERROR', 'Resolve dispute returned invalid settlement payload', parsed.error.format()));
    }
    return reply.send(success(parsed.data));
  });
}
