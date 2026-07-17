/**
 * End-to-end HTTP integration tests against a real PostgreSQL instance.
 *
 * Requires environment variables pointing at a running, migrated
 * PostgreSQL database (see README "Local development" and
 * docker-compose.yml). In CI, this is provided by a `postgres:16-alpine`
 * service container — see .github/workflows/ci.yml.
 *
 * These tests exercise the full stack (routing → middleware →
 * controller → use-case → real repository → real DB), which is what
 * gives meaningful coverage of infrastructure/ and interfaces/http/
 * for the CI coverage gate, and is also the layer OWASP ZAP (DAST)
 * will later probe against a running instance of this same app.
 */
const request = require('supertest');
const { Pool } = require('pg');

// Ensure required env vars exist before requiring anything that reads
// config/env.js (which fails fast if they are missing).
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'integration_test_secret_please_do_not_reuse_xxxxxxxxxxxxxxxxxx';
process.env.PGHOST = process.env.PGHOST || 'localhost';
process.env.PGPORT = process.env.PGPORT || '5432';
process.env.PGDATABASE = process.env.PGDATABASE || 'taskapi';
process.env.PGUSER = process.env.PGUSER || 'taskapi_app';
process.env.PGPASSWORD = process.env.PGPASSWORD || 'change_me_local_only';
// The functional test suites below legitimately fire many register/login
// requests back-to-back. Raise the auth rate limit for THIS app instance
// so those tests exercise business logic, not the rate limiter. The
// rate limiter itself is verified separately, at its real production
// threshold, in its own describe block using a dedicated app instance.
process.env.AUTH_RATE_LIMIT_MAX = process.env.AUTH_RATE_LIMIT_MAX || '1000';

const pino = require('pino');
const { createApp } = require('../../src/interfaces/http/app');
const { pool } = require('../../src/infrastructure/database/pool');
const {
  PostgresHealthCheck,
} = require('../../src/infrastructure/database/PostgresHealthCheck');

// pino-http requires a real pino logger instance (it calls .child()
// internally per-request) — a plain object stub is not sufficient.
// silent level keeps test output clean without disabling logging code
// paths, so those lines still count toward integration coverage.
const logger = pino({ level: 'silent' });
const app = createApp({ logger });

function uniqueEmail() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

