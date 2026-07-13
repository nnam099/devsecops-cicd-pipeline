# Security Pipeline

This repository now separates build correctness from security gates:

- `.github/workflows/ci.yml` proves the app builds, lints, tests, and produces a Docker image.
- `.github/workflows/security.yml` runs secret scanning, SAST, SCA, and container scanning.

## Gates

| Stage | Tool | Gate |
|---|---|---|
| Secret scanning | Gitleaks | Any unallowlisted secret fails the run |
| SAST | Semgrep security rules + custom TaskAPI rules | Any finding from configured rules fails the run |
| SCA | npm audit + Trivy filesystem scan | High/Critical vulnerabilities fail the run |
| Container scan | Trivy image scan | High/Critical image vulnerabilities fail the run |

## Custom Semgrep Rules

The project-specific rules in `.semgrep.yml` target the security properties that matter most for this app:

- SQL queries must not be built through string concatenation.
- JWT verification must pin accepted algorithms.
- Task access must call `assertOwnedBy(requesterId)` before returning task data.

These rules support the thesis demo branches: intentionally remove one control, run the pipeline, and record whether the gate blocks the change.

## Demo Branch Ideas

| Demo | Suggested branch | Expected blocker |
|---|---|---|
| Secret leak | `demo/secret-leak` | Gitleaks |
| SQL injection | `demo/sqli-regression` | Semgrep |
| Dependency CVE | `demo/dependency-cve` | npm audit / Trivy fs |
| Old base image | `demo/old-base-image` | Trivy image |
| Broken access control | `demo/idor-regression` | Semgrep + integration test |

## Notes

- Keep `ci.yml` and `security.yml` separate so a failing security gate is not confused with a broken build.
- Export SARIF where supported so GitHub Security can display findings over time.
- Record run duration, finding count, severity, false positives, and remediation notes for the thesis results chapter.
