const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pinoHttp = require('pino-http');

const healthRoutes = require('./routes/healthRoutes');
const { buildAuthRoutes } = require('./routes/authRoutes');
const { buildTaskRoutes } = require('./routes/taskRoutes');
const { AuthController } = require('./controllers/AuthController');
const { TaskController } = require('./controllers/TaskController');
const { errorHandler } = require('./middlewares/errorHandler');
const { globalLimiter } = require('./middlewares/rateLimiter');
const { env } = require('../../config/env');
const { buildContainer } = require('../../config/container');

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
function createApp({ logger }) {
  const app = express();
  const { useCases, tokenService } = buildContainer();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));
  app.use(globalLimiter);

  const authController = new AuthController(useCases);
  const taskController = new TaskController(useCases);

  app.use('/', healthRoutes);
  app.use('/api/auth', buildAuthRoutes(authController));
  app.use('/api/tasks', buildTaskRoutes(taskController, tokenService));

  // 404 for unmatched routes
  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  app.use(errorHandler(logger));

  return app;
}

module.exports = { createApp };
