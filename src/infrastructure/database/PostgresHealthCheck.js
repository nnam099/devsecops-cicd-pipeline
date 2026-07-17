const { HealthCheck } = require('../../application/ports/HealthCheck');
const { pool } = require('./pool');

class PostgresHealthCheck extends HealthCheck {
  constructor(databasePool = pool) {
    super();
    this.databasePool = databasePool;
  }

  async check() {
    await this.databasePool.query('SELECT 1');
  }
}

module.exports = { PostgresHealthCheck };
