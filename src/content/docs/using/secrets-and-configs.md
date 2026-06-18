---
title: Secrets & configs
description: Manage sensitive values and config files, with versioning and rotation.
---

Hivemind manages two related resource types that map onto Docker Swarm secrets
and configs, with extra lifecycle features.

## Secrets

Secrets hold **sensitive values** (passwords, tokens, keys). They are:

- **encrypted at rest** with AES-256-GCM;
- **never returned in plaintext** by the API — values come back masked;
- **versioned and rotatable** — rotating a secret creates a new version.

Creating and rotating secrets requires **Admin**; attaching them to a service is
**Operator**.

### Attach to a service

Mount a secret at a target path inside the container:

1. **Service → Secrets → Attach.**
2. Pick the secret and the mount path (e.g. `/run/secrets/db_password`).
3. Deploy — the secret is provisioned on the cluster idempotently.

Secret-flagged **environment variables** work the same way: set a variable as
secret and its value is encrypted and masked.

<figure class="hm-shot" data-shot="The environment variables editor with a secret-flagged value masked, and the Attach secret dialog"></figure>

## Configs

Configs hold **non-secret config files** (an `nginx.conf`, an app YAML). They
add:

- **versioning** — every change is a new version with an optional comment;
- **diff** — compare any two versions line by line;
- **restore** — roll a config back to an earlier version;
- **impact** — see which services reference a config before you change it.

### Workflow

1. **Configs → New** with the initial content and a comment.
2. Add versions as the file evolves; review changes with **diff**.
3. **Attach** to services at a target path.
4. Redeploy affected services to pick up a new version.

## Rotation & redeploy

Rotating a secret or bumping a config version updates Hivemind's record. Because
Swarm secrets/configs are immutable, the new version is provisioned under a new
name and the service is updated to reference it on the next deploy — so rotation
is a normal rolling update.
