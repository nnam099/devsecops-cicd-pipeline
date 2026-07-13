# TaskAPI — Clean Architecture Reference Application

Reference application for a DevSecOps CI/CD pipeline thesis. This is **not**
the deliverable itself — it is the *target system* the pipeline builds,
scans, and deploys, designed to be realistic enough to produce meaningful
security-tool findings while remaining small enough to fully audit by hand.

## 1. Why this application was designed this way

| Decision | Rationale |
|---|---|
| Clean Architecture (domain / application / infrastructure / interfaces) | Business rules (ownership checks, validation invariants) are isolated from frameworks and I/O, so they are unit-testable without a database and are the clearest, smallest surface for manual security review and for demonstrating what SAST *should* find clean. |
| Raw parameterized SQL (`pg`) instead of an ORM | Keeps the SQL construction fully visible and auditable — a prerequisite for a controlled experiment where we can deliberately introduce/remove injection-prone code on a feature branch to measure SAST/DAST detection rates. |
| Hand-rolled JWT auth instead of Passport.js | Minimizes third-party dependency surface (fewer SCA findings that are "noise" for the thesis) and keeps the full authentication flow auditable in ~100 lines. |
| Manual dependency injection (no DI framework) | Explicit composition root (`src/config/container.js`) is trivially traceable; a DI framework's reflection/decorators would obscure the wiring during a security review. |

## 2. Architecture

```
src/
├── domain/            # Pure business entities & errors. Zero framework/DB dependencies.
├── application/        # Use-cases + ports (interfaces). Depends only on domain + ports.
├── infrastructure/      # Adapters: PostgreSQL repositories, bcrypt, JWT. Implements ports.
├── interfaces/http/     # Express: routes, controllers, middlewares, validators.
└── config/              # Env validation (fail-fast) + composition root (DI wiring).
```

Dependency direction: `interfaces` → `application` → `domain`, with
`infrastructure` implementing `application`'s ports. Nothing in `domain` or
`application` imports Express, `pg`, or any I/O library — verified by
convention and reviewable via `grep -r "require('express')\|require('pg')" src/domain src/application`.

## 3. Security controls implemented (mapped to OWASP)

| Control | Where | OWASP reference |
|---|---|---|
| Parameterized SQL everywhere | `infrastructure/database/repositories/*` | Top 10 A03:2021 Injection |
| Ownership check on every task read/write (`assertOwnedBy`) | `domain/entities/Task.js`, `application/use-cases/tasks/*` | Top 10 A01:2021 Broken Access Control (IDOR) |
| bcrypt cost-factor-12 password hashing | `infrastructure/auth/BcryptPasswordHasher.js` | ASVS Password Storage Cheat Sheet |
| Generic auth error (no user enumeration) | `application/use-cases/auth/LoginUser.js` | Top 10 A07:2021 Identification & Auth Failures |
| JWT `alg` pinned to HS256 on verify | `infrastructure/auth/JwtTokenService.js` | Prevents algorithm-confusion attacks |
| Fail-fast env validation, rejects placeholder secrets in production | `config/env.js` | Top 10 A05:2021 Security Misconfiguration |
| `helmet()` security headers, explicit CORS allow-list | `interfaces/http/app.js` | OWASP Secure Headers Project |
| Global + auth-specific rate limiting | `interfaces/http/middlewares/rateLimiter.js` | API4:2023 Unrestricted Resource Consumption |
| Centralized error handler — no stack traces to client | `interfaces/http/middlewares/errorHandler.js` | Top 10 A05:2021 |
| Non-root container user, multi-stage build, pinned base image | `Dockerfile` | CIS Docker Benchmark |
| Request body size limit (100kb) | `interfaces/http/app.js` | DoS mitigation |

## 4. Known limitations (documented deliberately, not oversights)

- **No refresh-token rotation/revocation.** Tokens are short-lived (15m
  default) but there is no server-side session/blocklist, so a leaked
  token remains valid until expiry. Future work: refresh tokens with
  rotation, stored server-side (Redis) with revocation support.
