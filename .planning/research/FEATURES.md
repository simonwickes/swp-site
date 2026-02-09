# Feature Landscape

**Domain:** Photography portfolio and business website
**Project:** Simon Wickes Photography (simonwickes.com)
**Researched:** 2026-02-09
**Overall confidence:** HIGH (well-established domain with extensive industry consensus)

---

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional. Potential clients will leave.

### Visual Presentation & Portfolio

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Curated portfolio galleries by service category** | Clients hire based on relevant work samples. 8 categories need distinct showcase pages. | Medium | 15-25 images per category is the sweet spot. More causes decision fatigue; fewer feels thin. Funnel approach: thumbnails first, expand on click. |
| **High-quality, optimized images** | Photography site with slow-loading or low-quality images destroys credibility instantly. | Medium | Astro's `<Picture />` component with Sharp generates WebP/AVIF with JPEG fallback. Expect 50-80% file size reduction. Responsive `srcset` is essential for mobile. |
| **Full-screen lightbox viewer** | Users expect to view photos large without navigating away from the gallery page. Click-to-expand is the universal gallery interaction pattern. | Low-Med | Keyboard navigation (arrow keys, Escape to close) is table stakes within lightbox. Touch swipe on mobile. |
| **Responsive image grids** | Portfolio must look good on phones, tablets, and desktops. Mobile-first is essential since most initial browsing happens on phones. | Medium | Masonry or CSS Grid layout. Columns should adapt: 1 col mobile, 2 col tablet, 3-4 col desktop. Gutter spacing matters for breathing room. |
| **Hero imagery on landing page** | First impression. The hero image IS the pitch. Within 3 seconds a visitor decides if this photographer's style matches what they want. | Low | Full-width, impactful image. Consider rotating hero or a small curated set. Keep text overlay minimal -- the photo speaks. |

### Information & Trust

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **About page with personal photo and story** | Clients hire people, not brands. The About page is often the 2nd most visited page after the homepage. Builds trust and personal connection. | Low | Keep bio under half a page. Lead with personality, not credentials. Include a professional headshot. "Why you do it" matters more than "what you do." Always include location for SEO. |
| **Service descriptions for each category** | Visitors need to know what's offered, the process, and what to expect. Reduces friction before contact. | Low-Med | One page per service category, or clear sections. Describe the experience, not just deliverables. |
| **Contact form** | The primary conversion action. Making it easy to reach out is the entire point of the business site. | Low | Name, Email, Message minimum. Optional: event type, date, phone. Keep to 3-5 fields maximum. "Submit" button text should be active ("Send Message" or "Get in Touch"). |
| **Contact information visibility** | Phone number and/or email address visible (not just a form). Some clients prefer direct contact. | Low | Footer and Contact page at minimum. Location/service area too. |
| **Social media links** | Clients expect to find you on Instagram, Facebook, etc. for additional social proof and to see recent work. | Low | Icon links in header/footer. Link to active profiles only. Dead social accounts are worse than no links. |
| **Mobile-responsive design** | Most initial browsing happens on phones. A non-responsive photography site is an instant credibility killer. | Medium | Mobile-first approach. Touch-friendly navigation. Hamburger menu on mobile. Images must scale properly. |

### Navigation & UX

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clear, simple navigation** | Visitors should never feel lost. Industry consensus: 5-7 menu items maximum (Home, Portfolio/Services, About, Blog, Contact). | Low | Sticky/fixed header recommended so navigation is always accessible while scrolling through gallery pages. |
| **Fast page load times** | Photography sites are image-heavy by nature. Slow sites lose visitors and search ranking. Core Web Vitals matter. | Medium | Lazy loading for below-fold images. Eager loading for above-fold hero/LCP image. Astro's static output helps enormously here. Target < 2.5s LCP. |
| **Basic SEO** | Local photography businesses live or die by Google search visibility. "Photographer in [city]" searches are how most clients find you. | Medium | Title tags, meta descriptions, Open Graph tags for social sharing, alt text on portfolio images, local business schema (JSON-LD). |

