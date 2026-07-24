const rateLimit = require('express-rate-limit');
const { env } = require('../../../config/env');

/**
 * Global rate limiting — a baseline control against brute-force and
 * credential-stuffing (OWASP API4:2023 Unrestricted Resource
 * Consumption). Applied globally here for simplicity; the auth
 * routes additionally get a stricter limiter (see authRoutes.js)
 * since login/register are higher-value targets for automated abuse.
 */
function buildRateLimiters({ storeFactory } = {}) {
  const common = {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    standardHeaders: true,
    legacyHeaders: false,
  };

  const globalLimiter = rateLimit({
    ...common,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    ...(storeFactory ? { store: storeFactory('global') } : {}),
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  });

  const authLimiter = rateLimit({
    ...common,
    max: env.AUTH_RATE_LIMIT_MAX,
    ...(storeFactory ? { store: storeFactory('auth') } : {}),
    message: { error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts' } },
  });

  return { globalLimiter, authLimiter };
}

module.exports = { buildRateLimiters };
