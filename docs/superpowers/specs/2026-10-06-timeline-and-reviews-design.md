# Made Beside — timeline, reviews and closing identity

## Intent and authority

This architectural presentation extension continues the existing white editorial homepage for business owners and growing brands. The user's latest brief authorises the opening copy change, a smaller cursor disturbance, a noticeable but softer gradient throughout, an editing-timeline playground for individual films, interactive reviews, and the oversized footer shown in their screenshots. Their standing instruction to keep implementing the desired website supersedes extra approval handoffs. This document records decisions and assumptions; it does not claim approval of an unseen artifact. Work remains in the existing isolated design checkout, with no deployment.

## Design

Keep the existing opening, DM Sans and ink #121111 / green #16db65 / paper #f5f5f0 identity. The exact headline is “The best things, are made beside you.”, broken after “things,”. Reduce the text pointer radius from 88px to 44px, reducing its diameter from 176px to 88px. Fit the longer line to mobile without clipping. Keep the stronger opening gradient and introduce transparent green, lavender and peach washes behind the full page. Their edges fade into the white base; no alternating colour blocks.

After the project sequence, place an editorial heading beside a landscape preview, above a light three-track editing timeline. Three existing branded films are explicitly named placeholders. The timeline lasts 32 seconds, clips last 8 seconds, and initial starts are 0, 8 and 16 seconds on alternating tracks. A green playhead, time ruler, transport and reset control make the metaphor usable. Visitors select clips to preview, scrub, play/pause the assembled timeline, drag clips to change time and track, or use arrow keys while a clip is focused. Empty time shows a deliberate empty preview. In overlapping clips, the higher track wins. Nothing is uploaded, exported or saved; reset restores the arrangement.

Reviews use a large editorial quote with an adjacent three-position selector, next/previous buttons and touch swipe. No real reviews were supplied: the content must visibly say “Review placeholder” and reserve the space for approved real client words, with no invented people, companies, ratings or outcomes. Selection is manual; there is no auto-advancing carousel. A keyed opacity/vertical reveal is short and disabled with reduced motion or the global motion control.

The footer follows the supplied reference's hierarchy: large invitation at left, small navigation/social/location columns at right, then a nearly full-width intact Made Beside wordmark. Keep real routes, email, existing declared social URLs, Toronto location and policy links. Use sentence-case labels rather than eyebrow pills. No fabricated credits or headquarters details. A simple Toronto clock reinforces the reference without claiming an office address.

## Architecture and resilience

`timeline-model.js` holds pure clamping, clip movement, timecode, default layout and top-track selection. `useTimelineTransport.js` owns one shared-scheduler subscription, media synchronisation and visibility cleanup; frames update playhead, scrubber and timecode directly, while React changes only for play state or active clip. `EditingTimeline.jsx` owns local arrangement, pointer capture and keyboard editing. Its media is excluded from App's legacy video observer to avoid competing owners. `ReviewCarousel.jsx` owns local selection and swipe without a new dependency. `ArchiveFooter.jsx` keeps site-wide navigation and identity.

No playback starts on page load. Background/offscreen playback stops. Global pause stops current playback but explicit user playback remains available, including under reduced motion. Failed media has a readable message and retry. Keyboard operations provide the same editing result as pointer dragging. Touch can scroll the timeline horizontally; clip dragging uses pointer capture. On 320px screens, the timeline has its own horizontal scroll surface and the page itself never overflows.

## Verification

Pure tests cover timeline bounds, top-track precedence, gaps, immutable drag movement, invalid time inputs, keyboard-equivalent movement and reset. Browser checks cover text fit and cursor radius, subtle continuous gradient, pointer dragging, keyboard movement, source switching, scrubbing/play/pause, gaps, reset, failed-media retry, review controls/swipe, white responsive footer and reduced-motion behaviour. Run the existing contact, portfolio, SEO and archive suites and full build. Inspect desktop and mobile screenshots before showing the result; do not claim measured frame rate.
