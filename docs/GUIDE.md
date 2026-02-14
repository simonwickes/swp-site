# Site Owner Guide

This guide covers everything you need to manage your photography site at **simonwickes.com**.

---

## Table of Contents

1. [Adding Images](#adding-images)
2. [Writing Blog Posts](#writing-blog-posts)
3. [Deploying Changes](#deploying-changes)
4. [Contact Form](#contact-form)
5. [Infrastructure Reference](#infrastructure-reference)

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

1. Go to **https://simonwickes.com/admin/**
2. Click "Login with GitHub" and authorize via GitHub's PKCE flow
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

The post will auto-deploy within ~2 minutes.

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

Every push to the `main` branch triggers a **GitHub Action** that:
1. Builds the static site with Astro
2. Uploads it via FTP to InMotion hosting

The deploy completes within ~2 minutes.

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
4. Pushes to GitHub (triggering the deploy)

---

## Contact Form

The contact form at `/contact/` uses **EmailJS** to send emails directly from the browser. No server required.

### How it works

1. User fills in the form (name, email, message)
2. Client-side validation checks required fields
3. EmailJS sends the email via your configured service
4. You receive the enquiry at your email address

### EmailJS configuration

The credentials are in `src/components/contact/ContactForm.astro`:
- **Service ID:** `service_qvjo8vq`
- **Template ID:** `template_bnq8oml`
- **Public Key:** `QeJTMZYCoupaJT3D4`

To manage your EmailJS account (change templates, view logs, etc.), log in at [emailjs.com](https://www.emailjs.com/).

---

## Infrastructure Reference

This section documents the full setup for future reference.

### Architecture

```
GitHub repo (simonwickes/swp-site)
  |
  |-- push to main
  |
  +---> GitHub Action (deploy-apache.yml)
          - Builds static site with Astro
          - FTP uploads to InMotion
          - URL: simonwickes.com
```

### GitHub Repository

- **Repo:** github.com/simonwickes/swp-site
- **Branch:** main

### InMotion / Apache Setup

- **Hosting:** InMotion shared hosting (cPanel)
- **Site files location:** `public_html/swp/`
- **Root .htaccess:** `public_html/.htaccess` rewrites all requests into `swp/` subfolder
  - Excludes `/resume` and `/lamvp` (existing sites on the same domain)
  - Redirects `www.simonwickes.com` to `simonwickes.com`
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
| `astro.config.mjs` | Main Astro config (sitemap, Tailwind) |
| `public/admin/config.yml` | Decap CMS configuration (fields, categories) |
| `public/.htaccess` | Apache config deployed into swp/ subfolder |
| `scripts/htaccess-public_html.txt` | Template for InMotion's root .htaccess |
| `.github/workflows/deploy-apache.yml` | GitHub Action: build + FTP to InMotion |
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
- If posted via CMS: wait ~2 minutes for the deploy
- If posted via file: run `./scripts/deploy.sh`
- Pull latest to your local: `git pull origin main`

**CMS login not working:**
- Visit `simonwickes.com/admin/` and authorize with GitHub
- CMS uses GitHub PKCE auth (no third-party OAuth proxy needed)
- Ensure your GitHub account has write access to the `simonwickes/swp-site` repo

**Contact form not working:**
- Check the browser console for errors
- Verify your EmailJS account is active at emailjs.com
- The free tier allows 200 emails/month

**Deploy script errors:**
- `non-fast-forward` rejection: The CMS pushed commits you don't have locally. Run `git pull origin main --rebase` then try again
- `No changes to deploy`: Nothing has changed since the last deploy