describe('GET /health', () => {
  test('readiness returns 200 when PostgreSQL is available', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('liveness returns 200 without querying application data', async () => {
    const res = await request(app).get('/livez');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('/readyz returns 503 when PostgreSQL is unreachable', async () => {
    const unavailablePool = new Pool({
      host: '127.0.0.1',
      port: 1,
      database: 'taskapi',
      user: 'taskapi_app',
      password: 'not-used',
      connectionTimeoutMillis: 200,
      max: 1,
    });
    const unavailableApp = createApp({
      logger,
      container: {
        healthCheck: new PostgresHealthCheck(unavailablePool),
        tokenService: { verify: () => ({ sub: 'user-1' }) },
        useCases: {
          registerUser: { execute: async () => ({}) },
          loginUser: { execute: async () => ({}) },
          createTask: { execute: async () => ({}) },
          listTasks: { execute: async () => [] },
          getTask: { execute: async () => ({}) },
          updateTask: { execute: async () => ({}) },
          deleteTask: { execute: async () => ({}) },
        },
      },
    });

    try {
      const res = await request(unavailableApp).get('/readyz');

      expect(res.status).toBe(503);
      expect(res.body).toEqual({
        status: 'unavailable',
        error: {
          code: 'DEPENDENCY_UNAVAILABLE',
          message: 'Service is not ready',
        },
      });
    } finally {
      await unavailablePool.end();
    }
  });
});

describe('Auth flow', () => {
  test('register then login returns a usable JWT', async () => {
    const email = uniqueEmail();
    const password = 'S3curePassword!';

    const registerRes = await request(app).post('/api/auth/register').send({ email, password });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.email).toBe(email);
    expect(registerRes.body.data.passwordHash).toBeUndefined();

    const loginRes = await request(app).post('/api/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(typeof loginRes.body.data.token).toBe('string');
  });

  test('rejects registration with weak/short password (validator layer)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail(), password: '123' });
    expect(res.status).toBe(400);
  });

  test('rejects login with wrong password using a generic message', async () => {
    const email = uniqueEmail();
    await request(app).post('/api/auth/register').send({ email, password: 'CorrectPass1' });
    const res = await request(app).post('/api/auth/login').send({ email, password: 'WrongPass1' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  test('concurrent duplicate registrations return 201 and 409, never 500', async () => {
    const email = uniqueEmail();
    const payload = { email, password: 'S3curePassword!' };

    const results = await Promise.all([
      request(app).post('/api/auth/register').send(payload),
      request(app).post('/api/auth/register').send(payload),
    ]);
    const statuses = results.map((result) => result.status).sort();

    expect(statuses).toEqual([201, 409]);
  });
});

describe('Task endpoints require authentication', () => {
  test('GET /api/tasks without a token returns 401', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });
});

describe('Task CRUD and ownership isolation (IDOR check at HTTP layer)', () => {
  async function registerAndLogin() {
    const email = uniqueEmail();
    const password = 'S3curePassword!';
    await request(app).post('/api/auth/register').send({ email, password });
    const loginRes = await request(app).post('/api/auth/login').send({ email, password });
    return loginRes.body.data.token;
  }

  test('a user can create, read, update, and delete their own task', async () => {
    const token = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write thesis chapter 3' });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.data.id;

    const getRes = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);

    const updateRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('in_progress');

    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);
  });

  test('lists only the authenticated user tasks with pagination', async () => {
    const token = await registerAndLogin();

    const firstCreate = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'First task' });
    const secondCreate = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Second task' });

    const firstPage = await request(app)
      .get('/api/tasks?limit=1&offset=0')
      .set('Authorization', `Bearer ${token}`);
    const secondPage = await request(app)
      .get('/api/tasks?limit=1&offset=1')
      .set('Authorization', `Bearer ${token}`);

    expect(firstPage.status).toBe(200);
    expect(secondPage.status).toBe(200);
    expect(firstPage.body.data).toHaveLength(1);
    expect(secondPage.body.data).toHaveLength(1);
    expect(firstPage.body.data[0].id).not.toBe(secondPage.body.data[0].id);
    expect([
      firstCreate.body.data.id,
      secondCreate.body.data.id,
    ]).toEqual(expect.arrayContaining([
      firstPage.body.data[0].id,
      secondPage.body.data[0].id,
    ]));
  });

  test('rejects pagination outside the documented bounds', async () => {
    const token = await registerAndLogin();

    const responses = await Promise.all([
      request(app).get('/api/tasks?limit=0').set('Authorization', `Bearer ${token}`),
      request(app).get('/api/tasks?limit=101').set('Authorization', `Bearer ${token}`),
      request(app).get('/api/tasks?offset=-1').set('Authorization', `Bearer ${token}`),
    ]);

    expect(responses.map((response) => response.status)).toEqual([400, 400, 400]);
  });

  test('user B cannot read user A\'s task (403, not a silent 200)', async () => {
    const tokenA = await registerAndLogin();
    const tokenB = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Confidential to A' });
    const taskId = createRes.body.data.id;

    const getAsB = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(getAsB.status).toBe(403);
  });

  test('user B cannot update or delete user A\'s task', async () => {
    const tokenA = await registerAndLogin();
    const tokenB = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Confidential to A' });
    const taskId = createRes.body.data.id;

    const updateAsB = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'done' });
    const deleteAsB = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(updateAsB.status).toBe(403);
    expect(deleteAsB.status).toBe(403);
  });

  test('rejects a malformed task id (not a UUID) with 400, not 500', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .get('/api/tasks/not-a-uuid; DROP TABLE tasks;--')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe('Database privilege boundary', () => {
  test('the runtime connection does not use a PostgreSQL superuser', async () => {
    const { rows } = await pool.query(
      'SELECT current_user AS "user", rolsuper FROM pg_roles WHERE rolname = current_user',
    );

    expect(rows[0].user).toBe('taskapi_app');
    expect(rows[0].rolsuper).toBe(false);
  });
});

describe('Auth rate limiting (verified at the real production threshold)', () => {
  test('the 11th auth request within the window is rejected with 429', async () => {
    // Build a SEPARATE app instance with the default (production)
    // AUTH_RATE_LIMIT_MAX=10, independent of the relaxed value used
    // by the rest of this file, so this test is a true measurement of
    // the control as it will behave in production.
    jest.resetModules();
    const prevValue = process.env.AUTH_RATE_LIMIT_MAX;
    delete process.env.AUTH_RATE_LIMIT_MAX; // falls back to the documented default of 10

    // eslint-disable-next-line global-require
    const { createApp: createIsolatedApp } = require('../../src/interfaces/http/app');
    // eslint-disable-next-line global-require
    const { pool: isolatedPool } = require('../../src/infrastructure/database/pool');
    const isolatedApp = createIsolatedApp({ logger });

    try {
      const attempts = [];
      for (let i = 0; i < 11; i += 1) {
        attempts.push(
          request(isolatedApp)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@example.com', password: 'irrelevant' }),
        );
      }
      const results = await Promise.all(attempts);
      const statuses = results.map((r) => r.status);

      expect(statuses.filter((s) => s === 429).length).toBeGreaterThan(0);
    } finally {
      // jest.resetModules() caused pool.js to be re-instantiated as a
      // second, independent connection pool — close it explicitly so
      // this test doesn't leak an open DB connection handle.
      await isolatedPool.end();
      process.env.AUTH_RATE_LIMIT_MAX = prevValue;
    }
  });
});

afterAll(async () => {
  await pool.end();
});
