const { CreateTask } = require('../../../../src/application/use-cases/tasks/CreateTask');
const { GetTask } = require('../../../../src/application/use-cases/tasks/GetTask');
const { UpdateTask } = require('../../../../src/application/use-cases/tasks/UpdateTask');
const { DeleteTask } = require('../../../../src/application/use-cases/tasks/DeleteTask');
const {
  ValidationError, AuthorizationError, NotFoundError,
} = require('../../../../src/domain/errors/AppError');

function makeFakeTaskRepository(seed = []) {
  const store = new Map(seed.map((t) => [t.id, t]));
  let counter = store.size;
  return {
    async create({
      title, description, status, ownerId,
    }) {
      counter += 1;
      const task = {
        id: `task-${counter}`, title, description, status, ownerId, createdAt: new Date(), updatedAt: new Date(),
      };
      store.set(task.id, task);
      return task;
    },
    async findById(id) { return store.get(id) || null; },
    async findAllByOwner(ownerId) {
      return [...store.values()].filter((t) => t.ownerId === ownerId);
    },
    async update(task) {
      const existing = store.get(task.id);
      const updated = { ...existing, ...task, updatedAt: new Date() };
      store.set(task.id, updated);
      return updated;
    },
    async delete(id) { store.delete(id); return true; },
  };
}

describe('CreateTask use-case', () => {
  test('rejects empty title', async () => {
    const taskRepository = makeFakeTaskRepository();
    const useCase = new CreateTask({ taskRepository });
    await expect(useCase.execute({ title: '   ', ownerId: 'u1' })).rejects.toThrow(ValidationError);
  });

  test('creates a task owned by the requester', async () => {
    const taskRepository = makeFakeTaskRepository();
    const useCase = new CreateTask({ taskRepository });
    const task = await useCase.execute({ title: 'Do the thing', ownerId: 'u1' });
    expect(task.ownerId).toBe('u1');
    expect(task.status).toBe('todo');
  });
});

describe('GetTask use-case (IDOR / Broken Access Control prevention)', () => {
  test('owner can retrieve their own task', async () => {
    const taskRepository = makeFakeTaskRepository([
      {
        id: 't1', title: 'Mine', description: null, status: 'todo', ownerId: 'u1', createdAt: new Date(), updatedAt: new Date(),
      },
    ]);
    const useCase = new GetTask({ taskRepository });
    const task = await useCase.execute({ taskId: 't1', requesterId: 'u1' });
    expect(task.id).toBe('t1');
  });

  test('a different user CANNOT retrieve another user\'s task', async () => {
    const taskRepository = makeFakeTaskRepository([
      {
        id: 't1', title: 'Mine', description: null, status: 'todo', ownerId: 'u1', createdAt: new Date(), updatedAt: new Date(),
      },
    ]);
    const useCase = new GetTask({ taskRepository });
    await expect(useCase.execute({ taskId: 't1', requesterId: 'attacker' }))
      .rejects.toThrow(AuthorizationError);
  });

  test('throws NotFoundError for a non-existent task id', async () => {
    const taskRepository = makeFakeTaskRepository();
    const useCase = new GetTask({ taskRepository });
    await expect(useCase.execute({ taskId: 'ghost', requesterId: 'u1' }))
      .rejects.toThrow(NotFoundError);
  });
});

describe('UpdateTask / DeleteTask ownership enforcement', () => {
  const seed = [{
    id: 't1', title: 'Mine', description: null, status: 'todo', ownerId: 'u1', createdAt: new Date(), updatedAt: new Date(),
  }];

  test('UpdateTask rejects a non-owner', async () => {
    const taskRepository = makeFakeTaskRepository(seed);
    const useCase = new UpdateTask({ taskRepository });
    await expect(useCase.execute({ taskId: 't1', requesterId: 'attacker', status: 'done' }))
      .rejects.toThrow(AuthorizationError);
  });

  test('DeleteTask rejects a non-owner', async () => {
    const taskRepository = makeFakeTaskRepository(seed);
    const useCase = new DeleteTask({ taskRepository });
    await expect(useCase.execute({ taskId: 't1', requesterId: 'attacker' }))
      .rejects.toThrow(AuthorizationError);
  });

  test('UpdateTask rejects invalid status transition value', async () => {
    const taskRepository = makeFakeTaskRepository(seed);
    const useCase = new UpdateTask({ taskRepository });
    await expect(useCase.execute({ taskId: 't1', requesterId: 'u1', status: 'not_a_real_status' }))
      .rejects.toThrow(ValidationError);
  });
});
