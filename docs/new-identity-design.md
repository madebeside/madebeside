# SpencerBMedia — Make an impression

## Research and synthesis

MaxiBestOf MCP was used for seven targeted website searches and three section searches (navigation, video presentation and halftone). The catalogue located all five requested studios. Their hero screenshots were visually inspected; Nothin, Monolog and Foudre were also opened live. Fromanother's live opening remained at its loader during the first inspection, so its catalogue screenshot is the visual evidence used. No claim is made to have audited every interaction on every reference.

- [Fromanother](https://www.fromanother.love/): a clear agency description holds the centre while an atmospheric image interrupts the type. Lesson: expressive art should support a readable proposition. We use a direct marketing-agency sentence and a different, asymmetrical composition.
- [Nothin](https://www.noth.in/): large media, generous black space, abrupt changes in type scale and media becoming a smaller element in a larger composition. Live scrolling was inspected at full-screen and inset stages. We use a reversible full-screen-to-corner media transition, then stop the movement before the next chapter.
- [Agence Foudre](https://www.agencefoudre.com/): strong identity through extreme type scale and a tight palette, with overlapping photography establishing a human point of view. We carry scale and an intentional palette through the whole page, without borrowing its green/pink identity, team photos or typeface.
- [Brand Appart](https://www.brandappart.com/): unusually rounded, tightly composed headlines and a persistent side rail; navigation occupies a deliberate portion of the canvas. We use a different four-chapter rail and light expanding panel, with accessible text names, keyboard containment and Escape dismissal.
- [Monolog](https://bymonolog.com/): halftone texture and very large type make a simple layout feel authored. We apply the texture to original metallic photography and keep text in the DOM, rather than reusing its wordmark, objects or background.

MCP catalogue IDs: Fromanother 84849; Nothin 92278; Agence Foudre 82525; Brand Appart 85425; Monolog 85565. Search results can be fuzzy; unrelated matches were discarded. The Monolog section-image URL was blocked by the browser; its catalogue thumbnail and live site were inspected instead.

## Design principles

1. **Make the offer unmistakable.** The first screen explicitly says creative marketing agency and names content, social and campaigns.
2. **Give attention a physical form.** The chrome megaphone and tactile photographic materials connect the identity to communication and production. No financial motif, star decoration or fake project appears.
3. **One visual action at a time.** A headline arrives; a media frame contracts; work stacks; services expand. Quiet intervals separate these moments.
4. **Frame, then reveal.** Cropping, restrained frames and the side rail recur across the journey. Typography and imagery do the work instead of extra labels.
5. **Keep an exit from the spectacle.** Persistent navigation and the call-request button bypass the scroll sequence. Motion can be paused. Reduced-motion and mobile modes use readable static layouts.
6. **Show only supportable proof.** No invented clients, awards or results. Portfolio placeholders are labelled; the studio motion visual is not represented as a client showreel.

## Original assets

Native originals are saved outside the website in `../design-assets-new-identity/`. Compressed copies are self-hosted under `web/identity/`. Both images were generated once, inspected and integrated; no reference artwork was copied.

**chrome-megaphone-hero.png / voice.webp**

Prompt: Use case: product-mockup. Asset type: 16:9 premium photographic hero for a content/marketing agency. A single enormous sculptural polished brushed-chrome megaphone / speaking trumpet in extreme close-up, asymmetrical right-weighted diagonal composition with mouth aimed toward viewer. Tactile fine screen-printed halftone treatment in shadows, dramatic hard studio lighting, black charcoal backdrop, silver metallic highlights, subtle reflection of acid green only. Left half deep nearly black negative space for white website headline. No text, letters, logos, stars, asterisks, stock-market motifs, ribbons, spheres, people, UI. Sophisticated editorial object photography, grounded physical object, not sci-fi illustration.

**editorial-contact-sheets.png / studio.webp**

Prompt: Use case: photorealistic-natural. Asset type: 16:9 original editorial still life for an agency identity. Overhead black-and-white photographic contact sheets, a clean unbranded camera lens and strips of translucent acetate on a pale grey studio worktable. Strong crisp side-light, restrained halftone grain, irregular cropped arrangement, one acid-green paper tab. No legible text, no logos, no photos of emergency workers, no financial motifs, no stars. Art direction for agency identity, NOT pretend client work.

`studio-motion.mp4` is a silent, gently reframed eight-second animation of the original chrome artwork. Its visible label says “Studio visual · Showreel coming soon.” Replace it with an authorised real showreel when available and update the caption and accessible description together.

DM Sans is self-hosted from the official Google Fonts repository, with its SIL Open Font License retained in `web/fonts/DMSans-OFL.txt`.

## Preservation

The preceding edition is saved in `../website-download/SpencerBMedia-Before-New-Identity.zip` (source commit fadabc957f1c82a2eaeadda9c45a1eba47536d6f). Production portfolio media lives separately in the site's storage. The excluded rescue demonstration was archived through the owner studio; its source file was not deleted.

## September 21: welcoming pages revision

The previous composition is preserved in `../website-download/SpencerBMedia-Before-Welcoming-Pages.zip` at afe4b72bf3c680f09e4303c36af458454c35e9b6. Historical research and prompts above describe that archived edition, not the current hero.

The current direction separates halftone from metallic treatments: there is no chrome artwork. The original monochrome photographic hero appears exactly once and transforms into the following statement composition. `voice.webp` and the duplicate `studio-motion.mp4` were removed. Accent is #16db65, dark is #121111. Arrow decorations and the requested blurbs were removed. Grain opacity increased from .047 to .115.

Navigation is now a compact downward-unfolding icon menu, with independent rightward labels, rather than a large rail/panel. It supports mouse hover, keyboard focus, tap/click and Escape. Four separate destinations have their own layout and motion: portfolio filters with stacked media, services with large sticky typographic chapters, approach with a five-stage journey, and contact with the call-request form and native FAQ. No clients or results are invented.

Original source: `../design-assets-welcoming/creative-production-hero.png`. Web copy: `web/identity/creative-hands.webp`, 58 KB. The existing `studio.webp` is used as supporting imagery, not repeated hero imagery.

Hero generation prompt: Create exactly one original sophisticated black-and-white editorial photograph. Extreme close-up tactile hands of a creative person aligning a translucent photographic contact sheet above an unbranded camera and light table. A large circular camera lens cropped on the far right, with dramatic sculptural fingers and layered photographic acetate occupying the right half. The left half is nearly black empty negative space reserved for a big white headline, but do not render any headline or text. Confident analogue creative production atmosphere, grounded photographic still life with human hands, artist-directed asymmetry and dramatic directional light. Fine authentic newspaper halftone dots in midtones only. Rich deep charcoal #121111 shadows, whites and soft greys; entirely monochrome. No stock office team or generic desk spread. No metallic or chrome treatment, no chrome objects, no megaphone, no stars, asterisks or arrows, no typography, logos, UI or watermarks, no emergency workers or firefighters, no financial motifs.

Checks: production build; six backend tests; desktop page renders; 390px responsive width on all five routes; menu hover, keyboard dismissal and mobile opening; portfolio category filter. Physical-device performance and Lighthouse remain unmeasured (see README checklist).

## September 22 refinement

Hero now rotates five endings after “Your story is”: worth sharing, one of a kind, just beginning, made to connect, ready to be seen. Each holds approximately 3.65 seconds with a .75-second transform/opacity transition. The accessible heading is stable; reduced-motion and the motion toggle show the first phrase without cycling. Rotation pauses when the opening leaves view; hidden-tab pausing remains shared.

Grain opacity is .18, with four small positional updates per 1.4 seconds rather than the previous rapid .22-second loop. Menu unfolding is .65 seconds with .065-second staggering; individual labels open over .55 seconds. Portfolio sheets remain opaque and full-sized so an older panel cannot show through its immediate successor. Footer navigation is larger; 12px policy links sit under copyright on all public pages.

Responsive browser checks covered 320px, 568px landscape and 768px tablet. All main routes fit the narrow viewport; landscape menu bottom is within the 320px screen; tablet Campaigns typography was reduced to prevent clipping. Reduced-motion returns the first ending and stops the grain. These are browser checks, not physical-device or exhaustive bug-free guarantees.

## September 22: reference letter animation

Inspected the supplied 6.07-second reference video at 0.4-second intervals. It uses a left-to-right stagger of individual glyphs exiting upward and entering from below through a mask, with slight rotation. The hero now follows that pattern using real DOM character spans and GSAP transform-only animation, retaining the five phrases and stable accessible heading. Each phrase holds for about three seconds before the staggered change; reduced motion shows the first phrase only. Grain texture scale increased from 165px to 330px with its existing calm cadence. Heading tracking loosened by roughly .02em. Menu-label expansion increased to one second with gentler easing. Removed the hero Meet the work link; navigation still exposes Work.
