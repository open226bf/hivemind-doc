---
title: Access control (RBAC)
description: The three roles, what each can do, and the audit log.
---

Hivemind uses a global, three-tier role model. Every authenticated user has
exactly one role.

## Roles

| Role | Can… |
|------|------|
| **Viewer** | Read everything: list and inspect resources, deployments, status, logs. |
| **Operator** | Everything a Viewer can, plus manage and deploy: create/edit/delete services, attach networks/secrets/configs, deploy, undeploy, snapshot and roll back. |
| **Admin** | Everything an Operator can, plus manage infrastructure: clusters, users, secrets, networks, volumes, templates, agent enrollment, and the interactive **web terminal** (`exec`). |

Roles are ordered: `Viewer < Operator < Admin`. An endpoint that requires a
minimum role accepts that role and any higher one.

## Why exec is Admin-only

An interactive shell into a container is the most powerful supervision
capability — it allows arbitrary code execution inside the workload, including
access to any mounted secrets. It is therefore gated to **Admin**, the same tier
as secret and infrastructure management.

## Tokens

Authentication uses **EdDSA-signed JWTs**:

- a short-lived **access token** (~15 min) sent as `Authorization: Bearer …`;
- a longer-lived **refresh token** (~7 days) exchanged at `/auth/refresh`.

The web console refreshes access tokens transparently, so a session survives
past the access-token lifetime without forcing a re-login.

## Audit log

Authorization failures (`403`) are journalled, so you can see who attempted what
and when. Bootstrap protections also prevent the platform from losing its last
admin (the last active admin can't be deleted, demoted or deactivated).
