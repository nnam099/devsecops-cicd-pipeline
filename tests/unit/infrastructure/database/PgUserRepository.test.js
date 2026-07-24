jest.mock('../../../../src/infrastructure/database/pool', () => ({
  pool: { query: jest.fn() },
}));

const { pool } = require('../../../../src/infrastructure/database/pool');
const {
  PgUserRepository,
} = require('../../../../src/infrastructure/database/repositories/PgUserRepository');
const { ConflictError } = require('../../../../src/domain/errors/AppError');

describe('PgUserRepository', () => {
  const repository = new PgUserRepository();

  afterEach(() => {
    pool.query.mockReset();
  });

  test('maps any PostgreSQL unique violation to ConflictError', async () => {
    pool.query.mockRejectedValue({
      code: '23505',
      constraint: 'environment_specific_constraint_name',
    });

    await expect(repository.create({
      email: 'duplicate@example.com',
      passwordHash: 'hash',
    })).rejects.toThrow(ConflictError);
  });

  test('does not hide non-unique database errors', async () => {
    const databaseError = new Error('database unavailable');
    databaseError.code = '08006';
    pool.query.mockRejectedValue(databaseError);

    await expect(repository.create({
      email: 'user@example.com',
      passwordHash: 'hash',
    })).rejects.toBe(databaseError);
  });
});
