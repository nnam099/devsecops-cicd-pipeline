const { User } = require('../../../domain/entities/User');
const { ConflictError, ValidationError } = require('../../../domain/errors/AppError');

/**
 * Registers a new user.
 *
 * Security notes for the thesis:
 * - Password is hashed via the injected PasswordHasher port (bcrypt,
 *   cost factor configured in infrastructure). Plaintext password
 *   never touches persistence or logs.
 * - Email uniqueness is enforced at both the DB level (UNIQUE constraint,
 *   defense in depth) and here (better error message, avoids relying
 *   solely on a DB error leaking constraint details).
 * - Deliberately returns a generic message on duplicate email rather
 *   than leaking whether an email exists in some other flow (see
 *   LoginUser for the matching principle applied to auth failures).
 */
class RegisterUser {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }
    if (password.length < 8 || password.length > 128) {
      throw new ValidationError('Password must be between 8 and 128 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const created = await this.userRepository.create({ email: normalizedEmail, passwordHash });

    const user = new User(created);
    return user.toPublicJSON();
  }
}

module.exports = { RegisterUser };
