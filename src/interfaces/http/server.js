const pino = require('pino');
const { createApp } = require('./app');
const { env } = require('../../config/env');
const { pool } = require('../../infrastructure/database/pool');
const {
  connectRateLimitRedis,
} = require('../../infrastructure/cache/RedisRateLimitStore');

/**
 * Process entry composition: builds the logger, builds the app,
 * binds the port, and wires graceful shutdown for SIGTERM/SIGINT —
 * required for clean pod termination in Kubernetes (avoids dropped
 * in-flight requests during a rolling deploy).
 */
async function start() {
  const logger = pino({ level: env.NODE_ENV === 'production' ? 'info' : 'debug' });

  if (env.NODE_ENV === 'production' && !env.RATE_LIMIT_REDIS_URL) {
    throw new Error('RATE_LIMIT_REDIS_URL is required in production');
  }

  const rateLimitRedis = await connectRateLimitRedis({
    url: env.RATE_LIMIT_REDIS_URL,
    logger,
  });
  const app = createApp({
    logger,
    rateLimitStoreFactory: rateLimitRedis.storeFactory,
  });

  const server = app.listen(env.PORT, () => {
    logger.info(`taskapi listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down gracefully`);
    const forceExit = setTimeout(() => process.exit(1), 10000);
    forceExit.unref();

    server.close(async () => {
      try {
        await Promise.all([
          pool.end(),
          rateLimitRedis.close(),
        ]);
        clearTimeout(forceExit);
        logger.info('HTTP server and dependencies closed');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Graceful shutdown failed');
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

module.exports = { start };
