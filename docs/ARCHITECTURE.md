# Site Architecture

Developer-level documentation of the simonwickes.com photography site.

---

## System Overview

```mermaid
graph TB
    subgraph Developer["Developer (Local)"]
        CODE[Source Code<br/>Astro 5 + Tailwind v4]
        SCRIPTS["Scripts<br/>add-images.sh<br/>deploy.sh"]
    end

    subgraph GitHub["GitHub (simonwickes/swp-site)"]
        REPO[Repository<br/>main branch]
        ACTION["GitHub Action<br/>deploy-apache.yml"]
    end

    subgraph InMotion["InMotion Hosting (Apache)"]
        FTP["FTP Server"]
        HTACCESS_ROOT[".htaccess (root)<br/>Rewrites to /swp/"]
        SITE_A["simonwickes.com<br/>Static files in public_html/swp/"]
        CMS["Decap CMS<br/>/admin/"]
        EXISTING["/resume<br/>/lamvp"]
    end

    subgraph External["External Services"]
        EMAILJS["EmailJS<br/>Contact form emails"]
        PICTIME["Pic-Time<br/>Client galleries"]
        GA["Google Analytics<br/>G-6F43WS1L0Y"]
    end

    CODE -->|git push| REPO
    SCRIPTS -->|git push| REPO
    REPO -->|trigger| ACTION
    ACTION -->|"FTP upload"| FTP
    FTP --> SITE_A
    SITE_A --> CMS
    CMS -->|"read/write via GitHub API"| REPO
    CMS -->|"GitHub PKCE auth"| REPO
    SITE_A -->|"client-side send"| EMAILJS
    HTACCESS_ROOT -->|"route requests"| SITE_A
    HTACCESS_ROOT -->|"passthrough"| EXISTING

    style InMotion fill:#e67e22,color:#fff
    style GitHub fill:#333,color:#fff
    style External fill:#8e44ad,color:#fff
```

---

## Deployment Pipeline

```mermaid
sequenceDiagram
    participant D as Developer
    participant G as GitHub
    participant A as GitHub Action
    participant I as InMotion (FTP)

    D->>G: git push origin main
    G->>A: Action trigger
    A->>A: npm ci
    A->>A: astro build (static output)
    A->>A: cp public/.htaccess dist/.htaccess
    A->>I: FTP upload dist/ → public_html/swp/
    Note over I: simonwickes.com live (~2 min)
```

---

## Request Flow

### Apache (simonwickes.com)

```mermaid
graph LR
    REQ[Browser Request] --> ROOT_HT[".htaccess (public_html/)"]
    ROOT_HT -->|"/resume, /lamvp"| EXISTING[Existing Sites]
    ROOT_HT -->|"www → non-www"| REDIRECT[301 Redirect]
    ROOT_HT -->|"Everything else"| REWRITE["Rewrite to /swp/$1"]
    REWRITE --> SWP_HT[".htaccess (swp/)"]
    SWP_HT -->|"Static files"| FILE[Serve file directly]
    SWP_HT -->|"Clean URLs"| DIR["Serve dir/index.html"]
    SWP_HT -->|"Not found"| ERR[404.html]
```

---

## Tech Stack

### Core Framework

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Astro | 5.17.1 |
| CSS | Tailwind CSS (v4, CSS-first) | 4.1.18 |
| Output | Static (no server required) | |
| Content | Astro Content Collections (glob loader) | built-in |
| TypeScript | Strict mode | built-in |

### Client-Side Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| Swiper | Hero carousel | 12.1.0 |
| PhotoSwipe | Lightbox for service galleries | 5.4.4 |
| Fuse.js | Client-side blog search | 7.1.0 |
| astro-masonry | Masonry grid layout | 1.2.2 |
| date-fns | Date formatting | 4.1.0 |
| @emailjs/browser | Contact form email sending | 4.4.1 |

### Fonts

