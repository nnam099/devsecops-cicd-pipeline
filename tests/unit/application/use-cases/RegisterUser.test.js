const { RegisterUser } = require('../../../../src/application/use-cases/auth/RegisterUser');
const { ConflictError, ValidationError } = require('../../../../src/domain/errors/AppError');

/**
 * In-memory fakes implementing the ports — this is the payoff of the
 * Clean Architecture / Dependency Inversion split: no database, no
 * network, tests run in milliseconds and are fully deterministic
 * (important for reproducibility in the thesis experiments).
 */
function makeFakeUserRepository(seed = []) {
  const users = [...seed];
  return {
    async findByEmail(email) {
      return users.find((u) => u.email === email) || null;
    },
    async create({ email, passwordHash }) {
      const user = {
        id: `id-${users.length + 1}`, email, passwordHash, createdAt: new Date(),
      };
      users.push(user);
      return user;
    },
  };
}

const fakePasswordHasher = {
  async hash(plain) { return `hashed:${plain}`; },
  async compare(plain, hash) { return hash === `hashed:${plain}`; },
};

describe('RegisterUser use-case', () => {
  test('registers a new user and returns public fields only', async () => {
    const userRepository = makeFakeUserRepository();
    const useCase = new RegisterUser({ userRepository, passwordHasher: fakePasswordHasher });

    const result = await useCase.execute({ email: 'new@example.com', password: 'S3curePass!' });

    expect(result.email).toBe('new@example.com');
    expect(result.passwordHash).toBeUndefined();
  });

  test('rejects duplicate email with ConflictError', async () => {
    const userRepository = makeFakeUserRepository([
      {
        id: 'id-0', email: 'exists@example.com', passwordHash: 'x', createdAt: new Date(),
      },
    ]);
    const useCase = new RegisterUser({ userRepository, passwordHasher: fakePasswordHasher });

    await expect(useCase.execute({ email: 'exists@example.com', password: 'whatever1' }))
      .rejects.toThrow(ConflictError);
  });

  test('rejects missing email or password with ValidationError', async () => {
    const userRepository = makeFakeUserRepository();
    const useCase = new RegisterUser({ userRepository, passwordHasher: fakePasswordHasher });

    await expect(useCase.execute({ email: '', password: '' })).rejects.toThrow(ValidationError);
  });

  test('normalizes email before lookup and persistence', async () => {
    const userRepository = makeFakeUserRepository();
    const useCase = new RegisterUser({ userRepository, passwordHasher: fakePasswordHasher });

    const result = await useCase.execute({
      email: '  Mixed.Case@Example.COM ',
      password: 'S3curePass!',
    });

    expect(result.email).toBe('mixed.case@example.com');
  });

  test('enforces password length in the application layer', async () => {
    const userRepository = makeFakeUserRepository();
    const useCase = new RegisterUser({ userRepository, passwordHasher: fakePasswordHasher });

    await expect(useCase.execute({ email: 'a@example.com', password: 'short' }))
      .rejects.toThrow(ValidationError);
    await expect(useCase.execute({ email: 'a@example.com', password: 'x'.repeat(129) }))
      .rejects.toThrow(ValidationError);
  });
});
