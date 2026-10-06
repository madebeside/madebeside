# Timeline and reviews — verified 2026-10-06

The white editorial edition now opens with “The best things, are made beside you.”. The text disturbance radius is 44px, half the previous 88px. DM Sans is loaded in the browser. Transparent green, lavender and peach washes continue through projects, the editing room, reviews and the oversized footer.

The editing room uses three explicitly labelled existing motion placeholders on a 32-second, three-track timeline. Pointer dragging moved the first clip to track 3 at 9 seconds and its preview won over the lower overlapping clip. Keyboard movement, source selection, scrubbing into gaps, play/pause, automatic source transition and reset were checked in the actual browser. A blocked film displayed the failure message; clearing the block and retrying recovered to readyState 4. Scrolling to reviews stopped offscreen playback. Timeline videos have one playback owner and are excluded from the legacy media observer.

Reviews have three labelled editorial placeholders, manual selection, next/previous and horizontal pointer swipe. No people, businesses, ratings, client statements or outcomes were invented. The persistent live region announces the changing slide while navigation buttons keep focus. The footer retains real existing routes, declared social links, email and policies, with a nearly full-width intact wordmark and Toronto clock.

Responsive checks at 320×568, 390×844, 768×1024 and 1440×900 found no page overflow. The longer opening fit the 320px screen. The mobile timeline scrolls within its own surface, and selecting the offscreen campaign clip brought it into view. Mobile keyboard editing and footer layout were inspected. Physical-device touch feel has not been measured.

Reduced-motion emulation removed Lenis and decorative animation, with manual timeline playback still available. All emulation, blocked-request and cache overrides were cleared and the viewport reset. No frame-rate or Core Web Vitals claim is made.

One fresh read-only review found an Important playback timing defect: the shared animation scheduler clamps dt, which incorrectly slowed the media clock on dropped frames. The existing capped calculation was reproduced in failing tests (0.96 seconds at 30fps; irregular frames advancing 4.146 instead of 5). The transport now advances from elapsed scheduler timestamps, resetting its anchor on play, seek and stop. Tests pass at 60/30/20fps and irregular intervals. No Critical or Minor findings were reported. No findings remain deferred.

Verification: full client/SSR/Worker build succeeds; full suite passes 39/39; diff whitespace check passes. Existing published portfolio, private draft, contact and SEO checks remain intact. Work stays on the local design branch; no production deployment or external form submission.

Screenshots are in `output/timeline-review/`: opening-desktop.jpg, timeline-desktop.jpg, reviews-desktop.jpg and footer-desktop.jpg. The local preview is http://127.0.0.1:4188/.
