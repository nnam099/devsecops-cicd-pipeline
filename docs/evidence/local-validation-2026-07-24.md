# Local Validation Evidence - July 24, 2026

Commit under test: working tree based on `a1fe235`.

## Quality Gates

| Check | Result |
|---|---|
| ESLint | Pass, 0 warnings |
| Unit tests | 41/41 passed |
| PostgreSQL integration tests | 16/16 passed |
| Full suite | 57/57 passed, 1 opt-in outage test skipped |
| Coverage | 86.07% statements, 73.85% branches, 76.47% functions, 86.66% lines |
| Real PostgreSQL outage | 1/1 passed; `/readyz` changed 200 to 503 while `/livez` remained 200 |
| Docker Compose build | Pass |
| Helm 3.18.4 lint/render | Pass |
| Kustomize base/observability render | Pass |

## Security Baseline

| Scanner | Scope | HIGH/CRITICAL |
|---|---|---:|
| Gitleaks 8.28.0 | Git history, 26 commits | 0 |
| npm audit | 589 dependencies | 0 |
| Trivy 0.70.0 | Filesystem vulnerability + secret | 0 |
| Trivy 0.70.0 | Kubernetes manifests | 0 |
| Trivy 0.70.0 | Helm chart, Kubernetes 1.31 | 0 |
| Trivy 0.70.0 | Runtime image | 0 |

## Authenticated DAST

OWASP ZAP scanned the OpenAPI definition with an authenticated Bearer token.

| Metric | Result |
|---|---:|
| Imported API URLs | 10 |
| URLs exercised | 44 |
| Rules passed | 121 |
| FAIL | 0 |
| WARN | 0 |
| Informational alerts in JSON | 9 |

The informational alerts describe client error responses, authentication/session identification, non-storable content, and request metadata. None is a blocking vulnerability.

## Observability

The local Compose stack ran TaskAPI, PostgreSQL, Redis, OpenTelemetry Collector, Prometheus, and Grafana.

- TaskAPI `/livez` and `/readyz`: 200.
- Redis: `PONG`.
- OpenTelemetry health extension: available.
- Prometheus: ready and returned 2 `taskapi_http_requests_total` series.
- Grafana database: `ok`.
- Provisioned datasource: `Prometheus`.
- Provisioned dashboard: `TaskAPI Overview`.

## Kubernetes Staging And Rollback

A Kind 0.32.0 cluster named `taskapi-staging` was provisioned. Helm deployed two TaskAPI replicas plus PostgreSQL, Redis, OpenTelemetry Collector, Prometheus, and Grafana. All deployments became available.

Helm revision history:

| Revision | Result |
|---:|---|
| 1 | Initial install succeeded |
| 2 | Valid upgrade succeeded |
| 3 | Deliberately invalid image rollout failed by timeout |
| 4 | Rollback to revision 2 succeeded |

After rollback, TaskAPI readiness/liveness passed, Prometheus was ready with 2 TaskAPI metric series, and Grafana database health was `ok`.

## External Evidence Boundary

These results are reproducible local evidence. GitHub-hosted artifact URLs, GHCR publication, keyless Cosign signing, and deployment to a persistent remote staging cluster require repository push and configured GitHub environment secrets.