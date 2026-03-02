import 'dotenv/config';
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
import dashboardRoutes from './routes/dashboard.js';
const server = Fastify({
    logger: true,
});
// Register Plugins
await server.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
    credentials: true,
});
await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
});
await server.register(cookie);
// Auth Hook
server.addHook('preHandler', async (request, reply) => {
    const token = extractToken(request);
    if (!token)
        return;
    const result = await verifyToken(token);
    if (result.ok) {
        request.user = result.data;
    }
});
// Register Routes
await server.register(authRoutes, { prefix: '/api/v1/auth' });
await server.register(userRoutes, { prefix: '/api/v1/users' });
await server.register(financeRoutes, { prefix: '/api/v1/finance' });
await server.register(teamRoutes, { prefix: '/api/v1/team' });
await server.register(disputeRoutes, { prefix: '/api/v1/disputes' });
await server.register(tasksRoutes, { prefix: '/api/v1/tasks' });
await server.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
// Health Check
server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3010');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 API Server running on http://localhost:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
