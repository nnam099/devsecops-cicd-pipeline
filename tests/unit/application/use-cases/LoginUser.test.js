const { LoginUser } = require('../../../../src/application/use-cases/auth/LoginUser');
const { AuthenticationError } = require('../../../../src/domain/errors/AppError');

const fakePasswordHasher = {
  async compare(plain, hash) { return hash === `hashed:${plain}`; },
};

const fakeTokenService = {
  sign(payload) { return `token-for-${payload.sub}`; },
};

function makeUserRepository(user) {
  return { async findByEmail(email) { return email === user.email ? user : null; } };
}

describe('LoginUser use-case', () => {
  const existingUser = {
    id: 'u1', email: 'a@example.com', passwordHash: 'hashed:correct-password',
  };

  test('returns a token on valid credentials', async () => {
    const useCase = new LoginUser({
      userRepository: makeUserRepository(existingUser),
      passwordHasher: fakePasswordHasher,
      tokenService: fakeTokenService,
    });

    const result = await useCase.execute({ email: 'a@example.com', password: 'correct-password' });
    expect(result.token).toBe('token-for-u1');
  });

  test('throws generic AuthenticationError for wrong password (no user-enumeration leak)', async () => {
    const useCase = new LoginUser({
      userRepository: makeUserRepository(existingUser),
      passwordHasher: fakePasswordHasher,
      tokenService: fakeTokenService,
    });

    await expect(useCase.execute({ email: 'a@example.com', password: 'wrong' }))
      .rejects.toThrow(AuthenticationError);
  });

  test('throws the SAME generic AuthenticationError for a non-existent user', async () => {
    const useCase = new LoginUser({
      userRepository: makeUserRepository(existingUser),
      passwordHasher: fakePasswordHasher,
      tokenService: fakeTokenService,
    });

    let errorForWrongPassword;
    let errorForUnknownUser;

    try {
      await useCase.execute({ email: 'a@example.com', password: 'wrong' });
    } catch (e) { errorForWrongPassword = e; }

    try {
      await useCase.execute({ email: 'nobody@example.com', password: 'wrong' });
    } catch (e) { errorForUnknownUser = e; }

    expect(errorForWrongPassword.message).toBe(errorForUnknownUser.message);
  });
});
