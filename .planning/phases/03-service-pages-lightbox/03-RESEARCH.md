# Phase 3: Service Pages & Lightbox - Research

**Researched:** 2026-02-09
**Domain:** Service category pages with masonry gallery grids and PhotoSwipe lightbox viewer
**Confidence:** HIGH

## Summary

Phase 3 implements 8 service category pages (Outdoor Portraits, Weddings, Commercial, Landscape, Cars, Assignments, Events, Live Performances) each with a hero section, service description, CTA, horizontal service navigation bar, and a masonry gallery grid of 15-20 curated images. Clicking any gallery image opens a full-screen lightbox for immersive viewing.

The standard approach is: reuse the existing `astro-masonry` component (already installed, v1.2.2) for gallery grids, add PhotoSwipe v5.4.4 for the lightbox (industry standard, 417K weekly npm downloads, 25K GitHub stars), use Astro's `import.meta.glob` with eager loading to dynamically import gallery images from `src/assets/images/services/{category}/`, and pass Astro's `ImageMetadata` dimensions (width/height) directly to PhotoSwipe's `data-pswp-width`/`data-pswp-height` attributes. Each service page remains a static `.astro` file (no dynamic routing needed since there are exactly 8 fixed pages), but a shared data file centralizes service metadata (title, slug, description) to avoid duplication.

Key architectural decisions: PhotoSwipe is initialized via a `<script>` tag that listens for `astro:page-load` events (future-proofing for View Transitions). The lightbox uses solid black background (`bgOpacity: 1`), controls that auto-hide after idle timeout via PhotoSwipe's built-in `pswp__ui--idle` CSS class, Escape key to close, arrow keys to navigate, and no backdrop-click close (`bgClickAction: 'none'`). The horizontal service nav bar uses `overflow-x-auto` with hidden scrollbar for mobile.

**Primary recommendation:** Install PhotoSwipe v5, create a shared `ServiceGallery.astro` component wrapping astro-masonry + PhotoSwipe initialization, and a `ServiceNav.astro` component for the horizontal category navigation. Reuse existing `PageLayout.astro` and `Button.astro` components. Use `import.meta.glob` with eager loading for per-category image imports.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PhotoSwipe | ^5.4.4 | Lightbox/full-screen image viewer | Industry standard (417K npm weekly downloads, 25K GitHub stars), vanilla JS, modular ES modules, built-in touch/swipe/keyboard/zoom, no framework dependency |
| astro-masonry | ^1.2.2 (installed) | Masonry gallery grid layout | Already in use from Phase 2, zero-dependency, responsive breakpoints, SSR-friendly |
| Astro Image | Built-in | Image optimization + dimension metadata | Phase 1 foundation -- Sharp pipeline, auto webp conversion, provides `ImageMetadata` with width/height for PhotoSwipe |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Button.astro | Existing | CTA buttons | Reuse for "Contact me" CTA on each service page |
| PageLayout.astro | Existing | Page wrapper with header/footer | Reuse for all service pages |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PhotoSwipe | GLightbox | GLightbox is 11KB gzipped (smaller), simpler API, but PhotoSwipe has 10x more downloads, better touch/zoom, richer customization, and built-in idle UI auto-hide |
| PhotoSwipe | astro-pandabox | Astro-native, but only 50 GitHub stars, limited customization, no idle auto-hide, requires Content Collections JSON format |
| PhotoSwipe | lightGallery | Feature-rich but 7.97MB bundle size vs PhotoSwipe's 1.21MB, commercial license required for commercial use |
| Static service pages | Dynamic `[slug].astro` route | Dynamic routing adds complexity (getStaticPaths, content collection) for only 8 pages. Static files are simpler, more explicit, easier to customize per-category |
| import.meta.glob | Content Collections with image() schema | Content collections add JSON/YAML/MD per category plus schema config. For image-only galleries with no markdown content, import.meta.glob is simpler and equally type-safe |

