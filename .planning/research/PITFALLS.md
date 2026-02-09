# Domain Pitfalls: Photography Portfolio Website

**Domain:** Photography portfolio and business website (Astro static site, Apache shared hosting)
**Researched:** 2026-02-09
**Confidence:** HIGH (multiple sources corroborating, verified against official Astro docs)

---

## Critical Pitfalls

Mistakes that cause rewrites, lost clients, or fundamental usability failure.

---

### Pitfall 1: Unoptimized Hero/Portfolio Images Destroying First Impressions

**What goes wrong:** The site's core value proposition -- showing Simon's work beautifully -- backfires because full-resolution photographs (3-8 MB each) are served directly to visitors. A portfolio page with 10-20 images weighs 30-80 MB. The site takes 8-15 seconds to load on mobile. Potential clients leave before seeing a single photograph.

**Why it happens:** Photographers resist compression because they see quality loss that general users would never notice. The instinct is "my work must look perfect," leading to serving print-resolution files on screens that display at 1920px or less. Additionally, developers may skip optimization tooling during early development and forget to add it later.

**Consequences:**
- Google reports 53% of users leave if load time exceeds 3 seconds
- LCP (Largest Contentful Paint) fails -- Google penalizes in search rankings
- The very audience you need to impress (potential clients on mobile) bounces immediately
- Over 70% of photography site visitors arrive on mobile devices
- Shared hosting bandwidth limits may be hit faster

**Prevention:**
1. Establish image budget early: hero images under 200 KB, gallery thumbnails under 100 KB, full-view images under 400 KB
2. Use Astro's built-in `<Image />` and `<Picture />` components for all images in `src/` -- they generate WebP/AVIF with responsive `srcset` at build time
3. Never serve portfolio images from `public/` (Astro does not optimize `public/` images at all)
4. Prepare source images at 2x display resolution maximum (e.g., 3840px wide for full-width hero on 1920px screens)
5. Use quality setting of 75-80 for WebP -- visually indistinguishable from higher on screen
6. Implement lazy loading for all images except the first visible (hero/above-fold)
7. Set explicit `width` and `height` on all `<Image />` components to prevent CLS

**Detection:**
- Run Lighthouse on every page during development; LCP over 2.5s is a red flag
- Check built output file sizes in `dist/_astro/` -- any image over 400 KB needs investigation
- Test on throttled mobile connection (Chrome DevTools: Slow 3G)

**Phase relevance:** Must be addressed in the very first development phase. Image pipeline is foundational -- retrofitting it is painful.

**Confidence:** HIGH -- Astro official docs confirm `<Image />` behavior, multiple photography industry sources cite the 3-second threshold and 70%+ mobile stat.

---

### Pitfall 2: Ignoring Mobile-First for an Image-Heavy Site

**What goes wrong:** The site is designed and developed desktop-first with large grid layouts, wide hero banners, and hover-dependent interactions. On mobile (the majority of traffic), images overflow, navigation is unusable, galleries feel cramped, and the contact form is hard to fill out. The "dark mode toggle" might be invisible on small screens.

**Why it happens:** Developers and photographers review work on large desktop monitors. The desktop experience naturally gets the most attention because that is where images look most impressive. Mobile is treated as "it'll just reflow."

**Consequences:**
- 70%+ of visitors see a broken or degraded experience
- Touch targets too small for gallery navigation
- Horizontal scrolling on service pages
- Contact form abandonment (hard to type on mobile with poorly sized inputs)
- Google's mobile-first indexing penalizes desktop-only optimization

**Prevention:**
1. Design mobile breakpoint first, then scale up to desktop
2. Set responsive breakpoints early: 320px (minimum), 768px (tablet), 1024px+ (desktop)
3. Test every page on actual mobile device, not just Chrome DevTools resize
4. Ensure touch targets are minimum 44x44px (Apple HIG) / 48x48px (Material Design)
5. Make contact form inputs full-width on mobile with appropriate input types (`type="tel"`, `type="email"`)
6. Gallery grid: 1 column on mobile, 2 on tablet, 3-4 on desktop
7. Navigation: hamburger menu on mobile with full-screen overlay, not a tiny dropdown

