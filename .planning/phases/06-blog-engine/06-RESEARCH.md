# Phase 6: Blog Engine - Research

**Researched:** 2026-02-10
**Domain:** Astro Content Collections + Markdown Blog
**Confidence:** HIGH

## Summary

This phase implements a blog engine for a photography portfolio site using Astro 5.17's content collections. The decisions in CONTEXT.md define a specific layout: 3x2 card grid for recent posts, simple list rows for older posts, numbered pagination (20/page), sticky sidebar with author info and related posts, and optional featured images with relative date formatting.

The standard approach for Astro blogs is content collections with the `glob()` loader, Zod schema validation, and the `@tailwindcss/typography` plugin for prose styling. The project already has the foundation (Tailwind v4, TypeScript, Sharp image pipeline) and established patterns (data modules, component structure) that this phase should follow.

**Primary recommendation:** Use Astro content collections with `glob()` loader, `@tailwindcss/typography` for prose styling, and the established data module pattern for author configuration.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro Content Collections | 5.17+ | Blog post management | Built-in, type-safe, Zod validation |
| @tailwindcss/typography | 0.5.x | Prose styling | Standard for Tailwind markdown rendering |
| date-fns | 4.x | Date formatting | Tree-shakeable, formatDistanceToNow for relative dates |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Astro Image | built-in | Featured image optimization | When posts have featuredImage in frontmatter |
| Sharp | already installed | Image processing | Already in project, handles content collection images |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| date-fns | Intl.RelativeTimeFormat | Native but requires manual calculation; date-fns simpler for "15 days ago" threshold |
| @tailwindcss/typography | Custom CSS | Typography plugin provides tested defaults; custom CSS risks inconsistent spacing |

**Installation:**
```bash
npm install @tailwindcss/typography date-fns
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   └── blog/                    # Blog posts (.md files)
│       ├── my-first-post.md
│       └── wedding-session-recap.md
├── content.config.ts            # Content collection schema
├── data/
│   ├── services.ts              # Existing - categories reference this
│   └── authors.ts               # NEW: Author info (name, bio, photo)
├── components/
│   └── blog/
│       ├── PostCard.astro       # Grid card component
│       ├── PostListRow.astro    # Simple list row (below grid)
│       ├── Pagination.astro     # Numbered pagination
│       ├── Sidebar.astro        # Author + related posts
│       └── Prose.astro          # Typography wrapper
└── pages/
    └── blog/
        ├── [...page].astro      # Paginated listing (handles /blog, /blog/2, etc.)
        └── [id].astro           # Individual post pages
```

### Pattern 1: Content Collection with Glob Loader
**What:** Define blog collection in `src/content.config.ts` with Zod schema
**When to use:** All blog posts
**Example:**
```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),                    // Maps to service slug
    tags: z.array(z.string()).optional(),
    featuredImage: image().optional(),
    featuredImageAlt: z.string().optional(),
    galleryUrl: z.string().url().optional(), // Pic-Time link
    author: z.string().default('simon'),     // Defaults to Simon
  }),
});

export const collections = { blog };
```

### Pattern 2: Paginated Blog Listing with Rest Parameter
**What:** Use `[...page].astro` to handle `/blog` and `/blog/2`, `/blog/3`, etc.
**When to use:** Blog index with pagination
**Example:**
```typescript
// src/pages/blog/[...page].astro
// Source: https://docs.astro.build/en/guides/routing/#pagination
import { getCollection } from 'astro:content';

export async function getStaticPaths({ paginate }) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return paginate(posts, { pageSize: 20 });
}

const { page } = Astro.props;
// page.data = posts for this page
// page.currentPage, page.total, page.lastPage
// page.url.prev, page.url.next
```

### Pattern 3: Individual Post with render()
**What:** Use `getCollection()` for static paths, `render()` for content
**When to use:** Individual blog post pages
**Example:**
```typescript
// src/pages/blog/[id].astro
// Source: https://docs.astro.build/en/reference/modules/astro-content/
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
```

### Pattern 4: Typography Wrapper Component
**What:** Reusable prose styling wrapper
**When to use:** Wrapping rendered markdown content
**Example:**
```astro
<!-- src/components/blog/Prose.astro -->
<!-- Source: https://docs.astro.build/en/recipes/tailwind-rendered-markdown/ -->
<div class="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-bold
            prose-a:text-accent-500 dark:prose-a:text-accent-400
            prose-img:rounded-lg">
  <slot />
</div>
```

