const { AuthenticationError } = require('../../../domain/errors/AppError');

/**
 * Verifies the Bearer JWT and attaches the authenticated user id to
 * req.userId. Never trusts a user id supplied in the request body or
 * query string for authorization decisions — the identity always
 * comes from the verified token (OWASP A01:2021 Broken Access Control
 * prevention).
 */
function authMiddleware(tokenService) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next(new AuthenticationError('Missing or malformed Authorization header'));
    }

    try {
      const payload = tokenService.verify(token);
      req.userId = payload.sub;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { authMiddleware };
