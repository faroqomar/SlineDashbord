import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import {
  BanUserSchema,
  UnbanUserSchema,
  SuspendUserSchema,
  ForceLogoutInputSchema,
  RevealPiiInputSchema,
  failure,
  success,
  USERS_WRITE_ROLES,
  UserInvestigationResponseSchema,
  UserConversationsResponseSchema,
  EvidencePackExportQuerySchema,
  type UserInvestigationResponse,
  type UserDetailRevealed,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { writeAuditLog } from '../audit.js';

const uuidSchema = z.string().uuid();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Role matrix PAGE 15: investigation + conversations = support+; evidence-pack = moderator+; reveal = admin, super_admin. */
const INVESTIGATION_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
const EVIDENCE_PACK_ROLES = ['moderator', 'admin', 'super_admin'];

function maskProfile(profile: Record<string, unknown> | null): Record<string, unknown> {
  if (!profile) return { id: '' };
  return {
    ...profile,
    email: '[MASKED]',
    phone: profile.phone != null ? '[MASKED]' : undefined,
  };
}

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));

  /**
   * List users
   */
  fastify.get('/', async (request, reply) => {
    const { page = '1', query = '', role = 'all' } = request.query as any;
    const PAGE_SIZE = 10;
    const from = (parseInt(page) - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (query) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    if (role !== 'all') {
      queryBuilder = queryBuilder.eq('role', role);
    }

    const { data: profiles, error, count } = await queryBuilder
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) return failure('DATABASE_ERROR', error.message);

    return success({
      users: profiles,
      totalUsers: count || 0,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE)
    });
  });

  /**
   * GET /api/v1/users/:userId/investigation (PAGE 15)
   * Full aggregated graph; RBAC support+. Audit: admin.users.investigation_view.
   */
  fastify.get('/:userId/investigation', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const uuidResult = uuidSchema.safeParse(userId);
    if (!uuidResult.success) return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid user ID'));
    const adminId = (request as any).user?.id;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));

    const [profileRes, tasksRes, bookingsRes, disputesRes, ledgerRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, avatar_url, account_status, moderation_reason, moderated_at, created_at, updated_at').eq('id', userId).maybeSingle(),
      supabase.from('tasks').select('id, title, status, created_at').or(`owner_id.eq.${userId},assigned_freelancer_id.eq.${userId}`).order('created_at', { ascending: false }).limit(30),
      supabase.from('bookings').select('id, status, created_at').or(`client_id.eq.${userId},provider_id.eq.${userId}`).order('created_at', { ascending: false }).limit(30),
      supabase.from('disputes').select('id, status, created_at').eq('initiator_id', userId).order('created_at', { ascending: false }).limit(30),
      supabase.from('vw_admin_journal_ledger').select('journal_id, amount_cents, entity_type, entity_id, created_at').eq('entity_id', userId).order('created_at', { ascending: false }).limit(50),
    ]);

    const profile = profileRes.data;
    if (!profile) return reply.status(404).send(failure('NOT_FOUND', 'User not found'));

    const tasks = (tasksRes.data ?? []).map((t: any) => ({ id: t.id, title: t.title ?? null, status: t.status, created_at: t.created_at }));
    const bookings = (bookingsRes.data ?? []).map((b: any) => ({ id: b.id, status: b.status, created_at: b.created_at }));
    const disputes = (disputesRes.data ?? []).map((d: any) => ({ id: d.id, status: d.status, created_at: d.created_at }));
    const ledgerRows = Array.isArray(ledgerRes.data) ? ledgerRes.data : (ledgerRes.data ? [ledgerRes.data] : []);
    const ledgerActivity = ledgerRows.map((r: any) => ({
      id: r.journal_id ?? r.id,
      amount_cents: r.amount_cents,
      related_entity_type: r.entity_type,
      related_entity_id: r.entity_id,
      created_at: r.created_at,
    }));

    const { data: convRows } = await supabase.from('messages').select('conversation_id, created_at').eq('sender_id', userId).order('created_at', { ascending: false }).limit(100);
    const convIds = [...new Set((convRows ?? []).map((m: any) => m.conversation_id).filter(Boolean))].slice(0, 20);
    const conversationsSummary = convIds.map((threadId: string) => ({
      threadId,
      participantIds: [],
      lastMessageAt: (convRows ?? []).find((m: any) => m.conversation_id === threadId)?.created_at ?? null,
      messageCount: undefined,
      caseId: null,
    }));

    const payload: UserInvestigationResponse = {
      profile: maskProfile(profile) as any,
      tasks,
      offers: [],
      bookings,
      disputes,
      ledgerActivity,
      reportsStub: { count: 0, linkToReports: '/reports' },
      conversationsSummary,
    };
    const parsed = UserInvestigationResponseSchema.safeParse(payload);
    const body = parsed.success ? parsed.data : payload;

    await writeAuditLog(request as any, 'admin.users.investigation_view', 'profile', userId, { request_id: (request as any).id });
    return reply.send(success(body));
  });

  /**
   * GET /api/v1/users/:userId/conversations (PAGE 15)
   * Masked thread summaries + case references. RBAC support+.
   */
  fastify.get('/:userId/conversations', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const uuidResult = uuidSchema.safeParse(userId);
    if (!uuidResult.success) return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid user ID'));
    const { data: convRows } = await supabase.from('messages').select('conversation_id, created_at').eq('sender_id', userId).order('created_at', { ascending: false }).limit(100);
    const convIds = [...new Set((convRows ?? []).map((m: any) => m.conversation_id).filter(Boolean))].slice(0, 50);
    const conversations = convIds.map((threadId: string) => ({
      threadId,
      participantIds: [],
      lastMessageAt: (convRows ?? []).find((m: any) => m.conversation_id === threadId)?.created_at ?? null,
      messageCount: undefined,
      caseId: null,
    }));
    const parsed = UserConversationsResponseSchema.safeParse({ conversations });
    return reply.send(success(parsed.success ? parsed.data : { conversations }));
  });

  /**
   * GET /api/v1/users/:userId/evidence-pack (PAGE 15)
   * RBAC moderator+. Audit: admin.export.evidence_pack. Max 10k rows.
   */
  fastify.get('/:userId/evidence-pack', { preHandler: [requireAdminRole(EVIDENCE_PACK_ROLES)] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const query = EvidencePackExportQuerySchema.safeParse(request.query);
    const format = query.success ? query.data.format : 'json';
    const limit = query.success ? Math.min(query.data.limit, 10_000) : 5000;

    const [profileRes, tasksRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, account_status, created_at').eq('id', userId).maybeSingle(),
      supabase.from('tasks').select('id, title, status, created_at').or(`owner_id.eq.${userId},assigned_freelancer_id.eq.${userId}`).limit(limit),
    ]);
    if (!profileRes.data) return reply.status(404).send(failure('NOT_FOUND', 'User not found'));

    const exportData = {
      userId,
      profile: maskProfile(profileRes.data),
      tasks: tasksRes.data ?? [],
      exportedAt: new Date().toISOString(),
    };
    await writeAuditLog(request as any, 'admin.export.evidence_pack', 'profile', userId, { request_id: (request as any).id, rowCount: (tasksRes.data ?? []).length + 1 });

    if (format === 'csv') {
      reply.header('Content-Type', 'text/csv');
      const header = 'userId,id,full_name,account_status,created_at\n';
      const profileRow = `${userId},${profileRes.data.id},${(profileRes.data.full_name ?? '').replace(/,/g, ' ')},${profileRes.data.account_status ?? ''},${profileRes.data.created_at ?? ''}\n`;
      const taskRows = (tasksRes.data ?? []).map((t: any) => `${userId},${t.id},${(t.title ?? '').replace(/,/g, ' ')},${t.status},${t.created_at}\n`).join('');
      return reply.send(header + profileRow + taskRows);
    }
    return reply.send(success(exportData));
  });

  /**
   * POST /api/v1/users/:userId/reveal-pii (PAGE 15)
   * RBAC admin, super_admin only. Inserts admin_pii_access_logs; returns revealed DTO.
   */
  fastify.post('/:userId/reveal-pii', { preHandler: [requireAdminRole(USERS_WRITE_ROLES)] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = (request.body as Record<string, unknown>) ?? {};
    const validation = RevealPiiInputSchema.safeParse(body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const adminId = (request as any).user?.id;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileError || !profile) return reply.status(404).send(failure('NOT_FOUND', 'User not found'));

    const { error: logError } = await supabase.from('admin_pii_access_logs').insert({
      entity_type: 'profile',
      entity_id: userId,
      field_scope: 'email,phone',
      viewer_admin_id: adminId,
      case_id: validation.data.case_id ?? null,
      reason: validation.data.reason,
    });
    if (logError) return reply.status(500).send(failure('DATABASE_ERROR', logError.message));

    await writeAuditLog(request as any, 'admin.pii.reveal', 'profile', userId, {
      request_id: (request as any).id,
      case_id: validation.data.case_id ?? null,
      reason: validation.data.reason,
    });

    const revealed: UserDetailRevealed = {
      id: profile.id,
      full_name: profile.full_name ?? null,
      avatar_url: profile.avatar_url ?? null,
      account_status: profile.account_status ?? null,
      moderation_reason: profile.moderation_reason ?? null,
      moderated_at: profile.moderated_at ?? null,
      created_at: profile.created_at ?? null,
      updated_at: profile.updated_at ?? null,
      email: profile.email ?? null,
      phone: profile.phone ?? null,
    };
    return reply.send(success(revealed));
  });

  /**
   * Get User Details
   */
  fastify.get('/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const [authRes, profileRes] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ]);

    if (authRes.error) return failure('AUTH_ERROR', authRes.error.message);
    if (profileRes.error) return failure('DATABASE_ERROR', profileRes.error.message);

    return success({
      auth: authRes.data.user,
      profile: profileRes.data
    });
  });

  /**
   * Ban a user (marketplace user: updates profiles via RPC, audit atomic)
   */
  fastify.post('/:userId/ban', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body as Record<string, unknown>;
    const validation = BanUserSchema.safeParse({ ...body, userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { reason } = validation.data;
    const adminId = (request as any).user?.id;
    if (!adminId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    }

    const { error } = await supabase.rpc('admin_set_user_moderation', {
      p_user_id: userId,
      p_status: 'banned',
      p_reason: reason,
      p_admin_id: adminId,
      p_restriction_scope: null,
    });
    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return success({ userId });
  });

  /**
   * Unban a user (marketplace user: sets profile to active via RPC, audit atomic)
   */
  fastify.post('/:userId/unban', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const validation = UnbanUserSchema.safeParse({ userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const adminId = (request as any).user?.id;
    if (!adminId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    }

    const { error } = await supabase.rpc('admin_set_user_moderation', {
      p_user_id: userId,
      p_status: 'active',
      p_reason: null,
      p_admin_id: adminId,
      p_restriction_scope: null,
    });
    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return success({ userId });
  });

  /**
   * Suspend a user (marketplace user: sets profile to suspended via RPC, audit atomic)
   */
  fastify.post('/:userId/suspend', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body as Record<string, unknown>;
    const validation = SuspendUserSchema.safeParse({ ...body, userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { reason, duration } = validation.data;
    const adminId = (request as any).user?.id;
    if (!adminId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    }

    const { error } = await supabase.rpc('admin_set_user_moderation', {
      p_user_id: userId,
      p_status: 'suspended',
      p_reason: reason,
      p_admin_id: adminId,
      p_restriction_scope: null,
    });
    if (error) {
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return success({ userId, duration });
  });

  /**
   * Force logout a user (admin/super_admin only). Sets profiles.force_logout_after; app must enforce re-auth.
   */
  fastify.post('/:userId/force-logout', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = (request.body as Record<string, unknown>) ?? {};
    const validation = ForceLogoutInputSchema.safeParse({ ...body, userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    const role = (request as any).user?.role;
    if (!role || !USERS_WRITE_ROLES.includes(role)) {
      return reply.status(403).send(failure('FORBIDDEN', 'Force logout requires admin or super_admin role'));
    }
    const adminId = (request as any).user?.id;
    if (!adminId) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
    }

    const { error } = await supabase.rpc('admin_force_logout_user', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_reason: validation.data.reason ?? null,
    });
    if (error) {
      if (error.message?.includes('Profile not found') || error.message?.includes('not found')) {
        return reply.status(404).send(failure('NOT_FOUND', error.message));
      }
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return success({ userId });
  });
}
