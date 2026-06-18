---
title: Your role & permissions
description: What you can do in the console as a Viewer, Operator, or Admin — and how to get more access.
---

Hivemind has three roles. Each one **includes** everything the role below it can
do. Your role is shown in the account menu (top-right).

| Role | In one line |
|------|-------------|
| **Viewer** | Read-only — see everything, change nothing. |
| **Operator** | Run the platform's day-to-day: deploy and manage apps. |
| **Admin** | Everything, plus the privileged/infra actions. |

## What each role can do

### Viewer

- Browse services, deployments, history, live status, tasks, and **logs**.
- View networks, volumes, secrets (values are masked), configs, templates, hives,
  clusters, and the dashboard.

### Operator (everything a Viewer can, plus…)

- **Create, edit and delete services**; set environment variables, resources,
  placement and ports.
- **Deploy, redeploy and undeploy** services; create **snapshots** and **roll
  back**.
- **Attach/detach** networks, secrets and configs to services.
- Manage **configs** (create versions, restore, delete) and **hives** (grouping).
- **Instantiate templates** into new services.

### Admin (everything an Operator can, plus…)

- Manage **clusters**: add, edit, set default, test connectivity, and
  [enroll agents](/hivemind-doc/operations/enroll-an-agent/) for NAT'd clusters.
- Create, rotate and delete **secrets**; create/delete **networks** and
  **volumes**; create/edit/delete **templates**.
- Manage **users** and roles.
- Open the **interactive web terminal** into a container.

:::note[Why some "create" actions are Admin-only]
Operators can *attach* an existing secret to a service, but only Admins can
**create or rotate** the secret itself — the sensitive material is gated to a
smaller group. Configs (non-sensitive) are fully Operator-managed.
:::

## If you can't do something

Buttons for actions above your role are hidden or disabled, and the API returns
a clear "insufficient permissions" error. To get more access, ask an
**Admin** to update your role under **Users**. Every denied attempt is recorded
in the audit log.
