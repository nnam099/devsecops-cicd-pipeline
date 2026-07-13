# =============================================================================
# Multi-stage build. WHY: separates the build-time toolchain (npm, dev
# dependencies, build cache) from the runtime image, so the final image
# ships ONLY production dependencies and application code — smaller
# attack surface, smaller image, faster pulls in CI/CD and Kubernetes.
# =============================================================================

# ---- Stage 1: dependencies -------------------------------------------------
# Pinned digest, not just a tag: protects against upstream tag mutation
# (a base-image supply-chain risk). Replace the digest with the current
# one for node:20-alpine before first build (`docker pull --platform
# linux/amd64 node:20-alpine` then `docker inspect --format='{{index
# .RepoDigests 0}}'`), and re-pin deliberately on each dependency update,
# not silently via `latest`.
FROM node:20-alpine AS deps
WORKDIR /app
# Only copy manifest files first to maximize Docker layer cache reuse —
# dependency install is only re-run when package*.json actually changes.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---- Stage 2: runtime -------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

# Secure by default: run as a dedicated non-root, non-privileged user.
# node:20-alpine already ships a "node" user (uid 1000) — reuse it
# rather than inventing a new one, reducing configuration drift.
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node src ./src
COPY --chown=node:node package.json ./

# Drop privileges before the app ever runs.
USER node

EXPOSE 3000

# Container-native healthcheck, independent of any orchestrator-level
# probe — useful for `docker run` / docker-compose local testing.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]
