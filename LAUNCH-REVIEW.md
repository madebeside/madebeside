# Spencer B Media — launch review

Reviewed September 18, 2026. This is an implementation review, not a legal opinion or a guarantee against claims.

## Completed in the local preview

- Personal first-person copy, general creative/marketing services, no real-estate positioning, client logos, invented testimonials, client results or revenue claims.
- Original generated product-style parcel, film and stamp images. No reference-site code, images or branding used. No stock photography is displayed. Self-hosted Archivo Black, Fraunces and Manrope font licences are retained under web/fonts; removing the public credits link does not remove those licence notices.
- Privacy, terms, cookies, cancellation/refund and accessibility pages; no blanket consumer waiver or invented non-refundable deposit rule.
- Optional name; required email, message and specific inquiry consent. No marketing consent bundled into the inquiry. Server validation, prepared database statements, request-size limits, basic abuse throttling, idempotency and restricted-origin submission.
- No visitor analytics, third-party embeds, external fonts, advertising pixels or browser-storage code configured by the application. No optional-cookie banner while that remains true. Provider access/security cookies and logs need a production review before public launch.
- Inquiry records have a 90-day expiry, removed by activity-triggered cleanup. This is not a guaranteed deletion time when the site receives no traffic. Provider backups and email copies have separate retention.
- Keyboard-accessible native fields, labels, visible focus, descriptive errors, focus on first invalid field, live submission status, skip link, reduced-motion support and pause control. Decorative graphics are hidden from assistive technology; service information is ordinary text.

## Before accepting paying clients or launching publicly

1. Confirm the legal contracting identity, business-name registration where applicable, and appropriate business correspondence address/contact details. Only the supplied trade name, Ontario location and email are published. A private home address was not invented or exposed.
2. Have an Ontario lawyer review these policies against the actual operation and a project contract covering scope, payments, deposits, expenses, revisions, cancellation, refunds, IP licences, releases and portfolio permission. A website policy cannot guarantee immunity from lawsuits or that a design has no similar existing work.
3. Confirm hosting subprocessors, processing locations, retention/backups, breach response and privacy-request procedures. The privacy page describes the intended Sites-hosted architecture; this run is a local preview until deployed and verified.
4. Decide how Spencer will monitor inquiries. The implemented form stores them in the site database; it does NOT email Spencer or provide email delivery notifications. Local test data is in .sites-runtime/preview.sqlite and is not part of deployment. Set up and verify an owner inbox or notification service before relying on the form for leads.
5. Verify any applicable accessibility duties against employee count and service model. Browser checks are not an independent WCAG conformance audit or a substitute for assistive-technology testing.
6. Recheck laws when launching and when expanding beyond Ontario. Client content, music, talent/property releases, trademark clearance and advertising substantiation need review for each project.

## Primary sources consulted

- [OPC consent principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/): consent should explain the actual collection and purpose. The form therefore uses a specific inquiry checkbox, with no newsletter subscription.
- [OPC business privacy guide](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/guide_org/): accountability, safeguards, retention and breach responsibilities require real operating procedures, not merely a privacy page.
- [OPC cookies](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/cookies/frequently-asked-questions-about-cookies/): assess actual tracking technologies, including those without cookies. The application has none configured; hosting behaviour remains a separate production check.
- [Ontario Consumer Protection Act, 2002](https://www.ontario.ca/laws/statute/02c30): applicable consumer rights cannot be replaced by blanket website language. Business-purpose engagements and consumer transactions need to be distinguished.
- [Ontario Consumer Protection Act, 2023](https://www.ontario.ca/laws/statute/23c23): the official page consulted states the Act is not yet in force; do not assume its provisions have replaced the 2002 framework.
- [Ontario website accessibility guidance](https://www.ontario.ca/page/how-make-websites-accessible) and [smaller organizations](https://www.ontario.ca/page/when-public-websites-are-not-accessible): the specific public-website standard generally covers businesses/nonprofits with 50+ employees, but other accessibility and accommodation duties may still apply.
- [CRTC guidance](https://crtc.gc.ca/eng/com500/info2014.pdf): responses to requested inquiries and requested quotations have different CASL treatment. Do not treat an inquiry as unrestricted permission for future promotional email. Review identification, contact and unsubscribe obligations before campaigns or quotations.

## Operational limits

Basic throttling is not a comprehensive distributed anti-abuse service. The form has no public listing/read endpoint. The hosting platform must retain owner-only database access. Do not expose records or add an unauthenticated admin page. Only authorize a public audience separately from source changes.

## Portfolio update

Owner studio at /studio/: authenticated owner allowlist, draft/published/archived states, first-party R2 media and D1 metadata, 20 MB media limit, same-origin mutation checks, file signature allowlist, image descriptions and speech captions. Archiving hides content but retains files. No visitor upload feature, analytics or third-party embeds added. The owner must clear copyrights and releases and remove sensitive metadata before upload. No fabricated portfolio work is supplied. API tests cover owner authorization, cross-origin rejection, draft privacy, publication, archiving and validation. Production authentication and real media playback should also be verified with the owner's first upload.