- **Login timing side-channel.** The generic authentication error prevents
  *message-based* user enumeration, but bcrypt's compare only runs when a
  user exists, creating a theoretical timing difference. Acceptable for
  this thesis's threat model; mitigation would be a dummy-hash compare on
  the "user not found" path.
- **Single JWT secret, no key rotation.** Acceptable for a reference/lab
  system; production systems should use short-lived signing keys with
  rotation (e.g., via JWKS) — out of scope here to keep the crypto surface
  auditable.

## 5. Local development

### Prerequisites
- Node.js >= 20
- Docker & Docker Compose (recommended path)
- OR: a local PostgreSQL 16 instance

### Option A — Docker Compose (recommended, fully reproducible)
```bash
cp .env.example .env   # only needed if you run node directly; compose sets its own env
docker compose up --build
# in a second terminal, run migrations against the running db:
docker compose exec app node src/infrastructure/database/migrate.js
```
API available at `http://localhost:3000`. Health check: `GET /health`.

### Option B — Node directly against local Postgres
```bash
npm ci
cp .env.example .env
# edit .env with your local Postgres credentials and a generated JWT_SECRET:
#   openssl rand -base64 64
npm run migrate
npm run dev
```

## 6. Testing

```bash
npm run test:unit          # domain + application layer, no DB required (fast, deterministic)
npm run test               # full suite with coverage report
npm run lint                # ESLint + eslint-plugin-security static checks
```

Unit tests use in-memory fake repositories (see
`tests/unit/application/use-cases/*`) implementing the same ports as the
PostgreSQL adapters — no database is spun up for unit tests, keeping CI fast
and deterministic. Coverage thresholds are enforced via `jest.config.js`
(70% lines/statements/functions, 60% branches) as a CI quality gate.

## 7. API surface

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | none | Liveness/readiness probe |
| POST | `/api/auth/register` | none | Create account |
| POST | `/api/auth/login` | none | Obtain JWT |
| POST | `/api/tasks` | Bearer JWT | Create task |
| GET | `/api/tasks` | Bearer JWT | List own tasks (paginated) |
| GET | `/api/tasks/:id` | Bearer JWT | Get own task (403 if not owner) |
| PATCH | `/api/tasks/:id` | Bearer JWT | Update own task |
| DELETE | `/api/tasks/:id` | Bearer JWT | Delete own task |

## 8. Intended use in the DevSecOps pipeline

This repository is the scan/build/deploy target for the CI/CD pipeline
built separately in this thesis. Current integration points:
- **Secret scanning (Gitleaks):** `.github/workflows/security.yml` runs
  against the repo history with `.gitleaks.toml` allowlisting documented
  local-only placeholders.
- **SAST (Semgrep):** targets `src/`, combining Semgrep security rules
  with project-specific rules in `.semgrep.yml` for SQL construction,
  JWT verification, and task ownership checks.
- **SCA (npm audit + Trivy fs):** blocks high/critical dependency and
  filesystem findings.
- **Container scanning (Trivy image):** builds the Docker image locally
  and blocks high/critical image findings.
- **Least-privilege DB bootstrap:** `infra/db/roles.sql` documents the
  production role model for the app database user.
- **DAST (OWASP ZAP):** `.github/workflows/dast.yml` starts the API
  with PostgreSQL, waits for `/health`, and runs a ZAP baseline scan.
- **SBOM + signing:** `.github/workflows/supply-chain.yml` pushes an
  image to GHCR, generates an SPDX SBOM, signs the image with keyless
  Cosign, and attaches an SBOM attestation.
- **Dependency maintenance:** Dependabot monitors npm and GitHub Actions
  dependencies via `.github/dependabot.yml`.

Planned next integration points:
- **Deployment/CD:** add a staging target (Kubernetes manifests or a
  lightweight hosted environment) for post-build deployment evidence.
- **Dashboard:** choose between GitHub Security tab, workflow artifacts,
  or Grafana/Prometheus for longitudinal scan metrics.

Each of these will be documented separately with architecture, workflow,
configuration, known limitations, false-positive analysis, and mitigation
strategy, per the thesis methodology.
