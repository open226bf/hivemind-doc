---
title: Reverse proxy (HAProxy & nginx)
description: Front Hivemind with a reverse proxy that terminates TLS and correctly forwards the live streams (SSE) and the web terminal (WebSocket).
---

Hivemind serves the API and the web UI from a single port (default `8080`). In
production you put a reverse proxy in front to terminate HTTPS. The proxy must
also forward two long-lived connections correctly:

- **SSE** (`text/event-stream`) — the live service status stream
  (`GET /api/v1/services/{id}/status/stream`). This is plain HTTP/1.1: no special
  upgrade, but the proxy must **not buffer the response** and must allow a
  **long read timeout**.
- **WebSocket** — the interactive web terminal
  (`GET /api/v1/services/{id}/exec`). The proxy must forward the `Upgrade`
  handshake and allow a long tunnel timeout.

:::tip[Graceful degradation]
The UI uses SSE for a reactive, push-based experience but **falls back to
polling automatically** if the stream can't be established (for example a proxy
that buffers or blocks `text/event-stream`). Live status keeps working either
way — correct proxy config just makes it instant and cheaper.
:::

## Why SSE (not WebSocket) for live status

SSE is one-directional (server → browser) and rides on ordinary HTTP, so it
traverses proxies without an `Upgrade` handshake or per-tunnel tuning, and the
browser's `EventSource` reconnects on its own. WebSocket is reserved for the
terminal, where bidirectional streaming is actually required.

## HAProxy

```text
frontend https-in
    bind :443 ssl crt /etc/haproxy/certs/hivemind.pem
    mode http
    option forwardfor
    http-request set-header X-Forwarded-Proto https
    default_backend hivemind

backend hivemind
    mode http
    server app 127.0.0.1:8080 check

    # SSE + WebSocket are long-lived. Without generous timeouts HAProxy will
    # cut the stream; the heartbeat Hivemind sends every ~15s is not enough if
    # the client/server timeouts are short.
    timeout server 1h
    timeout tunnel 1h
```

```text
defaults
    mode http
    timeout client 1h        # long enough for idle SSE/WebSocket connections
    timeout connect 5s
    # Do NOT enable response buffering for the SSE route. HAProxy streams by
    # default; just avoid 'option http-buffer-request' style buffering on it.
```

If you split routes, keep `timeout tunnel` high on the backend that serves
`/api/v1/services/*/exec` (WebSocket) and `timeout server`/`timeout client` high
for `/api/v1/services/*/status/stream` (SSE).

## nginx

```nginx
server {
    listen 443 ssl;
    server_name hivemind.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;

        # WebSocket (web terminal)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # SSE (live status): disable buffering, allow a long read.
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 1h;
    }
}
```

```nginx
# In http {} — map the Upgrade header so WebSocket upgrades are forwarded.
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

Hivemind already sends `X-Accel-Buffering: no` on the SSE response, which nginx
honours; `proxy_buffering off` is the belt-and-braces equivalent.

## Checklist

- [ ] TLS terminated at the proxy; `X-Forwarded-Proto: https` set.
- [ ] Read/tunnel timeouts ≥ a few minutes (1h recommended) on the API backend.
- [ ] Response buffering **off** for the SSE route.
- [ ] WebSocket `Upgrade`/`Connection` headers forwarded.
- [ ] Verify: open a service's **Supervision** tab — the "live" indicator should
      stay on and counts update without a full refresh. If it falls back to
      polling, re-check buffering and timeouts.
