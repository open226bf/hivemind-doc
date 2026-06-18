# Hivemind Documentation

The documentation site for [Hivemind](https://github.com/open226bf/hivemind) — a
self-service deployment & supervision control plane for Docker Swarm. Built with
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/hivemind-doc
```

## Build

```bash
npm run build      # static site in ./dist
npm run preview    # preview the production build
```

## Structure

```
src/content/docs/
├── index.mdx          landing page
├── start/             introduction, quick start, installation
├── concepts/          architecture, clusters, resources, RBAC, security
├── guides/            deploy, agent enrollment, secrets/configs, snapshots, terminal
├── operations/        configuration, single-image, production checklist
├── reference/         REST API, environment variables
└── contributing/      development setup, architecture deep-dive
```

The navigation is defined in [`astro.config.mjs`](astro.config.mjs). Add a page
by dropping a Markdown/MDX file under `src/content/docs/` and adding it to the
sidebar.

## Contributing

Found something out of date or unclear? Edit the page (each has an "Edit" link)
and open a PR. See the main repo's
[CONTRIBUTING](https://github.com/open226bf/hivemind/blob/main/CONTRIBUTING.md).

## License

[Apache 2.0](LICENSE) © The Hivemind Authors.
