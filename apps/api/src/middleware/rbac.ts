import type { FastifyRequest, FastifyReply } from 'fastify';
import { failure } from '@sline/shared';

export const requireAdminRole = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send(failure('FORBIDDEN', 'Insufficient permissions'));
    }
  };
};
