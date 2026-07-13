const { AuthorizationError } = require('../errors/AppError');

const TASK_STATUSES = Object.freeze(['todo', 'in_progress', 'done']);

/**
 * Task domain entity. Encapsulates the ownership invariant: a task
 * belongs to exactly one user, and only that user may mutate it.
 * Putting this rule here (not in the controller) means it is enforced
 * everywhere the entity is used, and is trivially unit-testable
 * without spinning up Express or a database.
 */
class Task {
  constructor({
    id, title, description, status, ownerId, createdAt, updatedAt,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static isValidStatus(status) {
    return TASK_STATUSES.includes(status);
  }

  assertOwnedBy(userId) {
    if (this.ownerId !== userId) {
      throw new AuthorizationError('You do not own this task');
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { Task, TASK_STATUSES };
