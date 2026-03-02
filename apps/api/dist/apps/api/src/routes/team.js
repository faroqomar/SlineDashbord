import { createClient } from '@supabase/supabase-js';
import { InviteMemberSchema, TEAM_WRITE_ROLES, failure, success } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit } from '../audit.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function teamRoutes(fastify) {
    fastify.addHook('preHandler', requireAdminRole(TEAM_WRITE_ROLES));
    /**
     * Invite a new admin member
     */
    fastify.post('/invite', async (request, reply) => {
        const body = request.body;
        const validation = InviteMemberSchema.safeParse(body);
        if (!validation.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const { email, role, fullName } = validation.data;
        // We can't use withAudit easily if we need the new ID first, 
        // but we can wrap the whole process.
        const actor = request.user;
        try {
            // 1. Invite via Auth Admin
            const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);
            if (authError)
                return reply.status(400).send(failure('AUTH_ERROR', authError.message));
            const newUserId = authData.user.id;
            // 2. Add to admin_users and profiles
            const { error: adminError } = await supabase.from('admin_users').insert({
                id: newUserId,
                email,
                role,
                created_at: new Date().toISOString()
            });
            if (adminError)
                return reply.status(500).send(failure('DATABASE_ERROR', 'Failed to assign admin role'));
            await supabase.from('profiles').upsert({
                id: newUserId,
                email,
                full_name: fullName,
                roles: [role.toLowerCase()],
                status: 'Invited'
            });
            // 3. Manual Audit Log — canonical columns only (actor_user_id, action, related_entity_type, related_entity_id, meta)
            await supabase.from('audit_logs').insert({
                actor_user_id: actor.id,
                action: 'admin.team.invite',
                related_entity_type: 'admin_user',
                related_entity_id: newUserId,
                meta: { email, role, request_id: request.id },
            });
            return success({ id: newUserId });
        }
        catch (err) {
            return reply.status(500).send(failure('INTERNAL_ERROR', err.message));
        }
    });
    /**
     * Remove an admin member
     */
    fastify.delete('/:userId', async (request, reply) => {
        const { userId } = request.params;
        return withAudit(request, 'admin.team.remove_member', 'admin_user', userId, async () => {
            const { error: dbError } = await supabase.from('admin_users').delete().eq('id', userId);
            if (dbError)
                return failure('DATABASE_ERROR', 'Failed to remove admin access');
            await supabase.auth.admin.deleteUser(userId);
            return success({ id: userId });
        });
    });
}
