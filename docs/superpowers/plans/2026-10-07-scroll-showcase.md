# Scrolling Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Rebuild Made Beside’s homepage as a fluid opening, scroll-only editing showcase, bookmark testimonials, and animated footer.

**Architecture:** Keep the current React application, routes, shared frame scheduler, and scroll owner. Separate opening progress, showcase progress, and bookmark/menu state; use sticky surfaces and scroll-proportional transforms rather than intercepting wheel input. Keep the river behind the complete document and use a matching local gradient for the opening zoom.

**Tech Stack:** React 19.1.1, Vite 7.1.7, Lenis 1.3.11, existing GSAP 3.13.0 where useful, Node’s test runner. No new dependencies.

**Spec:** [Approved design](../specs/2026-10-07-scroll-showcase-design.md), approved by the user on 2026-10-07.

## Global Constraints

- Keep DM Sans, the established identity, white as the predominant background, and the connected mint/lavender/peach river gradient.
- Exact opening sentence: “The best things, are made beside you.”
- Scrolling selects projects; videos play normally. No click/hover controls or cursor affordances inside the editing showcase.
- Preserve the existing three branded motion placeholders until real projects are supplied; identify them honestly.
- No fabricated testimonials, attribution, client work, locations, or results.
- Remove the named filler copy, header scrim/wordmark, visible pause/menu controls, separate homepage playground, and Toronto clock.
- Respect reduced motion at runtime. Do not trap wheel events or prevent keyboard/touch scrolling.
- Reuse the existing shared animation scheduler and scroll system. Clean up every observer, listener, subscription, and playback owner.
- Do not claim browser visual fidelity if browser runtime inspection remains unavailable.

## Review Focus

1. Deep links and history restoration: bypass entrance and select the correct showcase project without forcing scroll to zero; test in Task 1 and inspect in Task 6.
2. Storage denied and repeated visits: entrance completes without storage, and a recorded session skips it; test in Task 1.
3. Fast/reversed scroll and resize: progress remains finite/bounded, every selected project remains reachable, no stale geometry; test in Task 1 and inspect in Task 6.
4. Reduced motion and background tabs: videos pause appropriately and pinned/decorative motion releases; test in Task 4 and inspect in Task 6.
5. Pointer-to-keyboard/touch changes: menu and bookmark content remain reachable when hover is absent or pointer leaves a focused item; inspect in Tasks 2, 5, and 6.

## File Structure

- Create `client/archive/scroll-scenes.js`: pure progress and session entrance decisions.
- Create `client/archive/OpeningScene.jsx` and `opening-scene.css`: semantic headline, elastic entrance, differential zoom, sticky opening.
- Create `client/archive/EditingShowcase.jsx` and `editing-showcase.css`: scroll-owned editing workspace with three project previews.
- Create `client/archive/ShowcaseFilm.jsx`: automatic active-video playback, visibility and failure lifecycle, no interactive editing controls.
- Create `client/archive/ElasticWordmark.jsx`: viewport-triggered identity-wordmark reveal.
- Modify `ArchiveHome.jsx`: compose opening, showcase, and testimonial handoff; remove old sequence/playground imports.
- Modify `ArchiveNav.jsx`, `archive.css`, and `App.jsx`: circle menu and motion-preference ownership without a pause button or modal overlay.
- Modify `RiverAtmosphere.jsx` and `atmosphere.css`: brighter, continuously feathered page-wide river.
- Modify `ReviewSpread.jsx` and `review-spread.css`: bookmark accordion with honest placeholder data.
- Modify `ArchiveFooter.jsx` and `closing.css`: reorganized footer, animated original wordmark, blob invitation button, no clock.
- Create `tests/scroll-scenes.test.mjs`; modify playback tests as needed and add the new test file to `package.json`.
- Save actual verification results in `docs/superpowers/specs/2026-10-07-scroll-showcase-verification.md`.

## Task 1: Scroll and entrance decisions

**Files:** Create `client/archive/scroll-scenes.js`, `tests/scroll-scenes.test.mjs`; modify `package.json`.

**Interfaces:**
- `openingState(progress: number, reduced: boolean = false)` → `{textScale:number, backgroundScale:number, uiOpacity:number}`.
- `showcaseState(progress: number, count: number = 3)` → `{index:number, local:number, playhead:number}`.
- `shouldEnter({reduced, hash, scrollY, seen})` → boolean.
- `readEntrance(storage)` and `markEntrance(storage)` → safe session-state access using key `madebeside-entrance-v1`.
- Progress inputs are normalized; clamp nonfinite/out-of-range values safely. All consumers use these same names.

