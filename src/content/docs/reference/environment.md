---
title: Environment variables
description: Every environment variable the Hivemind server reads.
---

The control-plane server is configured entirely through environment variables.
In development a `.env` file is loaded automatically.

## Core

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | ✅ | — | Postgres DSN. |
| `PORT` | — | `8080` | HTTP listen port. |
| `APP_ENV` | — | `development` | `development` or `production`. Production disables dev fallbacks. |
| `AUTO_MIGRATE` | — | on (non-prod) | Run DB migrations on boot (`true`/`false`). |
| `HIVEMIND_BASE_URL` | — | — | Canonical external URL used in rendered commands. |

## Security

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `AES_KEY` | prod | — | Base64 32-byte key; AES-256-GCM at-rest encryption. Unset = **plaintext**. |
| `JWT_PRIVATE_KEY_PATH` | prod | ephemeral | Ed25519 signing key path. Unset = per-boot key. |
| `ADMIN_EMAIL` | — | — | Bootstrap admin email. |
| `ADMIN_PASSWORD` | — | — | Bootstrap admin password. |

## Orchestrator

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `ORCHESTRATOR` | — | auto | Set `stub` to force the simulated backend (no Docker). |
| `DOCKER_HOST` | — | — | Standard Docker env for the ambient (default-cluster) connection. |
| `DEFAULT_CLUSTER_NAME` | — | `default` | Name for the seeded default cluster. |

## Agent hub

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `AGENT_HUB_ADDR` | — | — | mTLS hub listener bind address (e.g. `:9443`). Enables the hub. |
| `AGENT_HUB_PUBLIC_ADDR` | — | — | Address agents dial; added to the hub cert SAN. |
| `AGENT_HUB_HOSTNAME` | — | — | Extra SAN for the hub server certificate. |
| `AGENT_IMAGE` | — | `open226/hivemind-agent:latest` | Agent image baked into install scripts. |

## Agent (agent-side variables)

These are set on the **agent** deployment, not the server:

| Variable | Description |
|----------|-------------|
| `HIVEMIND_SERVER` | Server URL the agent dials (token mode). |
| `HIVEMIND_ENROLL_TOKEN` | Enrollment token (also sent on tunnel connect). |
| `HIVEMIND_AGENT_ID` | Stable agent identity (the cluster id). |
| `HIVEMIND_HUB_ADDR` | mTLS hub address (production mode). |
| `HIVEMIND_CLIENT_CERT` / `_KEY` / `HIVEMIND_CA_CERT` | mTLS material (or `*_FILE` for the Docker-secret path). |
| `DOCKER_HOST` | Override the local Docker endpoint (default: the node socket). |
| `HIVEMIND_HEARTBEAT` | Heartbeat interval (default `15s`). |
