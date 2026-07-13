# Two-Person Work Plan

This plan splits the thesis work by ownership boundaries so both members have
clear implementation work, security evidence, and report responsibility.

## Member 1: Secure Application And Test Evidence

Primary scope:

- `src/domain`
- `src/application`
- `src/interfaces/http`
- `tests/unit`
- `tests/integration`
- application sections in `README.md`

Responsibilities:

- Explain the Clean Architecture design.
- Maintain authentication and task CRUD behavior.
- Verify input validation, authorization, rate limiting, and error handling.
- Maintain unit and integration tests.
- Create vulnerable application demo branches:
  - `demo/sqli-regression`
  - `demo/idor-regression`
- Collect evidence for failed and fixed application-security regressions.
- Write the report sections for:
  - application architecture
  - implemented security controls
  - OWASP mapping
  - test strategy
  - application demo scenarios

Expected evidence:

- Unit test output.
- Integration test output.
- API health check screenshot or command output.
- Failed Semgrep workflow for SQL injection regression.
- Failed Semgrep or integration test for IDOR regression.
- Fixed workflow rerun URLs.

## Member 2: Pipeline, Lab, And Supply Chain Evidence

Primary scope:

- `.github/workflows`
- `.gitleaks.toml`
- `.semgrep.yml`
- `Dockerfile`
- `docker-compose.yml`
- `infra`
- `docs/lab-setup.md`
- `docs/security-pipeline.md`

Responsibilities:

- Maintain the reproducible local lab.
- Maintain CI, security, DAST, and supply-chain workflows.
- Verify Docker build and container scan behavior.
- Create vulnerable pipeline demo branches:
  - `demo/secret-leak`
  - `demo/dependency-cve`
  - `demo/old-base-image`
- Collect evidence for failed and fixed pipeline-security regressions.
- Write the report sections for:
  - lab environment
  - CI/CD architecture
  - security gate design
  - tool selection
  - supply-chain controls
  - experimental results

Expected evidence:

- Docker Compose lab screenshot or command output.
- CI pass workflow URL.
- Security workflow pass URL.
- Failed Gitleaks workflow for secret leak.
- Failed npm audit or Trivy workflow for dependency CVE.
- Failed Trivy image workflow for old base image.
- ZAP report artifact.
- SBOM artifact.
- Cosign signing or attestation evidence.

## Shared Work

Both members are responsible for:

- Final thesis scope and problem statement.
- System and pipeline diagrams.
- Experiment result table.
- False-positive and limitation analysis.
- Final slide deck.
- Final live demo script.

## Suggested Four-Week Schedule

| Week | Member 1 | Member 2 | Shared output |
|---|---|---|---|
| 1 | Review app architecture and tests | Review lab and workflows | Baseline system explanation |
| 2 | Build SQLi and IDOR demo branches | Build secret, dependency, and image demo branches | Failed workflow evidence |
| 3 | Fix regressions and document controls | Finish lab docs, DAST, SBOM, signing evidence | Experiment result table |
| 4 | Finalize app/report sections | Finalize pipeline/report sections | Slides and demo rehearsal |

## Demo Script

Use this order for the final defense:

1. Show local lab topology and repository structure.
2. Show a clean commit passing CI and security workflows.
3. Show API behavior with register, login, and task CRUD.
4. Show a vulnerable branch failing a security gate.
5. Explain the finding, severity, and blocked step.
6. Show the remediation commit.
7. Show the fixed workflow passing.
8. Summarize experiment results and limitations.