**Detection:**
- Chrome DevTools responsive mode on every page
- Test on actual iPhone and Android device
- Check Google Search Console "Mobile Usability" report post-launch

**Phase relevance:** Responsive layout must be the foundation from phase 1. Not a polish step.

**Confidence:** HIGH -- industry standard best practice, verified by multiple sources.

---

### Pitfall 3: Astro Image Pipeline Misconfiguration for Static Output

**What goes wrong:** Images placed in `public/` directory are never processed by Astro's image optimization. Alternatively, images in `src/` trigger Sharp processing at build time, but with 200+ portfolio images across 8 service categories, builds take 15-30 minutes. Or worse: the developer uses `<img>` tags instead of `<Image />` components, bypassing optimization entirely.

**Why it happens:** Astro has two distinct image paths (`src/` vs `public/`) with fundamentally different behavior, and the documentation buries this distinction. Newcomers to Astro often put images in `public/` because it "just works" without imports. The build-time cost of processing many images only becomes apparent later.

**Consequences:**
- `public/` images: no WebP/AVIF generation, no responsive srcset, no compression -- defeating the entire optimization strategy
- `src/` images without caching: every build reprocesses every image from scratch
- Mixed approach: inconsistent image quality and formats across pages
- Build times that make iterative development painful

**Prevention:**
1. All portfolio/content images go in `src/assets/images/` (or `src/content/` alongside markdown), NOT in `public/`
2. Only put truly static assets in `public/` (favicon, robots.txt, site manifest)
3. Preserve Astro's image cache between builds (default: `node_modules/.astro/`)
4. Pre-optimize source images before adding to project (resize to max 3840px wide, strip EXIF data except copyright)
5. Use `<Image />` component for all image rendering, never raw `<img>` for content images
6. For the 8 service category pages, organize images in `src/assets/services/{category}/` for clear structure
7. Consider pre-generating optimized images externally if build times exceed 5 minutes

**Detection:**
- Check `dist/` output: are there `.webp` files alongside originals? If not, optimization is not running
- Monitor `npm run build` time -- over 3 minutes for this project size suggests a problem
- Search codebase for raw `<img` tags that should be `<Image` components

**Phase relevance:** Image pipeline architecture must be decided in phase 1 and enforced throughout. Changing from `public/` to `src/` late means reimporting every image.

**Confidence:** HIGH -- verified against Astro official documentation at docs.astro.build/en/guides/images/.

---

### Pitfall 4: Third-Party Gallery Integration Becoming a UX Black Hole

**What goes wrong:** The client gallery service (Pixieset, Pic-Time, CloudSpot, ShootProof, etc.) is linked via a raw external URL or embedded via iframe, creating a jarring transition. The gallery looks completely different from the main site -- different fonts, different colors, different navigation. Clients feel like they left the photographer's site. Or: the gallery embed loads slowly, adds layout shifts, and pulls in heavy third-party JavaScript.

**Why it happens:** Gallery services are designed to be standalone platforms, not white-label embeds. Their customization options are limited (usually logo, accent color, maybe background). Photographers choose a gallery service based on features (proofing, downloads) without evaluating how it integrates visually with their website.

**Consequences:**
- Broken brand experience: professional site transitions to generic-looking gallery
- Third-party JavaScript can add 500 KB-2 MB to page weight if embedded
- iframe embeds cause CLS (layout shift) and are not responsive by default
- Password-protected gallery links may confuse clients expecting site-integrated access
- If gallery service changes pricing or shuts down, all client links break