| Font | Usage | Variable |
|------|-------|----------|
| Plus Jakarta Sans | Body text | `--font-body` |
| Nunito | Display/headings | `--font-display` |

---

## Content Architecture

### Blog Posts

**Location:** `src/content/blog/*.md`

**Schema** (defined in `src/content.config.ts`):

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | |
| date | date | yes | Coerced from YYYY-MM-DD |
| category | string | yes | Must match a service slug |
| tags | string[] | no | |
| featuredImage | image() | no | Astro typed image reference |
| featuredImageAlt | string | no | |
| galleryUrl | URL | no | Pic-Time session link |
| author | string | yes | Default: "simon" |

### Service Categories

Defined in `src/data/services.ts`. Each service has a slug, title, description, and a corresponding:
- Page at `src/pages/services/<slug>.astro`
- Image folder at `src/assets/images/services/<slug>/`
- Decap CMS category option in `public/admin/config.yml`

| Slug | Title |
|------|-------|
| outdoor-portraits | Outdoor Portraits |
| weddings | Weddings |
| commercial | Commercial |
| landscape | Landscape |
| cars | Cars |
| assignments | Assignments |
| events | Events |
| live-performances | Live Performances |

### Image Organization

```
src/assets/images/
├── hero/              # 4 carousel slides (slide-1 through slide-4)
├── featured/          # Homepage grid (named by category)
├── services/
│   ├── outdoor-portraits/   # Numbered 01.jpg, 02.jpg, ...
│   ├── weddings/
│   ├── commercial/
│   ├── landscape/
│   ├── cars/
│   ├── assignments/
│   ├── events/
│   └── live-performances/
├── blog/              # CMS-uploaded post images
└── test/              # Test images
```

**Image Loading Pattern** (service pages):
```typescript
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/services/<slug>/*.{jpg,jpeg,png,webp}",
  { eager: true }
);
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => ({ src: mod.default, alt: "..." }));
```

---

## Layout Hierarchy

```mermaid
graph TD
    BASE["BaseLayout.astro<br/>HTML shell, meta, theme init,<br/>analytics, View Transitions"] --> PAGE["PageLayout.astro<br/>Header (persist), main (fade), Footer (persist)"]
    PAGE --> CONTENT["Page Content<br/>(slots)"]

    BASE -.->|"ClientRouter"| VT[View Transitions]
    BASE -.->|"inline script"| THEME[Theme Initialization]
    PAGE -.->|"transition:persist"| HEADER[Header + ThemeToggle]
    PAGE -.->|"transition:persist"| FOOTER[Footer]
    PAGE -.->|"transition:animate=fade"| MAIN[Main Content]
```

---

## Dark Mode System

```mermaid
stateDiagram-v2
    [*] --> CheckLocalStorage: Page Load
    CheckLocalStorage --> ApplyDark: theme === "dark"
    CheckLocalStorage --> CheckSystem: No stored preference
    CheckSystem --> ApplyDark: prefers-color-scheme: dark
    CheckSystem --> ApplyLight: prefers-color-scheme: light
    ApplyLight --> ApplyDark: No preference (default dark)

    ApplyDark --> Ready: Add .dark class + colorScheme
    ApplyLight --> Ready: Remove .dark class + colorScheme

    Ready --> ToggleClicked: User clicks ThemeToggle
    ToggleClicked --> ApplyDark: Was light
    ToggleClicked --> ApplyLight: Was dark

    Ready --> PageNav: View Transition
    PageNav --> CheckLocalStorage: astro:after-swap
```

**Implementation details:**
- Class-based: `.dark` on `<html>` element
- Tailwind v4 custom variant: `@custom-variant dark (&:where(.dark, .dark *))`
- Inline script in `<head>` prevents flash of wrong theme
- `astro:after-swap` re-applies theme during View Transitions
- Smooth transitions enabled after initial paint via `.theme-ready` class

---

