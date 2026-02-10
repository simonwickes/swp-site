# Phase 2: Landing Page - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

A visually striking homepage that immediately showcases Simon's best photography and invites exploration. Hero imagery, featured work showcase, and loading states. Service pages with galleries are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Hero presentation
- Rotating slideshow (not single image or video)
- Slide/push transitions between images
- User controls: arrows + position dots (both visible)
- Timing: 4-5 seconds per slide before auto-advancing

### Featured work layout
- Masonry/Pinterest-style layout (variable height, flowing)
- 12-16 curated images from across service categories
- Subtle hover labels showing category name on each image
- Images link to their service category page

### Loading experience
- Hero slideshow: Solid color placeholder until images load
- Featured grid: Skeleton cards showing grid structure while loading

### Content & CTAs
- Hero overlay: Name + tagline ("Simon Wickes Photography" + short tagline)
- Overlay position: Bottom left (editorial feel)
- No CTA in hero itself — appears below hero after scrolling
- End of featured section: Two CTAs (explore services + get in touch)

### Claude's Discretion
- Click behavior for featured images (lightbox vs navigate to category)
- Image reveal animation style (fade, instant, etc.)
- Hero placeholder color (likely dark to match theme)
- Specific tagline wording
- Exact spacing and typography choices

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

*Phase: 02-landing-page*
*Context gathered: 2026-02-09*
