import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  TransactionDetailsSchema,
  TransactionListQuerySchema,
  FINANCE_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

type RawJournalLedgerRow = {
  journal_id: string;
  created_at: string;
  event_type: string;
  status: string;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  payer_user_id?: string | null;
  payee_user_id?: string | null;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  initiator_user_id?: string | null;
  meta_masked?: unknown;
  meta_full?: unknown;
  [key: string]: unknown;
};

type ProfileSummary = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

type EntityContext = {
  kind: string;
  id: string;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  payment_status?: string | null;
  price?: number | null;
  created_at?: string | null;
  note?: string | null;
  description?: string | null;
  requirements?: Record<string, unknown> | null;
  client?: ProfileSummary | null;
  provider?: ProfileSummary | null;
  task?: Record<string, unknown> | null;
  timeline?: Record<string, unknown> | null;
};

function normalizeJournalLedgerRow(row: RawJournalLedgerRow): RawJournalLedgerRow {
  return {
    ...row,
    entity_type: row.entity_type ?? row.related_entity_type ?? null,
    entity_id: row.entity_id ?? row.related_entity_id ?? null,
  };
}

function formatProfileFallback(id: string, fallbackLabel: string): ProfileSummary {
  return {
    id,
    full_name: `${fallbackLabel} ${id.slice(0, 8)}`,
    avatar_url: null,
  };
}

async function fetchProfilesByIds(
  supabase: SupabaseClient,
  ids: Array<string | null | undefined>
): Promise<Map<string, ProfileSummary>> {
  const uniqueIds = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  if (uniqueIds.length === 0) return new Map();

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', uniqueIds);

  const map = new Map<string, ProfileSummary>();
  for (const row of data ?? []) {
    const profile = row as { id: string; full_name?: string | null; avatar_url?: string | null };
    map.set(profile.id, {
      id: profile.id,
      full_name: profile.full_name?.trim() || `User ${profile.id.slice(0, 8)}`,
      avatar_url: profile.avatar_url ?? null,
    });
  }

  return map;
}

