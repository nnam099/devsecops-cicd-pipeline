const { Task, TASK_STATUSES } = require('../../../src/domain/entities/Task');
const { AuthorizationError } = require('../../../src/domain/errors/AppError');

describe('Task entity', () => {
  const baseProps = {
    id: 'task-1',
    title: 'Write thesis',
    description: 'Chapter 3',
    status: 'todo',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  test('assertOwnedBy passes when ownerId matches', () => {
    const task = new Task(baseProps);
    expect(() => task.assertOwnedBy('user-1')).not.toThrow();
  });

  test('assertOwnedBy throws AuthorizationError when ownerId does not match (IDOR prevention)', () => {
    const task = new Task(baseProps);
    expect(() => task.assertOwnedBy('attacker-user')).toThrow(AuthorizationError);
  });

  test('isValidStatus accepts only known statuses', () => {
    TASK_STATUSES.forEach((status) => {
      expect(Task.isValidStatus(status)).toBe(true);
    });
    expect(Task.isValidStatus('deleted_forever')).toBe(false);
  });

  test('toJSON exposes only expected fields', () => {
    const task = new Task(baseProps);
    expect(Object.keys(task.toJSON()).sort()).toEqual(
      ['id', 'title', 'description', 'status', 'ownerId', 'createdAt', 'updatedAt'].sort(),
    );
  });
});
