# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Potential clients can see Simon's work across all service categories and easily get in touch -- first impressions matter.
**Current focus:** Phase 8 COMPLETE -- All 8 phases finished. Site ready for launch.

## Current Position

Phase: 8 of 8 (SEO, Transitions & Launch Readiness)
Plan: 4 of 4 in Phase 8
Status: Phase complete -- ALL PHASES COMPLETE
Last activity: 2026-02-10 -- Completed 08-04-PLAN.md (Alt Text & Meta Descriptions)

Progress: [██████████████████████████████] 100% (27 of 27 total plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 29
- Average duration: 4 minutes
- Total execution time: 1.45 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 21 min | 5 min |
| 02 | 3 | 9 min | 3 min |
| 03 | 3 | 20 min | 7 min |
| 04 | 4 | 23 min | 6 min |
| 05 | 2 | 5 min | 3 min |
| 06 | 4 | 9 min | 2 min |
| 07 | 3 | 6 min | 2 min |
| 08 | 4 | 11 min | 3 min |

**Recent Trend:**
- Last 5 plans: 08-01 (3m), 08-02 (2m), 08-03 (4m), 08-04 (2m)
- Trend: Consistent fast execution. All 27 plans complete.

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Astro 5.17 + Tailwind v4 + Sharp image pipeline as foundation
- [Roadmap]: Content preparation runs as parallel track starting Phase 1
- [Roadmap]: Gallery service selection decision needed before Phase 5
- [01-01]: Tailwind v4 via @tailwindcss/vite (not @astrojs/tailwind)
- [01-01]: CSS-first tokens in @theme -- no tailwind.config.js
- [01-01]: Selector-based dark mode with @custom-variant dark and .dark class
- [01-01]: theme-ready class defers transitions to prevent initial flash
- [01-01]: TypeScript path aliases (@/*, @components/*, @layouts/*, @styles/*)
- [01-02]: astro-navbar for desktop nav, custom implementation for mobile slide-in panel
- [01-02]: lg (1024px) breakpoint for mobile-to-desktop nav transition
- [01-02]: flex flex-col + flex-grow pattern for sticky footer
- [01-02]: Mobile ThemeToggle inside slide-in panel only (not header bar)
- [01-03]: Import images from src/assets/ (not public/) to enable Sharp optimization
- [01-03]: Image component auto-converts to webp with width constraints
- [01-03]: Picture component generates avif + webp + jpg multi-format sources
- [02-01]: astro-swiper uses custom element pattern -- no client:load needed, self-initializing web component
- [02-01]: getSwiperFromUniqueSelector with uniqueClass prop for programmatic swiper control
- [02-01]: Solid-color placeholder hero images generated via sharp using surface palette colors
- [02-02]: astro-masonry Masonry with flex gap-4 and breakpointCols for responsive columns
- [02-02]: CSS-only group-hover overlay pattern for FeaturedImage (zero JS)
- [02-02]: BaseLayout preloadImage prop for LCP optimization via link rel=preload
- [03-01]: Shared data module pattern (src/data/services.ts) for DRY service metadata across pages and components
- [03-01]: ServiceNav uses pill-shaped links with overflow-x-auto hidden scrollbar pattern
- [03-01]: Placeholder images use per-category unique base colors with varied aspect ratios for masonry testing
- [03-02]: ServiceGallery wraps astro-masonry + PhotoSwipe with View Transitions-safe initialization
- [03-02]: Counter hidden via CSS in global.css rather than PhotoSwipe uiRegister JS API
- [03-03]: Scripts without View Transitions must use DOMContentLoaded + immediate execution pattern, not astro:page-load alone
- [03-03]: Components rendered multiple times must use class selectors, not IDs (e.g., ThemeToggle)
- [03-03]: bgClickAction changed to "close" per user preference (allows background click to close lightbox)
- [04-01]: Use onboarding@resend.dev as dev sender until DNS verification
- [04-01]: Confirmation email failure doesn't fail action (notification is critical path)
- [04-01]: Astro Actions: accept:form for FormData, Zod validation, ActionError for user-facing errors
- [04-02]: FAQ data module pattern (src/data/faq.ts) following services.ts structure
- [04-02]: All FAQ questions visible (no accordion) for easy scanning/searching
- [04-03]: Event type dropdown dynamically generated from services.ts data
- [04-03]: Client-side action submission via import { actions, isInputError } from 'astro:actions'
- [04-03]: Inline field errors with data-error attribute pattern
- [04-04]: Document-level color-scheme CSS (html.dark { color-scheme: dark }) for native form controls
- [04-04]: FAQ section titles use amber/gold color (text-amber-600) for visual distinction
- [04-04]: Service Type label (renamed from Event Type) for clearer form UX
- [05-01]: Gallery data module pattern (src/data/gallery.ts) with centralized GALLERY_URL constant
- [05-01]: Button external prop for target="_blank" + rel="noopener noreferrer" via spread syntax
- [05-02]: Client Galleries placed between Services and Contact in desktop nav
- [05-02]: Mobile nav uses separate bordered section for Client Galleries link
- [05-02]: Footer uses shorter "Galleries" label for brevity consistency
- [06-01]: Content config at src/content.config.ts (Astro 5 convention)
- [06-01]: Category field uses service slugs for cross-linking blog to services
- [06-01]: 15-day threshold for relative vs absolute dates in formatPostDate
- [06-01]: Author data module follows services.ts pattern (interface + array + getter)
- [06-02]: Grid/list hybrid layout (first 6 posts grid, remainder list rows)
- [06-02]: Pagination hidden via early return when single page
- [06-02]: Rest parameter [...page].astro pattern for paginated routes
- [06-03]: Prose component wraps markdown with typography plugin classes
- [06-03]: Sidebar sticky pattern: lg:sticky lg:top-8
- [06-03]: Related posts filtered by same category, max 6
- [06-03]: Category link uses query param pattern (/blog?category=...)
- [06-04]: Blog link positioned between Services and Client Galleries in desktop nav
- [06-04]: Mobile nav uses bordered section for Blog link similar to Client Galleries
- [07-01]: BlogDiscoveryBar imports services directly for default category pills, with optional prop override
- [07-01]: Tag pills use # prefix and border styling to distinguish from category pills
- [07-02]: Share buttons use intent URLs for X/Facebook, clipboard API for Instagram/Copy Link
- [07-02]: Clone-node pattern prevents duplicate event listeners on View Transitions re-navigation
- [07-02]: data-share-url attribute on buttons for per-instance URL passing
- [07-03]: AND logic for all filter pills uniformly; Showing 0 posts counter handles two-category edge case
- [07-03]: Client-rendered cards omit featured images for smaller JSON index
- [07-03]: Category vs tag URL param classification uses runtime Set from post data
- [08-01]: Home page title renders as "Simon Wickes Photography" without "Home |" prefix
- [08-01]: GA4 conditionally renders only when GA_MEASUREMENT_ID is truthy (empty by default)
- [08-01]: LocalBusiness schema uses additionalType for Photographer (not @type array)
- [08-01]: Sitemap priorities: homepage 1.0 weekly, services 0.8 monthly, blog 0.7 weekly
- [08-01]: astro:after-swap handles theme re-application and scroll reset for View Transitions
- [08-02]: transition:persist with unique IDs (site-header, site-footer) for Header/Footer
- [08-02]: transition:name uses href-derived string for page-unique FeaturedImage morph
- [08-02]: astro:before-preparation for pre-transition cleanup (close modals, pause animations)
- [08-02]: Hero carousel alt text consolidated from 08-04 into 08-02 to avoid file conflicts
- [08-03]: SchemaArticle uses conditional spread for optional dateModified and image fields
- [08-03]: SchemaFAQPage imports faq data directly (no props needed)
- [08-03]: Service schema name appends "Photography" to service title
- [08-03]: Service meta descriptions use first-sentence extraction pattern
- [08-04]: Alt text pattern: "{Category} photography in Arizona by Simon Wickes -- {description}"
- [08-04]: All pages have distinct meta descriptions under 155 characters
- [08-04]: Home page description leads with brand name for SERP recognition

### Pending Todos

- Replace placeholder hero images with real photography when available
- Replace placeholder featured images with real photography when available
- Replace placeholder service gallery images with real photography when available
- Configure Resend API key and CONTACT_EMAIL for production deployment
- Confirm Pic-Time subdomain URL (currently placeholder: simonwickes.pic-time.com)
- Set GA4 measurement ID in src/data/seo.ts before launch
- Update social profile URLs in src/data/seo.ts before launch
- Customize service areas in src/data/seo.ts if needed

### Blockers/Concerns

- Content preparation (96-160 curated images + alt text for 8 categories) is the primary timeline risk -- must start during Phase 1
- Gallery service selection resolved: Pic-Time selected, URL placeholder in src/data/gallery.ts
- Pre-existing type error in astro.config.mjs (Vite plugin type mismatch) -- does not affect builds
- Native browser dropdown popup on Chrome Mac has light background in dark mode (OS-level rendering limitation, not fixable via CSS)

## Session Continuity

Last session: 2026-02-10
Stopped at: Completed 08-04-PLAN.md (Alt Text & Meta Descriptions) -- ALL PHASES COMPLETE
Resume file: None
