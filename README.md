# Simon Wickes Photography

Professional photography portfolio and blog at [simonwickes.com](https://simonwickes.com).

Built with [Astro](https://astro.build/) and [Tailwind CSS v4](https://tailwindcss.com/), deployed as a fully static site to Apache hosting via GitHub Actions.

## Features

- **Service galleries** with PhotoSwipe lightbox (8 categories)
- **Blog** with Decap CMS for browser-based editing
- **Contact form** via EmailJS (client-side, no server required)
- **Dark/light mode** with system preference detection
- **View Transitions** for smooth page navigation
- **SEO** with sitemap, Open Graph, and structured data
- **Image optimization** via Astro's Sharp pipeline (auto .webp)

## Tech Stack

| | |
|---|---|
| **Framework** | Astro 5 (static output) |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **CMS** | Decap CMS with GitHub PKCE auth |
| **Email** | EmailJS (@emailjs/browser) |
| **Hosting** | InMotion (Apache shared hosting) |
| **CI/CD** | GitHub Actions → FTP deploy |
| **Galleries** | PhotoSwipe lightbox, Swiper carousel |
| **Search** | Fuse.js (client-side blog search) |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`.

## Project Structure

```
├── public/
│   ├── admin/config.yml      # Decap CMS configuration
│   └── .htaccess              # Apache config (clean URLs, caching)
├── src/
│   ├── assets/images/         # Source images (optimized at build time)
│   │   ├── hero/              # Homepage carousel (4 slides)
│   │   ├── featured/          # Homepage grid
│   │   ├── services/          # Gallery images by category
│   │   └── blog/              # Blog post images
│   ├── components/            # Astro/UI components
│   ├── content/blog/          # Blog posts (markdown)
│   ├── data/                  # Service definitions, gallery config
│   ├── layouts/               # BaseLayout, PageLayout
│   ├── pages/                 # Routes
│   └── styles/global.css      # Tailwind theme config
├── scripts/
│   ├── add-images.sh          # Batch image management
│   ├── deploy.sh              # One-command deploy
│   └── htaccess-public_html.txt  # InMotion root .htaccess template
└── .github/workflows/
    └── deploy-apache.yml      # CI/CD: build + FTP to InMotion
```

## Deployment

Every push to `main` triggers a GitHub Action that builds the site and uploads it to InMotion via FTP. Deploys complete in ~2 minutes.

**Quick deploy from local:**

```bash
./scripts/deploy.sh                    # Auto-generated commit message
./scripts/deploy.sh "update galleries" # Custom message
```

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `FTP_SERVER` | InMotion FTP hostname |
| `FTP_USERNAME` | FTP login |
| `FTP_PASSWORD` | FTP password |
| `FTP_PATH` | Upload path (e.g. `public_html/swp/`) |

## Content Management

**Blog posts** can be created via:
- **Decap CMS** at `simonwickes.com/admin/` (browser-based, authenticates with GitHub)
- **Markdown files** in `src/content/blog/`

**Gallery images** are managed with the add-images script:
```bash
./scripts/add-images.sh services/weddings ~/Photos/wedding-shoot/
```

See [docs/GUIDE.md](docs/GUIDE.md) for the full site owner guide.

## Documentation

- [docs/GUIDE.md](docs/GUIDE.md) — Site owner guide (images, blogging, deploying, troubleshooting)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Technical architecture with Mermaid diagrams
