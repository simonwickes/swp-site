# Phase 5: Client Galleries - Research

**Researched:** 2026-02-10
**Domain:** Static informational page, Pic-Time gallery service integration, Astro page patterns
**Confidence:** HIGH

## Summary

Phase 5 is a straightforward static page that serves as a bridge between the photographer's website and the third-party Pic-Time gallery platform. The page needs to explain how gallery access works (password-protected, downloads, proofing) and provide clear navigation to the Pic-Time gallery service. This is purely a content and UI task -- no server-side functionality, no API integration, no new libraries.

The existing project patterns are well-established: `PageLayout` with `<section class="mx-auto max-w-4xl px-6 py-16">` for content pages (see `contact.astro`, `faq.astro`), the `Button` component for CTAs, dark mode support via `.dark` classes, and the existing design token system (accent, surface palettes). The page follows the exact same static page pattern as the FAQ page -- no new architectural decisions required.

Pic-Time provides multiple gallery access mechanisms for clients: a branded subdomain URL (e.g., `simonwickes.pic-time.com`), an optional custom domain (e.g., `gallery.simonwickes.com`), a generic login page at `https://us.pic-time.com/account`, and individual gallery share links. The photographer's Pic-Time URL format is `{brandname}.pic-time.com` by default, which can be customised to a subdomain like `gallery.simonwickes.com` via DNS CNAME record.

**Primary recommendation:** Create a single static Astro page at `src/pages/galleries.astro` using `PageLayout`, with informational content sections explaining the gallery experience and prominent CTA buttons linking to the photographer's Pic-Time gallery URL. Add a "Client Galleries" navigation link to the Header and mobile menu. No new dependencies required.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.17 | Static page framework | Already installed. This page is fully static (pre-rendered). No server-side rendering needed. |
| Tailwind CSS | 4.x | Styling | Already installed. CSS-first tokens in `@theme` block in `global.css`. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Button component | (existing) | CTA buttons | For the "Access Your Gallery" primary CTA linking to Pic-Time |
| PageLayout | (existing) | Page wrapper | Standard layout with Header + Footer + main content area |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Simple static page | Pic-Time embed/iframe integration | Embedding Pic-Time via iframe adds complexity (responsive sizing, cross-origin issues, loading performance). A simple link-out is cleaner and matches how most photographers handle this. The Pic-Time gallery experience is designed to be a standalone destination. |
| Link to Pic-Time subdomain | Generic Pic-Time login (`us.pic-time.com/account`) | The generic login is unbranded and shows a photographer selection screen if the client has galleries from multiple photographers. The branded subdomain (or custom domain) is a far better experience. |

**Installation:**
```bash
# No new packages needed. All dependencies already in place.
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  pages/
    galleries.astro          # Client galleries bridging page (new)
  components/
    global/
      Header.astro           # Add "Client Galleries" nav link (modify)
```

### Pattern 1: Static Informational Page (Established Pattern)

**What:** A content-focused page using `PageLayout` with semantic sections, following the existing `contact.astro` and `faq.astro` patterns exactly.
**When to use:** For this galleries page -- pure static content with no interactivity.

```astro
---
// Source: Existing project pattern (contact.astro, faq.astro)
import PageLayout from "@layouts/PageLayout.astro";
import Button from "@components/ui/Button.astro";
---

<PageLayout
  title="Client Galleries"
  description="Access your password-protected photo galleries. View, download, and order prints from your session."
>
  <section class="mx-auto max-w-4xl px-6 py-16">
    <h1 class="mb-4 font-display text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
      Client Galleries
    </h1>
    <p class="mb-8 text-lg text-surface-600 dark:text-surface-400">
      Introductory text explaining gallery access...
    </p>
    <!-- Content sections -->
    <!-- CTA to Pic-Time -->
  </section>
</PageLayout>
```

### Pattern 2: External Link CTA with Icon

**What:** A prominent button linking to an external service, using the existing `Button` component or a styled anchor. External links should use `target="_blank"` and `rel="noopener noreferrer"` with a visual indicator (external link icon or arrow).
**When to use:** For the primary "Access Your Gallery" CTA.

