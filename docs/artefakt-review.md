# Made Beside computational edition — review record

The rejected paper/form studies were replaced by a new public entry point. Artefakt is the structural reference: black micro-grid, character-built identity, compact fixed navigation, full-width media, anchored captions, oversized tight type and dark full-screen menu. The new graphic uses Made Beside's actual wordmark and palette; photographs are existing work. No reference brand assets or footage were copied.

## Implemented systems

| Capability | Delivered behavior |
|---|---|
| Identity | Cached Canvas character reconstruction of the actual wordmark, subtle glyph change and bounded pointer displacement |
| Media | Localized pixel displacement with recovery, full-width photography, opt-in existing Vimeo film link/player |
| Spatial composition | Original WebGL extrusion of the paired brand form; reversible perspective/crop in the identity section |
| Showcase | Spring photography reel with drag, buttons and keyboard controls; paused release settles immediately |
| Motion ownership | One RAF scheduler, per-scene visibility gates, document visibility, renderer fault isolation and fallback callbacks |
| Navigation | Full-screen menu, focus containment, Escape and focus restoration; genuine public route links |
| Accessibility alternatives | DOM identity/media fallback, native headings/forms, pause and system reduced-motion preference, scoped session choice across routes |
| Public integration | Home, Work, Services, About, Contact, four service pages, current portfolio/contact APIs and owner studio preserved |

## Observed browser checks

- Desktop opening, actual wordmark pointer displacement, 3D scene and photography pixel smear inspected against the live Artefakt reference and supplied recording audit.
- Menu opening, Tab to Services, Escape close and focus return observed.
- Work filters remove/reintroduce gallery content. Next photograph changed 01 to 02; keyboard Right while paused changed 02 to 03.
- A paused setting remained active after Services → About navigation in the current build. Reloading after server rebuild is required; an older still-loaded client initially obscured this check.
- Mobile Home, Work and Contact inspected at 390 × 844. About overflow checked at 320 × 800 and 768 × 1024. Service detail inspected at 1440 × 900. Reported page widths equaled viewport client widths in these checks.
- Service disclosures and navigation to Content Production inspected. No broken loaded images were found in the tested gallery.
- Initial and final browser logs were empty. Final captures are in `output/artefakt-review`; the opening was compared directly with the live reference and adjusted lower/wider to match its proportions.

## Review fixes

One independent read-only whole-branch review identified homepage placement, shared-renderer exception propagation, paused drag release, and background looping-video resumption defects. All four were reproduced by failing tests, fixed and checked with the complete suite. The final math/data/lifecycle suite contains nine tests alongside the original thirteen backend and SEO tests. Final production build succeeded; the full suite passed 22/22 with zero failures. The original source checkout's Git status was clean.

## Decisions retained

- Follow the user's latest request to build and continue without further design approval handoffs. This overrides the earlier storyboard process; the isolated branch remains recoverable.
- Use an isolated local clone because native worktree creation had no repository in the chat's multi-project root. Later integration requires transferring this branch; the original source checkout was preserved.
- Keep plan bookkeeping in native Windows files because the bundled Bash launcher mishandled drive paths. The durable review record is committed here.
- Global Pause stops site effects and automatic local loops. Explicitly started Vimeo playback remains under its own controls; extending Pause to it would require the Vimeo player API.
- Preserve the completed rebuild locally on `design/artefakt-rebuild`; no publish, shared-branch merge or push was requested.

## Limits

Production build and full tests are the release checks. Browser inspection is not a measured Core Web Vitals result, a 60 fps guarantee, or a formal accessibility audit. Real touch hardware, 200% zoom, blocked-font behavior and forced WebGL context loss were not exercised. The WebGL loss/restoration and static fallbacks were inspected in source. Vimeo's public configuration request returned a privacy error; end-to-end film playback is not confirmed. Existing notification configuration and production deployment were not changed.
