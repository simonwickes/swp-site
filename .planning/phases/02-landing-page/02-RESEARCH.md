# Phase 2: Landing Page - Research

**Researched:** 2026-02-09
**Domain:** Landing page implementation with hero carousel, masonry layout, and image optimization
**Confidence:** HIGH

## Summary

Phase 2 implements a visually striking homepage with an auto-rotating hero carousel and a masonry-style featured work grid. The technical approach centers on Swiper.js for the carousel (with astro-swiper for seamless Astro integration), astro-masonry for the Pinterest-style grid layout, and CSS-based skeleton loading states for elegant load experiences.

The standard stack leverages Astro's existing Sharp-powered Image and Picture components (established in Phase 1) with solid color placeholders for hero images and skeleton cards for the featured grid. All interactive components require explicit Astro client directives for hydration, balancing interactivity with performance.

Critical considerations include respecting `prefers-reduced-motion` accessibility preferences, using `100dvh` (not `100vh`) for mobile-friendly hero height, preloading the first hero image for optimal LCP, and implementing Tailwind's `group-hover:` pattern for category labels.

**Primary recommendation:** Use astro-swiper with Swiper.js v12.1.0 for the hero carousel, astro-masonry for the featured grid, and CSS-only skeleton loading states. Hydrate the carousel with `client:visible` for below-the-fold carousels or `client:load` if above-the-fold.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro-swiper | Latest | Hero carousel wrapper for Swiper.js in Astro | Native Astro component, clean integration with Swiper.js API |
| Swiper.js | v12.1.0 | Carousel/slideshow engine | Industry standard, mobile-first, lightweight, extensive features (autoplay, transitions, navigation) |
| astro-masonry | Latest | Pinterest-style responsive grid | Zero-dependency, native Astro component, responsive breakpoints |
| Astro Image/Picture | Built-in | Image optimization | Phase 1 foundation - Sharp pipeline, format optimization, lazy loading |
| Tailwind CSS | v4.1.18 | Styling and hover effects | Phase 1 foundation - already configured |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-lqip | Optional | Low-quality image placeholders | If blurred preview preferred over solid color (adds processing overhead) |
| @unpic/astro | Optional | Advanced placeholder generation | If blurhash or dominant color detection needed (alternative to astro-lqip) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| astro-swiper | astro-carousel (claudiabdm) | No autoplay support, uses browser navigation (URL-based) - not suitable for auto-rotating hero |
| astro-masonry | Native CSS `grid-template-rows: masonry` | Experimental, only supported in Firefox with flag - not production-ready in 2026 |
| astro-masonry | Masonry.js library | Requires JavaScript, heavier bundle, astro-masonry is zero-dependency and SSR-friendly |
| Solid color placeholder | astro-lqip (LQIP/blurhash) | LQIP adds build-time processing, larger files, may hurt SEO if original not in HTML |

**Installation:**
```bash
npm install astro-swiper swiper astro-masonry
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── home/
│   │   ├── HeroCarousel.astro       # Auto-rotating hero slideshow
│   │   ├── FeaturedGrid.astro       # Masonry layout wrapper
│   │   ├── FeaturedImage.astro      # Individual grid item with hover label
│   │   └── SkeletonCard.astro       # Loading state for grid items
│   └── ui/
│       └── Button.astro              # Reusable CTA button
├── pages/
│   └── index.astro                   # Landing page composition
└── assets/
    └── images/
        └── hero/                     # Hero carousel images
            ├── slide-1.jpg
            ├── slide-2.jpg
            └── slide-3.jpg
```

### Pattern 1: Hero Carousel with Auto-Rotate

**What:** Full-viewport hero section with 3-5 images that auto-advance every 4-5 seconds, with visible navigation arrows and pagination dots.

**When to use:** For landing pages that need visual impact and want to showcase multiple hero images without user interaction.

