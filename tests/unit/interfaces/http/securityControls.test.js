process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'unit_test_secret_please_do_not_reuse_xxxxxxxxxxxxxxxxxx';
process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGDATABASE = 'taskapi';
process.env.PGUSER = 'taskapi_app';
process.env.PGPASSWORD = 'unit_test_only_password';
process.env.CORS_ALLOWED_ORIGINS = 'https://allowed.example';
process.env.TRUST_PROXY_HOPS = '1';

const pino = require('pino');
const request = require('supertest');
const { createApp } = require('../../../../src/interfaces/http/app');

function makeContainer(overrides = {}) {
  return {
    healthCheck: { check: async () => {} },
    tokenService: { verify: () => ({ sub: 'user-1' }) },
    useCases: {
      registerUser: { execute: async () => ({}) },
      loginUser: { execute: async () => ({}) },
      createTask: { execute: async () => ({}) },
      listTasks: { execute: async () => [] },
      getTask: { execute: async () => ({}) },
      updateTask: { execute: async () => ({}) },
      deleteTask: { execute: async () => ({}) },
      ...overrides,
    },
  };
}

describe('HTTP security controls', () => {
  const logger = pino({ level: 'silent' });

  test('returns CORS headers only for configured origins', async () => {
    const app = createApp({ logger, container: makeContainer() });

    const allowed = await request(app).get('/livez').set('Origin', 'https://allowed.example');
    const blocked = await request(app).get('/livez').set('Origin', 'https://evil.example');

    expect(allowed.headers['access-control-allow-origin']).toBe('https://allowed.example');
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('returns a generic response for unexpected database errors', async () => {
    const app = createApp({
      logger,
      container: makeContainer({
        listTasks: {
          execute: async () => {
            throw new Error('SELECT password_hash FROM users; stack-marker');
          },
        },
      }),
    });

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer valid-for-test');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
    expect(JSON.stringify(response.body)).not.toContain('SELECT');
    expect(JSON.stringify(response.body)).not.toContain('stack-marker');
  });

  test('trusts only the configured number of reverse-proxy hops', () => {
    const app = createApp({ logger, container: makeContainer() });

    expect(app.get('trust proxy')).toBe(1);
  });
  test('exposes normalized Prometheus request metrics', async () => {
    const app = createApp({ logger, container: makeContainer() });

    await request(app).get('/livez');
    const response = await request(app).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('taskapi_http_requests_total');
    expect(response.text).toContain('route=');
    expect(response.text).toContain('/livez');
  });
});
