import { createClient } from '@supabase/supabase-js';
import { ListReportsQuerySchema, TriageReportInputSchema, CloseReportInputSchema, DismissReportInputSchema, EscalateReportInputSchema, REPORTS_READ_ROLES, REPORTS_WRITE_ROLES, failure, success, } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REPORTS_SELECT_V2 = 'id, reporter_user_id, entity_type, entity_id, reason, category, status, severity, resolution, case_id, assigned_admin_id, sla_due_at, created_at, updated_at';
const REPORTS_SELECT_LEGACY = 'id, reporter_user_id, entity_type, entity_id, reason, category, status, created_at, updated_at';
const REPORT_ACTIONS_SELECT_V2 = 'id, report_id, admin_user_id, action, reason, case_id, resolution, status_after, created_at';
const REPORT_ACTIONS_SELECT_LEGACY = 'id, report_id, admin_user_id, action, reason, created_at';
function isUuid(value) {
    return UUID_RE.test(value);
}
function mapRpcError(error) {
    const msg = error?.message ?? 'Database error';
    if (msg.includes('not found'))
        return { status: 404, payload: failure('NOT_FOUND', msg) };
    if (msg.includes('already closed') || msg.includes('closed case') || msg.includes('already attached')) {
        return { status: 409, payload: failure('CONFLICT', msg) };
    }
    if (msg.includes('Invalid'))
        return { status: 400, payload: failure('VALIDATION_ERROR', msg) };
    return { status: 500, payload: failure('DATABASE_ERROR', msg) };
}
async function fetchReporterSummary(reporterId) {
    if (!reporterId)
        return undefined;
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, trust_level')
        .eq('id', reporterId)
        .maybeSingle();
    if (error || !data) {
        return {
            user_id: reporterId,
            full_name: null,
            username: null,
            avatar_url: null,
            trust_level: null,
            valid_reports_count: 0,
            total_reports_count: 0,
        };
    }
    const { count: totalCount } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('reporter_user_id', reporterId);
    return {
        user_id: reporterId,
        full_name: data.full_name ?? null,
        username: data.username ?? null,
        avatar_url: data.avatar_url ?? null,
        trust_level: data.trust_level ?? null,
        total_reports_count: totalCount ?? 0,
    };
}
async function fetchEntitySummary(entityType, entityId) {
    if (!isUuid(entityId)) {
        return {
            entity_type: entityType,
            title: entityType.toUpperCase(),
            subtitle: entityId,
            status: null,
            meta: {},
        };
    }
    if (entityType === 'user') {
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url, account_status, last_active_at')
            .eq('id', entityId)
            .maybeSingle();
        if (data) {
            return {
                entity_type: 'user',
                title: data.full_name ?? data.username ?? `User ${entityId.slice(0, 8)}`,
                subtitle: data.username ? `@${data.username}` : entityId.slice(0, 8),
                status: data.account_status ?? null,
                avatar_url: data.avatar_url ?? null,
                meta: {
                    last_active_at: data.last_active_at ?? null,
                },
            };
        }
    }
    if (entityType === 'chat') {
        const { data } = await supabase
            .from('conversations')
            .select('id, task_id, booking_id, created_at')
            .eq('id', entityId)
            .maybeSingle();
        if (data) {
            return {
                entity_type: 'chat',
                title: 'Conversation',
                subtitle: `Thread ${entityId.slice(0, 8)}`,
                status: null,
                meta: {
                    task_id: data.task_id ?? null,
                    booking_id: data.booking_id ?? null,
                    created_at: data.created_at ?? null,
                },
            };
        }
    }
    if (entityType === 'task') {
        const { data } = await supabase
            .from('tasks')
            .select('id, title, category, status, owner_id, budget')
            .eq('id', entityId)
            .maybeSingle();
        if (data) {
            return {
                entity_type: 'task',
                title: data.title ?? `Task ${entityId.slice(0, 8)}`,
                subtitle: data.category ?? null,
                status: data.status ?? null,
                meta: {
                    owner_id: data.owner_id ?? null,
                    budget: data.budget ?? null,
                },
            };
        }
    }
    if (entityType === 'booking') {
        const { data } = await supabase
            .from('bookings')
            .select('id, status, client_id, freelancer_id, created_at')
            .eq('id', entityId)
            .maybeSingle();
        if (data) {
            return {
                entity_type: 'booking',
                title: `Booking ${entityId.slice(0, 8)}`,
                subtitle: data.client_id && data.freelancer_id
                    ? `${String(data.client_id).slice(0, 8)} → ${String(data.freelancer_id).slice(0, 8)}`
                    : null,
                status: data.status ?? null,
                meta: {
                    client_id: data.client_id ?? null,
                    freelancer_id: data.freelancer_id ?? null,
                    created_at: data.created_at ?? null,
                },
            };
        }
    }
    return {
        entity_type: entityType,
        title: entityType.toUpperCase(),
        subtitle: entityId.slice(0, 8),
        status: null,
        meta: {},
    };
}
async function fetchReportRows(params) {
    let builder = supabase
        .from('reports')
        .select(REPORTS_SELECT_V2, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(params.from, params.to);
    if (params.status)
        builder = builder.eq('status', params.status);
    if (params.entity_type)
        builder = builder.eq('entity_type', params.entity_type);
    if (params.severity)
        builder = builder.eq('severity', params.severity);
    if (params.assigned_admin_id)
        builder = builder.eq('assigned_admin_id', params.assigned_admin_id);
    const v2 = await builder;
    if (!v2.error)
        return v2;
    if (!v2.error.message.includes('severity') && !v2.error.message.includes('assigned_admin_id')) {
        return v2;
    }
    let fallback = supabase
        .from('reports')
        .select(REPORTS_SELECT_LEGACY, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(params.from, params.to);
    if (params.status)
        fallback = fallback.eq('status', params.status);
    if (params.entity_type)
        fallback = fallback.eq('entity_type', params.entity_type);
    return fallback;
}
export default async function reportsRoutes(fastify) {
    /**
     * GET /api/v1/reports — list reports (filter by status, entity_type, severity)
     */
    fastify.get('/', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
        const query = request.query;
        const validation = ListReportsQuerySchema.safeParse(query);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', validation.error.format()));
        }
        const { status, entity_type, severity, assigned_admin_id, assigned_to_me, page, limit } = validation.data;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const currentAdminId = request.user?.id;
        const { data: rows, error, count } = await fetchReportRows({
            status,
            entity_type,
            severity,
            assigned_admin_id: assigned_to_me && currentAdminId ? currentAdminId : assigned_admin_id,
            from,
            to,
        });
        if (error)
            return reply.status(500).send(failure('DATABASE_ERROR', error.message));
        const list = (await Promise.all((rows || []).map(async (r) => ({
            id: r.id,
            reporter_user_id: r.reporter_user_id,
            entity_type: r.entity_type,
            entity_id: r.entity_id,
            reason: r.reason ?? null,
            category: r.category ?? null,
            status: r.status,
            severity: r.severity ?? null,
            resolution: r.resolution ?? null,
            case_id: r.case_id ?? null,
            assigned_admin_id: r.assigned_admin_id ?? null,
            sla_due_at: r.sla_due_at ?? null,
            created_at: r.created_at,
            updated_at: r.updated_at,
            reporter: await fetchReporterSummary(r.reporter_user_id ?? null),
            entity: await fetchEntitySummary(r.entity_type, r.entity_id),
        }))));
        return reply.send(success({ reports: list, total: count ?? 0, page, limit }));
    });
    /**
     * GET /api/v1/reports/:reportId — single report detail + report_actions
     */
    fastify.get('/:reportId', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
        const { reportId } = request.params;
        if (!isUuid(reportId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
        }
        const { data: report, error: reportError } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();
        if (reportError || !report) {
            return reply.status(404).send(failure('NOT_FOUND', 'Report not found'));
        }
        let { data: actions, error: actionsError } = await supabase
            .from('report_actions')
            .select(REPORT_ACTIONS_SELECT_V2)
            .eq('report_id', reportId)
            .order('created_at', { ascending: true });
        let normalizedActions = actions ?? [];
        if (actionsError && actionsError.message.includes('status_after')) {
            const fallback = await supabase
                .from('report_actions')
                .select(REPORT_ACTIONS_SELECT_LEGACY)
                .eq('report_id', reportId)
                .order('created_at', { ascending: true });
            normalizedActions = fallback.data ?? [];
            actionsError = fallback.error;
        }
        else {
            normalizedActions = actions ?? [];
        }
        if (actionsError)
            return reply.status(500).send(failure('DATABASE_ERROR', actionsError.message));
        const reporter = await fetchReporterSummary(report.reporter_user_id ?? null);
        const entity = await fetchEntitySummary(report.entity_type, report.entity_id);
        const timeline = normalizedActions.map((a) => ({
            id: a.id,
            event: `report.${a.action}`,
            actor_user_id: a.admin_user_id ?? null,
            reason: a.reason ?? null,
            created_at: a.created_at,
            meta: {
                case_id: a.case_id ?? null,
                status_after: a.status_after ?? null,
                resolution: a.resolution ?? null,
            },
        }));
        const detail = {
            id: report.id,
            reporter_user_id: report.reporter_user_id,
            entity_type: report.entity_type,
            entity_id: report.entity_id,
            reason: report.reason ?? null,
            category: report.category ?? null,
            status: report.status,
            severity: report.severity ?? null,
            resolution: report.resolution ?? null,
            case_id: report.case_id ?? null,
            assigned_admin_id: report.assigned_admin_id ?? null,
            sla_due_at: report.sla_due_at ?? null,
            reporter,
            entity,
            evidence: Array.isArray(report.meta?.evidence) ? report.meta.evidence : [],
            timeline,
            created_at: report.created_at,
            updated_at: report.updated_at,
            meta: report.meta ?? null,
            actions: normalizedActions.map((a) => ({
                id: a.id,
                report_id: a.report_id,
                admin_user_id: a.admin_user_id,
                action: a.action,
                reason: a.reason ?? null,
                case_id: a.case_id ?? null,
                status_after: a.status_after ?? undefined,
                resolution: a.resolution ?? null,
                created_at: a.created_at,
            })),
        };
        return reply.send(success(detail));
    });
    /**
     * POST /api/v1/reports/:reportId/dismiss — close as dismissed (reason required)
     */
    fastify.post('/:reportId/dismiss', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
        const { reportId } = request.params;
        if (!isUuid(reportId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
        }
        const body = request.body;
        const validation = DismissReportInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
        const { error } = await supabase.rpc('admin_dismiss_report', {
            p_report_id: reportId,
            p_admin_id: adminId,
            p_reason: validation.data.reason,
        });
        if (error) {
            const mapped = mapRpcError(error);
            return reply.status(mapped.status).send(mapped.payload);
        }
        return reply.send(success({ id: reportId, status: 'closed', resolution: 'dismissed' }));
    });
    /**
     * POST /api/v1/reports/:reportId/escalate — escalate to case and return case_id
     */
    fastify.post('/:reportId/escalate', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
        const { reportId } = request.params;
        if (!isUuid(reportId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
        }
        const body = request.body;
        const validation = EscalateReportInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
        const { data: caseId, error } = await supabase.rpc('admin_escalate_report', {
            p_report_id: reportId,
            p_admin_id: adminId,
            p_reason: validation.data.reason,
            p_case_id: validation.data.case_id ?? null,
            p_priority: validation.data.priority ?? 'medium',
            p_assignee_id: validation.data.assignee_id ?? null,
        });
        if (error) {
            const mapped = mapRpcError(error);
            return reply.status(mapped.status).send(mapped.payload);
        }
        return reply.send(success({ id: reportId, case_id: caseId, status: 'escalated' }));
    });
    /**
     * POST /api/v1/reports/:reportId/triage — compatibility endpoint
     */
    fastify.post('/:reportId/triage', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
        const { reportId } = request.params;
        if (!isUuid(reportId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
        }
        const body = request.body;
        const validation = TriageReportInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
        const action = validation.data.action;
        let caseId = null;
        let error = null;
        if (action === 'dismiss') {
            const result = await supabase.rpc('admin_dismiss_report', {
                p_report_id: reportId,
                p_admin_id: adminId,
                p_reason: validation.data.reason,
            });
            error = result.error;
        }
        else if (action === 'escalate') {
            const result = await supabase.rpc('admin_escalate_report', {
                p_report_id: reportId,
                p_admin_id: adminId,
                p_reason: validation.data.reason,
                p_case_id: validation.data.case_id ?? null,
                p_priority: 'medium',
                p_assignee_id: null,
            });
            error = result.error;
            caseId = result.data ?? null;
        }
        else if (action === 'close' || action === 'close_resolved') {
            const result = await supabase.rpc('admin_close_report', {
                p_report_id: reportId,
                p_admin_id: adminId,
                p_reason: validation.data.reason,
                p_resolution: 'resolved',
            });
            error = result.error;
        }
        else {
            const result = await supabase.rpc('admin_triage_report', {
                p_report_id: reportId,
                p_action: validation.data.action,
                p_admin_id: adminId,
                p_reason: validation.data.reason,
            });
            error = result.error;
        }
        if (error) {
            const mapped = mapRpcError(error);
            return reply.status(mapped.status).send(mapped.payload);
        }
        return reply.send(success({ id: reportId, case_id: caseId ?? undefined }));
    });
    /**
     * POST /api/v1/reports/:reportId/close — close report (RPC writes audit atomically)
     */
    fastify.post('/:reportId/close', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
        const { reportId } = request.params;
        if (!isUuid(reportId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
        }
        const body = request.body;
        const validation = CloseReportInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
        const { error } = await supabase.rpc('admin_close_report', {
            p_report_id: reportId,
            p_admin_id: adminId,
            p_reason: validation.data.reason,
            p_resolution: validation.data.resolution ?? 'resolved',
        });
        if (error) {
            const mapped = mapRpcError(error);
            return reply.status(mapped.status).send(mapped.payload);
        }
        return reply.send(success({ id: reportId, status: 'closed', resolution: validation.data.resolution ?? 'resolved' }));
    });
}
