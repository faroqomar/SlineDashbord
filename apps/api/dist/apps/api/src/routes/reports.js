import { createClient } from '@supabase/supabase-js';
import { ListReportsQuerySchema, TriageReportInputSchema, CloseReportInputSchema, DismissReportInputSchema, EscalateReportInputSchema, CreateReportInputSchema, ReportsTrendResponseSchema, ReportsKpisResponseSchema, REPORTS_READ_ROLES, REPORTS_WRITE_ROLES, failure, success, } from '@sline/shared';
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
function getWindowRange(daysCount, offsetDays = 0) {
    const now = new Date();
    const endExclusive = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1 - offsetDays));
    const start = new Date(endExclusive);
    start.setUTCDate(start.getUTCDate() - daysCount);
    const days = [];
    for (let idx = 0; idx < daysCount; idx += 1) {
        const day = new Date(start);
        day.setUTCDate(start.getUTCDate() + idx);
        days.push(day.toISOString().slice(0, 10));
    }
    return {
        days,
        startIso: start.toISOString(),
        endExclusiveIso: endExclusive.toISOString(),
    };
}
function toDayCounts(days, timestamps) {
    const counts = new Map(days.map((day) => [day, 0]));
    for (const timestamp of timestamps) {
        if (!timestamp)
            continue;
        const day = timestamp.slice(0, 10);
        if (!counts.has(day))
            continue;
        counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    return days.map((day) => counts.get(day) ?? 0);
}
function sumSeries(series) {
    return series.reduce((acc, value) => acc + value, 0);
}
function buildDeltaPercent(current, previous) {
    if (previous <= 0)
        return null;
    return Number((((current - previous) / previous) * 100).toFixed(2));
}
async function searchReporterIds(query) {
    const like = `%${query}%`;
    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .or(`full_name.ilike.${like},username.ilike.${like}`)
        .limit(20);
    if (error)
        return [];
    return (data ?? [])
        .map((row) => (typeof row.id === 'string' ? row.id : ''))
        .filter((id) => id.length > 0);
}
async function fetchReportCreatedTimestamps(range, status) {
    let query = supabase
        .from('reports')
        .select('created_at')
        .gte('created_at', range.startIso)
        .lt('created_at', range.endExclusiveIso);
    if (status)
        query = query.eq('status', status);
    const { data, error } = await query;
    if (error)
        return [];
    return (data ?? [])
        .map((row) => (typeof row.created_at === 'string' ? row.created_at : null))
        .filter((value) => Boolean(value));
}
async function fetchResolvedTimestamps(range) {
    const primary = await supabase
        .from('reports')
        .select('closed_at')
        .eq('status', 'closed')
        .eq('resolution', 'resolved')
        .not('closed_at', 'is', null)
        .gte('closed_at', range.startIso)
        .lt('closed_at', range.endExclusiveIso);
    if (!primary.error) {
        return (primary.data ?? [])
            .map((row) => (typeof row.closed_at === 'string' ? row.closed_at : null))
            .filter((value) => Boolean(value));
    }
    const fallback = await supabase
        .from('report_actions')
        .select('created_at')
        .in('action', ['close', 'close_resolved'])
        .gte('created_at', range.startIso)
        .lt('created_at', range.endExclusiveIso);
    if (fallback.error)
        return [];
    return (fallback.data ?? [])
        .map((row) => (typeof row.created_at === 'string' ? row.created_at : null))
        .filter((value) => Boolean(value));
}
async function fetchEscalatedTimestamps(range) {
    const primary = await supabase
        .from('reports')
        .select('escalated_at')
        .not('escalated_at', 'is', null)
        .gte('escalated_at', range.startIso)
        .lt('escalated_at', range.endExclusiveIso);
    if (!primary.error) {
        return (primary.data ?? [])
            .map((row) => (typeof row.escalated_at === 'string' ? row.escalated_at : null))
            .filter((value) => Boolean(value));
    }
    const fallback = await supabase
        .from('report_actions')
        .select('created_at')
        .eq('action', 'escalate')
        .gte('created_at', range.startIso)
        .lt('created_at', range.endExclusiveIso);
    if (fallback.error)
        return [];
    return (fallback.data ?? [])
        .map((row) => (typeof row.created_at === 'string' ? row.created_at : null))
        .filter((value) => Boolean(value));
}
async function fetchClosedTimestamps(range) {
    const primary = await supabase
        .from('reports')
        .select('closed_at')
        .eq('status', 'closed')
        .not('closed_at', 'is', null)
        .gte('closed_at', range.startIso)
        .lt('closed_at', range.endExclusiveIso);
    if (!primary.error) {
        return (primary.data ?? [])
            .map((row) => (typeof row.closed_at === 'string' ? row.closed_at : null))
            .filter((value) => Boolean(value));
    }
    const fallback = await supabase
        .from('report_actions')
        .select('created_at')
        .eq('status_after', 'closed')
        .gte('created_at', range.startIso)
        .lt('created_at', range.endExclusiveIso);
    if (fallback.error)
        return [];
    return (fallback.data ?? [])
        .map((row) => (typeof row.created_at === 'string' ? row.created_at : null))
        .filter((value) => Boolean(value));
}
async function countReports(status) {
    let query = supabase.from('reports').select('id', { count: 'exact', head: true });
    if (status)
        query = query.eq('status', status);
    const { count, error } = await query;
    if (error)
        return 0;
    return count ?? 0;
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
    if (params.q) {
        const like = `%${params.q}%`;
        const orFilters = [`reason.ilike.${like}`, `category.ilike.${like}`];
        if (isUuid(params.q)) {
            orFilters.push(`id.eq.${params.q}`, `entity_id.eq.${params.q}`, `reporter_user_id.eq.${params.q}`);
        }
        if ((params.reporter_user_ids ?? []).length > 0) {
            orFilters.push(`reporter_user_id.in.(${params.reporter_user_ids.join(',')})`);
        }
        builder = builder.or(orFilters.join(','));
    }
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
    if (params.q) {
        const like = `%${params.q}%`;
        const orFilters = [`reason.ilike.${like}`, `category.ilike.${like}`];
        if (isUuid(params.q)) {
            orFilters.push(`id.eq.${params.q}`, `entity_id.eq.${params.q}`, `reporter_user_id.eq.${params.q}`);
        }
        if ((params.reporter_user_ids ?? []).length > 0) {
            orFilters.push(`reporter_user_id.in.(${params.reporter_user_ids.join(',')})`);
        }
        fallback = fallback.or(orFilters.join(','));
    }
    return fallback;
}
export default async function reportsRoutes(fastify) {
    /**
     * POST /api/v1/reports — create report (RPC writes report + action + audit atomically)
     */
    fastify.post('/', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
        const body = request.body;
        const validation = CreateReportInputSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
        }
        const adminId = request.user?.id;
        if (!adminId)
            return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
        const input = validation.data;
        const { data: createdId, error } = await supabase.rpc('admin_create_report', {
            p_admin_id: adminId,
            p_entity_type: input.entity_type,
            p_entity_id: input.entity_id,
            p_reason: input.reason,
            p_category: input.category ?? null,
            p_severity: input.severity ?? null,
            p_meta: input.meta ?? {},
            p_reporter_user_id: input.reporter_user_id ?? null,
        });
        if (error) {
            const mapped = mapRpcError(error);
            return reply.status(mapped.status).send(mapped.payload);
        }
        if (!createdId || typeof createdId !== 'string') {
            return reply.status(500).send(failure('DATABASE_ERROR', 'Create report returned no id'));
        }
        return reply.status(201).send(success({ id: createdId, status: 'open', resolution: null }));
    });
    /**
     * GET /api/v1/reports — list reports (filter by status, entity_type, severity)
     */
    fastify.get('/', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
        const query = request.query;
        const validation = ListReportsQuerySchema.safeParse(query);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', validation.error.format()));
        }
        const { status, entity_type, severity, assigned_admin_id, assigned_to_me, q, page, limit } = validation.data;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const currentAdminId = request.user?.id;
        const reporterUserIds = q ? await searchReporterIds(q) : [];
        const { data: rows, error, count } = await fetchReportRows({
            status,
            entity_type,
            severity,
            assigned_admin_id: assigned_to_me && currentAdminId ? currentAdminId : assigned_admin_id,
            q: q || undefined,
            reporter_user_ids: reporterUserIds,
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
     * GET /api/v1/reports/trends?window=7d — incoming vs resolved trend points
     */
    fastify.get('/trends', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
        const query = request.query;
        if (query.window && query.window !== '7d') {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Unsupported window'));
        }
        const range = getWindowRange(7, 0);
        const [incomingTimestamps, resolvedTimestamps] = await Promise.all([
            fetchReportCreatedTimestamps(range),
            fetchResolvedTimestamps(range),
        ]);
        const incomingSeries = toDayCounts(range.days, incomingTimestamps);
        const resolvedSeries = toDayCounts(range.days, resolvedTimestamps);
        const points = range.days.map((day, index) => ({
            date: day,
            incoming: incomingSeries[index],
            resolved: resolvedSeries[index],
        }));
        const payload = {
            window: '7d',
            timezone: 'UTC',
            points,
        };
        const parsed = ReportsTrendResponseSchema.safeParse(payload);
        if (!parsed.success) {
            return reply.status(500).send(failure('DATABASE_ERROR', 'Invalid trends payload'));
        }
        return reply.send(success(parsed.data));
    });
    /**
     * GET /api/v1/reports/kpis?window=7d — KPI counts + deltas + sparkline series
     */
    fastify.get('/kpis', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
        const query = request.query;
        if (query.window && query.window !== '7d') {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Unsupported window'));
        }
        const currentRange = getWindowRange(7, 0);
        const previousRange = getWindowRange(7, 7);
        const [totalCount, openCount, escalatedCount, closedCount] = await Promise.all([
            countReports(),
            countReports('open'),
            countReports('escalated'),
            countReports('closed'),
        ]);
        const [totalCurrentTs, totalPreviousTs, openCurrentTs, openPreviousTs, escalatedCurrentTs, escalatedPreviousTs, closedCurrentTs, closedPreviousTs,] = await Promise.all([
            fetchReportCreatedTimestamps(currentRange),
            fetchReportCreatedTimestamps(previousRange),
            fetchReportCreatedTimestamps(currentRange, 'open'),
            fetchReportCreatedTimestamps(previousRange, 'open'),
            fetchEscalatedTimestamps(currentRange),
            fetchEscalatedTimestamps(previousRange),
            fetchClosedTimestamps(currentRange),
            fetchClosedTimestamps(previousRange),
        ]);
        const totalTrend = toDayCounts(currentRange.days, totalCurrentTs);
        const openTrend = toDayCounts(currentRange.days, openCurrentTs);
        const escalatedTrend = toDayCounts(currentRange.days, escalatedCurrentTs);
        const closedTrend = toDayCounts(currentRange.days, closedCurrentTs);
        const totalCurrent = sumSeries(totalTrend);
        const totalPrevious = sumSeries(toDayCounts(previousRange.days, totalPreviousTs));
        const openCurrent = sumSeries(openTrend);
        const openPrevious = sumSeries(toDayCounts(previousRange.days, openPreviousTs));
        const escalatedCurrent = sumSeries(escalatedTrend);
        const escalatedPrevious = sumSeries(toDayCounts(previousRange.days, escalatedPreviousTs));
        const closedCurrent = sumSeries(closedTrend);
        const closedPrevious = sumSeries(toDayCounts(previousRange.days, closedPreviousTs));
        const payload = {
            window: '7d',
            comparison_window: 'previous_7d',
            cards: [
                {
                    key: 'total',
                    count: totalCount,
                    delta_absolute: totalCurrent - totalPrevious,
                    delta_percent: buildDeltaPercent(totalCurrent, totalPrevious),
                    trend: totalTrend,
                },
                {
                    key: 'open',
                    count: openCount,
                    delta_absolute: openCurrent - openPrevious,
                    delta_percent: buildDeltaPercent(openCurrent, openPrevious),
                    trend: openTrend,
                },
                {
                    key: 'escalated',
                    count: escalatedCount,
                    delta_absolute: escalatedCurrent - escalatedPrevious,
                    delta_percent: buildDeltaPercent(escalatedCurrent, escalatedPrevious),
                    trend: escalatedTrend,
                },
                {
                    key: 'closed',
                    count: closedCount,
                    delta_absolute: closedCurrent - closedPrevious,
                    delta_percent: buildDeltaPercent(closedCurrent, closedPrevious),
                    trend: closedTrend,
                },
            ],
        };
        const parsed = ReportsKpisResponseSchema.safeParse(payload);
        if (!parsed.success) {
            return reply.status(500).send(failure('DATABASE_ERROR', 'Invalid KPI payload'));
        }
        return reply.send(success(parsed.data));
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
