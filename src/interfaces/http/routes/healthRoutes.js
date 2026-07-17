const { Router } = require('express');

/**
 * Liveness only proves that the HTTP process is running. Readiness also
 * verifies PostgreSQL, which prevents an orchestrator from routing traffic to
 * an instance that cannot serve application requests.
 */
function buildHealthRoutes(healthCheck) {
  const router = Router();

  router.get('/livez', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const readiness = async (req, res) => {
    try {
      await healthCheck.check();
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return res.status(503).json({
        status: 'unavailable',
        error: { code: 'DEPENDENCY_UNAVAILABLE', message: 'Service is not ready' },
      });
    }
  };

  router.get('/readyz', readiness);
  // Backward-compatible alias for existing monitors and demo commands.
  router.get('/health', readiness);

  return router;
}

module.exports = { buildHealthRoutes };
