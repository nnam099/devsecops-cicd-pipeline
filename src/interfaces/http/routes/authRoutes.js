const { Router } = require('express');
const {
  registerRules, loginRules, checkValidation,
} = require('../validators/authValidators');

function buildAuthRoutes(authController, authLimiter) {
  const router = Router();

  router.post('/register', authLimiter, registerRules, checkValidation, authController.register);
  router.post('/login', authLimiter, loginRules, checkValidation, authController.login);

  return router;
}

module.exports = { buildAuthRoutes };
