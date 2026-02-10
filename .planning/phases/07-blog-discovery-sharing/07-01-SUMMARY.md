---
phase: 07-blog-discovery-sharing
plan: 01
subsystem: blog-discovery
tags: [fuse.js, search-index, filter-pills, astro-endpoint]

dependency-graph:
  requires: [06-01, 03-01]
  provides: [search-index-endpoint, blog-discovery-bar-component]
  affects: [07-02, 07-03]

tech-stack:
  added: [fuse.js@7.x]
  patterns: [build-time-json-endpoint, filter-pill-ui]

key-files:
  created:
    - src/pages/api/posts.json.ts
    - src/components/blog/BlogDiscoveryBar.astro
  modified:
    - package.json

decisions:
  - id: "07-01-categories-from-services"
    description: "BlogDiscoveryBar imports services directly for default category pills, with optional prop override"
  - id: "07-01-tag-styling"
    description: "Tag pills use # prefix and border styling to visually distinguish from category pills"

metrics:
  duration: 2 minutes
  completed: 2026-02-10
---

# Phase 7 Plan 1: Search Index and Discovery Bar Summary

Fuse.js installed, build-time JSON search index generates at /api/posts.json with all blog post data, and BlogDiscoveryBar component renders search input + category/tag filter pills following ServiceNav pattern.

## What Was Done

### Task 1: Install Fuse.js and create search index endpoint
- Installed `fuse.js` as a dependency
- Created `src/pages/api/posts.json.ts` -- a static Astro endpoint that generates a JSON search index at build time
- Endpoint fetches all blog posts via `getCollection("blog")`, sorts by date descending, and maps each post to a search-friendly object with fields: id, title, category, categoryTitle, tags, date, excerpt
- categoryTitle resolved from `getServiceBySlug` for human-readable display names
- Verified: `dist/api/posts.json` generated at build with valid JSON containing 2 sample posts
- **Commit:** `99f06ab`

### Task 2: Create BlogDiscoveryBar component
- Created `src/components/blog/BlogDiscoveryBar.astro` with search input, filter pills, and results count
- Search input has `data-search-input` attribute and magnifying glass SVG icon
- "All" pill starts active with `bg-accent-500 text-surface-50` styling
- Category pills derived from services data import (default) or via props, each with `data-filter` and `data-filter-type="category"`
- Tag pills rendered with `#` prefix and border styling for visual distinction from categories, each with `data-filter` and `data-filter-type="tag"`
- Results count span with class `results-count` for JS population in Plan 03
- Follows ServiceNav `overflow-x-auto` hidden scrollbar pattern
- All interactivity deferred to Plan 03 client-side script
- **Commit:** `7b9130f`

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| BlogDiscoveryBar imports services directly for default categories | Satisfies key_link requirement while keeping the component self-contained; categories can still be overridden via optional prop |
| Tag pills use border + # prefix styling | Provides clear visual distinction between categories (solid background on hover) and tags (border style) in the unified pill row |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` completes without errors | PASS |
| `dist/api/posts.json` exists with valid JSON | PASS |
| JSON contains array with id, title, category, categoryTitle, tags, date, excerpt fields | PASS |
| `src/components/blog/BlogDiscoveryBar.astro` exists with search input + filter pills | PASS |
| Fuse.js in package.json dependencies | PASS |

## Next Phase Readiness

Plan 07-02 (ShareButtons component) can proceed independently.
Plan 07-03 (client-side search/filter engine) depends on this plan's outputs:
- `/api/posts.json` endpoint provides the data source for Fuse.js initialization
- `BlogDiscoveryBar.astro` provides the DOM elements (search input, filter pills, results count) that the client-side script will wire up