**Prevention:**
1. Choose gallery service early and evaluate its embed/customization options BEFORE building the site
2. Accept that the gallery will be a separate experience -- link to it cleanly rather than fight an iframe embed
3. Create a dedicated "Client Gallery" page on the main site that explains the process and links to the external gallery
4. Match the gallery service's customization (colors, logo) as closely as possible to the main site
5. Use a subdomain or custom domain feature if the gallery service offers it (e.g., `galleries.simonwickes.com`)
6. Do NOT embed gallery iframes on the main site -- they are performance killers and rarely responsive
7. Document the gallery service choice in project decisions so it can be re-evaluated if terms change

**Detection:**
- Click through from site to gallery on mobile -- does it feel seamless or jarring?
- Measure page weight of any page with gallery embed -- third-party scripts over 200 KB are a warning
- Check gallery service's uptime history and pricing stability

**Phase relevance:** Gallery service selection should happen in planning/phase 1. Visual alignment should happen alongside design work. Integration page built in the content phase.

**Confidence:** MEDIUM -- based on community experience reports and gallery service documentation. Specific integration quality depends on which service is chosen.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or degraded user experience.

---

### Pitfall 5: Over-Curating vs Under-Curating Portfolio Content

**What goes wrong:** Two failure modes:
- **Over-curating:** Only 3-5 images per service category, making the photographer look inexperienced or making clients uncertain about style consistency.
- **Under-curating:** 50-100 images per category, creating endless scroll pages that overwhelm visitors. Nobody scrolls through 100 images; they leave after 15-20.

**Why it happens:** Photographers either cannot choose (everything is their "best work") or are too critical (nothing is good enough). There is no objective standard for "how many images per category."

**Prevention:**
1. Target 12-20 images per service category (industry consensus from multiple photography business sources)
2. Select for variety within each category: different lighting, compositions, subjects
3. Lead with the 3 strongest images (they may be all a visitor sees on mobile before deciding)
4. Create a separate "featured" selection for the homepage hero/grid (6-8 total across all categories)
5. Get a second opinion from someone who is NOT a photographer -- they represent the client perspective
6. Rotate content quarterly to keep the site fresh (Astro markdown makes this easy)

**Detection:**
- Count images per service page: under 8 feels sparse, over 25 feels overwhelming
- Watch analytics for service page bounce rates post-launch

**Phase relevance:** Content selection should happen in parallel with design, not crammed into the final phase.

**Confidence:** MEDIUM -- based on photography business advice from Format, 500px, and ForegroundWeb. Exact numbers vary by source but 12-20 range is consistent.

---

### Pitfall 6: Neglecting Local SEO and Structured Data

**What goes wrong:** The site launches with beautiful images but zero local SEO signals. No schema markup, no Google Business Profile connection, no location-specific content. The site is invisible for searches like "photographer near me" or "wedding photographer [city]." Meanwhile, competitors with worse portfolios but better SEO rank above Simon.

**Why it happens:** SEO feels like a separate project and gets deferred to "after launch." Schema markup is technical and unfamiliar. Photographers focus on visual quality (which is correct for the portfolio) but forget that Google cannot "see" photographs -- it relies on text, alt attributes, and structured data.

**Consequences:**
- Invisible in local search results where clients actually look
- No rich snippets in search results (no star ratings, no business info card)
- Images not appearing in Google Image search (missing alt text, missing schema)
- Competitors with proper LocalBusiness schema dominate the map pack

**Prevention:**
1. Implement `PhotographyBusiness` or `LocalBusiness` schema markup on every page (JSON-LD in `<head>`)
2. Write descriptive, keyword-rich alt text for every portfolio image (not just "wedding photo" but "bride and groom first dance at [Venue], [City]")
3. Include location naturally in page titles, meta descriptions, and headings (e.g., "[City] Wedding Photographer")
4. Create a proper `<title>` and `<meta name="description">` for every page -- not just the homepage
5. Add OpenGraph and Twitter Card meta tags for social sharing (these drive referral traffic)
6. Submit sitemap to Google Search Console immediately after launch
7. Ensure Google Business Profile links to the new site