**Installation:**
```bash
npm install photoswipe
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── services/
│   │   ├── ServiceGallery.astro     # Masonry grid + PhotoSwipe lightbox wrapper
│   │   ├── ServiceNav.astro         # Horizontal service category navigation
│   │   └── ServiceHero.astro        # Hero section with title, description, CTA
│   └── ui/
│       └── Button.astro             # (existing) Reused for CTA
├── data/
│   └── services.ts                  # Service metadata (title, slug, description)
├── pages/
│   └── services/
│       ├── index.astro              # (existing) Services overview -- update to match new nav style
│       ├── outdoor-portraits.astro  # (existing placeholder) Replace with full page
│       ├── weddings.astro           # (existing placeholder) Replace with full page
│       ├── commercial.astro         # ...
│       ├── landscape.astro
│       ├── cars.astro
│       ├── assignments.astro
│       ├── events.astro
│       └── live-performances.astro
├── assets/
│   └── images/
│       └── services/
│           ├── outdoor-portraits/   # 15-20 curated images
│           │   ├── 01-best-shot.jpg
│           │   ├── 02-second.jpg
│           │   └── ...
│           ├── weddings/
│           ├── commercial/
│           ├── landscape/
│           ├── cars/
│           ├── assignments/
│           ├── events/
│           └── live-performances/
└── styles/
    └── global.css                   # (existing) Add PhotoSwipe overrides
```

### Pattern 1: Shared Service Data Module
**What:** Centralize service metadata in a TypeScript data file to avoid duplication across 8 pages and the nav component.
**When to use:** When multiple components need the same data (service titles, slugs, descriptions) and DRY matters.
**Example:**
```typescript
// src/data/services.ts
export interface Service {
  title: string;
  slug: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Outdoor Portraits",
    slug: "outdoor-portraits",
    description: "Natural light portraits in beautiful outdoor settings. Whether it is a family session in a sun-drenched meadow or an individual portrait against dramatic scenery, every frame captures personality and connection.",
  },
  {
    title: "Weddings",
    slug: "weddings",
    description: "Capturing your special day with authentic moments. From preparation to the last dance, I document the emotions, details, and spontaneous joy that make your wedding uniquely yours.",
  },
  // ... 6 more
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
```
**Source:** Established pattern from existing `services/index.astro` which already defines service data inline.

