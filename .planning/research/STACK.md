# Technology Stack

**Project:** Simon Wickes Photography (swp-site)
**Researched:** 2026-02-09
**Overall confidence:** HIGH

---

## Decision: Astro 5.x Stable, Not Astro 6 Beta

Astro 6 is in beta (released January 2026) with a stable release expected early-to-mid 2026. For a production portfolio site being built now, **use Astro 5.17.x** (current stable). Rationale:

- Astro 5 is battle-tested with 113 releases in 2025
- Astro 6 requires Node 22+ and drops deprecated APIs -- unnecessary churn for a new project
- Astro 6's headline features (Cloudflare Workers dev server, live collections) are irrelevant for a static photography site on Apache shared hosting
- Upgrading from 5 to 6 later is a 1-2 hour migration per Astro's own estimate
- Astro 5.10+ already has stable responsive images and CSP -- the key features that matter here

**Confidence: HIGH** -- verified via Astro official blog, GitHub releases, and npm registry.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro | ^5.17 | Static site framework | Content-driven by design, zero JS by default, built-in image optimization, Island Architecture for selective interactivity. The standard choice for photography portfolios in 2025/2026. | HIGH |
| Node.js | ^20.3.0 (recommend 22 LTS) | Build runtime | Astro 5.8+ requires >=20.3.0. Node 22 LTS is recommended by Astro for forward compatibility with v6. Only used at build time -- not needed on Apache host. | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.1 | Utility-first CSS framework | CSS-first config in v4 (no tailwind.config.js needed), @theme for design tokens, excellent dark mode support via `selector` strategy. Pairs naturally with Astro's component model. | HIGH |
| @tailwindcss/vite | ^4.1 | Vite plugin for Tailwind | The official way to use Tailwind v4 with Astro. Replaces the deprecated @astrojs/tailwind integration. Installed alongside tailwindcss. | HIGH |

**Important:** Do NOT use `@astrojs/tailwind` -- that integration is deprecated and only supports Tailwind v3. Use the `@tailwindcss/vite` Vite plugin directly instead.

**Setup:**
```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Design tokens defined here -- colors, fonts, spacing */
}
```

### Image Optimization

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro built-in `<Image />` | (included in astro) | Image optimization & responsive images | Built-in component handles format conversion (WebP/AVIF), responsive srcset generation, lazy loading, and CLS prevention. No extra dependency needed. | HIGH |
| Astro built-in `<Picture />` | (included in astro) | Multi-format image delivery | Generates multiple formats with fallbacks. Use for hero images and key portfolio shots where AVIF+WebP+JPEG fallback chain matters. | HIGH |
| sharp | (Astro dependency) | Image processing engine | Astro's default image service uses sharp under the hood. Handles resize, format conversion, quality optimization at build time. No separate install needed. | HIGH |

**Responsive images configuration (stable since Astro 5.10):**
```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    layout: "constrained",       // or "full-width" for hero images
    responsiveStyles: true,      // adds global CSS for responsive sizing
  },
});
```

This automatically generates `srcset` and `sizes` attributes. For a photography site, this is critical -- visitors will be on everything from phones to 4K monitors.

**Photography-specific image strategy:**
- Store original high-res images in `src/assets/` for build-time optimization
- Astro converts to WebP by default, reducing file sizes dramatically
- For portfolio showcase images: use `<Picture />` with AVIF + WebP + JPEG fallback
- For thumbnails/grid: use `<Image />` with constrained layout and specific widths
- Build time will increase with many high-res images -- plan for this (see PITFALLS.md)

### Lightbox / Gallery

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| PhotoSwipe | ^5.4.4 | Full-screen image lightbox | The de facto standard for image lightboxes in the Astro ecosystem. Framework-independent, touch-friendly, supports zoom/swipe gestures. Multiple Astro integration examples exist. Lightweight (~5KB gzipped). | MEDIUM |

**Why PhotoSwipe over alternatives:**
- GLightbox: Less documented with Astro, smaller community
- Fancybox: License concerns for commercial use, heavier
- PhotoSwipe: MIT licensed, widely used in Astro photography templates, excellent mobile UX

**Note:** PhotoSwipe v5.4.4 was last published ~2 years ago but remains stable and actively used. A v6 is in development. The v5 API is mature and well-documented. Confidence is MEDIUM only because the package age could mean unmaintained -- verify before committing.

### Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Fontsource | (per-font packages) | Self-hosted web fonts | NPM packages for every Google Font. Self-hosting eliminates DNS lookups to fonts.googleapis.com, improving TTFB. Install only the weights you need. | HIGH |

**Recommended approach:**
```bash
# Example: if using Inter and a display font
npm install @fontsource-variable/inter
npm install @fontsource/playfair-display
```

```astro
---
// In BaseLayout.astro
import '@fontsource-variable/inter';
import '@fontsource/playfair-display/700.css';
---
```

Then reference in Tailwind v4's CSS-first config:
```css
@theme {
  --font-sans: 'Inter Variable', sans-serif;
  --font-display: 'Playfair Display', serif;
}
```

**Why not Astro's experimental fonts API:** It is still behind an experimental flag in Astro 5.x. Fontsource is proven, stable, and does the same thing (self-hosts fonts, eliminates external requests). When the fonts API stabilizes (likely Astro 6 or later), migration would be trivial.

### SEO

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| astro-seo | latest | SEO meta tags component | Lightweight component that renders title, meta description, Open Graph, Twitter Cards, canonical URLs. The most popular Astro SEO package. Drop into your layout's `<head>`. | MEDIUM |
| @astrojs/sitemap | ^3.7 | Automatic sitemap generation | Official Astro integration. Generates sitemap-index.xml at build time. Essential for Google indexing. | HIGH |

**Structured data (JSON-LD):** Implement manually in a `<script type="application/ld+json">` tag in layouts. Use `LocalBusiness`, `Photographer`, and `ImageGallery` schemas. No library needed -- it is just JSON in a script tag.

### Content (Blog)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro Content Collections | (included in astro) | Type-safe markdown blog | Built into Astro. Define schema in `src/content.config.ts` (Astro 5 convention), write posts as `.md` files in `src/content/blog/`. Get type-safe frontmatter, automatic slug generation, and the Content Layer API. | HIGH |
| Plain Markdown (.md) | -- | Blog post format | Simpler than MDX, no JavaScript overhead, content is portable (RSS feeds, etc). For a photography blog that primarily features text + images, MDX's component embedding is unnecessary complexity. | HIGH |

**Why NOT MDX:**
- MDX compiles to JavaScript modules, adding build overhead
- MDX ties content to your UI framework -- hurts content portability
- A photography blog needs text + images, not interactive widgets
- If you later need a custom component in one post, you can add MDX for just that post

### Contact Form

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Web3Forms | (API service) | Form submission handling | Free forever tier, no backend needed, works with plain HTML forms. Perfect for static sites on shared hosting where you cannot run server-side code. Submissions delivered to email. Includes spam protection (hCaptcha). | MEDIUM |

**Why Web3Forms:**
- FormBold, Formsubmit.co, Basin are alternatives but Web3Forms has the best Astro-specific documentation and examples
- Astro Server Actions require a Node.js runtime -- not available on Apache shared hosting
- A simple HTML form with a hidden access key is all that is needed

**Implementation:** Plain HTML form with `action="https://api.web3forms.com/submit"`. No JavaScript required. Add `botcheck` honeypot field for spam prevention.

### View Transitions / Page Transitions

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Native CSS View Transitions | (browser built-in) | Smooth page navigation animations | Over 75% global browser support as of 2026. Astro generates static MPA pages that naturally support the `@view-transition` CSS at-rule. No JavaScript needed. Aligns with Astro's zero-JS philosophy. | MEDIUM |

**Why NOT `<ClientRouter />`:**
- The `<ClientRouter />` component (formerly `<ViewTransitions />`) is being deprecated
- It adds client-side JavaScript to intercept navigation -- contradicts zero-JS approach
- Native `@view-transition` in CSS works across page navigations in modern browsers
- For older browsers, pages simply load without animation -- progressive enhancement

**Caveat:** If you need persistent dark mode toggle state across navigations without flash, `<ClientRouter />` with `astro:after-swap` is a proven pattern. Evaluate during implementation. Native view transitions handle this differently.

---

## Third-Party Gallery Integration

### Recommendation: Pixieset (link-out model, not embed)

| Aspect | Detail |
|--------|--------|
| **Approach** | Link from portfolio pages to Pixieset-hosted galleries via subdomain (e.g., `gallery.simonwickes.com`) |
| **Why link-out, not embed** | Pixieset does not provide embed codes for galleries. The integration model is: your website links to Pixieset galleries. Pixieset handles the gallery experience, client proofing, downloads, and print sales. |
| **Custom domain** | Set up a CNAME record pointing `gallery.yourdomain.com` to Pixieset for seamless branding |
| **Alternative: Pic-Time** | More premium feel, elegant transitions. Better for wedding/high-end portrait work. Same link-out integration model. |

