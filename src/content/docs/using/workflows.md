---
title: Everyday workflows
description: The common things you'll do in the console, and where to find each one.
---

Hivemind follows one core loop: **model → deploy → supervise → roll back**. You
describe what you want, deploy it, watch it run, and revert if needed — with full
history along the way.

## The lifecycle

1. **Model** — define a service and what it needs (image, replicas, env, secrets,
   configs, networks, volumes). It starts as a **draft**; nothing runs yet.
2. **Deploy** — push the draft to the cluster. Hivemind provisions the Swarm
   objects and records a **deployment** in the history.
3. **Supervise** — watch live status, tasks and logs; open a terminal if you need
   to (Admin).
4. **Roll back** — every deploy is recorded, and **snapshots** let you restore a
   known-good state in one click.

## Task index

| I want to… | Go to | Role |
|------------|-------|------|
| Deploy or update an app | [Deploy a service](/hivemind-doc/using/deploy-a-service/) | Operator |
| Set env vars, attach secrets/configs | [Env, secrets & configs](/hivemind-doc/using/secrets-and-configs/) | Operator (Admin to create secrets) |
| Watch status, tasks & logs live | [Live supervision](/hivemind-doc/using/supervision/) | Viewer |
| Open a shell in a container | [The web terminal](/hivemind-doc/using/web-terminal/) | Admin |
| Capture / restore a known-good state | [Snapshots & rollback](/hivemind-doc/using/snapshots-and-rollback/) | Operator |
| Reuse a service blueprint | Templates → Instantiate | Operator |
| Group related services | Hives | Operator |
| Connect a new (or NAT'd) cluster | [Enroll an agent](/hivemind-doc/operations/enroll-an-agent/) | Admin |
| Something went wrong | [Troubleshooting & FAQ](/hivemind-doc/using/troubleshooting/) | — |

:::tip[Multi-cluster]
Each of these acts on the **active cluster** from the top-bar switcher. Switch
clusters to work somewhere else; the lists and forms follow your selection.
:::
