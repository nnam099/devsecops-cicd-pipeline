const rateLimit = require('express-rate-limit');
const { env } = require('../../../config/env');

/**
 * Global rate limiting — a baseline control against brute-force and
 * credential-stuffing (OWASP API4:2023 Unrestricted Resource
 * Consumption). Applied globally here for simplicity; the auth
 * routes additionally get a stricter limiter (see authRoutes.js)
 * since login/register are higher-value targets for automated abuse.
 */
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
});

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts' } },
});

module.exports = { globalLimiter, authLimiter };