**Confidence: HIGH** -- verified via Pixieset help center documentation.

**Key insight:** The photography portfolio website itself should showcase curated selections of Simon's best work (optimized by Astro). The third-party gallery (Pixieset/Pic-Time) is for client delivery -- proofing, selections, downloads, print orders. These are separate concerns with separate UX flows.

---

## Deployment (Apache Shared Hosting -- InMotion)

### Build & Deploy Strategy

| Aspect | Approach | Why |
|--------|----------|-----|
| **Build output** | Static HTML/CSS/JS in `dist/` | Astro's default `output: 'static'` mode. Pure files, no server runtime needed. |
| **Upload method** | SFTP via GitHub Actions | InMotion supports SFTP on port 2222. Automate with `SamKirkland/FTP-Deploy-Action` or rsync over SSH. Manual FTP via FileZilla as fallback. |
| **Document root** | `public_html/` on InMotion | Upload contents of `dist/` to `public_html/`. |
| **Cache headers** | `.htaccess` | Configure cache-control for images (long TTL), HTML (short TTL), CSS/JS (content-hashed, long TTL). |
| **HTTPS** | InMotion free SSL | InMotion shared hosting includes free AutoSSL. |

**GitHub Actions deployment workflow (recommended):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to InMotion
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - name: Deploy via SFTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          port: 2222
          protocol: ftps
          local-dir: ./dist/
          server-dir: /public_html/
```

**Critical `.htaccess` for Apache:**
```apache
# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"

# SPA-style routing (if using view transitions with client router)
# Not needed for pure static MPA -- Astro generates individual HTML files
```

---

## Complete Package List

### Production Dependencies

```bash
npm install astro@^5.17 tailwindcss@^4.1 @tailwindcss/vite@^4.1 photoswipe@^5.4.4 astro-seo@latest
```

### Astro Integrations (installed via `npx astro add`)

```bash
npx astro add sitemap
```

This installs `@astrojs/sitemap` and adds it to `astro.config.mjs` automatically.

### Font Packages (choose based on design)

```bash
# Example -- adjust to actual font choices during design phase
npm install @fontsource-variable/inter @fontsource/playfair-display
```

### Dev Dependencies

```bash
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

| Dev Tool | Purpose | Why |
|----------|---------|-----|
| prettier | Code formatting | Consistent formatting across .astro, .md, .css files |
| prettier-plugin-astro | Astro file formatting | Official plugin for .astro file formatting |
| prettier-plugin-tailwindcss | Tailwind class sorting | Automatic class ordering prevents inconsistency |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 5 | Next.js, Gatsby, Hugo | Next.js/Gatsby ship too much JS for a content site. Hugo is fast but lacks the component model and image pipeline. Astro is purpose-built for content-driven sites. |
| Framework version | Astro 5.17 | Astro 6 beta | Beta is not production-ready. Features (Cloudflare Workers, live collections) are irrelevant for static Apache hosting. |
| Styling | Tailwind CSS v4 | Plain CSS, Sass, UnoCSS | Tailwind's utility model accelerates responsive design. v4's CSS-first config eliminates the config file. Dark mode is trivial. UnoCSS is viable but smaller ecosystem. |
| Tailwind integration | @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is deprecated for Tailwind v4. The Vite plugin is the official path. |
| Image optimization | Astro built-in | Cloudinary, Imgix, Uploadcare | External image CDNs add cost and complexity. Astro's built-in sharp-based pipeline handles build-time optimization perfectly for a portfolio with a known, curated image set. External CDNs matter for user-uploaded content -- not relevant here. |
| Lightbox | PhotoSwipe | GLightbox, Fancybox, Lightbox2 | PhotoSwipe has the best Astro ecosystem support and touch UX. Fancybox has commercial license concerns. GLightbox is good but less documented with Astro. |
| Blog format | Plain Markdown | MDX, Markdoc | MDX adds JS compilation overhead for no benefit. A photography blog is text + images. Markdoc is Stripe-specific and less mainstream. |
| Contact form | Web3Forms | Formspree, Netlify Forms, custom API | Formspree has limited free tier. Netlify Forms only works on Netlify. Custom API requires a server. Web3Forms is free, well-documented for Astro, and works everywhere. |
| Fonts | Fontsource | Google Fonts CDN, astro-font, experimental fonts API | Google Fonts CDN adds external requests. astro-font works but Fontsource is more widely adopted. Experimental fonts API is not stable yet. |
| Deployment | SFTP via GitHub Actions | Manual FTP, rsync, Netlify/Vercel | Manual FTP is tedious and error-prone. Netlify/Vercel would be better hosting but the constraint is InMotion Apache. GitHub Actions SFTP automates the build-deploy pipeline. |
| Gallery platform | Pixieset | Pic-Time, SmugMug, self-hosted | Pixieset is the industry standard for photographer client galleries. Pic-Time is more premium (better for weddings). SmugMug is declining. Self-hosted gallery is massive scope creep. |

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| React/Vue/Svelte (as primary) | A photography portfolio needs zero client-side interactivity beyond lightbox. Astro components with selective islands for PhotoSwipe is sufficient. Do not add a full UI framework. |
| @astrojs/tailwind | Deprecated for Tailwind v4. Use @tailwindcss/vite instead. |
| `<ViewTransitions />` component | Renamed to `<ClientRouter />` in Astro 5, deprecated entirely for Astro 6. Use native CSS `@view-transition` or `<ClientRouter />` only if needed for dark mode persistence. |
| `Astro.glob()` | Deprecated in Astro 5, removed in Astro 6. Use Content Collections with `getCollection()` instead. |
| Squoosh (image service) | Astro removed Squoosh in favor of Sharp. Sharp is faster and more capable. |
| WordPress/headless CMS | Unnecessary complexity for a site with ~10 pages and a simple blog. Markdown in the repo is the right level of tooling. |
| Tailwind v3 | v4 is stable and the official path forward. v3 will receive security patches only. |
| Node.js < 20 | Astro 5.8+ requires Node >=20.3.0. Use Node 22 LTS for best forward compatibility. |

