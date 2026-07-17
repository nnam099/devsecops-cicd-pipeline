const client = require('prom-client');

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: 'taskapi_process_',
});

const httpRequestsTotal = new client.Counter({
  name: 'taskapi_http_requests_total',
  help: 'Total HTTP requests handled by TaskAPI',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'taskapi_http_request_duration_seconds',
  help: 'TaskAPI HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

function routeLabel(req) {
  if (!req.route) return 'unmatched';
  return `${req.baseUrl || ''}${req.route.path}` || '/';
}

function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') return next();

  const stopTimer = httpRequestDuration.startTimer({ method: req.method });

  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: routeLabel(req),
      status_code: String(res.statusCode),
    };
    httpRequestsTotal.inc(labels);
    stopTimer(labels);
  });

  return next();
}

async function metricsHandler(req, res, next) {
  try {
    res.set('Content-Type', register.contentType);
    return res.send(await register.metrics());
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  metricsHandler,
  metricsMiddleware,
  register,
};
