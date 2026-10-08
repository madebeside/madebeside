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

## Page-specific composition and interaction refinement

Each of the eight supporting routes now has a stable, distinct desktop and phone tile arrangement. Stability is intentional: the composition does not change on reload. Social and digital marketing also reverse the playbook columns; content production and strategy use different column proportions.

The dot fields emit bounded, fading cursor/tap ripples in the route accent color, with a centered local cursor. Canvas scaling uses axis-aligned pointer mapping. Fields render only near the viewport and pause for reduced motion. Scroll drives hero parallax, word reveals, chapter text and geometry entrances, and accent progress rules. Original connected blocks, windows and joining paths replace the reference-like circular orbit diagrams. Geometry loops pause offscreen.

Validation: production build and77 automated checks pass; all eight routes checked at desktop and390px, with no horizontal overflow. Homepage components were not changed.

## Scribble artwork and exaggerated tile motion

Supporting-page diagrams now use relevant hand-drawn film, camera, conversation, compass, calendar, chart, editing, sharing, handshake, search and channel icons. Hero fields use eight distinct softened brand-form masks with route-specific pairs. Tile rows and columns have unequal proportions; scroll offsets are individually staggered, reversible, and static with reduced motion. Pointer mapping accounts for the moving/scaling tile. Short desktop headings and brand icons scale with viewport height to preserve readability.

Validation:79 tests pass. All eight desktop and390px routes have no horizontal overflow. Reduced-motion and1366x600 clipping checked; native nav and homepage remain unchanged.

## Connected stagger correction

Tile containers remain untransformed and opaque at every scroll position. The shared first-row boundary extends by up to260px during the opening scroll, holding the title in place while other content moves at different rates. The lower row remains attached to the growing upper row. Mobile keeps a continuous static grid. This replaces the separated translate/scale tile treatment. Browser checks confirm continuous area coverage across all eight supporting routes and a fixed title position during the hold.
