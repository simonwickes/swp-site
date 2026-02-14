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
        OAUTH["OAuth App<br/>Decap CMS auth"]
    end

    subgraph Netlify["Netlify"]
        BUILD_N["Netlify Build<br/>Full SSR + Image CDN"]
        SITE_N["swp-site.netlify.app"]
        ACTIONS_N["Astro Actions<br/>/_actions/submitContact"]
        CMS["Decap CMS<br/>/admin/"]
        OAUTH_PROXY["OAuth Proxy<br/>api.netlify.com/auth/done"]
    end

    subgraph InMotion["InMotion Hosting (Apache)"]
        FTP["FTP Server"]
        HTACCESS_ROOT[".htaccess (root)<br/>Rewrites to /swp/"]
        SITE_A["simonwickes.com<br/>Static files in public_html/swp/"]
        EXISTING["/resume<br/>/lamvp"]
    end

    subgraph External["External Services"]
        RESEND["Resend<br/>Email delivery"]
        PICTIME["Pic-Time<br/>Client galleries"]
        GA["Google Analytics<br/>G-6F43WS1L0Y"]
    end

    CODE -->|git push| REPO
    SCRIPTS -->|git push| REPO
    REPO -->|webhook| BUILD_N
    REPO -->|trigger| ACTION
    ACTION -->|"FTP upload<br/>(BUILD_FOR_APACHE=true)"| FTP
    FTP --> SITE_A
    BUILD_N --> SITE_N
    SITE_N --> ACTIONS_N
    SITE_N --> CMS
    CMS -->|"read/write via API"| REPO
    CMS -->|"auth flow"| OAUTH
    OAUTH -->|"callback"| OAUTH_PROXY
    ACTIONS_N -->|"send email"| RESEND
    SITE_A -->|"cross-origin POST"| ACTIONS_N
    HTACCESS_ROOT -->|"route requests"| SITE_A
    HTACCESS_ROOT -->|"passthrough"| EXISTING

    style Netlify fill:#00c7b7,color:#000
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
    participant N as Netlify
    participant A as GitHub Action
    participant I as InMotion (FTP)

    D->>G: git push origin main

    par Netlify Deploy
        G->>N: Webhook trigger
        N->>N: npm ci
        N->>N: astro build (imageCDN: true)
        N->>N: Deploy SSR + static assets
        Note over N: swp-site.netlify.app live
    and Apache Deploy
        G->>A: Action trigger
        A->>A: npm ci
        A->>A: astro build (BUILD_FOR_APACHE=true, imageCDN: false)
        A->>A: rm -rf dist/.netlify dist/_redirects
        A->>A: cp public/.htaccess dist/.htaccess
        A->>I: FTP upload dist/ → public_html/swp/
        Note over I: simonwickes.com live
    end
```

---

## Build Variants

The site builds differently for each target:

```mermaid
graph LR
    subgraph Config["astro.config.mjs"]
        CHECK{"BUILD_FOR_APACHE?"}
    end

    CHECK -->|"false (Netlify)"| NETLIFY_BUILD["imageCDN: true<br/>Images via /.netlify/images<br/>SSR Actions enabled<br/>Full server functions"]
    CHECK -->|"true (Apache)"| APACHE_BUILD["imageCDN: false<br/>Images as static .webp<br/>Actions compile but unused<br/>Static files only"]

    NETLIFY_BUILD --> NETLIFY_OUT["dist/<br/>Server functions + static"]
    APACHE_BUILD --> APACHE_OUT["dist/<br/>Static HTML + _astro/ assets"]
```

---

## Request Flow

### Netlify (swp-site.netlify.app)

```mermaid
graph LR
    REQ[Browser Request] --> NETLIFY_CDN[Netlify CDN]
    NETLIFY_CDN -->|"Static pages"| HTML[Prerendered HTML]
    NETLIFY_CDN -->|"/_actions/*"| SSR[Netlify Function<br/>Astro Actions]
    NETLIFY_CDN -->|"/_astro/*"| ASSETS[CSS/JS/Fonts]
    NETLIFY_CDN -->|"/.netlify/images"| IMG_CDN[Image CDN<br/>On-demand optimization]
    SSR -->|"submitContact"| RESEND[Resend API]
    RESEND --> ADMIN_EMAIL[Notification to Simon]
    RESEND --> USER_EMAIL[Confirmation to User]
