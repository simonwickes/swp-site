# Phase 8: SEO, Transitions & Launch Readiness - Research

**Researched:** 2026-02-10
**Domain:** SEO metadata, View Transitions, JSON-LD schema, Google Analytics 4
**Confidence:** HIGH

## Summary

This phase covers six interconnected domains: Astro View Transitions for page animations, JSON-LD structured data for search visibility, Open Graph meta tags for social sharing, sitemap generation, Google Analytics 4 integration, and SEO-focused alt text. The codebase is Astro 5.17.1 on Netlify, using Tailwind CSS 4, and already has `site: "https://simonwickes.com"` configured in `astro.config.mjs`.

The standard approach is to add Astro's `<ClientRouter />` component to the `BaseLayout.astro` head, create an SEO metadata component that centralizes OG tags and canonical URLs, build reusable JSON-LD schema components for each page type, install `@astrojs/sitemap`, and add GA4 tracking with `astro:page-load` event handling for View Transitions compatibility.

The codebase already uses `astro:page-load` and `astro:after-swap` lifecycle events in existing components (ServiceGallery, HeroCarousel, Header, blog search), which means View Transitions integration is partially prepared. The GA4 tracking issue with View Transitions (GitHub issue #14282) has been fixed in versions well before 5.17.1.

**Primary recommendation:** Implement as layered additions to existing layout components -- SEO metadata in BaseLayout head, View Transitions via ClientRouter in BaseLayout, JSON-LD via per-page schema components, sitemap via astro config integration.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro:transitions` | built-in (Astro 5.17.1) | View Transitions with ClientRouter, fade, transition:name | Native Astro API, no extra dependencies |
| `@astrojs/sitemap` | ^3.7.x | Automatic sitemap generation at build time | Official Astro integration, zero-config with `site` already set |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Analytics 4 (gtag.js) | N/A (external script) | Page view and event tracking | Loaded via inline script in head, no npm package needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct gtag.js | @astrojs/partytown + GA4 | Partytown runs GA in web worker for performance, but has documented compatibility issues with View Transitions and adds complexity. Direct script is simpler and works reliably with View Transitions. **Recommendation: Use direct gtag.js** |
| Manual robots.txt | astro-robots-txt package | Simple static file in public/ is sufficient for this site. No package needed. |
| astro-seo package | Manual meta tags | The astro-seo package adds abstraction but the site only needs a handful of meta patterns. Manual implementation in BaseLayout is clearer. |

**Installation:**
```bash
npx astro add sitemap
```

This automatically updates `astro.config.mjs` and installs the package.

## Architecture Patterns

### Recommended Component Structure
```
src/
  layouts/
    BaseLayout.astro        # Add: ClientRouter, OG tags, canonical, GA4 script
    PageLayout.astro         # Unchanged (wraps BaseLayout with Header/Footer)
  components/
    seo/
      SEOHead.astro          # Centralized OG/meta/canonical component
      SchemaLocalBusiness.astro  # Site-wide LocalBusiness JSON-LD
      SchemaArticle.astro    # Blog post BlogPosting JSON-LD
      SchemaFAQPage.astro    # FAQ page JSON-LD
      SchemaService.astro    # Per-service page JSON-LD
      Analytics.astro        # GA4 script with View Transitions tracking
  data/
    seo.ts                   # Site-wide SEO constants (business info, social URLs)
public/
    robots.txt               # Static robots.txt file
    og-default.jpg           # Default social card image (1200x630)
```

### Pattern 1: Centralized SEO Head Component

**What:** A single `SEOHead.astro` component that handles all meta tags, OG tags, and canonical URLs.
**When to use:** Every page, via BaseLayout.
**Example:**

```astro
---
// src/components/seo/SEOHead.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime: string;
    author: string;
  };
  canonicalUrl?: string;
}

const {
  title,
  description,
  ogImage = "/og-default.jpg",
  ogType = "website",
  article,
  canonicalUrl,
} = Astro.props;

