const { Task } = require('../../../domain/entities/Task');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

class ListTasks {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ ownerId, limit = DEFAULT_LIMIT, offset = 0 }) {
    const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const rows = await this.taskRepository.findAllByOwner(ownerId, {
      limit: safeLimit,
      offset: safeOffset,
    });

    return rows.map((row) => new Task(row).toJSON());
  }
}

module.exports = { ListTasks };
