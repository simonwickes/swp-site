# Simon Wickes Photography

## What This Is

A photography portfolio and business website for Simon Wickes, showcasing professional photography services across multiple specialties. The site serves as both a portfolio to attract new clients and a delivery mechanism for client work through integrated third-party galleries.

## Core Value

Potential clients can see Simon's work across all service categories and easily get in touch — first impressions matter, and the site must make Simon's photography shine.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Engaging landing page with hero imagery and clear navigation
- [ ] Dedicated service pages for 8 categories with sample galleries
- [ ] Third-party client gallery integration (password-protected, downloads, proofing)
- [ ] Contact form for inquiries
- [ ] Blog for session stories and behind-the-scenes content
- [ ] Blog search functionality
- [ ] Dark mode toggle
- [ ] Responsive design (mobile-first)
- [ ] Social media profile links
- [ ] SEO optimization for local photography business

### Out of Scope

- Online booking/scheduling — contact form is sufficient for inquiry-based workflow
- Print sales — not needed, client galleries handle delivery
- E-commerce — no products to sell
- User accounts — no login needed for site visitors
- CMS admin UI — using markdown files for simplicity

## Context

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

**Third-party gallery requirements:**
- Password-protected client galleries
- Full-resolution download capability
- Proofing/selection tools for clients to pick favorites
- No print sales needed

## Constraints

- **Hosting**: Apache shared hosting (InMotion) — no Node.js runtime, static files only
- **Timeline**: End of February 2026 (~3 weeks)
- **Tech stack**: Astro with markdown for content — chosen for simplicity and hosting compatibility
- **Budget**: Open source tools only, minimal ongoing costs (domain + hosting + gallery service)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over WordPress | Performance, security, developer control, modern tooling | — Pending |
| Markdown over Strapi CMS | Shared hosting can't run Node.js; simpler workflow | — Pending |
| Third-party gallery service | Purpose-built for photographers, saves massive dev time | — Pending |
| Static site on shared hosting | Uses existing InMotion hosting, no additional server costs | — Pending |

---
*Last updated: 2026-02-09 after initialization*