const siteUrl = Astro.site ?? new URL("https://simonwickes.com");
const canonical = canonicalUrl
  ? new URL(canonicalUrl, siteUrl)
  : new URL(Astro.url.pathname, siteUrl);
const ogImageUrl = new URL(ogImage, siteUrl).href;
const fullTitle = `${title} | Simon Wickes Photography`;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical.href} />

<!-- Open Graph -->
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonical.href} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Simon Wickes Photography" />

<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />

<!-- Article-specific -->
{article && (
  <>
    <meta property="article:published_time" content={article.publishedTime} />
    <meta property="article:author" content={article.author} />
  </>
)}
```

### Pattern 2: JSON-LD Schema via set:html

**What:** Render JSON-LD in `<script type="application/ld+json">` using Astro's `set:html` directive.
**When to use:** Every page type that needs structured data.
**Critical detail:** Must use `set:html` to prevent HTML escaping of JSON content.

```astro
---
// src/components/seo/SchemaLocalBusiness.astro
import { siteInfo } from "@/data/seo";

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": siteInfo.name,
  "url": siteInfo.url,
  "description": siteInfo.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": siteInfo.city,
    "addressRegion": siteInfo.state,
    "addressCountry": "US"
  },
  "areaServed": siteInfo.serviceAreas.map(area => ({
    "@type": "City",
    "name": area
  })),
  "sameAs": siteInfo.socialProfiles,
  "url": siteInfo.contactPageUrl,
  "image": siteInfo.logoUrl,
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Pattern 3: View Transitions with Fixed Header/Footer

**What:** Use `<ClientRouter />` for page transitions with `transition:persist` on header and `transition:animate` on main content.
**When to use:** Site-wide in BaseLayout.

```astro
---
// In BaseLayout.astro <head>
import { ClientRouter } from "astro:transitions";
---
<ClientRouter />

<!-- In PageLayout.astro -->
<Header transition:persist />
<main class="flex-grow" transition:animate="fade">
  <slot />
</main>
<Footer transition:persist />
```

### Pattern 4: Shared Element Morph for Gallery Images

**What:** Use `transition:name` on gallery thumbnail images and the corresponding detail/lightbox images so they morph between positions.
**When to use:** FeaturedGrid images linking to service pages, and service gallery images.

```astro
<!-- On FeaturedGrid/FeaturedImage (origin page) -->
<Image
  src={item.image}
  alt={item.alt}
  transition:name={`gallery-${item.href}`}
/>

<!-- On service page (destination page) -->
<!-- The first/hero image could share the same transition:name -->
```

**Important constraint:** Each `transition:name` must be unique on a page. Since the masonry grid shows multiple images, only one image per service should use a shared transition name (typically the first image that matches).

### Pattern 5: GA4 with View Transitions Tracking

**What:** Load gtag.js with `is:inline` scripts and track page views on `astro:page-load`.
**When to use:** Site-wide in BaseLayout or via dedicated Analytics component.

```astro
---
// src/components/seo/Analytics.astro
---
<!-- Google Analytics -->
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');

  // Track page views during View Transitions
  document.addEventListener('astro:page-load', function() {
    gtag('config', 'G-XXXXXXXXXX', {
      page_path: window.location.pathname,
    });
  });
</script>
```

### Anti-Patterns to Avoid