### Pattern 2: Dynamic Image Glob for Gallery
**What:** Use `import.meta.glob` with eager loading to import all images from a category folder at build time, getting `ImageMetadata` (including width/height) for each.
**When to use:** When loading a variable number of images from a directory without explicitly importing each one.
**Example:**
```astro
---
// In ServiceGallery.astro or individual service page
import type { ImageMetadata } from "astro";

interface Props {
  category: string; // e.g. "weddings"
}

const { category } = Astro.props;

// NOTE: import.meta.glob requires static string literal for the path pattern.
// Cannot use template literals with variables.
// Each service page must pass pre-resolved images to the gallery component.

// In the service page itself:
const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/services/weddings/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

// Convert to sorted array (filenames prefixed with order numbers: 01-, 02-, etc.)
const galleryImages = Object.entries(images)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => ({
    image: mod.default,
    alt: "", // Will need alt text -- see Open Questions
  }));
---
```
**Source:** [Astro Docs: Dynamically Importing Images](https://docs.astro.build/en/recipes/dynamically-importing-images/), [Astro Docs: Images Guide](https://docs.astro.build/en/guides/images/)

### Pattern 3: PhotoSwipe Integration with Astro Images
**What:** Bridge Astro's build-time image optimization with PhotoSwipe's runtime lightbox by passing `ImageMetadata` dimensions to data attributes.
**When to use:** Any gallery where clicking an image opens a full-screen lightbox.
**Example:**
```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface GalleryImage {
  image: ImageMetadata;
  alt: string;
}

interface Props {
  images: GalleryImage[];
  galleryId: string;
}

const { images, galleryId } = Astro.props;
---

<div id={galleryId} class="pswp-gallery">
  {images.map((item) => (
    <a
      href={item.image.src}
      data-pswp-width={item.image.width}
      data-pswp-height={item.image.height}
      class="block overflow-hidden rounded-lg"
    >
      <Image
        src={item.image}
        alt={item.alt}
        class="w-full transition-transform duration-300 hover:scale-105"
        loading="lazy"
        width={600}
      />
    </a>
  ))}
</div>

<script>
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import "photoswipe/style.css";

  function initGallery() {
    const lightbox = new PhotoSwipeLightbox({
      gallery: ".pswp-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),

      // Immersive experience: solid black background
      bgOpacity: 1,

      // No backdrop click close (prevents accidental close)
      bgClickAction: "none",
      tapAction: "toggle-controls",

      // Keyboard navigation
      escKey: true,
      arrowKeys: true,

      // Close behaviors
      closeOnVerticalDrag: false,
      pinchToClose: false,

      // Animation
      showAnimationDuration: 250,
      hideAnimationDuration: 250,
    });

    lightbox.init();
  }

  // Initialize on page load (supports View Transitions)
  document.addEventListener("astro:page-load", initGallery, { once: false });
</script>

<style>
  /* Auto-hide controls on idle (PhotoSwipe adds pswp__ui--idle after ~4s) */
  :global(.pswp__ui--idle .pswp__top-bar) {
    opacity: 0 !important;
    transition: opacity 0.3s ease;
  }
  :global(.pswp__ui .pswp__top-bar) {
    transition: opacity 0.3s ease;
  }

  /* Solid black background */
  :global(.pswp) {
    --pswp-bg: #000;
  }
</style>
```
**Source:** [PhotoSwipe Getting Started](https://photoswipe.com/getting-started/), [PhotoSwipe Options](https://photoswipe.com/options/), [Astro + PhotoSwipe integration pattern](https://www.launchfa.st/blog/photoswipe-astro)

### Pattern 4: Horizontal Service Navigation Bar
**What:** A scrollable horizontal nav bar showing all 8 service categories, highlighting the current page.
**When to use:** On every service page for quick switching between categories.
**Example:**
```astro
---
// src/components/services/ServiceNav.astro
import { services } from "@/data/services";

interface Props {
  currentSlug: string;
}

const { currentSlug } = Astro.props;
---

<nav
  class="overflow-x-auto border-b border-surface-200 dark:border-surface-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  aria-label="Service categories"
>
  <div class="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2">
    {services.map((service) => (
      <a
        href={`/services/${service.slug}/`}
        class:list={[
          "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
          currentSlug === service.slug
            ? "bg-accent-500 text-surface-50"
            : "text-surface-600 hover:bg-surface-100 hover:text-accent-500 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-accent-400",
        ]}
      >
        {service.title}
      </a>
    ))}
  </div>
</nav>
```
**Source:** Tailwind CSS `overflow-x-auto` pattern, established scrollable tab pattern

### Pattern 5: Service Page Composition
**What:** Each service page composes hero, nav, gallery, and CTA from shared components.
**When to use:** Each of the 8 service pages follows this template.
**Example:**
```astro
---
// src/pages/services/weddings.astro
import PageLayout from "@layouts/PageLayout.astro";
import ServiceHero from "@components/services/ServiceHero.astro";
import ServiceNav from "@components/services/ServiceNav.astro";
import ServiceGallery from "@components/services/ServiceGallery.astro";
import { getServiceBySlug } from "@/data/services";
import type { ImageMetadata } from "astro";

const service = getServiceBySlug("weddings")!;

// Static glob -- must be literal string (Vite limitation)
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/services/weddings/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([_, mod]) => ({
    image: mod.default,
    alt: "", // Alt text populated from data or left descriptive
  }));
---

<PageLayout title={service.title} description={service.description}>
  <ServiceNav currentSlug="weddings" />
  <ServiceHero
    title={service.title}
    description={service.description}
  />
  <section class="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
    <ServiceGallery images={images} galleryId="weddings-gallery" />
  </section>
</PageLayout>
```
**Source:** Existing service page stubs and codebase patterns

### Anti-Patterns to Avoid
- **Dynamic import.meta.glob paths:** Vite does not support dynamic variables in `import.meta.glob()`. The path must be a static string literal. Each service page must define its own glob pattern or the glob must capture all service images and filter at runtime.
- **Using `client:load` on the gallery component:** The gallery grid is static HTML. Only the lightbox needs JavaScript. Initialize PhotoSwipe via a `<script>` tag (runs once in the browser), not a client-hydrated island.
- **Backdrop click to close lightbox:** Context decision explicitly says no backdrop click close (prevents accidental close while swiping). Set `bgClickAction: "none"`.
- **Displaying image info in lightbox:** Context decision says immersive image-only experience. No captions, no counter. Remove default PhotoSwipe counter element.
- **Over-optimizing thumbnail size:** Gallery thumbnails at `width={600}` are sufficient for masonry grid (300px per column at 2x density). Do not generate multiple srcset variants unless needed -- single width is simpler for grid.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lightbox/fullscreen viewer | Custom modal with image zoom | PhotoSwipe v5 | Touch gestures, pinch-to-zoom, keyboard nav, swipe navigation, preloading, animation, accessibility, iOS quirks -- all solved |
| Masonry layout | Manual column calculation | astro-masonry | Already installed, responsive breakpoints, zero-dependency, tested, handles reflow |
| Image optimization | Custom Sharp scripts | Astro `Image` component + `import.meta.glob` | Build-time resize/format conversion, `ImageMetadata` provides width+height for PhotoSwipe |
| Scrollable tab bar | Custom JS scroll with arrows | CSS `overflow-x-auto` + hidden scrollbar | Pure CSS, no JS needed, native momentum scroll on touch devices |
| Service data duplication | Copy-paste titles/descriptions | Shared `services.ts` data module | Single source of truth, used by nav, hero, page metadata, services index |
| Idle control auto-hide | Custom setTimeout + mousemove | PhotoSwipe built-in `pswp__ui--idle` class | PhotoSwipe adds the class automatically after ~4s of idle. Style with CSS. |

**Key insight:** PhotoSwipe solves the hardest problems (touch gestures, zoom, swipe, keyboard, preloading, animations, idle UI) out of the box. The main integration work is bridging Astro's build-time `ImageMetadata` (width/height/src) to PhotoSwipe's `data-pswp-*` attributes -- which is straightforward since both use the same dimension information.

## Common Pitfalls

### Pitfall 1: import.meta.glob Path Must Be Static
**What goes wrong:** Developer tries to pass a variable to `import.meta.glob()` (e.g., `` import.meta.glob(`/src/assets/images/services/${slug}/*.jpg`) ``), which fails at build time.
**Why it happens:** Vite analyzes `import.meta.glob` statically at compile time. It cannot resolve runtime variables.
**How to avoid:** Two approaches:
  1. Each service page defines its own static glob (8 pages, 8 globs -- most explicit).
  2. Use a single glob that captures all service images (`/src/assets/images/services/**/*.{jpg,jpeg,png,webp}`) and filter by path prefix at build time.
**Warning signs:** Build error mentioning "import.meta.glob does not support dynamic patterns."
**Recommendation:** Option 1 (per-page static glob) is cleaner. Each service page is already a separate `.astro` file; the glob belongs in the page frontmatter. The gallery component receives resolved `ImageMetadata[]` as a prop.

### Pitfall 2: Missing PhotoSwipe Dimensions
**What goes wrong:** Lightbox opens with incorrect layout or images appear tiny because `data-pswp-width` / `data-pswp-height` are missing or wrong.
**Why it happens:** Developer forgets to pass image dimensions to the anchor tag's data attributes. Or uses thumbnail dimensions instead of original image dimensions.
**How to avoid:** Astro's `ImageMetadata` from `import.meta.glob({ eager: true })` includes `.width` and `.height` of the original source image. Pass these directly to `data-pswp-width` and `data-pswp-height`. The `src` field contains the optimized (webp) URL.
**Warning signs:** Images appear zoomed in oddly, lightbox animation looks broken, or images are positioned incorrectly.

### Pitfall 3: PhotoSwipe Script Runs Before DOM
**What goes wrong:** PhotoSwipe initializes but finds no gallery elements because the script runs before the page has rendered.
**Why it happens:** Script ordering issues, especially with Astro's partial hydration or View Transitions.
**How to avoid:** Use `document.addEventListener("astro:page-load", initGallery)` instead of running at module scope. This event fires after DOM is ready and is compatible with View Transitions.
**Warning signs:** Clicking images navigates to the image URL instead of opening the lightbox. Console shows no errors.

### Pitfall 4: PhotoSwipe Not Destroyed on Navigation
**What goes wrong:** If View Transitions are added later, navigating between service pages can cause multiple PhotoSwipe instances to accumulate, causing memory leaks and duplicate lightboxes.
**Why it happens:** PhotoSwipe `init()` is called on each page load but old instances are never cleaned up.
**How to avoid:** Store the lightbox instance and call `lightbox.destroy()` in an `astro:before-swap` listener, or guard against re-initialization. Pattern:
```javascript
let currentLightbox: PhotoSwipeLightbox | null = null;

function initGallery() {
  currentLightbox?.destroy();
  currentLightbox = new PhotoSwipeLightbox({ /* options */ });
  currentLightbox.init();
}
```
**Warning signs:** Multiple overlapping lightboxes, performance degradation after navigating between service pages.

### Pitfall 5: Gallery Images Not Sorted Predictably
**What goes wrong:** Images appear in arbitrary filesystem order instead of the intended sequence (best images first).
**Why it happens:** `import.meta.glob` returns object keys in filesystem order, which varies by OS. No guarantee of alphabetical ordering.
**How to avoid:** Prefix filenames with order numbers (`01-`, `02-`, etc.) and explicitly sort the entries array by key: `Object.entries(images).sort(([a], [b]) => a.localeCompare(b))`.
**Warning signs:** Gallery order changes between builds or differs on CI vs local.

### Pitfall 6: Lightbox Body Scroll Not Locked
**What goes wrong:** When the lightbox is open, the page behind it is still scrollable, causing a confusing double-scroll experience on mobile.
**Why it happens:** PhotoSwipe v5 handles this automatically, but custom CSS overrides or z-index conflicts can break it.
**How to avoid:** Ensure PhotoSwipe's default CSS is imported (`import "photoswipe/style.css"`). Do not add `overflow: hidden` manually -- PhotoSwipe manages body scroll locking internally.
**Warning signs:** Page scrolls behind the open lightbox, especially noticeable on iOS.

### Pitfall 7: Placeholder Images During Development
**What goes wrong:** No real images exist during initial development, causing build errors from empty glob patterns or broken image references.
**Why it happens:** The 120-160 curated images (15-20 per category) may not be ready when development starts.
**How to avoid:** Generate placeholder images using Sharp (same pattern as Phase 1/2 hero placeholders). Create a simple script that generates solid-color placeholder JPGs at various aspect ratios for each category. Filenames follow the `01-placeholder.jpg` naming convention.
**Warning signs:** Build errors about empty image imports, broken image icons in the gallery.

## Code Examples

### PhotoSwipe Initialization with Idle Auto-Hide
```javascript
// Complete PhotoSwipe setup for service galleries
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

let currentLightbox = null;

function initServiceGallery() {
  // Destroy previous instance if exists (View Transitions safety)
  if (currentLightbox) {
    currentLightbox.destroy();
    currentLightbox = null;
  }

  const galleryEl = document.querySelector(".pswp-gallery");
  if (!galleryEl) return;

  currentLightbox = new PhotoSwipeLightbox({
    gallery: ".pswp-gallery",
    children: "a",
    pswpModule: () => import("photoswipe"),

    // Solid black background for immersive experience
    bgOpacity: 1,

    // Click actions: no accidental close
    bgClickAction: "none",           // No close on backdrop click
    tapAction: "toggle-controls",     // Tap toggles UI visibility
    imageClickAction: "zoom-or-close",
    doubleTapAction: "zoom",

    // Keyboard
    escKey: true,                     // Escape to close
    arrowKeys: true,                  // Arrow keys to navigate

    // Prevent accidental close
    closeOnVerticalDrag: false,
    pinchToClose: false,

    // Smooth animations
    showAnimationDuration: 250,
    hideAnimationDuration: 250,

    // Preload adjacent slides
    preload: [1, 2],
  });

  // Remove counter element (immersive -- no image count)
  currentLightbox.on("uiRegister", function () {
    currentLightbox.pswp.ui.registerElement({
      name: "custom-counter",
      className: "pswp__counter",
      onInit: (el) => {
        el.style.display = "none";
      },
    });
  });

  currentLightbox.init();
}

document.addEventListener("astro:page-load", initServiceGallery);
```
**Source:** [PhotoSwipe Options](https://photoswipe.com/options/), [PhotoSwipe Click Actions](https://photoswipe.com/click-and-tap-actions/), [PhotoSwipe Adding UI Elements](https://photoswipe.com/adding-ui-elements/)

### Astro Image Glob to PhotoSwipe Data Attributes
```astro
---
// In a service page frontmatter
import type { ImageMetadata } from "astro";

// Static glob -- Vite requirement
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/services/weddings/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

// Sort by filename (prefixed with order numbers: 01-, 02-, etc.)
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([_, mod]) => mod.default);
---

<!-- Each anchor provides PhotoSwipe with the full-size image URL and dimensions -->
{images.map((img) => (
  <a
    href={img.src}
    data-pswp-width={img.width}
    data-pswp-height={img.height}
  >
    <img
      src={img.src}
      width={600}
      height={Math.round(600 * (img.height / img.width))}
      loading="lazy"
      alt=""
    />
  </a>
))}
```
**Source:** [Astro Docs: Dynamically Importing Images](https://docs.astro.build/en/recipes/dynamically-importing-images/), [PhotoSwipe Getting Started](https://photoswipe.com/getting-started/)

### Masonry Gallery with PhotoSwipe Integration
```astro
---
import { Masonry } from "astro-masonry";
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface GalleryImage {
  image: ImageMetadata;
  alt: string;
}

interface Props {
  images: GalleryImage[];
  galleryId: string;
}

const { images, galleryId } = Astro.props;
---

<div id={galleryId} class="pswp-gallery">
  <Masonry
    breakpointCols={{
      default: 4,
      1024: 3,
      768: 2,
      480: 1,
    }}
    class="flex gap-4"
    columnClass=""
  >
    {images.map((item) => (
      <div class="mb-4">
        <a
          href={item.image.src}
          data-pswp-width={item.image.width}
          data-pswp-height={item.image.height}
          class="group block overflow-hidden rounded-lg"
        >
          <Image
            src={item.image}
            alt={item.alt}
            class="w-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            width={600}
          />
        </a>
      </div>
    ))}
  </Masonry>
</div>
```
**Source:** [astro-masonry GitHub](https://github.com/OlivierEstevez/astro-masonry), [PhotoSwipe Getting Started](https://photoswipe.com/getting-started/)

### PhotoSwipe Idle Auto-Hide CSS
```css
/* Controls fade out after idle period (~4 seconds by default) */
:global(.pswp__ui .pswp__top-bar),
:global(.pswp__ui .pswp__button--arrow--prev),
:global(.pswp__ui .pswp__button--arrow--next) {
  transition: opacity 0.3s ease;
}

:global(.pswp__ui--idle .pswp__top-bar),
:global(.pswp__ui--idle .pswp__button--arrow--prev),
:global(.pswp__ui--idle .pswp__button--arrow--next) {
  opacity: 0 !important;
}

/* Solid black background */
:global(.pswp) {
  --pswp-bg: #000;
}

/* Hide the default counter (immersive mode) */
:global(.pswp__counter) {
  display: none !important;
}
```
**Source:** [PhotoSwipe Styling](https://photoswipe.com/styling/), PhotoSwipe built-in `pswp__ui--idle` behavior

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PhotoSwipe v4 with separate UI module | PhotoSwipe v5 with ES modules + built-in CSS | v5 released 2022 | Single CSS file, dynamic icons via CSS vars, modular imports, lighter bundle |
| Manual image dimension detection | Astro `ImageMetadata` auto-provides width/height | Astro 2.0+ | Build-time dimensions eliminate need for runtime detection or hardcoded values |
| jQuery lightbox plugins (Fancybox, Magnific Popup) | PhotoSwipe v5, GLightbox | 2020+ | Zero dependencies, smaller bundles, better touch/gesture support |
| Server-side image processing | Build-time Sharp optimization via Astro | Astro 3.0+ | Automatic webp/avif conversion, responsive srcset, lazy loading at build time |
| CSS masonry (experimental) | JavaScript masonry libraries | Still experimental in 2026 | CSS `grid-template-rows: masonry` only in Firefox with flag -- not production-ready |

**Deprecated/outdated:**
- **PhotoSwipe v4 UI Default module:** v5 has a completely new API. Do not use v4 patterns (PhotoSwipeUI_Default is removed).
- **Fancybox / Magnific Popup:** jQuery-dependent, unmaintained, larger bundles.
- **lightbox2:** Still receives downloads but officially deprecated, jQuery-dependent.
- **Manual getImage() for each image:** `import.meta.glob` with eager loading is simpler when you need all images from a directory.

## Open Questions

1. **Alt text for gallery images**
   - What we know: Each gallery image needs alt text for accessibility. PhotoSwipe itself does not display alt text, but the thumbnail `<img>` elements require it.
   - What's unclear: Where to source 120-160 unique alt text strings (15-20 per category x 8 categories).
   - Recommendation: Use generic category-based alt text as starting point (e.g., "Wedding photography by Simon Wickes"), then enhance with specific descriptions when images are curated. Could store alt text in a parallel JSON/TS file per category, or embed in filename convention.

2. **Handling Astro Image component vs raw `<img>` for gallery thumbnails**
   - What we know: The Astro `Image` component auto-converts to webp and provides responsive attributes. However, `import.meta.glob({ eager: true })` returns `ImageMetadata` (not the `Image` component output). Using `Image` component requires passing `ImageMetadata` as `src`.
   - What's unclear: Whether the Astro `Image` component's `src` output URL (optimized webp) matches what PhotoSwipe needs for `href` (full-size image).
   - Recommendation: Use Astro `Image` component for thumbnails (gets webp optimization and lazy loading). For PhotoSwipe `href`, use `item.image.src` from `ImageMetadata` -- this is the build-time optimized URL that Astro generates. The `width` and `height` on `ImageMetadata` reflect the original source dimensions, which is what PhotoSwipe needs.

3. **Image crossover between categories**
   - What we know: Context says "allow image crossover -- strong images can appear in multiple relevant categories."
   - What's unclear: How to handle the same physical image file appearing in multiple category galleries without duplicating the file.
   - Recommendation: Use symlinks or simply duplicate the file into each category directory. At build time, Astro's asset pipeline will deduplicate identical file contents (same hash). Alternatively, import shared images from a `shared/` subdirectory and include them explicitly in each page's image array.

## Sources

### Primary (HIGH confidence)
- [PhotoSwipe Official Documentation](https://photoswipe.com/) - v5.4.4, Getting Started, Options, Click Actions, Adding UI Elements, Styling
- [PhotoSwipe GitHub](https://github.com/dimsemenov/PhotoSwipe) - 25,065 stars, actively maintained
- [Astro Docs: Images Guide](https://docs.astro.build/en/guides/images/) - ImageMetadata interface, Image component, dynamic imports
- [Astro Docs: Dynamically Importing Images](https://docs.astro.build/en/recipes/dynamically-importing-images/) - import.meta.glob pattern
- [Astro Docs: Content Collections](https://docs.astro.build/en/guides/content-collections/) - Collection schemas, image() helper
- [astro-masonry GitHub](https://github.com/OlivierEstevez/astro-masonry) - v1.2.2, breakpointCols API, zero-dependency

### Secondary (MEDIUM confidence)
- [npm-compare: Lightbox Libraries](https://npm-compare.com/glightbox,lightbox2,lightgallery,magnific-popup,photoswipe,viewerjs) - Download/star comparisons verified
- [LaunchFast: PhotoSwipe in Astro](https://www.launchfa.st/blog/photoswipe-astro) - Integration pattern with astro:page-load
- [DEV.to: Astro + PhotoSwipe](https://dev.to/petrovicz/astro-photoswipe-549a) - Astro integration example
- [Tailwind CSS: Overflow](https://tailwindcss.com/docs/overflow) - overflow-x-auto for scrollable nav

### Tertiary (LOW confidence)
- [astro-pandabox GitHub](https://github.com/SaintSin/astro-pandabox) - Evaluated as alternative, only 50 stars
- WebSearch results for idle auto-hide patterns - Confirmed PhotoSwipe has built-in `pswp__ui--idle` class
- WebSearch results for CSS scrollbar hiding - Confirmed `[scrollbar-width:none]` pattern

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- PhotoSwipe v5 verified through official docs, npm stats (417K weekly downloads), and GitHub (25K stars). astro-masonry already installed and working from Phase 2.
- Architecture: HIGH -- Patterns verified against Astro official docs (import.meta.glob, ImageMetadata, Image component). PhotoSwipe integration pattern confirmed through multiple independent sources.
- Pitfalls: HIGH -- import.meta.glob static limitation is documented in Vite/Astro docs. PhotoSwipe dimension requirements documented in official getting started guide. View Transitions cleanup pattern documented.
- Image pipeline: HIGH -- Astro ImageMetadata providing width/height confirmed in official docs. Direct bridge to PhotoSwipe data attributes is straightforward.

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days -- stable technologies)
**Key dependencies verified:** PhotoSwipe v5.4.4 (latest), astro-masonry v1.2.2 (installed), Astro 5.17 (current), Tailwind v4.1.18 (current)
