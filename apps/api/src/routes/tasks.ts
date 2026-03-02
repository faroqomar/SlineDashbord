import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';
import { failure as fail, success } from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function tasksRoutes(fastify: FastifyInstance) {
  
  fastify.get('/', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const queryParams = request.query as any;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const status = queryParams.status || 'all';
    const searchQuery = queryParams.query || '';
    
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

    if (status !== 'all') queryBuilder = queryBuilder.eq('status', status);
    if (searchQuery) queryBuilder = queryBuilder.ilike('title', `%${searchQuery}%`);

    const { data: tasks, error, count } = await queryBuilder;
    if (error) return reply.status(500).send(fail('DATABASE_ERROR', error.message));

    if (!tasks || tasks.length === 0) {
      return success({
        tasks: [],
        count: count || 0,
        totalPages: 0,
      });
    }

    // Manual Join for Profiles
    const userIds = new Set<string>();
    tasks.forEach(t => {
      if (t.owner_id) userIds.add(t.owner_id);
      if (t.assigned_freelancer_id) userIds.add(t.assigned_freelancer_id);
    });

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', Array.from(userIds));

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    const tasksWithProfiles = tasks.map(t => ({
      ...t,
      client: profileMap.get(t.owner_id) || { id: t.owner_id, full_name: 'Unknown Client', avatar_url: '' },
      freelancer: t.assigned_freelancer_id ? profileMap.get(t.assigned_freelancer_id) : null
    }));

    return success({
      tasks: tasksWithProfiles,
      count: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    });
  });

  fastify.get('/:id', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`*`)
      .eq('id', id)
      .single();

    if (error || !task) return reply.status(404).send(fail('NOT_FOUND', 'Task not found'));

    // Fetch profiles for client and freelancer
    const userIds = [task.owner_id, task.assigned_freelancer_id].filter(Boolean) as string[];
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
    const { id } = request.params as { id: string };
    const { data, error } = await supabase
      .from('admin_logs')
      .select(`*`)
      .eq('target_resource', 'task')
      .eq('target_id', id)
      .order('created_at', { ascending: false });

    if (error) return reply.status(500).send(fail('DATABASE_ERROR', error.message));

    // Manual Join for Actor Profiles
    const actorIds = Array.from(new Set(data?.map(l => l.actor_id).filter(Boolean)));
    const { data: actors } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', actorIds);

    const actorMap = new Map(actors?.map(a => [a.id, a]) || []);

    const logsWithActors = (data || []).map(l => ({
      ...l,
      actor: actorMap.get(l.actor_id) || { id: l.actor_id, full_name: 'System', avatar_url: '' }
    }));

    return success(logsWithActors);
  });

  fastify.post('/:id/status', { preHandler: [requireAdminRole(['super_admin', 'admin'])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, reason } = request.body as any;

    if (status === 'canceled') {
      return withAudit(request, 'admin.tasks.force_cancel', 'task', id, async () => {
         const { data: requestRec } = await supabase.from('task_requests').select('id').eq('task_id', id).eq('payment_status', 'held').maybeSingle();
         const { data: booking } = await supabase.from('bookings').select('id').eq('task_id', id).eq('payment_status', 'held').maybeSingle();
         if (requestRec || booking) {
            const entityType = requestRec ? 'task_request' : 'booking';
            const entityId = requestRec ? requestRec.id : booking!.id;
            const { error: rpcError } = await supabase.rpc('process_payment_event_ledger', {
                p_event_type: 'refund',
                p_idempotency_key: `force-cancel-${id}-${crypto.randomUUID()}`,
                p_currency: 'IQD',
                p_related_entity_type: entityType,
                p_related_entity_id: entityId,
                p_meta: { refund_reason: `Admin forced cancellation: ${reason}`, admin_id: (request as any).user.id }
            });
            if (rpcError) return fail('DATABASE_ERROR', `Ledger reversal failed: ${rpcError.message}`);
         }
         const { error } = await supabase.from('tasks').update({ status: 'canceled' }).eq('id', id);
         if (error) return fail('DATABASE_ERROR', error.message);
         return success({ id });
      });
    }

    return withAudit(request, `admin.tasks.update_status.${status}`, 'task', id, async () => {
       const { error } = await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
       if (error) return fail('DATABASE_ERROR', error.message);
       return success({ id });
    });
  });
}
