# Local Observability Evidence

Executed on July 19, 2026 with an isolated Docker Compose project and dynamic
host ports. The stack included TaskAPI, PostgreSQL, Redis, OpenTelemetry
Collector, Prometheus, and Grafana.

The first run identified and fixed a duplicate Grafana datasource provisioning
file. The successful rerun produced these observations:

| Check | Observed |
|---|---|
| TaskAPI `/readyz` | `200` |
| Prometheus `/-/ready` | `200` |
| `taskapi_http_requests_total` query | 2 series |
| Grafana database health | `ok` |
| Provisioned datasource | `Prometheus` |
| Provisioned dashboard | `TaskAPI Overview` |

The Compose project and its volumes were removed after verification. The same
health and Prometheus query checks are implemented in the staging deployment
workflow, which uploads a `staging-evidence-<sha>` artifact.
