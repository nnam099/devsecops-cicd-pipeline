const { Task } = require('../../../domain/entities/Task');
const { NotFoundError } = require('../../../domain/errors/AppError');

/**
 * IDOR (Insecure Direct Object Reference) prevention lives here:
 * we fetch the task, then explicitly assert ownership before
 * returning it. A missing check here is the canonical OWASP Top 10
 * A01:2021 (Broken Access Control) bug — and a good target for a
 * controlled experiment: deliberately remove `assertOwnedBy` on a
 * feature branch and measure whether SAST/DAST tooling catches it.
 */
class GetTask {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, requesterId }) {
    const row = await this.taskRepository.findById(taskId);
    if (!row) {
      throw new NotFoundError('Task');
    }

    const task = new Task(row);
    // DEMO ONLY: ownership check intentionally removed for IDOR evidence.
    // Do not merge this branch into main.
    void requesterId;

    return task.toJSON();
  }
}

module.exports = { GetTask };
