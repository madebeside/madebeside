# Cover and playbook revision

This revision supersedes the room scene described in made-room-reference-study.md.

## Source study

Reopened Leonardo's live homepage and inspected the locally retrieved public motion modules again. The study covers the delivered front end, not private source.

- `2aee12afa90864e2.js`: scrolling timelines normalize measured element bounds into progress; sticky timelines distinguish an inner element from its outer travel region.
- `67c0670d9a89aece.js`: reusable upward reveals combine opacity and vertical movement with one-second Power2 easing; scale-and-rise presets animate media separately from copy.
- `fdab95134f165d6e.js`: the hero's sticky content fades during a later timeline segment; heading lines enter on separate delays; other title graphics enter horizontally from opposite sides.
- `ce7ea768457b1133.js`: overlapping media cards enter from different vertical offsets, using large numbered compositions and independently animated media. The media player has a named view transition.
- `1e520e306e9d0c37.js` and `44e4f37aedcc2b7f.js`: browser view-transition support appears in framework internals. Its presence alone does not prove every route uses a custom page transition.

## Implementation

The initial page title stays sticky while the actual content panel below it rises over the introduction. The title eases upward and fades underneath the panel. Removed the previous statements, helper link, Toronto lettering and central shapes; each supporting route uses its own large page title plus a smaller Made Beside accent.

The old three-column playbook is replaced by large alternating media/copy chapters. Chapters stack on sufficiently tall desktop viewports, with independently eased media and masked upward-moving words. Static origins keep arrival measurements stable when sticky cards are resized. Small screens and short desktop viewports use a normal readable flow. Paused and reduced-motion modes retain all content with static transforms.

## Validation

Production client/SSR/native builds and all 75 tests passed. Updated the obsolete three-column assertion to verify the new cover, every chapter and preserved visible service content. Browser checks confirmed hero top remains zero while the original next panel moves upward, alternating panel colors/media order, all eight supporting routes without horizontal overflow at 390px, and normal card flow on a 900×600 viewport. Read-only review identified a pause lifecycle issue, which was corrected with a paused-dependent effect and cleanup.

No deployment or push performed.
