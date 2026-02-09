# Architecture Patterns

**Domain:** Photography portfolio and business website
**Framework:** Astro (static site generator)
**Deployment:** Apache shared hosting (InMotion), static files only
**Researched:** 2026-02-09

## Recommended Architecture

### High-Level Overview

```
                         BUILD TIME                              RUNTIME (Browser)
                    =====================                   ======================

  src/content/       +----------------+
  (Markdown blog)    |                |     dist/
  =================> |   Astro Build  | ==========>  Static HTML/CSS/JS/Images
  src/pages/         |   (+ Sharp)    |              served by Apache
  src/components/    |                |     .htaccess (generated)
  src/assets/        +----------------+
  (images)                  |                         +---------------------+
                            |                         | Client Browser      |
                    Pagefind indexes     ============> |  - Dark mode toggle |
                    content at build                  |  - Pagefind search  |
                                                      |  - Lightbox viewer  |
                                                      |  - Contact form     |
                                                      |    (external API)   |
                                                      +---------------------+
                                                               |
                                                      +--------+--------+
                                                      |                 |
                                              Gallery Service    Form Service
                                              (Pic-Time /        (Web3Forms /
                                               Pixieset /         Formspree)
                                               CloudSpot)
```

This is a **fully static architecture**. All pages are pre-rendered at build time. The only runtime interactions are client-side JavaScript for UI features (dark mode, search, lightbox) and external service integrations (gallery links, contact form submission).

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Base Layout** | HTML shell, meta tags, global nav, footer, dark mode script | All pages (wraps them) |
| **Page Templates** | Page-specific structure (home hero, service grid, blog list) | Base Layout (parent), UI Components (children) |
| **Content Collections** | Blog post data with validated schemas | Blog page templates (queried at build) |
| **Image Pipeline** | Optimize, resize, format-convert all portfolio images | Astro Image/Picture components, Sharp |
| **Service Pages** | 8 static pages showcasing each photography category | Base Layout, Gallery components, Image components |
| **Blog System** | Markdown-driven blog with listing, individual posts, search | Content Collections, Pagefind, Base Layout |
| **Contact Form** | Client-side form submitting to external API | External form service (Web3Forms/Formspree) |
| **Gallery Integration** | Links/embeds to third-party gallery service | External gallery platform (subdomain or link) |
| **Dark Mode Toggle** | Theme switching with localStorage persistence | Base Layout (inline script), CSS custom properties |
| **Search (Pagefind)** | Client-side full-text search of blog content | Build-time index, Blog pages |
| **Apache Config** | URL routing, caching, error pages, redirects | Generated .htaccess in dist/ |

### Data Flow

**Build-time flow (content to pages):**

```
1. Markdown files in src/content/blog/
   --> Validated by Zod schema in content.config.ts
   --> Queried via getCollection('blog') in page templates
   --> Rendered to HTML via render() function
   --> Output as static HTML in dist/

2. Images in src/assets/
   --> Referenced by <Image /> or <Picture /> components
   --> Processed by Sharp (resize, format convert to WebP/AVIF)
   --> Output as optimized files in dist/_astro/
   --> srcset generated for responsive loading

3. Astro pages in src/pages/
   --> File-based routing (about.astro --> /about/)
   --> Wrapped in layouts
   --> Output as dist/[path]/index.html

4. After HTML generation:
   --> Pagefind indexes all HTML in dist/
   --> Search index files written to dist/pagefind/
   --> .htaccess generated in dist/ root
```

**Runtime flow (user interactions):**

```
1. Page Load:
   Browser requests page --> Apache serves static HTML
   --> Inline script checks localStorage for theme preference
   --> Applies dark/light class before paint (no flash)

2. Navigation:
   Standard anchor links (<a href="/services/weddings/">)
   --> Full page loads (no client-side routing needed)
   --> Apache serves next static HTML file

3. Blog Search:
   User types in search box --> Pagefind JS loads index chunk
   --> Client-side matching --> Results displayed

4. Contact Form:
   User fills form --> JavaScript submits to external API
   --> API sends email notification --> Success/error shown

5. Gallery Access:
   User clicks gallery link --> Navigates to subdomain
   (e.g., galleries.simonwickes.com) or external URL
   --> Third-party gallery service handles everything
```

## Recommended Astro Project Structure

