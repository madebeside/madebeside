# Timeline and Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Extend the white Made Beside homepage with a functional film timeline, honest review placeholders, subtle gradient continuity and oversized closing identity.

**Architecture:** Pure timeline calculations feed one local transport hook and a presentational editing section. A separate manual review carousel and site-wide footer reuse existing typography, assets and animation controls.

**Tech Stack:** Existing React 19.1.1, Vite 7.1.7, Lenis 1.3.11 and shared RAF scheduler. No new dependency.

**Spec:** `docs/superpowers/specs/2026-10-06-timeline-and-reviews-design.md`

## Global Constraints

- Exact headline: “The best things, are made beside you.”; line break after “things,”; pointer radius 44px.
- DM Sans; ink #121111, green #16db65, paper #f5f5f0; white foundation with transparent washes.
- 32-second timeline, 8-second clips, 3 tracks, initial starts 0/8/16 on tracks 0/1/0.
- Label all temporary videos and reviews; invent no testimonials, clients or results.
- Local-only editing, no autoplay, hidden/offscreen pause and explicit manual playback under reduced motion.
- Preserve existing published project, contact, SEO and privacy contracts; no deployment.

## Review Focus

- Large drag distances and invalid time input must keep clips/time inside the edit.
- Overlapping clips must show the highest track; gaps must show a readable empty frame.
- A clip source change or failed load must not leave the old film playing or a blank preview.
- Keyboard and touch visitors must be able to edit/select without page overflow.
- Placeholder reviews must remain visibly labelled during every carousel state.

### Task 1: Timeline model and transport

**Files:** Create `client/archive/timeline-model.js`, `client/archive/useTimelineTransport.js`, `tests/timeline.test.mjs`; modify `package.json` and `client/App.jsx`.
**Interfaces:** `initialTimeline()` returns independent clip arrays; `moveTimelineClip(clips,id,start,track)` returns a clamped immutable arrangement; `timelineClipAt(clips,time)` returns the top visible clip or null; `timelineTime(value)` clamps to 0..32; `timecode(time)` formats mm:ss:ff at 30fps. `useTimelineTransport(clips,paused)` exposes refs and seek/toggle/stop/reset synchronisation to Task 2.

- [x] Write tests for bounds/NaN, no mutation, gaps, precedence, keyboard-equivalent deltas, independent reset and formatting; run `node --test tests/timeline.test.mjs`, expecting missing-module failure.
- [x] Implement the model and shared-clock transport with no autoplay, media-source guard, cleanup and direct DOM frame updates; exclude `data-timeline-film` from the legacy observer.
- [x] Run the model suite; expect all tests passing. Commit this task.

### Task 2: Editorial timeline and opening theme

**Files:** Create `client/archive/EditingTimeline.jsx` and `client/archive/timeline.css`; modify `ArchiveHome.jsx`, `AsciiWordmark.jsx`, `editorial.css` and `archive.css`.
**Interfaces:** Consume Task 1 functions and transport; `EditingTimeline({paused})` renders the three labelled placeholders and accessible editing controls.

- [x] Implement pointer capture with horizontal start/vertical track movement, arrow-key equivalents, click selection, native scrub range and reset. Render highest-track preview, readable gaps and recoverable failed media.
- [x] Set exact headline, 44px pointer radius and longer-line responsive fit; integrate subtle root gradient washes behind the white page.
- [x] Build client/SSR/Worker; expect exit 0. Verify desktop selection/play/scrub/drag/gap/reset/error and mobile keyboard/touch/overflow. Commit this task after checks.

### Task 3: Reviews and footer

**Files:** Create `client/archive/ReviewCarousel.jsx` and `client/archive/closing.css`; modify `ArchiveHome.jsx` and `ArchiveFooter.jsx`.
**Interfaces:** `ReviewCarousel({paused})` provides three labelled manual review slots; footer preserves `({paused,invite=true})`.

- [x] Build manual selector, previous/next and swipe with stable focus, explicit placeholder content and reduced-motion reveal.
- [x] Recompose footer invitation, real navigation/social/location, clock and oversized intact wordmark; preserve policies/back-to-top.
- [x] Run the full test suite and build; expect 0 failures/exit 0. Check desktop and 320/390/768/1440 layouts, review interactions and reduced motion. Commit this task.

### Task 4: Review and completion

- [x] Request one fresh whole-change review of base `6ac6c33` to final HEAD; fix material findings in one tested pass.
- [x] Re-run affected checks and full suite after fixes; preserve screenshots and verification notes, complete plan checkboxes and leave the local preview running.
