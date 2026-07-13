const { Pool } = require('pg');
const { env } = require('../../config/env');

/**
 * Single shared connection pool.
 *
 * Security/reliability notes:
 * - Credentials come exclusively from environment variables (never
 *   hardcoded), sourced from a secrets manager or CI/CD secret store
 *   in real deployments.
 * - `max` bounds pool size to prevent connection-exhaustion DoS against
 *   the database from a single instance.
 * - The DB role used here (PGUSER) should be a least-privilege role
 *   with only CRUD grants on the taskapi schema — never a superuser.
 *   This is provisioned in infra/db/roles.sql (see README).
 */
const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error', err);
});

module.exports = { pool };
