import 'dotenv/config';
import { buildApp } from './app.js';

const server = await buildApp();

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3010');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API Server running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