- **Putting JSON-LD in template literals without `set:html`:** Astro will HTML-escape the JSON, breaking the schema. Always use `set:html={JSON.stringify(data)}`.
- **Using `transition:persist` on `<main>`:** The main content area should fade/transition, not persist. Only persist truly static elements like header/footer.
- **Using Partytown for GA4 with View Transitions:** Known compatibility issues. Use direct inline scripts instead.
- **Duplicate `transition:name` values:** Each name must be unique per page. If a grid has 12 images, do not give them all the same transition name.
- **Initializing GA4 inside `astro:after-swap`:** Use `astro:page-load` instead. The `after-swap` event fires before the new page is fully rendered, which can cause incorrect page path tracking.
- **Removing existing `astro:page-load` and `astro:after-swap` handlers:** The codebase already uses these in ServiceGallery, HeroCarousel, Header, and blog search. Adding View Transitions should not break these existing handlers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom XML builder | `@astrojs/sitemap` | Handles pagination, change frequency, splitting. One-line config. |
| Meta tag management | Ad-hoc meta tags per page | Centralized SEOHead component | Consistency, DRY, prevents forgotten tags on new pages |
| JSON-LD validation | Manual testing | Google Rich Results Test (search.google.com/test/rich-results) | Catches schema errors before deployment |
| OG image dimensions | Guessing sizes | 1200x630px standard | Facebook, Twitter, LinkedIn all optimize for this size |
| View Transition animations | Custom CSS keyframes | Built-in `fade()` from `astro:transitions` | Battle-tested, handles cross-browser fallbacks, respects reduced motion |
| robots.txt | Dynamic generation | Static file in `public/robots.txt` | Simple, no build-time overhead, easily edited |

**Key insight:** Astro 5 has built-in support for all the transition features needed. The `<ClientRouter />` component handles reduced motion automatically, and `fade()` accepts a duration parameter. No custom animation code is needed for the 200ms crossfade requirement.

## Common Pitfalls

### Pitfall 1: ClientRouter Breaks Existing Script Initialization

**What goes wrong:** Adding `<ClientRouter />` changes how scripts execute. Regular `<script>` tags run once and do not re-execute on client-side navigation. Components relying on DOMContentLoaded or immediate execution may stop working.
**Why it happens:** ClientRouter enables SPA-like navigation where the DOM is swapped rather than reloaded.
**How to avoid:** The codebase already handles this correctly -- ServiceGallery, HeroCarousel, Header, and blog search all listen to `astro:page-load` or `astro:after-swap`. Verify all components continue to work after adding ClientRouter.
**Warning signs:** Interactive features that work on first page load but break when navigating between pages.

### Pitfall 2: Theme Flash During View Transitions

**What goes wrong:** Dark/light theme resets during page transitions because the theme initialization script runs after the DOM swap.
**Why it happens:** The existing inline theme script in BaseLayout runs on page load, but during View Transitions the `<head>` is not fully re-executed.
**How to avoid:** Use `astro:after-swap` to re-apply the theme before the new page renders. The existing theme initialization script should be preserved AND a `astro:after-swap` handler should ensure the dark class is set correctly.
**Warning signs:** Brief white flash when navigating in dark mode.

### Pitfall 3: Swiper Carousel State During Transitions

**What goes wrong:** Swiper carousel continues playing during page exit transition, causing visual jank, or fails to reinitialize on the home page.
**Why it happens:** `transition:persist` keeps the carousel alive during navigation, but Swiper may not handle DOM changes gracefully.
**How to avoid:** Pause Swiper autoplay during the `astro:before-preparation` event (before transition starts). The HeroCarousel already listens to `astro:after-swap` for reinitialization. Consider NOT persisting the hero section -- let it re-render naturally.
**Warning signs:** Carousel images jumping or autoplay continuing while the page is fading out.

### Pitfall 4: PhotoSwipe Lightbox and Back Button

**What goes wrong:** If a lightbox is open when the user presses the browser back button, View Transitions may navigate away with the lightbox overlay still visible.
**Why it happens:** The lightbox creates a full-screen overlay that is not part of the Astro transition system.
**How to avoid:** Listen to `astro:before-preparation` and close any open PhotoSwipe instances before the transition begins. The context decision states "Back button navigates directly (closes lightbox immediately if open)."
**Warning signs:** Lightbox overlay visible during fade transition, or navigation failing while lightbox is open.

### Pitfall 5: FAQPage Schema Won't Generate Rich Results

