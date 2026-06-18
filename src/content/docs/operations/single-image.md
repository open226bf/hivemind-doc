---
title: Single-image deployment
description: How the API and UI are built into one container, and how to build it yourself.
---

Hivemind ships as **one image** that serves both the REST API and the Angular
web console on a single port. The Go binary **embeds** the compiled frontend, so
there's no separate web server to run or reverse-proxy to wire up.

## How it works

1. A multi-stage Docker build compiles the Angular app (`hivemind-gui`).
2. The build output is embedded into the Go binary via `//go:embed`.
3. The Gin server serves `/api` and, for everything else, the SPA — with a
   fallback to `index.html` so client-side routes (deep links, refresh) resolve.
   Unmatched `/api` paths stay JSON `404`s rather than returning the SPA shell.
4. The runtime image is a tiny static base containing just the binary.

```
┌─ frontend stage (node) ─┐   ┌─ backend stage (go) ─────────┐   ┌─ runtime ─┐
│ npm ci && ng build      │──►│ //go:embed dist + go build   │──►│ binary    │
└─────────────────────────┘   └──────────────────────────────┘   └───────────┘
```

## Build it yourself

The frontend lives in a separate repo, so CI checks it out alongside the backend
and builds in one context:

```bash
# from the hivemind repo, with hivemind-gui checked out into ./gui
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t open226/hivemind:dev \
  .
```

Locally (single arch, load into Docker):

```bash
git clone https://github.com/open226bf/hivemind-gui.git gui
docker buildx build --platform linux/amd64 -t hivemind:local --load .
```

## CI

The `build-image` workflow checks out both repos, builds the multi-arch image,
and pushes it to the registry on the default branch and on tags. It needs two
secrets for the registry: `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.

## Why root by default

The runtime image runs as **root** so a bind-mounted `/var/run/docker.sock` (for
the local direct-mode cluster) is readable — the socket is `root:docker`.
Deployments that only use remote (mTLS) or agent clusters can override the user
to run unprivileged.
