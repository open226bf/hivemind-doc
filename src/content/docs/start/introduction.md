---
title: Introduction
description: What Hivemind is, who it's for, and how the pieces fit together.
---

Hivemind is a **control plane for Docker Swarm**. It gives teams a self-service
way to define, deploy and supervise services across one or many clusters —
through a REST API and a web console — without handing everyone access to the
Docker socket.

## What problem does it solve?

Running Swarm in production usually means SSH-ing into a manager, editing compose
files, and running `docker stack deploy` by hand. That doesn't scale across
teams or clusters, leaves no history, and exposes the daemon. Hivemind replaces
that with:

- a **modelled** set of resources (services, secrets, configs, networks,
  volumes) that live in a database, scoped per cluster;
- **deployments** with full history and one-click rollback via snapshots;
- **role-based access** (Viewer / Operator / Admin) and an audit log;
- **live supervision** — status, tasks, logs and an interactive container shell.

## Who is it for?

- **Platform teams** that want to offer self-service deployment to developers.
- **Operators** of clusters that live **behind NAT or a firewall** — the agent
  dials out, so nothing needs to be exposed.
- **Anyone** who wants a lightweight, single-binary alternative to a full PaaS on
  top of Swarm they already run.

## How it's built

Hivemind ships as **three repositories**:

| Repo | Role |
|------|------|
| `hivemind` | The control plane: REST API, business logic, and the embedded web UI. Go, hexagonal architecture. |
| `hivemind-agent` | A small agent deployed on a cluster (one task per node) that dials out and proxies the Docker API over a reverse tunnel. |
| `hivemind-gui` | The Angular web console. Built and embedded into the control-plane image. |

A released image bundles the backend and UI together, so you run **one
container**. See [Architecture](/hivemind-doc/concepts/architecture/) for the
full picture.

## Next

- [Quick start](/hivemind-doc/start/quick-start/) — get it running.
- [Using the console](/hivemind-doc/using/first-login/) — sign in and run the
  day-to-day workflows (for everyone who uses the UI).
- [Clusters & connection modes](/hivemind-doc/concepts/clusters/) — direct vs. agent.
