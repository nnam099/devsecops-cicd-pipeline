# DevSecOps CI/CD Pipeline For TaskAPI

## Abstract

This project designs and evaluates a DevSecOps pipeline for a Node.js Task Management API. The implementation combines Clean Architecture, automated testing, secret detection, SAST, software composition analysis, container and infrastructure scanning, authenticated DAST, SBOM generation, keyless image signing, Kubernetes delivery, rollback, and runtime observability. Local validation on July 24, 2026 produced a clean baseline: 57 functional tests passed, line coverage reached 86.66%, authenticated ZAP reported no FAIL or WARN result, and all HIGH/CRITICAL baseline security scans returned zero findings.

## 1. Problem And Objectives

Traditional CI/CD optimizes delivery speed but can propagate vulnerable code and artifacts. The project objective is to make security controls enforceable release gates while retaining reproducibility and clear evidence. The evaluated system must reject secret leaks, injection, vulnerable dependencies, insecure images, broken access control, and unsafe deployment configurations.

## 2. System Architecture

TaskAPI separates domain entities, application use cases, infrastructure adapters, and HTTP interfaces. PostgreSQL repositories use parameterized SQL. Task ownership is enforced in use cases. Passwords use bcrypt, authentication uses short-lived HS256 JWTs, Express uses Helmet and explicit CORS, and production rate limits use Redis. Liveness is independent of dependencies while readiness checks PostgreSQL.

## 3. Pipeline Architecture

The CI workflow runs lint, unit tests, PostgreSQL integration tests, an actual database-outage test, manifest validation, and image build. The Security workflow runs Gitleaks, Semgrep, npm audit, Trivy filesystem/config/image scans, and uploads machine-readable evidence. DAST launches the API, creates an authenticated session, seeds task data, and scans the OpenAPI surface with OWASP ZAP. The supply-chain workflow gates release on same-commit CI and Security success, publishes an immutable image, emits SPDX SBOM, signs with Cosign, and writes release metadata. Staging deploys the digest with Helm, runs migrations, verifies application and observability health, and rolls back failed releases.

## 4. Experiment Method

The clean baseline is compared with controlled branches for secret leakage, SQL injection, vulnerable dependencies, old base images, and missing ownership checks. Measurements include gate result, finding identifier, severity, duration, remediation, retest status, and false positives. Workflow setup failures are not counted as vulnerability detections.

## 5. Results

Local validation on July 24, 2026 produced:

- ESLint: pass.
- Unit tests: 41/41 pass.
- PostgreSQL integration tests: 16/16 pass.
- Full suite: 57/57 pass; 86.66% line coverage.
- Database outage: readiness changed to 503 while liveness remained 200.
- Gitleaks, npm audit, Trivy filesystem, Kubernetes, Helm, and image scans: 0 HIGH/CRITICAL.
- Authenticated ZAP: 44 URLs, 121 rules passed, 0 FAIL, 0 WARN.
- Observability: TaskAPI metrics reached Prometheus; Grafana datasource and dashboard were provisioned.
- Staging: two application replicas and all dependencies became ready.
- Rollback: deliberately failed revision 3 was recovered by revision 4.

Historical vulnerable-branch runs prove the custom Semgrep SQL injection and IDOR rules executed. Earlier Trivy setup failures and a missed fake secret are classified as workflow defects, not valid detections; the current configuration corrects both defects and requires fresh GitHub-hosted reruns for final remote URLs.

## 6. Evaluation

Layered controls provide complementary coverage. Unit/integration tests are strongest for business authorization behavior, Semgrep is effective for project-specific coding invariants, Trivy and npm audit cover known components, ZAP validates runtime HTTP behavior, and signed immutable artifacts protect release provenance. The most important operational result is fail-closed release gating: publishing and staging cannot proceed from a security workflow that failed or from a different commit SHA.

## 7. Limitations

The API does not implement refresh-token rotation, JWT key rotation, or a distributed session revocation list. Local Kind evidence is not equivalent to a persistent production cluster. GitHub OIDC signing and hosted artifact URLs can only be produced after pushing the verified commit. Demo branches must be rerun against the corrected workflows before final detection-rate statistics are claimed.

## 8. Conclusion

The implementation demonstrates an end-to-end DevSecOps design with reproducible local evidence across build, security, DAST, deployment, rollback, and observability. The remaining administrative step is collecting GitHub-hosted run URLs and artifacts from the verified commit; no missing application or local platform control remains in the defined thesis scope.