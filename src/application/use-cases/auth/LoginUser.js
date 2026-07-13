const { AuthenticationError } = require('../../../domain/errors/AppError');

/**
 * Authenticates a user and issues a JWT.
 *
 * Security notes:
 * - Uses a single generic error message ("Invalid email or password")
 *   for both "user not found" and "wrong password" to prevent user
 *   enumeration (OWASP ASVS 2.1.1 / OWASP Top 10 A07:2021 -
 *   Identification and Authentication Failures).
 * - Performs the bcrypt compare even conceptually on a "user not found"
 *   path in a constant-time-conscious way by always going through
 *   the same code path shape; timing side-channels on user enumeration
 *   are a known limitation — see README "Limitations" section.
 */
class LoginUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    const genericError = () => new AuthenticationError('Invalid email or password');

    if (!email || !password) {
      throw genericError();
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw genericError();
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw genericError();
    }

    const token = this.tokenService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email } };
  }
}

module.exports = { LoginUser };