### Client Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Third-party gallery integration for client delivery** | Existing clients need password-protected galleries for proofing and downloading their photos. This is standard practice. | Low | Integration = link/button to external service (Pic-Time, Pixieset, CloudSpot, ShootProof). NOT building a gallery system. The project explicitly and correctly scopes this as third-party. |
| **Clear path from gallery to contact** | After being impressed by portfolio, the next step must be obvious. CTA buttons on every gallery page. | Low | "Book a Session," "Get in Touch," or "Let's Work Together" -- placed after gallery content and in sticky header. |

---

## Differentiators

Features that set the site apart. Not expected, but valued -- they create a premium feel or competitive advantage.

### Content & Storytelling

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Blog with session stories and behind-the-scenes** | Massive SEO benefit (each blog post is a new indexable page with long-tail keywords). Shows personality and process. Builds trust. Session stories featuring real clients are the best content for a photographer blog. | Medium | Astro + Markdown is ideal for this. Blog categories/tags. Target 1-2 posts per month for SEO compound effect. Include location keywords naturally. |
| **Blog search functionality** | Lets returning visitors and clients find specific content. Useful once blog has 10+ posts. | Low-Med | Static site constraint: client-side search (e.g., Pagefind, Fuse.js, or Lunr). No server-side search possible on shared hosting. |
| **Client testimonials / social proof** | 63% of consumers find real customer testimonials more credible than anonymous quotes. Testimonials with photos of the client/session are most effective for photographers. | Low | Static content in Markdown. Rotate featured testimonials on homepage. Dedicated testimonials section or woven into service pages. |
| **"Featured in" or press mentions** | If Simon has been published or featured, this is powerful social proof. Even local press counts. | Low | Simple logo bar or text list. Only include if genuine. |

### Visual Polish & Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dark mode toggle** | Photographs look dramatically better on dark backgrounds. Also signals modern, technically sophisticated site. Most photography portfolio sites default to dark but don't offer a toggle. | Low-Med | Already in project scope. CSS custom properties for theming. Respect `prefers-color-scheme` as default, allow manual toggle. Persist preference in localStorage. |
| **Smooth page transitions / animations** | Elevates perceived quality. Subtle fade-ins on gallery images, smooth scroll, page transitions create a polished feel matching "modern, bold" aesthetic. | Low-Med | Astro View Transitions API. Keep animations subtle -- the photos are the star, not the UI. Respect `prefers-reduced-motion`. |
| **Image hover effects on gallery grids** | Subtle zoom, caption reveal, or overlay on hover adds interactivity without cluttering the grid. Signals care in the details. | Low | CSS-only. Caption with image title or category on hover. Mobile: show on tap or always visible. |
| **Parallax or scroll-driven hero** | Creates immediate visual impact on landing page. When done right with photography, it feels cinematic. | Low-Med | Keep performance in mind. Use CSS `scroll-timeline` or `IntersectionObserver`, not heavy JS libraries. Disable on mobile if performance suffers. |

### SEO & Discoverability (Advanced)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Local business structured data (JSON-LD)** | Rich search results with address, phone, hours, service area. "Photographer" schema type. CTR improvements of 20-30% reported. | Low | JSON-LD in `<head>`. Include: name, address, telephone, geo coordinates, sameAs (social links), service area, priceRange. Consistent with Google Business Profile. |
| **Image structured data** | 25+ billion visual searches monthly. Image schema markup reportedly increases visual search traffic by ~30%. | Low | Add ImageObject schema to portfolio images. Include: name, description, contentUrl, creator, dateCreated. |
| **Open Graph / social sharing optimization** | When someone shares the site on social media, it should show a compelling preview image and description. Free marketing. | Low | OG tags on every page. Portfolio pages should use a representative image. Blog posts should use their featured image. |
| **XML sitemap with image entries** | Helps search engines discover and index portfolio content. Essential for image-heavy sites. | Low | Astro can generate this at build time. Include image URLs in sitemap entries. |