**Detection:**
- Run Google Rich Results Test on key pages
- Search for "photographer [city]" and check if site appears (may take weeks after launch)
- Validate schema with Schema.org validator

**Phase relevance:** SEO foundations (schema, meta tags, alt text strategy) should be built into templates from the start. Content-level SEO (specific alt text, descriptions) happens during content entry.

**Confidence:** HIGH -- Google's own documentation confirms structured data impact. Schema.org vocabulary is standardized. Multiple SEO-for-photographers guides corroborate.

---

### Pitfall 7: Font Loading Causing Flash of Invisible/Unstyled Text

**What goes wrong:** Custom web fonts (the "modern, bold, warm" aesthetic) cause either FOIT (Flash of Invisible Text -- text invisible for 1-3 seconds while font loads) or FOUT (Flash of Unstyled Text -- text visibly shifts from system font to custom font). On image-heavy pages, this compounds with image loading to create a visually chaotic first-load experience.

**Why it happens:** Custom fonts are loaded from Google Fonts or as web font files without proper loading strategy. Default browser behavior hides text until the font loads (FOIT), which is particularly bad for a business site where the photographer's name and services should be immediately visible.

**Prevention:**
1. Self-host fonts (WOFF2 format) rather than loading from Google Fonts CDN -- eliminates a DNS lookup and third-party dependency
2. Limit to 2 font families maximum, with 2-3 weights each
3. Use `font-display: swap` in `@font-face` declarations so text is always visible
4. Preload the primary heading font: `<link rel="preload" href="/fonts/heading.woff2" as="font" type="font/woff2" crossorigin>`
5. Define fallback font stack that closely matches the custom font metrics to minimize FOUT visual shift
6. Subset fonts to include only needed characters (Latin, basic punctuation) using tools like `glyphhanger`

**Detection:**
- Throttle network to Slow 3G in DevTools and reload -- is text invisible for more than 0.5s?
- Check Lighthouse "Ensure text remains visible during webfont load" audit
- Look for CLS attributed to font swap in Chrome Performance tab

**Phase relevance:** Font strategy should be decided during design/theming phase and implemented correctly from the start.

**Confidence:** HIGH -- font-display behavior is a web standard, WOFF2 compression benefits are well-documented.

---

### Pitfall 8: Contact Form on Static Site -- Spam, Reliability, and UX

**What goes wrong:** The contact form either (a) doesn't work because there is no server-side processing on static hosting, (b) relies on a free-tier third-party service that rate-limits or goes down, or (c) works but gets flooded with spam within weeks of launch, burying real client inquiries.

**Why it happens:** Static sites cannot process form submissions server-side. Developers add a third-party form handler (Formspree, Netlify Forms, etc.) but forget that Apache shared hosting has no Netlify Forms equivalent. The spam problem is underestimated because bots find contact forms quickly.

**Consequences:**
- Lost client inquiries (the primary conversion action for a photography business)
- Spam overload making it hard to find real inquiries
- Form service downtime = invisible loss of leads
- Client-facing error messages if the service fails

