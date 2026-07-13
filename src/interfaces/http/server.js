const pino = require('pino');
const { createApp } = require('./app');
const { env } = require('../../config/env');

/**
 * Process entry composition: builds the logger, builds the app,
 * binds the port, and wires graceful shutdown for SIGTERM/SIGINT —
 * required for clean pod termination in Kubernetes (avoids dropped
 * in-flight requests during a rolling deploy).
 */
function start() {
  const logger = pino({ level: env.NODE_ENV === 'production' ? 'info' : 'debug' });
  const app = createApp({ logger });

  const server = app.listen(env.PORT, () => {
    logger.info(`taskapi listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

module.exports = { start };