```
swp-site/
|-- astro.config.mjs          # Astro config: site URL, integrations, image settings
|-- package.json
|-- tsconfig.json
|-- .htaccess                  # Template/reference (actual generated at build)
|
|-- public/
|   |-- favicon.ico
|   |-- robots.txt
|   |-- fonts/                 # Custom web fonts (if any)
|   +-- og-image.jpg           # Default social sharing image
|
|-- src/
|   |-- assets/
|   |   |-- images/
|   |   |   |-- hero/          # Hero/banner images (large, will be optimized)
|   |   |   |-- services/      # Sample images per service category
|   |   |   |   |-- weddings/
|   |   |   |   |-- portraits/
|   |   |   |   |-- commercial/
|   |   |   |   |-- landscape/
|   |   |   |   |-- cars/
|   |   |   |   |-- assignments/
|   |   |   |   |-- events/
|   |   |   |   +-- live-performances/
|   |   |   |-- blog/          # Blog post images
|   |   |   |-- about/         # About page images
|   |   |   +-- icons/         # SVG icons, logos
|   |
|   |-- components/
|   |   |-- global/
|   |   |   |-- Header.astro       # Site header with nav
|   |   |   |-- Footer.astro       # Site footer with social links
|   |   |   |-- Navigation.astro   # Main nav menu (mobile + desktop)
|   |   |   |-- ThemeToggle.astro  # Dark mode toggle button + script
|   |   |   +-- SEO.astro          # Meta tags, Open Graph, structured data
|   |   |
|   |   |-- home/
|   |   |   |-- Hero.astro         # Landing page hero section
|   |   |   |-- ServiceGrid.astro  # Grid of 8 service category cards
|   |   |   +-- FeaturedWork.astro # Highlighted recent work
|   |   |
|   |   |-- services/
|   |   |   |-- ServiceHero.astro  # Service page header with category image
|   |   |   |-- SampleGallery.astro # Grid of sample images for service
|   |   |   +-- GalleryLink.astro  # CTA to third-party gallery/contact
|   |   |
|   |   |-- blog/
|   |   |   |-- PostCard.astro     # Blog post preview card
|   |   |   |-- PostList.astro     # List/grid of blog post cards
|   |   |   +-- SearchBar.astro    # Pagefind search component wrapper
|   |   |
|   |   +-- ui/
|   |       |-- ContactForm.astro  # Contact form with client-side submission
|   |       |-- ImageGallery.astro # Lightbox-enabled image grid
|   |       |-- SocialLinks.astro  # Social media icon links
|   |       +-- Button.astro       # Reusable button/CTA component
|   |
|   |-- content/
|   |   +-- blog/
|   |       |-- my-first-post.md
|   |       +-- wedding-behind-scenes.md
|   |
|   |-- content.config.ts         # Collection definitions + Zod schemas
|   |
|   |-- layouts/
|   |   |-- BaseLayout.astro       # HTML shell: <html>, <head>, <body>
|   |   |-- PageLayout.astro       # Standard page: BaseLayout + header/footer
|   |   +-- BlogPostLayout.astro   # Blog post: PageLayout + post metadata/nav
|   |
|   |-- pages/
|   |   |-- index.astro            # Home page
|   |   |-- about.astro            # About Simon page
|   |   |-- contact.astro          # Contact form page
|   |   |-- blog/
|   |   |   |-- index.astro        # Blog listing page
|   |   |   +-- [...slug].astro    # Dynamic blog post pages
|   |   |-- services/
|   |   |   |-- index.astro        # Services overview page
|   |   |   |-- weddings.astro     # (or use dynamic routing)
|   |   |   |-- portraits.astro
|   |   |   |-- commercial.astro
|   |   |   |-- landscape.astro
|   |   |   |-- cars.astro
|   |   |   |-- assignments.astro
|   |   |   |-- events.astro
|   |   |   +-- live-performances.astro
|   |   +-- 404.astro              # Custom 404 page
|   |
|   +-- styles/
|       |-- global.css             # CSS custom properties, resets, base styles
|       +-- themes.css             # Light/dark theme variable definitions
|
+-- dist/                          # Build output (uploaded to hosting)
    |-- .htaccess                  # Generated Apache config
    |-- pagefind/                  # Search index (auto-generated)
    +-- _astro/                    # Optimized assets (images, CSS, JS)
```

### Structure Rationale

**Why `src/assets/images/` organized by purpose, not by page:**
Photography sites have images that may appear in multiple contexts (a wedding photo on the home page hero AND the weddings service page). Organizing by category (services/weddings, hero, blog) rather than by page avoids duplication and makes it clear where to add new images.

**Why static service pages instead of content collections for services:**
With only 8 service pages that each have unique layouts, hero imagery, and copy, individual `.astro` files give maximum control. Content collections shine for 20+ items with identical structure (like blog posts). Eight bespoke pages are simpler to maintain than an over-engineered collection system.

