# Made Beside scrolling homepage redesign

## Purpose and design decisions

Present Made Beside’s creative work to business owners and growing brands through an expressive, uncluttered homepage, then lead into a project enquiry. Keep DM Sans, the established identity, white as the predominant background, and the connected mint/lavender/peach river gradient.

Confirmed in the interview: project videos play normally while scrolling selects projects; opening text grows beyond the viewport; the circle menu reveals Work, About, and Start a project; opening/footer lettering uses clean elastic motion; testimonials use the expanding bookmark accordion instead of the previous all-visible treatment.

The user’s “ok go ahead” accepts the recommended remaining choices: adapt the TasteLabs entrance to the existing headline and gradient rather than adding a card carousel; preserve the scroll sequence on mobile; play the entrance once per browser session. Reduced motion bypasses the entrance and pinned zoom.

## Page sequence

1. Brief entrance: oversized headline and gradient settle into the original centered composition.
2. Pinned opening: “The best things, are made beside you.” enlarges beyond the viewport while the gradient zooms more slowly.
3. An editing-software showcase rises over the opening. Scrolling advances through three projects; each active video plays normally.
4. The final editing composition makes an angled, layered handoff into bookmark testimonials, inspired by The Line.
5. A revised footer with an animated identity wordmark and a project enquiry button filled by a growing blob on hover.

The existing separate project sequence and interactive editing playground leave the homepage. Supporting pages and their existing enquiry routes continue to work.

## Opening and entrance

Use semantic DOM text in DM Sans, replacing the current ASCII canvas treatment on the homepage. Initial composition retains the supplied image’s centered two-line arrangement, with the exact requested sentence. The headline appears over the strongest version of the gradient.

Entrance choreography follows the supplied 4.23-second TasteLabs recording: oversized composition starts beyond the viewport, settles into its centered position, then reveals navigation and supporting UI. Apply this to the headline and gradient; do not reproduce the reference’s ring/card assets. Use elastic overshoot on lettering with slightly staggered words. Target roughly 1.3 seconds of settling, avoiding an artificial wait for asset downloads.

The entrance plays once per browser session. If session storage is unavailable, it still completes normally. Direct links into work or other sections bypass the entrance and do not reset the visitor’s position.

After entrance, ordinary document scrolling controls a sticky opening scene across approximately two viewport heights of extra scroll travel. Text and gradient have distinct scale curves: headline roughly 1 → 7, gradient roughly 1 → 1.65. These are initial tuning values; the final crop and smoothness must be reviewed visually. Reverse scrolling reverses the zoom. Do not trap wheel events or prevent keyboard/touch scrolling.

## Background and navigation

Replace visibly stepped river banks with a continuously feathered gradient treatment. Increase brightness and saturation moderately, keeping lavender and peach alongside mint. Preserve lateral bends and variation in width throughout the document rather than stretching one hero background downward. Content remains legible on predominantly white surfaces.

Remove the current header wordmark/actions, its white scrim, the II pause control, and the `:/ Menu` overlay. The only floating navigation is three horizontally aligned circles near the top right, on the same visible background as the page.

Hover or keyboard focus expands the circles leftward into Work (`/portfolio/`), About (`/approach/`), and Start a project (`/contact/`). Motion uses smooth custom Bézier easing and transient blur; labels settle sharply. Preserve a stable interaction region so links cannot escape the pointer during the transition. Touch opens the same links by tapping the circle control; Escape/outside interaction closes them. Keep proper button/link names, visible focus, and a skip link. Respect the system reduced-motion setting without a visible pause control.

## Scroll-only editing showcase

Create one editing-workspace stage with three scroll-selected project states. A restrained, light editing interface surrounds a large landscape preview: a project/media list, preview title and timecode, thin dividers, and an editing timeline with three project clips and a playhead. Use the existing three branded motion placeholders until actual projects are supplied. Clearly label these as placeholders; do not imply real client work or fabricated results.

The first workspace surface rises vertically over the sticky opening, matching Made Beside’s native opaque cover mechanism. Once the workspace is in position, scroll progress selects the project and advances the visual sequence. The active preview plays normally; inactive previews pause. Timing, project title, selected clip, and active media-list item stay synchronized. Scroll progress drives the timeline selection; it does not scrub video frames.