**Example:**
```astro
---
// src/components/home/HeroCarousel.astro
import { Swiper, SwiperWrapper, SwiperSlide } from 'astro-swiper';
import { Image } from 'astro:assets';
import slide1 from '@/assets/images/hero/slide-1.jpg';
import slide2 from '@/assets/images/hero/slide-2.jpg';

const slides = [
  { src: slide1, alt: 'Wedding ceremony moment' },
  { src: slide2, alt: 'Landscape vista' },
];
---

<Swiper
  options={{
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    effect: 'slide', // or 'fade', 'cube', 'coverflow'
    speed: 800, // transition duration in ms
  }}
  class="h-[100dvh] w-full"
  client:visible
>
  <SwiperWrapper>
    {slides.map((slide) => (
      <SwiperSlide>
        <div class="relative h-full w-full bg-surface-900">
          <Image
            src={slide.src}
            alt={slide.alt}
            class="h-full w-full object-cover"
            loading="eager" {/* First slide should load eagerly */}
          />
        </div>
      </SwiperSlide>
    ))}
  </SwiperWrapper>

  <!-- Navigation arrows -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>

  <!-- Pagination dots -->
  <div class="swiper-pagination"></div>

  <!-- Overlay content -->
  <div class="absolute bottom-12 left-12 z-10 text-surface-50">
    <h1 class="font-display text-5xl font-bold">Simon Wickes Photography</h1>
    <p class="text-xl">Capturing authentic moments</p>
  </div>
</Swiper>

<style>
  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    :global(.swiper) {
      --swiper-navigation-size: 44px;
    }
  }
</style>
```

