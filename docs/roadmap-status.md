# Roadmap Status

## Completed

| Area | Status | Evidence |
|---|---|---|
| Demo application | Done | Clean Architecture Express API with auth and task CRUD |
| Containerization | Done | `Dockerfile`, `docker-compose.yml` |
| Lab setup documentation | Done | `docs/lab-setup.md` |
| Two-person work plan | Done | `docs/team-workplan.md` |
| Experiment result template | Done | `docs/experiment-results-template.md` |
| Thesis report outline | Done | `docs/thesis-report-outline.md` |
| CI build gate | Done | `.github/workflows/ci.yml` |
| Secret scanning | Implemented | `.gitleaks.toml`; requires a successful Security run for release evidence |
| SAST | Done | Semgrep + `.semgrep.yml` custom rules |
| SCA | Implemented | Trivy `v0.36.0` pinned by full SHA; workflow retains npm audit and SARIF evidence |
| Container scanning | Implemented | Trivy image scan with a SARIF evidence artifact |
| Security gate | Implemented | Requires Security success and same-SHA CI success |
| DAST | Implemented and locally executed | Authenticated ZAP: 44 URLs, 121 PASS, 0 FAIL/WARN; hosted artifact requires push |
| SBOM | Implemented | `supply-chain.yml` generates SPDX JSON after gates |
| Image signing | Implemented | Cosign keyless signing after gates |
| Dependency maintenance | Done | `.github/dependabot.yml` |
| DB least privilege | Implemented and integration-tested | `taskapi_owner` migration role; `taskapi_app` CRUD role verified non-superuser |
| Liveness/readiness split | Implemented | `/livez`, `/readyz`, Kubernetes probes, and a Compose PostgreSQL outage CI test |
| Shared rate limiting | Implemented, locally tested | Redis adapter, isolated prefixes and production URL requirement |
| Security regression tests | Locally verified | Unit coverage plus PostgreSQL integration coverage for registration race, IDOR, pagination and DB role |
| Kubernetes staging baseline | Implemented and locally executed | Kind deployment reached healthy state; failed revision 3 rolled back successfully in revision 4 |
| Observability | Implemented and locally executed | Prometheus returned 2 TaskAPI metric series; Grafana datasource/dashboard provisioned |

## Remaining

| Area | Next work |
|---|---|
| Demo branches | Re-run after the current changes are pushed; collect fresh artifacts |
| Hosted DAST evidence | Push the verified commit and retain the GitHub Actions ZAP artifact URL |
| Remote staging evidence | Configure GitHub staging secrets and retain the hosted deployment artifact; local Kind staging is verified |
| Hosted observability evidence | Retain the GitHub staging artifact; local stack and Kind stack are verified |
| Experiment data | Complete CVE/rule IDs, false positives, remediation and retest times |
| University formatting | Apply the institution template to `docs/thesis-report.md` and `docs/presentation.md` if required |
