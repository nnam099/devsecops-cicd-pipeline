require('dotenv').config();

/**
 * Centralized, validated environment configuration.
 *
 * Fail-fast principle (Secure by Default): the process refuses to
 * start if required secrets/config are missing or look like unsafe
 * defaults (e.g., a placeholder JWT secret). This turns a class of
 * "insecure by misconfiguration" production incidents into a
 * deployment-time failure instead of a silent runtime vulnerability.
 */
const REQUIRED_VARS = [
  'PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD', 'JWT_SECRET',
];

function assertConfigured() {
  // False positive: `key` iterates over the fixed, hardcoded
  // REQUIRED_VARS whitelist above, never over user-controlled input.
  // Documented here (rather than suppressed globally) as a worked
  // example of a SAST false positive for the thesis's tooling chapter.
  // eslint-disable-next-line security/detect-object-injection
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET === 'REPLACE_WITH_STRONG_RANDOM_SECRET') {
      throw new Error('JWT_SECRET is set to the example placeholder value. Refusing to start in production.');
    }
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET is too short for production use (minimum 32 characters).');
    }
  }
}

assertConfigured();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,

  PGHOST: process.env.PGHOST,
  PGPORT: Number(process.env.PGPORT) || 5432,
  PGDATABASE: process.env.PGDATABASE,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',

  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  // Deliberately stricter default (10/window) than the global limiter,
  // since /api/auth/* is a higher-value target for credential stuffing.
  // Overridable so integration tests (which legitimately make many
  // register/login calls back-to-back) don't trip the same threshold
  // production traffic should trip. Production MUST NOT override this
  // to a high value — see README "Security controls" table.
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,

  CORS_ALLOWED_ORIGINS: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
};

module.exports = { env };
