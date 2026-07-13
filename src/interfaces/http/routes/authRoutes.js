const { Router } = require('express');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerRules, loginRules, checkValidation,
} = require('../validators/authValidators');

function buildAuthRoutes(authController) {
  const router = Router();

  router.post('/register', authLimiter, registerRules, checkValidation, authController.register);
  router.post('/login', authLimiter, loginRules, checkValidation, authController.login);

  return router;
}

module.exports = { buildAuthRoutes };
