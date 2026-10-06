# Editing Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native implementation.

**Goal:** Turn the film timeline into a distinctive working editing table and show every review in a styled spread.
**Architecture:** Extend the pure timeline model with source-aware editing and immutable history. The existing transport consumes offset, layer visibility and speed; the section owns draft pointer edits. A replacement review component owns only local pin/tilt state.
**Tech Stack:** Existing React/Vite/shared scheduler, no new dependency.
**Spec:** `docs/superpowers/specs/2026-10-06-editing-playground-design.md`.

## Global Constraints

- Keep white gradients, DM Sans, #121111, #16db65, #f5f5f0 and the current opening/footer.
- 32-second timeline, 8-second sources, 3 layers, minimum clip duration 0.5 seconds.
- Local resettable edits; 40 undo states; no invented client work or testimonials.
- Manual playback under reduced motion; elapsed timing, offscreen/hidden stop and recoverable failures.
- Every review is rendered simultaneously; no carousel/accordion.

## Review Focus

- Trimming/splitting must never seek outside source media or break source continuity.
- Pointer cancellation, no-op edits and undo must not corrupt the arrangement or create misleading history.
- Layer visibility/source switching/playback rate changes must synchronise the actual preview.
- Empty arrangements and overlaps must remain understandable and editable.
- Dense controls and film strips must remain keyboard-accessible and contained at 320px.

### Task 1: Editing model and transport

**Files:** `timeline-model.js`, `timeline-history.js`, `useTimelineTransport.js`, `tests/timeline.test.mjs`.
**Interfaces:** `trimTimelineClip(clips,id,edge,time,snap)`, `splitTimelineClip(clips,id,time,newId)`, `addTimelineClip(clips,assetId,newId,time,track)`, `duplicateTimelineClip(clips,id,newId)`, `shuffleTimelineClips(clips)`, existing move/selection helpers plus optional snap/hidden layers/rate. History has `{past,present,future}` through create/commit/undo/redo functions. Transport exposes `getTime` and consumes `{hiddenTracks,speed}`.

- [x] Write and run failing model tests for trim bounds, split offsets/continuity, source instance creation, snapping, history, hidden layers and speed.
- [x] Implement immutable helpers and source-offset/rate-aware transport; rerun model suite, expect all passing.

### Task 2: Film table

**Files:** `EditingTimeline.jsx`, `timeline.css`.
- [x] Recompose shelf/program monitor/film strips and context controls; implement draft move/trim, pointer cancellation, playhead dragging, keyboard equivalents and history.
- [x] Run build and browser checks for add/split/trim/duplicate/remove/shuffle/undo/redo/hide/speed/snap/zoom/empty/reset.

### Task 3: Review spread

**Files:** create `ReviewSpread.jsx`, `review-spread.css`; update `ArchiveHome.jsx`, remove `ReviewCarousel.jsx` and obsolete carousel CSS from `closing.css`.
- [x] Render all three styled notes, local pin toggles and bounded tilt; remove carousel affordances.
- [x] Verify all review text remains visible on desktop/mobile and with paused/reduced motion.

### Task 4: Verify and review

- [ ] Run full suite/build and responsive checks, commit implementation, request one fresh read-only review from the starting commit `a03ffc1`.
- [ ] Fix material findings with failing-then-passing tests, save screenshots/verification notes, complete this plan and leave the preview ready.
