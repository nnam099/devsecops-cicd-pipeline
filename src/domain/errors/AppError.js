/* eslint-disable max-classes-per-file */
// Deliberate, scoped exception: this file defines one small, cohesive
// family of operational error types that are always imported and
// reasoned about together (see errorHandler.js). Splitting each
// 3-line subclass into its own file would fragment a single concept
// across many files for no security or readability benefit. This is
// the only file in the codebase where this rule is relaxed.

/**
 * Base application error. Distinguishes operational errors (expected,
 * safe to expose a message for) from programmer errors (bugs, should
 * never leak details to the client).
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized to perform this action') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
};
