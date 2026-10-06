# White editorial edition — review and evidence

The current local preview is http://127.0.0.1:4188/. This edition supersedes the former dark, fullscreen homepage. The original two-line “Good things, made beside.” opening returns, with DM Sans, a soft gradient, and localized character/cursor motion. Its transparent atmosphere extends beyond the hero into a white foundation.

Three original geometric motion placeholders replace the wedding defaults. Each has a clear Placeholder caption. Project copy sits beside landscape media in normal flow. The nearest visible project gets full opacity/scale; neighbours fade to 0.225 and scale 0.97. Focus handoffs use 0.2-second opacity and 0.6-second scale transitions. Small vertical drift is directly position-derived, without another scrub easing layer. The white closing invitation is compact. Agency information is static text, with no service or FAQ accordions.

## Reference study

The live [Shortscut homepage](https://shortscut.com/) and [Monolog homepage](https://bymonolog.com/) were inspected directly, including project scroll states and their public animation sources:

- [Shortscut animation source](https://cdn.odyn.dev/staging/nh8r/bundle.js): Lenis lerp 0.165, wheel multiplier 1.25, one GSAP ticker advancing Lenis, linear scroll scrubbing, active video playback, opacity 0.225 for inactive media, and scale 0.97.
- [Monolog animation source](https://cdn.odyn.dev/p/3pc9/bundle.js): Lenis duration 0.5 through a shared GSAP ticker and linear scroll-driven transforms. Its project layout uses generous media/context columns and restrained landscape media.

The implementation uses installed Lenis 1.3.11 through the existing sole RAF scheduler at priority -10. It advances before character scenes and project transforms. Wheel multiplier is 1 to avoid accelerating the visitor's input. Touch and keyboard retain native scrolling. Hash links have a navigation offset and transfer focus after scrolling. No reference client imagery, films, metrics, testimonials or brand assets were reused.

## Decisions

- Reused the existing pure motion module for project math, keeping the responsibility together.
- Kept published CMS/SSR content working. Static wedding gallery/Vimeo defaults are excluded; explicit placeholders appear for an empty collection. Private drafts stay private.
- Kept the original text sharp at rest with changing cells and a localized character disturbance under the pointer. The tiny all-character rendering was too faint at the requested text size.
- Used focus-triggered opacity/scale handoffs and direct scroll drift. This keeps adjacent films clearly subdued, without adding smoothing to scroll-driven movement.
- Kept exact 16:9 by constraining both media width and height at the 62svh desktop height cap.
- Preserved native inline controls and captions for published films; placeholder films have clear play/pause controls. Explicit play works while automatic motion is paused.

## Verification

- Production client, SSR and Worker builds succeeded. The runtime font URL warning is expected; the real browser confirms DM Sans is loaded.
- Full test suite: **31 passing**, including contact/portfolio/SEO, safe public content rendering, motion bounds and reversal, scheduler priority, placeholder selection, manual playback, offscreen stopping and media recovery markup.
- Three 8-second, 240-frame 960x540 MP4 placeholders rendered successfully; all decoded without FFmpeg errors. Poster artwork and browser playback were inspected.
- Real browser checks at 320px, 390px, 768px and 1440px: no horizontal overflow. Mobile stacks copy above landscape media. Wide desktop media retains 16:9.
- Opening, gradient handoff, cursor disturbance, forward/reverse project focus and adjacent opacity changes were visually inspected.
- Only the focused project starts automatic playback. Manual Play → Pause → Play was checked while global motion was paused, with paused-state results false → true → false. Manual pause persists; offscreen/hidden playback stops.
- Reduced motion was emulated in the actual browser: Lenis was absent, all films were paused, and all media had opacity 1 and scale 1.
- A blocked film request produced a visible explanation and Try again/Open film actions. After removing the temporary block, Try again recovered to readyState 4. An SSR error that occurs before hydration is also handled.
- Menu keyboard focus, Escape restoration, Work and Contact navigation were checked. Contact has its form, a white background and no accordions. Wedding sources do not appear in Home or Work DOM media.
- Temporary network, reduced-motion and viewport test overrides were cleared.

## Fresh review

A fresh read-only reviewer inspected 64cdab9..201f722 and identified two Important issues: repeated manual playback while global motion is paused, and missing recovery for a published film without a poster. Both received failing tests, production fixes and browser checks. The reviewer’s aspect-ratio minor was fixed as well. No critical findings or deferred minors remain from that review.

The reviewer declined source-only judgments of visual fidelity, seams, mobile clipping and FPS. Layout/seam/mobile checks were completed in the browser. No numeric FPS or Core Web Vitals claim is made. Hidden-tab return follows the automatic playback policy. Public media URLs remain generated by the existing backend. Long content can expand normal-flow rows; no clipping assumption was added. Font rejection keeps the readable fallback and is caught. Existing SSR content survives a failed CMS fetch. Production publishing, real enquiry delivery, live CMS persistence and cross-browser certification are outside this local-preview verification.

Screenshots are saved in `output/white-sequence-review/`: opening-desktop.jpg, project-sequence-desktop.jpg, opening-mobile.jpg and work-mobile.jpg.
