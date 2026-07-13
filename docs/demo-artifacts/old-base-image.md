# Old Base Image Demo

This branch intentionally changes the Docker base image to `node:20.0.0-alpine3.16`.

Expected result: Trivy image scanning should report high or critical findings, or at minimum flag an unsupported runtime baseline for discussion.

Do not merge this branch into `main`.