**Why `content.config.ts` only for blog posts:**
Blog posts are the only truly repeating content type with identical structure. Services, the about page, and the home page are all unique layouts. Using content collections where they add value (blog) and avoiding them where they add overhead (static pages) is the right balance.

**Why three layout levels (Base, Page, BlogPost):**
- `BaseLayout` = pure HTML shell (used everywhere, including potential future landing pages)
- `PageLayout` = BaseLayout + header + footer (used by all standard pages)
- `BlogPostLayout` = PageLayout + post title, date, author, reading time (used by blog posts via frontmatter `layout` property)

## Patterns to Follow

### Pattern 1: Inline Dark Mode Script (Prevent Flash)

**What:** Place theme-detection script inline in `<head>` so it runs before any content paints.
**When:** Always -- this is the only way to prevent the "flash of wrong theme" on page load.
**Confidence:** HIGH (verified via Astro official tutorial and multiple implementation guides)

```astro
<!-- In BaseLayout.astro <head> -->
<script is:inline>
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();
  document.documentElement.dataset.theme = theme;
</script>
```

```css
/* In themes.css */
:root, [data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: /* warm accent color */;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
  --color-accent: /* warm accent color, adjusted for dark */;
}
```

### Pattern 2: Image Optimization Pipeline

**What:** Use `<Image />` for single-format optimized images, `<Picture />` for hero/banner images needing multiple format fallbacks.
**When:** All portfolio and blog images should go through Astro's pipeline. Only bypass for external URLs or SVGs.
**Confidence:** HIGH (verified via Astro official image documentation)

```astro
---
// For portfolio/gallery images on service pages
import { Image } from 'astro:assets';
import weddingPhoto from '../assets/images/services/weddings/hero.jpg';
---

<!-- Standard optimized image -->
<Image
  src={weddingPhoto}
  alt="Bride and groom at sunset ceremony"
  width={800}
  quality={80}
/>
```

```astro
---
// For hero images where format support matters
import { Picture } from 'astro:assets';
import heroImage from '../assets/images/hero/landing.jpg';
---

<!-- Multi-format with fallback -->
<Picture
  src={heroImage}
  formats={['avif', 'webp']}
  alt="Simon Wickes Photography"
  width={1600}
  quality={85}
/>
```

### Pattern 3: Content Collection for Blog

**What:** Define blog posts as a content collection with Zod schema validation.
**When:** All blog content should use this pattern for type safety and consistent frontmatter.
**Confidence:** HIGH (verified via Astro content collections documentation)

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
  }),
});

export const collections = { blog };
```

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPostLayout {...post.data}>
  <Content />
</BlogPostLayout>
```

### Pattern 4: Contact Form with External API

**What:** Pure HTML form with client-side JavaScript submission to an external form service. No server-side code needed.
**When:** Static hosting that cannot run server-side code.
**Confidence:** HIGH (multiple verified approaches for static Astro sites)

```astro
---
// ContactForm.astro
---
<form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
  <input type="hidden" name="subject" value="New inquiry from simonwickes.com" />

  <label for="name">Name</label>
  <input type="text" id="name" name="name" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="service">Service Interested In</label>
  <select id="service" name="service">
    <option value="">Select a service...</option>
    <option value="weddings">Weddings</option>
    <option value="portraits">Outdoor Portraits</option>
    <!-- ... other services -->
  </select>

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send Inquiry</button>
</form>

<script>
  // Progressive enhancement: AJAX submission with feedback
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form as HTMLFormElement);
    try {
      const response = await fetch((form as HTMLFormElement).action, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // Show success message
      }
    } catch {
      // Show error message
    }
  });
</script>
```

### Pattern 5: Third-Party Gallery Integration

**What:** Link to an external gallery service rather than building gallery functionality.
**When:** Client delivery galleries with password protection, downloads, and proofing. This is explicitly out-of-scope to build.
**Confidence:** HIGH (standard practice for photography business sites)

**Two integration approaches:**

**Approach A -- Subdomain (Recommended):**
Set up a CNAME record pointing `galleries.simonwickes.com` to the gallery service (Pic-Time, CloudSpot, or Pixieset). Clients access galleries at a branded URL that feels like part of the site. The main site links to this subdomain.

```astro
<!-- On service pages or a dedicated "Client Area" page -->
<a href="https://galleries.simonwickes.com" class="cta-button">
  View Your Gallery
</a>
```