- [ ] Write failing tests named `opening scales at different rates and reverses`, `showcase reaches exactly three states across large jumps`, `entrance skips deep links and restored scroll`, and `denied storage does not prevent entrance completion`.
- [ ] Assert opening endpoints `(1,1)` and `(7,1.65)`; reduced motion always returns scales `(1,1)`. Assert showcase indices at progress 0, .5, 1 are 0, 1, 2 and all state values remain finite for negative/oversized/nonfinite inputs. Assert hash/restored scroll/reduced/seen bypass entrance; denied storage never throws.
- [ ] Run `node --test tests/scroll-scenes.test.mjs`; expect failures before functions exist.
- [ ] Implement the named functions. Use continuous playhead progress and project-local progress; do not map scroll to video currentTime.
- [ ] Run the focused tests; expect all pass. Include the file in the repository test script.
- [ ] Commit `feat: define scrolling scene progress and entrance lifecycle`.

## Task 2: Floating circle navigation

**Files:** Modify `client/archive/ArchiveNav.jsx`, `client/archive/archive.css`, `client/App.jsx`.

**Interfaces:** `ArchiveNav({pathname})` owns expansion and focus. `App` continues to own a `paused` boolean from system motion preference, but no longer owns modal-open state or a visible motion toggle. Supporting pages retain the same links/routes.

- [ ] Replace the old header/actions/overlay with three horizontal circles and links Work `/portfolio/`, About `/approach/`, Start a project `/contact/`.
- [ ] Make hover/focus expand leftward with transient motion blur and a custom Bézier transform. Keep a stable hit area; touch uses a named toggle button with `aria-expanded`. Escape/outside pointer closes the touch expansion; moving focus among links does not collapse it.
- [ ] Remove the header scrim and old pause/menu controls. Remove App’s body-lock/aria-hidden/modal state; continue to respect `prefers-reduced-motion` changes without stale stored pause preferences.
- [ ] Inspect mouse traversal, Tab/Shift+Tab, Escape, touch expansion, and supporting routes in the browser when available. Verify no full-page overlay or invisible focusable links remain when closed.
- [ ] Run the existing archive tests and build-client command; expect pass.
- [ ] Commit `feat: replace header controls with the circle menu`.

## Task 3: Brighter river and pinned opening

**Files:** Create `OpeningScene.jsx`, `opening-scene.css`; modify `RiverAtmosphere.jsx`, `atmosphere.css`, `ArchiveHome.jsx`; consume Task 1 functions and existing `subscribe(draw, active, onError, priority)`.

**Interfaces:** `OpeningScene({paused})` renders the semantic H1 and sticky zoom scene. Entrance state stays local; the page never resets scroll. Its gradient colors match the river.

- [ ] Replace the homepage ASCII headline with clean DM Sans, centered in two lines: `The best things,` / `are made beside you.`
- [ ] Apply approximately 1.3-second elastic settling to oversized words/gradient, with staggered words and later UI reveal. Check the safe session state; bypass for deep links, restored scroll, and reduced motion. Finish cleanly if storage is denied.
- [ ] Give the opening approximately two viewport heights of extra scroll travel, sticky viewport, differential scale from `openingState`, and reverse-scroll support. Subscribe only while necessary; measure top/height on resize. Do not read layout each frame.
- [ ] Feather the river continuously instead of showing discrete nested ribbon edges. Preserve winding geometry; brighten mint/lavender/peach moderately. Do not introduce an expensive full-document animated blur or separate abrupt section gradients.
- [ ] Remove the old root intro-gradient layer where superseded; join the local opening gradient into the same page-wide river visually.
- [ ] Run scroll/atmosphere tests; expect pass, preserving finite river geometry and cursor centering. Inspect entrance, crop, mobile, and reverse scroll when the browser works.
- [ ] Commit `feat: add the elastic opening and brighter continuous river`.

## Task 4: Scroll-only editing showcase and handoff

**Files:** Create `EditingShowcase.jsx`, `editing-showcase.css`, `ShowcaseFilm.jsx`; modify `ArchiveHome.jsx`, `video-lifecycle.js`, and `tests/archive.test.mjs` only if needed.

**Interfaces:** `EditingShowcase({paused,pieces})` consumes `selectEditorialWork(pieces,true)` and presents at most three selected projects, using the existing three placeholders when the collection is empty. `ShowcaseFilm({project,active,paused})` owns playback without click controls. `showcaseState` drives selection and visual timeline state.

