# Phase 1: Foundation & Design System - Research

**Researched:** 2026-02-09
**Domain:** Astro 5 + Tailwind CSS v4 project scaffolding, theming, responsive layout, navigation
**Confidence:** HIGH

## Summary

This phase establishes the Astro 5 project with Tailwind CSS v4, a dark/light theme system with persistent toggle, responsive navigation with grouped service dropdown, a sticky header, footer with social links, and a proven image optimization pipeline. The research covers the exact implementation patterns for each of these concerns.

The standard approach is: Astro 5.17 with `@tailwindcss/vite` plugin, Tailwind v4's CSS-first `@theme` directive for design tokens, `@custom-variant dark` for selector-based dark mode, an inline `<script is:inline>` in `<head>` for flash-free theme persistence via localStorage, and the `astro-navbar` package for headless responsive navigation with dropdown support. Fonts use Fontsource self-hosted variable fonts (Plus Jakarta Sans for body, Nunito for display headings) to achieve the "warm, approachable, rounded" aesthetic.

Key constraint: this is a static site deploying to Apache shared hosting. No server-side code at runtime. All interactivity (theme toggle, mobile menu) is vanilla JS via Astro islands or inline scripts.

**Primary recommendation:** Build the design token system in `global.css` using `@theme` first, then the BaseLayout with inline dark mode script, then Header/Footer components, then prove the image pipeline with a single test page -- in that order.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.17 | Static site framework | Zero JS by default, built-in image optimization, content collections. Locked decision from roadmap. |
| Tailwind CSS | ^4.1 | Utility-first CSS | CSS-first config via `@theme`, native dark mode variants, responsive utilities. Locked decision. |
| @tailwindcss/vite | ^4.1 | Tailwind Vite integration | Official Tailwind v4 integration method. Replaces deprecated `@astrojs/tailwind`. |
| sharp | (Astro dep) | Image processing | Astro's default image service. Build-time resize, format conversion, quality optimization. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-navbar | ^2.4 | Headless responsive nav | Provides StickyHeader, Dropdown, MenuIcon, mobile toggle -- all headless with Tailwind styling |
| @fontsource-variable/plus-jakarta-sans | latest | Body font (variable) | Self-hosted, warm geometric sans-serif with rounded terminals. Weights 200-800. |
| @fontsource-variable/nunito | latest | Display/heading font (variable) | Self-hosted, distinctly rounded sans-serif. Warmer and friendlier than Plus Jakarta Sans. |
| prettier | latest (dev) | Code formatting | Consistent .astro, .css, .md formatting |
| prettier-plugin-astro | latest (dev) | Astro file formatting | Official formatter for .astro files |
| prettier-plugin-tailwindcss | latest (dev) | Class sorting | Automatic Tailwind class ordering |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| astro-navbar | Hand-rolled nav | astro-navbar provides accessible StickyHeader + Dropdown + mobile toggle for free. Hand-rolling means reimplementing aria-expanded, scroll detection, mobile toggle, keyboard nav. Use the library. |
| Plus Jakarta Sans + Nunito | Poppins + Work Sans | Both are warm/rounded. Plus Jakarta Sans has better variable font support and a more contemporary feel. Nunito's distinctly rounded terminals create stronger visual warmth for headings. |
| @fontsource-variable/* | Google Fonts CDN | Self-hosting eliminates DNS lookup to fonts.googleapis.com. Better privacy, better TTFB, works offline during dev. |

**Installation:**
```bash
# Core
npm create astro@latest -- --template minimal
npm install tailwindcss@^4.1 @tailwindcss/vite@^4.1

# Navigation
npm install astro-navbar

# Fonts
npm install @fontsource-variable/plus-jakarta-sans @fontsource-variable/nunito

# Dev tools
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
src/
├── assets/
│   └── images/
│       ├── hero/               # Test hero image for pipeline proof
│       └── test/               # Test images for optimization verification
├── components/
│   └── global/
│       ├── Header.astro        # Sticky header with nav + theme toggle
│       ├── Footer.astro        # Footer with social links + copyright
│       ├── Navigation.astro    # Desktop nav + mobile slide-in panel
│       └── ThemeToggle.astro   # Dark/light mode toggle button
├── layouts/
│   ├── BaseLayout.astro        # HTML shell, <head>, inline theme script
│   └── PageLayout.astro        # BaseLayout + Header + Footer
├── pages/
│   ├── index.astro             # Home page (placeholder content)
│   ├── services/
│   │   ├── outdoor-portraits.astro
│   │   ├── weddings.astro
│   │   ├── commercial.astro
│   │   ├── landscape.astro
│   │   ├── cars.astro
│   │   ├── assignments.astro
│   │   ├── events.astro
│   │   └── live-performances.astro
│   └── 404.astro               # Custom 404 page
├── styles/
│   └── global.css              # @import tailwindcss, @theme, @custom-variant
└── env.d.ts                    # TypeScript declarations (theme API)
```

### Pattern 1: Tailwind v4 CSS-First Design Tokens

**What:** Define the entire color palette, typography, and spacing as Tailwind `@theme` variables in a single CSS file. No `tailwind.config.js` needed.
**When to use:** Always in Tailwind v4. This replaces the old config-file approach.

```css
/* src/styles/global.css */
/* Source: Tailwind CSS v4 official docs - https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Typography */
  --font-body: 'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Nunito Variable', ui-sans-serif, system-ui, sans-serif;

  /* Terracotta/Rust Accent Palette */
  --color-accent-50: #fdf3ef;
  --color-accent-100: #fbe4d9;
  --color-accent-200: #f6c5b2;
  --color-accent-300: #f0a080;
  --color-accent-400: #e87b52;
  --color-accent-500: #c2633e;
  --color-accent-600: #a64e30;
  --color-accent-700: #8a3d27;
  --color-accent-800: #6e3121;
  --color-accent-900: #5a291c;

  /* Neutral palette - warm undertones */
  --color-surface-50: #faf8f6;
  --color-surface-100: #f5f0eb;
  --color-surface-200: #ebe3da;
  --color-surface-300: #d6cabe;
  --color-surface-400: #b5a596;
  --color-surface-500: #978775;
  --color-surface-600: #7a6b5b;
  --color-surface-700: #5c504a;
  --color-surface-800: #3a322e;
  --color-surface-900: #262120;
  --color-surface-950: #1a1614;

  /* Semantic colors */
  --color-bg-light: #faf8f5;
  --color-bg-dark: #1a1614;
  --color-text-light: #262120;
  --color-text-dark: #f5f0eb;
}
```

**Key:** The `--color-accent-*` scale provides the terracotta/rust range. `--color-surface-*` provides warm neutrals for backgrounds and borders. `--color-bg-light` is the cream/ivory, `--color-bg-dark` is the charcoal/near-black.

### Pattern 2: Flash-Free Dark Mode with System Preference Default

**What:** Inline script in `<head>` that resolves theme before first paint. Checks localStorage first, falls back to system preference, falls back to dark.
**When to use:** Every page load. This is the ONLY way to prevent flash of wrong theme.

```astro
<!-- In BaseLayout.astro <head> -->
<!-- Source: Tailwind CSS v4 docs + astro-tips.dev/recipes/dark-mode -->
<script is:inline>
  (function() {
    const stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
    let theme;
    if (stored === 'dark' || stored === 'light') {
      theme = stored;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme = 'light';
    } else {
      theme = 'dark'; // fallback to dark per requirement
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  })();
</script>
```

**Why `classList.toggle('dark')` instead of `data-theme`:** Tailwind v4's `@custom-variant dark (&:where(.dark, .dark *))` targets the `.dark` class. This is the standard Tailwind approach and means all dark mode styling uses the `dark:` prefix directly in HTML.

### Pattern 3: astro-navbar Grouped Dropdown Navigation

**What:** Use astro-navbar's headless components for a sticky header with a "Services" dropdown grouped by People/Places/Things.
**When to use:** For the main site navigation with 8 service categories.

```astro
---
/* Source: github.com/surjithctly/astro-navbar README */
import { Astronav, MenuItems, MenuIcon, Dropdown, DropdownItems, StickyHeader } from "astro-navbar";
import ThemeToggle from "./ThemeToggle.astro";
---

<StickyHeader
  class="sticky top-0 z-50 w-full border-b transition-all"
  scrollY={50}
  defaultClass="py-4 border-transparent bg-bg-light dark:bg-bg-dark"
  activeClass="py-2 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm border-surface-200 dark:border-surface-800"
>
  <nav class="mx-auto max-w-7xl px-4">
    <Astronav closeOnClick>
      <div class="flex w-full items-center justify-between">
        <a href="/" class="font-display text-xl font-bold">Simon Wickes</a>
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <div class="block lg:hidden">
            <MenuIcon class="h-6 w-6" />
          </div>
        </div>
      </div>
      <MenuItems class="hidden lg:flex">
        <ul class="flex flex-col lg:flex-row lg:items-center lg:gap-6">
          <li><a href="/">Home</a></li>
          <li>
            <Dropdown class="group">
              <button class="flex items-center gap-1">
                Services
                <svg class="h-4 w-4 transition-transform group-open:rotate-180">...</svg>
              </button>
              <DropdownItems class="lg:absolute lg:top-full lg:mt-2 lg:rounded-lg lg:border lg:bg-bg-light lg:p-4 lg:shadow-lg dark:lg:bg-bg-dark">
                <div class="grid lg:grid-cols-3 lg:gap-6">
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">People</p>
                    <ul>
                      <li><a href="/services/outdoor-portraits">Outdoor Portraits</a></li>
                      <li><a href="/services/weddings">Weddings</a></li>
                      <li><a href="/services/events">Events</a></li>
                      <li><a href="/services/live-performances">Live Performances</a></li>
                    </ul>
                  </div>
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">Places</p>
                    <ul>
                      <li><a href="/services/landscape">Landscape</a></li>
                    </ul>
                  </div>
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">Things</p>
                    <ul>
                      <li><a href="/services/commercial">Commercial</a></li>
                      <li><a href="/services/cars">Cars</a></li>
                      <li><a href="/services/assignments">Assignments</a></li>
                    </ul>
                  </div>
                </div>
              </DropdownItems>
            </Dropdown>
          </li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </MenuItems>
    </Astronav>
  </nav>
</StickyHeader>
```

### Pattern 4: Mobile Slide-In Navigation Panel

**What:** On mobile, the hamburger icon opens a slide-in panel from the right (or left) edge. Service categories are listed flat with group headings.
**When to use:** Mobile viewports (below `lg:` breakpoint).

The `MenuItems` component from astro-navbar handles show/hide. For the slide-in animation, add Tailwind classes:

```css
/* Mobile slide-in panel */
@media (max-width: 1023px) {
  [data-astronav-menu] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 80%;
    max-width: 320px;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 40;
  }
  [data-astronav-menu].open {
    transform: translateX(0);
  }
}
```

**Note:** The exact slide-in implementation may need custom JS beyond astro-navbar's built-in toggle. If astro-navbar's default mobile behavior (show/hide) is insufficient for the slide-in animation, implement the panel manually with a simple `<button>` + `<div>` + Tailwind transitions. The dropdown grouping pattern above still applies inside the panel.

### Pattern 5: Astro Config for This Project

```javascript
// astro.config.mjs
// Source: Astro official docs + Tailwind v4 integration guide
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://simonwickes.com",
  output: "static",
  build: {
    format: "directory", // /about/index.html for clean URLs on Apache
  },
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Anti-Patterns to Avoid

