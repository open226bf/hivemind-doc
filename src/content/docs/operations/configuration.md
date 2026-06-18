---
title: Configuration
description: How Hivemind is configured and the settings that matter most.
---

Hivemind is configured through **environment variables** (a local `.env` file is
loaded in development). The full list is in the
[Environment variables reference](/hivemind-doc/reference/environment/); this
page explains the ones that matter for a real deployment.

## Database

```bash
DATABASE_URL=postgres://user:pass@host:5432/hivemind?sslmode=disable
```

Required. A Postgres DSN. Migrations run on boot outside production; control this
with `AUTO_MIGRATE=true|false`.

## Encryption key

```bash
AES_KEY=$(openssl rand -base64 32)
```

A base64-encoded 32-byte key. It encrypts secret values, secret-flagged env
vars, and cluster TLS material at rest with AES-256-GCM. **Without it, those
values are stored in plaintext** — set it in production and keep it stable
(rotating it makes existing ciphertext unreadable).

## JWT signing key

```bash
JWT_PRIVATE_KEY_PATH=/keys/jwt.pem
```

An Ed25519 private key. Without it, an ephemeral key is generated per boot, so
all sessions are invalidated on restart. Generate one and mount it read-only.

## Bootstrap admin

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-please
```

Creates the first admin if it doesn't exist. Remove the password from the
environment after first boot if your platform supports it.

## Agent hub (optional)

To accept production mTLS agents, expose the hub and advertise its address:

```bash
AGENT_HUB_ADDR=:9443                       # listener bind address
AGENT_HUB_PUBLIC_ADDR=hivemind.example.com:9443  # what agents dial
AGENT_IMAGE=open226/hivemind-agent:latest  # baked into install scripts
```

When the hub isn't configured, enrollment falls back to token mode (development).

## Environment & mode

```bash
APP_ENV=production       # development (default) | production
PORT=8080
ORCHESTRATOR=stub        # force the simulated backend (no Docker)
HIVEMIND_BASE_URL=https://hivemind.example.com
```

In `production`, the server requires a reachable Docker/orchestrator backend and
will not silently fall back to the stub.

## A minimal production env

```bash
APP_ENV=production
DATABASE_URL=postgres://hivemind:***@db:5432/hivemind?sslmode=require
AES_KEY=***base64-32-bytes***
JWT_PRIVATE_KEY_PATH=/keys/jwt.pem
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=***
HIVEMIND_BASE_URL=https://hivemind.example.com
```