- [ ] Write a failing meaningful lifecycle test: switching active project or hiding the document pauses the old film; returning visibility only resumes the active film; reduced motion pauses all automatic playback. Reuse the existing playback abstraction if it already satisfies these requirements.
- [ ] Run the focused lifecycle test and record whether new code is needed; do not duplicate a passing implementation just to create a test cycle.
- [ ] Build a light editing composition: left media/project list, large landscape program preview, title/timecode, dividers, and three visual clip tracks with a playhead. Keep all visual editor scaffolding inert and omit false interaction cues.
- [ ] Raise the showcase surface over the sticky opening with an opaque connected-background surface. Once covered, use one pinned workspace for three scroll-selected states; synchronize list/preview/clip selection and use restrained opacity/offset changes.
- [ ] Play only the active, visible film normally; no scroll scrubbing. Retain posters on autoplay refusal, and render an honest noninteractive failure message if media fails. Ensure old App video watching does not also own these films.
- [ ] Keep approximately one viewport of scroll travel per project. Add a compact mobile composition; reduced motion renders three ordinary stacked previews. Preserve project fragment destinations using measured scroll spacers for each project.
- [ ] Add the distinct final workspace-to-testimonials layered tilt/translation handoff. Keep incoming testimonial background covering all edges; release pinning cleanly outside the scene.
- [ ] Remove old `ProjectSequence`/`EditingTimeline` imports from the homepage, along with their homepage-only filler copy. Preserve any components still used on other routes.
- [ ] Run the new scene tests, archive tests, and production build; expect pass.
- [ ] Commit `feat: replace the playground with the scrolling editing showcase`.

## Task 5: Bookmark testimonials and footer

**Files:** Modify `ReviewSpread.jsx`, `review-spread.css`, `ArchiveFooter.jsx`, `closing.css`; create `ElasticWordmark.jsx`.

**Interfaces:** `ReviewSpread({paused})` owns `active` bookmark index and focus-aware hover/tap state. `ElasticWordmark({paused})` reveals the original `/identity/wordmark-source.png` when in view. Footer preserves existing enquiry/email/social/legal destinations.

- [ ] Replace the review cards with three adjoining panels: vertical spine, large number, thin divider, and one expanded body. Keep placeholder labels explicit and existing notes as placeholder content; do not introduce client names/quotes.
- [ ] Use approximately .75 seconds and `cubic-bezier(.65,0,.15,1)` for expansion/content entry. First panel opens initially. Pointer leave resets only when keyboard focus is not within another panel. Make keyboard/touch expansion expose proper named buttons and expanded state.
- [ ] Use stacked tap-expanded rows on mobile. Reduced motion still allows state changes without animated travel.
- [ ] Delete all requested filler phrases from rendered homepage content. Keep only concise section headings and necessary placeholder labels.
- [ ] Remove TorontoClock, reorganize invitation/navigation/social areas, and reveal the real identity wordmark with elastic motion. Use viewport observation and cleanup, not a permanent footer frame loop.
- [ ] Add growing-blob fill to Start a project on hover/focus, preserving contrast throughout, touch readability, and `/contact/` destination.
- [ ] Inspect all three bookmarks, keyboard focus plus pointer leave, touch rows, footer width, CTA, and reduced motion when a working browser is available. Run suite/build; expect pass.
- [ ] Commit `feat: add bookmark reviews and the elastic closing section`.

## Task 6: Full verification and review

**Files:** Verification document; fixes only to files owned by earlier tasks when evidence requires them.

- [ ] Run `node --test tests/contact.test.mjs tests/portfolio.test.mjs tests/seo.test.mjs tests/archive.test.mjs tests/timeline.test.mjs tests/atmosphere.test.mjs tests/scroll-scenes.test.mjs`; record actual counts and failures.
- [ ] Run the existing production build scripts, `node scripts/build-client.mjs` then `node scripts/build.mjs`; require successful client, SSR, and Worker outputs before completion claims.
- [ ] Restart only the task’s own local preview server if its SSR bundle is cached. Confirm the preview responds and includes the new component markup.
- [ ] Retry approved browser inspection once. If available, inspect desktop and narrow mobile sizes: session-first/repeat entrances; all three project states; reverse/fast scrolling; direct project links; resize mid-scene; bookmarks; menu focus/touch; footer; reduced motion and hidden-tab playback.
- [ ] Compare rendered motion to the recording and reference findings. Iterate any visibly dull, clipped, abrupt, or incorrectly timed composition before presenting it.
- [ ] Obtain a fresh whole-change review using the selected execution workflow. Fix substantiated issues and rerun affected checks. Do not modify unrelated routes or user files.
- [ ] Write the verification report with browser evidence or the exact browser limitation, build/test outcomes, and remaining material limitations. Never substitute a static render for actual scroll-interaction verification.
- [ ] Commit verified fixes/report and present the local preview with a concise summary of changes and checks. No deployment/push/merge is requested.

## Execution recommendation

Use **Native execution**: implement the six tasks in this session, then obtain one independent whole-change review. The tasks share scroll geometry, background layering, and focus/playback ownership, so a single implementer can tune the sequence consistently without transferring the same context between implementers. The reviewer should focus on lifecycle, access, and scene handoff defects.
