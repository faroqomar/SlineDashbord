import { failure } from '@sline/shared';
export const requireAdminRole = (allowedRoles) => {
    return async (request, reply) => {
        const user = request.user;
        if (!user) {
            return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
        }
        if (!allowedRoles.includes(user.role)) {
            return reply.status(403).send(failure('FORBIDDEN', 'Insufficient permissions'));
        }
    };
};
