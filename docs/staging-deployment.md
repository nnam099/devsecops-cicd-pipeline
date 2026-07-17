# Staging Deployment

The staging workflow deploys only after the supply-chain workflow proves that
Security and CI passed for the same commit. It resolves the published image to
an immutable digest, uses a Helm migration hook with owner credentials,
deploys the runtime role, checks `/readyz` and `/livez`, deploys OpenTelemetry
Collector, Prometheus and Grafana, and rolls back a failed application release.

## Required Infrastructure

- Kubernetes 1.29 or newer
- PostgreSQL reachable from the `taskapi-staging` namespace
- Redis reachable on TCP 6379 for shared rate-limit counters
- GHCR pull credentials when the package is private

## GitHub Environment

Create a protected GitHub environment named `staging`. Add this repository
secret:

- `KUBE_CONFIG_STAGING`: base64-encoded kubeconfig with access limited to the
  `taskapi-staging` namespace

Use required reviewers on the environment when a manual approval gate is
desired.

## Cluster Secrets

Create the namespace first:

```bash
kubectl apply -f k8s/base/namespace.yaml
```

Create the runtime secret with the restricted database role:

```bash
kubectl -n taskapi-staging create secret generic taskapi-secrets \
  --from-literal=PGHOST=postgres.example.internal \
  --from-literal=PGPORT=5432 \
  --from-literal=PGDATABASE=taskapi \
  --from-literal=PGUSER=taskapi_app \
  --from-literal=PGPASSWORD='<runtime-password>' \
  --from-literal=JWT_SECRET='<minimum-32-character-random-secret>' \
  --from-literal=RATE_LIMIT_REDIS_URL='rediss://:<password>@redis.example.internal:6379'
```

Create a separate migration secret. The owner credential must never be mounted
into the application Deployment:

```bash
kubectl -n taskapi-staging create secret generic taskapi-migration-secrets \
  --from-literal=PGHOST=postgres.example.internal \
  --from-literal=PGPORT=5432 \
  --from-literal=PGDATABASE=taskapi \
  --from-literal=PGUSER=taskapi_owner \
  --from-literal=PGPASSWORD='<owner-password>' \
  --from-literal=JWT_SECRET='<minimum-32-character-random-secret>'
```

Create the image pull secret when GHCR is private:

```bash
kubectl -n taskapi-staging create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username='<github-user>' \
  --docker-password='<read-packages-token>'
```

Create the Grafana admin credential separately from application secrets:

```bash
kubectl -n taskapi-staging create secret generic grafana-secrets \
  --from-literal=admin-password='<strong-grafana-password>'
```

The application chart is in `helm/taskapi`. The Kustomize application files
remain as a policy-review baseline; do not apply `k8s/base` and Helm for the
same release because both define the application Deployment and Service.

## Verification

After the workflow succeeds:

```bash
kubectl -n taskapi-staging get deployment,pods,service,job
kubectl -n taskapi-staging rollout status deployment/taskapi-taskapi
kubectl -n taskapi-staging port-forward service/taskapi-taskapi 18080:80
curl http://localhost:18080/livez
curl http://localhost:18080/readyz
```

The workflow uploads `staging-evidence-<sha>` with resource state, events,
Helm history, workload logs, health responses and the Prometheus TaskAPI query.
Keep its run URL, migration logs, image digest, rollout duration, smoke-test
result, and any rollback evidence with the thesis artifacts.
