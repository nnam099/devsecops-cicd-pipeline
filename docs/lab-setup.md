# Lab Setup

This document defines the reproducible lab used to evaluate the DevSecOps
pipeline. Keep screenshots, workflow URLs, and exported reports from this lab
as thesis evidence.

## 1. Lab Objectives

The lab proves that a small production-like API can be built, tested, scanned,
containerized, and blocked automatically when a security regression is
introduced.

The expected evidence is:

- A clean commit passes CI and security gates.
- Vulnerable demo branches fail at the expected security gate.
- Fixed commits pass again after remediation.
- Scan duration, finding count, severity, and remediation notes are recorded.

## 2. Lab Topology

```text
Developer machine
  |-- Node.js 20
  |-- Docker / Docker Compose
  |-- Git client
  |
  +-- Local containers
      |-- taskapi app container
      |-- PostgreSQL 16 container
      +-- Redis 7.4 container for shared rate limits

GitHub repository
  |
  +-- GitHub Actions runner
      |-- CI: lint, unit tests, integration tests, Docker build
      |-- Security: Gitleaks, Semgrep, npm audit, Trivy fs, Trivy image
      |-- DAST: authenticated OWASP ZAP API scan
      |-- Supply chain: gated image push, SBOM, Cosign signing, attestation
      +-- CD: Kubernetes staging deploy, smoke test, rollback
```

## 3. Local Lab Prerequisites

Install these tools on the developer machine:

- Node.js 20 or newer
- npm
- Docker Desktop or Docker Engine with Docker Compose
- Git
- curl or Postman for API checks

Optional tools for manual validation:

- Semgrep CLI
- Gitleaks CLI
- Trivy CLI
- OWASP ZAP

The GitHub Actions workflows already run the security tools in CI, so local
installation is useful but not required for thesis evidence.

## 4. Local Environment Variables

Use `.env.example` as the local template:

```bash
cp .env.example .env
```

For Docker Compose, the app and database environment are already defined in
`docker-compose.yml`. The local password and JWT secret in that file are
intentionally scoped to local development only.

For direct Node.js execution, update `.env`:

```text
NODE_ENV=development
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=taskapi
PGUSER=taskapi_app
PGPASSWORD=change_me_local_only
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=15m
RATE_LIMIT_REDIS_URL=redis://localhost:6379
```

Generate a real local JWT secret with:

```bash
openssl rand -base64 64
```

Do not commit `.env`.

## 5. Run The Local Lab With Docker Compose

Start Redis, PostgreSQL, migration, and the application:

```bash
docker compose up --build
```

Check the API:

```bash
curl http://localhost:3000/livez
curl http://localhost:3000/readyz
```

Expected response:

```json
{"status":"ok"}
```

## 6. Run The Local Lab Without Docker Compose

Start PostgreSQL locally, then install dependencies:

```bash
npm ci
```

Run migrations:

```bash
npm run migrate
```

Start the API:

```bash
npm run dev
```

Check the API:

```bash
curl http://localhost:3000/readyz
```

## 7. Test Commands

Run fast unit tests:

```bash
npm run test:unit
```

Run the full test suite with coverage:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

The integration tests require PostgreSQL and the migration schema.

## 8. CI/CD Lab Configuration

The GitHub Actions lab is split into focused workflows:

| Workflow | File | Purpose |
|---|---|---|
| CI | `.github/workflows/ci.yml` | lint, unit tests, integration tests, Docker build |
| Security scans | `.github/workflows/security.yml` | Gitleaks, Semgrep, npm audit, Trivy fs, Trivy image |
| DAST | `.github/workflows/dast.yml` | Authenticated OWASP ZAP scan from `docs/openapi.yaml` |
| Supply chain | `.github/workflows/supply-chain.yml` | Require CI + Security, then publish, SBOM, sign, attest |
| Deploy staging | `.github/workflows/deploy-staging.yml` | Migrate, deploy digest, smoke test, rollback |

Required GitHub settings:

- GitHub Actions enabled.
- GitHub Advanced Security or code scanning enabled if SARIF findings should
  appear in the Security tab.
- Package write permission available for GHCR image publishing.
- `GITHUB_TOKEN` permissions are defined in each workflow using least privilege.

No long-lived production secret is required for the current lab. CI and DAST use
ephemeral test secrets scoped to each workflow run.

## 9. Demo Branch Experiment Matrix

Use separate demo branches and never merge them into `main`.

| Demo branch | Introduced weakness | Expected gate |
|---|---|---|
| `demo/secret-leak` | Hard-coded token | Gitleaks |
| `demo/sqli-regression` | SQL string concatenation | Semgrep |
| `demo/dependency-cve` | Vulnerable npm dependency | npm audit or Trivy fs |
| `demo/old-base-image` | Old container base image | Trivy image |
| `demo/idor-regression` | Missing task ownership check | Semgrep and integration test |

For each branch, collect:

- branch name
- commit hash
- workflow URL
- failed job and failed step
- finding ID or test name
- severity
- screenshot or exported report
- remediation commit hash
- retest workflow URL

## 10. Evidence Checklist

Capture these artifacts for the thesis:

- Local `docker compose up --build` output or screenshot.
- Migration success output.
- `/livez` and `/readyz` responses.
- Unit test result.
- Integration test result.
- CI workflow pass URL.
- Security workflow pass URL.
- At least three failed vulnerable branch workflow URLs.
- ZAP HTML or JSON artifact.
- SBOM artifact from the supply-chain workflow.
- Image signature evidence from Cosign.
- Final result table with duration, severity, false positives, and fix notes.

## 11. Known Lab Limits

This is a controlled thesis lab, not a production deployment.

- Local Compose secrets are intentionally local-only placeholders.
- The DAST scan is authenticated and OpenAPI-driven, but it is not a complete
  browser crawl or business-logic penetration test.
- Staging manifests exist, but a real cluster and required secrets must be
  provisioned before the first deployment run.
- Security gates focus on high and critical findings to reduce lab noise.
- Demo vulnerable branches are intentionally unsafe and must stay isolated.
