# Made Beside — white project sequence

## Intent and authority

The homepage is a quiet, content-led introduction for business owners and growing brands. It should make the work memorable, then invite an enquiry. The user liked the existing character animation but rejected the layout after it. Their latest direction replaces the dark, fullscreen sequence with a white editorial page inspired heavily by Shortscut and Monolog.

This is an architectural presentation change inside the existing website. The user's ongoing instruction to keep working until the reference direction is achieved supersedes additional approval handoffs. This document records the concrete direction; it does not claim the user reviewed a written artifact they have not seen. Execution remains native in the existing isolated checkout. Publishing is outside this request.

## Chosen design

Three approaches were considered: a fullscreen pinned player; a rigid grid of project cards; a continuous editorial sequence. The continuous sequence matches the requested landscape media, restrained height, side copy, and visible neighbouring projects. It combines Shortscut's focus/opacity changes with Monolog's generous two-column composition. No fullscreen player or scroll snapping is needed.

The opening reproduces the supplied image's atmosphere: centered, modest two-line DM Sans text, exactly “Good things,” and “made beside.” The existing character renderer is applied to those words in ink. It keeps bounded cursor repulsion and changing glyphs. The background is a soft green, lavender and peach gradient. A transparent fade extends past the hero into the white foundation; its rectangle never ends with visible colour.

Below it, three project placeholders use one consistent grid: approximately 32% copy, 68% landscape video. Each media frame uses 16:9, with a desktop maximum height of 62svh. Media moves in normal document flow. Copy remains beside its own media. White space separates projects without panels or alternating page colours. Neighbouring media fades toward 22.5% opacity and 97% scale; focused media returns to full opacity and scale. Copy never disappears. A 0.2-second opacity and 0.6-second scale handoff follows the nearest visible project; small reversible vertical movement follows scrolling directly. Mobile uses copy above landscape media, retaining the same hierarchy without pinned content.

Placeholder titles are “Project 01”, “Project 02”, and “Project 03”; formats are Brand film, Social series, and Campaign film. Each explicitly says Placeholder. Their original looping geometric films use DM Sans and Made Beside's green, ink and paper. They imply no clients, results or completed commissions. No wedding photography or wedding film is rendered on the homepage or work page.

The homepage ends with a compact white invitation and footer. There are no service dropdowns or agency accordions. The intact logo, simple global navigation, contact route, and motion control remain. Supporting pages share the light palette; service explanations become static editorial text.

## Motion architecture

Direct study on 2026-10-06 found Shortscut's public script uses Lenis lerp 0.165, a shared GSAP ticker, linear scroll scrubbing, inactive video opacity 0.225, and scale 0.97. Its project handoff pauses the outgoing video and plays the incoming one. Monolog also feeds Lenis from its GSAP ticker and uses linear scroll-driven transforms. These are source observations, not a claim of measured frame rate.

Use the installed Lenis 1.3.11 with autoRaf disabled, lerp 0.165 and wheelMultiplier 1. A priority subscription advances it before the existing scene subscriptions on the site's sole RAF scheduler. No second scroll animation loop or extra scrub smoothing is introduced. Touch and keyboard keep native scrolling. A project hook reads layout on resize, then uses cached document coordinates, scroll position, opacity and transforms per frame. React updates only when the focused project changes. Only that film loops.

Manual pause and reduced motion destroy smooth scrolling, display all project copy/media at full opacity with no transforms, and pause automatic films. User-started media remains independently controllable. Hidden/offscreen media pauses. Renderer failure preserves text and posters.

## Boundaries

- `AsciiWordmark`: reusable transparent character renderer for the original logo or the two-line opening text.
- `useSmoothScroll`: one Lenis lifecycle, subscribed to the existing clock before scenes.
- `project-motion`: pure viewport focus and transform calculations.
- `ProjectSequence({paused,pieces,featuredOnly=false})`: semantic project rows, published content or explicit empty-collection placeholders, and scroll focus; `ProjectFilm`: playback and accessible pause/play control.
- `project-placeholders`: explicit temporary content, separate from published CMS data.
- Existing contact/portfolio APIs, SSR, metadata and backend contracts remain.

## Verification

Test motion focus reversal, scale/opacity bounds, pause fallback, and priority ordering before implementation. Run the complete existing suite and production build. Inspect desktop and mobile in the real browser, including the gradient handoff, consecutive projects in both scroll directions, media playback, motion pause, navigation, keyboard focus, and absence of wedding assets/agency dropdowns. Save screenshots. Report browser observations separately from frame-rate claims and hosting status.

## Final verification

Implementation and browser evidence are recorded in `docs/white-sequence-review.md`. Both dimensions are constrained at the desktop height cap to preserve 16:9. Published CMS/SSR content remains available; wedding defaults are excluded. The original DM Sans text remains sharp at rest and receives changing cells and a localized cursor disturbance. A fresh source review and its regression fixes were completed; 31 tests pass. The local design branch remains available for further visual review.
