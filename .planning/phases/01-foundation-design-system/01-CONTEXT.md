# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Site scaffolding with Astro + Tailwind v4, dark/light theming with toggle, responsive layout system, navigation to 8 service categories (grouped as People/Places/Things), and footer with social links and contact. Image optimization pipeline must be proven.

</domain>

<decisions>
## Implementation Decisions

### Visual Identity
- Typography: Warm and approachable feel — rounded, friendly letterforms (not cold/geometric)
- Primary accent color: Terracotta/rust — earthy orange-red, natural warmth
- Dark mode background: Charcoal/near-black — softer than pure black, easier on eyes
- Light mode background: Warm off-white — cream/ivory undertone, softer feel

### Navigation
- Header: Sticky/fixed, always visible at top
- Services organization: Grouped dropdown under "Services" with 3 groups:
  - **People**: Outdoor Portraits, Weddings, Events, Live Performances
  - **Places**: Landscape
  - **Things**: Commercial, Cars, Assignments
- Mobile navigation: Hamburger icon → slide-in panel from side

### Dark/Light Mode
- Default: Match system preference (fall back to dark if no preference)
- Toggle location: In header/navigation area
- Toggle style: Claude's discretion — pick something that fits the warm aesthetic
- Transition animation: Claude's discretion — smooth or instant as feels right

### Footer
- Content: Instagram social link, Contact page link, Copyright notice
- No exposed contact details (email/phone) — just link to contact page
- Layout style: Claude's discretion based on content needs (minimal is fine given limited content)

### Claude's Discretion
- Exact font pairings (display + body) within "warm/approachable" direction
- Specific terracotta/rust hex values and supporting palette
- Dark mode toggle icon/style
- Mode transition timing and easing
- Footer layout approach
- Spacing system and breakpoints

</decisions>

<specifics>
## Specific Ideas

- Design direction established earlier: "Modern, bold, warm aesthetic with pops of color. Approachable, friendly, professional — not stuffy or corporate."
- Photography should be front and center with minimal UI getting in the way
- The frontend-design skill is available for distinctive, production-grade implementation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-02-09*
