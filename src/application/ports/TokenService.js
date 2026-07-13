/**
 * Port for issuing/verifying access tokens.
 * Concrete implementation: src/infrastructure/auth/JwtTokenService.js
 */
class TokenService {
  // eslint-disable-next-line no-unused-vars
  sign(payload) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  verify(token) {
    throw new Error('Not implemented');
  }
}

module.exports = { TokenService };
