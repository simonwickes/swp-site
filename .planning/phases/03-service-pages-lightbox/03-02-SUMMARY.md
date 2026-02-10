---
phase: 03-service-pages-lightbox
plan: 02
subsystem: ui
tags: [photoswipe, masonry, gallery, lightbox, service-pages, astro, tailwind]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Astro project scaffold, Tailwind v4, PageLayout, Sharp pipeline, Image component"
  - phase: 02-landing-page
    provides: "astro-masonry installed, existing service page stubs"
  - plan: 03-01
    provides: "PhotoSwipe installed, services.ts data module, ServiceHero, ServiceNav, placeholder images"
provides:
  - "ServiceGallery component with masonry grid and PhotoSwipe lightbox"
  - "8 complete service category pages with hero, nav, and gallery"
  - "Updated services index page using shared data module"
  - "PhotoSwipe CSS overrides for immersive viewing experience"
affects: [03-03, visual-verification, content-replacement]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ServiceGallery component wrapping astro-masonry + PhotoSwipe lightbox initialization"
    - "Per-page static import.meta.glob for Vite-compatible image loading"
    - "PhotoSwipe View Transitions safety with instance cleanup on astro:page-load"
    - "CSS-based PhotoSwipe customization (idle auto-hide, counter suppression, solid black bg)"

key-files:
  created:
    - src/components/services/ServiceGallery.astro
  modified:
    - src/styles/global.css
    - src/pages/services/outdoor-portraits.astro
    - src/pages/services/weddings.astro
    - src/pages/services/commercial.astro
    - src/pages/services/landscape.astro
    - src/pages/services/cars.astro
    - src/pages/services/assignments.astro
    - src/pages/services/events.astro
    - src/pages/services/live-performances.astro
    - src/pages/services/index.astro

key-decisions:
  - "bgClickAction: false instead of 'none' to satisfy PhotoSwipe TypeScript types"
  - "Counter hidden via CSS in global.css rather than uiRegister JS approach for simplicity"
  - "Generic category-based alt text pattern: '{Title} photography by Simon Wickes'"

patterns-established:
  - "Service page composition: PageLayout > ServiceNav > ServiceHero > ServiceGallery"
  - "Gallery image loading: static import.meta.glob per page, sorted by filename, mapped to GalleryImage[]"

# Metrics
duration: 3min
completed: 2026-02-10
---

# Phase 3 Plan 2: Service Gallery & Lightbox Integration Summary

**ServiceGallery component with masonry grid and PhotoSwipe lightbox, 8 complete service pages replacing stubs, services index using shared data module**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-10T07:50:11Z
- **Completed:** 2026-02-10T07:53:27Z
- **Tasks:** 2
- **Files modified:** 11 (1 created, 10 modified)

## Accomplishments
- ServiceGallery component combining astro-masonry responsive grid (1-4 columns) with PhotoSwipe lightbox for immersive image viewing
- PhotoSwipe configured for immersive experience: solid black background, no counter, auto-hiding controls on idle, no backdrop-click close, keyboard/touch navigation
- All 8 service category pages fully built with ServiceNav, ServiceHero, and ServiceGallery composition
- Each page uses static import.meta.glob for Vite-compatible image loading with sorted filenames
- Services index page refactored to use shared data module, eliminating duplicated inline service data
- PhotoSwipe CSS overrides added to global.css for idle auto-hide, counter suppression, and solid black background

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ServiceGallery component with PhotoSwipe lightbox and add CSS overrides** - `eeb2c4f` (feat)
2. **Task 2: Build all 8 service pages and update services index** - `ea8dcf2` (feat)

## Files Created/Modified
- `src/components/services/ServiceGallery.astro` - Masonry grid + PhotoSwipe lightbox component with GalleryImage[] props
- `src/styles/global.css` - PhotoSwipe CSS overrides (idle auto-hide, solid black bg, counter hidden)
- `src/pages/services/outdoor-portraits.astro` - Full service page (was stub)
- `src/pages/services/weddings.astro` - Full service page (was stub)
- `src/pages/services/commercial.astro` - Full service page (was stub)
- `src/pages/services/landscape.astro` - Full service page (was stub)
- `src/pages/services/cars.astro` - Full service page (was stub)
- `src/pages/services/assignments.astro` - Full service page (was stub)
- `src/pages/services/events.astro` - Full service page (was stub)
- `src/pages/services/live-performances.astro` - Full service page (was stub)
- `src/pages/services/index.astro` - Refactored to import from @/data/services

## Decisions Made
- Used `bgClickAction: false` instead of `"none"` to satisfy PhotoSwipe v5 TypeScript types (both disable backdrop click close)
- Counter element hidden via CSS (`.pswp__counter { display: none !important; }`) in global.css rather than via PhotoSwipe uiRegister JS API -- simpler, equally effective, avoids TypeScript complexity
- Alt text uses generic category-based pattern (`"{Title} photography by Simon Wickes"`) as placeholder until specific per-image alt text is prepared during content curation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed PhotoSwipe TypeScript type errors**
- **Found during:** Task 1 (verification step)
- **Issue:** `bgClickAction: "none"` is not a valid ActionType in PhotoSwipe v5 TS types (valid values: 'close' | 'next' | 'zoom' | 'zoom-or-close' | 'toggle-controls' | false). Also `pswp.ui.registerElement` caused type errors via uiRegister event handler.
- **Fix:** Changed `bgClickAction` to `false` (equivalent behavior). Removed uiRegister JS approach for counter hiding, relying on CSS override in global.css instead.
- **Files modified:** src/components/services/ServiceGallery.astro
- **Committed in:** eeb2c4f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** TypeScript types required adjustment from research code examples. Functionally identical behavior.

## Issues Encountered
- Pre-existing astro.config.mjs Vite plugin type error continues to appear in `npx astro check` (documented since Phase 1). Does not affect builds.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All service pages render with complete component composition (nav, hero, gallery with lightbox)
- Ready for visual verification in Plan 03 (03-03)
- Ready for real image content replacement when photography is curated
- PhotoSwipe lightbox functional with keyboard/touch navigation

---
*Phase: 03-service-pages-lightbox*
*Completed: 2026-02-10*
