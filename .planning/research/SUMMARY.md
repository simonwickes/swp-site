# Project Research Summary

**Project:** Simon Wickes Photography (swp-site)
**Domain:** Photography portfolio and business website
**Researched:** 2026-02-09
**Confidence:** HIGH

## Executive Summary

Simon Wickes Photography is a classic photography portfolio and business website — a well-understood domain with clear patterns. The goal is showcasing Simon's work across 8 service categories (weddings, portraits, commercial, landscape, cars, assignments, events, live performances), attracting new clients, and providing paths to contact and client galleries. This is a content-driven site with minimal interactivity beyond lightbox and contact form, making it ideal for **Astro 5 as a static site generator** deployed to Apache shared hosting via SFTP.

The recommended approach: Build a **fully static site** with Astro 5.17, Tailwind CSS v4 for styling, built-in Sharp-based image optimization, and PhotoSwipe for lightbox galleries. Keep it simple — zero server-side logic, no custom CMS, no complex client-side routing. The site lives or dies on image presentation quality and page load speed, so the image optimization pipeline is foundational and must be established in the first phase. Content collections for the blog, plain static pages for services, and external integrations (Web3Forms for contact, Pixieset/Pic-Time for client galleries) keep the scope achievable in 3 weeks.

The key risks: **unoptimized images destroying load times** (critical pitfall #1), **content preparation consuming the timeline** (the 8 service categories need 96-160 curated images with alt text — start NOW), and **mobile-first neglect** (70%+ of traffic will be mobile). Mitigation: establish image budgets early (hero <200KB, thumbnails <100KB), run content prep in parallel from day 1, and develop mobile-first with real device testing.

## Key Findings

### Recommended Stack

Astro 5.17 (stable, not v6 beta) is the clear choice — it is purpose-built for content-driven sites with zero JavaScript by default, has a mature image optimization pipeline, and outputs pure static HTML perfect for Apache hosting. Tailwind CSS v4 brings CSS-first configuration and trivial dark mode implementation. PhotoSwipe handles the lightbox experience. Fontsource self-hosts fonts to eliminate external DNS lookups. Astro's built-in content collections + Markdown covers the blog without needing MDX overhead. For client galleries, link to third-party services (Pixieset/Pic-Time) rather than building gallery infrastructure.

**Core technologies:**
- **Astro 5.17**: Static site generator — content-driven by design, built-in image optimization, Island Architecture for selective interactivity
- **Tailwind CSS v4**: Utility-first CSS — CSS-first config eliminates tailwind.config.js, dark mode via `selector` strategy, natural pairing with Astro components
- **@tailwindcss/vite**: Tailwind integration — the official Vite plugin for Tailwind v4 (replaces deprecated @astrojs/tailwind)
- **Node 22 LTS**: Build runtime — Astro 5.8+ requires Node >=20.3.0, only needed at build time (not on Apache host)
- **Sharp**: Image processing — Astro's default image service, handles WebP/AVIF generation, resize, quality optimization at build time
- **PhotoSwipe 5.4.4**: Lightbox viewer — de facto standard for Astro photography sites, framework-independent, touch-friendly, 5KB gzipped
- **Fontsource**: Self-hosted fonts — eliminates Google Fonts CDN requests, improves TTFB
- **astro-seo**: SEO component — title, meta, Open Graph, Twitter Cards in one component
- **@astrojs/sitemap**: Sitemap generation — official integration, essential for Google indexing
- **Web3Forms**: Contact form backend — free tier, no server needed, works with plain HTML forms on static hosting
- **Pagefind**: Blog search — build-time indexing, lightweight client-side search for static sites
- **Pixieset or Pic-Time**: Client gallery platform — link-out integration via subdomain (e.g., galleries.simonwickes.com), handles proofing/downloads

**Critical version note:** Use Astro 5.17, NOT Astro 6 beta. Astro 6's features (Cloudflare Workers dev server, live collections) are irrelevant for static Apache hosting. Upgrading 5→6 later is a 1-2 hour migration.

**Deployment:** GitHub Actions + SFTP to InMotion shared hosting. Build static output, upload dist/ to public_html/, configure .htaccess for caching and compression.

### Expected Features

Research identified clear table stakes vs. differentiators for photography portfolio sites.

**Must have (table stakes):**
- **Curated portfolio galleries by service category** — 8 service pages with 15-25 images each, responsive grids (1 col mobile, 3-4 col desktop)
- **High-quality optimized images** — WebP/AVIF with JPEG fallback, responsive srcset, lazy loading (credibility destroyer if slow)
- **Full-screen lightbox viewer** — click-to-expand, keyboard navigation, touch swipe (universal interaction pattern)
- **Hero imagery on landing page** — first impression is everything, full-width impactful image
- **About page with photo and story** — builds trust, 2nd most visited page after homepage
- **Service descriptions** — one page per category explaining process and offerings
- **Contact form** — primary conversion action, 3-5 fields max (name, email, service type, message)
- **Contact info visibility** — phone/email in footer and contact page
- **Social media links** — Instagram/Facebook for social proof
- **Mobile-responsive design** — 70%+ of traffic is mobile, non-negotiable
- **Fast page load times** — target LCP <2.5s despite image-heavy nature
- **Basic SEO** — title tags, meta descriptions, Open Graph, alt text, local business schema
- **Third-party gallery integration** — link to Pixieset/Pic-Time for client proofing/downloads

**Should have (competitive):**
- **Blog with session stories** — massive SEO benefit, shows personality, builds trust (target 1-2 posts/month)
- **Blog search** — useful once 10+ posts exist (Pagefind client-side search)
- **Client testimonials** — social proof, rotate on homepage
- **Dark mode toggle** — photography looks better on dark backgrounds, signals modern site
- **Smooth page transitions** — Astro View Transitions or native CSS view-transition
- **Image hover effects** — subtle zoom/caption reveal on gallery grids
- **Local business structured data (JSON-LD)** — rich search results, 20-30% CTR improvement
- **Image structured data** — helps visual search discovery
- **Open Graph optimization** — compelling social sharing previews
- **FAQ section** — reduces support inquiries, good for SEO

**Defer (v2+):**
- **Blog search** — not useful until 10+ posts exist
- **Instagram embed** — adds page weight, can be static snapshots instead
- **Parallax/scroll effects** — polish that can be layered on later
- **"Starting at" pricing** — requires pricing decisions that may not be ready at launch
- **Image structured data** — advanced SEO, add after basics are indexed

**Anti-features (DO NOT BUILD):**
- **Custom client gallery system** — months of work, purpose-built services do this better
- **Online booking/scheduling** — photography requires conversation, not calendar widgets
- **E-commerce/print store** — no products to sell, gallery platform handles this if needed
- **User accounts/login** — no reason for visitors to create accounts, security burden
- **CMS admin UI** — Markdown in repo is sufficient, Decap CMS can be layered later if needed
- **Autoplay video/music** — universally despised, damages credibility
- **Stock photography** — using stock images on a photographer's site destroys credibility
- **Pricing calculator** — over-engineering, photography pricing has too many variables

### Architecture Approach

The architecture is **fully static** with all pages pre-rendered at build time. The only runtime interactions are client-side JavaScript for UI features (dark mode, search, lightbox) and external service integrations (gallery links, contact form submission). Astro builds to dist/ containing pure HTML/CSS/JS/images served by Apache. No server-side code, no database, no API routes on the main site.

**Build-time flow:** Markdown blog posts → validated by Zod schema → queried via getCollection() → rendered to static HTML. Images in src/assets/ → processed by Sharp → WebP/AVIF generated → responsive srcset → output to dist/_astro/. After HTML generation, Pagefind indexes content and .htaccess is placed in dist/ root.

**Runtime flow:** Standard anchor link navigation (no SPA routing), full page loads served by Apache. Dark mode script checks localStorage before paint (no flash). Blog search lazy-loads Pagefind index. Contact form submits to external API. Gallery links navigate to subdomain or external URL.

**Major components:**
1. **Base Layout** — HTML shell, meta tags, global nav/footer, inline dark mode script (wraps all pages)
2. **Image Pipeline** — Astro Image/Picture components + Sharp, process all src/assets/ images at build time
3. **Content Collections** — Blog posts with Zod schema validation, type-safe frontmatter, queried via getCollection()
4. **Service Pages** — 8 static .astro pages (not content collections — each has unique layout/design)
5. **Contact Form** — Client-side form submitting to Web3Forms API (no server-side code needed)
6. **Gallery Integration** — Link/button to external gallery service via subdomain (galleries.simonwickes.com)
7. **Dark Mode Toggle** — Theme switching with localStorage persistence, inline script in <head> prevents flash
8. **Blog Search (Pagefind)** — Build-time index generation, client-side search, lazy-loaded
9. **Apache Config (.htaccess)** — Cache headers for images (1 year), CSS/JS (1 year, hash-based filenames), HTML (1 hour), gzip compression

**Key patterns:**
- **Inline dark mode script** — runs before first paint to prevent flash of wrong theme
- **Image optimization** — Use Picture for hero images (AVIF+WebP fallback), Image for gallery thumbnails
- **Content collections for blog only** — not services (8 unique pages don't need abstraction)
- **External integrations** — contact form and galleries outsourced to specialized services
- **Apache-specific config** — .htaccess in public/ copied to dist/, essential for caching and performance

**Anti-patterns to avoid:**
- **Building custom gallery system** — massive scope creep
- **Images in public/ directory** — bypasses optimization entirely
- **Client-side routing/SPA** — adds complexity for zero benefit on static site
- **Over-engineering content collections** — blog only, not every data type
- **Forgetting Apache config** — no caching = slow site for all users

### Critical Pitfalls

Research identified 14 pitfalls across critical/moderate/minor severity. Top 5 for this project:

1. **Unoptimized hero/portfolio images destroying first impressions** — Full-resolution photos (3-8MB each) cause 8-15s load times. 53% of users leave if >3s. **Prevention:** Image budget (hero <200KB, thumbs <100KB, full <400KB), use Astro Image/Picture components, WebP/AVIF at quality 75-80, lazy load below-fold, test on Slow 3G.

2. **Ignoring mobile-first for image-heavy site** — Desktop-first development creates broken mobile experience for 70%+ of traffic. **Prevention:** Design mobile breakpoint first, test on real devices (not just DevTools), ensure 44px touch targets, hamburger menu on mobile, 1-col gallery grid on mobile.

3. **Astro image pipeline misconfiguration** — Images in public/ bypass optimization OR builds take 15-30min with 200+ images. **Prevention:** All portfolio images in src/assets/ (never public/), preserve Astro image cache, pre-optimize source images (max 3840px, strip EXIF), use Image component (never raw img tag).

4. **Content preparation consuming timeline** — 8 service categories need 96-160 curated images with alt text. Takes 2-3x longer than estimated. **Prevention:** Start content prep NOW (parallel track from day 1), create content spreadsheet, budget 2-3 hours per service category, pre-process images before templates are ready.

5. **Deployment to Apache without caching/compression** — Apache shared hosting defaults serve no Cache-Control headers, no gzip. Site is slow for all users despite optimized build output. **Prevention:** Create .htaccess in public/ with mod_expires (images 1yr, CSS/JS 1yr, HTML 1hr) and mod_deflate (gzip for HTML/CSS/JS/SVG), test with GTmetrix after deploy.

Additional key pitfall: **Third-party gallery integration becoming UX black hole** — Gallery service looks completely different from main site. **Prevention:** Accept it's a separate experience, link cleanly (don't iframe), use subdomain (galleries.simonwickes.com), match colors/logo as closely as possible.

## Implications for Roadmap

Based on research findings and dependency analysis, recommended phase structure:

### Phase 1: Foundation & Image Pipeline
**Rationale:** Everything depends on the layout system and image optimization working correctly. For a photography site, the image pipeline IS the foundation. Establishing this early prevents painful retrofitting and ensures all subsequent work builds on optimized images.

**Delivers:**
- Astro project setup with config (astro.config.mjs)
- Tailwind v4 integration via @tailwindcss/vite
- CSS custom properties and theme system (light/dark)
- Base layout component with inline dark mode script
- Header/footer/navigation structure
- Image optimization pipeline verified (Sharp, WebP/AVIF generation)
- One working page deployed to Apache to verify SFTP and .htaccess

**Addresses features:**
- Responsive layout (table stakes)
- Dark mode toggle (differentiator)
- Image optimization foundation (table stakes — fast load times)

**Avoids pitfalls:**
- Pitfall #3: Astro image pipeline misconfiguration
- Pitfall #10: Deployment without caching/compression
- Establishes image budget from day 1 (Pitfall #1)

**Research flag:** Standard Astro setup — skip research-phase, patterns are well-documented.

---

### Phase 2: Core Portfolio Showcase
**Rationale:** The service category pages with portfolio galleries are the core value proposition. They depend on the foundation (layout, image pipeline) being solid. This is the longest content-entry phase and should be built once image optimization is proven.

**Delivers:**
- 8 service category pages (weddings, portraits, commercial, landscape, cars, assignments, events, live performances)
- Gallery grid component with responsive layout (1 col mobile, 3-4 col desktop)
- PhotoSwipe lightbox integration
- Image hover effects on gallery grids
- Hero landing page with curated featured work
- Service descriptions and page copy

**Addresses features:**
- Curated portfolio galleries by category (table stakes)
- Full-screen lightbox viewer (table stakes)
- Hero imagery on landing page (table stakes)
- Image hover effects (differentiator)

**Avoids pitfalls:**
- Pitfall #1: Unoptimized images (pipeline established in Phase 1)
- Pitfall #2: Mobile-first neglect (responsive grids tested on real devices)
- Pitfall #5: Over/under-curating (12-20 images per category)
- Pitfall #12: Missing alt text (written during image selection, not after)

**Content requirement:** This phase requires content prep to be complete — image selection, alt text, ordering. **Start parallel content prep in Phase 1.**

**Research flag:** PhotoSwipe integration may need light research for Astro-specific implementation patterns.

---

### Phase 3: About & Contact (Conversion Paths)
**Rationale:** Once the portfolio is showcased, visitors need clear conversion paths. About page builds trust (2nd most visited), contact form is the primary conversion action. These are simpler pages but essential for business function.

**Delivers:**
- About page with Simon's photo, story, location
- Contact page with form (Web3Forms integration)
- Contact form with client-side validation and honeypot spam protection
- Contact info in footer (visible site-wide)
- Social media links component
- CTA buttons throughout site (after gallery content, in header)

**Addresses features:**
- About page with photo and story (table stakes)
- Contact form (table stakes — PRIMARY conversion action)
- Contact info visibility (table stakes)
- Social media links (table stakes)

**Avoids pitfalls:**
- Pitfall #8: Contact form on static site (Web3Forms or PHP script, honeypot field, end-to-end testing)
- Ensures contact form works before launch (critical for business)

**Research flag:** Contact form integration straightforward — Web3Forms has Astro examples. Skip research-phase.

---

### Phase 4: Blog Engine & Search
**Rationale:** Blog is valuable for SEO but secondary to portfolio. Content collections architecture is established, blog listing and posts use standard Astro patterns. Search can be added after core blog works.

**Delivers:**
- Content collection schema for blog posts (content.config.ts)
- Blog listing page with post cards
- Individual blog post pages (dynamic [...slug].astro)
- Blog post layout with metadata (date, tags, reading time)
- 2-3 seed blog posts (session stories) for launch
- Pagefind search integration (build-time index, lazy-loaded UI)

**Addresses features:**
- Blog with session stories (differentiator — massive SEO benefit)
- Blog search (differentiator — useful once 10+ posts exist)

**Avoids pitfalls:**
- Pitfall #11: Blog search complexity (use Pagefind, build-time index)
- Content entry effort (2-3 seed posts prepared in advance)

**Research flag:** Pagefind integration may need research for Astro-specific setup. Otherwise standard content collections pattern.

---

### Phase 5: SEO Foundations & Gallery Integration
**Rationale:** SEO foundations should be built into templates early but final tuning happens here. Gallery service integration requires service selection decision (should happen in Phase 1 planning but implemented here).

**Delivers:**
- astro-seo component integrated site-wide
- Local business JSON-LD schema (PhotographyBusiness or LocalBusiness)
- Image structured data on portfolio pages (ImageObject schema)
- Open Graph and Twitter Card meta tags per page
- XML sitemap with image entries (@astrojs/sitemap)
- Alt text audit and completion (all 96-160 images)
- Third-party gallery integration (link to Pixieset/Pic-Time via subdomain)
- Client gallery page explaining process and linking to external gallery
- Gallery service branding (match logo/colors as closely as possible)

**Addresses features:**
- Basic SEO (table stakes)
- Local business structured data (differentiator)
- Image structured data (differentiator)
- Open Graph optimization (differentiator)
- Third-party gallery integration (table stakes)

**Avoids pitfalls:**
- Pitfall #6: Neglecting local SEO and structured data
- Pitfall #4: Gallery integration UX black hole (accept separate experience, link cleanly)
- Pitfall #12: Missing alt text (final audit)

**Research flag:** Gallery service selection decision should happen early (Phase 1 planning). Implementation is straightforward (link + subdomain CNAME).

---

### Phase 6: Polish, Testing & Launch Prep
**Rationale:** Final phase for refinements, performance tuning, and pre-launch validation. No new features, only optimization and testing.

**Delivers:**
- Page transitions (Astro View Transitions or native CSS view-transition)
- Testimonials component and content (if available)
- FAQ section (if content prepared)
- Performance audit (Lighthouse on all pages, LCP <2.5s)
- Mobile testing on real iPhone and Android devices
- Contact form end-to-end testing
- Cross-browser testing (Chrome, Safari, Firefox)
- .htaccess final tuning (cache headers, compression verified)
- Deployment automation via GitHub Actions
- Final content review and typo fixes
- Google Search Console sitemap submission

**Addresses features:**
- Smooth page transitions (differentiator)
- Client testimonials (differentiator)
- FAQ section (differentiator)

**Avoids pitfalls:**
- Pitfall #2: Mobile testing on real devices (not just DevTools)
- Pitfall #8: Contact form reliability (end-to-end testing)
- Pitfall #10: Apache caching/compression (GTmetrix verification)
- Pitfall #1: Image optimization final check (LCP <2.5s on all pages)

**Research flag:** No research needed — standard testing and optimization phase.

---

### Phase Ordering Rationale

**Why foundation first:** The image pipeline is the most critical architectural decision for a photography site. Getting it wrong (images in public/, no optimization, slow builds) creates technical debt that is painful to fix. Establishing layout, theming, and verified image optimization in Phase 1 ensures all subsequent work builds on a solid base.

**Why portfolio before blog:** The service category galleries are the core value proposition and the most complex content entry task. Blog is valuable but secondary. Building portfolio pages early reveals any image optimization issues while there's time to fix them.

**Why contact in Phase 3:** Contact form is the primary conversion action but relatively simple to implement. Placing it after portfolio ensures the site has compelling content to drive conversions when the form goes live.

**Why SEO in Phase 5:** SEO foundations (schema markup, meta tags) should be built into templates early, but final SEO work (alt text completion, image schema) benefits from having all content in place. This phase also handles gallery integration which requires an external service selection decision.

**Why polish last:** Performance optimization, testing, and refinements should happen when all features are implemented. This prevents rework and allows holistic performance tuning.

**Critical path: Content preparation:** The 8 service categories require 96-160 curated images with alt text. This is 16-24 hours of work that cannot be compressed. **Content prep must start in Phase 1 and run in parallel through Phase 2.** This is the most common timeline risk for photography sites.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 2 (PhotoSwipe integration):** Lightweight research for Astro-specific PhotoSwipe setup patterns. Community examples exist but may need API exploration.
- **Phase 4 (Pagefind integration):** Astro-pagefind integration patterns, lazy-loading strategy, UI customization.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Astro setup, Tailwind v4 integration, dark mode — all well-documented in official docs.
- **Phase 3 (Contact form):** Web3Forms has Astro examples, straightforward HTML form with external API.
- **Phase 5 (SEO/Gallery):** JSON-LD schema is standard, gallery integration is just linking/subdomain setup.
- **Phase 6 (Polish/Testing):** Standard testing and optimization, no novel patterns.

**Build time management:** With 200+ portfolio images, Astro build times could approach 3-5 minutes. Preserve image cache between builds (default: node_modules/.astro/), pre-optimize source images (max 3840px wide, strip EXIF), and consider parallelizing image processing if builds exceed 5 minutes.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro 5.17 verified via official docs, npm registry, and release notes. Tailwind v4 integration confirmed via official Tailwind docs. PhotoSwipe and other integrations have verified Astro examples. |
| Features | HIGH | Photography portfolio domain is well-established with strong industry consensus on table stakes (portfolio galleries, lightbox, contact form, responsive design). Differentiators (blog, dark mode, structured data) validated by multiple photography business sources. |
| Architecture | HIGH | Fully static architecture is standard for Astro. Component boundaries, data flow, and build patterns verified via official Astro documentation. Apache deployment patterns confirmed via hosting provider docs and community guides. |
| Pitfalls | HIGH | Image optimization pitfalls verified via Astro official docs and photography industry sources. Mobile-first, content prep, and Apache config pitfalls corroborated by multiple sources. PhotoSwipe integration challenge is MEDIUM confidence based on community experience. |

**Overall confidence:** HIGH

The photography portfolio domain is mature with extensive documentation and established patterns. Astro 5 is stable and well-documented. The static site architecture is straightforward. The main uncertainties are implementation details (PhotoSwipe/Astro integration, Pagefind setup) rather than fundamental architectural questions.

### Gaps to Address

**PhotoSwipe v6 timeline:** PhotoSwipe v5.4.4 is stable but ~2 years old with v6 in development. No release timeline found. **Mitigation:** Proceed with v5.4.4 (proven in production, good Astro examples). Monitor v6 development but don't block on it. Upgrading 5→6 later should be low-effort given PhotoSwipe's framework-independent design.

**Gallery service selection:** Research identified Pixieset (industry standard) and Pic-Time (premium feel) as top options but didn't make a final recommendation. **Mitigation:** Evaluate both in Phase 1 planning based on Simon's needs (pricing, customization, brand alignment). Decision needed before Phase 5 implementation.

**Astro experimental fonts API:** Fontsource is recommended (stable, proven) but Astro has an experimental fonts API that may stabilize in Astro 6. **Mitigation:** Use Fontsource now. If fonts API stabilizes post-launch, migration would be trivial.

**Native CSS view-transition for dark mode persistence:** Research suggests native CSS view-transition as replacement for ClientRouter but notes dark mode persistence behavior needs testing. **Mitigation:** Test native approach in Phase 1. Fall back to ClientRouter with astro:after-swap if dark mode flash occurs.

**Content volume and build time scaling:** With 200+ images, build times could hit 5+ minutes. Sharp processing is the bottleneck. **Mitigation:** Preserve image cache, pre-optimize source images. If build times become painful post-launch (as image library grows), consider moving images to CDN (Cloudinary, imgix) and referencing as remote images.

## Sources

### Primary (HIGH confidence)
- Astro official documentation (docs.astro.build) — stack verification, architecture patterns, image optimization, content collections, deployment
- Tailwind CSS official docs (tailwindcss.com) — v4 integration, @tailwindcss/vite setup
- Astro GitHub releases and blog (astro.build/blog) — version verification, Astro 6 beta timeline
- npm registry — package versions, deprecation status (@astrojs/tailwind deprecated)
- Pixieset and Pic-Time official help centers — gallery integration model confirmation
- InMotion hosting documentation — SFTP setup, Apache shared hosting capabilities
- W3C WAI (Web Accessibility Initiative) — image accessibility, alt text guidelines

### Secondary (MEDIUM confidence)
- Photography industry sources (Format, ForegroundWeb, 500px, Digital Photography School) — feature expectations, portfolio best practices, anti-features
- Photography business guides (Picsello, byRosanna, Focused Design Co) — must-have features, design principles
- SEO and performance sources (Request Metrics, NitroPack, Hostinger, Google Core Web Vitals docs) — image optimization benchmarks, LCP thresholds, WebP/AVIF benefits
- Contact form and search sources (Web3Forms, astro-pagefind GitHub, Formidable Forms) — integration patterns, optimization data
- Community blog posts and guides — Astro dark mode tutorial, SFTP deployment workflows, .htaccess caching patterns

### Tertiary (LOW confidence, needs validation)
- PhotoSwipe v6 development status — mentioned in search results but no official timeline
- Native CSS view-transition for dark mode — theoretically sound but needs testing for flash prevention
- Specific CTR improvements from structured data (20-30%) — reported in multiple sources but attribution unclear

---
*Research completed: 2026-02-09*
*Ready for roadmap: yes*