### Pattern 5: Relative Date Formatting with Threshold
**What:** Show "3 days ago" for recent, full date for older
**When to use:** Post cards and post headers
**Example:**
```typescript
// src/utils/formatDate.ts
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';

export function formatPostDate(date: Date): string {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff <= 15) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, 'MMMM d, yyyy'); // "February 9, 2026"
}
```

### Pattern 6: Related Posts by Category
**What:** Filter posts by same category for sidebar
**When to use:** Individual post sidebar
**Example:**
```typescript
// In [id].astro or Sidebar.astro
const allPosts = await getCollection('blog');
const relatedPosts = allPosts
  .filter(p => p.data.category === post.data.category && p.id !== post.id)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 6);

const hasMoreRelated = allPosts
  .filter(p => p.data.category === post.data.category && p.id !== post.id)
  .length > 6;
```

### Anti-Patterns to Avoid
- **Exporting `collection` instead of `collections`:** TypeScript IntelliSense won't work, hard to debug
- **Putting blog posts in `src/pages/`:** Use content collections instead of page-based markdown
- **Hardcoding author info in every post:** Use data module pattern like services.ts
- **Using `config.ts` instead of `content.config.ts`:** Astro 5 changed the config file location

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Prose styling | Custom typography CSS | @tailwindcss/typography | Tested spacing, responsive sizing, dark mode |
| Relative dates | Custom date math | date-fns formatDistanceToNow | Handles edge cases, localization |
| Markdown parsing | Custom parser | Astro's built-in render() | Consistent with project, remark/rehype support |
| Pagination | Custom slice logic | Astro's paginate() | Generates URLs, handles edge pages |
| Image optimization | Manual sharp calls | Astro's image() schema helper | Integrates with build pipeline |

**Key insight:** Astro's content collections handle the complex parts (schema validation, static path generation, markdown rendering). The work is in layout/styling, not content infrastructure.

## Common Pitfalls

### Pitfall 1: Config File Location (Astro 5)
**What goes wrong:** Content collections don't work, no TypeScript types
**Why it happens:** Astro 5 moved config from `src/content/config.ts` to `src/content.config.ts`
**How to avoid:** Create `src/content.config.ts` at project root level (inside src, not inside content folder)
**Warning signs:** "Cannot find module 'astro:content'" errors

### Pitfall 2: Non-Deterministic Sort Order
**What goes wrong:** Posts appear in random order on different builds
**Why it happens:** getCollection() returns entries in non-deterministic order
**How to avoid:** Always sort after fetching: `.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())`
**Warning signs:** Posts shuffled between dev/build

### Pitfall 3: Image Path Resolution
**What goes wrong:** Images 404 or aren't optimized
**Why it happens:** Using string paths instead of image() schema helper
**How to avoid:** Use `image()` from schema for local images, validates path exists
**Warning signs:** "Unable to resolve image" during build

### Pitfall 4: Typography Plugin Not Loading
**What goes wrong:** Prose class has no effect
**Why it happens:** Plugin not added to CSS in Tailwind v4 way
**How to avoid:** Add `@plugin "@tailwindcss/typography";` to global.css after @import
**Warning signs:** Markdown renders as unstyled text

### Pitfall 5: Rest Parameter Route Ordering
**What goes wrong:** /blog doesn't work, only /blog/1
**Why it happens:** Using `[page].astro` instead of `[...page].astro`
**How to avoid:** Use rest parameter `[...page].astro` for optional first segment
**Warning signs:** 404 on /blog, works on /blog/1

### Pitfall 6: Missing Dark Mode for Prose
**What goes wrong:** Prose text invisible in dark mode
**Why it happens:** Forgetting `dark:prose-invert` class
**How to avoid:** Always pair `prose` with `dark:prose-invert`
**Warning signs:** White text on white background in dark mode

## Code Examples

Verified patterns from official sources:

### Content Config Schema
```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    featuredImage: image().optional(),
    featuredImageAlt: z.string().optional(),
    galleryUrl: z.string().url().optional(),
    author: z.string().default('simon'),
  }),
});

export const collections = { blog };
```

### Paginated Listing Page
```astro
---
// src/pages/blog/[...page].astro
// Source: https://docs.astro.build/en/guides/routing/#pagination
import { getCollection } from 'astro:content';
import PageLayout from '@layouts/PageLayout.astro';
import PostCard from '@components/blog/PostCard.astro';
import PostListRow from '@components/blog/PostListRow.astro';
import Pagination from '@components/blog/Pagination.astro';

export async function getStaticPaths({ paginate }) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return paginate(posts, { pageSize: 20 });
}

const { page } = Astro.props;
const gridPosts = page.data.slice(0, 6);
const listPosts = page.data.slice(6);
---

<PageLayout title="Blog" description="Photography stories and tips">
  <!-- 3x2 Grid -->
  <section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {gridPosts.map(post => <PostCard post={post} />)}
  </section>

  <!-- List rows for remaining -->
  {listPosts.length > 0 && (
    <section class="mt-8 divide-y divide-surface-200 dark:divide-surface-700">
      {listPosts.map(post => <PostListRow post={post} />)}
    </section>
  )}

  <Pagination page={page} />
</PageLayout>
```

