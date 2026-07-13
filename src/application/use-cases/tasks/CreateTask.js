const { Task } = require('../../../domain/entities/Task');
const { ValidationError } = require('../../../domain/errors/AppError');

class CreateTask {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({
    title, description, ownerId,
  }) {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (title.length > 200) {
      throw new ValidationError('Title must be at most 200 characters');
    }

    const created = await this.taskRepository.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      status: 'todo',
      ownerId,
    });

    return new Task(created).toJSON();
  }
}

module.exports = { CreateTask };
