# Phase 7: Blog Discovery & Sharing - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable users to find specific blog content through search and filtering, and share posts on social media. The blog engine (content collections, listing, posts) exists from Phase 6. This phase adds discovery and sharing capabilities.

</domain>

<decisions>
## Implementation Decisions

### Search behavior
- Search scope: title, content, AND tags (full coverage)
- Real-time filtering as user types — no submit button needed
- Search input inline with filter pills as a unified discovery bar
- Highlight matching terms in post titles/excerpts when displaying results

### Filter presentation
- Clickable pills for categories and tags (consistent with ServiceNav pattern)
- Combined row — categories and tags mixed in one unified pill row
- Multi-select with AND logic — posts must match ALL selected filters
- "All" pill at start to clear all active filters

### Share buttons
- Platforms: Instagram, Facebook, X (Twitter)
- Include "Copy link" button for clipboard sharing
- Placement: end of post content, before related posts section
- Icon-only style — compact and minimal

### Empty/error states
- "No posts found" message with clear filters button
- Show "Showing X posts" count that updates in real-time with search/filters
- URL updates with search/filter params — shareable, bookmarkable filtered views

### Claude's Discretion
- Pagination behavior on filter change (reset vs maintain position)
- Exact highlight styling for search matches
- Debounce timing for real-time search (if needed for performance)
- Instagram share implementation (likely copy-link prompt since no direct share API)

</decisions>

<specifics>
## Specific Ideas

- Filter pills should follow the ServiceNav pattern already established in the codebase
- Multi-filter uses AND logic (narrowing), not OR (expanding)
- URL state enables sharing filtered views (e.g., "/blog?category=weddings&tag=tips")

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-blog-discovery-sharing*
*Context gathered: 2026-02-10*
