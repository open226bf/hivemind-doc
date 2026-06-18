---
title: Live supervision
description: Read a service's live state — status badges, replica counts, tasks, and logs — and understand the live indicator.
---

Once a service is deployed, Hivemind shows you what it's actually doing on the
cluster, updated **live**. Viewer role is enough to watch.

## Service status

Every service carries a status badge:

- **draft** — defined in Hivemind, not yet on the cluster.
- **deployed** — running (or converging) on the cluster.
- **removed** — taken off the cluster; the definition is kept and can be
  redeployed.

## Live replica counts

For a deployed service you'll see live counts:

- **running / desired** — how many tasks are up vs. how many you asked for.
- **pending** — tasks still starting or rescheduling.
- **failed** — tasks that errored.
- **updating** — a rolling update is in progress.

When running matches desired and nothing is pending/failed, the service is
healthy.

## The "live" indicator

The supervision view streams updates over **Server-Sent Events**, so counts and
tasks change without a manual refresh. A **live** indicator shows the stream is
active; you can pause it with the **auto-refresh** toggle.

<figure class="hm-shot" data-shot="A deployed service's supervision view: status badge, live running/desired counts, and the live indicator"></figure>

:::note[Behind a proxy]
If a reverse proxy on the path blocks streaming, the console **automatically
falls back to polling** — you still get updates, just on a short interval
instead of instantly. Operators can tune this; see
[Reverse proxy](/hivemind-doc/operations/reverse-proxy/).
:::

## Tasks

The **Tasks** view lists each task (container) of the service: which node it runs
on, its state (running, shutdown, failed…), image, IP, and any error message.
Open a task for full detail, then jump to its **logs** or open a **terminal**
(Admin) right from there.

<figure class="hm-shot" data-shot="The tasks table for a service, with a task's detail drawer open (node, state, IP, error)"></figure>

## Logs

Stream a service's logs from the **Logs** tab — useful to confirm a deploy or
chase an error without leaving the browser.

## Drift detection

If someone removes the service directly on the cluster (e.g. `docker service
rm`), Hivemind notices the drift, flips the status to **removed**, and shows a
notice. Redeploy from the console to bring it back.

## Related

- [The web terminal](/hivemind-doc/using/web-terminal/) — interactive shell (Admin).
- [Troubleshooting & FAQ](/hivemind-doc/using/troubleshooting/) — when something looks wrong.
