const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pinoHttp = require('pino-http');

const { buildHealthRoutes } = require('./routes/healthRoutes');
const { buildAuthRoutes } = require('./routes/authRoutes');
const { buildTaskRoutes } = require('./routes/taskRoutes');
const { AuthController } = require('./controllers/AuthController');
const { TaskController } = require('./controllers/TaskController');
const { errorHandler } = require('./middlewares/errorHandler');
const { buildRateLimiters } = require('./middlewares/rateLimiter');
const { env } = require('../../config/env');
const { buildContainer } = require('../../config/container');
const {
  metricsHandler,
  metricsMiddleware,
} = require('../../infrastructure/observability/metrics');

/**
 * Express application factory. Kept separate from server.js (which
 * owns process lifecycle/listen()) so the app can be imported directly
 * into Supertest integration tests without binding a real port —
 * important for fast, parallelizable CI test runs.
 *
 * Secure-by-default HTTP hardening applied here:
 * - helmet(): sets a broad set of security headers (X-Content-Type-Options,
 *   X-Frame-Options, Strict-Transport-Security when behind TLS, and a
 *   restrictive default Content-Security-Policy) — OWASP Secure Headers
 *   Project baseline.
 * - cors(): explicit allow-list from CORS_ALLOWED_ORIGINS, not a
 *   wildcard `*`, since this API uses Bearer tokens read from
 *   Authorization headers (credentials-adjacent) rather than cookies.
 * - express.json({ limit }): bounds request body size to mitigate
 *   large-payload DoS.
 * - Global rate limiter applied before routing.
 */
function createApp({
  logger,
  container = buildContainer(),
  rateLimitStoreFactory,
}) {
  const app = express();
  const {
    healthCheck, useCases, tokenService,
  } = container;
  const { globalLimiter, authLimiter } = buildRateLimiters({
    storeFactory: rateLimitStoreFactory,
  });

  app.disable('x-powered-by');
  if (env.TRUST_PROXY_HOPS > 0) {
    app.set('trust proxy', env.TRUST_PROXY_HOPS);
  }
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(pinoHttp({
    logger,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        "res.headers['set-cookie']",
        'req.body.password',
      ],
      censor: '[REDACTED]',
    },
    autoLogging: {
      ignore: (req) => ['/health', '/livez', '/readyz'].includes(req.url),
    },
  }));
  app.use(metricsMiddleware);
  if (env.METRICS_ENABLED) {
    app.get('/metrics', metricsHandler);
  }
  app.use(globalLimiter);

  const authController = new AuthController(useCases);
  const taskController = new TaskController(useCases);

  app.use('/', buildHealthRoutes(healthCheck));
  app.use('/api/auth', buildAuthRoutes(authController, authLimiter));
  app.use('/api/tasks', buildTaskRoutes(taskController, tokenService));

  // 404 for unmatched routes
  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  app.use(errorHandler(logger));

  return app;
}

module.exports = { createApp };
