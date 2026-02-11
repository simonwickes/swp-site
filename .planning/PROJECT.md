# Simon Wickes Photography

## What This Is

A photography portfolio and business website for Simon Wickes, featuring 8 service category galleries with PhotoSwipe lightbox, a hero carousel landing page, contact form with email notifications, blog with search and filtering, and full SEO optimization with JSON-LD schema markup. Built as a static Astro site for shared hosting.

## Core Value

Potential clients can see Simon's work across all service categories and easily get in touch — first impressions matter, and the site must make Simon's photography shine.

## Requirements

### Validated

- ✓ Engaging landing page with hero imagery and clear navigation — v1.0
- ✓ Dedicated service pages for 8 categories with sample galleries — v1.0
- ✓ Third-party client gallery integration (password-protected, downloads, proofing) — v1.0
- ✓ Contact form for inquiries — v1.0
- ✓ Blog for session stories and behind-the-scenes content — v1.0
- ✓ Blog search functionality — v1.0
- ✓ Dark mode toggle — v1.0
- ✓ Responsive design (mobile-first) — v1.0
- ✓ Social media profile links — v1.0
- ✓ SEO optimization for local photography business — v1.0

### Active

(None — next milestone requirements defined via /gsd:new-milestone)

### Out of Scope

- Online booking/scheduling — contact form is sufficient for inquiry-based workflow
- Print sales — not needed, client galleries handle delivery
- E-commerce — no products to sell
- User accounts — no login needed for site visitors
- CMS admin UI — using markdown files for simplicity
- Offline mode — static site with no dynamic data requirements

## Context

**Shipped v1.0 with 4,425 LOC (TypeScript/Astro/CSS).**
Tech stack: Astro 5.17, Tailwind v4, Sharp, PhotoSwipe, Fuse.js, Resend, astro-swiper, astro-masonry.

**Services offered (8 categories):**
1. Outdoor Portraits
2. Weddings
3. Commercial
4. Landscape Portfolio
5. Cars
6. Assignments (one-off location shoots)
7. Events
8. Live Performances

**Existing assets:**
- Extensive portfolio content ready for all service categories
- Existing domain: simonwickes.com
- InMotion shared hosting (Apache)

**Design direction:**
Modern, bold, warm aesthetic with pops of color. The vibe should be approachable, friendly, and professional — not stuffy or corporate. Photography should be front and center with minimal UI getting in the way.

**Third-party gallery (Pic-Time):**
- Password-protected client galleries
- Full-resolution download capability
- Proofing/selection tools for clients to pick favorites
- No print sales needed
- Integration: link-out from site to Pic-Time galleries

**Known issues:**
- Pre-existing type error in astro.config.mjs (Vite plugin type mismatch) — does not affect builds
- Native browser dropdown has light background in dark mode on Chrome Mac (OS-level limitation)

**Pre-launch items:**
- Replace placeholder images with real photography
- Configure Resend API key and CONTACT_EMAIL for production
- Confirm Pic-Time subdomain URL
- DNS verification for custom email sender domain

## Constraints

- **Hosting**: Apache shared hosting (InMotion) — no Node.js runtime, static files only
- **Timeline**: End of February 2026 (~3 weeks)
- **Tech stack**: Astro with markdown for content — chosen for simplicity and hosting compatibility
- **Budget**: Open source tools only, minimal ongoing costs (domain + hosting + gallery service)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over WordPress | Performance, security, developer control, modern tooling | ✓ Good — 592ms build, 17 pages, zero runtime JS overhead |
| Markdown over Strapi CMS | Shared hosting can't run Node.js; simpler workflow | ✓ Good — content collections work well for blog + services |
| Third-party gallery service | Purpose-built for photographers, saves massive dev time | ✓ Good — Pic-Time selected, clean link-out integration |
| Static site on shared hosting | Uses existing InMotion hosting, no additional server costs | ✓ Good — all pages pre-rendered, sitemap generated |
| Pic-Time for client galleries | Full-featured proofing, password protection, downloads; clean UX | ✓ Good — bridging page pattern works well |
| Tailwind v4 CSS-first | No config file, @theme directives, cleaner DX | ✓ Good — design tokens in CSS, dark mode via @custom-variant |
| PhotoSwipe for lightbox | Keyboard + touch + View Transitions compatible | ✓ Good — required cleanup handlers for VT but works well |
| Resend for email | Simple API, works with Astro Actions | ✓ Good — clean integration, Zod validation |
| Fuse.js for client-side search | No server needed, works on static hosting | ✓ Good — weighted fuzzy search with JSON index |

---
*Last updated: 2026-02-10 after v1.0 milestone*
