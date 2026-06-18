---
title: First login & a tour of the console
description: Sign in to the Hivemind web console and find your way around — the cluster switcher, navigation, and the dashboard.
---

This page is for anyone who uses the Hivemind **web console** day to day —
whether you deploy your own apps or operate the platform for a team. It assumes
someone has already [installed Hivemind](/hivemind-doc/start/installation/).

## Sign in

Open the Hivemind URL in your browser and sign in with the email and password
your administrator gave you.

:::note[First admin]
On a brand-new install, the bootstrap admin is created from the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` the server was started with. Sign in with those, then change
the password and create real accounts under **Users**.
:::

Sessions are short-lived for safety: your access token lasts ~15 minutes and is
**refreshed automatically** in the background, so you normally stay signed in.
If your session can't be refreshed (you've been away a long time), the console
sends you back to the login screen — just sign in again; your work in the
platform is saved server-side.

<figure class="hm-shot" data-shot="The Hivemind login screen (email + password)"></figure>

## The layout

Once in, every page shares the same frame:

- **Top bar** — the **cluster switcher** (which cluster you're working in) and
  your **account menu** (role, sign out).
- **Left sidebar** — navigation between sections: Dashboard, Services, Hives,
  Networks, Volumes, Secrets, Configs, Templates, Deployments, Clusters, and
  (for admins) Users.
- **Main area** — lists and forms for the section you're in.

<figure class="hm-shot" data-shot="The console shell: top bar with cluster switcher + account menu, the left sidebar, and the main area"></figure>

## Pick your cluster

Hivemind can manage **one or many** clusters, so almost everything is scoped to
the **active cluster** chosen in the top-bar switcher:

- **A cluster is selected** → lists show only that cluster's resources, and
  anything you create lands there.
- **"All clusters" is selected** → lists **aggregate** every cluster (handy for
  an overview). If you create something while in this mode, it goes to the
  **default cluster**.

:::tip
If a list looks empty or shows resources you didn't expect, check the cluster
switcher first — you're probably scoped to a different cluster.
:::

## The dashboard

The **Dashboard** is your at-a-glance view of the selected cluster: node health,
how many services are running, recent activity, and the catalog of resources. It
**updates on its own** every few seconds, and you can pause auto-refresh with the
toggle.

<figure class="hm-shot" data-shot="The dashboard for a selected cluster: node health, running services, recent activity"></figure>

## What's next

- [Your role & permissions](/hivemind-doc/using/roles/) — what you can do.
- [Everyday workflows](/hivemind-doc/using/workflows/) — the common tasks.
- [Deploy a service](/hivemind-doc/using/deploy-a-service/) — the core loop.
