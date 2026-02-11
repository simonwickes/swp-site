---
phase: 08-seo-transitions-launch-readiness
plan: 02
subsystem: ui
tags: [view-transitions, astro, photoswipe, swiper, fade, persist, seo-alt-text]

# Dependency graph
requires:
  - phase: 08-01
    provides: "ClientRouter in BaseLayout, SEO props interface"
  - phase: 03-02
    provides: "ServiceGallery with PhotoSwipe lightbox"
  - phase: 02-01
    provides: "HeroCarousel with Swiper autoplay"
  - phase: 02-02
    provides: "FeaturedImage component"
provides:
  - "200ms fade transition on main content via PageLayout"
  - "Header/Footer persist across page navigations (no flicker)"
  - "Shared element morph via transition:name on FeaturedImage"
  - "PhotoSwipe lightbox auto-close on page navigation"
  - "Hero carousel pause during page transitions"
  - "SEO-optimized hero carousel alt text"
affects: [08-03, 08-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "astro:before-preparation event for pre-transition cleanup"
    - "transition:persist with unique ID for fixed layout elements"
    - "transition:name derived from href for unique shared element morph"
    - "fade() import from astro:transitions for timed content transitions"

key-files:
  created: []
  modified:
    - src/layouts/PageLayout.astro
    - src/components/home/FeaturedImage.astro
    - src/components/services/ServiceGallery.astro
    - src/components/home/HeroCarousel.astro

key-decisions:
  - "transition:persist with unique IDs (site-header, site-footer) for Header/Footer"
  - "transition:name uses href-derived string for page-unique FeaturedImage morph"
  - "astro:before-preparation (not astro:before-swap) for pre-transition cleanup"
  - "Hero carousel alt text consolidated from 08-04 to avoid file conflicts"

patterns-established:
  - "astro:before-preparation for teardown: close modals, pause animations before fade-out"
  - "transition:name={`prefix-${prop.replace(...)}`} for dynamic unique transition names"

# Metrics
duration: 2min
completed: 2026-02-10
---

# Phase 8 Plan 2: Page Transitions Summary

**200ms fade transitions on main content with persisted Header/Footer, PhotoSwipe close-on-navigate, carousel pause, and shared element morph on featured images**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-11T01:32:37Z
- **Completed:** 2026-02-11T01:34:57Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- PageLayout applies 200ms fade transition to main content, keeping Header/Footer fixed via transition:persist
- FeaturedImage gets transition:name for shared element morph between homepage grid and service pages
- PhotoSwipe lightbox auto-closes on astro:before-preparation so back-button navigation is clean
- Hero carousel autoplay pauses during page transitions to prevent visual jank
- Hero carousel alt text updated to SEO pattern ("X photography ... by Simon Wickes")
- PageLayout Props expanded to pass all SEO fields (ogImage, ogType, article) through to BaseLayout

## Task Commits

Each task was committed atomically:

1. **Task 1: Add fade transitions and persist to PageLayout** - `e2ac362` (feat)
2. **Task 2: Add transition safety to ServiceGallery and HeroCarousel** - `713df18` (feat)

## Files Created/Modified
- `src/layouts/PageLayout.astro` - Added fade import, transition:persist on Header/Footer, transition:animate on main, expanded Props for SEO passthrough
- `src/components/home/FeaturedImage.astro` - Added transition:name derived from href for shared element morph
- `src/components/services/ServiceGallery.astro` - Added astro:before-preparation listener to close PhotoSwipe lightbox before navigation
- `src/components/home/HeroCarousel.astro` - Added astro:before-preparation listener to pause autoplay, updated alt text to SEO pattern

## Decisions Made
- Used transition:persist with unique string IDs ("site-header", "site-footer") rather than unnamed persist, ensuring Astro correctly identifies persistent elements
- Used href-derived transition:name (`featured-${href.replace(/\//g, '-')}`) to generate page-unique names for each FeaturedImage instance
- Used astro:before-preparation (fires before transition animation) rather than astro:before-swap (fires during swap) for cleanup -- ensures lightbox and carousel are stopped before the fade-out begins
- Consolidated hero carousel alt text update from Plan 08-04 into this plan to avoid modifying the same file in two separate plans

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness
- All page transitions are active and working
- Ready for 08-03 (Performance Optimization) which may adjust transition timing
- Ready for 08-04 (Image Alt Text & Accessibility) -- hero carousel alt text already handled here

---
*Phase: 08-seo-transitions-launch-readiness*
*Completed: 2026-02-10*