### Functional Enhancements

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **"Starting at" pricing indicators** | Reduces tire-kicker inquiries and sets expectations. The debate is ongoing, but transparency trends favor showing at least starting prices or "investment starts at" language. | Low | Can be as simple as text on service pages. Does NOT need to be a pricing calculator. Reduces low-budget inquiries that waste time. |
| **FAQ section** | Answers common questions (process, turnaround, what to wear, etc.) before they become contact form inquiries. Also great for SEO (FAQ schema). | Low | Static Markdown content. Can be on a dedicated page or within service pages. Use `<details>/<summary>` for accordion UI. |
| **Instagram feed embed** | Shows recent work and activity. Social proof that the photographer is active and booking. | Low | Embed via Instagram Basic Display API or a simple curated grid linking to Instagram. Be cautious: third-party embeds can slow page load. Consider static snapshots updated at build time instead of live embeds. |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain that waste time or hurt the site.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Custom client gallery / proofing system** | Enormous complexity (auth, storage, download management, proofing workflow, mobile apps). Purpose-built platforms (Pic-Time, CloudSpot, Pixieset) do this better and are what clients already know. Building this would consume the entire timeline. | Link to third-party gallery service. Integrate with a button/link on the site. Budget $10-35/month for gallery platform. |
| **Online booking / scheduling system** | Over-engineering for an inquiry-based business. Photography bookings require conversation (scope, location, date, style preferences). A calendar widget cannot replace this. | Contact form that captures key details. Follow up personally. The human touch IS the selling point. |
| **E-commerce / print store** | No products to sell. Client galleries handle any print sales if needed in future. Building a store is massive scope for zero current value. | If print sales ever become relevant, the gallery platform (Pic-Time, ShootProof) has built-in e-commerce. |
| **User accounts / login system** | No reason for site visitors to create accounts. Adds security burden, privacy obligations (GDPR), and complexity for zero user value. | Client gallery platform handles authenticated access. The main site is entirely public. |
| **CMS admin UI / dashboard** | Astro + Markdown is the content strategy. Building a custom admin panel adds massive scope. Simon can edit Markdown files directly. | Use Markdown files in the repo. If a GUI is ever needed, Decap CMS (formerly Netlify CMS) or TinaCMS can be layered on later with minimal effort. |
| **Autoplay video or background music** | Universally despised. Visitors don't want surprise audio. Damages credibility and increases bounce rate. Photography sites should let images speak. | If video is desired, embed a muted showreel that plays on hover or click. Never autoplay with sound. |
| **Overly complex navigation or mega-menus** | Photography sites should be simple and focused. Complex navigation overwhelms visitors and dilutes the visual impact of the work. | Flat navigation: 5-7 top-level items. Portfolio dropdown for service categories if needed, but keep it clean. |
| **Excessive image counts per gallery** | Showing 200+ images in a single gallery causes decision fatigue and slow page loads. Diminishing returns after ~30 images. | Curate ruthlessly. 15-25 images per service category. If more variety is needed, create sub-galleries (e.g., Weddings: Ceremony, Reception, Portraits). |
| **Pricing calculator or dynamic quoting** | Over-engineering. Photography pricing depends on too many variables to automate meaningfully. Creates false expectations. | "Starting at $X" text on service pages. Contact form for custom quotes. |
| **Chat widget / live chat** | Adds JavaScript bloat, requires monitoring, and creates expectation of immediate response. A solo photographer cannot staff a live chat. | Contact form + clear response time expectation ("I'll get back to you within 24 hours"). |
| **Stock photography anywhere on the site** | Using stock images on a photographer's website is the single most damaging credibility mistake possible. It tells visitors you don't trust your own work. | Use exclusively Simon's own photography for every image on the site, including backgrounds, headers, and decorative elements. |

---

## Feature Dependencies

