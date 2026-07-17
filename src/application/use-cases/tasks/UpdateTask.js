const { Task, TASK_STATUSES } = require('../../../domain/entities/Task');
const { NotFoundError, ValidationError } = require('../../../domain/errors/AppError');

class UpdateTask {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({
    taskId, requesterId, title, description, status,
  }) {
    const row = await this.taskRepository.findById(taskId);
    if (!row) {
      throw new NotFoundError('Task');
    }

    const task = new Task(row);
    task.assertOwnedBy(requesterId);

    if (status !== undefined && !Task.isValidStatus(status)) {
      throw new ValidationError(`status must be one of: ${TASK_STATUSES.join(', ')}`);
    }
    if (title !== undefined && title.trim().length === 0) {
      throw new ValidationError('Title cannot be empty');
    }
    if (title !== undefined && title.length > 200) {
      throw new ValidationError('Title must be at most 200 characters');
    }
    if (description !== undefined && description !== null && description.length > 5000) {
      throw new ValidationError('Description must be at most 5000 characters');
    }

    const updated = await this.taskRepository.update({
      ...task,
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status,
    });

    return new Task(updated).toJSON();
  }
}

module.exports = { UpdateTask };