```astro
<!-- Using the existing Button component for primary CTA -->
<Button href="https://simonwickes.pic-time.com" variant="primary" class="gap-2">
  Access Your Gallery
</Button>

<!-- Note: Button component currently renders an <a> tag, but does not support
     target="_blank". If external link behavior is needed, either:
     1. Extend Button to accept target/rel props, OR
     2. Use a styled anchor directly for this specific case -->
```

### Pattern 3: Feature Cards / Info Blocks

**What:** Structured content blocks explaining gallery features (viewing, downloading, proofing, ordering prints). Use a grid or stack of cards with icons and descriptions.
**When to use:** To explain what clients can do in their gallery.

```astro
<!-- Icon + text info blocks (grid on desktop, stack on mobile) -->
<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
  <div class="text-center">
    <!-- Inline SVG icon -->
    <svg class="mx-auto mb-4 h-10 w-10 text-accent-500" ...>...</svg>
    <h3 class="mb-2 font-display text-lg font-semibold text-surface-900 dark:text-surface-100">
      View & Share
    </h3>
    <p class="text-surface-600 dark:text-surface-400">
      Browse your full gallery and share favourites with family and friends.
    </p>
  </div>
  <!-- More blocks... -->
</div>
```

### Pattern 4: Navigation Update

**What:** Add a "Client Galleries" link to the desktop nav, mobile slide-in panel, and footer.
**When to use:** The Header and Footer must include the new page in navigation.

The existing Header has a fixed nav structure: Home | Services (dropdown) | Contact. The "Client Galleries" link should be added as a top-level item between "Services" and "Contact" in both desktop and mobile navigation. In the Footer, add it to the links section.

### Anti-Patterns to Avoid

- **Embedding Pic-Time via iframe:** Pic-Time's embed feature is designed for portfolio/art galleries, not client galleries. Client galleries require login/authentication which does not work well in iframes (cross-origin cookies, authentication flows). Link out instead.
- **Building a custom gallery viewer:** The whole point of Pic-Time is that it handles gallery presentation, access control, downloads, and print ordering. The website page should direct users there, not replicate any of that functionality.
- **Hardcoding the Pic-Time URL in multiple places:** Store the gallery URL in a single data file or constant so it can be updated in one place if the photographer changes their Pic-Time subdomain or sets up a custom domain later.
- **Overcomplicating the page with dynamic content:** This is a static informational page. No API calls, no dynamic data fetching, no client-side JavaScript needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Gallery hosting/display | Custom image gallery with auth | Pic-Time (third-party service) | Pic-Time handles authentication, high-res delivery, proofing, print sales, download tracking. This is their core product. |
| Password protection for galleries | Custom auth system | Pic-Time's built-in access control | Pic-Time manages user types (Main Client, Invited, Guest), access codes, and permissions. Zero custom code needed. |
| Gallery access instructions | Dynamic/interactive tutorial | Static content sections | The instructions are simple and unchanging: "click the link, log in with your email, view your photos." Static HTML is sufficient. |
| External link button with icon | Custom link component | Extend or wrap existing `Button` component | The existing Button component already handles primary/secondary variants. Minor extension for `target="_blank"` is all that is needed. |

**Key insight:** This phase is almost entirely a content/copywriting task with minimal technical complexity. The main technical work is adding a new page file and updating the navigation. The value is in clear, reassuring copy that guides clients to their galleries.

## Common Pitfalls

### Pitfall 1: Hardcoding Pic-Time URL Without Abstraction

**What goes wrong:** The Pic-Time gallery URL is scattered across the page template, header, footer, and possibly other components. When the photographer changes their subdomain or sets up a custom domain, every instance must be found and updated.
**Why it happens:** It seems trivial to just paste the URL directly.
**How to avoid:** Define the gallery URL as a constant in a data file (e.g., `src/data/gallery.ts` or add to an existing site config). Reference it from all templates.
**Warning signs:** The same URL string appearing in more than one file.

### Pitfall 2: Missing `target="_blank"` on External Links

**What goes wrong:** Clicking the "Access Your Gallery" button navigates away from the photographer's website in the same tab. Users lose their place and may not return.
**Why it happens:** The existing `Button` component renders a plain `<a>` tag without `target` or `rel` attributes.
**How to avoid:** Either extend the `Button` component to support `target` and `rel` props, or use a direct `<a>` tag with `target="_blank" rel="noopener noreferrer"` for external links. Always add `rel="noopener noreferrer"` alongside `target="_blank"` for security.
**Warning signs:** Clicking the gallery CTA replaces the current page with Pic-Time.

