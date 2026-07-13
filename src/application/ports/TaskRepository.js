/**
 * Port (interface) for task persistence.
 * Concrete implementation: src/infrastructure/database/repositories/PgTaskRepository.js
 */
class TaskRepository {
  // eslint-disable-next-line no-unused-vars
  async create(task) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async findAllByOwner(ownerId, { limit, offset }) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async update(task) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('Not implemented');
  }
}

module.exports = { TaskRepository };
