const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../../../domain/errors/AppError');

/**
 * express-validator input validation at the HTTP boundary.
 * This is Defense in Depth layer 1 (Input Validation, OWASP ASVS 5.x):
 * even though use-cases also validate, rejecting malformed input here
 * keeps invalid data out of the application layer entirely and gives
 * structured, safe error messages instead of raw exceptions.
 */
const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Invalid input', errors.array()));
  }
  return next();
}

module.exports = { registerRules, loginRules, checkValidation };
