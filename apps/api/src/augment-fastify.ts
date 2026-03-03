/**
 * Augments Fastify so that request.user is typed after auth.
 * Import this once (e.g. in app.ts) so (request as any).user can be replaced with request.user.
 */
import type { AuthUser } from './auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}
