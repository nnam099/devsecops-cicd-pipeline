# Evidence Collection

Operational claims must be backed by a workflow run or a reproducible local
command. Do not replace missing measurements with estimated values.

## Workflow Artifacts

| Workflow | Artifact | Required evidence |
|---|---|---|
| CI | `coverage-report` | Full-suite test and coverage output |
| CI | `readiness-outage-evidence` | Compose logs from the real PostgreSQL outage test |
| CI | `rendered-manifests` | Helm and Kustomize render output |
| Security | `sca-evidence` | npm audit JSON and Trivy filesystem SARIF |
| Security | `iac-evidence` | Kubernetes and Helm Trivy SARIF |
| Security | `container-scan-evidence` | Trivy image SARIF |
| DAST | `zap-authenticated-api-report` | Authenticated ZAP HTML/JSON/Markdown report |
| Deploy staging | `staging-evidence-<sha>` | Release resources, events, logs, health responses, and Prometheus query |
| Supply chain | `release-metadata` | Source SHA, image digest, and immutable image reference |
| Supply chain | `sbom-spdx-json` | SPDX SBOM for the released image |

## Baseline Acceptance

A release baseline is valid only when CI and Security succeed for the same
commit. P2 DAST evidence additionally requires a successful authenticated ZAP
run for that commit. P3 operational evidence additionally requires the staging
artifact to show healthy application, OpenTelemetry Collector, Prometheus, and
Grafana deployments.

Record workflow URLs, commit SHA, durations, finding IDs, severity, and fix
timestamps in `docs/experiment-results-template.md` after the runs finish.
