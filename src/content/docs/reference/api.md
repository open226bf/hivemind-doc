---
title: REST API
description: Endpoint overview, conventions, and where to find the live OpenAPI spec.
---

The control plane exposes a REST API under `/api/v1`. A live, interactive
OpenAPI (Swagger) document is served by the server itself.

## Interactive docs

```
GET /swagger/index.html
```

Available in development and when `SWAGGER_ENABLED=true`. It always reflects the
running build, including request/response schemas — treat it as the source of
truth for exact payloads.

## Conventions

- **Base path:** `/api/v1`.
- **Auth:** `Authorization: Bearer <access-token>` on protected routes.
- **Cluster scope:** the active cluster is sent as the `X-Hivemind-Cluster`
  header. Lists filter by it; creates attach to it. Absent ⇒ all clusters for
  lists / default cluster for writes.
- **Pagination:** `?page=` (default 1) and `?size=` (default 20, max 100). List
  responses carry `items`, `total`, `page`, `size`.
- **Errors:** a JSON body `{ "code": "...", "message": "..." }`. Codes include
  `validation_error`, `unauthorized`, `forbidden`, `not_found`, `conflict`,
  `unprocessable_entity`, `internal_error`.

## Health

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/healthz` | Liveness. |
| `GET` | `/readyz` | Readiness (checks the database). |

## Authentication

| Method | Path | Role |
|--------|------|------|
| `POST` | `/api/v1/auth/login` | public |
| `POST` | `/api/v1/auth/refresh` | public |
| `POST` | `/api/v1/auth/logout` | authenticated |
| `GET` | `/api/v1/auth/me` | authenticated |

## Resource groups

Each resource follows REST conventions (`GET` list/detail, `POST` create,
`PUT/PATCH` update, `DELETE`). Minimum roles in brackets.

| Group | Base | Notes |
|-------|------|-------|
| Services | `/api/v1/services` | CRUD [Operator], read [Viewer]; env, ports, resources, placement sub-resources. |
| Deployments | `/api/v1/services/:id/deploy`, `/api/v1/deployments` | deploy/undeploy [Operator], status/tasks/logs/history [Viewer]. |
| Snapshots | `/api/v1/services/:id/snapshots`, `/api/v1/snapshots/:id` | capture/rollback [Operator]. |
| Secrets | `/api/v1/secrets` | create/rotate/delete [Admin], attach [Operator]. |
| Configs | `/api/v1/configs` | versions, diff, restore, impact [Operator/Viewer]. |
| Networks | `/api/v1/networks` | create/delete [Admin], attach [Operator]. |
| Volumes | `/api/v1/volumes` | create/delete [Admin], mounts [Operator]. |
| Hives | `/api/v1/hives` | grouping [Operator]. |
| Templates | `/api/v1/templates` | CRUD [Admin], instantiate [Operator]. |
| Clusters | `/api/v1/clusters` | CRUD/default/test [Admin], read [Viewer]; `/overview`. |
| Users | `/api/v1/users` | [Admin]. |

## Real-time

| Method | Path | Transport |
|--------|------|-----------|
| `GET` | `/api/v1/services/:id/exec/ticket` then `/api/v1/services/:id/exec?ticket=` | WebSocket (interactive terminal). |
| `GET` | live status/deployment events | Server-Sent Events. |

## Agent endpoints

The agent talks to a small set of dedicated endpoints (register, heartbeat,
connect) authenticated by the enrollment token or client certificate — see the
[Security model](/hivemind-doc/concepts/security/).