- **Using `@astrojs/tailwind` integration:** Deprecated. Only supports Tailwind v3. Use `@tailwindcss/vite` in `vite.plugins` instead.
- **Creating `tailwind.config.js`:** Tailwind v4 uses CSS-first config. All design tokens go in `@theme` block in your CSS. A config file is not needed.
- **Using `data-theme` attribute for dark mode:** While valid, the Tailwind v4 standard is `@custom-variant dark (&:where(.dark, .dark *))` using a CSS class. Stick with the `.dark` class approach for ecosystem compatibility.
- **Putting the theme script in `<body>` or in a non-inline script:** The script MUST be `is:inline` in `<head>` to run synchronously before first paint. Astro's default script handling is deferred/bundled, which causes flash.
- **Pure black (#000) for dark mode background:** Use charcoal/near-black (#1a1614 or similar). Pure black creates harsh contrast with photographs and is fatiguing.
- **Placing images in `public/` directory:** Images in `public/` bypass Astro's optimization pipeline entirely. All content images must go in `src/assets/`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive navigation with dropdown | Custom nav with scroll detection, aria attributes, mobile toggle | `astro-navbar` (StickyHeader + Dropdown + MenuIcon) | Accessibility (aria-expanded), scroll throttling, mobile toggle, dropdown positioning are all solved. ~2KB. |
| Dark mode flash prevention | Custom CSS-only approach or deferred JS | Inline `<script is:inline>` in `<head>` with localStorage + matchMedia | This is the ONLY reliable pattern. CSS-only approaches cannot read localStorage. Deferred JS causes flash. |
| Font self-hosting | Manual @font-face declarations with WOFF2 files | Fontsource npm packages | Fontsource handles subsetting, font-display, format fallbacks, variable font axes. Manual @font-face is error-prone and misses optimizations. |
| Design token system | CSS custom properties in :root manually synced with Tailwind | Tailwind v4 `@theme` directive | `@theme` automatically generates utility classes from your tokens. Manual CSS vars require separate Tailwind config and double-maintenance. |
| Image responsive srcset | Manual `srcset` and `sizes` attributes | Astro `<Image />` with `layout="constrained"` | Astro auto-generates correct srcset breakpoints, format conversion, quality optimization, and lazy loading. Manual srcset is error-prone. |

**Key insight:** Phase 1 has zero custom JavaScript complexity. The dark mode toggle, mobile menu, and sticky header all use proven, minimal patterns. The design token system is pure CSS via Tailwind. The risk is in configuration, not in code.

## Common Pitfalls

### Pitfall 1: Flash of Wrong Theme (FOUC)

**What goes wrong:** Page loads in light mode, then snaps to dark mode after JS runs. Visually jarring on every navigation.
**Why it happens:** Theme detection script is deferred, bundled, or placed in `<body>` instead of inline in `<head>`.
**How to avoid:** Use `<script is:inline>` as the FIRST script in `<head>`. The `is:inline` directive prevents Astro from bundling/deferring. The script reads localStorage synchronously before any rendering.
**Warning signs:** Any visible flash of white/light background before dark theme appears. Test by hard-refreshing (Cmd+Shift+R) with dark preference set.

### Pitfall 2: Tailwind v4 Dark Mode Misconfiguration

**What goes wrong:** `dark:` prefix classes have no effect. Or dark mode works with system preference but not with the toggle.
**Why it happens:** Missing `@custom-variant dark (&:where(.dark, .dark *));` in the CSS file. Without this, Tailwind v4 defaults to `prefers-color-scheme` media query only, which cannot be toggled via JS.
**How to avoid:** Add `@custom-variant dark (&:where(.dark, .dark *));` immediately after `@import "tailwindcss";` in global.css. Verify by toggling `.dark` class on `<html>` in DevTools.
**Warning signs:** `dark:bg-*` classes only work when OS dark mode is on, not when toggled manually.

### Pitfall 3: astro-navbar Dropdown Not Styled for Grouped Layout

**What goes wrong:** The dropdown renders as a flat list of 8 service links with no visual grouping. People/Places/Things categories are lost.
**Why it happens:** astro-navbar's `DropdownItems` is headless -- it provides no styling. The grouped layout with column headings must be implemented inside the `DropdownItems` slot.
**How to avoid:** Use a CSS Grid layout (`grid grid-cols-3`) inside `DropdownItems` with group heading `<p>` elements. See Pattern 3 above.
**Warning signs:** All 8 services listed vertically in a long dropdown without categories.

### Pitfall 4: Mobile Navigation Covering Theme Toggle

**What goes wrong:** On mobile, the hamburger menu and theme toggle compete for header space. The toggle may be hidden or the menu icon pushed off-screen.
**Why it happens:** Both controls need to be in the header, but mobile headers have limited horizontal space.
**How to avoid:** Place the theme toggle inside the mobile slide-in panel (not in the header bar on mobile). On desktop, the toggle is in the header. Use `hidden lg:block` for desktop toggle position and move it inside `MenuItems` for mobile.
**Warning signs:** Toggle or hamburger icon wrapping to second line on small screens.

### Pitfall 5: Font Loading Flash (FOIT/FOUT)

**What goes wrong:** Text is invisible for 1-3 seconds while fonts load, then pops in. Or text visibly shifts from system font to custom font.
**Why it happens:** Custom fonts load asynchronously without proper font-display strategy or preloading.
**How to avoid:**
1. Use Fontsource (self-hosted, no external DNS lookup)
2. Limit to 2 font families (Plus Jakarta Sans + Nunito)
3. Use variable fonts (single file covers all weights)
4. Preload the body font: `<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>`
5. Choose fallback system fonts with similar metrics
**Warning signs:** Lighthouse "Ensure text remains visible during webfont load" audit failure.

### Pitfall 6: Responsive Breakpoint Mismatch

**What goes wrong:** Navigation works on desktop and small mobile, but breaks at tablet widths (768-1023px). The dropdown overflows, or the mobile menu shows on tablet when the desktop nav should.
**Why it happens:** Using `md:` breakpoint (768px) instead of `lg:` (1024px) for the desktop/mobile nav switch. With 8 service categories in a grouped dropdown, the desktop nav needs more horizontal space than a typical site.
**How to avoid:** Use `lg:` (1024px) as the mobile-to-desktop breakpoint for navigation. Below 1024px, show hamburger + slide-in panel. Above 1024px, show full horizontal nav with dropdown.
**Warning signs:** Navigation items wrapping or overflowing between 768px and 1024px.

## Code Examples

### Complete BaseLayout.astro Shell

```astro
---
// Source: Astro docs + verified dark mode pattern
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/nunito';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Professional photography by Simon Wickes" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | Simon Wickes Photography</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Theme initialization - MUST be inline, MUST be first script -->
    <script is:inline>
      (function() {
        var stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
        var theme;
        if (stored === 'dark' || stored === 'light') {
          theme = stored;
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          theme = 'light';
        } else {
          theme = 'dark';
        }
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
      })();
    </script>
  </head>
  <body class="min-h-screen bg-bg-light font-body text-text-light dark:bg-bg-dark dark:text-text-dark">
    <slot />
  </body>
</html>
```

### Theme Toggle Component

```astro
---
// ThemeToggle.astro
// Source: Tailwind v4 docs dark mode + astro-tips.dev dark mode recipe
---

<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
  class="rounded-lg p-2 transition-colors hover:bg-surface-200 dark:hover:bg-surface-800"
>
  <!-- Sun icon (shown in dark mode) -->
  <svg class="hidden h-5 w-5 dark:block" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
  </svg>
  <!-- Moon icon (shown in light mode) -->
  <svg class="block h-5 w-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
</button>

<script>
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    toggle?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      document.documentElement.style.colorScheme = newTheme;
      localStorage.setItem('theme', newTheme);
    });
  }
  // Run on initial load
  initThemeToggle();
  // Re-run after Astro page transitions (if using ClientRouter in future)
  document.addEventListener('astro:after-swap', initThemeToggle);
</script>
```

### Footer Component

```astro
---
// Footer.astro
---

<footer class="border-t border-surface-200 py-8 dark:border-surface-800">
  <div class="mx-auto max-w-7xl px-4">
    <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p class="text-sm text-surface-500">
        &copy; {new Date().getFullYear()} Simon Wickes Photography. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <a
          href="https://instagram.com/simonwickes"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          class="text-surface-500 transition-colors hover:text-accent-500"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><!-- Instagram SVG --></svg>
        </a>
        <a
          href="/contact"
          class="text-sm text-surface-500 transition-colors hover:text-accent-500"
        >
          Contact
        </a>
      </div>
    </div>
  </div>
</footer>
```

### Image Pipeline Test

```astro
---
// Verify image optimization works
import { Image, Picture } from 'astro:assets';
import testImage from '../assets/images/test/sample.jpg';
---

<!-- Constrained layout: generates srcset, maxes at specified width -->
<Image
  src={testImage}
  alt="Test image for pipeline verification"
  width={800}
  quality={80}
/>

<!-- Multi-format: AVIF + WebP + JPEG fallback for hero usage -->
<Picture
  src={testImage}
  formats={['avif', 'webp']}
  alt="Test image multi-format"
  width={1600}
  quality={85}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `darkMode: 'class'` | `@custom-variant dark (&:where(.dark, .dark *))` in CSS | Tailwind v4 (Jan 2025) | No config file needed. Dark mode is CSS-first. |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` in vite.plugins | Tailwind v4 / Astro 5 | Old integration is deprecated and only supports v3 |
| `data-theme` attribute for theming | `.dark` class on `<html>` | Tailwind v4 convention | Matches Tailwind's native `dark:` variant selector |
| `<ViewTransitions />` component | `<ClientRouter />` (deprecated path) or native CSS `@view-transition` | Astro 5 | ClientRouter adds client JS; native CSS is progressive enhancement |
| Google Fonts CDN via `<link>` | Fontsource npm packages self-hosted | Ongoing best practice | Eliminates external dependency, better TTFP |
| Manual responsive `srcset` | Astro `<Image layout="constrained">` | Astro 5.10+ | Automatic srcset generation with responsive styles |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Do not use. Tailwind v3 only.
- `tailwind.config.js`: Not needed in v4. Use `@theme` in CSS.
- `Astro.glob()`: Deprecated in Astro 5. Use `getCollection()`.
- Squoosh image service: Removed from Astro. Sharp is the default.

## Open Questions

1. **astro-navbar slide-in animation on mobile**
   - What we know: astro-navbar handles show/hide toggle for mobile menu. It adds/removes classes.
   - What's unclear: Whether it supports a smooth slide-in animation from the right edge out of the box, or if custom CSS transitions are needed.
   - Recommendation: Start with astro-navbar's default mobile behavior. If the slide-in animation is needed (per CONTEXT.md decision), add custom CSS transitions on the `[data-astronav-menu]` element. If astro-navbar's DOM structure doesn't support this, build the mobile panel as a custom component using the same headless pattern (button toggle + fixed panel + transition).

2. **Exact terracotta hex values in dark vs. light mode**
   - What we know: Terracotta standard hex is ~#C2633E to #E2725B range. The accent palette defined in Pattern 1 covers this range.
   - What's unclear: Whether the same accent-500 value works well in both dark and light modes, or if the dark mode needs a brighter/lighter accent for sufficient contrast.
   - Recommendation: Use accent-500 (#c2633e) as the primary in light mode. Test in dark mode -- if contrast is insufficient, use accent-400 (#e87b52) for dark mode. This is a design-time decision that can be resolved visually.

3. **Fontsource variable font preloading in Astro**
   - What we know: Fontsource packages provide WOFF2 files. Astro's build system handles imports.
   - What's unclear: Whether Astro auto-generates `<link rel="preload">` for imported Fontsource fonts, or if manual preload links are needed in `<head>`.
   - Recommendation: Check after initial build. If fonts are not preloaded automatically, add manual `<link rel="preload">` tags in BaseLayout.astro `<head>` for the body font (Plus Jakarta Sans) only.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 dark mode docs](https://tailwindcss.com/docs/dark-mode) - `@custom-variant` syntax, selector strategy, flash prevention script
- [Tailwind CSS v4 @theme docs](https://tailwindcss.com/docs/theme) - Design token namespaces, CSS-first configuration, color/font/spacing definitions
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) - Image/Picture component API, responsive images, layout options
- [astro-navbar GitHub](https://github.com/surjithctly/astro-navbar) - StickyHeader, Dropdown, MenuIcon, mobile toggle API
- [Astro Dark Mode Tutorial](https://docs.astro.build/en/tutorial/6-islands/2/) - Official dark mode pattern
- [Fontsource Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans/install) - Variable font npm package

### Secondary (MEDIUM confidence)
- [astro-tips.dev dark mode recipe](https://astro-tips.dev/recipes/dark-mode/) - Complete theme manager with localStorage, system preference, and custom events
- [Astro 5 + Tailwind 4 dark mode demo](https://github.com/Michinded/astro5-tailwindcss4-darkmode-toggle) - Working example with persistence and system preference
- [Muzli Best Google Fonts 2026](https://muz.li/blog/best-free-google-fonts-for-2026/) - Font selection with warm/rounded characteristics
- [The Brief AI Google Font Pairings 2026](https://www.thebrief.ai/blog/google-font-pairings/) - Font pairing recommendations

### Tertiary (LOW confidence)
- Exact terracotta color palette hex values - derived from color reference sites, needs visual validation during implementation
- astro-navbar slide-in animation support - not explicitly documented, needs testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs and npm
- Architecture: HIGH - Patterns verified against Tailwind v4 and Astro 5 official docs
- Dark mode: HIGH - Multiple sources confirm the inline script + @custom-variant pattern
- Navigation: MEDIUM - astro-navbar API verified, but grouped dropdown layout is custom implementation on top of headless components
- Typography: MEDIUM - Font choices are a recommendation within the "warm/rounded" constraint; exact pairings are a design-time decision
- Color palette: MEDIUM - Terracotta range is well-established, exact shade scale needs visual validation
- Pitfalls: HIGH - All pitfalls verified against official documentation or multiple community sources

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days - stable technologies, no rapid changes expected)
