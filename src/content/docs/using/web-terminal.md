---
title: The web terminal
description: Open an interactive shell into a running container from the browser.
---

The web terminal attaches an interactive TTY to a container of a deployed
service — handy for debugging without SSH-ing into a node. It requires the
**Admin** role.

## Open a session

1. Go to a deployed service and open **Tasks** (or the **Terminal** action).
2. Pick the target container.
3. A terminal opens; type as you would in any shell. Resize the window and the
   PTY follows.

By default the shell is `/bin/sh`; many images also have `/bin/bash`.

<figure class="hm-shot" data-shot="An interactive web terminal open on a container, inside the service detail page"></figure>

## How it's secured

Browsers can't set an `Authorization` header on a WebSocket, which historically
meant putting the access token in the URL (and into proxy logs). Hivemind avoids
that:

1. The console asks the API for a **single-use, short-lived ticket** over a
   normal, header-authenticated request (Admin-gated).
2. It opens the WebSocket with that ticket. The server validates and **consumes**
   it (one use), then upgrades the connection.

The long-lived access token never leaves a request header. The ticket is bound
to the service and expires in seconds, so even if it were logged it's useless.

## Behind a reverse proxy

The terminal uses a WebSocket, which needs the proxy to honour the HTTP
`Upgrade` handshake. For HAProxy/nginx this is standard `Connection: upgrade`
handling. Live **status** updates use SSE instead, which passes through plain
HTTP proxies without special configuration.

## Limitations

- The session targets one container; for multi-replica debugging, pick the task
  you care about.
- Output is terminal-raw — interactive programs (editors, `top`) work; binary
  protocols don't.
