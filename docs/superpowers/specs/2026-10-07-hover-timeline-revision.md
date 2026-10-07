# Hover timeline revision

This revision supersedes the opening zoom, scroll-selected editing workspace, global river gradient, angled page handoff, and bookmark testimonials in the earlier scrolling-showcase design. It follows the user's latest screenshots and recording, with the angled moving review ribbons explicitly confirmed in chat.

## Current behavior

- Restored the existing AsciiWordmark datamosh-style headline and its small cursor effect. Exact headline remains “The best things, are made beside you.” Normal scrolling replaces all opening zoom/pinning.
- Confined a greatly reduced green gradient to the opening. Removed the page-wide river. The page after the opening uses #ffffff, with black/green content surfaces and monochrome shadows. No orange or lavender UI accents remain in these sections.
- Replaced the editor workspace with a dark rounded timeline inspired by the supplied Butter screenshot. Hover, focus, or tap expands a film; the others collapse into rounded thumbnail strips. The expanded film plays normally and the others pause. There is no scrubbing, playhead control, drag interaction, or fake editing toolbar.
- Added keyboard arrows and Escape, with arrow navigation based on the focused tile even when hover selects another film. Mobile collapsed targets retain a minimum 44px width and height.
- Replaced bookmark reviews with three large angled type ribbons moving in alternating directions. Reviews remain clearly identified placeholders. Duplicate moving text is hidden from assistive technology while each full note is provided once.
- Removed The Line-style section choreography. Added a rounded white page ending with a restrained monochrome edge shadow before the footer.
- Preserved the circle navigation, enquiry routes, blob button hover, and animated identity wordmark.

## Verification

- All 67 repository tests passed.
- Production client, SSR, and Worker builds passed. The known font URL build notice remains; the asset is served at runtime.
- Live desktop browser inspection verified the faint hero, dark rounded timeline, expanded film, thumbnail masks, moving review bands, and rounded page ending.
- Real hover input expanded Project 02 and then Project 03. Inspection showed the selected video playing while both other videos were paused.
- A phone viewport of 390 CSS pixels was emulated using the supported browser capability. Tap expansion played the selected film, the page had no horizontal overflow, and inactive thumbnail targets remained at least 44px wide. Temporary viewport and motion overrides were reset afterward.
- ArrowRight after mixed pointer/keyboard selection initially reproduced a focus mismatch. After the fix, both focused control and expanded preview correctly selected Project 03.
- Reduced-motion emulation paused all three films and reported animation-name:none for all three review tracks.
- Browser inspection confirmed opening position:relative, showcase background rgb(255,255,255), and no page-wide gradient river element.
- A fresh read-only review found one material delayed-portfolio-response defect. A shorter project list could leave the selected index out of range; selection is now clamped, with a regression test observed failing before the fix and passing afterward. The mixed-input keyboard fix also has a failing-then-passing regression test.

## Evidence

- User recording: `C:\Users\spenc\Videos\2026-10-07 10-50-41.mp4`, inspected as extracted frames.
- Live layout reference: https://www.butter.video/?ref=maxibestof.one, inspected in the browser. The hover-expanding behavior is the user's requested adaptation.
- Desktop timeline proof: `output/reference-study/hover-timeline-desktop.jpg`.
- Review/rounded-edge proof: `output/reference-study/review-ribbons-desktop.jpg`.

The films and review text are placeholders. No production deployment or remote push was performed.
