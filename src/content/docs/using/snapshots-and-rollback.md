---
title: Snapshots & rollback
description: Capture point-in-time restore points and roll a service back in one click.
---

A **snapshot** is a complete, point-in-time capture of a service and everything
it references — resolved to current values. It's the safety net behind
one-click rollback.

## What a snapshot contains

- the service **spec** (image, tag, replicas, resources, placement, update
  config);
- **environment variables** (secret values masked);
- attached **networks**, **secrets** and **configs** (by reference, with version
  and checksum);
- **mounts**.

## Capture a snapshot

**Service → Snapshots → Capture.** Optionally label it (e.g. `before-v2`).
Capturing is cheap and non-disruptive — it reads the current definition.

Snapshots are also a good habit before a risky change: capture, deploy, and if
it goes wrong, roll back.

<figure class="hm-shot" data-shot="A service's snapshots list with capture/roll-back actions and the rollback confirmation"></figure>

## Roll back

**Snapshots → (pick one) → Roll back.** Hivemind:

1. restores the service definition from the snapshot (spec, env, mounts,
   attachments);
2. triggers a new deployment with `trigger=rollback`;
3. returns the deployment plus any **non-fatal warnings** — for example a secret
   that was recreated or whose checksum drifted since capture.

The rollback is a normal deployment, so it appears in the history and converges
through the usual rolling update.

## Drift warnings

Because secrets and configs evolve independently, a rollback surfaces warnings
when a referenced value no longer matches what was captured. The rollback still
proceeds; the warnings tell you what to double-check.

## Retention

Snapshots persist until you delete them. Keep the ones that mark meaningful
milestones (a known-good release) and prune the rest.