### Individual Post Page
```astro
---
// src/pages/blog/[id].astro
// Source: https://docs.astro.build/en/reference/modules/astro-content/
import { getCollection, render } from 'astro:content';
import PageLayout from '@layouts/PageLayout.astro';
import Prose from '@components/blog/Prose.astro';
import Sidebar from '@components/blog/Sidebar.astro';
import { formatPostDate } from '@/utils/formatDate';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

// Get related posts (same category)
const allPosts = await getCollection('blog');
const relatedPosts = allPosts
  .filter(p => p.data.category === post.data.category && p.id !== post.id)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 6);
---

<PageLayout title={post.data.title}>
  <article class="flex flex-col gap-8 lg:flex-row">
    <!-- Main content -->
    <div class="flex-1">
      <header class="mb-8">
        <h1 class="font-display text-4xl font-bold">{post.data.title}</h1>
        <time class="text-surface-500">{formatPostDate(post.data.date)}</time>
      </header>
      <Prose>
        <Content />
      </Prose>
    </div>

    <!-- Sidebar -->
    <Sidebar author={post.data.author} relatedPosts={relatedPosts} />
  </article>
</PageLayout>
```

### Typography CSS Setup
```css
/* src/styles/global.css - add after existing @import */
@plugin "@tailwindcss/typography";
```

### Author Data Module
```typescript
// src/data/authors.ts
// Following established services.ts pattern
export interface Author {
  id: string;
  name: string;
  bio: string;
  photo?: string; // Path to photo in assets
}

export const authors: Author[] = [
  {
    id: 'simon',
    name: 'Simon Wickes',
    bio: 'Professional photographer based in Arizona, specializing in outdoor portraits, weddings, and automotive photography.',
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find(a => a.id === id);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `src/content/config.ts` | `src/content.config.ts` | Astro 5.0 | Config file moved out of content folder |
| `getCollection().then(sort)` | `getCollection()` + explicit sort | Always needed | Order is non-deterministic, must sort |
| JS plugin config | `@plugin` in CSS | Tailwind v4 | Simpler, CSS-first configuration |
| `slug` property | `id` property | Astro 5.0 | Content entries use `id`, not `slug` |

**Deprecated/outdated:**
- `src/content/config.ts` location: Use `src/content.config.ts` in Astro 5+
- `entry.slug`: Use `entry.id` in Astro 5+ (automatically generated from filename)

## Open Questions

Things that couldn't be fully resolved:

1. **Author Photo Integration**
   - What we know: Can use `image()` helper in authors.ts or store in assets
   - What's unclear: Whether author data module should define ImageMetadata or path strings
   - Recommendation: Use path strings in authors.ts, import with glob in Sidebar component

2. **View Transitions with Blog**
   - What we know: Project uses View Transitions (03-03 decision)
   - What's unclear: Any special handling needed for blog content transitions
   - Recommendation: Test during implementation, may need transition names on content areas

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) - Schema, loaders, querying
- [Astro Markdown Content Docs](https://docs.astro.build/en/guides/markdown-content/) - Rendering, frontmatter
- [Astro Routing Pagination](https://docs.astro.build/en/guides/routing/#pagination) - paginate() function
- [Astro Content API Reference](https://docs.astro.build/en/reference/modules/astro-content/) - getCollection, render
- [Tailwind Typography README](https://github.com/tailwindlabs/tailwindcss-typography) - Prose classes, v4 setup
- [Astro Images in Collections](https://docs.astro.build/en/guides/images/#images-in-content-collections) - image() helper

### Secondary (MEDIUM confidence)
- [Astro Tailwind Markdown Recipe](https://docs.astro.build/en/recipes/tailwind-rendered-markdown/) - Integration pattern
- [date-fns formatDistanceToNow](https://date-fns.org/docs/formatDistanceToNow) - Relative date formatting

### Tertiary (LOW confidence)
- Community discussions on migration pitfalls (verified against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro docs, established patterns
- Architecture: HIGH - Follows project's existing data module and component patterns
- Pitfalls: HIGH - Documented in official migration guides and API references

**Research date:** 2026-02-10
**Valid until:** 60 days (Astro stable, Tailwind v4 stable)
