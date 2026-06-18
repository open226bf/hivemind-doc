# Screenshots

Drop UI screenshots here. They're served at `/hivemind-doc/screenshots/<file>`.

The docs reserve each spot with a placeholder whose label says **what to
capture**, e.g. in a Markdown page:

```html
<figure class="hm-shot" data-shot="The login screen"></figure>
```

To fill it, put the image in this folder and replace the placeholder with:

```html
<figure class="hm-shot">
  <img src="/hivemind-doc/screenshots/login.png" alt="The login screen" />
  <figcaption>The login screen</figcaption>
</figure>
```

The placeholder styling (`.hm-shot`) lives in `src/styles/hivemind.css` and uses
the Hivemind honey-amber palette. An empty `.hm-shot` shows the dashed
placeholder; once it contains an `<img>` the placeholder disappears.

## Guidance

- Capture at a consistent viewport (e.g. 1440×900), light theme, with the
  honey-amber accent visible.
- Prefer the demo/seed data over real secrets; never capture real credentials.
- Use descriptive file names that match the `data-shot` label
  (e.g. `service-supervision.png`, `enroll-agent-dialog.png`).

## Spots currently reserved

| Page | Screenshot |
|------|------------|
| using/first-login | login screen · console shell · dashboard |
| using/deploy-a-service | New service form · redeploy dialog + history |
| using/secrets-and-configs | env editor + attach secret |
| using/supervision | live counts view · tasks drawer |
| using/web-terminal | terminal in the browser |
| using/snapshots-and-rollback | snapshots list + rollback |
| operations/enroll-an-agent | enroll dialog + install command |
