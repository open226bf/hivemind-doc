---
title: Deploy a service
description: The full draft → configure → deploy → supervise workflow.
---

This guide covers the day-to-day workflow for getting a workload running.
Operator or Admin role is required to manage and deploy.

## 1. Create a draft

**Services → New service.** Provide:

- **Name** — unique within the cluster.
- **Image** and **tag**.
- **Replicas** — desired task count.
- Optional **command/entrypoint**, **resources** (CPU/memory reservations and
  limits), **placement** constraints, and **update config** (parallelism,
  rollback policy).

Saving stores the service in **draft** — nothing is created on the cluster yet.

<figure class="hm-shot" data-shot="The New service form: name, image/tag, replicas, and the optional resources/placement sections"></figure>

## 2. Wire up dependencies

While in draft (or anytime), attach what the service needs:

- **Environment variables** — plain or secret-flagged.
- **Networks** — attach overlay networks.
- **Secrets / Configs** — mount them at a target path.
- **Volumes / mounts** — named volumes, binds, tmpfs.

These live with the service and are provisioned on deploy.

## 3. Deploy

Click **Deploy**. Hivemind:

1. builds the Swarm service spec from the draft;
2. idempotently provisions the networks, secrets and configs it references;
3. creates or updates the Swarm service;
4. waits for convergence and records the result.

The deployment appears in the service's **history** with its trigger, status,
duration and any error. A `202` is returned immediately and the UI follows the
progress live.

<figure class="hm-shot" data-shot="The redeploy confirmation dialog (with the re-pull image option) and the deployment history list"></figure>

## 4. Supervise

On the service detail page:

- **Status** — running / desired / pending / failed replica counts.
- **Tasks** — per-replica node, slot, state and exit code.
- **Logs** — streamed output.
- **Terminal** — an interactive shell into a container (Admin).

## 5. Update or scale

Edit the service (image, tag, replicas, resources…) and **Deploy** again.
Swarm performs a rolling update per the update config. Each redeploy is a new
entry in the history.

## 6. Roll back

If an update misbehaves, restore a [snapshot](/hivemind-doc/using/snapshots-and-rollback/)
to return the service to a known-good definition in one click.

## Undeploy

**Undeploy** removes the Swarm service but keeps the Hivemind definition, so you
can redeploy later. Deleting the service removes the definition entirely.
