# Thesis Report Outline

This outline maps the repository artifacts to report chapters. Adjust chapter
numbers to match the university template.

## Chapter 1: Introduction

Recommended content:

- Problem statement: traditional CI/CD can ship vulnerable software quickly.
- Goal: design and evaluate a DevSecOps CI/CD pipeline for a Node.js API.
- Scope:
  - secure reference API
  - CI build gate
  - security scanning gates
  - DAST baseline
  - SBOM and image signing
  - controlled vulnerable demo branches
- Out of scope:
  - production-grade key rotation
  - full authenticated DAST crawl
  - enterprise SIEM integration
  - high-availability production deployment

Repository evidence:

- `README.md`
- `docs/roadmap-status.md`
- `docs/team-workplan.md`

## Chapter 2: Background

Recommended content:

- CI/CD overview.
- DevSecOps principles.
- OWASP Top 10 mapping.
- SAST, SCA, secret scanning, container scanning, DAST.
- SBOM and software supply-chain security.

Repository evidence:

- `docs/security-pipeline.md`
- `.semgrep.yml`
- `.gitleaks.toml`
- `.github/workflows/security.yml`
- `.github/workflows/dast.yml`
- `.github/workflows/supply-chain.yml`

## Chapter 3: System Design

Recommended content:

- Application architecture.
- Clean Architecture dependency direction.
- Database design.
- Authentication and authorization design.
- Security controls implemented in code.
- Local and CI lab architecture.

Repository evidence:

- `src/domain`
- `src/application`
- `src/infrastructure`
- `src/interfaces/http`
- `src/config`
- `src/infrastructure/database/migrations`
- `Dockerfile`
- `docker-compose.yml`
- `docs/lab-setup.md`

## Chapter 4: Pipeline Design And Implementation

Recommended content:

- CI stages:
  - lint
  - unit test
  - integration test
  - Docker build
- Security gates:
  - Gitleaks
  - Semgrep
  - npm audit
  - Trivy filesystem
  - Trivy image
  - OWASP ZAP
- Supply-chain controls:
  - GHCR image publish
  - SPDX SBOM
  - keyless Cosign signing
  - SBOM attestation
- Least-privilege permissions in GitHub Actions.

Repository evidence:

- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `.github/workflows/dast.yml`
- `.github/workflows/supply-chain.yml`
- `.github/dependabot.yml`

## Chapter 5: Experiment Design

Recommended content:

- Baseline run definition.
- Vulnerable branch methodology.
- Expected findings per branch.
- Evidence collection method.
- Metrics:
  - scan duration
  - finding count
  - severity
  - false positives
  - remediation time

Repository evidence:

- `docs/demo-scenarios.md`
- `docs/lab-setup.md`
- `docs/experiment-results-template.md`

## Chapter 6: Results And Evaluation

Recommended content:

- Baseline pipeline results.
- Security regression results.
- Remediation results.
- False positive analysis.
- Tool effectiveness comparison.
- Discussion of missed findings or limitations.

Repository evidence:

- GitHub Actions workflow URLs.
- ZAP HTML or JSON artifact.
- SBOM artifact.
- Semgrep SARIF upload.
- Trivy and npm audit logs.
- `docs/experiment-results-template.md` filled with real values.

## Chapter 7: Conclusion And Future Work

Recommended content:

- Summary of achieved objectives.
- Main security benefits.
- Practical limitations.
- Future work:
  - staging/CD deployment
  - authenticated DAST
  - dashboard or metrics store
  - stronger secret management
  - runtime monitoring
  - policy-as-code for Kubernetes manifests

Repository evidence:

- `docs/roadmap-status.md`
- `docs/lab-setup.md`

## Appendix Suggestions

Include:

- API endpoint list.
- Environment variable table.
- Workflow screenshots.
- Demo branch screenshots.
- Full result table.
- Selected scan reports.
- Main source code excerpts.
- Docker and GitHub Actions configuration excerpts.