### Pitfall 3: Forgetting Dark Mode on New Elements

**What goes wrong:** New content sections look correct in light mode but have invisible or poorly contrasted text in dark mode.
**Why it happens:** Easy to forget `dark:` variant classes when writing new markup.
**How to avoid:** The established pattern is explicit dark mode classes on every color utility: `text-surface-900 dark:text-surface-100`, `text-surface-600 dark:text-surface-400`, `border-surface-200 dark:border-surface-800`. Test in both modes.
**Warning signs:** Text disappears or becomes unreadable when toggling the theme.

### Pitfall 4: Navigation Inconsistency Between Desktop and Mobile

**What goes wrong:** The new "Client Galleries" link appears in desktop nav but is missing from the mobile slide-in panel (or vice versa).
**Why it happens:** The Header component has completely separate markup sections for desktop (`hidden lg:block`) and mobile (`lg:hidden`). Adding a link to one section does not automatically add it to the other.
**How to avoid:** When modifying `Header.astro`, update both the desktop `<MenuItems>` section AND the mobile slide-in panel section. Also update the Footer.
**Warning signs:** Navigation links differ between desktop and mobile views.

### Pitfall 5: Not Setting a Placeholder Pic-Time URL

**What goes wrong:** The page ships with a broken or example URL because the photographer has not yet set up their Pic-Time account or shared their gallery URL.
**Why it happens:** Development proceeds without the actual gallery URL.
**How to avoid:** Use a clearly marked placeholder (e.g., `https://YOURNAME.pic-time.com`) in the data file with a code comment noting it must be replaced. Alternatively, use a configurable environment variable or site config value.
**Warning signs:** Links point to `pic-time.com` root or a non-existent subdomain.

## Code Examples

### Complete Galleries Page Structure

```astro
---
// src/pages/galleries.astro
// Source: Follows existing contact.astro / faq.astro pattern
import PageLayout from "@layouts/PageLayout.astro";
import Button from "@components/ui/Button.astro";
import { GALLERY_URL } from "@/data/gallery";
---

<PageLayout
  title="Client Galleries"
  description="Access your password-protected photo galleries. View, download, and order prints from your session with Simon Wickes Photography."
>
  <!-- Hero / intro section -->
  <section class="mx-auto max-w-4xl px-6 py-16">
    <h1
      class="mb-4 font-display text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-100"
    >
      Client Galleries
    </h1>
    <p class="mb-8 text-lg text-surface-600 dark:text-surface-400">
      Your photos are delivered through a password-protected online gallery
      where you can view, share, and download them at full resolution.
    </p>
  </section>

  <!-- How it works section -->
  <section class="mx-auto max-w-4xl px-6 pb-16">
    <h2 class="mb-6 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
      How It Works
    </h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Feature cards with inline SVG icons -->
    </div>
  </section>

  <!-- CTA section -->
  <section class="py-16 text-center">
    <h2 class="mb-4 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
      Ready to view your photos?
    </h2>
    <p class="mx-auto mb-8 max-w-xl text-surface-600 dark:text-surface-400">
      Click below to access your gallery. You will need the email address
      and password provided when your gallery was shared with you.
    </p>
    <a
      href={GALLERY_URL}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block rounded-full bg-accent-500 px-8 py-3 font-display font-semibold text-surface-50 transition-colors duration-200 hover:bg-accent-600"
    >
      Access Your Gallery
    </a>
  </section>
</PageLayout>
```

### Gallery Data/Config File

```typescript
// src/data/gallery.ts
// Central configuration for gallery-related URLs and content.
// Update GALLERY_URL when the photographer's Pic-Time subdomain or
// custom domain is confirmed.

/** The primary URL where clients access their Pic-Time galleries */
export const GALLERY_URL = "https://simonwickes.pic-time.com";

/** Fallback: Pic-Time generic login (unbranded, use only if custom URL unavailable) */
export const GALLERY_LOGIN_URL = "https://us.pic-time.com/account";
```

