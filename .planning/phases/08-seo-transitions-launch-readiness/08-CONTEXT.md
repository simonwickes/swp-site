# Phase 8: SEO, Transitions & Launch Readiness - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site discoverable by search engines with proper metadata (titles, descriptions, Open Graph, JSON-LD schema), ensure all portfolio images have descriptive alt text, add polished page transitions, generate a sitemap, and integrate analytics. This is the final phase before launch.

</domain>

<decisions>
## Implementation Decisions

### Page transitions
- Fade transition style — simple crossfade between pages
- Quick duration (200ms) — snappy, responsive feel
- Header/footer stay fixed — only main content area fades
- Respect `prefers-reduced-motion` — disable animations for users with motion sensitivity
- Shared element morph for gallery images — clicked images morph to position on new page
- Hero carousel pauses during page transitions
- Back button navigates directly (closes lightbox immediately if open)

### Social sharing previews
- Default OG image: designed social card with logo and tagline
- Blog posts use their featured image for social previews
- Service pages use the default logo/brand social card
- Single og:image works across all platforms (no Twitter-specific images)

### Schema markup
- LocalBusiness + Photographer schema types
- Include service areas (cities/regions served) for local SEO
- Per-service schema on each service page with description
- Article schema for blog posts with author, date, headline
- Contact info: URL to contact page only (no direct email/phone in schema)
- Include all social media profile links for knowledge graph
- FAQPage schema on the FAQ page for rich results

### Alt text approach
- SEO-focused style: "Wedding photography in [location] by Simon Wickes"
- Include photographer name in every image alt text
- Include location when known for local SEO
- Acceptable to launch with some placeholder images if real photos aren't ready

### Analytics and tracking
- Google Analytics 4 integration
- Track page views during View Transitions
- No cookie consent banner needed

### Claude's Discretion
- Scroll behavior on page transitions (reset vs preserve)
- ImageGallery schema for service pages (value vs complexity)
- GA4 loading method (direct script vs Partytown)
- Meta description format per page type

</decisions>

<specifics>
## Specific Ideas

- Quick 200ms transitions for snappy feel
- Morph effect for gallery images creates polished gallery experience
- SEO-focused alt text helps with Google Image search visibility
- All social profiles in schema for knowledge graph enhancement

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-seo-transitions-launch-readiness*
*Context gathered: 2026-02-10*