---

## Astro Configuration Summary

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.simonwickesphotography.com", // Required for sitemap
  output: "static", // Default -- generates pure HTML
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## Sources

### HIGH Confidence (official documentation, verified)
- [Astro 6 Beta blog post](https://astro.build/blog/astro-6-beta/) -- confirmed Astro 6 timeline and breaking changes
- [Astro Images documentation](https://docs.astro.build/en/guides/images/) -- verified Image/Picture components and responsive images
- [Tailwind CSS Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro) -- verified @tailwindcss/vite setup
- [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/) -- confirmed static build output
- [Pixieset help center](https://help.pixieset.com/hc/en-us/articles/360033998392) -- confirmed gallery link integration model
- [InMotion SFTP guide](https://www.inmotionhosting.com/support/website/ftp/shared-sftp-setup/) -- confirmed SFTP on port 2222
- [Astro 5.8 Node requirements](https://astro.build/blog/astro-580/) -- confirmed Node >=20.3.0
- [Astro Content Collections](https://docs.astro.build/en/tutorial/6-islands/4/) -- confirmed content.config.ts pattern
- [Astro responsive images](https://docs.astro.build/en/reference/experimental-flags/responsive-images/) -- confirmed stable in 5.10+
- [Astro fonts documentation](https://docs.astro.build/en/guides/fonts/) -- confirmed Fontsource approach
- [@astrojs/sitemap npm](https://www.npmjs.com/package/@astrojs/sitemap) -- confirmed v3.7.0

### MEDIUM Confidence (multiple sources agree)
- [PhotoSwipe npm](https://www.npmjs.com/package/photoswipe) -- v5.4.4, stable but last published ~2 years ago
- [Web3Forms](https://web3forms.com/) -- free tier confirmed, Astro examples available
- [astro-seo npm](https://www.npmjs.com/package/astro-seo) -- popular package, maintained
- [GitHub Actions SFTP deploy](https://github.com/marketplace/actions/sftp-deploy) -- community action, widely used
- [Astro FTP deploy blog](https://matteodefilippis.com/blog/build-and-deploy-github-actions/) -- confirmed pattern works
- [Pic-Time vs Pixieset comparison](https://greenhousecreativestudios.com/pic-time-review/) -- verified both platforms' integration models

### LOW Confidence (needs validation during implementation)
- Native CSS `@view-transition` as replacement for `<ClientRouter />` -- theoretically correct but dark mode persistence behavior needs testing
- PhotoSwipe v6 development status -- mentioned in search results but no release timeline found
- Astro experimental fonts API timeline for stable release -- unclear when it exits experimental