### Header Navigation Update (Desktop Section)

```astro
<!-- Add between Services dropdown </li> and Contact <li> in desktop nav -->
<li>
  <a
    href="/galleries/"
    class:list={[
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-accent-500",
      isActive("/galleries/")
        ? "text-accent-500"
        : "text-surface-600 dark:text-surface-400",
    ]}
  >
    Client Galleries
  </a>
</li>
```

### Header Navigation Update (Mobile Section)

```astro
<!-- Add before the Contact link border-t section in mobile nav -->
<a
  href="/galleries/"
  class:list={[
    "mb-2 rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:text-accent-500",
    isActive("/galleries/")
      ? "text-accent-500"
      : "text-surface-700 dark:text-surface-300",
  ]}
>
  Client Galleries
</a>
```

### Button Component Extension (Optional)

```astro
---
// If extending Button.astro to support external links:
interface Props {
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  class?: string;
}

const { href, variant = "primary", external = false, class: className } = Astro.props;

const baseClasses = "inline-block rounded-full px-8 py-3 font-display font-semibold transition-colors duration-200";

const variantClasses = {
  primary: "bg-accent-500 hover:bg-accent-600 text-surface-50",
  secondary: "border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-surface-50 dark:text-accent-400 dark:border-accent-400 dark:hover:bg-accent-400 dark:hover:text-surface-900",
};
---

<a
  href={href}
  class:list={[baseClasses, variantClasses[variant], className]}
  {...external ? { target: "_blank", rel: "noopener noreferrer" } : {}}
>
  <slot />
</a>
```

## Pic-Time Integration Details

### URL Structure (MEDIUM confidence)

| URL Type | Format | Example |
|----------|--------|---------|
| Default subdomain | `{brandname}.pic-time.com` | `simonwickes.pic-time.com` |
| Custom domain | `{subdomain}.{domain}.com` | `gallery.simonwickes.com` |
| Generic login | `us.pic-time.com/account` | (unbranded, fallback only) |
| Individual gallery | `{brandname}.pic-time.com/-{galleryslug}` | `simonwickes.pic-time.com/-peterkate` |

### Client Access Flow

1. Photographer shares gallery via Pic-Time (email invitation or secure link)
2. Client receives email with gallery link and creates an account (password)
3. For subsequent visits, client goes to photographer's Pic-Time URL and logs in
4. The bridging page on the photographer's website directs returning clients to step 3

### Pic-Time Gallery Features (for copy on the page)

These features should be mentioned in the informational content:

- **Password-protected access** -- Galleries are secured; only invited clients can view
- **Full-resolution downloads** -- Clients can download their edited photos at full quality
- **Share with family and friends** -- Clients can invite others to view selected galleries
- **Print ordering** -- Built-in storefront for ordering prints, albums, and wall art (if photographer enables this)
- **Proofing and favourites** -- Clients can mark favourite images and submit selections
- **Mobile-friendly** -- Pic-Time galleries work on all devices; mobile app also available

### What the Photographer Needs to Provide

Before this page can link to a real gallery, the photographer must:

1. Have an active Pic-Time account (any paid tier: Beginner $8/mo, Professional $25/mo, or Advanced $50/mo)
2. Confirm their Pic-Time subdomain URL (e.g., `simonwickes.pic-time.com`)
3. Optionally: set up a custom domain via DNS CNAME record (e.g., `gallery.simonwickes.com` pointing to Pic-Time)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Embed gallery iframe on own site | Link out to dedicated gallery platform | N/A (established practice) | Gallery platforms handle auth, CDN delivery, print sales, mobile optimization. Embedding breaks these features. |
| Self-hosted gallery with password | Third-party SaaS gallery (Pic-Time, Pixieset, ShootProof) | ~2018 onward | Photographers no longer maintain their own gallery infrastructure. SaaS handles storage, delivery, sales, and client management. |
| Generic "login" page with password field | Branded gallery URL with account-based access | Pic-Time current | Modern gallery platforms use account-based access (email + password) rather than simple shared passwords. More secure, enables per-user permissions. |

