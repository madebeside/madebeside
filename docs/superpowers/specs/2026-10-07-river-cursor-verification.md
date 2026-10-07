# Continuous atmosphere and cursor verification

The background is now one decorative SVG field behind the application, including the footer. Its connected ribbons bend and vary in width at document-pixel intervals; adding page content extends the current instead of stretching previous bends. A ResizeObserver updates its dimensions when content or viewport width changes. The original opening atmosphere fades over the start of that shared field. Section background pseudo-elements were removed.

The cursor uses compact SVG icons in a 24px circle. Its 16px SVG is centered by a grid, while the circle is centered at the event coordinates with `translate(-50%,-50%)`. Pointer coordinates are applied directly, without easing or scheduler subscriptions. Existing action labels resolve to icons. Native pointer hiding is tied to active custom-cursor state and constrained to wide, fine-pointer, normal-motion views. Pause, leave and cleanup restore the native pointer.

Focused tests watched RED before implementation, then GREEN. They verify stable bend positions when page height increases, connected finite geometry on phone/unusual dimensions, exact immediate cursor coordinates including large jumps, icon refresh, leave behavior and native-pointer restoration. Full suite: 53/53 passing. Client, SSR and Worker build passed. Local preview returned HTTP 200 with one river SVG containing 24 ribbons and the new cursor SVG.

Browser validation limitation: both the browser automation runtime and its installed native fallback failed during startup on this run. No browser screenshot, live cursor-center measurement or measured frame-rate claim was made. The local preview is running with the new build for visual review. No dependencies were added.