## Contact Form Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant E as EmailJS API
    participant S as Simon's Email

    U->>U: Fill form + submit
    U->>U: Client-side validation (name, email, message)

    alt Validation fails
        U-->>U: Show field-level errors
    else Validation passes
        U->>E: emailjs.send(serviceId, templateId, params)
        E->>S: "New enquiry from [name]"
        E-->>U: Success response
        U-->>U: Show success message
    end
```

**Template parameters sent to EmailJS:**
| Parameter | Source |
|-----------|--------|
| `title` | "New enquiry from " + name |
| `name` | Form name field |
| `email` | Form email field |
| `message` | Form message field |

---

## CMS Architecture

```mermaid
graph LR
    ADMIN["Decap CMS<br/>simonwickes.com/admin/"] -->|"GitHub API"| REPO["GitHub Repo<br/>main branch"]
    ADMIN -->|"GitHub PKCE auth"| GH["GitHub OAuth"]
    REPO -->|"New commit"| DEPLOY["Triggers GitHub Action deploy"]

    subgraph CMS Config
        BACKEND["Backend: github<br/>Repo: simonwickes/swp-site<br/>Branch: main<br/>Auth: PKCE"]
        MEDIA["Media: src/assets/images/blog"]
        COLLECTION["Collection: blog<br/>Folder: src/content/blog"]
    end
```

**Config:** `public/admin/config.yml`

PKCE auth flow means the CMS authenticates directly with GitHub — no external OAuth proxy required.

---

## Apache Routing (InMotion)

```mermaid
graph TD
    REQ["Incoming Request<br/>simonwickes.com/services/weddings/"]

    REQ --> ROOT_HT["public_html/.htaccess"]

    ROOT_HT --> CHECK_WWW{"www subdomain?"}
    CHECK_WWW -->|Yes| REDIR_WWW["301 → simonwickes.com"]

    CHECK_WWW -->|No| CHECK1{"URI starts with /swp/?"}
    CHECK1 -->|Yes| PASS1[Skip rewrite]

    CHECK1 -->|No| CHECK2{"URI starts with<br/>/resume or /lamvp?"}
    CHECK2 -->|Yes| EXISTING["Serve existing site"]

    CHECK2 -->|No| CHECK3{"URI starts with<br/>/.well-known or /cgi-bin?"}
    CHECK3 -->|Yes| SYSTEM["Serve system path"]

    CHECK3 -->|No| REWRITE["Internal rewrite<br/>/swp/services/weddings/"]

    REWRITE --> SWP_HT["public_html/swp/.htaccess"]

    SWP_HT --> CHECK4{"File exists?"}
    CHECK4 -->|Yes| SERVE["Serve static file"]

    CHECK4 -->|No| CHECK5{"Directory with index.html?"}
    CHECK5 -->|Yes| INDEX["Serve index.html"]

    CHECK5 -->|No| CHECK6{"Missing trailing slash?"}
    CHECK6 -->|Yes| REDIRECT["301 redirect with slash"]
    CHECK6 -->|No| ERR["404.html"]
```

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: sitemap, Tailwind |
| `src/styles/global.css` | Tailwind v4 theme: colors, fonts, custom variants |
| `src/content.config.ts` | Blog collection schema (Zod) |
| `src/data/services.ts` | Service definitions (slug, title, description) |
| `src/data/gallery.ts` | Pic-Time gallery URL |
| `public/admin/config.yml` | Decap CMS backend, media, collection fields |
| `public/.htaccess` | Apache config for swp/ subfolder (clean URLs, caching) |
| `scripts/htaccess-public_html.txt` | Template for InMotion root .htaccess |
| `.github/workflows/deploy-apache.yml` | GitHub Action: build + FTP to InMotion |
| `scripts/deploy.sh` | One-command deploy (pull, stage, commit, push) |
| `scripts/add-images.sh` | Image management (replace gallery/hero/featured) |

---

## API Endpoints

| Endpoint | Type | Purpose |
|----------|------|---------|
| `/api/posts.json` | GET (prerendered) | Blog search data (id, title, category, tags, excerpt) |