```
Core Foundation (must exist first)
  |
  +-- Responsive layout + navigation
  |     |
  |     +-- Hero landing page (depends on: layout, image optimization)
  |     |
  |     +-- Service category pages (depends on: layout, navigation)
  |     |     |
  |     |     +-- Portfolio galleries per category (depends on: service pages, image optimization)
  |     |     |     |
  |     |     |     +-- Lightbox viewer (depends on: galleries)
  |     |     |     |
  |     |     |     +-- Gallery hover effects (depends on: galleries)
  |     |     |
  |     |     +-- Testimonials on service pages (depends on: service pages)
  |     |     |
  |     |     +-- "Starting at" pricing (depends on: service pages)
  |     |
  |     +-- About page (depends on: layout)
  |     |
  |     +-- Contact page + form (depends on: layout)
  |           |
  |           +-- CTA buttons throughout site (depends on: contact page exists)
  |
  +-- Image optimization pipeline (independent, but blocks all image content)
  |     |
  |     +-- Astro <Picture /> + Sharp for WebP/AVIF
  |     +-- Responsive srcset generation
  |     +-- Lazy loading strategy
  |
  +-- Dark mode / theming (independent, but affects all visual elements)

Content Layer (can be built incrementally)
  |
  +-- Blog engine (Astro + Markdown collections)
  |     |
  |     +-- Blog post template
  |     +-- Blog listing / index page
  |     +-- Blog search (depends on: blog having content)
  |     +-- RSS feed (depends on: blog engine)
  |
  +-- SEO foundations
        |
        +-- Meta tags + Open Graph (per-page)
        +-- JSON-LD structured data (LocalBusiness, Photographer)
        +-- XML sitemap with images
        +-- Image alt text strategy

Integration Layer (external dependencies)
  |
  +-- Third-party gallery link/button (depends on: gallery platform selection)
  +-- Social media links (depends on: active profiles existing)
  +-- Instagram embed or static grid (optional, depends on: active Instagram)
```

---

## MVP Recommendation

For MVP (launch-ready site within the ~3 week timeline), prioritize in this order:

### Phase 1: Foundation (Week 1)
1. **Responsive layout + navigation** -- everything else builds on this
2. **Image optimization pipeline** -- Astro `<Picture />` + Sharp, WebP/AVIF generation, lazy loading
3. **Dark mode theming** -- affects all visual work, so establish early
4. **Hero landing page** -- the first thing visitors see

### Phase 2: Core Content (Week 2)
5. **Service category pages with portfolio galleries** -- the core purpose of the site
6. **Lightbox viewer** -- essential gallery interaction
7. **About page** -- second most visited page
8. **Contact page with form** -- the conversion action
9. **CTA buttons** woven throughout (every gallery page, after about content)

### Phase 3: Polish & Content (Week 3)
10. **Blog engine** with at least 2-3 launch posts (session stories)
11. **SEO foundations** -- meta tags, JSON-LD, sitemap, alt text
12. **Third-party gallery integration** -- link/button to client gallery platform
13. **Social media links**
14. **Testimonials** (if content is available)

### Defer to Post-MVP
- **Blog search** -- not useful until 10+ posts exist; add after a few months of blogging
- **Instagram embed** -- nice to have but adds page weight and external dependency; add later if Instagram is active
- **FAQ section** -- build once you know what questions people actually ask
- **Parallax/scroll effects** -- polish that can be layered on after core is solid
- **"Starting at" pricing** -- can be added to service pages anytime; requires pricing decisions that may not be ready at launch
- **Image structured data** -- advanced SEO; add after basics are solid and site is indexed
- **Page transitions** -- Astro View Transitions can be added incrementally without restructuring

---

## Sources

