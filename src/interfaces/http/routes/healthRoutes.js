const { Router } = require('express');

const router = Router();

/**
 * Liveness/readiness endpoint for container orchestration (Kubernetes
 * livenessProbe/readinessProbe) and for uptime checks in the DAST/CD
 * pipeline to confirm the app is up before running OWASP ZAP.
 * Intentionally returns no internal details (no version, no DB
 * connection string, no stack info) to avoid information disclosure.
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