async function buildBookingContext(
  supabase: SupabaseClient,
  entityId: string
): Promise<EntityContext | null> {
  const { data: booking } = await supabase
    .from('bookings')
    .select(
      'id, task_id, client_id, provider_id, status, payment_status, price, created_at, completed_at, delivered_at, review_expires_at, note, requirements, revision_note'
    )
    .eq('id', entityId)
    .maybeSingle();

  if (!booking) return null;

  const bookingRow = booking as Record<string, unknown>;
  const taskId = typeof bookingRow.task_id === 'string' ? bookingRow.task_id : null;
  const [{ data: task }, profiles] = await Promise.all([
    taskId
      ? supabase
          .from('tasks')
          .select('id, title, status, deadline')
          .eq('id', taskId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    fetchProfilesByIds(supabase, [
      bookingRow.client_id as string | null,
      bookingRow.provider_id as string | null,
    ]),
  ]);

  const clientId = bookingRow.client_id as string | null;
  const providerId = bookingRow.provider_id as string | null;

  return {
    kind: 'booking',
    id: entityId,
    title:
      (task as { title?: string | null } | null)?.title?.trim() ||
      `Booking ${entityId.slice(0, 8)}`,
    subtitle: taskId ? `Task ${taskId.slice(0, 8)}` : 'Service booking',
    status: typeof bookingRow.status === 'string' ? bookingRow.status : null,
    payment_status:
      typeof bookingRow.payment_status === 'string' ? bookingRow.payment_status : null,
    price: typeof bookingRow.price === 'number' ? bookingRow.price : Number(bookingRow.price ?? 0),
    created_at: typeof bookingRow.created_at === 'string' ? bookingRow.created_at : null,
    note:
      (typeof bookingRow.note === 'string' && bookingRow.note.trim()) ||
      (typeof bookingRow.revision_note === 'string' && bookingRow.revision_note.trim()) ||
      null,
    requirements:
      bookingRow.requirements && typeof bookingRow.requirements === 'object'
        ? (bookingRow.requirements as Record<string, unknown>)
        : null,
    client: clientId
      ? (profiles.get(clientId) ?? formatProfileFallback(clientId, 'Client'))
      : null,
    provider: providerId
      ? (profiles.get(providerId) ?? formatProfileFallback(providerId, 'Provider'))
      : null,
    task: task
      ? {
          id: (task as Record<string, unknown>).id,
          title: (task as Record<string, unknown>).title,
          status: (task as Record<string, unknown>).status,
          deadline: (task as Record<string, unknown>).deadline,
        }
      : null,
    timeline: {
      delivered_at: bookingRow.delivered_at ?? null,
      completed_at: bookingRow.completed_at ?? null,
      review_expires_at: bookingRow.review_expires_at ?? null,
    },
  };
}

async function buildTaskRequestContext(
  supabase: SupabaseClient,
  entityId: string
): Promise<EntityContext | null> {
  const { data: request } = await supabase
    .from('task_requests')
    .select(
      'id, task_id, freelancer_id, bidder_id, price, days, duration_days, note, message, status, payment_status, created_at, payment_deadline'
    )
    .eq('id', entityId)
    .maybeSingle();

  if (!request) return null;

  const requestRow = request as Record<string, unknown>;
  const taskId = typeof requestRow.task_id === 'string' ? requestRow.task_id : null;
  const freelancerId =
    (typeof requestRow.freelancer_id === 'string' && requestRow.freelancer_id) ||
    (typeof requestRow.bidder_id === 'string' && requestRow.bidder_id) ||
    null;

  const { data: task } = taskId
    ? await supabase
        .from('tasks')
        .select('id, title, status, budget, deadline, owner_id, assigned_freelancer_id')
        .eq('id', taskId)
        .maybeSingle()
    : { data: null };

  const taskRow = task as Record<string, unknown> | null;
  const clientId =
    taskRow && typeof taskRow.owner_id === 'string' ? (taskRow.owner_id as string) : null;
  const profiles = await fetchProfilesByIds(supabase, [clientId, freelancerId]);

  return {
    kind: 'task_request',
    id: entityId,
    title:
      (typeof taskRow?.title === 'string' && taskRow.title.trim()) ||
      `Task Offer ${entityId.slice(0, 8)}`,
    subtitle: taskId ? `Offer on task ${taskId.slice(0, 8)}` : 'Task request',
    status: typeof requestRow.status === 'string' ? requestRow.status : null,
    payment_status:
      typeof requestRow.payment_status === 'string' ? requestRow.payment_status : null,
    price: typeof requestRow.price === 'number' ? requestRow.price : Number(requestRow.price ?? 0),
    created_at: typeof requestRow.created_at === 'string' ? requestRow.created_at : null,
    note:
      (typeof requestRow.note === 'string' && requestRow.note.trim()) ||
      (typeof requestRow.message === 'string' && requestRow.message.trim()) ||
      null,
    client: clientId
      ? (profiles.get(clientId) ?? formatProfileFallback(clientId, 'Client'))
      : null,
    provider: freelancerId
      ? (profiles.get(freelancerId) ?? formatProfileFallback(freelancerId, 'Freelancer'))
      : null,
    task: taskRow
      ? {
          id: taskRow.id,
          title: taskRow.title,
          status: taskRow.status,
          budget: taskRow.budget,
          deadline: taskRow.deadline,
        }
      : null,
    timeline: {
      payment_deadline: requestRow.payment_deadline ?? null,
      days: requestRow.days ?? requestRow.duration_days ?? null,
    },
  };
}

async function buildTaskContext(
  supabase: SupabaseClient,
  entityId: string
): Promise<EntityContext | null> {
  const { data: task } = await supabase
    .from('tasks')
    .select('id, title, description, status, budget, created_at, deadline, owner_id, assigned_freelancer_id')
    .eq('id', entityId)
    .maybeSingle();

  if (!task) return null;

  const taskRow = task as Record<string, unknown>;
  const clientId = typeof taskRow.owner_id === 'string' ? taskRow.owner_id : null;
  const providerId =
    typeof taskRow.assigned_freelancer_id === 'string' ? taskRow.assigned_freelancer_id : null;
  const profiles = await fetchProfilesByIds(supabase, [clientId, providerId]);

  return {
    kind: 'task',
    id: entityId,
    title:
      (typeof taskRow.title === 'string' && taskRow.title.trim()) ||
      `Task ${entityId.slice(0, 8)}`,
    subtitle: 'Task work item',
    status: typeof taskRow.status === 'string' ? taskRow.status : null,
    price: typeof taskRow.budget === 'number' ? taskRow.budget : Number(taskRow.budget ?? 0),
    created_at: typeof taskRow.created_at === 'string' ? taskRow.created_at : null,
    description:
      typeof taskRow.description === 'string' ? taskRow.description : null,
    client: clientId
      ? (profiles.get(clientId) ?? formatProfileFallback(clientId, 'Client'))
      : null,
    provider: providerId
      ? (profiles.get(providerId) ?? formatProfileFallback(providerId, 'Freelancer'))
      : null,
    timeline: {
      deadline: taskRow.deadline ?? null,
    },
  };
}

async function buildDirectOfferContext(
  supabase: SupabaseClient,
  entityId: string
): Promise<EntityContext | null> {
  const { data: offer } = await supabase
    .from('direct_offers')
    .select(
      'id, task_id, client_id, freelancer_id, title, description, price, days, status, payment_status, created_at'
    )
    .eq('id', entityId)
    .maybeSingle();

  if (!offer) return null;

  const offerRow = offer as Record<string, unknown>;
  const taskId = typeof offerRow.task_id === 'string' ? offerRow.task_id : null;
  const [{ data: task }, profiles] = await Promise.all([
    taskId
      ? supabase.from('tasks').select('id, title, status').eq('id', taskId).maybeSingle()
      : Promise.resolve({ data: null }),
    fetchProfilesByIds(supabase, [
      offerRow.client_id as string | null,
      offerRow.freelancer_id as string | null,
    ]),
  ]);

  const clientId = offerRow.client_id as string | null;
  const freelancerId = offerRow.freelancer_id as string | null;

  return {
    kind: 'direct_offer',
    id: entityId,
    title:
      (typeof offerRow.title === 'string' && offerRow.title.trim()) ||
      `Direct Offer ${entityId.slice(0, 8)}`,
    subtitle: taskId ? `Linked task ${taskId.slice(0, 8)}` : 'Chat offer',
    status: typeof offerRow.status === 'string' ? offerRow.status : null,
    payment_status:
      typeof offerRow.payment_status === 'string' ? offerRow.payment_status : null,
    price: typeof offerRow.price === 'number' ? offerRow.price : Number(offerRow.price ?? 0),
    created_at: typeof offerRow.created_at === 'string' ? offerRow.created_at : null,
    note: typeof offerRow.description === 'string' ? offerRow.description : null,
    client: clientId
      ? (profiles.get(clientId) ?? formatProfileFallback(clientId, 'Client'))
      : null,
    provider: freelancerId
      ? (profiles.get(freelancerId) ?? formatProfileFallback(freelancerId, 'Freelancer'))
      : null,
    task: task
      ? {
          id: (task as Record<string, unknown>).id,
          title: (task as Record<string, unknown>).title,
          status: (task as Record<string, unknown>).status,
        }
      : null,
    timeline: {
      days: offerRow.days ?? null,
    },
  };
}

async function buildEntityContext(
  supabase: SupabaseClient,
  entityType: string | null,
  entityId: string | null
): Promise<EntityContext | null> {
  if (!entityType || !entityId) return null;
  if (entityType === 'booking') return buildBookingContext(supabase, entityId);
  if (entityType === 'task_request') return buildTaskRequestContext(supabase, entityId);
  if (entityType === 'task') return buildTaskContext(supabase, entityId);
  if (entityType === 'direct_offer') return buildDirectOfferContext(supabase, entityId);
  return null;
}

export async function registerTransactionRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/transactions/:journalId', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const { journalId } = request.params as { journalId: string };
    const query = (request.query as { reveal?: string }) || {};
    const validation = TransactionDetailsSchema.safeParse({ journalId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid journalId', validation.error.format()));
    }
    const { data: row, error } = await supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .eq('journal_id', validation.data.journalId)
      .single();
    if (error || !row) return reply.status(404).send(failure('NOT_FOUND', 'Transaction not found'));
    const normalizedRow = normalizeJournalLedgerRow(row as RawJournalLedgerRow);
    const [profiles, entityContext] = await Promise.all([
      fetchProfilesByIds(supabase, [
        normalizedRow.payer_user_id as string | null,
        normalizedRow.payee_user_id as string | null,
        normalizedRow.initiator_user_id as string | null,
      ]),
      buildEntityContext(
        supabase,
        normalizedRow.entity_type as string | null,
        normalizedRow.entity_id as string | null
      ),
    ]);
    const enrichedRow = {
      ...normalizedRow,
      payer:
        normalizedRow.payer_user_id != null
          ? (profiles.get(normalizedRow.payer_user_id) ??
            formatProfileFallback(normalizedRow.payer_user_id, 'Payer'))
          : null,
      payee:
        normalizedRow.payee_user_id != null
          ? (profiles.get(normalizedRow.payee_user_id) ??
            formatProfileFallback(normalizedRow.payee_user_id, 'Payee'))
          : null,
      initiator:
        normalizedRow.initiator_user_id != null
          ? (profiles.get(normalizedRow.initiator_user_id) ??
            formatProfileFallback(normalizedRow.initiator_user_id, 'Actor'))
          : null,
      entity_context: entityContext,
    };
    const user = (request as any).user;
    const reveal = query.reveal === '1';
    if (reveal && user?.id) {
      const { error: auditError } = await supabase.from('audit_logs').insert({
        action: 'admin.finance.tx_view_sensitive_meta',
        actor_user_id: user.id,
        related_entity_type: 'journal_entry',
        related_entity_id: validation.data.journalId,
        meta: { viewed_at: new Date().toISOString() },
      });
      if (auditError) return reply.status(500).send(failure('DATABASE_ERROR', auditError.message));
      return reply.send(success(enrichedRow));
    }
    const { meta_full: _, ...masked } = enrichedRow;
    return reply.send(success(masked));
  });

  fastify.get('/transactions', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const raw = (request.query as Record<string, string | undefined>) || {};
    const parsed = TransactionListQuerySchema.safeParse({
      ...raw,
      limit: raw.limit != null ? parseInt(raw.limit, 10) : 50,
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', parsed.error.format()));
    }
    const { limit = 50, cursor_created_at, cursor_id, event_type, status, payer_user_id, payee_user_id, entity_type, entity_id } = parsed.data;

    let dbQuery = supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .order('journal_id', { ascending: false });

    if (event_type) dbQuery = dbQuery.eq('event_type', event_type);
    if (status) dbQuery = dbQuery.eq('status', status);
    if (payer_user_id) dbQuery = dbQuery.eq('payer_user_id', payer_user_id);
    if (payee_user_id) dbQuery = dbQuery.eq('payee_user_id', payee_user_id);
    if (entity_type) dbQuery = dbQuery.eq('related_entity_type', entity_type);
    if (entity_id) dbQuery = dbQuery.eq('related_entity_id', entity_id);

    if (cursor_created_at && cursor_id) {
      dbQuery = dbQuery.or(
        `created_at.lt.${cursor_created_at},and(created_at.eq.${cursor_created_at},journal_id.lt.${cursor_id})`
      );
    }

    const { data, error } = await dbQuery.limit(limit);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const normalizedData = (data ?? []).map((row) => normalizeJournalLedgerRow(row as RawJournalLedgerRow));

    const nextCursor = normalizedData.length === limit
      ? { created_at: normalizedData[normalizedData.length - 1].created_at, journal_id: normalizedData[normalizedData.length - 1].journal_id }
      : undefined;

    return reply.send(success({ data: normalizedData, nextCursor }));
  });
}
