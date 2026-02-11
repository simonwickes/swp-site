# Phase 6: Blog Engine — Context

**Created:** 2026-02-10
**Phase Goal:** Users can browse and read blog posts about photography sessions, behind-the-scenes stories, and tips

## Decisions

### Blog Listing Layout

| Decision | Choice |
|----------|--------|
| Card grid | 3x2 grid (6 cards max), responsive: 3 cols desktop → 2 tablet → 1 mobile |
| Below grid | Remaining posts displayed as simple list rows with title + date only |
| Pagination | Numbered pagination, 20 posts per page |
| Sort order | By date (newest first), date shown on each card |
| Featured distinction | None — all 6 grid cards are equal size |

### Post Preview Cards

| Decision | Choice |
|----------|--------|
| Featured image | Optional — if missing, card shows no image area (just title/date) |
| Image aspect ratio | Square preview thumbnails, images open to their correct aspect ratio |
| Date format | Relative for first 15 days (e.g., "3 days ago"), then full date (e.g., "February 9, 2026") |
| Hover state | Overlay with thicker border |

### Individual Post Layout

| Decision | Choice |
|----------|--------|
| Content width | Narrow (constrained prose width) |
| Sidebar | Yes, sticky on scroll |
| Sidebar content | Author info + related posts (up to 6, with "view more" link if more exist) |
| Author placement | In sidebar (not inline with content) |
| Related posts logic | Same category, displayed in sidebar |
| Gallery links | Link to Pic-Time client gallery when post is about a specific client session |

### Category/Tag Structure

| Decision | Choice |
|----------|--------|
| Categories | Based on service types (Outdoor Portraits, Weddings, etc.) — user can modify/add |
| Tags | Flat, for additional context (e.g., "Arizona", "food") — user can create/modify |
| Display on cards | Category shown on listing cards |
| Category click | Filters listing to that category (Phase 7 implements, but structure data for it now) |
| Tag styling | Subtle (not prominent) |

## Implementation Notes

### Data Structure
Posts need frontmatter supporting:
- `title` (required)
- `date` (required)
- `category` (required, single value matching a service type)
- `tags` (optional, array of strings)
- `featuredImage` (optional)
- `galleryUrl` (optional, Pic-Time link for client session posts)
- `author` (optional, defaults to Simon if not specified)

### Responsive Behavior
- Desktop: 3-column card grid + sidebar visible
- Tablet: 2-column card grid + sidebar collapses below content
- Mobile: 1-column card grid + sidebar collapses below content

### Date Display Logic
```
if (daysSincePublished <= 15) {
  return relativeDate; // "3 days ago"
} else {
  return fullDate; // "February 9, 2026"
}
```

## Out of Scope (Phase 7)
- Search functionality
- Category/tag filtering UI
- Social share buttons

## Deferred Ideas
None captured during discussion.

---
*Context gathered: 2026-02-10*
