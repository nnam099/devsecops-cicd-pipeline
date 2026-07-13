# Demo Scenarios

Use separate branches for vulnerable demos. Never merge these branches into `main`.

## Demo 1: Secret Leak

Branch: `demo/secret-leak`

Change:

```js
const leakedToken = 'ghp_000000000000000000000000000000000000';
```

Expected blocker: Gitleaks fails in `Security scans`.

Evidence to collect:

- workflow URL
- finding type
- blocked stage
- remediation commit removing the secret

## Demo 2: SQL Injection Regression

Branch: `demo/sqli-regression`

Change `PgTaskRepository.findById` from a parameterized query to string concatenation.

Expected blocker: Semgrep custom rule fails.

Evidence to collect:

- Semgrep rule id
- vulnerable line
- fixed parameterized query

## Demo 3: Dependency CVE

Branch: `demo/dependency-cve`

Change `package.json` to include an intentionally vulnerable package version, for example an old utility package with known high/critical CVEs.

Expected blocker: `npm audit` or Trivy filesystem scan fails.

Evidence to collect:

- CVE/advisory id
- severity
- dependency path
- fixed version

## Demo 4: Old Base Image

Branch: `demo/old-base-image`

Change the Docker base image to an intentionally old image.

Expected blocker: Trivy image scan fails.

Evidence to collect:

- number of high/critical CVEs
- affected OS packages
- comparison with current image

## Demo 5: Broken Access Control

Branch: `demo/idor-regression`

Remove `task.assertOwnedBy(requesterId)` from a task read or write use-case.

Expected blockers:

- Semgrep custom rule catches the missing ownership check.
- Integration test `user B cannot read user A's task` fails.

Evidence to collect:

- failed rule/test
- HTTP status before/after fix
- OWASP mapping: A01:2021 Broken Access Control
