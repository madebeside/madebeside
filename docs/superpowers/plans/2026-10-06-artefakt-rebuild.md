# Computational Studio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the rejected visual direction with an Artefakt-like, fully functioning Made Beside website.

**Architecture:** A new React entry uses compact scene components, one animation scheduler, Canvas 2D wordmark/media effects and one bounded WebGL brand scene. Public routes use current business data and preserve the current Worker interfaces.

**Tech Stack:** React 19.1.1, Vite 7.1.7, existing Worker and Node tests, native Canvas/WebGL.

**Spec:** `docs/superpowers/specs/2026-10-06-artefakt-rebuild-design.md`

## Global Constraints

- Near-black #121111, paper-white #f5f5f0, brand green #16db65. DM Sans remains the text family.
- One shared animation scheduler owns the requestAnimationFrame loop.
- DPR is capped at 1.5.
- No decorative eyebrow text, invented clients, invented outcomes or unrelated reference sites.
- Preserve current public policies, owner studio, portfolio API and contact API.

## Review Focus

- Extremely long CMS titles wrap and remain safe in initial HTML.
- Menu closure and route navigation restore normal focus and scrolling.
- Missing images/WebGL leave readable brand content and controls.
- Motion preference changes stop every renderer without blanking scenes.
- Portrait media at narrow widths preserve a useful crop and gallery controls.

---

### Task 1: Scene math and truthful portfolio selection

**Files:** Create `client/archive/motion.js`, `client/archive/work-data.js`, `tests/archive.test.mjs`.

**Interfaces:** `coverRect(sw,sh,cw,ch)` returns `{x,y,w,h}`; `pointerForce(px,py,x,y,radius,max)` returns `{x,y}`; `springStep(position,velocity,target,dt)` returns `{position,velocity}`; `selectWork(items)` returns only genuine unique pieces; `photographs` supplies seven local photograph URLs.

- [ ] Write tests pinning portrait cover crop, bounded pointer response, force outside the radius, finite spring recovery and placeholder exclusion.
- [ ] Run `node --test tests/archive.test.mjs`; expect missing new exports before implementation.
- [ ] Implement the pure functions and data without dependencies.
- [ ] Run the new tests; expect all pass. Commit this task.

### Task 2: Reference-led scenes and shared animation ownership

**Files:** Create `client/archive/scheduler.js`, `useCanvasScene.js`, `AsciiWordmark.jsx`, `PixelMedia.jsx`, `BrandField.jsx`, `ArchiveHome.jsx`, `ArchiveNav.jsx`, `ArchiveFooter.jsx`, `archive.css`. Modify `client/App.jsx`, `client/main.jsx`, `client/index.html`, `client/entry-server.jsx`.

**Interfaces:** Scene components accept `paused`; `PixelMedia` accepts `src`, `alt`, `className`; `AsciiWordmark` accepts `paused`, `className`; Home consumes Task 1 real work and Footer/Nav are shared by every route.

- [ ] Implement one scheduler and static image fallbacks, then canvas wordmark, local pixel media and green WebGL study.
- [ ] Replace the entry styles completely and build the Artefakt-like opening, full-width scenes, identity/services section and footer.
- [ ] Implement keyboard/Escape/focus trapping for the real menu and paused-renderer state.
- [ ] Build the client; expect no import or SSR errors. Inspect the rendered result privately and revise any remaining resemblance to the rejected designs.
- [ ] Commit the scene layer after Node math tests and build pass.

### Task 3: Public routes and supporting media controls

**Files:** Create `client/archive/ArchivePages.jsx`, `PhotoReel.jsx`, `Services.jsx`; modify `client/App.jsx`, `web/archive-static.css`, `scripts/build-client.mjs`, `package.json`.

**Interfaces:** Public pages receive `paused`, `pieces`, `collectionError`; service routes receive the existing service object. Existing Contact posts to `/api/contact` unchanged. Gallery consumes Task 1 spring behavior and seven photographs.

- [ ] Add Work filter controls, keyboard/touch gallery, Services/About/Contact and all service detail pages with the new visual system.
- [ ] Keep truthful enquiry success/error messages and add dark styling to public static policy pages.
- [ ] Include `archive.test.mjs` in the normal suite. Build all generated pages and Worker.
- [ ] Run the full suite; expect original contact/portfolio/SEO tests plus new effect/data tests pass.
- [ ] Inspect representative routes at desktop and 390px, then commit.

### Task 4: Visual and runtime acceptance

**Files:** Create `docs/artefakt-review.md` and browser screenshot artifacts under `output/artefakt-review`.

**Interfaces:** Consumes the built public site and direct Artefakt screenshots, not source-code assertions of design quality.

- [ ] Compare opening and scrolled compositions against the actual reference; revise until the shared visual language is unmistakable.
- [ ] Inspect keyboard menu, close/Escape, gallery buttons, filters, route links, pause, reverse scroll and mobile overflow.
- [ ] Run production build and full suite after final changes; inspect browser logs.
- [ ] Obtain one independent whole-branch review, resolve material findings and preserve the working local preview.
- [ ] Show only the inspected new result, with a screenshot and a concise statement of verification limits.