The workspace contains no click/hover controls, draggable clips, fake working buttons, carousel arrows, or editing tools. Its timeline and media list are visual scaffolding with accessible descriptive text. Scrolling is the sole project-selection interaction. No cursor icon suggests dragging or clicking here.

Give each project enough scroll travel to establish its composition and enough stationary screen time to begin viewing its video. Use subtle preview/content offsets and opacity transitions; avoid hard scroll snapping. On mobile, retain the scroll sequence with a compact media list, full-width preview, and simplified timeline. Reduced motion presents three ordinary stacked project previews with no pinned zoom or rotated transitions.

## Showcase-to-testimonials handoff

Use a layered, scroll-proportional handoff inspired by The Line’s final project exit and following section entrance. The last workspace tilts/moves away as the testimonial surface arrives and settles. Keep rotational travel modest enough to avoid empty corners and content clipping. This handoff is distinct from the straight upward cover entering the showcase. Decorative motion must not prevent reading or normal scrolling.

## Bookmark testimonials

Use the Neue Montreal section’s adjoining, square-edged panels with vertical spines, large numbers, thin dividers, and one expanded panel. Use three panels, not eleven dummy attractions. Apply Made Beside colors. The first panel opens initially; hovering/focusing another expands it while the others narrow. Content slides in and fades over approximately 0.75 seconds with `cubic-bezier(.65,0,.15,1)`. Keyboard focus must retain the selected panel; leaving pointer interaction must not hide a focused quote.

On mobile, use stacked bookmark rows that expand on tap, with an accessible button and expanded state. Content remains reachable without hover. Existing notes are explicitly testimonial placeholders, not invented customer quotations. No fabricated attribution or metrics may be introduced. Real reviews can replace the data later without changing the layout.

Remove all filler phrases named in the request. Retain only a concise section title and the clearly identified placeholder content necessary to demonstrate the layout. No eyebrow text or extra explanatory promotional paragraphs.

## Footer and project enquiry

Recompose the footer around a large invitation, Start a project, email, compact navigation/social links, and the oversized Made Beside identity wordmark. Remove TorontoClock and its location/time block. Animate the existing identity wordmark with the same clean elastic arrival language as the opening when the footer enters view; keep the actual logo asset, rather than replacing its identity with generic text.

The Start a project button fills from a small circular origin into a growing blob on hover/focus and retracts smoothly. Keep its label legible throughout and its existing enquiry destination. No stock photo thumbnail inside the button.

## Component boundaries and motion lifecycle

Opening owns entrance and zoom progress. Showcase owns project selection and active video lifecycle. Bookmark testimonials own expanded state. Navigation owns hover/focus/touch expansion. River background remains page-wide; the opening’s local zoom layer visually joins it. Footer owns its reveal and invitation treatment.

Reuse the existing shared animation scheduler and scroll system. Avoid adding a second smooth-scroll owner, permanent per-component frame loops, or new dependencies. All observers, media listeners, animation registrations, and video playback state must clean up on unmount. Measure geometry on resize rather than reading layout each frame. Reduced-motion changes must update at runtime.

## Verification and acceptance

- Test scroll progress boundaries and reversal, selection of exactly three projects, and active/inactive video lifecycle.
- Test entrance session behavior and unavailable-storage fallback where behavior is extracted into logic.
- Test circle menu keyboard/touch behavior and bookmark expanded-state accessibility.
- Run the existing repository suite and production client/server/worker build.
- Inspect desktop/mobile opening, three showcase states, handoff, bookmarks, and footer in a working browser. Check focus, reverse scroll, deep-link entry, and reduced motion.
- Compare motion against the supplied recording and code-supported references. Do not claim exact source easing or measured smoothness from still frames.
- If the browser runtime remains unavailable, report that limitation explicitly; passing tests/builds do not establish visual fidelity.

## Reference evidence

Made Beside’s published portfolio implements opaque, consecutively stacked sticky panels for its upward cover. The Line’s published animation module uses scroll-proportional translation/rotation for project exit and following section entrance. Neue Montreal’s published component implements a hover-expanded bookmark accordion with 0.75-second easing. Unknown Collective provides word-level entrance motion, but its published headline is not itself a pinned scroll zoom; the zoom and additional bounce are the user’s requested adaptation.

TasteLabs’s entrance was inspected using frames from the supplied recording. The observed scale/rotation/reveal sequence is established; exact easing and renderer are unverified. Public live browser animation inspection was blocked by a Windows browser runtime startup error.
