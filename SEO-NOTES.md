# Made Beside SEO — September 29, 2026

Preferred origin: https://madebeside.com. Business base: Toronto. Genuine service area: Toronto and the Greater Toronto Area. Business voice stays Made Beside, with no owner name or invented address, clients, results, prices or delivery promises.

## Implementation

- Build-time rendering of the actual React pages, followed by hydration, preserves the existing interface and animation. Initial HTML includes headings, copy, navigation and inquiry fields. Policy pages remain static HTML.
- Published portfolio content is rendered into the homepage and portfolio response by the Worker, using the same React components and public portfolio query. Drafts are never included. JSON is escaped and reused during hydration.
- HTTP and www requests receive a permanent 308 redirect to HTTPS/non-www. Page paths and query strings are retained. Existing trailing-slash and index.html redirects also retain queries.
- Three substantial service pages: /services/social-media-management/, /services/content-strategy/, /services/digital-marketing/. Capabilities links to all three. Social management includes planning, publishing, community management and reporting. Digital marketing explicitly covers strategy and creative, not ad-account management or media buying.
- Unique titles, descriptions, canonical URLs and page-appropriate structured data come from scripts/seo.config.mjs and scripts/seo.mjs. Organization and WebSite identity remain consistent. The sitemap now contains 13 public pages.
- Archived editions and Studio remain noindex. API routes remain excluded in robots.txt. Rendering assets remain crawlable. Missing pages return 404.
- The navigation/intro logo now uses a 67,386-byte lossless WebP derivative instead of the 369,519-byte PNG. The footer uses responsive sources, retaining the full-resolution version for larger displays. Original files remain available.

## Local verification

- Production client build, server rendering build and Worker build pass.
- Cloudflare Wrangler deployment dry-run bundles successfully. Its static assets are embedded in the Worker as in the existing architecture; upload is about 9.3 MiB gzipped, so future media should use the existing media store, not be embedded in the bundle.
- All 12 tests pass: contact validation/storage/retries/email failure handling, portfolio ownership and publication, all 13 public pages and metadata, sitemap/robots, redirects with query strings, 404, initial HTML, and safe published-project rendering excluding private drafts.
- Browser checked at desktop 1280px and mobile 390px: service layout, capabilities links, navigation, FAQ keyboard activation, and a successful local inquiry. No production inquiry was submitted. Actual email delivery was not retested.
- No physical Android/iPhone testing was performed.

## Performance evidence and limits

Lighthouse 12.8.2 mobile, homepage, single samples:

| Environment | Score | LCP | CLS | TBT |
| --- | --- | --- | --- | --- |
| Existing production before changes | 75 | 5.2s | 0.004 | 40ms |
| Updated local preview | 70 | 5.6s | 0.005 | 0ms |

These environments are not comparable proof of improvement or regression. No performance-score improvement is claimed. The before audit identified oversized logo delivery and a substantial LCP render delay from the existing loading sequence. Asset bytes were reduced; the approved intro and motion were preserved. A shorter first-visit intro would be a visible behavior change and remains a separate review decision. Repeat the same production audit after deployment for a comparable measurement.

## Production checks pending deployment

The initial live audit found HTTP/www serving 200 and slash redirects dropping query strings. The replacement behavior passes locally but must be confirmed at the Cloudflare edge after deployment. Check all 13 sitemap URLs, response HTML, canonical tags, scripts/fonts/images, 404 and domain/path redirects. Cloudflare dashboard rules could run before Worker code.

## Search Console after deployment

1. Open the madebeside.com property. Under Sitemaps, submit or recheck https://madebeside.com/sitemap.xml. It should list 13 URLs when Google next reads it.
2. Inspect the homepage, /capabilities/ and the three new service URLs. Use Test live URL, then review rendered HTML and indexability.
3. Request indexing for those important URLs after the live test succeeds. This is a request, not confirmation of indexing.
4. In the indexed URL report, compare User-declared canonical with Google-selected canonical. The expected canonical is the HTTPS, non-www URL with its trailing slash. Google may not show a selected canonical until the URL has been processed.
5. Monitor Page indexing and Search results for both Made Beside and MadeBeside, plus service queries. Do not infer ranking gains from deployment alone.

Official references: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl ; https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## Still needed from the business

The public portfolio currently has no published projects. Add genuine media and descriptions through the existing workflow; placeholders are not evidence. Google Business Profile status is unknown and no profile changes were made. Search Console was previously reported verified; current account access and indexing have not been independently confirmed during this implementation.
