---
title: Installation
description: Ways to run Hivemind — released image, docker compose, or from source.
---

## Released image (recommended)

A single image serves both the API and the web UI on port `8080`.

```bash
docker pull open226/hivemind:latest
```

Tags follow the build pipeline: `latest` (default branch), a semver tag per
release (`vX.Y.Z`), and a short-SHA tag per commit. The image is multi-arch
(`linux/amd64`, `linux/arm64`).

## Docker Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: hivemind
      POSTGRES_DB: hivemind
    volumes:
      - db:/var/lib/postgresql/data

  hivemind:
    image: open226/hivemind:latest
    depends_on: [db]
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://postgres:hivemind@db:5432/hivemind?sslmode=disable
      AES_KEY: ${AES_KEY:?set a base64 32-byte key}
      JWT_PRIVATE_KEY_PATH: /keys/jwt.pem
      ADMIN_EMAIL: admin@example.com
      ADMIN_PASSWORD: ${ADMIN_PASSWORD:?set an admin password}
      APP_ENV: production
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./keys:/keys:ro

volumes:
  db:
```

Generate the persistent JWT key once so tokens survive restarts:

```bash
mkdir -p keys
docker run --rm open226/hivemind:latest genkey > keys/jwt.pem   # if the image ships genkey
# or: openssl genpkey -algorithm ed25519 -out keys/jwt.pem
```

## From source

Prerequisites: **Go 1.25+**, **Node 22+**, Postgres.

```bash
# Backend
git clone https://github.com/open226bf/hivemind.git && cd hivemind
cp .env.example .env        # edit DATABASE_URL, AES_KEY, ADMIN_*
make run                    # serves /api on :8080

# Frontend (dev server with API proxy)
git clone https://github.com/open226bf/hivemind-gui.git && cd hivemind-gui
npm install && npm start    # http://localhost:4200
```

To build the combined single image yourself, see
[Single-image deployment](/hivemind-doc/operations/single-image/).

## Running as root vs. non-root

When the **default cluster** uses direct mode against a bind-mounted
`/var/run/docker.sock`, the container must be able to read that socket
(`root:docker`). The published image runs as root for this reason. Deployments
that only use **remote** (mTLS) or **agent** clusters can run it as a non-root
user.
