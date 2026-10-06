# Made Beside — computational studio edition

## Binding brief

The user rejected both prior paper-and-geometry storyboards as boring and unlike the references. The latest request is to build immediately, continue without stopping, and achieve an extremely similar appearance to Jordan's Archives or Artefakt with a Made Beside identity. Artefakt is the chosen structural reference. The earlier paper-first composition and screenshot-based gradient opening are superseded. No previous visual system is imported into the new entry point.

Audience and purpose remain business owners and growing brands, with an immersive identity first and work/enquiries next. No decorative eyebrow text, invented clients, invented outcomes or unrelated reference sites.

## Appearance and sequence

- Near-black #121111, paper-white #f5f5f0, brand green #16db65. DM Sans remains the text family. The intact supplied wordmark appears in navigation; its silhouette also becomes a character-rendered identity.
- A viewport-height black micro-grid opening, large ASCII wordmark centered across roughly 88% of the viewport, compact white wordmark at upper left, square Menu control at upper right. Tiny functional motion controls and a short two-column studio statement sit near the lower edge.
- Edge-to-edge cinematic scenes follow the opening. A newly coded green brand motion study and existing photography carry actual media captions at their lower corners. Pointer motion creates localized pixel displacement; leaving the scene returns the original composition.
- An oversized identity statement with media skew/occlusion, then large typographic service rows with expandable detail. No bordered cards, floating panels, light template sections or repeated sales grids.
- A substantial green-on-black enquiry close and a computational wordmark footer. A full-screen dark menu shares the same visual system.

## Pages and data

Rebuild home, Work `/portfolio/`, Services `/capabilities/`, About `/approach/`, Contact `/contact/` and all four existing `/services/<slug>/` routes. Preserve current public policies, owner studio, portfolio API and contact API. Retain existing service data and scope limitations. Render CMS work safely, merge real static photography/film entries, and omit placeholders from public work. The existing Vimeo film remains an opt-in external playback path; local download is unavailable because Vimeo returned a privacy error.

## Motion and failure behavior

One shared animation scheduler owns the requestAnimationFrame loop. Intersection visibility, document visibility and pause/reduced-motion state control scene work. DPR is capped at 1.5. Pointer forces are bounded and recover after leave. Logo sampling and media dimensions are cached on resize, not measured in the frame loop. WebGL is confined to the original brand study; a static green brand surface is its fallback. Character/logo and photography effects use local Canvas 2D data, without third-party film sampling.

Native scrolling remains the navigation owner. Scroll changes skew/reveal progress reversibly without trapping the visitor. Touch uses direct selection/drag controls, and keyboard controls remain usable. Menu traps focus, supports Escape and restores focus. The motion button pauses every renderer. Images, headings, service content and enquiry controls remain server-rendered and readable when effects fail.

## Completion evidence

Compare actual browser captures against Artefakt's opening proportions, black grid, character-built identity, full-width media rhythm, tight type, anchored metadata and dark menu. If the old paper/form layouts remain recognizable, revise before showing. Test bounds, spring recovery, media cover cropping and portfolio filtering with Node tests. Run the existing backend/SEO suite and production build. Inspect desktop and mobile renders, menu/keyboard behavior, pointer leave, scroll reversal, gallery selection, and pause/reduced-motion behavior. Do not infer performance or accessibility conformance from a successful build.
