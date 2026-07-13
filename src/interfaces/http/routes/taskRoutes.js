const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createTaskRules, updateTaskRules, taskIdRules, listTasksRules, checkValidation,
} = require('../validators/taskValidators');

function buildTaskRoutes(taskController, tokenService) {
  const router = Router();

  // Every task route requires a valid JWT — no anonymous access to
  // task data, enforced once here rather than per-controller-method.
  router.use(authMiddleware(tokenService));

  router.post('/', createTaskRules, checkValidation, taskController.create);
  router.get('/', listTasksRules, checkValidation, taskController.list);
  router.get('/:id', taskIdRules, checkValidation, taskController.get);
  router.patch('/:id', updateTaskRules, checkValidation, taskController.update);
  router.delete('/:id', taskIdRules, checkValidation, taskController.remove);

  return router;
}

module.exports = { buildTaskRoutes };
