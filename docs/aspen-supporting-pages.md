# Aspen-inspired supporting pages

Scope confirmed by the user: Work, What we do, Our approach, Contact and the four service pages. The homepage remains unchanged.

## Reference study

Observed the live Aspen Search homepage and its scroll transitions on 2026-10-07. Retrieved the 35 unique public Next.js JavaScript/CSS assets listed by that page into `output/reference-study/aspen-code/`; excluded analytics. Private source and unrelated routes were not accessed.

The reference uses a bordered half-width grid with quarter-width content tiles, animated dither fields, masked text entrances, a sticky left introduction beside a scrolling right-hand list, and independent media parallax. Its delivered modules use Motion `useScroll` / `useTransform`, offsets from `start end` to `end start`, mirrored ±120px parallax values, cubic-bezier easing, and Lenis smooth scrolling. The dither module defers loading and limits activation rather than animating every offscreen scene.

The implementation uses original Made Beside copy and geometry, existing DM Sans and route accents. It adapts those layout and movement patterns through the existing shared scheduler and smooth-scroll owner. Downloaded source was studied, not executed or shipped.

## Changes

- Removed the film-camera image section and its repeated playbook image from every supporting route.
- Replaced the oversized black introduction with a split grid of title, two animated monochrome fields, copy and a Made Beside accent tile.
- Added progressive word-opacity reveals to the overview text.
- Replaced stacked photo chapters with a pinned left title and dark, numbered right rows, animated geometry, masked headings and explicit service links.
- Portfolio uses a pinned left introduction beside its existing films; the inquiry form and collapsible questions retain their behavior and copy.
- Canvas updates are visibility-gated, limited to 30fps, bounded to 900px rendering width and cleaned up on unmount. Paused/reduced-motion scenes render statically; narrow screens use ordinary document flow.

## Verification

Production build and the 75-test suite passed. The obsolete placeholder-image assertion now checks for branded geometry and absence of the removed image while preserving all service copy. Browser checks cover desktop/mobile overflow, heading count, sticky behavior, service navigation, FAQ interaction and reduced-motion treatment. Code review found a dark-row keyboard focus contrast issue; a white focus outline was added. Existing Lenis scroll remains deliberately active, consistent with the reference.

Local preview only; no deployment or push.
