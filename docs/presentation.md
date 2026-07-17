# Defense Slide Deck

## Slide 1 - Title
DevSecOps CI/CD Pipeline for a Secure Node.js Task API

## Slide 2 - Problem
- Fast delivery can also accelerate vulnerable releases.
- Security checks must be automated, blocking, and measurable.

## Slide 3 - Objectives
- Secure reference application.
- Layered CI and security gates.
- Immutable signed release artifacts.
- Reproducible experiments and evidence.

## Slide 4 - Application Architecture
- Clean Architecture: domain, application, infrastructure, interfaces.
- PostgreSQL, Redis, JWT, bcrypt, Express.
- Ownership checks prevent IDOR.

## Slide 5 - Pipeline
- CI: lint, unit, integration, outage, manifests, image build.
- Security: Gitleaks, Semgrep, npm audit, Trivy.
- DAST: authenticated OWASP ZAP.
- Supply chain: SPDX SBOM and Cosign.

## Slide 6 - Kubernetes Delivery
- Helm deployment by immutable image digest.
- Migration pre-upgrade hook.
- Probes, non-root execution, read-only filesystems, NetworkPolicy.
- Automatic evidence collection and rollback.

## Slide 7 - Experiment Design
- Clean baseline versus five controlled vulnerable branches.
- Record finding ID, severity, duration, remediation, and retest.
- Separate scanner findings from workflow setup defects.

## Slide 8 - Test Results
- 41/41 unit tests.
- 16/16 PostgreSQL integration tests.
- 57/57 full-suite tests.
- 86.66% line coverage.
- Readiness correctly failed during a real database outage.

## Slide 9 - Security Results
- Gitleaks: 0 leaks on baseline.
- npm audit: 0 vulnerabilities.
- Trivy fs/Kubernetes/Helm/image: 0 HIGH/CRITICAL.
- ZAP: 44 URLs, 121 PASS, 0 FAIL, 0 WARN.

## Slide 10 - Observability
- OpenTelemetry Collector scrapes TaskAPI.
- Prometheus stores request rate, status, and latency metrics.
- Grafana provisions the TaskAPI Overview dashboard.

## Slide 11 - Staging And Rollback
- Two TaskAPI replicas plus PostgreSQL, Redis, Prometheus, Grafana.
- Revision 3 intentionally failed.
- Revision 4 successfully rolled back to revision 2.

## Slide 12 - Conclusion
- Security gates are layered and fail closed.
- Release artifacts are immutable and traceable.
- Local implementation scope is complete.
- Final hosted evidence is collected from GitHub Actions after push.