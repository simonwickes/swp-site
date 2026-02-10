# Phase 7: Blog Discovery & Sharing - Research

**Researched:** 2026-02-10
**Domain:** Client-side search/filtering for Astro static blog + social sharing
**Confidence:** HIGH

## Summary

This phase adds three capabilities to the existing blog engine: full-text search across posts, category/tag filtering with pill UI, and social share buttons. The blog engine from Phase 6 already has content collections, a paginated listing page (`[...page].astro`), individual post pages (`[id].astro`), and established component patterns. Phase 7's challenge is that all search and filter behavior must happen client-side since this is a static Astro site.

The standard approach is: (1) generate a JSON search index at build time via an Astro static endpoint, (2) use Fuse.js for client-side fuzzy search, (3) use vanilla JavaScript for filter pill toggling and DOM manipulation, (4) sync state to URL query params via `history.replaceState` for bookmarkable filtered views, and (5) use simple intent URLs for social sharing (no SDK/widget libraries needed).

Key discovery: Meta retired Facebook's embedded Like and Comment social plugins on February 10, 2026. However, the direct `facebook.com/sharer/sharer.php` URL-based sharing still works and is the recommended approach. Instagram has no web share URL -- the "Instagram" share button should copy the link to clipboard with a tooltip explaining to paste it on Instagram (matching the CONTEXT.md note about Instagram).

**Primary recommendation:** Use Fuse.js with a build-time JSON index for search, vanilla JS for filtering, simple share intent URLs for X/Facebook, and clipboard API for copy-link/Instagram.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Fuse.js | 7.1.0 | Client-side fuzzy search | Zero dependencies, ~5KB gzipped, works with static JSON index |
| Astro static endpoints | built-in | Build-time JSON search index | Generates /api/posts.json at build from content collections |
| URLSearchParams + history API | built-in | URL state sync | Native browser APIs, no dependencies |
| navigator.clipboard | built-in | Copy link to clipboard | Supported in all modern browsers since 2020 (Chrome 66+, Firefox 63+, Safari 13.1+) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Astro Content Collections | built-in | Source data for search index | Already set up in Phase 6 |
| date-fns | 4.x (installed) | Date formatting in filtered results | Already in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fuse.js | Pagefind | Pagefind is better for large sites (1000+ pages), but requires build integration; Fuse.js is simpler for ~20-50 posts |
| Fuse.js | MiniSearch | Similar capability, but Fuse.js has broader adoption (3400+ npm dependents) |
| Vanilla JS filtering | Preact/React island | Overkill for show/hide filtering; project uses vanilla JS pattern throughout |
| Intent URLs | ShareThis/AddThis | External widgets add tracking, dependencies, and styling conflicts |

**Installation:**
```bash
npm install fuse.js
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   ├── api/
│   │   └── posts.json.ts          # NEW: Build-time search index endpoint
│   └── blog/
│       ├── [...page].astro        # MODIFY: Add search/filter bar, client-side filtering
│       └── [id].astro             # MODIFY: Add share buttons after content
├── components/
│   └── blog/
│       ├── BlogDiscoveryBar.astro # NEW: Search input + filter pills
│       ├── ShareButtons.astro     # NEW: Social share buttons
│       ├── PostCard.astro         # EXISTING: May need data attributes for filtering
│       ├── PostListRow.astro      # EXISTING: May need data attributes for filtering
│       ├── Pagination.astro       # EXISTING: Hide during filtered/search view
│       ├── Sidebar.astro          # EXISTING: Unchanged
│       └── Prose.astro            # EXISTING: Unchanged
```

### Pattern 1: Build-Time Search Index via Static Endpoint
**What:** Generate a JSON file at build time containing searchable post data
**When to use:** Providing data for client-side Fuse.js search
**Example:**
```typescript
// src/pages/api/posts.json.ts
// Source: https://docs.astro.build/en/guides/endpoints/
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getServiceBySlug } from "@/data/services";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const searchData = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      category: post.data.category,
      categoryTitle: getServiceBySlug(post.data.category)?.title ?? post.data.category,
      tags: post.data.tags ?? [],
      date: post.data.date.toISOString(),
      // Include first ~200 chars of body for content search
      excerpt: post.body?.slice(0, 200) ?? "",
    }));

  return new Response(JSON.stringify(searchData), {
    headers: { "Content-Type": "application/json" },
  });
};
```

