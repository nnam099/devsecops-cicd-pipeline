const jwt = require('jsonwebtoken');
const { TokenService } = require('../../application/ports/TokenService');
const { AuthenticationError } = require('../../domain/errors/AppError');
const { env } = require('../../config/env');

/**
 * JWT token service.
 *
 * Security notes:
 * - HS256 (HMAC) is used with a secret loaded from environment/secret
 *   manager — never hardcoded, never committed. Minimum recommended
 *   entropy: 256 bits (see .env.example generation instructions).
 * - Short expiry (default 15m, see JWT_EXPIRES_IN) limits the blast
 *   radius of a leaked token. This app does not implement refresh
 *   token rotation/revocation — documented as a known limitation in
 *   the README, a good candidate for future work in the thesis.
 * - `algorithms: ['HS256']` is explicitly pinned on verify to prevent
 *   algorithm-confusion attacks (e.g., a token crafted with `alg: none`
 *   or RS256-to-HS256 confusion). Never omit this.
 */
class JwtTokenService extends TokenService {
  sign(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      algorithm: 'HS256',
    });
  }

  verify(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }
}

module.exports = { JwtTokenService };
