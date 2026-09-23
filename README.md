# Made Beside — Creative marketing, beside you.

React + Vite, GSAP ScrollTrigger and Lenis. DOM, CSS and SVG only. No canvas, WebGL, tracking or external fonts. Existing portfolio, owner studio, contact storage and policy routes are retained.

## Run and build

Node 24+, pnpm 11:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Open http://127.0.0.1:4173. For live frontend editing, keep that backend running and run `pnpm dev:client` in another terminal (port 5173). Keep the local server private. Run `pnpm test` for backend checks.

Build compiles React into `web/market`, writes its entry to the home, portfolio, capabilities, approach and contact routes, then bundles all routes into `dist/server/index.js`. Deploy the complete `dist` including hidden `.openai`. This is a Worker application, not a GitHub Pages-only static site.

## Edit content

Edit `client/config.js`:

- `name`, `email`, `year`: identity and contact.
- `bookingUrl`: leave empty for call requests; add a real scheduling URL to activate booking links.
- `services`: accordion descriptions and deliverables.
- `accent`, `paper`, `ink`: colours; recheck contrast after changes.
- `strengths`: concise company differentiators.
- `workPlaceholders`: the three full-screen media placeholders shown until published work is available.

Section copy is in `client/components/Chapters.jsx`, hero copy in `Hero.jsx`, dedicated page content in `Pages.jsx`, styling in `client/identity.css` and `client/welcoming.css`. MediaArtwork contains simple typographic placeholders, explicitly labelled. The old financial-theme components and config were removed. Fonts and licences are in `web/fonts`. Research, design principles and original image prompts are in `docs/new-identity-design.md`.

## Add photos and videos

Open `/studio/` on the hosted site while signed in as owner. Upload, describe and publish media. Published work appears in `/portfolio/` and the homepage (up to six pieces); drafts and archived pieces stay private. The hero uses original brand artwork, separate from the portfolio. Photos require alt text; speech videos require WebVTT captions. Upload limit: 20 MB per piece. For fast loading, optimise images to WebP under 150 KB and keep videos short and compressed. Production media is in R2 and metadata in D1, not in source archives. Do not reuse the archived rescue demonstration.

The contact form stores inquiries in D1. Call requests are marked in the message. They do not reserve an appointment, and the form does not email notifications. The existing studio manages portfolio media; inquiry review currently requires database access. A direct email link is also provided. Set bookingUrl when a scheduler is available.

## Motion decisions

The opening uses #121111, warm white and #16db65, with large sans-serif type over one original monochrome halftone photograph. No chrome treatment is combined with it. That same image contracts into the following statement composition; it is not repeated. The mobile layout keeps the image stationary.

A compact middle-left menu unfolds downward. Each icon independently reveals its own label to the right on hover or keyboard focus. Click/tap pins it open; Escape dismisses it. Destinations are separate pages: `/portfolio/`, `/capabilities/`, `/approach/` and `/contact/`. The portfolio filters real published media, services have a large-type sticky presentation, approach has a five-stage reading journey, and contact has the existing call-request form plus FAQ.

Desktop uses Lenis; phones use native scrolling. Pause motion and OS reduced-motion disable animated reveals and sticky portfolio stacking. CSS loops and GSAP pause on hidden tabs. Grain is a static SVG texture translated with CSS, at 0.18 opacity with a calmer 1.4-second loop. Photos expand in place and close on another click or Escape. Videos use native controls and pause off-screen. No fake showreel is presented.

## Validation / launch checklist

- [x] Production build: total JavaScript approximately 119 KB gzip, excluding fonts.
- [x] Six backend tests: contact validation/consent, retention, policy routes, owner-only writes, private drafts, publication, media accessibility.
- [x] Desktop and 390px responsive preview: layout, direct navigation, services and local call-request submission.
- [x] No canvas/WebGL or backdrop-filter. One self-hosted variable font; two original WebP images each under 120 KB; no autoplay clip.
- [ ] Physical mid-tier Android: record device/browser/date and scroll trace, sustained 60 fps target.
- [ ] Physical older iPhone: record device/iOS/date, touch navigation and reduced-motion test.
- [ ] Middling laptop: record device/browser/date and sustained scroll trace.
- [ ] Lighthouse mobile >=90: attach report and conditions.
- [ ] LCP <2.5 seconds: attach realistic mobile-network measurements.
- [ ] Repeat performance checks after real media is added.

Unchecked targets are not measured or guaranteed. Responsive browser previews are not physical-device tests. Existing policies remain; see `LAUNCH-REVIEW.md` for business/legal review items. No implementation can promise immunity from lawsuits.

## Hosting / recovery

Production requires D1 `DB`, R2 `BUCKET`, included migrations, and `PORTFOLIO_OWNER_EMAIL`. Owner authentication uses trusted Sites gateway identity. Implement equivalent authentication before changing hosts; never trust client-supplied identity headers.

Postal edition saved as tag `saved-before-market-redesign-2026-09-21`, and `../website-download/Spencer-B-Media-Postal-Opening-Saved.zip`. Source backups exclude live database records and media uploads. Keep `.sites-runtime`, dependencies, local databases and secrets out of Git.

The edition immediately before this redesign is archived at `../website-download/SpencerBMedia-Before-New-Identity.zip` (commit fadabc957f1c82a2eaeadda9c45a1eba47536d6f). It includes source and built static assets, not live uploads or database records. Older backups are retained in the same folder.

The edition before these page and hero changes is saved in `../website-download/SpencerBMedia-Before-Welcoming-Pages.zip` (commit afe4b72bf3c680f09e4303c36af458454c35e9b6). It excludes production uploads and database records.

