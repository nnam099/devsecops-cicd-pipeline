# IDOR Regression Demo

This branch intentionally removes the ownership check from `GetTask`.

Expected results:

- Semgrep custom rule flags the missing `assertOwnedBy(requesterId)` call.
- The integration test proving user B cannot read user A's task fails.

Do not merge this branch into `main`.