### Multiple sources agree (MEDIUM-HIGH confidence)
- [Photography Portfolios: 25+ Examples (SiteBuilderReport)](https://www.sitebuilderreport.com/inspiration/photography-portfolios) -- portfolio best practices, gallery patterns
- [15 Tips for Professional Photographer Website (Wix)](https://www.wix.com/blog/photography/tips-professional-photographer-website) -- must-have features, design principles
- [Top 10 Must-Haves for a Photographer's Website (Picsello)](https://www.picsello.com/post/top-10-must-haves-for-a-photographers-website) -- essential feature checklist
- [21 Tips for Designing the Perfect Photography Website (byRosanna)](https://www.byrosanna.co.uk/blog/tips-designing-photography-website) -- design best practices
- [Photographer Website Best Practices (Focused Design Co)](https://www.focuseddesignco.com/blog/photography-website-best-practice-12) -- do's and don'ts
- [Wedding Photography Websites: 25+ Examples (SiteBuilderReport)](https://www.sitebuilderreport.com/inspiration/wedding-photography-websites) -- wedding-specific features
- [The 8 Biggest Portfolio Mistakes (Format)](https://www.format.com/magazine/resources/photography/8-mistakes-build-portfolio-website-photography) -- anti-patterns
- [60+ Photography Website Mistakes (ForegroundWeb)](https://www.foregroundweb.com/photography-website-mistakes/) -- comprehensive mistake catalog
- [14 Mistakes on Photography Portfolio Website (Food Photography Blog)](https://foodphotographyblog.com/mistakes-photography-portfolio-website/) -- portfolio anti-patterns

### Contact form optimization (MEDIUM confidence)
- [Photography Contact Pages (ForegroundWeb)](https://www.foregroundweb.com/photography-contact-pages/) -- photography-specific contact best practices
- [9 Contact Form Best Practices (Formidable Forms)](https://formidableforms.com/research-based-tips-improve-contact-form-conversions/) -- field count and conversion data
- [Contact Form Optimization (WiserNotify)](https://wisernotify.com/blog/contact-form-optimization/) -- reducing fields increases conversions by 120%

### SEO and structured data (MEDIUM confidence)
- [Photography Business JSON-LD Template (Mike Cassidy Photography)](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business) -- photography-specific schema
- [Image Schema Markup Guide 2026 (Koanthic)](https://koanthic.com/en/image-schema-markup-complete-implementation-guide-2026/) -- image schema implementation
- [SEO for Photographers (Narrative)](https://narrative.so/blog/seo-for-photographers-2025) -- photography SEO strategy
- [Importance of Blogging for Photographers (PPA)](https://www.ppa.com/articles/the-importance-of-blogging-for-photographers) -- blog SEO benefits

### Image optimization and Astro (HIGH confidence -- official docs)
- [Images - Astro Docs](https://docs.astro.build/en/guides/images/) -- official Astro image optimization docs
- [Image Optimization in Astro (Caisy)](https://caisy.io/blog/astro-js-images) -- practical Astro image guide
- [Image Optimization Guide (Request Metrics)](https://requestmetrics.com/web-performance/high-performance-images/) -- WebP/AVIF performance data

### Client gallery platforms (MEDIUM confidence)
- [Pixieset Alternatives - Top 10 Client Galleries 2026](https://pixieset-alternatives.com/) -- platform comparison
- [Pic-Time vs Pixieset Review 2026 (Greenhouse Creative)](https://greenhousecreativestudios.com/pic-time-review/) -- detailed comparison
- [16 Best Online Proofing Galleries 2026 (Aftershoot)](https://aftershoot.com/blog/best-online-proofing-galleries/) -- comprehensive platform list

### Testimonials and social proof (MEDIUM confidence)
- [Social Proof Statistics 2026 (WiserReview)](https://wiserreview.com/blog/social-proof-statistics/) -- 63% credibility stat for real customer testimonials
- [Social Proof Examples (Shapo)](https://shapo.io/blog/social-proof-examples/) -- display patterns

### Accessibility (HIGH confidence -- W3C official)
- [Images Tutorial (W3C WAI)](https://www.w3.org/WAI/tutorials/images/) -- official image accessibility guidance
- [Decorative Images (W3C WAI)](https://www.w3.org/WAI/tutorials/images/decorative/) -- when to use empty alt text
