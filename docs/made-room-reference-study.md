# Made Beside room and timeline revision

## Reference study

Studied Leonardo's publicly delivered homepage on 2026-10-07. The browser exposed 38 Next.js script chunks and 10 stylesheets; all 48 were retrieved and scanned locally in `output/reference-study/leonardo-code/`. This is the delivered homepage front end, not private source or an exhaustive crawl of every route. Tracking and consent scripts were excluded.

The hero module `fdab95134f165d6e.js`, stylesheet `5481e13ecaa9d095.css`, and scrolling hooks `2aee12afa90864e2.js` / `5ed00e6fc16f416a.js` use a sticky perspective scene, normalized scroll progress, depth/scale/rotation/opacity changes, viewport measurements and visibility-gated ticking. Gallery code also uses eased interpolation rather than directly attaching a heavy computation to each wheel event. Downloaded source was read, not executed or incorporated into the application bundle.

The implementation adapts those mechanics with our existing shared motion scheduler, cached measurements, exponential interpolation, IntersectionObserver and ResizeObserver. Its words, layout, assets and motion values are our own. The scene uses the actual Beside Arch and Joining Bend polygons from the local Made Beside social kit. Typography remains DM Sans; each supporting page retains its assigned accent. Toronto and “Made in this room” stay visible in the introduction. On mobile and reduced motion the scene becomes a static introduction.

## Timeline and navigation

- Added the existing transparent Made Beside wordmark at top left, linking to `/`.
- The active project becomes a zero-width, hidden, disabled ruler button; remaining bars grow into the available space with a Bézier transition.
- Mouse activation requires actual pointer movement and a short transition guard, so moving hitboxes cannot repeatedly select projects under a stationary pointer.
- Tab moves through the remaining film controls and into the details. Arrow keys and native button activation select projects; Escape returns to the overview.
- All three projects have different views, impressions, engagement and lead counts. These remain explicitly labelled illustrative sample metrics.

## Verification

- Production client, SSR and native asset builds passed; 130 native assets included.
- All 75 existing and new tests passed. New tests check distinct metrics and bounded/reversible room motion, including reduced motion.
- Browser checks confirmed logo navigation, zero-width active film, equal-width remaining bars, stable hover, project-specific metrics, normal Tab progression and Arrow selection.
- Desktop scroll changed room depth/rotation/opacity and reversing returned it to the initial transform.
- All eight supporting routes had one H1 and no horizontal overflow at 390px. Reduced motion produced a static one-viewport introduction.
- Read-only review found a Tab focus loop; it was fixed and re-reviewed without further material findings.

Local preview only. No deployment or push performed.
