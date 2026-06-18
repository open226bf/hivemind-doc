---
title: Development setup
description: Get a local Hivemind dev environment running and send your first change.
---

Hivemind spans three repos. This page gets all three running locally.

## Prerequisites

- **Go 1.25+**
- **Node 22+**
- **Postgres** (local install or a container)
- Optional: a Docker Swarm (`docker swarm init`) — without it the backend uses a
  stub orchestrator.

## Backend (`hivemind`)

```bash
git clone https://github.com/open226bf/hivemind.git && cd hivemind
cp .env.example .env          # set DATABASE_URL, AES_KEY, ADMIN_*
go mod download
make run                      # serves /api on :8080
```

Useful commands:

```bash
make test            # go test ./...
go vet ./...
staticcheck ./...    # honnef.co/go/tools/cmd/staticcheck
gofmt -l .           # should print nothing
```

## Frontend (`hivemind-gui`)

```bash
git clone https://github.com/open226bf/hivemind-gui.git && cd hivemind-gui
npm install
npm start            # http://localhost:4200, proxies /api to :8080
npm test             # Vitest via the Angular builder
```

The dev server proxies `/api` to the backend (`proxy.conf.json`), so log in at
`http://localhost:4200` against your local control plane.

## Agent (`hivemind-agent`)

```bash
git clone https://github.com/open226bf/hivemind-agent.git && cd hivemind-agent
go test ./...
go run ./cmd/agent   # needs HIVEMIND_SERVER + enrollment env to do anything
```

The agent is normally deployed onto a cluster via the generated install command;
running it locally is mainly for unit work on the tunnel/config.

## Making a change

1. Open an issue for non-trivial work.
2. Branch from `main` (`feat/…`, `fix/…`).
3. Keep it green: tests, `go vet`, `staticcheck`, `gofmt`.
4. Use [Conventional Commits](https://www.conventionalcommits.org/).
5. Open a PR and fill in the template.

See the repo [CONTRIBUTING.md](https://github.com/open226bf/hivemind/blob/main/CONTRIBUTING.md)
for the full guidelines, and the
[Architecture deep-dive](/hivemind-doc/contributing/internals/) for how the code
is organised.
