# Editing playground verification

## Verified behavior

- Model tests watched fail before the new helpers/history existed, then passed: trim bounds and source offsets, exact split continuity, independent additions/duplicates, visible-layer selection, frame snapping, shuffle, undo/redo, elapsed-time playback and speed.
- Browser: dragged the right edge of Brand film from 8s to 6s; one Undo restored 7.75s and Redo restored 5.75s. Keyboard trimming moved the left edge and actual source time to 0.25s. With snap off, one arrow moved the edge by one 30fps frame.
- Split at timeline 3s created a second clip starting at source 3s; its real video currentTime was 3s. Duplicating preserved that source offset. Adding Campaign film at 6s on layer 3 took priority; hiding that layer revealed the lower Brand film instance at source 3s.
- Native drag moved a clip to 2s and layer 3. Dragging the playhead scrubbed to 4.05s and the source to approximately 2.03s. Keyboard move and Ctrl+Z restored the original layer.
- Removing all clips showed an explicit open canvas and disabled selection actions; adding a new source restored the monitor. Shuffle changed order and layers. Reset restored the original three clips.
- Real videos used playbackRate 2 and 0.5. Manual play progressed from Brand film at 7.8s into Social series and then Campaign film while remaining unpaused. Scrolling offscreen stopped manual playback.
- A temporarily blocked local source showed an explanatory failure and retry actions. Unblocking and retrying loaded the source with readyState 4. Network blocking and cache overrides were reset.
- Reduced motion disabled note tilt/transitions while all three reviews remained readable. Explicit timeline playback still worked. Emulated motion settings were reset.
- All three review notes and all three independent pin buttons were present together. Pinning every note kept every quote visible. No carousel was present.
- Responsive checks at 320, 390, 768 and 1440 CSS pixels found no page-wide horizontal overflow. The timeline scrolls within its own viewport, including when zoomed to 150%. At 320px every toolbar control fit the 273px section interior. Mobile reviews stack in normal flow with no hidden text.

## Scope and limits

The films and review text are visibly identified placeholders. No new client claims, footage or attribution were invented. Opening, project sequence, palette, fonts and footer composition are retained. Physical touch hardware and measured frame-rate profiling were not part of these checks.

Full final suite: 49 passing tests. Client, server-rendered HTML and Worker builds succeeded.

## Fresh review and fixes

One independent read-only review covered `a03ffc1..ac218b9`. It found no critical issues or deferred minors. Its three important findings were fixed in one pass, each with a failing then passing regression:

- Active drag ownership is cleared before undo, redo, reset and independent arrangement edits. The regression verifies that a later release cannot overwrite undo or clear redo history. The UI releases pointer capture as part of cancellation. Physical undo-while-holding input was not simulated in the browser.
- Same-layer overlap priority is now consistent: higher layer, later start, then later inserted instance. The renderer uses the same stack order as the monitor. Browser verification added Brand and Campaign at the identical position and confirmed the visible top Campaign instance was the actual source. Every buried instance can be selected through the cut index and moved with the larger selected-film control; moving the buried Brand changed both the stack and actual preview correctly.
- Narrow films switch to compact strips, with separate large move and In/Out controls below. Browser verification trimmed a film to 0.5 seconds at 100% and 200% zoom, confirmed the overlapping strip handles were absent, and dragged the 115px move control to change its start while preserving its duration/source offset. Separate trim controls were 68px wide, and all three controls remained inside the 320px phone layout. Frame-level keyboard controls still worked.

No findings were declined, and no minor issues were deferred. Preview motion preferences, viewport overrides, cache changes and blocked-source settings were restored after verification.

Browser screenshots: `output/timeline-review/review-spread-desktop.jpg` and `output/timeline-review/editing-playground-desktop.jpg` (local review artifacts, ignored by Git).
