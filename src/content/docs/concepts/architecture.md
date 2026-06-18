---
title: Architecture
description: The three repositories, the hexagonal backend, and how a request reaches a cluster.
---

## The three repositories

| Repo | Stack | Responsibility |
|------|-------|----------------|
| `hivemind` | Go 1.25, Gin, GORM/Postgres | Control plane: REST API, domain logic, embedded UI. |
| `hivemind-agent` | Go 1.25, yamux | Reverse-tunnel agent; one task per Swarm node. |
| `hivemind-gui` | Angular 21, PrimeNG | Web console, built and embedded into the control-plane image. |

A released image bundles the backend and the compiled UI, so you operate **one
container** serving both `/api` and the SPA on port `8080`.

## Hexagonal backend

The control plane is organised as ports & adapters, so business rules stay free
of I/O concerns and new backends plug in behind interfaces:

```
internal/
├── domain/        pure business rules (cluster, service, deployment, secret…)
├── ports/         interfaces — Orchestrator, repositories, TokenService…
├── application/   use cases that orchestrate domain + ports
└── adapters/      I/O — api (Gin), persistence (GORM), orchestrator (Docker),
                   auth (JWT/CA), agenthub (tunnel registry)
```

**Rule:** `domain` never imports an adapter. Use cases depend on `ports`, and
`main` wires concrete adapters in. This keeps the core testable and lets, for
example, a future Kubernetes backend implement the same `Orchestrator` port.

## The orchestrator registry

The single component that knows Hivemind is multi-cluster is the **registry**.
Given a cluster id it returns a live `Orchestrator` and caches the connection:

```
                    ┌─────────────────────────────────┐
   handler ────────►│ Registry.For(ctx, clusterID)    │
                    │  ├─ reads the cluster definition │
                    │  ├─ dispatches on ConnectionMode │
                    │  │    direct → Docker mTLS client │
                    │  │    agent  → tunnel from the hub │
                    │  └─ caches the result            │
                    └─────────────────────────────────┘
```

For **agent-mode** clusters the orchestrator's dialer re-resolves a live tunnel
session on every call, so it survives the agent reconnecting (restart, network
blip, manager failover) without the cached connection going stale.

## Request → cluster

1. A request carries the active cluster in the `X-Hivemind-Cluster` header
   (set by the UI). List and create operations are scoped to it; per-resource
   operations derive the cluster from the resource's stored `cluster_id`.
2. The handler resolves an `Orchestrator` via the registry.
3. The orchestrator talks to the cluster — directly over mTLS, or by opening a
   multiplexed stream to the agent, which proxies it to the node's
   `docker.sock`.

## Real-time supervision

The console keeps views fresh through a lightweight stream of server events
(SSE) for status and deployment changes, and a WebSocket for the bidirectional
interactive terminal. Both work behind ordinary HTTP reverse proxies.
