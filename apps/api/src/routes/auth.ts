import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { failure, success, AuthMeResponseSchema } from '@sline/shared';
import { verifyToken, extractToken } from '../auth.js';

const SessionExchangeSchema = z.object({
  access_token: z.string(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  
  /**
   * Exchange Supabase access_token for an HttpOnly session cookie.
   * This provides XSS protection for the API session.
   */
  fastify.post('/session', async (request, reply) => {
    const validation = SessionExchangeSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid token'));
    }

    try {
      const result = await verifyToken(validation.data.access_token);
      
      if (!result.ok) {
        return reply.status(401).send(failure('AUTH_ERROR', 'Invalid or expired token'));
      }

      const payload = result.data;
      
      // Set HttpOnly cookie
      reply.setCookie('sb_session', validation.data.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 hour (align with Supabase JWT expiry)
      });

      return success({ 
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role
        }
      });
    } catch (err: any) {
      return reply.status(401).send(failure('AUTH_ERROR', 'Invalid or expired token'));
    }
  });

  /**
   * Clear the session cookie
   */
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('sb_session', { path: '/' });
    return success({ message: 'Logged out' });
  });

  /**
   * Get current session info from cookie (or injected test user when present).
   */
  fastify.get('/me', async (request, reply) => {
    const injectedUser = (request as any).user;
    if (injectedUser) {
      const response = success({ user: { id: injectedUser.id, email: injectedUser.email, role: injectedUser.role } });
      const parsed = AuthMeResponseSchema.safeParse(response);
      if (!parsed.success) {
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid auth response shape'));
      }
      return reply.send(parsed.data);
    }

    const token = extractToken(request);
    if (!token) {
      return reply.status(401).send(failure('AUTH_ERROR', 'Not authenticated'));
    }

    const result = await verifyToken(token);
    if (!result.ok) {
      return reply.status(401).send(failure('AUTH_ERROR', 'Session expired'));
    }

    const payload = result.data;
    const response = success({
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    });
    const parsed = AuthMeResponseSchema.safeParse(response);
    if (!parsed.success) {
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid auth response shape'));
    }
    return reply.send(parsed.data);
  });
}