**Deprecated/outdated:**
- Self-hosted gallery scripts (e.g., Coppermine, Gallery3): Unmaintained, security risks, no print sales integration
- Simple password-protected WordPress galleries: Poor UX, no download tracking, no sales features
- Embedding Pic-Time client galleries via iframe: Cross-origin authentication issues; embed is only for art/portfolio galleries

## Open Questions

1. **Photographer's Pic-Time URL**
   - What we know: The user decided on Pic-Time as the gallery service. The default URL format is `{brandname}.pic-time.com`.
   - What's unclear: The photographer's exact Pic-Time subdomain or whether a custom domain is planned.
   - Recommendation: Use a placeholder URL in `src/data/gallery.ts` with a clear comment. The URL can be updated when the photographer confirms their Pic-Time setup. Use `https://simonwickes.pic-time.com` as the likely default.

2. **Custom Domain vs Pic-Time Subdomain**
   - What we know: Pic-Time supports custom domains via DNS CNAME (e.g., `gallery.simonwickes.com`). This requires DNS configuration.
   - What's unclear: Whether the photographer wants to set up a custom domain for their galleries.
   - Recommendation: Build the page to reference a single configurable URL constant. Whether it is `simonwickes.pic-time.com` or `gallery.simonwickes.com` is irrelevant to the page implementation -- just change the constant.

3. **Page content and copy**
   - What we know: The page needs to explain gallery access (password-protected, downloads, proofing) and provide clear navigation to Pic-Time.
   - What's unclear: The exact copy and tone the photographer prefers.
   - Recommendation: Write warm, reassuring copy consistent with the existing site tone (see FAQ and service descriptions for reference). Cover: how to access, what you can do (view, download, share, order prints), and a prominent CTA. The copy can be refined later.

## Sources

### Primary (HIGH confidence)
- Existing project codebase -- `contact.astro`, `faq.astro`, `Header.astro`, `PageLayout.astro`, `Button.astro`, `global.css` (direct examination of established patterns)
- [Pic-Time Help: Generic Client Landing Page](https://help.pic-time.com/en/articles/8959345-is-there-a-generic-client-landing-page) -- Generic login URL format confirmed
- [Pic-Time Help: How to Share a Client Gallery](https://help.pic-time.com/en/articles/10273772-how-do-i-share-a-client-gallery) -- Sharing methods and access control
- [Pic-Time Help: User Login and Password Management](https://help.pic-time.com/en/articles/7923134-user-login-access-password-creation-and-management) -- Client authentication flow
- [Pic-Time Help: Public vs Private Galleries](https://help.pic-time.com/en/articles/7905048-what-is-the-difference-between-public-and-private-galleries) -- Access control model
- [Pic-Time Help: Gallery Access Codes](https://help.pic-time.com/en/articles/7926226-how-do-i-manage-gallery-access-codes) -- Access code mechanism
- [Pic-Time Help: Gallery URL](https://help.pic-time.com/en/articles/7923017-how-do-i-change-the-gallery-url) -- URL structure confirmation
- [Pic-Time Help: Custom Domain](https://help.pic-time.com/en/articles/7925318-how-do-i-add-a-custom-domain-and-email) -- Custom domain setup

### Secondary (MEDIUM confidence)
- [Pic-Time Custom Domain Blog Post](https://blog.pic-time.com/blog/customdomain) -- Subdomain URL format (`{brandname}.pic-time.com`)
- [Pic-Time Help: Art Gallery Integration](https://help.pic-time.com/en/articles/7925733-how-do-i-share-and-integrate-my-art-gallery-or-art-main-page) -- Embed vs link-out patterns

### Tertiary (LOW confidence)
- [Pic-Time Pricing (via picflow.com)](https://picflow.com/compare/client-gallery/pic-time) -- Pricing tiers (verify on pic-time.com/pricing directly)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new libraries. Uses only existing project dependencies and patterns.
- Architecture: HIGH -- Follows established page creation pattern used by `contact.astro`, `faq.astro`. Verified by reading actual project code.
- Pitfalls: HIGH -- All pitfalls derived from direct analysis of existing codebase patterns (dark mode, nav structure, Button component limitations).
- Pic-Time integration: MEDIUM -- URL structure and access flow verified via official Pic-Time help docs. Exact photographer URL is unknown (placeholder needed).

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (stable -- this is a static content page with no fast-moving dependencies)
