---
phase: 02-landing-page
plan: 02
subsystem: ui
tags: [masonry, featured-grid, landing-page, lcp, preload, cta]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Tailwind v4 theme tokens, Image component, layout system, path aliases
  - phase: 02-01
    provides: HeroCarousel, Button, SkeletonCard, astro-masonry package
provides:
  - FeaturedImage.astro CSS-only hover overlay grid item
  - FeaturedGrid.astro responsive masonry grid of 12 featured items
  - Complete homepage composition (hero + intro + featured grid + CTAs)
  - LCP-optimized BaseLayout with preloadImage prop
  - 12 placeholder featured images with varied aspect ratios
affects: [02-03, services, gallery]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-masonry Masonry component with breakpointCols, CSS-only group-hover overlay pattern]

key-files:
  created:
    - src/components/home/FeaturedImage.astro
    - src/components/home/FeaturedGrid.astro
    - src/assets/images/featured/wedding-1.jpg
    - src/assets/images/featured/wedding-2.jpg
    - src/assets/images/featured/portrait-1.jpg
    - src/assets/images/featured/portrait-2.jpg
    - src/assets/images/featured/landscape-1.jpg
    - src/assets/images/featured/landscape-2.jpg
    - src/assets/images/featured/commercial-1.jpg
    - src/assets/images/featured/event-1.jpg
    - src/assets/images/featured/car-1.jpg
    - src/assets/images/featured/car-2.jpg
    - src/assets/images/featured/performance-1.jpg
    - src/assets/images/featured/assignment-1.jpg
  modified:
    - src/pages/index.astro
    - src/layouts/BaseLayout.astro
    - src/layouts/PageLayout.astro

key-decisions:
  - "astro-masonry Masonry component uses class='flex gap-4' and columnClass='' with mb-4 on items for spacing"
  - "FeaturedImage uses pure CSS group-hover pattern for category overlay -- zero JavaScript"
  - "BaseLayout gets preloadImage prop (optional string) for LCP optimization via link rel=preload"
  - "Homepage uses PageLayout (not BaseLayout directly) -- header is sticky, hero sits below it in flow"

patterns-established:
  - "Featured image overlay: group + group-hover:opacity-100 for gradient overlay with category label"
  - "Masonry grid: breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }} responsive columns"
  - "LCP preload: import image, pass .src to layout preloadImage prop for link rel=preload in head"

# Metrics
duration: 4min
completed: 2026-02-10
---

# Phase 2 Plan 2: Featured Grid & Landing Page Composition Summary

**Responsive masonry grid of 12 featured images across 8 service categories with CSS-only hover overlays, full landing page composition (hero + intro + featured grid + dual CTAs), and LCP optimization via hero image preloading**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-10T03:58:25Z
- **Completed:** 2026-02-10T04:02:05Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- 12 placeholder featured images generated with varied aspect ratios (portrait 800x1200, landscape 1200x800, square 800x800) using earth-tone palette colors
- FeaturedImage.astro component with CSS-only hover overlay showing category label (group-hover pattern, zero JS)
- FeaturedGrid.astro responsive masonry grid using astro-masonry with 4/3/2/1 column breakpoints
- All 8 service categories represented with descriptive alt text and links to service pages
- Complete homepage composition: hero carousel -> intro text -> "Featured Work" masonry grid -> dual CTA section
- LCP optimization: preloadImage prop on BaseLayout/PageLayout, first hero slide preloaded in document head
- Both CTA buttons: "Explore Services" (primary) and "Get in Touch" (secondary)

## Task Commits

Each task was committed atomically:

1. **Task 1: Featured placeholder images and FeaturedImage/FeaturedGrid components** - `39b0dc3` (feat)
2. **Task 2: Compose landing page and optimize LCP** - `6647261` (feat)

## Files Created/Modified

- `src/assets/images/featured/*.jpg` - 12 placeholder images with varied aspect ratios and earth-tone colors
- `src/components/home/FeaturedImage.astro` - Grid item with Image component and CSS-only hover category overlay
- `src/components/home/FeaturedGrid.astro` - Masonry wrapper importing all 12 images with curated metadata
- `src/pages/index.astro` - Complete landing page: HeroCarousel + intro + FeaturedGrid + dual CTAs
- `src/layouts/BaseLayout.astro` - Added preloadImage prop and conditional link rel=preload in head
- `src/layouts/PageLayout.astro` - Added preloadImage prop passthrough to BaseLayout

## Decisions Made

- **Masonry spacing approach:** Used `class="flex gap-4"` on Masonry container with `columnClass=""` and `mb-4` on each item wrapper div, following astro-masonry README Tailwind example.
- **CSS-only hover overlay:** FeaturedImage uses Tailwind `group` + `group-hover:opacity-100` for gradient overlay with category label. No JavaScript needed -- pure CSS transitions.
- **Preload without type restriction:** Removed `type="image/webp"` from preload link since Astro's `.src` returns the original format path, avoiding a format mismatch that would prevent preloading.
- **Homepage layout:** Used PageLayout as-is (sticky header above hero in flow). Hero's `height: 100dvh` creates full-viewport experience regardless of header position.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed preload link type mismatch**
- **Found during:** Task 2
- **Issue:** Plan specified `type="image/webp"` on the preload link, but `heroSlide1.src` resolves to the original `.jpg` path at build time. The type mismatch would cause browsers to skip the preload.
- **Fix:** Removed the `type` attribute from the preload link so the browser fetches the image regardless of format.
- **Files modified:** `src/layouts/BaseLayout.astro`
- **Commit:** Included in `6647261`

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness

- Homepage is fully composed and renders correctly
- Featured placeholder images should be replaced with real photography when available
- Ready for 02-03 (visual verification checkpoint) to confirm layout and interactions
- Service page links from featured grid will work when service pages are built

---
*Phase: 02-landing-page*
*Completed: 2026-02-10*
