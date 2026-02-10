# Roadmap: Simon Wickes Photography

## Overview

This roadmap delivers a photography portfolio and business website for Simon Wickes, progressing from foundational infrastructure through the core portfolio showcase, conversion paths, blog, and finally SEO optimization. The image pipeline is established first because every subsequent phase depends on optimized image delivery. Content preparation (curating 96-160 portfolio images with alt text across 8 service categories) runs as a parallel track starting from Phase 1 -- this is the most common timeline risk for photography sites and must not be deferred.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Design System** - Project scaffolding, image pipeline, layout, dark mode, responsive framework, navigation
- [x] **Phase 2: Landing Page** - Hero imagery, featured work showcase, loading states
- [x] **Phase 3: Service Pages & Lightbox** - 8 category pages with gallery grids and full-size viewer
- [x] **Phase 4: Contact & Conversion** - Contact form, email notifications, FAQ, response time
- [x] **Phase 5: Client Galleries** - Bridging page for third-party gallery access
- [x] **Phase 6: Blog Engine** - Content collections, listing page, individual posts with metadata
- [x] **Phase 7: Blog Discovery & Sharing** - Search, category filtering, social share buttons
- [ ] **Phase 8: SEO, Transitions & Launch Readiness** - Meta tags, sitemap, schema markup, alt text audit, page transitions

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: Users can load the site on any device with working navigation, dark/light mode, and the image optimization pipeline is proven
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-05, LAND-02
**Success Criteria** (what must be TRUE):
  1. User sees the site in dark mode by default on first visit
  2. User can toggle between dark and light mode, and the preference persists across page loads without a flash of wrong theme
  3. User can navigate to all 8 service categories from the main menu on both desktop and mobile
  4. User sees a footer with contact info and social media profile links on every page
  5. Site is fully responsive -- layout adapts correctly from mobile (375px) through tablet to desktop
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md -- Scaffold Astro project + design tokens + dark mode system
- [ ] 01-02-PLAN.md -- Navigation (header/dropdown/mobile) + footer + all placeholder pages
- [ ] 01-03-PLAN.md -- Image optimization pipeline proof
- [ ] 01-04-PLAN.md -- Visual verification checkpoint

**Note**: Start content preparation as a parallel track during this phase. Curate images, write alt text, and organize by service category. This work is independent of code and must begin now to avoid becoming the critical path bottleneck.

---

### Phase 2: Landing Page
**Goal**: Users arrive at a visually striking homepage that immediately showcases Simon's best photography and invites exploration
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-03, DSGN-04
**Success Criteria** (what must be TRUE):
  1. User sees a hero section with impactful photography that fills the viewport on landing
  2. User sees a featured work section highlighting curated images from across service categories
  3. User sees elegant loading states (placeholder, blur-up, or skeleton) while images load rather than layout shift or blank space
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md -- Install deps, hero images, build HeroCarousel + UI primitives
- [ ] 02-02-PLAN.md -- Featured grid, landing page composition, LCP optimization
- [ ] 02-03-PLAN.md -- Visual verification checkpoint

---

### Phase 3: Service Pages & Lightbox
**Goal**: Users can browse all 8 service categories with curated galleries and view any image in a full-screen lightbox
**Depends on**: Phase 1 (layout, image pipeline), Phase 2 (shared gallery components)
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, SERV-05
**Success Criteria** (what must be TRUE):
  1. User can access a dedicated page for each of the 8 service categories (Outdoor Portraits, Weddings, Commercial, Landscape, Cars, Assignments, Events, Live Performances)
  2. User sees a responsive gallery grid (12-20 curated images) on each service page that adapts from 1 column on mobile to 3-4 columns on desktop
  3. User can click any gallery image to view it full-size in a lightbox with keyboard navigation and touch swipe support
  4. User reads a description of each service offering and what to expect
  5. User can click a CTA button on any service page to navigate directly to the contact form
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md -- Install PhotoSwipe, service data module, ServiceHero/ServiceNav components, placeholder images
- [ ] 03-02-PLAN.md -- ServiceGallery component (masonry + lightbox), all 8 service pages, services index update
- [ ] 03-03-PLAN.md -- Visual and functional verification checkpoint

**Note**: This phase requires content prep to be substantially complete -- curated images, alt text, service descriptions, and image ordering for all 8 categories.

---

