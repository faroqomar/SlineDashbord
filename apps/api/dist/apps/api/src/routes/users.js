import { createClient } from '@supabase/supabase-js';
import { BanUserSchema, UnbanUserSchema, SuspendUserSchema, ForceLogoutInputSchema, failure, success, USERS_WRITE_ROLES, } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function userRoutes(fastify) {
    fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));
    /**
     * List users
     */
    fastify.get('/', async (request, reply) => {
        const { page = '1', query = '', role = 'all' } = request.query;
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
        if (error)
            return failure('DATABASE_ERROR', error.message);
        return success({
            users: profiles,
            totalUsers: count || 0,
            totalPages: Math.ceil((count || 0) / PAGE_SIZE)
        });
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
