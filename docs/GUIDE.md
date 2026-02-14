# Site Owner Guide

This guide covers everything you need to manage your photography site at **simonwickes.com**.

---

## Table of Contents

1. [Adding Images](#adding-images)
2. [Writing Blog Posts](#writing-blog-posts)
3. [Deploying Changes](#deploying-changes)
4. [Infrastructure Reference](#infrastructure-reference)

---

## Adding Images

Images live in `src/assets/images/` with subfolders for each purpose:

| Folder | Purpose | Notes |
|--------|---------|-------|
| `services/outdoor-portraits/` | Outdoor Portraits gallery | Numbered 01.jpg, 02.jpg, etc. |
| `services/weddings/` | Weddings gallery | |
| `services/commercial/` | Commercial gallery | |
| `services/landscape/` | Landscape gallery | |
| `services/cars/` | Cars gallery | |
| `services/assignments/` | Assignments gallery | |
| `services/events/` | Events gallery | |
| `services/live-performances/` | Live Performances gallery | |
| `hero/` | Homepage carousel | Exactly 4 images (slide-1 through slide-4) |
| `featured/` | Homepage featured grid | Named by category (e.g. wedding-1.jpg) |
| `blog/` | Blog post images | Uploaded via Decap CMS |

### Using the add-images script

The easiest way to add images is with the script:

```bash
./scripts/add-images.sh <target> <source_folder>
```

**Replace a service gallery:**
```bash
# Replace all wedding photos with images from a folder on your Mac
./scripts/add-images.sh services/weddings ~/Photos/wedding-shoot/

# Replace outdoor portraits
./scripts/add-images.sh services/outdoor-portraits ~/Desktop/portrait-edits/
```

**Replace hero carousel** (must provide exactly 4 images):
```bash
./scripts/add-images.sh hero ~/Photos/hero-slides/
```

**Replace featured grid:**
```bash
./scripts/add-images.sh featured ~/Photos/featured-picks/
```

The script will:
- Remove existing images in the target folder
- Copy your new images in, renaming them sequentially (01.jpg, 02.jpg, ...)
- Accept jpg, jpeg, png, and webp formats

### After adding images

Run the deploy script to push them live:

```bash
./scripts/deploy.sh
```

Or with a custom commit message:

```bash
./scripts/deploy.sh "update wedding gallery with March shoot"
```

---

## Writing Blog Posts

You have two ways to create and edit blog posts.

### Option A: Decap CMS (browser-based)

1. Go to **https://swp-site.netlify.app/admin/**
2. Click "Login with GitHub" and authorize
3. Click **New Blog Posts**
4. Fill in the fields:
   - **Title** - Post title
   - **Publish Date** - Select the date (YYYY-MM-DD)
   - **Category** - Choose from: Outdoor Portraits, Weddings, Commercial, Landscape, Cars, Assignments, Events, Live Performances
   - **Tags** - Optional, comma-separated (e.g. "Downtown, Golden Hour")
   - **Featured Image** - Optional, upload a photo for the post header
   - **Featured Image Alt Text** - Describe the image for accessibility
   - **Gallery URL** - Optional Pic-Time link for the full session gallery
   - **Body** - Write your post content in markdown
5. Click **Publish** (or Save Draft to come back later)

The post will auto-deploy to both sites within ~2 minutes.

### Option B: Create a markdown file directly

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Golden Hour at Papago Park"
date: 2026-03-15
category: outdoor-portraits
tags:
  - Arizona
  - golden hour
  - family
featuredImage: ../../assets/images/blog/papago-session.jpg
featuredImageAlt: Family portrait at sunset in Papago Park
galleryUrl: https://simonwickes.pic-time.com/papago-march
author: simon
---

Your post content goes here. You can use **bold**, *italic*,
[links](https://example.com), and images.

## Subheadings work too

Write as much or as little as you like.
```

**Valid categories:** `outdoor-portraits`, `weddings`, `commercial`, `landscape`, `cars`, `assignments`, `events`, `live-performances`

Then deploy:
```bash
./scripts/deploy.sh "new blog post: Golden Hour at Papago Park"
```

### Editing existing posts

- **Via CMS:** Go to the admin panel, click the post, edit, and publish.
- **Via file:** Edit the `.md` file in `src/content/blog/`, then run `./scripts/deploy.sh`.

### Pulling CMS changes locally

If you created/edited posts via the CMS and want them on your local machine:

```bash
git pull origin main
```

The deploy script does this automatically.

---

## Deploying Changes

### Automatic deployment

Every push to the `main` branch triggers:
- **Netlify** rebuilds the full site (with SSR contact form)
- **GitHub Action** builds a static version and FTP uploads to InMotion

Both complete within ~2 minutes.

### One-command deploy

For local changes (images, code edits, blog posts):

```bash
./scripts/deploy.sh                           # Auto-generates commit message
./scripts/deploy.sh "my description of changes"  # Custom message
```

This script:
1. Pulls latest CMS changes (in case you posted from the browser)
2. Stages all changed files
3. Commits with an auto-generated or custom message
4. Pushes to GitHub (triggering both deploys)

### What deploys where

| Feature | Netlify (swp-site.netlify.app) | Apache (simonwickes.com) |
|---------|-------------------------------|--------------------------|
| All pages | Yes | Yes |
| Images | Via Netlify CDN | Static .webp files |
| Contact form | Full server-side (Resend) | Posts to Netlify cross-origin |
| Blog CMS | /admin/ available | Not available (use Netlify URL) |
| SSL | Automatic | Via InMotion |

---

## Infrastructure Reference

This section documents the full setup for future reference.

### Architecture

```
GitHub repo (simonwickes/swp-site)
  |
  |-- push to main
  |
  +---> Netlify (auto-builds)
  |       - Full SSR site with Astro Actions
  |       - Contact form via Resend email API
  |       - Decap CMS admin panel
  |       - Image optimization via Netlify CDN
  |       - URL: swp-site.netlify.app
  |
  +---> GitHub Action (deploy-apache.yml)
          - Builds static version (imageCDN disabled)
          - FTP uploads to InMotion
          - URL: simonwickes.com
```

### GitHub Repository

- **Repo:** github.com/simonwickes/swp-site
- **Branch:** main

### Netlify Setup

- **Site:** swp-site.netlify.app
- **Build command:** `astro build` (auto-detected)
- **Publish directory:** `dist`
- **Environment variables required:**
  - `RESEND_API_KEY` - API key from resend.com for sending contact form emails
  - `CONTACT_EMAIL` - Email address that receives contact form submissions
- **OAuth provider:** GitHub (for Decap CMS authentication)
  - Configured under Site Settings > Access & Identity > OAuth

### GitHub OAuth App (for Decap CMS)

- **Location:** github.com/settings/developers > OAuth Apps
- **Authorization callback URL:** `https://api.netlify.com/auth/done`
- **Client ID and Secret** are configured in Netlify's OAuth settings

### InMotion / Apache Setup

- **Hosting:** InMotion shared hosting (cPanel)
- **Site files location:** `public_html/swp/`
- **Root .htaccess:** `public_html/.htaccess` rewrites all requests into `swp/` subfolder
  - Excludes `/resume` and `/lamvp` (existing sites on the same domain)
  - Source template: `scripts/htaccess-public_html.txt`
- **Inner .htaccess:** `public_html/swp/.htaccess` handles clean URLs, caching, security headers
  - Deployed automatically from `public/.htaccess`

### GitHub Actions Secrets

These are configured at github.com/simonwickes/swp-site/settings/secrets/actions:

| Secret | Description | Example format |
|--------|-------------|----------------|
| `FTP_SERVER` | InMotion FTP hostname | ftp.example.com |
| `FTP_USERNAME` | FTP login username | user@example.com |
| `FTP_PASSWORD` | FTP login password | |
| `FTP_PATH` | Upload path (relative, no leading slash) | public_html/swp/ |

### Key Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Main Astro config (adapter, sitemap, env vars) |
| `public/admin/config.yml` | Decap CMS configuration (fields, categories) |
| `public/.htaccess` | Apache config deployed into swp/ subfolder |
| `scripts/htaccess-public_html.txt` | Template for InMotion's root .htaccess |
| `netlify.toml` | CORS headers for cross-origin contact form |
| `.github/workflows/deploy-apache.yml` | GitHub Action for FTP deploy to InMotion |
| `src/data/services.ts` | Service categories and descriptions |
| `src/data/gallery.ts` | Pic-Time gallery URL |

### Pic-Time Gallery

- **URL:** simonwickes.pic-time.com
- **Config:** `src/data/gallery.ts`
- Individual blog posts can link to specific galleries via the `galleryUrl` frontmatter field

### Adding a New Service Category

If you want to add a new service type:

1. Add it to `src/data/services.ts`
2. Create the page at `src/pages/services/<slug>.astro` (copy an existing one)
3. Create the image folder: `src/assets/images/services/<slug>/`
4. Add the category to `public/admin/config.yml` under the category options
5. Deploy

### Troubleshooting

**Images not showing on simonwickes.com:**
- Check that the GitHub Action completed successfully at github.com/simonwickes/swp-site/actions
- Verify files exist in InMotion File Manager under `public_html/swp/_astro/`
- Hard-refresh the browser (Cmd+Shift+R)

**Blog post not appearing:**
- If posted via CMS: wait ~2 minutes for both deploys
- If posted via file: run `./scripts/deploy.sh`
- Pull latest to your local: `git pull origin main`

**CMS login not working:**
- Go to swp-site.netlify.app/admin/ (not simonwickes.com/admin/)
- Ensure GitHub OAuth App is still configured in Netlify's OAuth settings
- Check that the callback URL is `https://api.netlify.com/auth/done`

**Contact form not working on simonwickes.com:**
- The form posts cross-origin to Netlify. Check that `netlify.toml` has the CORS headers
- Verify `RESEND_API_KEY` and `CONTACT_EMAIL` are set in Netlify environment variables

**Deploy script errors:**
- `non-fast-forward` rejection: The CMS pushed commits you don't have locally. Run `git pull origin main --rebase` then try again
- `No changes to deploy`: Nothing has changed since the last deploy
