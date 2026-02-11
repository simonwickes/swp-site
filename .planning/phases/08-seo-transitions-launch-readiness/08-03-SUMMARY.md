---
phase: 08-seo-transitions-launch-readiness
plan: 03
subsystem: seo
tags: [json-ld, schema.org, structured-data, BlogPosting, FAQPage, Service, og-metadata]

# Dependency graph
requires:
  - phase: 08-01
    provides: "SEO foundation with SEOHead component, sitemap, LocalBusiness schema"
  - phase: 04-02
    provides: "FAQ data module (faq.ts) with questions and answers"
  - phase: 06-01
    provides: "Blog content collection with author data module"
  - phase: 03-01
    provides: "Service data module (services.ts) with service metadata"
provides:
  - "BlogPosting JSON-LD schema on all blog post pages"
  - "FAQPage JSON-LD schema on FAQ page"
  - "Service JSON-LD schema on all 8 service pages"
  - "OG article metadata (type, published_time, author) on blog posts"
  - "SEO-optimized meta descriptions per page type"
affects: [08-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON-LD schema component pattern: props -> schema object -> script set:html"
    - "Conditional spread for optional schema fields"
    - "First-sentence extraction for meta descriptions"

key-files:
  created:
    - "src/components/seo/SchemaArticle.astro"
    - "src/components/seo/SchemaFAQPage.astro"
    - "src/components/seo/SchemaService.astro"
  modified:
    - "src/pages/blog/[id].astro"
    - "src/pages/faq.astro"
    - "src/pages/services/outdoor-portraits.astro"
    - "src/pages/services/weddings.astro"
    - "src/pages/services/commercial.astro"
    - "src/pages/services/landscape.astro"
    - "src/pages/services/cars.astro"
    - "src/pages/services/assignments.astro"
    - "src/pages/services/events.astro"
    - "src/pages/services/live-performances.astro"

key-decisions:
  - "SchemaArticle uses conditional spread for optional dateModified and image fields"
  - "SchemaFAQPage imports faq data directly (no props needed)"
  - "Service schema name appends 'Photography' to service title for richer structured data"
  - "Service meta descriptions use first-sentence extraction from service description"

patterns-established:
  - "Page-specific schema components: one component per schema type, integrated via slot in PageLayout"
  - "Meta description pattern for services: '[Title] photography by Simon Wickes in Arizona. [First sentence].'"

# Metrics
duration: 4min
completed: 2026-02-10
---

# Phase 8 Plan 3: Page-Specific Structured Data Summary

**BlogPosting, FAQPage, and Service JSON-LD schema components with OG article metadata and SEO-optimized meta descriptions across 13 files**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-11T01:33:21Z
- **Completed:** 2026-02-11T01:37:16Z
- **Tasks:** 2
- **Files modified:** 13 (3 created, 10 modified)

## Accomplishments
- Created 3 JSON-LD schema components (BlogPosting, FAQPage, Service) following existing SchemaLocalBusiness pattern
- Integrated BlogPosting schema into blog post pages with OG article metadata and featured image as OG image
- Added FAQPage schema to FAQ page, automatically pulling all Q&A from the faq data module
- Added Service schema with LocalBusiness provider to all 8 service pages with SEO-optimized meta descriptions

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SchemaArticle, SchemaFAQPage, and SchemaService components** - `52a78d3` (feat)
2. **Task 2: Integrate schemas and SEO metadata into pages** - `c78ea1e` (feat)

## Files Created/Modified
- `src/components/seo/SchemaArticle.astro` - BlogPosting JSON-LD with headline, date, author, conditional image/dateModified
- `src/components/seo/SchemaFAQPage.astro` - FAQPage JSON-LD mapping all FAQ items from data module
- `src/components/seo/SchemaService.astro` - Service JSON-LD with LocalBusiness provider and Arizona area served
- `src/pages/blog/[id].astro` - Added SchemaArticle, author lookup, OG image from featured image, article OG type
- `src/pages/faq.astro` - Added SchemaFAQPage component
- `src/pages/services/*.astro` (8 files) - Added SchemaService, SEO meta descriptions

## Decisions Made
- SchemaArticle uses conditional spread (`...(image && { image })`) for optional fields, matching the plan specification
- SchemaFAQPage reads directly from the faq data module with no props -- simpler since there is only one FAQ page
- Service schema appends " Photography" to service name (e.g., "Weddings Photography") for richer structured data signals
- Meta descriptions for services extract just the first sentence of the description to stay under 155 characters

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All three page-specific JSON-LD schemas are live and verified in build output
- BlogPosting, FAQPage, and Service schemas can be validated via Google Rich Results Test
- Ready for 08-04 (final launch readiness tasks)

---
*Phase: 08-seo-transitions-launch-readiness*
*Completed: 2026-02-10*
