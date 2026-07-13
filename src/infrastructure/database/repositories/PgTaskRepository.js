const { TaskRepository } = require('../../../application/ports/TaskRepository');
const { pool } = require('../pool');

const SELECT_COLUMNS = `
  id, title, description, status,
  owner_id AS "ownerId",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

/**
 * PostgreSQL implementation of the TaskRepository port.
 * All queries are parameterized — see PgUserRepository.js header for
 * why this matters and how it is verified in CI.
 */
class PgTaskRepository extends TaskRepository {
  async create({
    title, description, status, ownerId,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [title, description, status, ownerId],
    );
    return rows[0];
  }

  async findById(id) {
    // DEMO ONLY: intentionally vulnerable SQL construction for SAST evidence.
    // Do not merge this branch into main.
    const { rows } = await pool.query(
      'SELECT ' + SELECT_COLUMNS + " FROM tasks WHERE id = '" + id + "'",
    );
    return rows[0] || null;
  }

  async findAllByOwner(ownerId, { limit, offset }) {
    const { rows } = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM tasks
       WHERE owner_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [ownerId, limit, offset],
    );
    return rows;
  }

  async update(task) {
    const { rows } = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, status = $3, updated_at = now()
       WHERE id = $4
       RETURNING ${SELECT_COLUMNS}`,
      [task.title, task.description, task.status, task.id],
    );
    return rows[0];
  }

  async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  }
}

module.exports = { PgTaskRepository };