### Pattern 2: Client-Side Search with Fuse.js
**What:** Load search index, initialize Fuse.js, filter results on keyup
**When to use:** Real-time search as user types
**Example:**
```typescript
// Inside <script> tag on [...page].astro
// Source: https://www.fusejs.io/
import Fuse from "fuse.js";

interface PostIndex {
  id: string;
  title: string;
  category: string;
  categoryTitle: string;
  tags: string[];
  date: string;
  excerpt: string;
}

// Fetch the build-time generated index
const response = await fetch("/api/posts.json");
const posts: PostIndex[] = await response.json();

const fuse = new Fuse(posts, {
  keys: [
    { name: "title", weight: 2 },
    { name: "excerpt", weight: 1 },
    { name: "tags", weight: 1.5 },
  ],
  threshold: 0.3,        // Fairly strict matching
  includeMatches: true,   // Needed for highlight feature
  minMatchCharLength: 2,  // Ignore single-char matches
});

function search(query: string): PostIndex[] {
  if (!query.trim()) return posts;
  return fuse.search(query).map((result) => result.item);
}
```

### Pattern 3: Filter Pills Following ServiceNav Pattern
**What:** Clickable pill buttons for categories/tags, matching existing ServiceNav styling
**When to use:** Blog listing filter bar
**Example:**
```astro
<!-- BlogDiscoveryBar.astro -->
<!-- Following ServiceNav pattern from src/components/services/ServiceNav.astro -->
<div class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  <div class="flex items-center gap-1 py-2">
    <button
      data-filter="all"
      class="filter-pill whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors bg-accent-500 text-surface-50"
    >
      All
    </button>
    <!-- Category pills rendered from services data -->
    <!-- Tag pills rendered from unique tags across all posts -->
  </div>
</div>
```

### Pattern 4: URL State Synchronization
**What:** Keep search/filter state in URL query params for shareability
**When to use:** Every search or filter change
**Example:**
```typescript
// Source: native browser APIs
function updateUrlState(search: string, filters: string[]) {
  const url = new URL(window.location.href);

  if (search) {
    url.searchParams.set("q", search);
  } else {
    url.searchParams.delete("q");
  }

  // Clear old filter params
  url.searchParams.delete("category");
  url.searchParams.delete("tag");

  // Set active filters
  filters.forEach((f) => {
    // Determine if category or tag
    if (isCategory(f)) {
      url.searchParams.append("category", f);
    } else {
      url.searchParams.append("tag", f);
    }
  });

  history.replaceState({}, "", url.toString());
}

// On page load, read URL params to restore state
function restoreStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("q") ?? "";
  const categories = params.getAll("category");
  const tags = params.getAll("tag");
  // Apply search and filters...
}
```

### Pattern 5: Social Share Intent URLs
**What:** Simple links that open share dialogs on social platforms
**When to use:** Share buttons on blog post pages
**Example:**
```astro
<!-- ShareButtons.astro -->
---
interface Props {
  url: string;
  title: string;
}
const { url, title } = Astro.props;

const encodedUrl = encodeURIComponent(url);
const encodedTitle = encodeURIComponent(title);

// Share URLs
const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
---

<div class="flex items-center gap-3">
  <a href={xShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
    <!-- X icon SVG -->
  </a>
  <a href={fbShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
    <!-- Facebook icon SVG -->
  </a>
  <button data-share-instagram aria-label="Share on Instagram (copies link)">
    <!-- Instagram icon SVG -->
  </button>
  <button data-copy-link aria-label="Copy link">
    <!-- Link/clipboard icon SVG -->
  </button>
</div>
```

### Pattern 6: Search Match Highlighting
**What:** Wrap matching text in `<mark>` elements for visual highlighting
**When to use:** When displaying search results in post titles/excerpts
**Example:**
```typescript
// Utility for highlighting matched text
function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark class=\"bg-accent-100 dark:bg-accent-800/50 px-0.5 rounded\">$1</mark>");
}
```