```

### Apache (simonwickes.com)

```mermaid
graph LR
    REQ[Browser Request] --> ROOT_HT[".htaccess (public_html/)"]
    ROOT_HT -->|"/resume, /lamvp"| EXISTING[Existing Sites]
    ROOT_HT -->|"Everything else"| REWRITE["Rewrite to /swp/$1"]
    REWRITE --> SWP_HT[".htaccess (swp/)"]
    SWP_HT -->|"Static files"| FILE[Serve file directly]
    SWP_HT -->|"Clean URLs"| DIR["Serve dir/index.html"]
    SWP_HT -->|"Not found"| ERR[404.html]

    REQ2[Contact Form Submit] -->|"Cross-origin POST"| NETLIFY["swp-site.netlify.app<br/>/_actions/submitContact"]
```

---

## Tech Stack

### Core Framework

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Astro | 5.17.1 |
| CSS | Tailwind CSS (v4, CSS-first) | 4.1.18 |
| Adapter | @astrojs/netlify | latest |
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
    participant S as Site (Netlify or Apache)
    participant N as Netlify Actions
    participant R as Resend API
    participant SI as Simon's Email
    participant UE as User's Email

    U->>S: Fill form + submit

    alt On Netlify
        S->>N: actions.submitContact(formData)
    else On Apache
        S->>N: fetch("swp-site.netlify.app/_actions/submitContact")
        Note over S,N: Cross-origin POST<br/>CORS headers in netlify.toml
    end

    N->>N: Zod validation
    alt Validation fails
        N-->>S: InputError with field messages
        S-->>U: Show field-level errors
    else Validation passes
        N->>R: Send notification email
        R->>SI: "New inquiry from [name]"
        N->>R: Send confirmation email
        R->>UE: "Thanks for reaching out"
        N-->>S: Success response
        S-->>U: Show success message
    end
```

**CORS Configuration** (`netlify.toml`):
```toml
[[headers]]
  for = "/_actions/*"
  [headers.values]
    Access-Control-Allow-Origin = "https://simonwickes.com"
    Access-Control-Allow-Methods = "POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"
```

---

## CMS Architecture

```mermaid
graph LR
    ADMIN["Decap CMS<br/>/admin/"] -->|"GitHub API"| REPO["GitHub Repo<br/>main branch"]
    ADMIN -->|"Auth flow"| OAUTH["GitHub OAuth App"]
    OAUTH -->|"Callback"| PROXY["Netlify OAuth Proxy<br/>api.netlify.com/auth/done"]
    REPO -->|"New commit"| DEPLOY["Triggers both deploys"]

    subgraph CMS Config
        BACKEND["Backend: github<br/>Repo: simonwickes/swp-site<br/>Branch: main"]
        MEDIA["Media: src/assets/images/blog"]
        COLLECTION["Collection: blog<br/>Folder: src/content/blog"]
    end
```

**Config:** `public/admin/config.yml`

---

## Apache Routing (InMotion)

```mermaid
graph TD
    REQ["Incoming Request<br/>simonwickes.com/services/weddings/"]

    REQ --> ROOT_HT["public_html/.htaccess"]

    ROOT_HT --> CHECK1{"URI starts with /swp/?"}
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
| `astro.config.mjs` | Astro config: adapter, sitemap, env schema, Tailwind |
| `src/styles/global.css` | Tailwind v4 theme: colors, fonts, custom variants |
| `src/content.config.ts` | Blog collection schema (Zod) |
| `src/data/services.ts` | Service definitions (slug, title, description) |
| `src/data/gallery.ts` | Pic-Time gallery URL |
| `public/admin/config.yml` | Decap CMS backend, media, collection fields |
| `public/.htaccess` | Apache config for swp/ subfolder (clean URLs, caching) |
| `scripts/htaccess-public_html.txt` | Template for InMotion root .htaccess |
| `netlify.toml` | CORS headers for cross-origin contact form |
| `.github/workflows/deploy-apache.yml` | GitHub Action: build + FTP to InMotion |
| `scripts/deploy.sh` | One-command deploy (pull, stage, commit, push) |
| `scripts/add-images.sh` | Image management (replace gallery/hero/featured) |

---

## API Endpoints

| Endpoint | Type | Purpose |
|----------|------|---------|
| `/api/posts.json` | GET (prerendered) | Blog search data (id, title, category, tags, excerpt) |
| `/_actions/submitContact` | POST (SSR) | Contact form submission (Netlify only) |
