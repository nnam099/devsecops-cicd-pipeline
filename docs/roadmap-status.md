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
| Secret scanning | Done | Gitleaks in `.github/workflows/security.yml` |
| SAST | Done | Semgrep + `.semgrep.yml` custom rules |
| SCA | Done | `npm audit` + Trivy filesystem scan |
| Container scanning | Done | Trivy image scan |
| Security gate | Baseline done | workflows fail on high-risk findings |
| DAST | Baseline done | `.github/workflows/dast.yml` |
| SBOM | Baseline done | `supply-chain.yml` generates SPDX JSON |
| Image signing | Baseline done | Cosign keyless signing in `supply-chain.yml` |
| Dependency maintenance | Done | `.github/dependabot.yml` |

## Remaining

| Area | Next work |
|---|---|
| Demo branches | Create vulnerable branches and capture failed workflow evidence |
| Dashboard | Decide between GitHub Security tab, artifacts summary, or Grafana |
| CD/staging | Add Kubernetes manifests or a lightweight staging deployment |
| Experiment data | Record scan duration, finding count, severity, false positives, fix time |
| Report | Convert implementation evidence into thesis chapters and slides |
