import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import { verifyToken, extractToken } from './auth.js';
import userRoutes from './routes/users.js';
import financeRoutes from './routes/finance.js';
import teamRoutes from './routes/team.js';
import disputeRoutes from './routes/disputes.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import dashboardRoutes from './routes/dashboard.js';

export type TestUser = { id: string; role: string };

export type BuildAppOptions = {
  /** When set, overrides auth and injects this user on every request (for testing). */
  testUser?: TestUser;
};

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const server = Fastify({ logger: process.env.NODE_ENV === 'test' ? false : true });

  await server.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
    credentials: true,
  });
  await server.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await server.register(cookie);

  if (options.testUser) {
    server.addHook('preHandler', async (request: any) => {
      (request as any).user = options.testUser;
    });
  } else {
    server.addHook('preHandler', async (request: any) => {
      const token = extractToken(request);
      if (!token) return;
      const result = await verifyToken(token);
      if (result.ok) (request as any).user = result.data;
    });
  }

  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(userRoutes, { prefix: '/api/v1/users' });
  await server.register(financeRoutes, { prefix: '/api/v1/finance' });
  await server.register(teamRoutes, { prefix: '/api/v1/team' });
  await server.register(disputeRoutes, { prefix: '/api/v1/disputes' });
  await server.register(tasksRoutes, { prefix: '/api/v1/tasks' });
  await server.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });

  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return server;
}
