/* eslint-disable no-console */
/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */
// Deliberate exception: database migrations MUST apply strictly in
// filename order, each one committed before the next begins — running
// them concurrently (the usual reason to avoid await-in-loop) would
// break correctness, not just style. Sequential `for...of` + `await`
// is the correct tool here, not an oversight.
const fs = require('fs');
const path = require('path');
const { pool } = require('./pool');

/**
 * Minimal, dependency-free migration runner for a thesis-scale project.
 * Applies .sql files in migrations/ in lexical order, wrapped in a
 * transaction, and records applied migrations in a tracking table so
 * re-runs are idempotent. A production system at larger scale would
 * use node-pg-migrate or Flyway; this is intentionally small and
 * auditable for reproducibility purposes.
 */
async function migrate() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [file],
      );
      if (rows.length > 0) {
        console.log(`skip (already applied): ${file}`);
        continue;
      }

      // False positive: `file` is enumerated from readdirSync(migrationsDir)
      // above (a fixed, repo-internal directory), never from user/network
      // input. There is no path-traversal vector here.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
