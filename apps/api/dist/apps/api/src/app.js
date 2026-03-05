import './augment-fastify.js';
import Fastify from 'fastify';
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
import chatRoutes from './routes/chat.js';
import casesRoutes from './routes/cases.js';
import dashboardRoutes from './routes/dashboard.js';
import reportsRoutes from './routes/reports.js';
import bookingsRoutes from './routes/bookings.js';
import settingsRoutes from './routes/settings.js';
import searchRoutes from './routes/search.js';
import observabilityRoutes from './routes/observability.js';
import logsRoutes from './routes/logs.js';
export async function buildApp(options = {}) {
    const server = Fastify({ logger: process.env.NODE_ENV === 'test' ? false : true });
    await server.register(cors, {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
        credentials: true,
    });
    await server.register(rateLimit, { max: 100, timeWindow: '1 minute' });
    await server.register(cookie);
    if (options.testUser) {
        server.addHook('preHandler', async (request) => {
            request.user = options.testUser;
        });
    }
    else {
        server.addHook('preHandler', async (request) => {
            const token = extractToken(request);
            if (!token)
                return;
            const result = await verifyToken(token);
            if (result.ok)
                request.user = result.data;
        });
    }
    await server.register(authRoutes, { prefix: '/api/v1/auth' });
    await server.register(userRoutes, { prefix: '/api/v1/users' });
    await server.register(financeRoutes, { prefix: '/api/v1/finance' });
    await server.register(teamRoutes, { prefix: '/api/v1/team' });
    await server.register(disputeRoutes, { prefix: '/api/v1/disputes' });
    await server.register(tasksRoutes, { prefix: '/api/v1/tasks' });
    await server.register(chatRoutes, { prefix: '/api/v1/chat' });
    await server.register(casesRoutes, { prefix: '/api/v1/cases' });
    await server.register(bookingsRoutes, { prefix: '/api/v1/bookings' });
    await server.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
    await server.register(reportsRoutes, { prefix: '/api/v1/reports' });
    await server.register(searchRoutes, { prefix: '/api/v1/search' });
    await server.register(settingsRoutes, { prefix: '/api/v1/settings' });
    await server.register(observabilityRoutes, { prefix: '/api/v1/observability' });
    await server.register(logsRoutes, { prefix: '/api/v1/logs' });
    server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
    return server;
}
