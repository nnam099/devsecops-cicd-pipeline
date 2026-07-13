const { UserRepository } = require('../../../application/ports/UserRepository');
const { pool } = require('../pool');

/**
 * PostgreSQL implementation of the UserRepository port.
 *
 * SECURITY-CRITICAL: every query uses parameterized placeholders
 * ($1, $2, ...). String concatenation/template literals to build SQL
 * are NEVER used here — that is the #1 SQL Injection prevention
 * control (OWASP Top 10 A03:2021) and the exact pattern SAST tools
 * (Semgrep `javascript.lang.security.audit.sqli`) are configured to
 * verify is present throughout this file in the CI pipeline.
 */
class PgUserRepository extends UserRepository {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash AS "passwordHash", created_at AS "createdAt" FROM users WHERE email = $1',
      [email],
    );
    return rows[0] || null;
  }

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash AS "passwordHash", created_at AS "createdAt" FROM users WHERE id = $1',
      [id],
    );
    return rows[0] || null;
  }

  async create({ email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, password_hash AS "passwordHash", created_at AS "createdAt"`,
      [email, passwordHash],
    );
    return rows[0];
  }
}

module.exports = { PgUserRepository };
