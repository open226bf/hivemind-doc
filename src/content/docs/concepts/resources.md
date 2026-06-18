---
title: Resources & deployments
description: The objects Hivemind manages and the draft → deploy → rollback lifecycle.
---

## Resources

Hivemind models the building blocks of a Swarm stack as first-class, per-cluster
resources stored in its database:

| Resource | Notes |
|----------|-------|
| **Service** | Image, replicas, command, resources, placement, update config. Created in *draft*, deployed on demand. |
| **Secret** | Sensitive values, encrypted at rest, versioned and rotatable. |
| **Config** | Non-secret config files, versioned with diff and restore. |
| **Network** | Overlay networks, attachable to services. |
| **Volume** | Named volumes and bind/tmpfs mounts. |
| **Hive** | A logical grouping/label for services (a "team" or "app"). |
| **Template** | A reusable service blueprint with lockable fields. |

Names are **unique per cluster**, so the same `redis` service name can exist in
two clusters.

## The deployment lifecycle

```
   create ──► draft ──► deploy ──► deployed
                 ▲          │
                 │          ▼
              rollback ◄─ snapshot
```

1. **Draft.** Creating or editing a service stores it without touching the
   cluster. You can wire up env, networks, secrets, configs and mounts first.
2. **Deploy.** Hivemind builds the Swarm spec, provisions the objects the
   service needs (idempotently), and applies it — then waits for convergence.
   Every deployment is recorded with its trigger, status, duration and any
   error.
3. **Snapshot.** At any point you can capture a complete, point-in-time snapshot
   of a service and everything it references.
4. **Rollback.** Restoring a snapshot rewrites the service definition and
   triggers a new deployment, surfacing any non-fatal warnings (e.g. a secret
   that drifted since capture).

## Idempotent provisioning

Secret, config and network creation on the cluster is **idempotent on name**, so
the deployment engine can safely call it on every reconcile. This keeps deploys
repeatable and rollbacks clean.

## Live status

A deployed service exposes:

- **status** — aggregated replica counts (running / desired / pending / failed)
  and whether an update is in progress or the service was removed out-of-band;
- **tasks** — per-replica detail (node, slot, state, image, exit code);
- **logs** — streamed; and
- **exec** — an interactive shell into a chosen container.