### Anti-Patterns to Avoid
- **Loading all post content into the search index:** Only include title, tags, and excerpt (first ~200 chars). Full markdown bodies bloat the JSON and slow Fuse.js.
- **Using the Facebook SDK/widget:** The embedded Facebook social plugins were retired Feb 10, 2026. Use the sharer.php URL pattern instead.
- **Re-rendering the entire page on filter change:** Show/hide existing DOM elements rather than fetching new HTML. This is a static site.
- **Forgetting to debounce search input:** Without debounce, Fuse.js runs on every keystroke, which is fine for small datasets but poor practice. Use 200-300ms debounce.
- **Using IDs for pill buttons:** The project has an established pattern (03-03 decision) that components rendered multiple times must use class selectors, not IDs.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fuzzy text search | Custom string matching | Fuse.js | Handles typos, partial matches, weighted fields, match indices |
| URL query params | Manual string parsing | URLSearchParams API | Built-in, handles encoding, supports multiple values |
| Clipboard copy | document.execCommand('copy') | navigator.clipboard.writeText() | Modern API, Promise-based, deprecated alternative |
| Social sharing | Widget SDKs (ShareThis) | Simple intent URLs | Zero dependencies, no tracking, no CORS issues |
| Debouncing | setTimeout/clearTimeout | Simple debounce utility (3 lines) | Only 3 lines needed -- function wrapper with timer |

**Key insight:** The entire Phase 7 can be built with one small library (Fuse.js ~5KB) plus native browser APIs. No framework, no SDK, no server-side code needed beyond the build-time JSON endpoint.

## Common Pitfalls

### Pitfall 1: Search Index Too Large
**What goes wrong:** JSON file becomes 100KB+ slowing initial page load
**Why it happens:** Including full markdown body text in the search index
**How to avoid:** Include only title, tags, category, and a short excerpt (200 chars). The excerpt provides content searchability without bloat.
**Warning signs:** `/api/posts.json` over 50KB for <50 posts

### Pitfall 2: Pagination vs. Client-Side Filtering Conflict
**What goes wrong:** Astro's static pagination generates separate pages (/blog/2/, /blog/3/) but client-side filtering operates on a single page's posts only
**Why it happens:** Static pagination and client-side filtering are fundamentally different paradigms
**How to avoid:** When search/filters are active, hide pagination and show all matching posts from the search index. When no search/filters are active, show the normal paginated view. The search index contains ALL posts, not just the current page's posts.
**Warning signs:** Filtering shows results only from current page, missing posts from other pages

### Pitfall 3: Filter State Lost on Navigation
**What goes wrong:** User clicks a post from filtered results, presses back, filters are gone
**Why it happens:** Not restoring state from URL params on page load
**How to avoid:** On page load, read `window.location.search` and restore search/filter state. Use `history.replaceState` (not `pushState`) to avoid polluting browser history.
**Warning signs:** Back button doesn't restore filtered view

### Pitfall 4: AND Logic with Empty Intersection
**What goes wrong:** Selecting multiple filters returns zero results unexpectedly
**Why it happens:** AND logic is strict -- post must match ALL selected categories AND ALL selected tags
**How to avoid:** Since categories and tags are mixed in one row, decide: (a) treat categories as one group (OR within group) and tags as another (OR within group), then AND between groups, or (b) simpler: AND everything together but clearly label the "Showing X posts" count so users see the narrowing effect. The CONTEXT.md specifies AND logic, so show the count prominently and provide easy "clear all" via the "All" pill.
**Warning signs:** Users get confused when selecting 2 categories shows zero results (a post can only have one category)

### Pitfall 5: Instagram Share Misconception
**What goes wrong:** Building an Instagram share button that opens a broken URL
**Why it happens:** Instagram has no web share intent URL. It is a mobile-only photo/video platform.
**How to avoid:** The Instagram "share" button should copy the link to clipboard and show a tooltip like "Link copied! Paste on Instagram." This matches the CONTEXT.md suggestion. Alternatively, on mobile, use `navigator.share()` (Web Share API) which can invoke the native Instagram share sheet.
**Warning signs:** Instagram button links to a URL that doesn't work