**Prevention:**
1. Choose a reliable form backend that works with static sites: Formspree, FormSubmit, Basin, or a lightweight PHP script on Apache (since InMotion shared hosting supports PHP)
2. Implement honeypot field (hidden field that bots fill, humans don't) -- this catches most automated spam
3. Add client-side validation for email format and required fields
4. Consider lightweight CAPTCHA (hCaptcha is privacy-friendly) if spam becomes a problem post-launch
5. Set up email notifications for form submissions so inquiries are not missed
6. Test the form submission flow end-to-end on mobile before launch
7. Since Simon is on Apache shared hosting with PHP support, a simple PHP mail script may be the most reliable option -- no third-party dependency

**Detection:**
- Submit a test form from mobile every week
- Monitor the email inbox for form notifications
- If using a third-party: check their status page and plan for what happens if they go down

**Phase relevance:** Contact form is a core conversion element. Should be implemented and tested in the main build phase, not left for polish.

**Confidence:** HIGH -- static site form limitations are well-documented. PHP availability on InMotion shared hosting is standard.

---

### Pitfall 9: Dark Mode Implementation Breaking Image Presentation

**What goes wrong:** The dark mode toggle changes background colors but creates problems with image presentation. Images with white or light borders look harsh against dark backgrounds. Images shot in bright/high-key style appear to "glow" against dark surrounds. The visual hierarchy that works in light mode breaks in dark mode. Or worse: the toggle state is not persisted, so the page flashes from default to preferred mode on every navigation.

**Why it happens:** Dark mode is treated as a CSS variable swap without considering its impact on the primary content (photographs). Bright images on dark backgrounds create extreme contrast that is fatiguing. Additionally, "dark mode magnifies design mistakes -- contrast issues that might be acceptable in light mode become glaring problems in dark mode."

**Prevention:**
1. Default to dark mode for a photography site -- dark backgrounds are the industry standard because they make images pop (galleries, cinemas, and photo exhibitions all use dark surrounds)
2. If offering a toggle, test every service category page in both modes with actual portfolio images
3. Add subtle padding/border around images in dark mode (1-2px dark gray border or slight box shadow) to separate light images from dark UI
4. Persist theme preference in `localStorage` and apply it before first paint (inline script in `<head>`) to prevent flash
5. Use `prefers-color-scheme` media query to detect system preference as default
6. Avoid pure black (#000) backgrounds -- use dark gray (#111, #1a1a1a) for softer contrast
7. Ensure text contrast meets WCAG 4.5:1 ratio in both modes

**Detection:**
- Load a high-key (bright/white) image on a dark mode page -- does it feel jarring?
- Toggle between modes -- is there a flash of the wrong theme?
- Run WCAG contrast checker on both modes

**Phase relevance:** Design system/theming phase. Must be tested with real images, not placeholder content.

**Confidence:** MEDIUM-HIGH -- dark mode UX principles are well-established. Photography-specific recommendation (default dark) is consistent across portfolio site examples.

---

### Pitfall 10: Deployment to Apache Shared Hosting Without Caching/Compression

**What goes wrong:** The Astro build produces a beautiful `dist/` directory with optimized images and minified assets, but the Apache shared hosting serves them without proper cache headers or gzip compression. Every visit re-downloads everything. The site is "fast" on first build check but slow for every real user because Apache's default configuration on shared hosting is minimal.

**Why it happens:** Developers test locally (fast) or assume the build output is sufficient. Shared hosting providers ship with conservative default configurations. Without an `.htaccess` file configuring caching and compression, Apache serves static files with no `Cache-Control` headers and no gzip.

**Prevention:**
1. Create a `.htaccess` file in the `public/` directory (Astro copies it to `dist/` root) with:
   - `mod_expires` rules: images cached 1 year, CSS/JS cached 1 year (they have hash-based filenames from Astro), HTML cached 1 hour
   - `mod_deflate` rules: gzip compression for HTML, CSS, JS, SVG, JSON
   - `mod_headers` rules: proper `Cache-Control` headers
2. Astro's build output includes hashed filenames for CSS/JS (`_astro/style.abc123.css`), so aggressive caching is safe -- file changes produce new hashes
3. Set up a deployment script (rsync or FTP) that preserves the `.htaccess` file
4. IMPORTANT: rsync with `--delete` can destroy `.htaccess` and other server-essential files -- use `--exclude=.htaccess` or place it in the build output
5. Test with GTmetrix or PageSpeed Insights after deployment to verify caching headers

**Detection:**
- Check response headers in DevTools Network tab: `Cache-Control` should be present on all assets
- GTmetrix "Serve static assets with an efficient cache policy" audit
- First visit vs. second visit should show dramatically different load times (cached assets)

**Phase relevance:** Deployment configuration should be set up in the infrastructure phase and tested before content is finalized.

**Confidence:** HIGH -- Apache .htaccess caching is well-documented. InMotion hosting supports mod_expires and mod_deflate.

---

## Minor Pitfalls

Mistakes that cause annoyance, look unprofessional, or create small UX friction.

---

### Pitfall 11: Blog Search on Static Site Being More Complex Than Expected

**What goes wrong:** "Blog search functionality" is listed as a requirement, but on a static site there is no server to query. The developer either: (a) builds a slow, naive client-side search that loads all blog content on every search page visit, (b) defers it indefinitely because it seems hard, or (c) adds a heavy search library (Algolia, ElasticSearch) that is overkill for a markdown blog with 20-50 posts.

**Why it happens:** Search is server-side in most people's mental model. Static site search requires a build-time index and client-side search library, which is a different paradigm.

**Prevention:**
1. Use a lightweight client-side search approach: generate a JSON search index at build time using Astro's static endpoints
2. Libraries like Fuse.js (fuzzy search, ~25 KB) or Pagefind (Astro-integrated, generates index automatically) are purpose-built for this
3. Pagefind is the recommended choice for Astro -- it generates a search index at build time and provides a lightweight UI widget
4. Do NOT load the search index on every page -- only load it when the user navigates to the blog or activates search
5. For a blog with under 100 posts, the search index will be tiny (under 50 KB) -- this is a non-issue for performance

**Detection:**
- Test search with 10+ blog posts to ensure it returns relevant results
- Check if the search index is being loaded on non-blog pages (it should not be)

**Phase relevance:** Blog search can be implemented after the core blog is working. It is a polish feature, not foundational.

**Confidence:** MEDIUM-HIGH -- Pagefind integration with Astro is well-documented in community guides. Fuse.js is a proven option.

---

### Pitfall 12: Missing or Poor Image Alt Text Across 100+ Portfolio Images

**What goes wrong:** Alt text is either completely absent (accessibility failure, SEO penalty), generic ("photo1.jpg", "image"), or auto-generated garbage. With 8 service categories and 12-20 images each, that is 96-160 images that each need meaningful alt text. This is tedious, so it gets skipped.

**Why it happens:** Alt text is invisible to sighted users, so it feels low-priority. Writing good alt text for 100+ photos is genuinely time-consuming. Astro's `<Image />` component requires alt text (throws an error without it), but developers may just put empty strings to silence the warning.

**Prevention:**
1. Astro enforces alt text on `<Image />` -- use this as a quality gate, never use `alt=""`
2. Create a template for alt text: "[Subject] [Action/Context] at [Location], [City] - [Photography type] by Simon Wickes"
3. Batch the alt text writing with the content curation phase -- write alt text when selecting images, not as an afterthought
4. Alt text serves double duty: accessibility AND SEO. "Bride and groom first dance at historic barn venue, [City]" helps rank for "[City] wedding photographer"
5. For the landscape portfolio category, alt text is especially important as these images may appear in Google Image search

**Detection:**
- Astro build will error if `<Image />` has no `alt` prop -- but check for `alt=""` which passes silently
- Run aXe or WAVE accessibility checker on deployed pages
- Search codebase for `alt=""` -- each one needs real text

**Phase relevance:** Alt text should be written during the content entry phase alongside image curation.

**Confidence:** HIGH -- Astro's alt text requirement is documented in official docs. SEO impact of alt text is well-established.

---

### Pitfall 13: Choosing "Cool" Over "Clear" in Navigation and Service Categories

**What goes wrong:** Service categories get renamed to creative/artistic names that clients do not understand. "Assignments" is already ambiguous -- but other common sins include renaming "Weddings" to "Love Stories" or "Commercial" to "Brand Narratives." The navigation prioritizes aesthetic over wayfinding.

**Why it happens:** Photographers are creative professionals and want their site to reflect their artistic identity. Navigation labels feel like another creative opportunity. But potential clients scanning the site on mobile need to find "weddings" in under 2 seconds.

**Prevention:**
1. Use plain, searchable labels for primary navigation: Weddings, Portraits, Commercial, Events, etc.
2. Reserve creative language for page headings and descriptions, not navigation
3. Clarify "Assignments" -- it is the least self-explanatory category. Consider "Location Shoots" or add a subtitle
4. Keep primary navigation to 5-7 items maximum. With 8 service categories plus Blog, About, Contact, and Gallery, the navigation has 12+ items -- this needs a clear hierarchy
5. Group services under a "Services" or "Portfolio" dropdown rather than listing all 8 in top-level nav
6. Test navigation labels with someone unfamiliar with the business -- can they find "wedding photos" in 3 seconds?

**Detection:**
- Count nav items: more than 7 top-level items is a warning
- Ask a non-photographer friend to find a specific service -- time them

**Phase relevance:** Navigation architecture should be finalized during design phase, before building page templates.

**Confidence:** HIGH -- UX research on navigation clarity is extensive and well-established.

---

### Pitfall 14: Not Planning Content Entry Effort for 8 Service Categories

**What goes wrong:** The development work is done, but filling 8 service category pages with curated images, descriptions, and metadata takes far longer than expected. With a 3-week timeline, this can consume the final week entirely, leaving no time for testing, polish, or deployment fixes.

**Why it happens:** Content entry is treated as "just uploading files" but actually involves: selecting images, writing descriptions, writing alt text, ordering/sequencing images, writing page copy for each service, and ensuring visual consistency across categories.

**Consequences:**
- Timeline overrun as content entry takes 2-3x longer than estimated
- Rushed content: poor alt text, inconsistent descriptions, bad image selection
- Launch delayed or launched with placeholder content (looks unprofessional)

**Prevention:**
1. Start content preparation NOW -- in parallel with design and development
2. Create a content spreadsheet: for each service category, list selected images, their file names, alt text, and ordering
3. Budget at least 2-3 hours per service category for image selection, alt text, and copy writing
4. Have images pre-processed (resized, renamed) before the site templates are ready to receive them
5. Write blog seed content (2-3 posts) early so the blog does not launch empty
6. Treat content entry as a project phase, not a task within a phase

**Detection:**
- Two weeks in with zero content prepared = critical risk to timeline
- Content spreadsheet incomplete one week before launch = problem

**Phase relevance:** Content preparation should start in week 1, running parallel to all other phases. It is the critical path for a 3-week timeline.

**Confidence:** HIGH -- this is consistently cited as the number-one reason photography website projects overshoot their timelines.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Design/Theming | Dark mode breaking image presentation (#9) | Default to dark, test with real images in both modes |
| Design/Theming | Font loading FOIT/FOUT (#7) | Self-host WOFF2, preload heading font, `font-display: swap` |
| Design/Theming | Navigation overload with 8 services (#13) | Group under "Portfolio" dropdown, 5-7 top-level items max |
| Image Pipeline | Images in `public/` not optimized (#3) | All content images in `src/assets/`, never `public/` |
| Image Pipeline | Unoptimized images destroying load time (#1) | Image budget: hero <200KB, thumb <100KB, full <400KB |
| Image Pipeline | Build time explosion with 200+ images (#3) | Preserve image cache, pre-optimize source images |
| Content Creation | Under/over-curating portfolio (#5) | 12-20 images per category, lead with 3 strongest |
| Content Creation | Missing alt text on 100+ images (#12) | Write alt text during image selection, not after |
| Content Creation | Content entry consuming the timeline (#14) | Start content prep week 1, budget 2-3 hours per category |
| Gallery Integration | Jarring third-party transition (#4) | Accept external link, match colors/logo, dedicated bridging page |
| Contact Form | Static site form limitations and spam (#8) | PHP script on Apache or reliable third-party, honeypot field |
| Blog | Search being harder than expected (#11) | Use Pagefind, build-time index, lazy-load search UI |
| SEO | Missing schema and local signals (#6) | JSON-LD PhotographyBusiness schema in templates from day 1 |
| Deployment | No caching on Apache shared hosting (#10) | `.htaccess` with mod_expires, mod_deflate in `public/` directory |
| Deployment | rsync --delete destroying .htaccess (#10) | Exclude .htaccess from deletion or include in build output |
| Mobile | Desktop-first development (#2) | Mobile-first CSS, test on real devices, 44px touch targets |

---

## The Three-Week Timeline Risk Matrix

Given the compressed 3-week timeline, these pitfalls have outsized impact:

| Risk | Impact if Hit | Likelihood | Mitigation Priority |
|---|---|---|---|
| Content not ready at integration time (#14) | Launch delay | HIGH | Start immediately, parallel track |
| Image pipeline misconfigured (#1, #3) | Slow site, rework | MEDIUM | Establish in first 2 days |
| Gallery service not chosen (#4) | Blocked integration | MEDIUM | Decide in week 1 |
| No caching/compression on hosting (#10) | Slow for all users | LOW (easy fix) | 30 min task, do not forget |
| SEO foundations skipped (#6) | Invisible to search | MEDIUM | Build into templates, not bolt-on |
| Contact form untested (#8) | Lost leads | LOW | Test end-to-end before launch |

---

## Sources

### Official Documentation (HIGH confidence)
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) -- image component behavior, `src/` vs `public/` distinction, responsive images
- [Astro Image Service Reference](https://docs.astro.build/en/reference/image-service-reference/) -- Sharp processing, cache behavior

### Photography Industry Sources (MEDIUM-HIGH confidence)
- [Format: 8 Biggest Portfolio Mistakes](https://www.format.com/magazine/resources/photography/8-mistakes-build-portfolio-website-photography) -- curation, presentation
- [ForegroundWeb: 60+ Photography Website Mistakes](https://www.foregroundweb.com/photography-website-mistakes/) -- comprehensive mistake catalogue
- [Flothemes: Top 7 Speed Issues on Photography Sites](https://flothemes.com/top-speed-issues-photography-sites/) -- image sizes, LCP, CLS benchmarks
- [Digital Photography School: 7 Deadly Website Mistakes](https://digital-photography-school.com/7-deadly-mistakes-you-might-be-making-on-your-photography-website/) -- contact info, autoplay, stock images
- [500px: 8 Portfolio Website Mistakes](https://iso.500px.com/eight-mistakes-you-might-be-making-with-your-portfolio-website/) -- curation, sequencing

### Performance and SEO Sources (MEDIUM-HIGH confidence)
- [Hostinger: Image Optimization 2026](https://www.hostinger.com/tutorials/complete-guide-to-image-optimization) -- formats, compression
- [Request Metrics: High Performance Images 2026](https://requestmetrics.com/web-performance/high-performance-images/) -- WebP/AVIF, srcset
- [NitroPack: Core Web Vitals Metrics 2026](https://nitropack.io/blog/most-important-core-web-vitals-metrics/) -- LCP, CLS thresholds
- [Google: Core Web Vitals Documentation](https://developers.google.com/search/docs/appearance/core-web-vitals) -- official thresholds

### Dark Mode and UX Sources (MEDIUM confidence)
- [Smashing Magazine: Inclusive Dark Mode 2025](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) -- accessibility, contrast
- [WebWave: Dark Mode Trends and Mistakes](https://webwave.me/blog/dark-mode-design-trends) -- common dark mode errors

### Font and Deployment Sources (MEDIUM confidence)
- [GTmetrix: Serve Static Assets with Efficient Cache Policy](https://gtmetrix.com/serve-static-assets-with-an-efficient-cache-policy.html) -- .htaccess caching
- [DreamHost: Cache with .htaccess](https://help.dreamhost.com/hc/en-us/articles/216363157-Cache-a-website-with-an-htaccess-file) -- Apache cache configuration
- [Ramotion: Optimizing Web Fonts](https://www.ramotion.com/blog/optimizing-web-fonts-for-performance/) -- WOFF2, font-display strategies
