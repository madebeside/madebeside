# Made Beside white edition

Preview branch: design/white-edition. All typography remains self-hosted DM Sans.

The original website is preserved on main at commit 9dd905d and tag madebeside-before-white-2026-10-04. To review the original in GitHub Desktop, switch Current branch to main. To restore it after future changes, create a branch from the recovery tag; this avoids discarding later work. This branch does not replace production until it is merged and deployed.

Direction: white editorial space, oversized black typography, paired compositions that express beside, and green reserved for interaction. Research used Shortscut plus MaxiBestOf's Human NYC, Helmut Agency, K72, Mother and Jackie Visuals. Their type hierarchy, media emphasis and pacing informed the synthesis; no imagery, client claims or layouts were copied.

The Vimeo ID, photography reel, form submission logic, SEO metadata, service copy and backend remain intact. Motion uses transforms and opacity and respects reduced motion and the existing pause switch.

Run npm run build, npm test and node serve.mjs to preview on http://127.0.0.1:4173/.

Local verification: production build and all 13 tests pass. Browser checks covered 320px, 390px, 768px and 1440px layouts, service and policy readability, navigation, wheel movement over a gap in the photo strip, and a successful local-only inquiry. Fourteen public URLs return 200 with headings and canonical tags; a missing URL returns 404. No production deployment, real-device performance measurement or live email delivery is claimed.
