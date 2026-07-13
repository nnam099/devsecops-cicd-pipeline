const { User } = require('../../../src/domain/entities/User');

describe('User entity', () => {
  test('toPublicJSON never exposes passwordHash', () => {
    const user = new User({
      id: 'u1', email: 'a@example.com', passwordHash: '$2b$12$fakehash', createdAt: new Date(),
    });
    const json = user.toPublicJSON();
    expect(json.passwordHash).toBeUndefined();
    expect(json).toEqual({ id: 'u1', email: 'a@example.com', createdAt: user.createdAt });
  });
});