**Approach B -- Direct Link:**
Simply link to the gallery service's hosted URL. Less seamless but zero configuration.

```astro
<a href="https://simonwickes.pic-time.com" class="cta-button">
  View Your Gallery
</a>
```

**Do NOT embed gallery iframes.** Third-party gallery services are designed as standalone experiences with their own responsive layouts, password flows, and download interfaces. Embedding them in iframes creates poor UX (nested scrolling, broken mobile layouts, auth issues).

## Anti-Patterns to Avoid

### Anti-Pattern 1: Building a Custom Gallery System

**What:** Attempting to build password-protected client galleries, download management, or proofing tools.
**Why bad:** This is months of work for a problem already solved by purpose-built services. It would delay launch indefinitely and produce an inferior result.
**Instead:** Use a third-party gallery service (Pic-Time, Pixieset, CloudSpot). Link from the portfolio site. The site's job is to attract new clients, not deliver finished work.

### Anti-Pattern 2: Images in public/ Directory

**What:** Placing portfolio images in `public/` instead of `src/assets/`.
**Why bad:** Images in `public/` bypass Astro's optimization pipeline entirely. For a photography site with many high-resolution images, this means massive file sizes, no format conversion (WebP/AVIF), no responsive srcsets, and poor Core Web Vitals.
**Instead:** Always place portfolio images in `src/assets/images/` and reference them through `<Image />` or `<Picture />` components. Only put images in `public/` if they genuinely must not be processed (favicons, `robots.txt`-referenced images, OG images for social sharing).

### Anti-Pattern 3: Client-Side Routing / SPA Behavior

**What:** Adding React Router, Astro view transitions with full SPA mode, or other client-side routing.
**Why bad:** Adds JavaScript complexity for zero benefit on a static portfolio site. Breaks browser back button expectations. Makes Apache URL routing harder. Hurts SEO (crawlers prefer plain HTML).
**Instead:** Use standard anchor links. Every page is its own static HTML file. Apache handles routing. Browsers handle caching. This is the simplest and fastest approach.

### Anti-Pattern 4: Over-Engineering Content Collections

**What:** Creating content collections for services, testimonials, team members, and every other data type.
**Why bad:** With 8 service pages that each have unique designs, and a solo photographer site, content collections add abstraction without payoff. The overhead of schemas, loaders, and dynamic routing for small, static data sets makes the site harder to understand and modify.
**Instead:** Use content collections for blog posts only (the one genuinely repeating content type). Use plain `.astro` page files for services, about, contact, and home. If data like testimonials is needed, a simple TypeScript array in a `src/data/` file is sufficient.

### Anti-Pattern 5: Forgetting Apache Configuration

**What:** Building the Astro site without considering how Apache will serve it. Deploying `dist/` and finding broken URLs, missing 404 pages, or no caching.
**Why bad:** Astro defaults are designed for modern hosting platforms (Vercel, Netlify). Apache needs explicit configuration for clean URLs, error pages, caching headers, and MIME types.
**Instead:** Plan the `.htaccess` file as part of the architecture. Use `astro-htaccess` integration or include a hand-crafted `.htaccess` in `public/` that gets copied to `dist/`. Test with Apache locally or on staging before launch.

## Apache Deployment Configuration

Since this site deploys to Apache shared hosting, the `.htaccess` configuration is an architectural component, not an afterthought.

### Recommended Astro Config for Apache

```javascript
// astro.config.mjs
import { defineConfig } from 'astro';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://simonwickes.com',
  output: 'static',
  build: {
    format: 'directory',  // Generates /about/index.html (clean URLs)
  },
  trailingSlash: 'ignore',
  image: {
    // Sharp is default, no extra config needed
  },
  integrations: [
    pagefind(),
  ],
});
```

### Required .htaccess Rules

```apache
# Error pages
ErrorDocument 404 /404.html

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache static assets aggressively (Astro hashes filenames)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  # HTML pages: short cache for content updates
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

## Build Order and Dependencies

Understanding what depends on what determines the order things should be built.

### Dependency Graph

```
Layer 0 (Foundation - no dependencies):
  - CSS custom properties / theme variables (themes.css, global.css)
  - Astro project config (astro.config.mjs)
  - Content collection schema (content.config.ts)

Layer 1 (Core structure - depends on Layer 0):
  - BaseLayout.astro (uses global.css, themes.css)
  - SEO.astro component (uses astro.config site URL)

