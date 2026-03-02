import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { 
  BanUserSchema, 
  UnbanUserSchema, 
  failure, 
  success, 
  USERS_WRITE_ROLES 
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function userRoutes(fastify: FastifyInstance) {
  
  // Register RBAC middleware for all routes in this plugin
  // Note: We use USERS_READ_ROLES for GET routes if we want to be more granular,
  // but for now let's use the hook for the whole plugin and override if needed.
  // Actually, better to be specific per route or use a broader check.
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
   * Ban a user
   */
  fastify.post('/:userId/ban', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body;

    // 1. Validate Input
    const validation = BanUserSchema.safeParse({ ... (body as any), userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    const { reason } = validation.data;

    // 2. Execute with Audit
    return withAudit(
      request,
      'user_ban',
      'user',
      userId,
      async () => {
        // Perform the ban in DB (example: updating admin_users or profiles)
        const { data, error } = await supabase
          .from('admin_users')
          .update({ status: 'banned', metadata: { ban_reason: reason } })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          return failure('DATABASE_ERROR', error.message);
        }

        return success(data);
      }
    );
  });

  /**
   * Unban a user
   */
  fastify.post('/:userId/unban', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const validation = UnbanUserSchema.safeParse({ userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }

    return withAudit(
      request,
      'user_unban',
      'user',
      userId,
      async () => {
        const { data, error } = await supabase
          .from('admin_users')
          .update({ status: 'active' })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          return failure('DATABASE_ERROR', error.message);
        }

        return success(data);
      }
    );
  });
}
