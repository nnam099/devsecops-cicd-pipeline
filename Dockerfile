# =============================================================================
# Multi-stage build. WHY: separates the build-time toolchain (npm, dev
# dependencies, build cache) from the runtime image, so the final image
# ships ONLY production dependencies and application code — smaller
# attack surface, smaller image, faster pulls in CI/CD and Kubernetes.
# =============================================================================

# ---- Stage 1: dependencies -------------------------------------------------
# Pinned multi-architecture digest for node:20-alpine. Update deliberately
# through a reviewed dependency change instead of following a mutable tag.
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS deps
WORKDIR /app
# Only copy manifest files first to maximize Docker layer cache reuse —
# dependency install is only re-run when package*.json actually changes.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---- Stage 2: runtime -------------------------------------------------------
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS runtime
WORKDIR /app

# Secure by default: run as a dedicated non-root, non-privileged user.
# node:20-alpine already ships a "node" user (uid 1000) — reuse it
# rather than inventing a new one, reducing configuration drift.
ENV NODE_ENV=production
ENV PORT=3000

# Patch security-fixed Alpine runtime libraries without upgrading unrelated
# packages. The published application image is still identified by its final
# immutable digest in the release workflow.
RUN apk upgrade --no-cache libcrypto3 libssl3 \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node src ./src
COPY --chown=node:node package.json ./

# Drop privileges before the app ever runs.
USER node

EXPOSE 3000

# Container-native healthcheck, independent of any orchestrator-level
# probe — useful for `docker run` / docker-compose local testing.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/livez', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]