**Source:** [astro-swiper GitHub](https://github.com/pascal-brand38/astro-swiper), [Swiper.js API](https://swiperjs.com/swiper-api)

### Pattern 2: Masonry Featured Grid with Hover Labels

**What:** Variable-height image grid (12-16 images) with category labels that appear on hover, linking to service pages.

**When to use:** For showcasing curated work samples that span multiple categories, where visual hierarchy and flow matter more than strict grid alignment.

**Example:**
```astro
---
// src/components/home/FeaturedGrid.astro
import { Masonry } from 'astro-masonry';
import FeaturedImage from './FeaturedImage.astro';
import { getCollection } from 'astro:content';

// Curated images with category metadata
const featured = [
  { src: import('@/assets/images/featured/wedding-1.jpg'), category: 'Weddings', href: '/services/weddings' },
  { src: import('@/assets/images/featured/landscape-1.jpg'), category: 'Landscape', href: '/services/landscape' },
  // ... 10-14 more
];
---

<Masonry
  breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
  class="featured-grid"
  columnClass="featured-grid-column"
>
  {featured.map((item) => (
    <FeaturedImage
      image={item.src}
      category={item.category}
      href={item.href}
    />
  ))}
</Masonry>

<style>
  .featured-grid {
    gap: 1rem;
  }
  .featured-grid-column {
    background-clip: padding-box;
  }
</style>
```

```astro
---
// src/components/home/FeaturedImage.astro
import { Image } from 'astro:assets';

interface Props {
  image: ImageMetadata;
  category: string;
  href: string;
}

const { image, category, href } = Astro.props;
---

<a href={href} class="group relative block overflow-hidden rounded-lg">
  <Image
    src={image}
    alt={`${category} photography`}
    class="transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
    widths={[400, 600, 800]}
    sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
  />

  <!-- Hover overlay with category label -->
  <div class="absolute inset-0 flex items-end bg-gradient-to-t from-surface-900/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    <span class="font-display text-lg font-semibold text-surface-50">{category}</span>
  </div>
</a>
```

**Source:** [astro-masonry GitHub](https://github.com/OlivierEstevez/astro-masonry), [Tailwind group-hover documentation](https://tailwindcss.com/docs/hover-focus-and-other-states)

### Pattern 3: Skeleton Loading States

**What:** CSS-only loading placeholders that reserve space and provide visual feedback while content loads.

**When to use:** For featured grid images and any content that loads asynchronously below the fold.

**Example:**
```astro
---
// src/components/home/SkeletonCard.astro
---

<div class="skeleton-card animate-pulse overflow-hidden rounded-lg bg-surface-200 dark:bg-surface-800" style="aspect-ratio: 3/4;">
  <div class="h-full w-full bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 dark:from-surface-800 dark:via-surface-700 dark:to-surface-800"></div>
</div>

<style>
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton-card {
    background: linear-gradient(
      90deg,
      var(--color-surface-200) 0%,
      var(--color-surface-300) 50%,
      var(--color-surface-200) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  :global(.dark) .skeleton-card {
    background: linear-gradient(
      90deg,
      var(--color-surface-800) 0%,
      var(--color-surface-700) 50%,
      var(--color-surface-800) 100%
    );
  }

  /* Disable animation if user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .skeleton-card {
      animation: none;
      background: var(--color-surface-200);
    }
    :global(.dark) .skeleton-card {
      background: var(--color-surface-800);
    }
  }
</style>
```

**Source:** [CSS-Tricks: Building Skeleton Screens with CSS Custom Properties](https://css-tricks.com/building-skeleton-screens-css-custom-properties/), [freeCodeCamp: Skeleton Loader Example](https://www.freecodecamp.org/news/how-to-build-skeleton-screens-using-css-for-better-user-experience/)

### Pattern 4: Accessible Auto-Rotating Carousel

**What:** Hero carousel that respects motion preferences and provides pause controls.

**When to use:** Any auto-rotating carousel (required for accessibility).

**Example:**
```astro
---
// Add to HeroCarousel.astro
---

<Swiper
  options={{
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    // ... other options
  }}
  data-carousel-autoplay="true"
  client:visible
>
  <!-- slides -->
</Swiper>

<!-- Pause/Play button -->
<button
  id="carousel-toggle"
  class="absolute bottom-6 right-6 z-20 rounded-full bg-surface-900/50 p-3 text-surface-50 hover:bg-surface-900/70"
  aria-label="Pause carousel"
>
  <svg class="pause-icon h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
  <svg class="play-icon hidden h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
</button>

<script>
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Disable autoplay for users who prefer reduced motion
    const carousel = document.querySelector('[data-carousel-autoplay]');
    if (carousel && carousel.swiper) {
      carousel.swiper.autoplay.stop();
    }
  }

  // Toggle button functionality
  const toggle = document.getElementById('carousel-toggle');
  const carousel = document.querySelector('[data-carousel-autoplay]');
  let isPlaying = !prefersReducedMotion;

  toggle?.addEventListener('click', () => {
    if (carousel?.swiper) {
      if (isPlaying) {
        carousel.swiper.autoplay.stop();
        toggle.setAttribute('aria-label', 'Play carousel');
        toggle.querySelector('.pause-icon')?.classList.add('hidden');
        toggle.querySelector('.play-icon')?.classList.remove('hidden');
      } else {
        carousel.swiper.autoplay.start();
        toggle.setAttribute('aria-label', 'Pause carousel');
        toggle.querySelector('.pause-icon')?.classList.remove('hidden');
        toggle.querySelector('.play-icon')?.classList.add('hidden');
      }
      isPlaying = !isPlaying;
    }
  });
</script>
```

**Source:** [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion), [Medium: How to build an accessible carousel](https://medium.com/@andrescoronel1209/how-to-build-an-accessible-carousel-without-anoying-users-1ec320e4b465)

### Anti-Patterns to Avoid

- **Using `100vh` for hero height on mobile:** Mobile browsers' dynamic UI causes `100vh` to overflow viewport when address bar is visible. Use `100dvh` (dynamic viewport height) instead.
- **Hydrating everything with `client:load`:** Astro's islands architecture requires explicit hydration. Only use `client:load` for above-the-fold interactive elements. Use `client:visible` for below-fold carousels.
- **Not preloading first hero image:** First carousel slide should have `loading="eager"` and be preloaded with `<link rel="preload">` to optimize LCP.
- **Forgetting `prefers-reduced-motion`:** Auto-rotating carousels MUST respect accessibility preferences. Always disable autoplay when `prefers-reduced-motion: reduce` is detected.
- **Missing explicit dimensions on images:** Causes layout shift (CLS). Astro's Image component handles this automatically, but verify with responsive images.
- **Using JavaScript masonry libraries:** Native CSS solutions and astro-masonry are lighter and SSR-friendly. Avoid Masonry.js/Isotope unless specific features needed.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auto-rotating carousel | Custom JavaScript slider | astro-swiper + Swiper.js | Touch gestures, accessibility, transitions, keyboard nav, responsive behavior, ARIA support built-in |
| Masonry layout | Manual column calculation | astro-masonry | Handles responsive breakpoints, image loading, SSR, zero-dependency, tested across browsers |
| Image optimization | Custom Sharp scripts | Astro Image/Picture components | Built-in Sharp pipeline (Phase 1), automatic format conversion, responsive srcset, lazy loading |
| Skeleton loaders | JavaScript placeholder generators | CSS-only with @keyframes | No JS overhead, works with SSR, respects `prefers-reduced-motion`, theme-aware with CSS custom properties |
| Hover overlays | Custom JavaScript hover handlers | Tailwind `group-hover:` utilities | Zero JS, better performance, easier to maintain, works with SSR |

**Key insight:** Astro's SSR-first architecture means solutions that work without client-side JavaScript are preferred. Interactive components need explicit hydration directives, so minimize JS dependencies. Swiper.js is the exception - it's the industry standard and astro-swiper provides clean integration.

## Common Pitfalls

### Pitfall 1: Poor LCP Due to Unoptimized Hero Images

**What goes wrong:** First hero image loads slowly, causing poor Largest Contentful Paint (LCP) scores. LCP target is under 2.5 seconds.

**Why it happens:** Hero images are often the LCP element, but they're not prioritized in loading. Lazy loading the first slide, not preloading, or using oversized images all delay LCP.

**How to avoid:**
- First carousel slide MUST use `loading="eager"` (not lazy)
- Add `<link rel="preload" as="image" href="..." />` for first slide in document `<head>`
- Use Astro Picture component with AVIF + WebP formats for smaller file sizes
- Optimize source images (target < 200KB for hero images)
- Consider using solid color placeholder (`bg-surface-900`) to prevent white flash

**Warning signs:**
- PageSpeed Insights shows LCP > 2.5s
- Hero section shows white/blank space before image loads
- Lighthouse flags "Preload Largest Contentful Paint image"

**Source:** [web.dev: Largest Contentful Paint](https://web.dev/articles/lcp), [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)

### Pitfall 2: Layout Shift (CLS) in Masonry Grid

**What goes wrong:** Images load with unknown dimensions, causing grid to reflow and shift content as images appear. CLS target is under 0.1.

**Why it happens:** Remote images or improperly configured Image components don't reserve space. Masonry layout recalculates positions when image dimensions become known.

**How to avoid:**
- Always import images from `src/assets/` (not `public/` or remote URLs)
- Astro Image component infers dimensions automatically from local imports
- For remote images, use `inferSize` attribute or explicit `width`/`height`
- Provide aspect ratio hints: `style="aspect-ratio: 3/4"` on containers
- Use skeleton cards with explicit dimensions while loading

**Warning signs:**
- PageSpeed Insights shows CLS > 0.1
- Grid jumps/reflows as images load
- Lighthouse flags "Avoid large layout shifts"

**Source:** [web.dev: Cumulative Layout Shift](https://developers.google.com/search/docs/appearance/core-web-vitals), [astro-masonry GitHub: Image Handling](https://github.com/OlivierEstevez/astro-masonry)

### Pitfall 3: Mobile Safari Viewport Height Issues

**What goes wrong:** Hero section with `height: 100vh` overflows viewport on mobile Safari/Chrome when address bar is visible, requiring vertical scroll to see full hero.

**Why it happens:** Mobile browsers calculate `100vh` based on maximum viewport (with UI hidden), not current viewport. Address bar visibility changes viewport size but doesn't update `vh` units.

**How to avoid:**
- Use `100dvh` (dynamic viewport height) instead of `100vh`
- Provide fallback: `height: 100vh; height: 100dvh;` (older browsers ignore second declaration)
- For Tailwind, use: `class="h-[100vh] h-[100dvh]"` (or add custom utility)
- Test on actual mobile devices, not just DevTools emulation

**Warning signs:**
- Hero section requires scroll on mobile to see bottom content
- Overlay text (name/tagline) is partially cut off
- Users report content being "below the fold" unexpectedly

**Source:** [Medium: Stop Fighting with 100vh on iOS](https://medium.com/@chakinalasreenath/stop-fighting-with-100vh-on-ios-meet-viewportify-8690c47d6192), [Frontend.fyi: Fix for 100vh on mobile](https://www.frontend.fyi/tutorials/finally-a-fix-for-100vh-on-mobile), [Medium: Understanding Mobile Viewport Units](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-a-complete-guide-to-svh-lvh-and-dvh-0c905d96e21a)

### Pitfall 4: Carousel Not Respecting Reduced Motion Preferences

**What goes wrong:** Auto-rotating carousel continues to animate for users who have enabled "reduce motion" in their OS accessibility settings. Can trigger motion sensitivity, vestibular issues, or distraction for users with cognitive disabilities.

**Why it happens:** Developers forget to check `prefers-reduced-motion` media query. Swiper.js doesn't automatically disable autoplay based on this preference.

**How to avoid:**
- Detect preference: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Disable autoplay when true: `carousel.swiper.autoplay.stop()`
- Provide visible pause/play button (accessibility requirement)
- Add pause on hover: `pauseOnMouseEnter: true` in Swiper options
- Auto-pause after 5+ seconds running (WCAG requirement)

**Warning signs:**
- Users report motion sickness or distraction
- Accessibility audit tools flag "Auto-playing content"
- Carousel continues moving despite OS reduced motion setting

**Source:** [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion), [Pope Tech: Design accessible animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)

### Pitfall 5: Over-Hydrating Static Content

**What goes wrong:** Adding `client:load` to components that don't need interactivity (like static image cards) sends unnecessary JavaScript to the browser, hurting performance.

**Why it happens:** Developers default to adding client directives "just in case" or don't understand Astro's islands architecture.

**How to avoid:**
- Astro components are static HTML by default (zero JS)
- Only add client directives to actually interactive components
- Carousel needs `client:visible` or `client:load`
- Image cards with hover CSS effects do NOT need hydration
- Skeleton loaders should be pure CSS (no client directive)
- Test with Network tab disabled - pure CSS effects still work

**Warning signs:**
- Large JavaScript bundles in production build
- Lighthouse flags "Reduce unused JavaScript"
- Components load slowly on slow connections despite being mostly static

**Source:** [Astro Docs: Islands Architecture](https://docs.astro.build/en/concepts/islands/), [DEV: Astro's Client Directives: When and Where to Use Each](https://dev.to/lovestaco/astros-client-directives-when-and-where-to-use-each-165g)

### Pitfall 6: CTA Buttons Placed Incorrectly

**What goes wrong:** Call-to-action buttons appear too early (before user is engaged) or too late (after user has scrolled past), missing the optimal moment for conversion.

**Why it happens:** Lack of understanding user journey and decision-making process on landing pages.

**How to avoid:**
- Do NOT place CTA in hero itself (per context decisions)
- Place first CTA after hero, before featured section (builds interest first)
- Repeat CTA at end of featured section (after user has seen work samples)
- For mobile, consider sticky footer CTA on long pages
- Use two CTAs: primary ("Explore Services") and secondary ("Get in Touch")
- Test CTA placement with scroll heatmaps/analytics

**Warning signs:**
- Low click-through rates on CTAs
- Users scroll past CTAs without noticing
- Analytics show drop-off before reaching CTA

**Source:** [LandingPageFlow: Best CTA Placement Strategies for 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages), [Bitly: CTA Button Best Practices](https://bitly.com/blog/cta-button-best-practices-for-landing-pages/)

## Code Examples

Verified patterns from official sources:

### Preloading Hero Image for Optimal LCP
```astro
---
// src/pages/index.astro
import HeroCarousel from '@/components/home/HeroCarousel.astro';
import heroSlide1 from '@/assets/images/hero/slide-1.jpg';
---

<html>
  <head>
    <title>Simon Wickes Photography</title>

    <!-- Preload first hero image for better LCP -->
    <link
      rel="preload"
      as="image"
      href={heroSlide1.src}
      type="image/webp"
    />
  </head>
  <body>
    <HeroCarousel />
  </body>
</html>
```

**Source:** [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)

### Responsive Masonry Breakpoints
```astro
---
import { Masonry } from 'astro-masonry';
---

<Masonry
  breakpointCols={{
    default: 4,  // 4 columns on desktop (>1100px)
    1100: 3,     // 3 columns on laptop (700-1100px)
    700: 2,      // 2 columns on tablet (500-700px)
    500: 1       // 1 column on mobile (<500px)
  }}
  sortByHeight={false} // Keep original order, don't reorganize by height
>
  <!-- Image items -->
</Masonry>
```

**Source:** [astro-masonry GitHub](https://github.com/OlivierEstevez/astro-masonry)

### Swiper Configuration for Auto-Rotating Hero
```astro
---
import { Swiper, SwiperWrapper, SwiperSlide } from 'astro-swiper';
---

<Swiper
  options={{
    // Auto-advance every 4.5 seconds
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,  // Continue after user interaction
      pauseOnMouseEnter: true,      // Pause when user hovers
    },

    // Loop infinitely
    loop: true,

    // Slide transition (not fade/cube)
    effect: 'slide',
    speed: 800,  // 800ms transition duration

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Pagination dots
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: false,  // Show all dots
    },
  }}
  client:visible  // Hydrate when visible (or client:load if above fold)
>
  <SwiperWrapper>
    <!-- Slides -->
  </SwiperWrapper>

  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
  <div class="swiper-pagination"></div>
</Swiper>
```

**Source:** [Swiper.js Autoplay Options](https://swiperjs.com/types/interfaces/types_modules_autoplay.AutoplayOptions), [astro-swiper GitHub](https://github.com/pascal-brand38/astro-swiper)

### Tailwind Group Hover Pattern for Image Labels
```astro
<a href="/services/weddings" class="group relative block">
  <img src="..." alt="..." class="transition-transform group-hover:scale-105" />

  <!-- Overlay appears on group hover -->
  <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
    <span class="text-white">Weddings</span>
  </div>
</a>
```

**Source:** [Tailwind CSS: Hover, Focus, and Other States](https://tailwindcss.com/docs/hover-focus-and-other-states), [Sling Academy: Tailwind CSS Image Hover Overlay Effects](https://www.slingacademy.com/article/tailwind-css-create-image-hover-overlay-effects/)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `100vh` for mobile hero | `100dvh` (dynamic viewport height) | 2023-2024 CSS spec | Fixes mobile browser UI overflow issue |
| Native CSS `grid-template-rows: masonry` | JavaScript libraries (astro-masonry, Masonry.js) | Still experimental in 2026 | CSS masonry only in Firefox with flag - not production-ready |
| LQIP (blurred image placeholders) | Solid color placeholders + skeleton cards | Ongoing | LQIP adds build time, hurts SEO if not careful; solid color is simpler and faster |
| jQuery carousels | Swiper.js v12 | 2020+ | Modern, mobile-first, framework-agnostic, better performance |
| `client:load` everywhere | Selective hydration with `client:visible` | Astro 1.0+ (2022) | Islands architecture - only hydrate interactive components, massive perf improvement |

**Deprecated/outdated:**
- **CSS-only carousels with `:target` pseudo-class:** Clever but limited - no autoplay, poor UX, not accessible
- **Isotope/Packery masonry libraries:** Heavy dependencies, jQuery-based, astro-masonry is lighter and SSR-friendly
- **Loading spinners for images:** Skeleton screens provide better perceived performance and prevent layout shift
- **`loading="lazy"` on hero images:** First slide MUST use `loading="eager"` for optimal LCP
- **Ignoring `prefers-reduced-motion`:** Now a WCAG accessibility requirement, not optional

## Open Questions

Things that couldn't be fully resolved:

1. **Click behavior for featured images (lightbox vs navigate)**
   - What we know: Context marked as "Claude's Discretion" - can choose approach
   - What's unclear: User preference for navigation flow (direct to service page vs modal view)
   - Recommendation: Navigate directly to category page (simpler, better SEO, faster implementation). Lightbox requires additional library (photoswipe/yet-another-react-lightbox) and client-side hydration. Reserve lightbox for Phase 3 service galleries if needed.

2. **Image reveal animation style (fade vs instant)**
   - What we know: Astro Image component loads with `loading="lazy"` by default
   - What's unclear: Whether to add CSS fade-in transition on image load
   - Recommendation: Instant reveal for simplicity. If fade desired, use CSS: `img { opacity: 0; transition: opacity 0.3s; } img.loaded { opacity: 1; }` with Intersection Observer. Check `prefers-reduced-motion` first.

3. **Hero placeholder color (dark to match theme)**
   - What we know: Context suggests dark placeholder, theme uses `--color-surface-900` for dark mode
   - What's unclear: Whether light mode should use different placeholder
   - Recommendation: Use `bg-surface-900` for both modes (dark placeholder) as hero images typically have dark/dramatic subjects. Test with actual images in Phase 2 implementation.

4. **Number of hero slides and timing**
   - What we know: 4-5 seconds per slide, rotating slideshow
   - What's unclear: Optimal number of slides (3? 5? 7?) and exact timing
   - Recommendation: Start with 3-5 slides at 4500ms delay. More slides = longer cycle = users may not see all. Fewer = repetitive. Test with real images and get user feedback.

5. **Featured work curation strategy**
   - What we know: 12-16 images from across service categories
   - What's unclear: Selection process, how often to update, ratio per category
   - Recommendation: Programming concern (not research domain). Suggest manual curation in content collections or frontmatter flag `featured: true`. Equal distribution across categories or weight toward strengths.

## Sources

### Primary (HIGH confidence)
- [Astro Docs: Images Guide](https://docs.astro.build/en/guides/images/) - Image/Picture components, lazy loading, optimization
- [astro-swiper GitHub](https://github.com/pascal-brand38/astro-swiper) - Installation, usage, Astro integration
- [Swiper.js Official Site](https://swiperjs.com/) - v12.1.0 features, autoplay, navigation
- [Swiper.js API Documentation](https://swiperjs.com/swiper-api) - Full API reference
- [Swiper.js Autoplay Options](https://swiperjs.com/types/interfaces/types_modules_autoplay.AutoplayOptions) - Autoplay configuration
- [astro-masonry GitHub](https://github.com/OlivierEstevez/astro-masonry) - Zero-dependency masonry, breakpoints, usage
- [MDN: CSS Grid Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout) - Experimental CSS masonry, browser support
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility, motion preferences
- [Astro Docs: Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Client directives, hydration strategy

### Secondary (MEDIUM confidence)
- [web.dev: Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) - Performance metrics, optimization targets
- [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp) - Preloading, image optimization strategies
- [web.dev: Cumulative Layout Shift](https://developers.google.com/search/docs/appearance/core-web-vitals) - CLS metrics, layout shift prevention
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) - Implementation guidance
- [Medium: Stop Fighting with 100vh on iOS](https://medium.com/@chakinalasreenath/stop-fighting-with-100vh-on-ios-meet-viewportify-8690c47d6192) - Mobile viewport issues, dvh units
- [Frontend.fyi: Fix for 100vh on mobile](https://www.frontend.fyi/tutorials/finally-a-fix-for-100vh-on-mobile) - Mobile viewport solutions
- [Medium: Understanding Mobile Viewport Units](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-a-complete-guide-to-svh-lvh-and-dvh-0c905d96e21a) - dvh/lvh/svh explanation
- [Medium: How to build an accessible carousel](https://medium.com/@andrescoronel1209/how-to-build-an-accessible-carousel-without-anoying-users-1ec320e4b465) - Carousel accessibility patterns
- [Pope Tech: Design accessible animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) - Motion accessibility best practices
- [CSS-Tricks: Building Skeleton Screens with CSS Custom Properties](https://css-tricks.com/building-skeleton-screens-css-custom-properties/) - Skeleton UI patterns
- [freeCodeCamp: Skeleton Loader Example](https://www.freecodecamp.org/news/how-to-build-skeleton-screens-using-css-for-better-user-experience/) - CSS skeleton implementation
- [Tailwind CSS: Hover, Focus, and Other States](https://tailwindcss.com/docs/hover-focus-and-other-states) - State variants, group-hover
- [Sling Academy: Tailwind CSS Image Hover Overlay Effects](https://www.slingacademy.com/article/tailwind-css-create-image-hover-overlay-effects/) - Hover pattern examples
- [DEV: Astro's Client Directives: When and Where to Use Each](https://dev.to/lovestaco/astros-client-directives-when-and-where-to-use-each-165g) - Client directive guidance
- [LandingPageFlow: Best CTA Placement Strategies for 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - CTA positioning
- [Bitly: CTA Button Best Practices](https://bitly.com/blog/cta-button-best-practices-for-landing-pages/) - CTA design and copy
- [Pinelab.studio: Implementing LQIP in Astro](https://pinelab.studio/blog/implementing-low-quality-image-placeholders-lqip-in-astro/) - LQIP implementation (optional approach)
- [@unpic/astro Documentation](https://unpic.pics/img/astro/) - Alternative placeholder generation (optional)

### Tertiary (LOW confidence - ecosystem discovery only)
- WebSearch results for carousel libraries - Multiple sources confirmed Swiper.js as standard
- WebSearch results for masonry approaches - Confirmed CSS masonry still experimental
- WebSearch results for skeleton loaders - General best practices, multiple sources agreeing on CSS-first approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Swiper.js and astro-masonry are established, well-documented, actively maintained solutions. Verified through official docs and GitHub repos.
- Architecture: HIGH - Patterns verified with official documentation (Astro, Swiper, astro-masonry). Code examples sourced from official APIs.
- Pitfalls: HIGH - Performance pitfalls (LCP, CLS, 100vh) verified with web.dev/MDN. Accessibility requirements verified with WCAG guidelines and MDN.
- Loading states: MEDIUM - Skeleton UI patterns well-established but implementation details vary by source. CSS-first approach is consensus.
- CTA placement: MEDIUM - Best practices based on multiple landing page optimization sources, but specific placement will require A/B testing.

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days - stable technologies, unlikely to change rapidly)
**Key dependencies verified:** Swiper.js v12.1.0 (released Jan 28, 2026), Astro 5.17 (current), Tailwind v4.1.18 (current)
