# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Potential clients can see Simon's work across all service categories and easily get in touch -- first impressions matter.
**Current focus:** Phase 3 complete -- ready to begin Phase 4 (Contact & Conversion)

## Current Position

Phase: 3 of 8 (Service Pages & Lightbox) - COMPLETE
Plan: 3 of 3 in current phase
Status: Complete
Last activity: 2026-02-10 -- Completed 03-03-PLAN.md (Visual Verification) with bug fixes

Progress: [████████████░░░░░░░░] ~36% (12 of ~33 total plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: 4 minutes
- Total execution time: 0.83 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 21 min | 5 min |
| 02 | 3 | 9 min | 3 min |
| 03 | 3 | 20 min | 7 min |

**Recent Trend:**
- Last 5 plans: 02-03 (2m), 03-01 (2m), 03-02 (3m), 03-03 (15m)
- Trend: Verification plan took longer due to debugging (PhotoSwipe init, theme toggle)

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

### Pending Todos

- Replace placeholder hero images with real photography when available
- Replace placeholder featured images with real photography when available
- Replace placeholder service gallery images with real photography when available

### Blockers/Concerns

- Content preparation (96-160 curated images + alt text for 8 categories) is the primary timeline risk -- must start during Phase 1
- Gallery service selection (Pixieset vs Pic-Time) decision needed before Phase 5
- Pre-existing type error in astro.config.mjs (Vite plugin type mismatch) -- does not affect builds

## Session Continuity

Last session: 2026-02-10
Stopped at: Phase 3 complete -- ready to begin Phase 4 (Contact & Conversion)
Resume file: None
