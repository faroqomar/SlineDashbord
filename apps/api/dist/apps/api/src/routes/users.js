import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { BanUserSchema, UnbanUserSchema, SuspendUserSchema, GetUsersSchema, GetUsersResultSchema, ForceLogoutInputSchema, RevealPiiInputSchema, failure, success, USERS_WRITE_ROLES, UserInvestigationResponseSchema, UserConversationsResponseSchema, EvidencePackExportQuerySchema, } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { writeAuditLog } from '../audit.js';
const uuidSchema = z.string().uuid();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
/** Role matrix PAGE 15: investigation + conversations = support+; evidence-pack = moderator+; reveal = admin, super_admin. */
const INVESTIGATION_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
const EVIDENCE_PACK_ROLES = ['moderator', 'admin', 'super_admin'];
const ACTIVE_STATUS_FILTER = 'account_status.eq.active,and(account_status.is.null,status.eq.active),and(account_status.is.null,status.is.null)';
const INACTIVE_STATUS_FILTER = 'account_status.eq.suspended,account_status.eq.banned,and(account_status.is.null,status.eq.suspended),and(account_status.is.null,status.eq.banned)';
function maskProfile(profile) {
    if (!profile)
        return { id: '' };
    return {
        ...profile,
        email: '[MASKED]',
        phone: profile.phone != null ? '[MASKED]' : undefined,
    };
}
function applyUsersSearchFilter(builder, query) {
    if (!query)
        return builder;
    return builder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
}
function applyUsersRoleFilter(builder, role) {
    if (role === 'all')
        return builder;
    return builder.eq('role', role);
}
function applyUsersStatusTabFilter(builder, statusTab) {
    if (statusTab === 'active')
        return builder.or(ACTIVE_STATUS_FILTER);
    if (statusTab === 'inactive')
        return builder.or(INACTIVE_STATUS_FILTER);
    return builder;
}
export default async function userRoutes(fastify) {
    fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));
    /**
     * List users
     */
    fastify.get('/', async (request, reply) => {
        const rawQuery = request.query ?? {};
        const parsedQuery = GetUsersSchema.safeParse({
            page: Number(rawQuery.page ?? 1),
            query: typeof rawQuery.query === 'string' ? rawQuery.query : '',
            role: typeof rawQuery.role === 'string' ? rawQuery.role : 'all',
            statusTab: typeof rawQuery.statusTab === 'string' ? rawQuery.statusTab : 'all',
        });
        if (!parsedQuery.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', parsedQuery.error.format()));
        }
        const { page, query, role, statusTab } = parsedQuery.data;
        const PAGE_SIZE = 10;
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const monthStartUtc = new Date();
        monthStartUtc.setUTCDate(1);
        monthStartUtc.setUTCHours(0, 0, 0, 0);
        const nextMonthStartUtc = new Date(monthStartUtc);
        nextMonthStartUtc.setUTCMonth(nextMonthStartUtc.getUTCMonth() + 1);
        let listQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact' });
        listQuery = applyUsersSearchFilter(listQuery, query);
        listQuery = applyUsersRoleFilter(listQuery, role);
        listQuery = applyUsersStatusTabFilter(listQuery, statusTab);
        let activeUsersQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .or(ACTIVE_STATUS_FILTER);
        let inactiveUsersQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .or(INACTIVE_STATUS_FILTER);
        let joinedThisMonthQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', monthStartUtc.toISOString())
            .lt('created_at', nextMonthStartUtc.toISOString());
        activeUsersQuery = applyUsersRoleFilter(activeUsersQuery, role);
        inactiveUsersQuery = applyUsersRoleFilter(inactiveUsersQuery, role);
        joinedThisMonthQuery = applyUsersRoleFilter(joinedThisMonthQuery, role);
        let allTabCountQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        allTabCountQuery = applyUsersSearchFilter(allTabCountQuery, query);
        allTabCountQuery = applyUsersRoleFilter(allTabCountQuery, role);
        let activeTabCountQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        activeTabCountQuery = applyUsersSearchFilter(activeTabCountQuery, query);
        activeTabCountQuery = applyUsersRoleFilter(activeTabCountQuery, role);
        activeTabCountQuery = applyUsersStatusTabFilter(activeTabCountQuery, 'active');
        let inactiveTabCountQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        inactiveTabCountQuery = applyUsersSearchFilter(inactiveTabCountQuery, query);
        inactiveTabCountQuery = applyUsersRoleFilter(inactiveTabCountQuery, role);
        inactiveTabCountQuery = applyUsersStatusTabFilter(inactiveTabCountQuery, 'inactive');
        const [listRes, activeUsersRes, inactiveUsersRes, joinedThisMonthRes, allTabCountRes, activeTabCountRes, inactiveTabCountRes] = await Promise.all([
            listQuery.range(from, to).order('created_at', { ascending: false }),
            activeUsersQuery,
            inactiveUsersQuery,
            joinedThisMonthQuery,
            allTabCountQuery,
            activeTabCountQuery,
            inactiveTabCountQuery,
        ]);
        if (listRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', listRes.error.message));
        if (activeUsersRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', activeUsersRes.error.message));
        if (inactiveUsersRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', inactiveUsersRes.error.message));
        if (joinedThisMonthRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', joinedThisMonthRes.error.message));
        if (allTabCountRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', allTabCountRes.error.message));
        if (activeTabCountRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', activeTabCountRes.error.message));
        if (inactiveTabCountRes.error)
            return reply.status(500).send(failure('DATABASE_ERROR', inactiveTabCountRes.error.message));
        const payload = {
            users: listRes.data,
            totalUsers: listRes.count || 0,
            totalPages: Math.ceil((listRes.count || 0) / PAGE_SIZE),
            kpiCounts: {
                activeUsers: activeUsersRes.count || 0,
                inactiveUsers: inactiveUsersRes.count || 0,
                joinedThisMonth: joinedThisMonthRes.count || 0,
            },
            tabCounts: {
                all: allTabCountRes.count || 0,
                active: activeTabCountRes.count || 0,
                inactive: inactiveTabCountRes.count || 0,
            },
        };
        const parsedPayload = GetUsersResultSchema.safeParse(payload);
        if (!parsedPayload.success) {
            fastify.log.warn({ err: parsedPayload.error }, 'Invalid users list payload');
            return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid users payload'));
        }
        return success(parsedPayload.data);
    });
    /**
     * GET /api/v1/users/:userId/investigation (PAGE 15)
     * Full aggregated graph; RBAC support+. Audit: admin.users.investigation_view.
     */
    fastify.get('/:userId/investigation', async (request, reply) => {
        const { userId } = request.params;
        const uuidResult = uuidSchema.safeParse(userId);
        if (!uuidResult.success)
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid user ID'));
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
        const [profileRes, tasksRes, bookingsRes, disputesRes, ledgerRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
            supabase
                .from('tasks')
                .select('id, title, status, task_type, owner_id, assigned_freelancer_id, created_at')
                .or(`owner_id.eq.${userId},assigned_freelancer_id.eq.${userId}`)
                .order('created_at', { ascending: false })
                .limit(100),
            supabase
                .from('bookings')
                .select('id, task_id, client_id, provider_id, status, created_at')
                .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
                .order('created_at', { ascending: false })
                .limit(100),
            supabase.from('disputes').select('id, status, created_at').eq('initiator_id', userId).order('created_at', { ascending: false }).limit(30),
            supabase.from('vw_admin_journal_ledger').select('journal_id, amount_cents, entity_type, entity_id, created_at').eq('entity_id', userId).order('created_at', { ascending: false }).limit(50),
        ]);
        if (profileRes.error) {
            fastify.log.warn({ err: profileRes.error }, 'users investigation: profile lookup failed; returning minimal profile fallback');
        }
        const profile = profileRes.data && typeof profileRes.data === 'object'
            ? profileRes.data
            : { id: userId };
        if (tasksRes.error) {
            fastify.log.warn({ err: tasksRes.error }, 'users investigation: tasks query failed; returning empty array');
        }
        if (bookingsRes.error) {
            fastify.log.warn({ err: bookingsRes.error }, 'users investigation: bookings query failed; returning empty array');
        }
        if (disputesRes.error) {
            fastify.log.warn({ err: disputesRes.error }, 'users investigation: disputes query failed; returning empty array');
        }
        if (ledgerRes.error) {
            fastify.log.warn({ err: ledgerRes.error }, 'users investigation: ledger query failed; returning empty array');
        }
        const tasks = ((tasksRes.error ? [] : tasksRes.data) ?? []).map((t) => ({
            id: t.id,
            title: t.title ?? null,
            status: t.status,
            task_type: t.task_type ?? undefined,
            owner_id: t.owner_id ?? undefined,
            assigned_freelancer_id: t.assigned_freelancer_id ?? null,
            created_at: t.created_at,
        }));
        const bookings = ((bookingsRes.error ? [] : bookingsRes.data) ?? []).map((b) => ({
            id: b.id,
            task_id: b.task_id ?? null,
            client_id: b.client_id ?? undefined,
            provider_id: b.provider_id ?? undefined,
            status: b.status,
            created_at: b.created_at,
        }));
        const disputes = ((disputesRes.error ? [] : disputesRes.data) ?? []).map((d) => ({ id: d.id, status: d.status, created_at: d.created_at }));
        const safeLedgerData = ledgerRes.error ? [] : ledgerRes.data;
        const ledgerRows = Array.isArray(safeLedgerData) ? safeLedgerData : (safeLedgerData ? [safeLedgerData] : []);
        const ledgerActivity = ledgerRows.map((r) => ({
            id: r.journal_id ?? r.id,
            amount_cents: r.amount_cents,
            related_entity_type: r.entity_type,
            related_entity_id: r.entity_id,
            created_at: r.created_at,
        }));
        const { data: convRows } = await supabase.from('messages').select('conversation_id, created_at').eq('sender_id', userId).order('created_at', { ascending: false }).limit(100);
        const convIds = [...new Set((convRows ?? []).map((m) => m.conversation_id).filter(Boolean))].slice(0, 20);
        const conversationsSummary = convIds.map((threadId) => ({
            threadId,
            participantIds: [],
            lastMessageAt: (convRows ?? []).find((m) => m.conversation_id === threadId)?.created_at ?? null,
            messageCount: undefined,
            caseId: null,
        }));
        const payload = {
            profile: maskProfile(profile),
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
        await writeAuditLog(request, 'admin.users.investigation_view', 'profile', userId, { request_id: request.id });
        return reply.send(success(body));
    });
    /**
     * GET /api/v1/users/:userId/conversations (PAGE 15)
     * Masked thread summaries + case references. RBAC support+.
     */
    fastify.get('/:userId/conversations', async (request, reply) => {
        const { userId } = request.params;
        const uuidResult = uuidSchema.safeParse(userId);
        if (!uuidResult.success)
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid user ID'));
        const { data: convRows } = await supabase.from('messages').select('conversation_id, created_at').eq('sender_id', userId).order('created_at', { ascending: false }).limit(100);
        const convIds = [...new Set((convRows ?? []).map((m) => m.conversation_id).filter(Boolean))].slice(0, 50);
        const conversations = convIds.map((threadId) => ({
            threadId,
            participantIds: [],
            lastMessageAt: (convRows ?? []).find((m) => m.conversation_id === threadId)?.created_at ?? null,
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
        const { userId } = request.params;
        const query = EvidencePackExportQuerySchema.safeParse(request.query);
        const format = query.success ? query.data.format : 'json';
        const limit = query.success ? Math.min(query.data.limit, 10_000) : 5000;
        const [profileRes, tasksRes] = await Promise.all([
            supabase.from('profiles').select('id, full_name, account_status, created_at').eq('id', userId).maybeSingle(),
            supabase.from('tasks').select('id, title, status, created_at').or(`owner_id.eq.${userId},assigned_freelancer_id.eq.${userId}`).limit(limit),
        ]);
        if (!profileRes.data)
            return reply.status(404).send(failure('NOT_FOUND', 'User not found'));
        const exportData = {
            userId,
            profile: maskProfile(profileRes.data),
            tasks: tasksRes.data ?? [],
            exportedAt: new Date().toISOString(),
        };
        await writeAuditLog(request, 'admin.export.evidence_pack', 'profile', userId, { request_id: request.id, rowCount: (tasksRes.data ?? []).length + 1 });
        if (format === 'csv') {
            reply.header('Content-Type', 'text/csv');
            const header = 'userId,id,full_name,account_status,created_at\n';
            const profileRow = `${userId},${profileRes.data.id},${(profileRes.data.full_name ?? '').replace(/,/g, ' ')},${profileRes.data.account_status ?? ''},${profileRes.data.created_at ?? ''}\n`;
            const taskRows = (tasksRes.data ?? []).map((t) => `${userId},${t.id},${(t.title ?? '').replace(/,/g, ' ')},${t.status},${t.created_at}\n`).join('');
            return reply.send(header + profileRow + taskRows);
        }
        return reply.send(success(exportData));
    });
    /**
     * POST /api/v1/users/:userId/reveal-pii (PAGE 15)
     * RBAC admin, super_admin only. Inserts admin_pii_access_logs; returns revealed DTO.
     */
    fastify.post('/:userId/reveal-pii', { preHandler: [requireAdminRole(USERS_WRITE_ROLES)] }, async (request, reply) => {
        const { userId } = request.params;
        const body = request.body ?? {};
        const validation = RevealPiiInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Admin user required'));
        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (profileError || !profile)
            return reply.status(404).send(failure('NOT_FOUND', 'User not found'));
        const { error: logError } = await supabase.from('admin_pii_access_logs').insert({
            entity_type: 'profile',
            entity_id: userId,
            field_scope: 'email,phone',
            viewer_admin_id: adminId,
            case_id: validation.data.case_id ?? null,
            reason: validation.data.reason,
        });
        if (logError)
            return reply.status(500).send(failure('DATABASE_ERROR', logError.message));
        await writeAuditLog(request, 'admin.pii.reveal', 'profile', userId, {
            request_id: request.id,
            case_id: validation.data.case_id ?? null,
            reason: validation.data.reason,
        });
        const revealed = {
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
        const { userId } = request.params;
        const [authRes, profileRes] = await Promise.all([
            supabase.auth.admin.getUserById(userId),
            supabase.from('profiles').select('*').eq('id', userId).single()
        ]);
        if (authRes.error)
            return failure('AUTH_ERROR', authRes.error.message);
        if (profileRes.error)
            return failure('DATABASE_ERROR', profileRes.error.message);
        return success({
            auth: authRes.data.user,
            profile: profileRes.data
        });
    });
    /**
     * Ban a user (marketplace user: updates profiles via RPC, audit atomic)
     */
    fastify.post('/:userId/ban', async (request, reply) => {
        const { userId } = request.params;
        const body = request.body;
        const validation = BanUserSchema.safeParse({ ...body, userId });
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const { reason } = validation.data;
        const adminId = request.user?.id;
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
        const { userId } = request.params;
        const validation = UnbanUserSchema.safeParse({ userId });
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const adminId = request.user?.id;
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
        const { userId } = request.params;
        const body = request.body;
        const validation = SuspendUserSchema.safeParse({ ...body, userId });
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const { reason, duration } = validation.data;
        const adminId = request.user?.id;
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
        const { userId } = request.params;
        const body = request.body ?? {};
        const validation = ForceLogoutInputSchema.safeParse({ ...body, userId });
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const role = request.user?.role;
        if (!role || !USERS_WRITE_ROLES.includes(role)) {
            return reply.status(403).send(failure('FORBIDDEN', 'Force logout requires admin or super_admin role'));
        }
        const adminId = request.user?.id;
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
