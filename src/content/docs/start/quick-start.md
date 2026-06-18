---
title: Quick start
description: Run Hivemind with Docker and deploy your first service.
---

This guide gets Hivemind running against your local Docker Swarm and walks you
through your first deployment. You need Docker (with Swarm mode enabled:
`docker swarm init`) and a Postgres database.

## 1. Start a database

```bash
docker run -d --name hivemind-db \
  -e POSTGRES_PASSWORD=hivemind \
  -e POSTGRES_DB=hivemind \
  -p 5432:5432 postgres:16-alpine
```

## 2. Run Hivemind

```bash
docker run -d --name hivemind -p 8080:8080 \
  -e DATABASE_URL='postgres://postgres:hivemind@host.docker.internal:5432/hivemind?sslmode=disable' \
  -e AES_KEY="$(openssl rand -base64 32)" \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD='change-me-please' \
  -v /var/run/docker.sock:/var/run/docker.sock \
  open226/hivemind:latest
```

- The mounted `docker.sock` lets the seeded **default cluster** (direct mode)
  drive your local Swarm.
- `AES_KEY` encrypts secret and config values at rest. Generate a real one for
  anything beyond a quick try.

:::note
No Swarm handy? Omit the socket mount and set `-e ORCHESTRATOR=stub`. The server
starts with a simulated orchestrator so you can explore the API and UI.
:::

## 3. Sign in

Open <http://localhost:8080> and log in with the bootstrap admin
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## 4. Deploy a service

1. Go to **Services → New service**.
2. Name it `hello`, image `nginxdemos/hello`, 2 replicas.
3. Save — it lands in **draft**.
4. Click **Deploy**. Watch the deployment progress and the live task status.

You now have a running service you can scale, inspect, snapshot and roll back.
See [Deploy a service](/hivemind-doc/using/deploy-a-service/) for the full
workflow.

## What next?

- Reach a remote/NAT'd cluster → [Enroll an agent](/hivemind-doc/operations/enroll-an-agent/).
- Harden it for real use → [Production checklist](/hivemind-doc/operations/production-checklist/).
