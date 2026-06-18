---
title: Troubleshooting & FAQ
description: Common situations in the Hivemind console and how to resolve them.
---

Quick answers to the things people hit most often. For platform-level issues
(install, database, proxy) see [Operations](/hivemind-doc/operations/configuration/).

## I got sent back to the login screen

Your session expired and couldn't be refreshed (usually after a long idle
period). Sign in again — nothing is lost; all state lives server-side.

## A deployment failed

1. Open the service → **Deployments** to see the failed entry and its **error
   message**.
2. Check the **Logs** tab for what the container said on startup.
3. Common causes: a bad image/tag, a missing secret/config, or a resource
   reservation larger than any node can satisfy.
4. Fix the definition, then **Deploy** again. For an already-deployed service,
   the redeploy dialog lets you **re-pull the image** if the tag was updated.

## My service shows "removed" — I didn't remove it

The service was deleted **directly on the cluster** (outside Hivemind), so
Hivemind reconciled its status to *removed*. The definition is intact —
**Deploy** it again from the console to recreate it.

## Live counts aren't updating

The live stream may be blocked by a proxy. The console falls back to polling
automatically, so updates should still arrive within a few seconds. If they
don't, the cluster may be unreachable (see below). Operators: confirm the proxy
forwards SSE — [Reverse proxy](/hivemind-doc/operations/reverse-proxy/).

## A cluster shows offline / agent not connected

- **Direct mode:** Hivemind can't reach the cluster's Docker endpoint. Check the
  endpoint and TLS material under **Clusters**, and use **Test** (Admin).
- **Agent mode:** the agent isn't dialing in. Confirm the agent stack is running
  on the cluster and re-run the install if needed —
  [Enroll an agent](/hivemind-doc/operations/enroll-an-agent/).

## A button is missing or disabled

You likely don't have the role for that action. See
[Your role & permissions](/hivemind-doc/using/roles/) and ask an **Admin** to
adjust your role if needed.

## I can't see resources I expected

Check the **cluster switcher** in the top bar — you may be scoped to a different
cluster, or to **All clusters** (which only aggregates *lists*). Switch to the
right cluster.

## A secret value shows as masked

That's by design: secret values are never returned to the browser after
creation. To change one, an **Admin** can **rotate** it under **Secrets**.

## Still stuck?

- Search these docs (top-right search).
- Ask in [GitHub Discussions](https://github.com/open226bf/hivemind/discussions).
- File a [bug report](https://github.com/open226bf/hivemind/issues) with your
  version, the component, and the steps to reproduce.
