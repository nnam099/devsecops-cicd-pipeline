const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../../../domain/errors/AppError');
const { TASK_STATUSES } = require('../../../domain/entities/Task');

const createTaskRules = [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('description').optional({ nullable: true }).isString().isLength({ max: 5000 }),
];

const updateTaskRules = [
  param('id').isUUID().withMessage('id must be a valid UUID'),
  body('title').optional().isString().trim()
    .isLength({ min: 1, max: 200 }),
  body('description').optional({ nullable: true }).isString().isLength({ max: 5000 }),
  body('status').optional().isIn(TASK_STATUSES),
];

const taskIdRules = [
  param('id').isUUID().withMessage('id must be a valid UUID'),
];

const listTasksRules = [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
];

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Invalid input', errors.array()));
  }
  return next();
}

module.exports = {
  createTaskRules, updateTaskRules, taskIdRules, listTasksRules, checkValidation,
};
