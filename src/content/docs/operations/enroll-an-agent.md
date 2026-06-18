---
title: Enroll an agent
description: Reach a Swarm cluster that sits behind NAT or a firewall.
---

When Hivemind can't open a connection *to* a cluster's Docker daemon — because
it's behind NAT, a firewall, or simply shouldn't expose the socket — deploy the
**agent**. It runs on the cluster and dials *out* to Hivemind, carrying the
Docker API back over a reverse tunnel.

## Prerequisites

- Admin role in Hivemind.
- The Hivemind server reachable from the cluster (HTTP for token mode; the mTLS
  hub address for production).
- Shell access to a **manager** node of the target cluster.

## 1. Enroll the cluster

**Clusters → (your cluster) → Enroll agent.** Hivemind switches the cluster to
**agent** mode and issues a one-time **enrollment token** (shown once). When the
mTLS hub is configured, it also issues the client certificate material.

<figure class="hm-shot" data-shot="The Enroll agent dialog: the one-time token and the generated install command to run on a manager node"></figure>

## 2. Run the install command

Copy the generated command onto a manager node and run it. It provisions the
agent as a **global Swarm service** (one task per node):

```bash
# Example (token mode) — the real command is generated for you with the token baked in
HIVEMIND_SERVER='https://hivemind.example.com' \
HIVEMIND_ENROLL_TOKEN='<one-time-token>' \
HIVEMIND_AGENT_ID='<cluster-id>' \
docker stack deploy -c /tmp/hivemind-agent.yml hivemind-agent
```

In **mTLS mode** the command instead creates Docker secrets for the client
certificate, key and CA, and deploys the agent to dial the hub over mutual TLS.

## 3. Watch it come online

Back in Hivemind, the cluster flips to **online** once the first tunnel attaches.
The dashboard shows per-node tunnel status. From here the cluster behaves like
any other — deploy, supervise, exec — over the tunnel.

## How the credential works

- The agent reconnects with a **stable agent id** (the cluster id) baked into the
  deployment, so restarts and extra nodes never need to re-consume the token.
- The enrollment token is **reusable and revocable**: every node authenticates
  with it, and rotating it (re-enroll) or switching the cluster back to direct
  mode revokes existing tunnels.
- In production, the **client certificate** is the credential; re-enrolling
  rotates its serial and revokes the previous one.

:::tip
The agent reads the host `docker.sock` read-only and needs the manager API to
see and deploy across the whole cluster, which is why it runs as a global
service. No inbound ports are opened on the cluster.
:::

## Switching back to direct mode

Editing the cluster to **direct** mode drops the agent binding and clears the
enrollment token — existing tunnels are rejected on their next reconnect.
