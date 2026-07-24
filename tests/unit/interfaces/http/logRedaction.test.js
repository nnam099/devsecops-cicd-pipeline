process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'unit_test_secret_please_do_not_reuse_xxxxxxxxxxxxxxxxxx';
process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGDATABASE = 'taskapi';
process.env.PGUSER = 'taskapi_app';
process.env.PGPASSWORD = 'unit_test_only_password';

const pino = require('pino');
const request = require('supertest');
const { createApp } = require('../../../../src/interfaces/http/app');

function makeContainer() {
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
    },
  };
}

describe('HTTP log redaction', () => {
  test('does not persist bearer tokens, cookies, or passwords in request logs', async () => {
    const lines = [];
    const logger = pino({ level: 'info' }, {
      write(line) {
        lines.push(JSON.parse(line));
      },
    });
    const app = createApp({ logger, container: makeContainer() });

    await request(app)
      .post('/api/auth/login')
      .set('Authorization', 'Bearer review-sensitive-token')
      .set('Cookie', 'session=review-sensitive-cookie')
      .send({ email: 'user@example.com', password: 'review-sensitive-password' });

    const requestLog = lines.find((line) => line.req);
    expect(requestLog.req.headers.authorization).toBe('[REDACTED]');
    expect(requestLog.req.headers.cookie).toBe('[REDACTED]');
    expect(JSON.stringify(lines)).not.toContain('review-sensitive-token');
    expect(JSON.stringify(lines)).not.toContain('review-sensitive-cookie');
    expect(JSON.stringify(lines)).not.toContain('review-sensitive-password');
  });
});
