---
title: Architecture deep-dive
description: How the control-plane code is organised and where to add things.
---

This page is for contributors who want to add a feature or a backend. It assumes
you've read [Architecture](/hivemind-doc/concepts/architecture/).

## Layers

```
internal/
├── domain/        entities + invariants, no I/O, no framework imports
├── ports/         interfaces the application depends on
│   ├── driven.go        Orchestrator, AgentHub, registry, cipher…
│   └── repositories.go  one repository interface per aggregate
├── application/   use cases: validate, call ports, return domain types
└── adapters/
    ├── api/         Gin handlers, DTOs, middleware (auth, RBAC, cluster scope)
    ├── persistence/ GORM models + repository implementations
    ├── orchestrator/Swarm orchestrator (direct + over-tunnel) and registry
    ├── auth/        JWT, key loading, agent CA, exec tickets
    └── agenthub/    in-memory tunnel session registry
```

**The dependency rule:** arrows point inward. `domain` imports nothing from the
project; `application` imports `domain` and `ports`; `adapters` implement
`ports`; `cmd/server` wires concrete adapters into use cases.

## Adding an endpoint

1. If it's new behaviour, add the use case in `internal/application`.
2. Add or extend a handler in `internal/adapters/api/handler`. Map domain errors
   with the shared `writeError(c, err, notFound)` helper — don't write a new
   per-handler error switch.
3. Register the route in the handler's `Register` with the right
   `middleware.RequireRole(...)`.
4. Add request/response DTOs in `internal/adapters/api/dto` and Swagger
   annotations.
5. Cover it with a test.

## Adding a cluster backend

The `Orchestrator` port is the seam. To support a new backend (e.g. Kubernetes):

1. Implement `ports.Orchestrator` in a new adapter package.
2. Add a `cluster.Type` discriminator and handle it in the registry's `build`.
3. The rest of the system — handlers, use cases, UI — is unchanged, because it
   only depends on the port.

## Error mapping

Cross-cutting errors (not-found, conflict, forbidden, cluster mismatch,
orchestrator unavailable, and the 500 fallback) live in one helper
(`handler.writeError`). A handler only maps its **domain-specific** validation
and conflict sentinels, then delegates. Keep new handlers to that pattern.

## Real-time

- **SSE** carries server→client events (status, deployment progress). It works
  through plain HTTP proxies and auto-reconnects, which is why it's preferred for
  live updates.
- **WebSocket** is used only where the channel is genuinely bidirectional — the
  interactive `exec` terminal.

## Tests

- Pure domain/application logic: table-driven unit tests, no I/O.
- Adapters: focused tests with fakes (see `agenthub`, `auth`, repositories).
- Bug fixes ship with a regression test.

## Conventions

- `gofmt` + `goimports` clean; `go vet` and `staticcheck` with no findings.
- Wrap errors with `%w`; never leak internals to API clients.
- Comments explain *why*. Don't restate the code.