Layer 2 (Page structure - depends on Layer 1):
  - Header.astro + Navigation.astro (uses BaseLayout context)
  - Footer.astro + SocialLinks.astro
  - ThemeToggle.astro (uses themes.css variables)
  - PageLayout.astro (composes BaseLayout + Header + Footer)

Layer 3 (Content rendering - depends on Layer 2):
  - BlogPostLayout.astro (extends PageLayout)
  - Image pipeline setup (Image/Picture components working)
  - UI components (Button, ImageGallery, ContactForm)

Layer 4 (Pages - depends on Layer 3):
  - Home page (index.astro) -- needs Hero, ServiceGrid, Image components
  - About page -- needs PageLayout, Image components
  - Service pages (x8) -- needs PageLayout, SampleGallery, Image components
  - Contact page -- needs PageLayout, ContactForm
  - Blog listing -- needs PageLayout, PostCard, PostList
  - Blog posts ([...slug].astro) -- needs BlogPostLayout, content collection

Layer 5 (Enhancements - depends on Layer 4):
  - Pagefind search (needs built HTML to index)
  - .htaccess generation (needs final dist/ output)
  - Lightbox functionality (needs gallery images on pages)

Layer 6 (External integrations - independent of build):
  - Gallery service setup (Pic-Time/Pixieset/CloudSpot account)
  - Contact form service setup (Web3Forms/Formspree account)
  - DNS configuration for gallery subdomain
```

### Suggested Build Order for Roadmap Phases

Based on the dependency graph, the recommended build order is:

1. **Foundation first:** Astro project setup, config, CSS variables, base layout, and one simple page to verify the build pipeline works and deploys correctly to Apache.

2. **Layout system:** Header, footer, navigation, theme toggle. Get the site shell working with placeholder content on all pages so the structural skeleton is in place.

3. **Image pipeline:** Get `<Image />` and `<Picture />` working with sample portfolio photos. Verify optimization output, verify images look good on the deployed site. This is critical for a photography site and must work before building service pages.

4. **Service pages:** Build out the 8 service category pages with real portfolio images. This is the core value of the site.

5. **Blog system:** Content collections, blog listing, individual posts, blog post layout. This is valuable but secondary to the portfolio showcase.

6. **Contact and integrations:** Contact form with external API, gallery service links, social links.

7. **Search and polish:** Pagefind for blog search, SEO meta tags, 404 page, final .htaccess tuning, performance testing.

## Scalability Considerations

| Concern | Current (launch) | 6 months | 2+ years |
|---------|-------------------|----------|----------|
| **Image count** | ~50-100 portfolio images | ~150-200 images | Consider CDN or external image hosting if build times exceed 5 min |
| **Blog posts** | 5-10 posts | 20-50 posts | Pagefind scales well; content collections handle thousands |
| **Build time** | ~30 seconds | ~1-2 minutes (more images) | Sharp processing is the bottleneck; could subset images or use CDN |
| **Page count** | ~25 pages total | ~40-60 pages | No concern -- static sites scale linearly |
| **Hosting bandwidth** | Minimal | Minimal | Shared hosting sufficient for portfolio traffic volumes |

**Key scaling insight:** The only realistic scaling concern for a solo photographer portfolio is build time as the image library grows. If build times become painful (5+ minutes), the solution is moving images to a CDN (Cloudinary, imgix) and referencing them as remote images rather than local files. This is a future optimization, not a launch concern.

## Sources

- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) -- HIGH confidence (official docs)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) -- HIGH confidence (official docs)
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) -- HIGH confidence (official docs)
- [Astro Routing](https://docs.astro.build/en/guides/routing/) -- HIGH confidence (official docs)
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) -- HIGH confidence (official docs)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/) -- HIGH confidence (official docs)
- [Astro Dark Mode Tutorial](https://docs.astro.build/en/tutorial/6-islands/2/) -- HIGH confidence (official tutorial)
- [astro-pagefind integration](https://github.com/shishkin/astro-pagefind) -- HIGH confidence (GitHub README, verified)
- [astro-htaccess integration](https://github.com/BadMannersXYZ/astro-htaccess) -- MEDIUM confidence (third-party integration, less widely used)
- [Pic-Time Custom Domain](https://help.pic-time.com/en/articles/7925318-how-do-i-add-a-custom-domain-and-email) -- HIGH confidence (official help docs)
- [Web3Forms Astro Contact Form](https://web3forms.com/platforms/astro-contact-form) -- MEDIUM confidence (third-party service docs)
- [Trailing Slashes in Astro on Apache](https://walterra.dev/blog/2025-01-28-astro-trailing-slashes) -- MEDIUM confidence (community blog, verified pattern)
