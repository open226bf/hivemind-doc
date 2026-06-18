---
title: Security model
description: How Hivemind authenticates users and agents, and protects data at rest.
---

## At-rest encryption

Sensitive values — secret values and secret-flagged environment variables — are
encrypted with **AES-256-GCM** (random nonce per value) using the key from
`AES_KEY` (base64, 32 bytes). Cluster TLS material is encrypted the same way.

:::caution
Without `AES_KEY`, these values are stored **unencrypted**. Always set a real key
in production.
:::

Passwords are hashed with **bcrypt** (cost 12). Enrollment tokens are stored as a
SHA-256 hash and compared in constant time; the plaintext is never persisted.

## User authentication

JWTs are signed with **Ed25519 (EdDSA)**. The server validates the signing
method, issuer and expiry on every request. Set `JWT_PRIVATE_KEY_PATH` so the
key — and therefore issued tokens — survives restarts; otherwise an ephemeral
key is generated per boot.

## Agent authentication

The reverse tunnel that carries the Docker API (including secret and config
payloads during a deploy) is authenticated, not merely identified:

- **mTLS mode (production).** The agent presents a client certificate issued by
  Hivemind's internal CA. The certificate's common name is the cluster id and
  its serial gates revocation — re-enrolling rotates the serial and implicitly
  revokes the previous certificate.
- **Token mode (dev).** The agent presents the **enrollment token** in a header
  on connect, in addition to its agent id. The agent id alone (which the API
  exposes) is not enough to attach a tunnel.

Rotating or clearing the enrollment token (re-enroll, or switch the cluster to
direct mode) revokes existing tunnels.

## The web terminal

Browsers can't set an `Authorization` header on a WebSocket, so the interactive
`exec` terminal authenticates with a **single-use, short-lived ticket** obtained
over a normal (header-authenticated) request. The long-lived access token never
travels in a URL or proxy log.

## Transport

Run Hivemind behind TLS in production. The agent hub and remote-daemon
connections use mutual TLS; the user-facing API should be fronted by a reverse
proxy terminating HTTPS.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. See the
[SECURITY.md](https://github.com/open226bf/hivemind/blob/main/SECURITY.md) policy
for private disclosure.
