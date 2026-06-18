---
title: Production checklist
description: What to set before exposing Hivemind to real users and clusters.
---

Before running Hivemind in production, work through this list.

## Secrets & keys

- [ ] **`AES_KEY`** set to a stable, base64 32-byte key. Store it in a secret
      manager, not in the image. Losing or rotating it makes existing encrypted
      values unreadable.
- [ ] **`JWT_PRIVATE_KEY_PATH`** points to a persistent Ed25519 key, so sessions
      survive restarts.
- [ ] **`ADMIN_PASSWORD`** is strong and rotated after first boot.

## Environment

- [ ] **`APP_ENV=production`** — disables dev fallbacks; the server requires a
      real orchestrator backend.
- [ ] **`AUTO_MIGRATE`** set deliberately (run migrations as a controlled step in
      production rather than implicitly on every boot).
- [ ] **`HIVEMIND_BASE_URL`** set to the canonical external URL.

## Transport

- [ ] Hivemind is fronted by a reverse proxy **terminating HTTPS**.
- [ ] The proxy forwards WebSocket upgrades (for the terminal) and SSE (for live
      status) — both pass through standard HTTP proxies.
- [ ] If you use **mTLS agents**, `AGENT_HUB_ADDR`/`AGENT_HUB_PUBLIC_ADDR` are
      set and the hub port is reachable from your clusters.

## Database

- [ ] Postgres uses TLS (`sslmode=require` or stricter).
- [ ] Backups are configured — Hivemind's state (resources, history, snapshots,
      encrypted values) lives in Postgres.

## Access

- [ ] Only trusted operators have **Admin** (clusters, users, secrets, exec).
- [ ] The bootstrap admin password has been changed.

## Image

- [ ] You pin a **versioned tag** (`vX.Y.Z`), not `latest`, for reproducible
      rollouts.
- [ ] If you don't use a local Docker socket, run the container as a **non-root**
      user.

## Observability

- [ ] Container logs are shipped somewhere durable.
- [ ] `/healthz` and `/readyz` are wired into your liveness/readiness probes.
