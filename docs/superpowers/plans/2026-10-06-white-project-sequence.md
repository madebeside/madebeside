# White Project Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the gradient opening and deliver a quiet white portfolio sequence with reference-informed motion.

**Architecture:** Extend the existing shared scheduler for ordered subscribers. Lenis advances first; the transparent ASCII opening and editorial project sequence follow on the same clock. Original, clearly labelled looping placeholders replace wedding assets.

**Tech Stack:** React 19, Vite 7, installed Lenis 1.3.11, Canvas 2D, DM Sans, local geometric MP4 placeholders.

**Spec:** `docs/superpowers/specs/2026-10-06-white-project-sequence-design.md`

## Global Constraints

- White page foundation; DM Sans; ink #121111, green #16db65, paper #f5f5f0.
- Exact two-line hero: “Good things,” / “made beside.”
- No wedding assets, fake clients/results, agency dropdowns, eyebrow text or fullscreen project stages.
- Media 16:9, maximum desktop height 62svh; normal document flow.
- One RAF owner, Lenis autoRaf false, lerp 0.165, wheelMultiplier 1.
- Off-focus media opacity 0.225, scale 0.97; paused/reduced motion full opacity and no transform.
- Preserve contact and backend contracts; local preview only.

## Review Focus

- Reverse scrolling gives the same focus state at the same position.
- Large scroll jumps cannot exceed opacity/scale bounds.
- Pause retains readable text and still media, with native page scrolling.
- Resize recalculates media positions without visual cutoffs or overflow.
- No asset/player failure removes project context or poster controls.

### Task 1: Shared timing and focus math

**Files:** modify `client/archive/scheduler.js`; create `client/archive/project-motion.js`, `client/archive/useSmoothScroll.js`; modify `tests/archive.test.mjs`.

**Interfaces:** `subscribe(draw, active, onError, priority=0)`; `projectVisual(top,height,viewport,paused=false)` returns opacity, scale, y and focus; `useSmoothScroll(paused)` owns one Lenis instance.

- [ ] Add failing tests for centered/far media, reversal and large jumps, pause output, and clock priority.
- [ ] Run `node --test tests/archive.test.mjs`, inspect the expected failures.
- [ ] Implement bounded pure math and priority ordering; integrate Lenis into this scheduler before scenes.
- [ ] Run the full suite; verify all tests pass.
- [ ] Commit this task's implementation and tests.

### Task 2: Opening and editorial projects

**Files:** modify `AsciiWordmark.jsx`, `ArchiveHome.jsx`, `App.jsx`; create `ProjectSequence.jsx`, `ProjectFilm.jsx`, `project-placeholders.js`, `editorial.css`, and local placeholder MP4/poster assets.

**Interfaces:** `AsciiWordmark({paused,text?,className})` retains a visible fallback; `ProjectSequence({paused})` uses `projectVisual` and explicit placeholder records; `ProjectFilm({project,active,paused})` loops only the focused placeholder and provides a labelled control.

- [ ] Create the three original geometric loops and posters. Inspect decoded poster frames.
- [ ] Extend the renderer with a DM Sans text mask and transparent clear operations; keep cursor effects bounded.
- [ ] Replace the homepage sequence with the supplied opening phrase and three two-column rows. Extend the gradient's transparent tail past the hero.
- [ ] Use cached row positions and one subscription for focus, opacity, scale and small reversible drift.
- [ ] Verify text/poster fallbacks, hidden-tab pause, keyboard controls, and full-opacity pause mode in the browser.
- [ ] Commit the task after the complete suite and build pass.

### Task 3: Consistency and review

**Files:** modify `ArchiveFooter.jsx`, `ArchivePages.jsx`, `Services.jsx`, `archive.css`, `web/archive-static.css`, `client/index.html`; record review in `docs/white-sequence-review.md`.

- [ ] Replace the work page's wedding content with the same explicit placeholders; make service explanations static.
- [ ] Make shared navigation, footer, supporting pages and static documents light; simplify the closing invitation.
- [ ] Run the complete suite and production build; restart the owned local preview and reload the browser.
- [ ] Inspect desktop, 390px mobile and 320px layouts; verify project focus forward/reverse, gradient continuity, pause/play, navigation and overflow. Save screenshots.
- [ ] Request the required fresh whole-change review and resolve material findings.
- [ ] Commit validated changes and report the local preview with evidence and remaining limits.
