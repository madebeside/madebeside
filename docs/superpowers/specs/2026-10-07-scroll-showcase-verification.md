# Scrolling showcase verification

## Implemented

- Clean DM Sans opening with once-per-session elastic entrance, pinned scroll zoom, and separate background scale.
- Brighter, feathered winding river; opaque cover scenes reuse the same SVG artwork at document coordinates.
- Floating three-circle menu, revealing Work, About, and Start a project; old header scrim, pause button, and modal menu removed.
- Scroll-only editing workspace with three normally playing placeholder films, synchronized project selection, and visual sequence/playhead.
- Layered final-project handoff into three expanding bookmark review placeholders.
- Reorganized footer, original identity wordmark with elastic reveal, growing-blob enquiry button; no clock.
- Named filler copy removed from rendered homepage. Existing supporting routes remain available.

## Fresh checks

- Full repository suite: **64/64 passed**, including Vite-loaded server-rendered homepage integration tests.
- Five review regressions were observed failing before the fixes: project fragment alignment, reduced-motion semantic visibility, mobile placeholder disclosure, pre-hydration media error handling, and exact headline whitespace. All passed afterward.
- Production client, SSR, and Worker builds passed. Vite reports the font URL is resolved at runtime; the served DM Sans asset returned HTTP 200.
- Restarted only this task’s preview server. Current local preview: `http://127.0.0.1:4188/`.
- Served homepage returned HTTP 200 and contains the new opening, editing workspace, bookmark panels, and elastic footer wordmark. The exact H1 text is “The best things, are made beside you.”
- The old header/pause/clock controls and the checked filler phrases are absent from served HTML.
- All three placeholder films, DM Sans, contact, portfolio, and approach routes returned HTTP 200.
- `git diff --check` passed; Git emitted only its existing LF-to-CRLF normalization notices.

## Independent review and corrections

One fresh, read-only review covered source range `271401c..3529952` and independently ran the then-current 59-test suite. It found no Critical issues and four Important issues. One fix pass corrected them:

1. Removed obsolete native/Lenis header offsets so direct project fragments select their own project.
2. Kept visible reduced-motion figures exposed to assistive technology while automatic playback remains paused.
3. Added placeholder disclosure to the program header, which remains visible on mobile.
4. Added initial `video.error` inspection, error-event ownership, failure-state reset on source change, and cleanup.

The headline whitespace finding was treated as an exact-copy requirement rather than deferred polish and corrected with a rendered-text regression test. No minor code findings remain deferred.

## Verification limits

Both supported browser runtimes failed to start with “trusted Node process exited unexpectedly.” No current desktop/mobile screenshots or live scroll recordings could be obtained. The browser-testing skill's available fallback was followed: source/served-HTML inspection and tests, with the runtime limitation disclosed.

The review explicitly declined to establish exact easing/crop, perceived smoothness, background continuity, mobile fit, actual focus traversal/restoration/background-tab behavior, or fidelity to the references through visual observation. Those claims remain unverified. Helper tests, rendered HTML, source review, and successful builds do not substitute for those browser checks.

The supplied TasteLabs recording was inspected frame by frame earlier; its oversized-to-settled reveal sequence informed the entrance. This is a Made Beside adaptation, not a claim of identical rendering or easing.

## Execution decisions

- Reused the existing separate `design/artefakt-rebuild` checkout and its preview instead of creating another worktree. The local task commits preserve recovery; the original OneDrive checkout was not changed.
- Used native Windows commands for plan bookkeeping instead of Bash helper scripts. The plan-owned ledger and test records used the same structure; no product behavior changed as a result.
- Preserved this local branch and preview. No deployment, push, merge, or PR was requested or performed.
- Browser-dependent judgements remain explicitly unverified, with the cost that visual timing, mobile fit, and reference fidelity still need live review when the runtime is available.
