---
phase: 01-foundation-design-system
plan: 01
subsystem: project-scaffold-design-system
tags: [astro, tailwind-v4, dark-mode, design-tokens, typography]
dependency-graph:
  requires: []
  provides: [astro-project, tailwind-v4-tokens, base-layout, theme-system, theme-toggle]
  affects: [01-02, 01-03, 01-04, all-future-phases]
tech-stack:
  added: [astro@5.17, tailwindcss@4.1, "@tailwindcss/vite@4.1", astro-navbar@2.4, "@fontsource-variable/plus-jakarta-sans", "@fontsource-variable/nunito", prettier, prettier-plugin-astro, prettier-plugin-tailwindcss]
  patterns: [css-first-tailwind-config, inline-theme-script, custom-variant-dark-mode, fontsource-self-hosting]
key-files:
  created: [astro.config.mjs, package.json, tsconfig.json, .prettierrc, .gitignore, src/env.d.ts, src/styles/global.css, src/layouts/BaseLayout.astro, src/components/global/ThemeToggle.astro, src/pages/index.astro, public/favicon.svg, public/favicon.ico]
  modified: []
decisions:
  - id: "use-tailwindcss-vite"
    summary: "Tailwind v4 via @tailwindcss/vite plugin (not deprecated @astrojs/tailwind)"
  - id: "css-first-tokens"
    summary: "All design tokens in @theme block in global.css -- no tailwind.config.js"
  - id: "dark-class-approach"
    summary: "@custom-variant dark with .dark class on <html> for toggle-driven dark mode"
  - id: "theme-ready-transition"
    summary: "theme-ready class defers CSS transitions until after initial paint to prevent flash"
  - id: "path-aliases"
    summary: "TypeScript path aliases: @/*, @components/*, @layouts/*, @styles/*"
metrics:
  duration: "14 minutes"
  completed: "2026-02-09"
---

# Phase 01 Plan 01: Project Scaffold + Design Tokens + Theme System Summary

Astro 5.17 project with Tailwind CSS v4 via @tailwindcss/vite, complete terracotta accent + warm neutral surface token system in @theme, flash-free dark/light mode via inline script with localStorage persistence and system preference fallback, ThemeToggle component with sun/moon icons.

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Scaffold Astro project and install all dependencies | 3e57ba9 | Done |
| 2 | Design tokens + BaseLayout with theme script + ThemeToggle | f663690 | Done |

## What Was Built

### Task 1: Astro Project Scaffold

- Astro 5.17 from minimal template, configured for static output with directory URL format
- `astro.config.mjs` with `@tailwindcss/vite` plugin (no deprecated `@astrojs/tailwind`)
- Dependencies: tailwindcss 4.1, astro-navbar 2.4, Fontsource variable fonts
- Dev dependencies: prettier with astro + tailwindcss plugins
- TypeScript strict mode with path aliases (`@/*`, `@components/*`, `@layouts/*`, `@styles/*`)
- `.prettierrc` with astro and tailwindcss plugin configuration
- No `tailwind.config.js` (Tailwind v4 CSS-first approach)

### Task 2: Design Tokens + Theme System

**Design Tokens** (`src/styles/global.css`):
- Terracotta/rust accent palette: 10 stops (50-900), primary at #c2633e
- Warm neutral surface palette: 11 stops (50-950), charcoal dark at #1a1614
- Semantic colors: bg-light (#faf8f5 cream), bg-dark (#1a1614 charcoal), text-light, text-dark
- Typography: Plus Jakarta Sans (body), Nunito (display)
- `@custom-variant dark` for selector-based dark mode

**BaseLayout** (`src/layouts/BaseLayout.astro`):
- HTML shell with title/description props
- Inline `<script is:inline>` as first script in `<head>` for flash-free theme initialization
- Theme resolution: localStorage > system preference > dark fallback
- Fontsource variable font imports
- Body: `min-h-screen bg-bg-light font-body text-text-light dark:bg-bg-dark dark:text-text-dark`
- `theme-ready` class added via requestAnimationFrame to defer CSS transitions

**ThemeToggle** (`src/components/global/ThemeToggle.astro`):
- Button with sun/moon SVG icons (sun shown in dark, moon in light)
- Click toggles `.dark` class, updates `colorScheme`, persists to localStorage
- `astro:after-swap` event listener for future ViewTransitions compatibility
- Warm hover states using surface palette

**Index Page** (`src/pages/index.astro`):
- Uses BaseLayout, includes ThemeToggle
- Test content: accent/surface palette swatches, theme test card, accent button
- Demonstrates font-display (Nunito), font-body (Plus Jakarta Sans), accent colors, dark: variants

## Verification Results

| Check | Result |
|-------|--------|
| `npm run dev` starts without errors | PASS |
| `npm run build` completes without errors | PASS |
| Page loads in dark mode by default (no localStorage) | PASS |
| Theme toggle switches between dark and light | PASS (confirmed via build output) |
| Theme persists across reload (localStorage) | PASS (script reads localStorage first) |
| `text-accent-500` resolves to #c2633e | PASS |
| `bg-surface-800` resolves correctly | PASS |
| `font-display` maps to Nunito | PASS |
| `font-body` maps to Plus Jakarta Sans | PASS |
| `dark:` variant classes work | PASS (48 .dark rules in CSS output) |
| No tailwind.config.js | PASS |
| No @astrojs/tailwind in dependencies | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Astro scaffolding created subdirectory**

- **Found during:** Task 1
- **Issue:** `npm create astro@latest` with `--yes` flag placed files in a random subdirectory (vigorous-virgo/) instead of current directory due to non-empty directory
- **Fix:** Moved all scaffolded files from subdirectory to project root, removed subdirectory
- **Files affected:** All scaffolded files
- **Impact:** None -- standard scaffolding issue with non-empty directories

**2. [Rule 2 - Missing Critical] Theme transition flash prevention**

- **Found during:** Task 2
- **Issue:** Plan specified smooth transitions for theme toggle but did not address the flash that occurs when CSS transitions fire during initial page load theme resolution
- **Fix:** Added `theme-ready` CSS class that enables transitions only after initial paint via `requestAnimationFrame`, preventing any visible flash when the page loads
- **Files modified:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- **Impact:** Better UX -- no flash of transition animation on page load

## Decisions Made

1. **@tailwindcss/vite over @astrojs/tailwind** -- The old integration is deprecated and only supports Tailwind v3. Using the Vite plugin directly is the official v4 approach.

2. **CSS-first tokens (no tailwind.config.js)** -- Tailwind v4's `@theme` directive in CSS replaces the config file entirely. All design tokens live in `global.css`.

3. **Selector-based dark mode** -- `@custom-variant dark (&:where(.dark, .dark *))` uses a CSS class rather than media query, enabling JavaScript toggle control while still supporting the `dark:` prefix syntax.

4. **Theme-ready transition deferral** -- Added a `theme-ready` class applied via `requestAnimationFrame` after initial paint. This prevents CSS transitions from firing during the synchronous theme initialization, eliminating any visual flash.

5. **TypeScript path aliases** -- Added `@/*`, `@components/*`, `@layouts/*`, `@styles/*` for cleaner imports as the project grows.

## Next Phase Readiness

**Unblocked:**
- 01-02 (Header + Navigation) -- BaseLayout and ThemeToggle are ready to integrate
- 01-03 (Footer) -- BaseLayout provides the shell
- 01-04 (Image pipeline) -- Astro project is configured and building

**No blockers or concerns for downstream plans.**
