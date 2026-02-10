# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Potential clients can see Simon's work across all service categories and easily get in touch -- first impressions matter.
**Current focus:** Phase 4 complete -- contact form, FAQ, and email notifications verified. Phase 5 next.

## Current Position

Phase: 4 of 8 complete (Contact & Conversion)
Plan: 4 of 4 in Phase 4 (all complete)
Status: Phase 4 complete, Phase 5 not started
Last activity: 2026-02-10 -- Completed 04-04-PLAN.md (Visual Verification)

Progress: [████████████████████░] ~50% (16 of ~33 total plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: 4 minutes
- Total execution time: 0.95 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 21 min | 5 min |
| 02 | 3 | 9 min | 3 min |
| 03 | 3 | 20 min | 7 min |
| 04 | 4 | 23 min | 6 min |

**Recent Trend:**
- Last 5 plans: 04-01 (3m), 04-02 (3m), 04-03 (2m), 04-04 (15m)
- Trend: Phase 4 complete. Verification took longer due to human feedback and fixes.

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

### Pending Todos

- Replace placeholder hero images with real photography when available
- Replace placeholder featured images with real photography when available
- Replace placeholder service gallery images with real photography when available
- Configure Resend API key and CONTACT_EMAIL for production deployment

### Blockers/Concerns

- Content preparation (96-160 curated images + alt text for 8 categories) is the primary timeline risk -- must start during Phase 1
- Gallery service selection (Pixieset vs Pic-Time) decision needed before Phase 5
- Pre-existing type error in astro.config.mjs (Vite plugin type mismatch) -- does not affect builds
- Native browser dropdown popup on Chrome Mac has light background in dark mode (OS-level rendering limitation, not fixable via CSS)

## Session Continuity

Last session: 2026-02-10
Stopped at: Completed Phase 4 (Contact & Conversion)
Resume file: None
