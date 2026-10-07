# Made Beside website

Made Beside’s public website presents creative work to business owners and growing brands, then leads into a project enquiry.

## Language

**Opening**:
The initial scene with “The best things, are made beside you.” It uses the restored datamosh-style text treatment over a faint green gradient and scrolls normally without zooming.
_Avoid_: Splash page, intro video

**Showcase**:
A dark, rounded timeline of three projects. Hover, keyboard focus, or tap expands one normally playing video and masks the other two into thumbnail strips; it has no scrubbing.
_Avoid_: Editing playground, interactive editor, scroll-selected workspace

**Hero gradient**:
A faint green tint confined to the opening. The page after the opening uses a white background, with black and green for content surfaces.
_Avoid_: River gradient, section gradients

**Circle menu**:
Three horizontal circles that reveal Work, About, and Start a project through a leftward motion transition.
_Avoid_: Pause controls, full-screen menu

2026-10-07 ruler revision: idle hero canvas is clean; hover keeps the datamosh treatment. Work previews remain on the left with project descriptions and clearly marked illustrative metrics on the right. Hover/focus/tap selects a film; other thumbnail layers move up into the ruler. Selection persists until another film or Escape. Review ribbons respond to page scrolling, settle when scrolling stops, and identify placeholder author/company names. Headings are larger, centered and heavy. Footer is #eff2ed under the rounded white page. Menu dots are 8px (7px mobile), opacity .76, with stepped opening transitions. Keyboard, 390px and 740px layouts, hover playback and reduced motion checked in the live browser. All 70 tests pass and builds succeed.

2026-10-07 motion cadence refinement: shared canvas/Lenis clock samples at30fps; native CSS animation/transition clocks are sampled on that same cadence without replacing their original easing. Circle menu opening shortened to420ms plus25ms link stagger. Back-to-top uses the same anchor scroll owner. All routes now end with a64px rounded white page above a flat#ededed footer, without the previous edge shadow. Browser inspection captured repeated animation frames in33ms steps, 15 distinct scroll positions across28 display frames, completed menu animations, and reduced motion disabling both native animation and Lenis. Service page footer visually checked against supplied image. All71 tests and builds pass.

2026-10-07 hover-only revision supersedes the global cadence: scrolling and regular page motion run on the normal display clock. Only interactive CSS transitions and pointer canvas effects sample30fps; Bézier curves are retained. Timeline selector controls now stay in a fixed ruler grid while animated video layers ignore pointer events, eliminating hover oscillation. Initial hover selection is bounded to the actual thumbnail region. Testimonials are stationary and fully readable: one large quote beside two smaller quotes, with honest placeholder attribution. Maxibestof MCP brief approved; researched testimonials/quotes/reviews, creative-agency/studio/portfolio, and award staff picks. Visually studied Playceholdr, We are Büro, DocTocToc, Deel, Superculture and Jin Su Park references. Browser checks:85 stationary-hoverframes stayed onProject03; smoothscroll produced28distinct positions over28displayframes; tablet copy hover did not select a film;390px controls44pxhigh and nooverflow; reducedmotion stoppedallfilms; menu uses Bézier curves.71tests+allbuildspass.

2026-10-07 supporting-page worlds: all eight marketing routes now take distinct compositions from the inspected Love + Money reference: Work violet contact sheets/film spread; Capabilities yellow poster/index; Approach aqua connected orbits/playbook; Contact pink reply sheet; Production blue cinema frame; Social lime poster stack; Strategy orchid direction board; Digital Marketing rose target composition. Local placeholder photography stays grayscale. DM Sans preserved, text arrivals, pointer tilt, reveal motion, ticker and geometry animations support reduced motion. Original service facts, FAQs, process text and Contact submission semantics retained. Each route scopes its accent through navigation/footer as well. Desktop layouts and all8routes at390px reviewed; phone Approach heading repaired. Tests72pass; clientSSRWorkerbuildspass. Homepage retains its existing design. Source uses ArchivePages.jsx,PageWorld.jsx,page-worlds.css,route-identity.js.

2026-10-07 closer-reference revision: all eight supporting pages now follow Love + Money's actual structure more closely. A full-viewport accent-color masthead uses huge DM Sans SVG type and a centered statement, followed by full-width placeholder photography, centered uppercase manifesto text, and a sticky three-column playbook (large image wall, oversized numbered content, thumbnail section navigation). Replaced angled poster/circle service heroes and generic deliverable cards. Contact retains its real form in a flat white sheet. Existing route accents and service facts preserved. Browser verified image wall stays at0 and thumbnail index at100px while page scroll changed2562→3121; all8routes at390px haveoneH1, nooverflow and no clipped playbook words. Fixed overflow:hidden→clip for sticky positioning and strengthened paused heading overrides.73tests andallbuildspass. Primary source ReferenceLayout.jsx andArchivePages.jsx; homepage unchanged.
