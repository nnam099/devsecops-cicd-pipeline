/**
 * Centralized error handler.
 *
 * Security-critical behavior:
 * - Operational errors (AppError subclasses) return their message
 *   safely to the client — these are intentional, expected states.
 * - Non-operational errors (unexpected bugs, DB failures, etc.) NEVER
 *   leak stack traces or internal details to the client, even in
 *   development-adjacent environments, to avoid information
 *   disclosure (OWASP A05:2021 Security Misconfiguration). The full
 *   error is logged server-side via the injected logger instead.
 */
function errorHandler(logger) {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message,
          ...(err.details ? { details: err.details } : {}),
        },
      });
    }

    logger.error({ err }, 'Unhandled error');
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  };
}

module.exports = { errorHandler };
