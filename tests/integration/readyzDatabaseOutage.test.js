/**
 * Starts an isolated Compose project, calls the containerized application,
 * stops that project's PostgreSQL service, and verifies readiness fails while
 * liveness remains available. CI opts in with VERIFY_DATABASE_OUTAGE=true.
 */
const { execFile } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const enabled = process.env.VERIFY_DATABASE_OUTAGE === 'true';
const workspace = path.resolve(__dirname, '../..');
const evidencePath = path.join(workspace, 'readiness-outage-evidence.json');
const logPath = path.join(workspace, 'readiness-outage-compose.log');

jest.setTimeout(240000);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForStatus(url, expectedStatus, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  // Each request must finish before the next poll so the evidence preserves
  // the actual dependency transition instead of creating concurrent traffic.
  /* eslint-disable no-await-in-loop */
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      const body = await response.json();
      if (response.status === expectedStatus) {
        return { status: response.status, body };
      }
      lastError = new Error(`Expected ${expectedStatus}, received ${response.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
  }
  /* eslint-enable no-await-in-loop */

  throw lastError || new Error(`Timed out waiting for ${url}`);
}

(enabled ? describe : describe.skip)('readiness during a real PostgreSQL outage', () => {
  let appUrl;
  let composeEnv;
  let projectName;
  let evidence;

  const runCompose = async (args, timeout = 120000) => {
    return execFileAsync('docker', ['compose', '-p', projectName, ...args], {
      cwd: workspace,
      env: composeEnv,
      maxBuffer: 10 * 1024 * 1024,
      timeout,
      windowsHide: true,
    });
  };

  beforeAll(async () => {
    const [appPort, databasePort] = await Promise.all([getFreePort(), getFreePort()]);
    projectName = `taskapi-readyz-${process.pid}`;
    composeEnv = {
      ...process.env,
      TASKAPI_PORT: String(appPort),
      TASKAPI_DB_PORT: String(databasePort),
    };
    appUrl = `http://127.0.0.1:${appPort}`;

    await runCompose(['up', '-d', '--build', 'app'], 180000);
    const initialReadiness = await waitForStatus(`${appUrl}/readyz`, 200, 120000);
    evidence = {
      projectName,
      checkedAt: new Date().toISOString(),
      initialReadiness,
    };
  });

  afterAll(async () => {
    if (!projectName) return;

    try {
      const logs = await runCompose(['logs', '--no-color']);
      fs.writeFileSync(logPath, `${logs.stdout}${logs.stderr}`, 'utf8');
    } catch (err) {
      fs.writeFileSync(logPath, `${err.stdout || ''}${err.stderr || err.message}`, 'utf8');
    }

    if (evidence) {
      fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
    }

    await runCompose(['down', '--volumes', '--remove-orphans']).catch(() => {});
  });

  test('keeps /livez available and returns 503 from /readyz after PostgreSQL stops', async () => {
    await runCompose(['stop', 'db']);

    const readiness = await waitForStatus(`${appUrl}/readyz`, 503, 30000);
    const liveness = await waitForStatus(`${appUrl}/livez`, 200, 10000);

    expect(readiness.body).toEqual({
      status: 'unavailable',
      error: {
        code: 'DEPENDENCY_UNAVAILABLE',
        message: 'Service is not ready',
      },
    });
    expect(liveness.body).toEqual({ status: 'ok' });

    evidence.databaseStopped = true;
    evidence.readinessAfterDatabaseStop = readiness;
    evidence.livenessAfterDatabaseStop = liveness;
  });
});
