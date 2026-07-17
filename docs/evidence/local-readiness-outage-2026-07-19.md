# Local Readiness-Outage Evidence

Executed on July 19, 2026 using
`VERIFY_DATABASE_OUTAGE=true npm run test:readyz-outage`.

The test created an isolated Docker Compose project with dynamically allocated
application and PostgreSQL ports. It waited for the containerized application
to return `200` from `/readyz`, stopped that project's `db` service, and then
observed:

| Endpoint | Expected | Observed |
|---|---|---|
| `/readyz` before outage | `200` | `200` |
| `/readyz` after PostgreSQL stop | `503` | `503` |
| `/livez` after PostgreSQL stop | `200` | `200` |

The Jest run passed: 1 suite and 1 test. The test writes JSON and Compose-log
artifacts for CI, then removes its isolated Docker project. Generated runtime
artifacts are intentionally ignored by Git; the committed test and this record
are the reproducible evidence.
