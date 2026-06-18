---
title: Clusters & connection modes
description: How Hivemind reaches a cluster — direct mTLS or a reverse-tunnel agent.
---

A **cluster** is an orchestration target. Every deployable resource carries a
`cluster_id`, and the [orchestrator registry](/hivemind-doc/concepts/architecture/#the-orchestrator-registry)
resolves that id to a live connection. The active cluster is chosen in the UI
header and travels on each request as `X-Hivemind-Cluster`.

## The default cluster

On first boot Hivemind seeds a **default cluster** bound to the ambient Docker
environment (the mounted `docker.sock`). Resources created without an explicit
cluster land on it, so single-cluster setups "just work".

## Connection modes

A cluster reaches its Docker daemon in one of two ways. Both resolve to the same
`Orchestrator` contract, so the rest of the system is mode-agnostic.

### Direct

Hivemind dials the Docker daemon itself:

- the **ambient** environment (`docker.sock`), used by the default cluster; or
- a **remote TCP** daemon over **mutual TLS** — you provide the CA, client cert
  and key, stored encrypted at rest.

Use direct mode when Hivemind can open a connection *to* the daemon.

### Agent

For a cluster that accepts **no inbound connections** (behind NAT or a
firewall), an agent runs *on* the cluster and **dials out** to Hivemind,
carrying the Docker API back over a reverse tunnel:

```
   Hivemind (hub) ◄────── mutual-TLS dial-out ────────┐
        │  opens multiplexed streams                  │
        │  proxied to docker.sock                     │
        ▼                                       ┌──────┴───────┐
   Orchestrator over tunnel                     │ agent (global│
                                                │  Swarm svc)  │
                                                │ 1 task/node  │
                                                └──────────────┘
```

- Deployed as a **global service** — one task per node.
- The task on a **manager** relays the Swarm API; each task can reach its own
  node's `docker.sock` for node-scoped operations (exec, logs, stats).
- Hivemind sees a single logical endpoint: the agent's tunnel.

The cluster's Docker endpoint/TLS fields are irrelevant in agent mode — the
agent carries everything.

See [Enroll an agent](/hivemind-doc/operations/enroll-an-agent/) for the workflow.

## Cluster status

Hivemind tracks reachability (direct) and agent liveness (agent mode). For agent
clusters, a periodic reconciliation flips the status to **offline** when the
tunnel drops and back to **online** when it returns.
