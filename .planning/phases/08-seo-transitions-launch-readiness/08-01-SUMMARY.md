---
phase: 08-seo-transitions-launch-readiness
plan: 01
subsystem: seo
tags: [seo, opengraph, json-ld, sitemap, analytics, ga4, view-transitions, schema.org]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: "BaseLayout with theme system and Tailwind config"
  - phase: 03-service-pages-lightbox
    provides: "services.ts data module pattern"
provides:
  - "SEO data module (src/data/seo.ts) with site info, social profiles, service areas, GA4 ID"
  - "SEOHead component for title, meta, canonical, OG, Twitter card tags"
  - "Analytics component for GA4 with View Transitions tracking"
  - "SchemaLocalBusiness component for JSON-LD structured data"
  - "robots.txt with sitemap reference"
  - "Sitemap generation via @astrojs/sitemap with page-type priorities"
  - "ClientRouter for site-wide View Transitions"
  - "astro:after-swap handler for theme persistence and scroll reset"
affects: ["08-02 (PageLayout transitions)", "08-03 (per-page schema)", "08-04 (alt text/OG images)"]

# Tech tracking
tech-stack:
  added: ["@astrojs/sitemap"]
  patterns: ["Centralized SEO data module", "SEOHead component in BaseLayout", "JSON-LD via set:html", "GA4 with astro:page-load tracking", "ClientRouter for View Transitions"]

key-files:
  created:
    - "src/data/seo.ts"
    - "src/components/seo/SEOHead.astro"
    - "src/components/seo/Analytics.astro"
    - "src/components/seo/SchemaLocalBusiness.astro"
    - "public/robots.txt"
  modified:
    - "astro.config.mjs"
    - "src/layouts/BaseLayout.astro"

key-decisions:
  - "Home page title renders as 'Simon Wickes Photography' without 'Home |' prefix"
  - "GA4 conditionally renders only when GA_MEASUREMENT_ID is truthy (empty by default)"
  - "LocalBusiness schema uses additionalType for Photographer (not @type array)"
  - "Sitemap priorities: homepage 1.0 weekly, services 0.8 monthly, blog 0.7 weekly"
  - "astro:after-swap handles theme re-application and scroll reset for View Transitions"

patterns-established:
  - "SEO component pattern: SEOHead receives title/description/ogImage via props from layout"
  - "JSON-LD pattern: build schema object in frontmatter, render via set:html={JSON.stringify(schema)}"
  - "Analytics conditional rendering: check truthy ID before rendering script tags"
  - "View Transition lifecycle: astro:after-swap for theme persistence, astro:page-load for analytics"

# Metrics
duration: 3min
completed: 2026-02-10
---

# Phase 8 Plan 1: SEO Foundation Summary

**Centralized SEO metadata (OG/canonical/Twitter), JSON-LD LocalBusiness schema, GA4 analytics, sitemap generation, and ClientRouter View Transitions integrated into BaseLayout**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-11T01:26:48Z
- **Completed:** 2026-02-11T01:29:28Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Every page automatically gets proper title, meta description, canonical URL, OG tags, and Twitter card tags via SEOHead component
- JSON-LD LocalBusiness + Photographer schema renders on every page with service areas and social profiles
- Sitemap auto-generates at build time with page-type-specific priorities (homepage 1.0, services 0.8, blog 0.7)
- ClientRouter enables site-wide View Transitions with theme persistence and scroll reset
- GA4 analytics ready to activate by setting GA_MEASUREMENT_ID in seo.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SEO data module and all SEO components** - `4cb6a1c` (feat)
2. **Task 2: Install sitemap integration and integrate all SEO components into BaseLayout** - `d77cf0d` (feat)

## Files Created/Modified
- `src/data/seo.ts` - Centralized SEO constants: site info, social profiles, service areas, GA4 measurement ID
- `src/components/seo/SEOHead.astro` - Title, meta description, canonical, Open Graph, Twitter card tags
- `src/components/seo/Analytics.astro` - GA4 script with View Transitions page-load tracking
- `src/components/seo/SchemaLocalBusiness.astro` - JSON-LD LocalBusiness + Photographer schema
- `public/robots.txt` - Search engine crawl directives with sitemap reference
- `astro.config.mjs` - Added @astrojs/sitemap with filter/serialize configuration
- `src/layouts/BaseLayout.astro` - Integrated ClientRouter, SEOHead, Analytics, SchemaLocalBusiness, and after-swap handler

## Decisions Made
- Home page title uses "Simon Wickes Photography" without "Home |" prefix for cleaner branding
- GA4 scripts only render when GA_MEASUREMENT_ID is non-empty, allowing safe deployment without analytics configured
- Used LocalBusiness with additionalType "https://schema.org/Photographer" rather than deprecated ProfessionalService
- Sitemap filter excludes /api/ and /image-test pages; serialize assigns priorities by page type
- Theme re-application via astro:after-swap prevents dark mode flash during View Transitions
- Scroll reset to top on every navigation via astro:after-swap (content site UX expectation)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

Before launch, the following values in `src/data/seo.ts` need to be updated:
- `GA_MEASUREMENT_ID` - Set to actual GA4 measurement ID (G-XXXXXXXXXX format)
- `socialProfiles` - Update Instagram and Facebook URLs to actual profiles
- `serviceAreas` - Customize to match actual service coverage area

## Next Phase Readiness
- SEO foundation complete; all subsequent Phase 8 plans can build on these components
- PageLayout can add transition:animate and transition:persist (Plan 08-02)
- Per-page schema components (Article, FAQ, Service) can follow SchemaLocalBusiness pattern (Plan 08-03)
- Per-page OG images and alt text can use SEOHead ogImage prop (Plan 08-04)

---
*Phase: 08-seo-transitions-launch-readiness*
*Completed: 2026-02-10*
