const { Task } = require('../../../domain/entities/Task');
const { NotFoundError } = require('../../../domain/errors/AppError');

class DeleteTask {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, requesterId }) {
    const row = await this.taskRepository.findById(taskId);
    if (!row) {
      throw new NotFoundError('Task');
    }

    const task = new Task(row);
    task.assertOwnedBy(requesterId);

    await this.taskRepository.delete(taskId);
    return { id: taskId };
  }
}

module.exports = { DeleteTask };
