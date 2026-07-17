# Local Security Baseline

Executed on July 19, 2026 with Trivy `0.70.0`, the scanner version used by
`aquasecurity/trivy-action` `v0.36.0`. Scans used severity
`HIGH,CRITICAL`; vulnerability scans also used `--ignore-unfixed`.

## Initial Findings

| Target | Finding | Severity | Remediation |
|---|---|---|---|
| Runtime image | `CVE-2026-45447` in `libcrypto3` and `libssl3` `3.5.6-r0` | HIGH | Upgrade both packages to `3.5.7-r0` during the runtime image build |
| Kubernetes observability | `KSV-0014` for Prometheus | HIGH | Enable `readOnlyRootFilesystem` and mount writable data/temp paths |
| Kubernetes observability | `KSV-0014` for Grafana | HIGH | Enable `readOnlyRootFilesystem` and mount writable data/log/temp paths |

## Final Baseline

| Scan | HIGH/CRITICAL findings |
|---|---:|
| Filesystem vulnerability and secret scan | 0 |
| Helm configuration scan, Kubernetes 1.31 rendering | 0 |
| Kubernetes configuration scan after remediation | 0 |
| Runtime image scan after remediation | 0 |
| `npm audit --audit-level=high` | 0 |

The runtime image was rebuilt after remediation and Trivy confirmed that the
patched OpenSSL packages removed `CVE-2026-45447`. Raw JSON reports are written
under ignored `.trivy-local/` during local verification; CI writes equivalent
SARIF/JSON artifacts with 30-day retention.
