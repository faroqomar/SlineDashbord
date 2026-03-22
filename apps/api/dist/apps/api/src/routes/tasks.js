import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';
import { failure as fail, success, TaskQueueAnalyticsDataSchema } from '@sline/shared';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function tasksRoutes(fastify) {
    const toUtcDateKey = (value) => {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime()))
            return '';
        return parsed.toISOString().slice(0, 10);
    };
    const buildLast7Days = () => {
        const today = new Date();
        const utcTodayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        return Array.from({ length: 7 }).map((_, idx) => {
            const day = new Date(utcTodayStart);
            day.setUTCDate(utcTodayStart.getUTCDate() - (6 - idx));
            return day.toISOString().slice(0, 10);
        });
    };
    const getWindowBounds = (days) => {
        const start = `${days[0]}T00:00:00.000Z`;
        const endAnchor = new Date(`${days[days.length - 1]}T00:00:00.000Z`);
        endAnchor.setUTCDate(endAnchor.getUTCDate() + 1);
        return { start, endExclusive: endAnchor.toISOString() };
    };
    fastify.get('/', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
        const queryParams = request.query;
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const status = queryParams.status || 'all';
        const searchQuery = queryParams.query || '';
        request.log?.debug?.({ page, limit, status, query: searchQuery }, 'GET /tasks list');
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let queryBuilder = supabase
            .from('tasks')
            .select(`
        id,
        title,
        description,
        budget,
        status,
        created_at,
        deadline,
        category,
        owner_id,
        assigned_freelancer_id
      `, { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });
        if (status !== 'all')
            queryBuilder = queryBuilder.eq('status', status);
        if (searchQuery)
            queryBuilder = queryBuilder.ilike('title', `%${searchQuery}%`);
        const { data: tasks, error, count } = await queryBuilder;
        if (error)
            return reply.status(500).send(fail('DATABASE_ERROR', error.message));
        if (!tasks || tasks.length === 0) {
            return success({
                tasks: [],
                count: count || 0,
                totalPages: 0,
            });
        }
        // Manual Join for Profiles
        const userIds = new Set();
        tasks.forEach(t => {
            if (t.owner_id)
                userIds.add(t.owner_id);
            if (t.assigned_freelancer_id)
                userIds.add(t.assigned_freelancer_id);
        });
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', Array.from(userIds));
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const taskIds = tasks.map((t) => t.id);
        const offersCountMap = new Map();
        try {
            const { data: viewRows } = await supabase
                .from('vw_admin_task_offers_count')
                .select('task_id, offers_count')
                .in('task_id', taskIds);
            if (viewRows && Array.isArray(viewRows)) {
                for (const row of viewRows) {
                    const r = row;
                    offersCountMap.set(r.task_id, r.offers_count);
                }
            }
        }
        catch (_) {
            try {
                const { data: requestRows } = await supabase
                    .from('task_requests')
                    .select('task_id')
                    .in('task_id', taskIds)
                    .is('deleted_at', null);
                if (requestRows && Array.isArray(requestRows)) {
                    for (const row of requestRows) {
                        const tid = row.task_id;
                        offersCountMap.set(tid, (offersCountMap.get(tid) ?? 0) + 1);
                    }
                }
            }
            catch (__) {
                request.log?.debug?.('offers count skipped (view/table may not exist)');
            }
        }
        const tasksWithProfiles = tasks.map((t) => ({
            ...t,
            offers_count: offersCountMap.get(t.id),
            client: profileMap.get(t.owner_id) || { id: t.owner_id, full_name: 'Unknown Client', avatar_url: '' },
            freelancer: t.assigned_freelancer_id ? profileMap.get(t.assigned_freelancer_id) : null
        }));
        return success({
            tasks: tasksWithProfiles,
            count: count || 0,
            totalPages: count ? Math.ceil(count / limit) : 0,
        });
    });
    fastify.get('/queue-analytics', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
        const query = request.query;
        const range = query.range ?? '7d';
        if (range !== '7d') {
            return reply.status(400).send(fail('VALIDATION_ERROR', 'range must be 7d'));
        }
        const days = buildLast7Days();
        const { start, endExclusive } = getWindowBounds(days);
        const [{ data: postedRows, error: postedError }, { data: completedRows, error: completedError }] = await Promise.all([
            supabase
                .from('tasks')
                .select('created_at')
                .gte('created_at', start)
                .lt('created_at', endExclusive),
            supabase
                .from('tasks')
                .select('updated_at')
                .eq('status', 'completed')
                .gte('updated_at', start)
                .lt('updated_at', endExclusive),
        ]);
        if (postedError || completedError) {
            const message = postedError?.message || completedError?.message || 'Failed to load queue analytics';
            return reply.status(500).send(fail('DATABASE_ERROR', message));
        }
        const postedByDay = new Map();
        for (const row of postedRows ?? []) {
            const key = row.created_at ? toUtcDateKey(row.created_at) : '';
            if (!key)
                continue;
            postedByDay.set(key, (postedByDay.get(key) ?? 0) + 1);
        }
        const completedByDay = new Map();
        for (const row of completedRows ?? []) {
            const key = row.updated_at ? toUtcDateKey(row.updated_at) : '';
            if (!key)
                continue;
            completedByDay.set(key, (completedByDay.get(key) ?? 0) + 1);
        }
        const analyticsData = {
            range: '7d',
            days: days.map((date) => ({
                date,
                posted_count: postedByDay.get(date) ?? 0,
                completed_count: completedByDay.get(date) ?? 0,
            })),
            totals: {
                posted: Array.from(postedByDay.values()).reduce((sum, count) => sum + count, 0),
                completed: Array.from(completedByDay.values()).reduce((sum, count) => sum + count, 0),
            },
            generated_at: new Date().toISOString(),
        };
        const parsed = TaskQueueAnalyticsDataSchema.safeParse(analyticsData);
        if (!parsed.success) {
            return reply.status(500).send(fail('SCHEMA_VALIDATION_ERROR', 'Invalid queue analytics payload'));
        }
        return success(parsed.data);
    });
    fastify.get('/:id', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
        const { id } = request.params;
        request.log?.debug?.({ taskId: id }, 'GET /tasks/:id detail');
        const { data: task, error } = await supabase
            .from('tasks')
            .select(`*`)
            .eq('id', id)
            .single();
        if (error || !task)
            return reply.status(404).send(fail('NOT_FOUND', 'Task not found'));
        // Fetch profiles for client and freelancer
        const userIds = [task.owner_id, task.assigned_freelancer_id].filter(Boolean);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        return success({
            ...task,
            client: profileMap.get(task.owner_id) || { id: task.owner_id, full_name: 'Unknown Client', avatar_url: '' },
            freelancer: task.assigned_freelancer_id ? profileMap.get(task.assigned_freelancer_id) : null
        });
    });
    fastify.get('/:id/activity', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
        const { id } = request.params;
        const { data, error } = await supabase
            .from('audit_logs')
            .select('id, actor_user_id, action, related_entity_type, related_entity_id, created_at, meta')
            .eq('related_entity_type', 'task')
            .eq('related_entity_id', id)
            .order('created_at', { ascending: false });
        if (error)
            return reply.status(500).send(fail('DATABASE_ERROR', error.message));
        const logs = data ?? [];
        const actorIds = Array.from(new Set(logs.map(l => l.actor_user_id).filter(Boolean)));
        const { data: actors } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', actorIds);
        const actorMap = new Map(actors?.map(a => [a.id, a]) || []);
        const logsWithActors = logs.map(l => ({
            id: l.id,
            actor_user_id: l.actor_user_id,
            actor: l.actor_user_id
                ? (actorMap.get(l.actor_user_id) ?? { id: l.actor_user_id, full_name: 'System', avatar_url: null })
                : undefined,
            action: l.action,
            related_entity_type: l.related_entity_type,
            related_entity_id: l.related_entity_id,
            created_at: typeof l.created_at === 'string' ? l.created_at : l.created_at?.toISOString?.() ?? '',
            meta: l.meta ?? undefined,
        }));
        return success(logsWithActors);
    });
    fastify.post('/:id/status', { preHandler: [requireAdminRole(['super_admin', 'admin'])] }, async (request, reply) => {
        const { id } = request.params;
        const { status, reason } = request.body;
        if (status === 'canceled') {
            return withAudit(request, 'admin.tasks.force_cancel', 'task', id, async () => {
                const { data: requestRec } = await supabase.from('task_requests').select('id').eq('task_id', id).eq('payment_status', 'held').maybeSingle();
                const { data: booking } = await supabase.from('bookings').select('id').eq('task_id', id).eq('payment_status', 'held').maybeSingle();
                if (requestRec || booking) {
                    const entityType = requestRec ? 'task_request' : 'booking';
                    const entityId = requestRec ? requestRec.id : booking.id;
                    const { error: rpcError } = await supabase.rpc('process_payment_event_ledger', {
                        p_event_type: 'refund',
                        p_idempotency_key: `force-cancel-${id}-${crypto.randomUUID()}`,
                        p_currency: 'IQD',
                        p_related_entity_type: entityType,
                        p_related_entity_id: entityId,
                        p_meta: { refund_reason: `Admin forced cancellation: ${reason}`, admin_id: request.user.id }
                    });
                    if (rpcError)
                        return fail('DATABASE_ERROR', `Ledger reversal failed: ${rpcError.message}`);
                }
                const { error } = await supabase.from('tasks').update({ status: 'canceled' }).eq('id', id);
                if (error)
                    return fail('DATABASE_ERROR', error.message);
                return success({ id });
            });
        }
        return withAudit(request, `admin.tasks.update_status.${status}`, 'task', id, async () => {
            const { error } = await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
            if (error)
                return fail('DATABASE_ERROR', error.message);
            return success({ id });
        });
    });
}
