# Experiment Results Template

Use this file as the master table for thesis evidence. Replace the sample rows
with actual workflow URLs, timestamps, findings, and remediation notes.

## 1. Baseline Runs

| Run | Branch | Commit | Workflow | Result | Duration | Artifact / URL | Notes |
|---|---|---|---|---|---|---|---|
| Baseline CI | `main` | `<sha>` | CI | Pass | `<time>` | `<url>` | Clean build and tests |
| Baseline security | `main` | `<sha>` | Security scans | Pass | `<time>` | `<url>` | No high/critical finding |
| Baseline DAST | `main` | `<sha>` | DAST | Pass | `<time>` | `<url>` | ZAP baseline report attached |
| Baseline supply chain | `main` | `<sha>` | Supply chain release | Pass | `<time>` | `<url>` | SBOM and image signature created |

## 2. Security Regression Experiments

| Experiment | Branch | Weakness | Tool / Gate | Expected Result | Actual Result | Finding ID | Severity | Duration | Evidence URL |
|---|---|---|---|---|---|---|---|---|---|
| Secret leak | `demo/secret-leak` | Hard-coded token | Gitleaks | Fail | `<pass/fail>` | `<id>` | `<severity>` | `<time>` | `<url>` |
| SQL injection | `demo/sqli-regression` | SQL string concatenation | Semgrep | Fail | `<pass/fail>` | `<id>` | `<severity>` | `<time>` | `<url>` |
| Dependency CVE | `demo/dependency-cve` | Vulnerable package | npm audit / Trivy fs | Fail | `<pass/fail>` | `<cve/id>` | `<severity>` | `<time>` | `<url>` |
| Old base image | `demo/old-base-image` | Vulnerable OS packages | Trivy image | Fail | `<pass/fail>` | `<cve/id>` | `<severity>` | `<time>` | `<url>` |
| Broken access control | `demo/idor-regression` | Missing ownership check | Semgrep / integration test | Fail | `<pass/fail>` | `<rule/test>` | `<severity>` | `<time>` | `<url>` |

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
| Semgrep | `<finding>` | True positive / false positive | Block / accept / suppress | `<reason>` |
| npm audit | `<finding>` | True positive / false positive | Block / accept / suppress | `<reason>` |
| Trivy | `<finding>` | True positive / false positive | Block / accept / suppress | `<reason>` |
| ZAP | `<finding>` | True positive / false positive | Block / accept / suppress | `<reason>` |

## 5. Metrics Summary

| Metric | Value |
|---|---|
| Total baseline workflows measured | `<number>` |
| Total vulnerable experiments | `<number>` |
| Security gates that blocked as expected | `<number>` |
| Security gates that missed expected findings | `<number>` |
| Average CI duration | `<time>` |
| Average security scan duration | `<time>` |
| Average remediation time | `<time>` |
| Total high findings | `<number>` |
| Total critical findings | `<number>` |
| Total false positives | `<number>` |

## 6. Result Interpretation

Use this section to convert raw workflow evidence into thesis analysis.

Answer these questions:

- Which security gates were most effective for this application?
- Which weaknesses were detected by multiple controls?
- Which weaknesses required custom rules or tests?
- Which tools produced noise or false positives?
- What remains out of scope for the current lab?
- What would change in a production deployment?
