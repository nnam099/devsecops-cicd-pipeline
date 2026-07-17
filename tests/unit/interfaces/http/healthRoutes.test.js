const express = require('express');
const request = require('supertest');
const { buildHealthRoutes } = require('../../../../src/interfaces/http/routes/healthRoutes');

function makeApp(healthCheck) {
  const app = express();
  app.use(buildHealthRoutes(healthCheck));
  return app;
}

describe('health routes', () => {
  test('/livez reports process liveness without checking dependencies', async () => {
    const healthCheck = { check: jest.fn() };
    const response = await request(makeApp(healthCheck)).get('/livez');

    expect(response.status).toBe(200);
    expect(healthCheck.check).not.toHaveBeenCalled();
  });

  test('/readyz returns 200 when PostgreSQL is available', async () => {
    const healthCheck = { check: jest.fn().mockResolvedValue(undefined) };
    const response = await request(makeApp(healthCheck)).get('/readyz');

    expect(response.status).toBe(200);
    expect(healthCheck.check).toHaveBeenCalledTimes(1);
  });

  test('/readyz returns a generic 503 when PostgreSQL is unavailable', async () => {
    const healthCheck = { check: jest.fn().mockRejectedValue(new Error('connection details')) };
    const response = await request(makeApp(healthCheck)).get('/readyz');

    expect(response.status).toBe(503);
    expect(response.body.error).toEqual({
      code: 'DEPENDENCY_UNAVAILABLE',
      message: 'Service is not ready',
    });
    expect(JSON.stringify(response.body)).not.toContain('connection details');
  });
});
