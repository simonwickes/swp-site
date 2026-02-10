# Phase 3: Service Pages & Lightbox - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

8 service category pages (Outdoor Portraits, Weddings, Commercial, Landscape, Cars, Assignments, Events, Live Performances) with curated gallery grids and full-screen lightbox viewer. Users browse photography by category, view images full-size, and navigate to contact. Service descriptions and CTAs drive conversion.

</domain>

<decisions>
## Implementation Decisions

### Gallery Layout
- Masonry grid style (Pinterest-style staggered layout, natural aspect ratios)
- Column breakpoints: 1 column mobile → 2 columns tablet → 4 columns desktop
- Subtle zoom effect on hover to indicate interactivity (no text overlay)

### Lightbox Experience
- Controls show on hover/movement, fade out when idle
- No image info displayed (no captions, no count) — immersive image-only experience
- Close via X button or Escape key only — no backdrop click (prevents accidental close)

### Service Page Structure
- Top hero section with service title and description
- CTA button ("Contact me") in hero section, visible immediately
- Horizontal service nav bar for quick switching between all 8 categories

### Image Sequencing
- Best images first — strongest work at top, then varied throughout
- 15-20 curated images per gallery
- Mix portrait and landscape orientations for visual variety
- Allow image crossover — strong images can appear in multiple relevant categories

### Claude's Discretion
- Image sizing in masonry (consistent width vs mixed/spanning sizes)
- Lightbox background style (solid black vs dark blur)
- Whether hero section includes a featured image or text-only

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-service-pages-lightbox*
*Context gathered: 2026-02-09*
