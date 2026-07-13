/**
 * Port (interface) for user persistence. The application layer depends
 * on this abstraction, never on a concrete database driver. This is
 * what makes use-cases unit-testable with in-memory fakes and lets us
 * swap PostgreSQL for something else without touching business logic
 * (Dependency Inversion Principle).
 *
 * Concrete implementation: src/infrastructure/database/repositories/PgUserRepository.js
 */
class UserRepository {
  // eslint-disable-next-line no-unused-vars
  async findByEmail(email) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async create({ email, passwordHash }) {
    throw new Error('Not implemented');
  }
}

module.exports = { UserRepository };