### Pitfall 6: Facebook sharer.php Requires Open Graph Tags
**What goes wrong:** Facebook share shows wrong title/image/description
**Why it happens:** Facebook reads Open Graph meta tags from the shared URL, not from URL params
**How to avoid:** Ensure blog post pages have proper `og:title`, `og:description`, `og:image`, and `og:url` meta tags in the `<head>`.
**Warning signs:** Shared Facebook posts show generic site title instead of post title

### Pitfall 7: Search Highlights Breaking HTML
**What goes wrong:** `<mark>` tags injected into text break adjacent HTML
**Why it happens:** Using innerHTML with regex replacement on strings that may contain HTML entities
**How to avoid:** Only highlight plain text strings (titles, excerpts), never raw HTML. Use `textContent` to read, highlight, then set with `innerHTML` only on the highlighted text span.
**Warning signs:** Broken HTML rendering, visible tags in output

## Code Examples

Verified patterns from official sources:

### Debounce Utility
```typescript
// Simple debounce -- no library needed
function debounce(fn: Function, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

### Clipboard Copy with Feedback
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
async function copyToClipboard(text: string, button: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text);
    // Show feedback
    const originalLabel = button.getAttribute("aria-label");
    button.setAttribute("aria-label", "Copied!");
    button.classList.add("text-green-500");
    setTimeout(() => {
      button.setAttribute("aria-label", originalLabel ?? "Copy link");
      button.classList.remove("text-green-500");
    }, 2000);
  } catch {
    // Fallback: prompt user to copy manually
    prompt("Copy this link:", text);
  }
}
```

### Fuse.js Initialization with Astro Static Endpoint
```typescript
// Source: https://www.fusejs.io/ + https://docs.astro.build/en/guides/endpoints/
import Fuse from "fuse.js";

let fuse: Fuse<PostIndex>;
let allPosts: PostIndex[] = [];

async function initSearch() {
  const res = await fetch("/api/posts.json");
  allPosts = await res.json();

  fuse = new Fuse(allPosts, {
    keys: [
      { name: "title", weight: 2 },
      { name: "excerpt", weight: 1 },
      { name: "tags", weight: 1.5 },
    ],
    threshold: 0.3,
    includeMatches: true,
    minMatchCharLength: 2,
  });
}
```

### Filter + Search Combined Logic
```typescript
function getFilteredPosts(query: string, activeFilters: string[]): PostIndex[] {
  // Start with search results or all posts
  let results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : [...allPosts];

  // Apply AND filter logic
  if (activeFilters.length > 0) {
    results = results.filter((post) => {
      return activeFilters.every((filter) => {
        // Check if filter matches category or any tag
        return post.category === filter || post.tags.includes(filter);
      });
    });
  }

  return results;
}
```

### Rendering Filtered Results (DOM Approach)
```typescript
function renderResults(posts: PostIndex[], query: string) {
  const container = document.querySelector(".blog-results")!;
  const countEl = document.querySelector(".results-count")!;
  const paginationEl = document.querySelector(".blog-pagination")!;
  const noResultsEl = document.querySelector(".no-results")!;

  // Update count
  countEl.textContent = `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""}`;

  // Toggle pagination visibility (hide when filtering)
  const isFiltering = query.trim() || activeFilters.length > 0;
  paginationEl.classList.toggle("hidden", isFiltering);

  // Show/hide no results message
  noResultsEl.classList.toggle("hidden", posts.length > 0);

  // Render post cards
  // ... generate HTML from filtered PostIndex data
}
```

### X (Twitter) Share URL
```typescript
// Source: https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent
const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
// Opens X compose window with pre-filled text and URL
```

