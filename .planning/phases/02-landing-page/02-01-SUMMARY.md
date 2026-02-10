---
phase: 02-landing-page
plan: 01
subsystem: ui
tags: [swiper, carousel, hero, astro-swiper, astro-masonry, accessibility, reduced-motion]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Tailwind v4 theme tokens, Image/Picture components, layout system, path aliases
provides:
  - HeroCarousel.astro full-viewport auto-rotating hero with accessibility
  - Button.astro reusable CTA component with primary/secondary variants
  - SkeletonCard.astro CSS-only shimmer loading placeholder
  - 4 placeholder hero images in src/assets/images/hero/
  - astro-swiper, swiper, astro-masonry npm packages
affects: [02-02, 02-03, gallery, services]

# Tech tracking
tech-stack:
  added: [astro-swiper@1.4.0, swiper@12.1.0, astro-masonry@1.2.2]
  patterns: [astro-swiper custom element pattern, getSwiperFromUniqueSelector for instance access]

key-files:
  created:
    - src/components/home/HeroCarousel.astro
    - src/components/home/SkeletonCard.astro
    - src/components/ui/Button.astro
    - src/assets/images/hero/slide-1.jpg
    - src/assets/images/hero/slide-2.jpg
    - src/assets/images/hero/slide-3.jpg
    - src/assets/images/hero/slide-4.jpg
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "astro-swiper uses custom element (astro-swiper tag) with built-in script -- no client:load directive needed"
  - "getSwiperFromUniqueSelector with uniqueClass prop for accessing swiper instance from external scripts"
  - "Placeholder hero images are solid-color JPEGs generated via sharp (1920x1080)"

patterns-established:
  - "Hero carousel: astro-swiper with uniqueClass + getSwiperFromUniqueSelector for programmatic control"
  - "Accessibility: prefers-reduced-motion stops autoplay, reduces CSS transitions"
  - "Button variants: primary (solid accent) and secondary (outlined) with font-display"
  - "Skeleton loading: CSS-only shimmer with dark mode support and reduced-motion fallback"

# Metrics
duration: 3min
completed: 2026-02-10
---

# Phase 2 Plan 1: Hero Carousel & UI Primitives Summary

**Full-viewport astro-swiper hero carousel with 4.5s auto-advance, pause/play toggle, reduced-motion support, plus reusable Button and SkeletonCard components**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-10T03:52:33Z
- **Completed:** 2026-02-10T03:55:40Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Full-viewport hero carousel with auto-rotating slides, navigation arrows, and pagination dots
- Accessibility: pause/play button with aria-label, prefers-reduced-motion stops autoplay and CSS transitions
- Reusable Button.astro with primary/secondary accent-themed variants
- SkeletonCard.astro with CSS-only shimmer animation and dark mode/reduced-motion support
- Three npm packages installed (astro-swiper, swiper, astro-masonry)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, add hero images, create UI primitives** - `a83921c` (feat)
2. **Task 2: Build HeroCarousel component** - `6db0926` (feat)

## Files Created/Modified

- `package.json` - Added astro-swiper, swiper, astro-masonry dependencies
- `src/components/home/HeroCarousel.astro` - Full-viewport auto-rotating hero carousel with Swiper, navigation, pagination, overlay, pause/play, and reduced-motion
- `src/components/home/SkeletonCard.astro` - CSS-only skeleton loading card with shimmer animation
- `src/components/ui/Button.astro` - Reusable CTA button with primary/secondary variants
- `src/assets/images/hero/slide-{1..4}.jpg` - 1920x1080 solid-color placeholder hero images

## Decisions Made

- **astro-swiper custom element pattern:** astro-swiper renders as `<astro-swiper>` custom element with its own built-in script that self-initializes. No `client:load` directive needed -- the web component handles hydration natively.
- **getSwiperFromUniqueSelector for instance access:** Used `uniqueClass="hero-swiper"` prop on Swiper component and `getSwiperFromUniqueSelector(".hero-swiper")` in client script to programmatically control autoplay for pause/play and reduced-motion.
- **Solid-color placeholder images:** Generated via sharp (already an Astro transitive dependency) using the project's surface palette colors for visual consistency.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness

- HeroCarousel ready to be integrated into index.astro (will happen in subsequent plan)
- Button.astro and SkeletonCard.astro ready for use in service category grid and CTA sections
- Hero placeholder images should be replaced with real photography when available
- astro-masonry installed and ready for gallery/masonry grid layouts

---
*Phase: 02-landing-page*
*Completed: 2026-02-10*