### Phase 4: Contact & Conversion
**Goal**: Users can inquire about photography services and get clear feedback, and Simon receives email notifications for every submission
**Depends on**: Phase 1 (layout, footer)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. User can submit a contact form with name, email, message, and optional event type and date fields
  2. User sees clear success confirmation after submitting the form, or an error message if submission fails
  3. Simon receives an email notification containing the form submission details
  4. User can read an FAQ section with answers to common photography questions
  5. User sees an expected response time indication (e.g., "I'll get back to you within 24 hours")
**Plans**: 4 plans

Plans:
- [ ] 04-01-PLAN.md -- Netlify adapter + Resend SDK + Astro Action for contact form email delivery
- [ ] 04-02-PLAN.md -- FAQ data module and standalone FAQ page
- [ ] 04-03-PLAN.md -- Contact form UI component and contact page composition
- [ ] 04-04-PLAN.md -- Visual and functional verification checkpoint

---

### Phase 5: Client Galleries
**Goal**: Existing clients can find their way to password-protected galleries on the third-party gallery platform
**Depends on**: Phase 1 (layout, navigation)
**Requirements**: GALL-01, GALL-02
**Success Criteria** (what must be TRUE):
  1. User can access a client galleries page that explains how gallery access works (password-protected, downloads, proofing)
  2. User can navigate to the third-party gallery service via clearly presented links or buttons
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md -- Gallery data file, Button external link support, galleries page
- [ ] 05-02-PLAN.md -- Navigation updates (Header + Footer) and visual verification

---

### Phase 6: Blog Engine
**Goal**: Users can browse and read blog posts about photography sessions, behind-the-scenes stories, and tips
**Depends on**: Phase 1 (layout)
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04
**Success Criteria** (what must be TRUE):
  1. User can view a blog listing page showing all published posts with preview cards
  2. User can click through to read a full individual blog post
  3. Blog posts render markdown formatting correctly including inline images
  4. User sees post metadata (publication date, category/tags) on each post
**Plans**: 4 plans

Plans:
- [ ] 06-01-PLAN.md -- Content infrastructure, author data, date utility, sample posts
- [ ] 06-02-PLAN.md -- Blog listing components and paginated listing page
- [ ] 06-03-PLAN.md -- Individual post components and post pages
- [ ] 06-04-PLAN.md -- Navigation updates and visual verification

---

### Phase 7: Blog Discovery & Sharing
**Goal**: Users can find specific blog content through search and filtering, and share posts on social media
**Depends on**: Phase 6 (blog engine must exist)
**Requirements**: BLOG-05, BLOG-06, BLOG-07
**Success Criteria** (what must be TRUE):
  1. User can search across blog content and see relevant results
  2. User can filter the blog listing by category or tag to narrow down posts
  3. User can share any blog post via social media share buttons
**Plans**: 3 plans

Plans:
- [ ] 07-01-PLAN.md -- Search index endpoint, Fuse.js install, BlogDiscoveryBar component
- [ ] 07-02-PLAN.md -- ShareButtons component and blog post page integration
- [ ] 07-03-PLAN.md -- Client-side search/filter engine wired into listing page

---

### Phase 8: SEO, Transitions & Launch Readiness
**Goal**: The site is discoverable by search engines with proper metadata, portfolio images have descriptive alt text, and page transitions create a polished browsing experience
**Depends on**: All previous phases (SEO wraps all content, transitions wrap all pages)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, LAND-04
**Success Criteria** (what must be TRUE):
  1. All pages have proper title tags, meta descriptions, and Open Graph data that render correctly when shared on social media
  2. Site generates a valid XML sitemap accessible at /sitemap.xml
  3. Site includes JSON-LD schema markup for a local photography business that validates in Google's Rich Results Test
  4. All portfolio images across all service pages have descriptive alt text
  5. User experiences smooth animated transitions when navigating between pages
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation & Design System | 4/4 | ✓ Complete | 2026-02-09 |
| 2. Landing Page | 3/3 | ✓ Complete | 2026-02-10 |
| 3. Service Pages & Lightbox | 3/3 | ✓ Complete | 2026-02-10 |
| 4. Contact & Conversion | 4/4 | ✓ Complete | 2026-02-10 |
| 5. Client Galleries | 2/2 | ✓ Complete | 2026-02-10 |
| 6. Blog Engine | 4/4 | ✓ Complete | 2026-02-10 |
| 7. Blog Discovery & Sharing | 3/3 | ✓ Complete | 2026-02-10 |
| 8. SEO, Transitions & Launch Readiness | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-09*
*Last updated: 2026-02-10 (Phase 7 complete)*