### Facebook Share URL
```typescript
// Note: Embedded plugin buttons retired Feb 10, 2026, but sharer.php URL still works
// Requires og: meta tags on the target page for proper preview
const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Facebook SDK/widget buttons | Direct sharer.php URL | Feb 10, 2026 | Embedded plugins retired; URL sharing still works |
| document.execCommand('copy') | navigator.clipboard.writeText() | ~2020 | Old API deprecated, new API is Promise-based |
| Twitter share URL | X intent URL (same format) | 2023 rebrand | URL format unchanged, domain still twitter.com/intent |
| Heavy share libraries (ShareThis) | Simple intent URLs | Ongoing trend | Lighter, no tracking, no CORS, no third-party deps |

**Deprecated/outdated:**
- Facebook Like/Comment embedded plugins: Retired Feb 10, 2026. Use sharer.php URL instead.
- document.execCommand('copy'): Deprecated. Use navigator.clipboard.writeText().
- Twitter share widget JS: Unnecessary. Simple intent URL works without any JavaScript SDK.

## Open Questions

Things that couldn't be fully resolved:

1. **Category Filter AND Logic with Single-Category Posts**
   - What we know: Posts have exactly one category. CONTEXT.md specifies AND logic for multi-select.
   - What's unclear: Selecting two categories with AND logic will always return zero results since a post can only be in one category.
   - Recommendation: Use OR logic within categories and AND between groups (categories OR, tags AND). Or: treat all pills as one group with AND logic but make it clear that selecting two categories returns empty -- the "Showing 0 posts" counter handles this. Planner should decide.

2. **Fuse.js Bundle Size**
   - What we know: Fuse.js 7.1.0 is the latest. Documentation says "lightweight" with zero dependencies. Bundlephobia page failed to return exact size.
   - What's unclear: Exact gzipped size (estimated ~5-6KB based on prior versions)
   - Recommendation: Install and verify. If unexpectedly large, the ESM build is smaller.

3. **Client-Side Rendering vs. Data Attribute Toggling**
   - What we know: Two approaches for showing filtered results: (a) toggle visibility on existing server-rendered cards via data attributes, or (b) render new HTML from the search index JSON.
   - What's unclear: The page only shows the current page of paginated posts (20 max). Search needs to show results from ALL posts.
   - Recommendation: Use approach (b) -- render from JSON index. This handles cross-page results. When no search/filter is active, show the original server-rendered paginated view. When active, replace with client-rendered results.

## Sources

### Primary (HIGH confidence)
- [Astro Static Endpoints](https://docs.astro.build/en/guides/endpoints/) - JSON endpoint pattern verified via WebFetch
- [Fuse.js Official](https://www.fusejs.io/) - API, options, keys/threshold configuration
- [Fuse.js Options Reference](https://www.fusejs.io/api/options.html) - threshold, includeMatches, minMatchCharLength defaults
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) - navigator.clipboard.writeText browser support
- [X Developer Docs](https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent) - Tweet intent URL format
- Existing codebase: ServiceNav.astro, ContactForm.astro, ThemeToggle.astro (verified JS patterns)

### Secondary (MEDIUM confidence)
- [Meta retiring Like/Comment plugins](https://www.techrepublic.com/article/news-meta-retires-like-button/) - Confirmed by multiple sources (TechRepublic, Engadget, Social Media Today)
- [Facebook sharer.php still works](https://gist.github.com/jawinn/8312196) - Multiple sources confirm URL sharing distinct from embedded plugins
- [Astro blog filtering tutorial](https://digital-expanse.com/tutorials/astro-blog-filters/) - Client-side filter pattern with data attributes
- [URLSearchParams + history API](https://gomakethings.com/how-to-update-the-url-of-a-page-without-causing-a-reload-using-vanilla-javascript/) - Standard browser API pattern

### Tertiary (LOW confidence)
- Fuse.js bundle size (~5-6KB gzipped) - Estimated from prior version data, could not verify 7.1.0 exact size
- Instagram share behavior - No official docs found; based on community consensus that no web share URL exists

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Fuse.js documented, Astro endpoints documented, native APIs well-supported
- Architecture: HIGH - Follows established project patterns (vanilla JS scripts, class selectors, data modules)
- Pitfalls: HIGH - Pagination/filter conflict is a known SSG challenge; Facebook retirement confirmed by multiple sources
- Share buttons: MEDIUM - X intent URL format confirmed; Facebook sharer.php likely still works but not officially re-confirmed post-retirement

**Research date:** 2026-02-10
**Valid until:** 60 days (all technologies are stable releases)