**What goes wrong:** Implementing FAQPage schema but expecting Google to show FAQ rich results.
**Why it happens:** Since September 2023, Google restricted FAQ rich results to only well-known, authoritative government and health websites.
**How to avoid:** Implement FAQPage schema anyway for AI search citation benefits (pages with FAQPage markup are 3.2x more likely to appear in AI Overviews) and for semantic correctness, but do not expect visible FAQ rich results in Google SERP.
**Warning signs:** FAQPage schema validates correctly but never appears in Search Console rich results reports.

### Pitfall 6: Missing OG Image on Blog Posts Without Featured Images

**What goes wrong:** Blog posts without a `featuredImage` in frontmatter get shared on social media with no image preview.
**Why it happens:** The featured image is optional in the blog schema.
**How to avoid:** Fall back to the default OG image (brand social card) when no featured image is present. The SEOHead component should handle this with a default value.
**Warning signs:** Social media shares of blog posts showing blank image areas.

### Pitfall 7: Scroll Position Not Resetting

**What goes wrong:** Navigating from one page to another, the scroll position is retained from the previous page, so the user lands mid-page.
**Why it happens:** View Transitions can preserve scroll position by default in some cases.
**How to avoid:** Add explicit scroll reset on navigation. The recommended approach is to handle this in `astro:after-swap`:
```js
document.addEventListener('astro:after-swap', () => {
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
});
```
**Recommendation (Claude's discretion):** Reset scroll to top on every navigation. This is the expected behavior for a content website. Users expect to start at the top of a new page.

## Code Examples

### Example 1: BaseLayout.astro with ClientRouter and SEO

```astro
---
import { ClientRouter } from "astro:transitions";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/nunito";
import "../styles/global.css";
import SEOHead from "@components/seo/SEOHead.astro";
import Analytics from "@components/seo/Analytics.astro";
import SchemaLocalBusiness from "@components/seo/SchemaLocalBusiness.astro";

interface Props {
  title: string;
  description?: string;
  preloadImage?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime: string;
    author: string;
  };
}

const {
  title,
  description = "Professional photography by Simon Wickes",
  preloadImage,
  ogImage,
  ogType,
  article,
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <ClientRouter />
    <SEOHead
      title={title}
      description={description}
      ogImage={ogImage}
      ogType={ogType}
      article={article}
    />

    {preloadImage && <link rel="preload" as="image" href={preloadImage} />}

    <!-- Theme initialization - MUST be inline, MUST be first script -->
    <script is:inline>
      // ... existing theme script ...
    </script>

    <Analytics />
    <SchemaLocalBusiness />
  </head>
  <body class="...">
    <slot />
    <!-- Scroll reset and theme fix for View Transitions -->
    <script is:inline>
      document.addEventListener('astro:after-swap', function() {
        // Re-apply theme after page swap
        var stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
        var theme = (stored === 'dark' || stored === 'light') ? stored :
          (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
        // Reset scroll
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      });
    </script>
  </body>
</html>
```

### Example 2: PageLayout.astro with transition:animate on main

```astro
---
import { fade } from "astro:transitions";
import BaseLayout from "./BaseLayout.astro";
import Header from "../components/global/Header.astro";
import Footer from "../components/global/Footer.astro";

// ... props ...
---

<BaseLayout {title} {description} {preloadImage} {ogImage} {ogType} {article}>
  <Header transition:persist="site-header" />
  <main class="flex-grow" transition:animate={fade({ duration: '0.2s' })}>
    <slot />
  </main>
  <Footer transition:persist="site-footer" />
</BaseLayout>
```

### Example 3: LocalBusiness + Photographer Schema

```astro
---
// src/components/seo/SchemaLocalBusiness.astro
import { siteInfo } from "@/data/seo";

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Simon Wickes Photography",
  "url": "https://simonwickes.com",
  "description": "Professional photographer in Arizona specializing in outdoor portraits, weddings, commercial, landscape, and event photography.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Phoenix",
    "addressRegion": "AZ",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "Phoenix" },
    { "@type": "City", "name": "Scottsdale" },
    { "@type": "City", "name": "Tempe" },
    { "@type": "City", "name": "Mesa" },
    { "@type": "State", "name": "Arizona" }
  ],
  "sameAs": [
    "https://www.instagram.com/simonwickes",
    "https://www.facebook.com/simonwickesphotography"
    // ... additional social profiles
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "url": "https://simonwickes.com/contact/"
  },
  "image": "https://simonwickes.com/og-default.jpg",
  "additionalType": "https://schema.org/Photographer"
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Note on `@type`:** There is no dedicated "Photographer" type in schema.org as a LocalBusiness subtype. `ProfessionalService` exists but is deprecated. The recommended approach is to use `"@type": "LocalBusiness"` with `"additionalType": "https://schema.org/Photographer"`. The `Photographer` type exists in schema.org but as a subtype of `Person`, not `LocalBusiness`. Using `additionalType` bridges this gap. Alternatively, use `"@type": ["LocalBusiness", "ProfessionalService"]` array since Google still recognizes it despite deprecation.

### Example 4: BlogPosting Schema

```astro
---
// src/components/seo/SchemaArticle.astro
interface Props {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  image?: string;
  url: string;
}

const { title, description, datePublished, dateModified, authorName, authorUrl, image, url } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "datePublished": datePublished,
  ...(dateModified && { "dateModified": dateModified }),
  "author": {
    "@type": "Person",
    "name": authorName,
    ...(authorUrl && { "url": authorUrl })
  },
  ...(image && { "image": image }),
  "url": url,
  "publisher": {
    "@type": "Organization",
    "name": "Simon Wickes Photography",
    "url": "https://simonwickes.com"
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Example 5: FAQPage Schema

```astro
---
// src/components/seo/SchemaFAQPage.astro
import { faqItems } from "@/data/faq";

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Example 6: Service Page Schema

```astro
---
// src/components/seo/SchemaService.astro
interface Props {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
}

const { serviceName, serviceDescription, serviceUrl } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `${serviceName} Photography`,
  "description": serviceDescription,
  "url": serviceUrl,
  "provider": {
    "@type": "LocalBusiness",
    "name": "Simon Wickes Photography",
    "url": "https://simonwickes.com"
  },
  "areaServed": {
    "@type": "State",
    "name": "Arizona"
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Example 7: GA4 with View Transitions

```astro
---
// src/components/seo/Analytics.astro
// GA_MEASUREMENT_ID should come from seo.ts or env variable
import { GA_MEASUREMENT_ID } from "@/data/seo";
---

{GA_MEASUREMENT_ID && (
  <>
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
    <script is:inline define:vars={{ GA_MEASUREMENT_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID);

      // Re-track page views on View Transition navigation
      document.addEventListener('astro:page-load', function() {
        if (typeof gtag === 'function') {
          gtag('event', 'page_view', {
            page_path: window.location.pathname,
            page_title: document.title,
          });
        }
      });
    </script>
  </>
)}
```

**Note:** Use `define:vars` to pass the measurement ID from the Astro component into the inline script without hardcoding. The `is:inline` directive is required because View Transitions need these scripts to survive page swaps.

### Example 8: Alt Text Pattern for SEO

```astro
<!-- Service page gallery images -->
<Image
  src={item.image}
  alt={`${service.title} photography in Arizona by Simon Wickes`}
/>

<!-- With location-specific alt text -->
<Image
  src={item.image}
  alt={`Wedding photography at Papago Park, Arizona by Simon Wickes`}
/>

<!-- Hero carousel -->
<Image
  src={slide.src}
  alt={`Outdoor portrait photography in golden hour light by Simon Wickes`}
/>
```

### Example 9: robots.txt

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://simonwickes.com/sitemap-index.xml
```

### Example 10: Sitemap Configuration

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: "https://simonwickes.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/image-test'),
      serialize(item) {
        // Blog posts get weekly, service pages get monthly
        if (item.url.includes('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.7;
        } else if (item.url.includes('/services/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        } else if (item.url === 'https://simonwickes.com/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        }
        return item;
      }
    }),
  ],
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<ViewTransitions />` import | `<ClientRouter />` import | Astro 5.0 (Dec 2024) | Name change only; old import still works but is deprecated. Use `import { ClientRouter } from 'astro:transitions'` |
| Partytown for GA4 | Direct gtag.js inline scripts | 2025 consensus | Partytown adds complexity and has View Transition issues. Direct scripts are simpler and the GA4 fix in Astro 5 resolves the core tracking problem |
| ProfessionalService schema | LocalBusiness + additionalType | Schema.org deprecation | ProfessionalService is deprecated. Use LocalBusiness with `additionalType` for specificity |
| FAQPage for rich results | FAQPage for AI search visibility | Sep 2023 Google change | FAQ rich results restricted to govt/health sites, but schema still aids AI search citation (3.2x more likely in AI Overviews) |
| `astro:after-swap` for GA4 | `astro:page-load` for GA4 | Astro 5 best practice | `page-load` fires after full navigation including scripts; `after-swap` fires before rendering completes |

**Deprecated/outdated:**
- `<ViewTransitions />` component name: Use `<ClientRouter />` instead (from `astro:transitions`)
- `ProfessionalService` schema type: Deprecated by schema.org
- Partytown-based GA4: Not recommended with View Transitions

## Claude's Discretion Recommendations

### Scroll Behavior on Page Transitions

**Recommendation: Reset to top on every navigation.**
Rationale: This is a content website, not an app. Users expect to land at the top of a new page. The only exception would be back-button navigation where the browser's built-in scroll restoration should work naturally with View Transitions.

### ImageGallery Schema for Service Pages

**Recommendation: Skip ImageGallery schema.**
Rationale: ImageGallery schema does not generate Google rich results. The effort to maintain image metadata in structured data is not justified by SEO benefit. The existing `alt` text improvements and the `Service` schema per page provide sufficient SEO value. If desired later, it can be added incrementally.

### GA4 Loading Method

**Recommendation: Direct gtag.js scripts (not Partytown).**
Rationale: Partytown adds a dependency, has documented compatibility issues with View Transitions, and the performance gain is minimal for a photography site where images dominate load time. Direct inline scripts with `is:inline` are reliable and simple.

### Meta Description Format per Page Type

**Recommendation:**
- **Home:** "Simon Wickes Photography -- professional photographer in Arizona specializing in portraits, weddings, commercial, and landscape photography."
- **Service pages:** "[Service Name] photography by Simon Wickes in Arizona. [First sentence of service description]."
- **Blog posts:** "[Post title] -- Photography by Simon Wickes" (or a custom excerpt if added to frontmatter later).
- **FAQ:** "Frequently asked questions about Simon Wickes Photography services, booking, pricing, and what to expect."
- **Contact:** "Get in touch with Simon Wickes Photography. Book a session or ask about availability."
- **Client Galleries:** "Access your password-protected photo gallery from Simon Wickes Photography."

Keep descriptions under 155 characters.

## Open Questions

1. **Social media profile URLs**
   - What we know: The schema needs `sameAs` array with social profile URLs (Instagram, Facebook, etc.)
   - What's unclear: The actual social media URLs for Simon Wickes Photography
   - Recommendation: Create a `seo.ts` data file with placeholder URLs that the user fills in before launch. These URLs are also needed for the LocalBusiness schema.

2. **GA4 Measurement ID**
   - What we know: GA4 requires a measurement ID (G-XXXXXXXXXX format)
   - What's unclear: Whether a GA4 property has been created yet
   - Recommendation: Store the measurement ID in the `seo.ts` config file with a placeholder. The Analytics component should gracefully handle a missing/empty ID (skip rendering the scripts).

3. **Default OG Image Design**
   - What we know: Need a 1200x630px social card image with logo and tagline
   - What's unclear: Whether the brand logo/assets exist yet
   - Recommendation: Create a placeholder OG image file that can be replaced with a designed version before launch. Place it at `public/og-default.jpg`.

4. **Service area cities**
   - What we know: Schema should include service areas for local SEO
   - What's unclear: The specific cities/regions Simon Wickes serves
   - Recommendation: Include common Arizona cities (Phoenix, Scottsdale, Tempe, Mesa, Chandler) as defaults in `seo.ts` with a note for the user to customize.

5. **Blog post featured image as OG image**
   - What we know: Blog posts use Astro's built-in image optimization which generates hashed filenames
   - What's unclear: Whether optimized image URLs work correctly as og:image URLs (some social crawlers need direct image URLs)
   - Recommendation: Use the `.src` property of the processed image. Astro's Image component outputs URLs that should be crawlable. Test with Facebook Sharing Debugger after deployment.

## Sources

### Primary (HIGH confidence)
- [Astro View Transitions Guide](https://docs.astro.build/en/guides/view-transitions/) -- ClientRouter setup, fade animation, transition:name, transition:persist, prefers-reduced-motion, lifecycle events
- [Astro View Transitions API Reference](https://docs.astro.build/en/reference/modules/astro-transitions/) -- ClientRouter props, fade() and slide() functions, navigate(), lifecycle events
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) -- Installation, configuration, filtering, serialization
- [Google Article Structured Data](https://developers.google.com/search/docs/appearance/structured-data/article) -- BlogPosting schema, recommended properties, image requirements
- [Google FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage) -- FAQPage schema, eligibility restrictions (govt/health only for rich results)
- [Google LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business) -- Required/recommended properties, JSON-LD format
- [Astro GitHub Issue #14282](https://github.com/withastro/astro/issues/14282) -- GA4 View Transitions tracking fix (RESOLVED in PR #14294)
- [Astro ClientRouter Rename PR](https://github.com/withastro/astro/pull/11980) -- ViewTransitions renamed to ClientRouter in Astro 5

### Secondary (MEDIUM confidence)
- [BetterLink Astro View Transitions Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-view-transitions-guide/) -- Practical examples, transition:persist patterns
- [BetterLink Astro SEO Complete Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/) -- SEOHead component pattern, JSON-LD with set:html
- [Ramon Malcolm GA4 Astro Guide](https://ramonmalcolm.com/articles/astro-js-google-analytics-integration-guide) -- astro:page-load tracking pattern, is:inline requirement
- [Daniel.es GA4 Astro Guide](https://daniel.es/blog/the-ultimate-astro-google-analytics-guide/) -- Partytown comparison, consent default patterns
- [Ohans Emmanuel Astro View Transitions](https://blog.ohansemmanuel.com/astro-view-transitions-2/) -- Shared element transition:name examples

### Tertiary (LOW confidence)
- [schema.org/ProfessionalService](https://schema.org/ProfessionalService) -- Deprecated type, still recognized by Google but officially discontinued
- [Mike Cassidy Photography Schema Template](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business) -- Photography-specific schema patterns (content not fully extractable)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All recommendations use official Astro APIs and well-documented integrations
- Architecture: HIGH -- Patterns verified against official Astro docs and existing codebase structure
- View Transitions: HIGH -- Official Astro documentation with confirmed API names and behavior
- JSON-LD Schema: HIGH -- Based on Google's official structured data documentation
- GA4 Integration: HIGH -- GitHub issue fix confirmed, pattern verified across multiple sources
- Pitfalls: MEDIUM -- Based on documentation and community reports, some edge cases may vary
- Alt text patterns: HIGH -- Straightforward SEO best practice, no technical ambiguity

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (stable APIs, unlikely to change within 30 days)
