# Experiment Results Template

Use this file as the master table for thesis evidence. Rows marked as
historical are copied from GitHub Actions data collected on July 18, 2026.
Do not interpret a workflow failure caused by action setup as a detected
application vulnerability. A result is valid only when its artifact belongs
to the recorded commit; see `docs/evidence/README.md` for artifact names.

## 1. Baseline Runs

| Run | Branch | Commit | Workflow | Result | Duration | Artifact / URL | Notes |
|---|---|---|---|---|---|---|---|
| Historical CI | `main` | `828c131` | CI | Pass | 83s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29249506971 | Build and tests passed |
| Historical security | `main` | `828c131` | Security scans | Fail | 28s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29249506938 | Invalid `aquasecurity/trivy-action@0.28.0`; scan was not a valid baseline |
| Local authenticated DAST | working tree based on `a1fe235` | DAST | Pass | 41s | `docs/evidence/local-2026-07-24/zap-report.html` | 44 URLs; 121 PASS; 0 FAIL/WARN |
| Historical supply chain | `main` | `828c131` | Supply chain release | Success, invalid gate | 36s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29249507104 | Published/signing completed even though Security failed; fixed locally with `verify-gates` |

## 2. Security Regression Experiments

| Experiment | Branch | Weakness | Tool / Gate | Expected Result | Actual Result | Finding ID | Severity | Duration | Evidence URL |
|---|---|---|---|---|---|---|---|---|---|
| Secret leak | `demo/secret-leak` | Hard-coded fake AWS key | Gitleaks | Workflow fail, detection invalid | No Gitleaks finding; job passed | `<unknown>` | `<unknown>` | 30s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29227122639 |
| SQL injection | `demo/sqli-regression` | SQL string concatenation | Semgrep | Detected by SAST; workflow also had setup failure | `taskapi.detect-sql-string-concatenation` | ERROR | 35s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29227032746 |
| Dependency CVE | `demo/dependency-cve` | Vulnerable lodash version | npm audit / Trivy fs | Not measured; action setup failed before scan | `<pending>` | `<pending>` | 27s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29227034548 |
| Old base image | `demo/old-base-image` | Old Alpine base image | Trivy image | Not measured; container job was skipped | `<pending>` | `<pending>` | 27s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29227036100 |
| Broken access control | `demo/idor-regression` | Missing ownership check | Semgrep / CI lint | Detected by SAST; CI also failed at lint | `taskapi.detect-task-return-before-ownership-check` | ERROR | 28s | https://github.com/nnam099/devsecops-cicd-pipeline/actions/runs/29227037934 |

## 3. Remediation Tracking

| Experiment | Fix Commit | Fix Summary | Retest Workflow | Retest Result | Fix Time | Residual Risk |
|---|---|---|---|---|---|---|
| Secret leak | `<sha>` | Remove secret and rotate token if real | `<url>` | Pass | `<time>` | Low if token was fake |
| SQL injection | `<sha>` | Restore parameterized query | `<url>` | Pass | `<time>` | Low |
| Dependency CVE | `<sha>` | Upgrade vulnerable dependency | `<url>` | Pass | `<time>` | Depends on transitive deps |
| Old base image | `<sha>` | Restore patched base image | `<url>` | Pass | `<time>` | Depends on unfixed OS CVEs |
| Broken access control | `<sha>` | Restore `assertOwnedBy` check | `<url>` | Pass | `<time>` | Low if tests cover cross-user access |

## 4. False Positive And Limitation Notes

| Tool | Finding / Gap | Classification | Decision | Justification |
|---|---|---|---|---|
| Semgrep | SQLi and IDOR demo rules | True positive | Block | SAST failed on the vulnerable branches |
| Gitleaks | `demo/secret-leak` fake key | Missed detection | Fix and rerun | The config did not extend default rules; `.gitleaks.toml` is fixed locally |
| Trivy action | `aquasecurity/trivy-action@0.28.0` | Workflow defect | Fix and rerun | The tag could not be resolved, so SCA/container evidence was invalid |
| ZAP | 9 informational alerts, 0 WARN/FAIL on July 24 local run | Informational | Accept | Client errors, auth/session identification and request metadata; no blocking vulnerability |

## 5. Metrics Summary

| Metric | Value |
|---|---|
| Historical workflow runs recorded | 13 selected CI/security/supply-chain/demo runs |
| Valid local baseline security runs | 1 (July 24, 2026) |
| Vulnerable experiments with valid SAST evidence | 2: SQLi and IDOR |
| Expected findings missed or not measured | Secret leak missed; dependency/base-image pending |
| Average CI duration in selected runs | 60s |
| Average security duration in selected runs | 29s |
| Average remediation time | Not measured until every fixed demo branch has a successful retest |
| Total HIGH findings in current local baseline | 0 |
| Total CRITICAL findings in current local baseline | 0 |
| Total confirmed false positives | 0; workflow defects tracked separately |

## 6. Result Interpretation

Use this section to convert raw workflow evidence into thesis analysis.

Answer these questions:

- Which security gates were most effective for this application?
- Which weaknesses were detected by multiple controls?
- Which weaknesses required custom rules or tests?
- Which tools produced noise or false positives?
- What remains out of scope for the current lab?
- What would change in a production deployment?

## 7. Historical Interpretation

The July 13 runs prove that the SQLi and IDOR custom Semgrep controls executed,
but they do not prove a clean security baseline. Several security runs failed
before the scan steps because the old Trivy action tag could not be resolved.
The historical supply-chain run also exposed a release-gate defect: a skipped
publish job left the workflow green. The current worktree fixes both problems;
the measurements above must be rerun from the fixed commit before reporting
final detection rates. The current repository writes npm audit, Trivy, ZAP,
readiness-outage, rendered-manifest, and staging artifacts, but those must be
collected from successful GitHub Actions runs before pending fields are filled.
