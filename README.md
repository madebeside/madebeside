# Made Beside website

Current edition: Made Beside portfolio and agency website, with DM Sans, a hover-driven film timeline, static client perspectives, and distinct supporting-page grids with brand-shaped dot fields and contextual scribble icons.

## Run locally

Use Node24 or newer and pnpm11:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

The local preview is served by `serve.mjs`. Its default port is4188. `pnpm dev:client` starts the Vite frontend for development. `pnpm test` runs all79 automated checks.

## Release

This repository builds a Cloudflare Worker with static assets, not a GitHub Pages site. `pnpm build` generates `dist/assets` and `dist/server/index.js`. Deploy the complete generated `dist`, including its hidden `.openai` directory, through the existing website hosting setup. Source upload by itself does not deploy the website.

Keep the existing database, storage, owner authentication and inquiry configuration when deploying. Production media remains in R2 and portfolio records remain in D1. Do not commit secrets or local runtime files. `wrangler.jsonc` retains the existing database binding. Review the hosting configuration for required R2, owner identity and email bindings before changing deployment providers.

## Current source

- Homepage: `client/archive/ArchiveHome.jsx`, `EditingShowcase.jsx`, `ReviewSpread.jsx` and associated styles.
- Supporting pages: `ArchivePages.jsx`, `ReferenceLayout.jsx`, `MadeRoom.jsx`, `aspen-pages.css`.
- Brand dot fields and scribbles: `AspenGeometry.jsx`, `scribble-art.js`.
- Service copy: `client/services.js`.
- Motion: shared display-frame scheduler and Lenis. Reduced motion is supported; the deliberately sampled treatment is limited to hover effects.
- Brand assets and local fonts: `web/identity` and `web/fonts`.

Project films, metrics and reviews remain clearly labelled placeholders where real content has not been supplied. Add approved client work and quotes before presenting them as proof. Upload published media through the existing `/studio/` owner interface.

Design and validation notes: `docs/aspen-supporting-pages.md`. Physical-device and production-network performance remain separate from the verified local browser checks. Older editions remain in Git history.
