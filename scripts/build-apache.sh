#!/bin/bash
#
# Build a static version of the site for Apache shared hosting.
#
# Usage:
#   ./scripts/build-apache.sh [subfolder]
#
# Examples:
#   ./scripts/build-apache.sh new       # Deploy to simonwickes.com/new/
#   ./scripts/build-apache.sh           # Deploy to site root
#
# Output: dist-apache/ ready to upload via FTP/SFTP
#
# Note: The contact form requires Netlify server functions and will NOT work
# on Apache. All other features (galleries, blog, navigation) work fine.

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SUBFOLDER="${1:-}"
OUTPUT_DIR="$SITE_ROOT/dist-apache"

echo "Building static site for Apache..."
[ -n "$SUBFOLDER" ] && echo "Subfolder: /$SUBFOLDER/"

# 1. Create a temporary astro config for static build
TEMP_CONFIG="$SITE_ROOT/astro.config.apache.mjs"
cat > "$TEMP_CONFIG" << 'CONFIGEOF'
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://simonwickes.com",
  BASEPATH_PLACEHOLDER
  output: "static",
  build: {
    format: "directory",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/api/") && !page.includes("/image-test") && !page.includes("/admin"),
      serialize(item) {
        if (item.url.includes("/blog/")) {
          item.changefreq = "weekly";
          item.priority = 0.7;
        } else if (item.url.includes("/services/")) {
          item.changefreq = "monthly";
          item.priority = 0.8;
        } else if (item.url === "https://simonwickes.com/") {
          item.changefreq = "weekly";
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
});
CONFIGEOF

if [ -n "$SUBFOLDER" ]; then
  sed -i '' "s|BASEPATH_PLACEHOLDER|base: \"/$SUBFOLDER\",|" "$TEMP_CONFIG"
else
  sed -i '' "s|BASEPATH_PLACEHOLDER||" "$TEMP_CONFIG"
fi

# 2. Build with the static config
echo "Running Astro build (static output)..."
npx astro build --config astro.config.apache.mjs 2>&1

# 3. Move output
rm -rf "$OUTPUT_DIR"
mv "$SITE_ROOT/dist" "$OUTPUT_DIR"

# 4. Rewrite hardcoded internal links in HTML if subfolder is set
if [ -n "$SUBFOLDER" ]; then
  echo "Rewriting internal links with /$SUBFOLDER prefix..."

  # Patterns to rewrite: href="/...", fetch("/api/...")
  # We must NOT double-prefix paths that Astro already prefixed
  find "$OUTPUT_DIR" -name "*.html" -o -name "*.js" | while read -r file; do
    # Prefix bare absolute paths that Astro didn't already handle
    # Match href="/ or src="/ or fetch("/ but NOT href="/new/ (already prefixed)
    sed -i '' \
      -e "s|href=\"/\"|href=\"/$SUBFOLDER/\"|g" \
      -e "s|href=\"/services/|href=\"/$SUBFOLDER/services/|g" \
      -e "s|href=\"/contact/|href=\"/$SUBFOLDER/contact/|g" \
      -e "s|href=\"/blog|href=\"/$SUBFOLDER/blog|g" \
      -e "s|href=\"/galleries/|href=\"/$SUBFOLDER/galleries/|g" \
      -e "s|href=\"/faq/|href=\"/$SUBFOLDER/faq/|g" \
      -e "s|href=\"/admin/|href=\"/$SUBFOLDER/admin/|g" \
      -e "s|fetch(\"/api/|fetch(\"/$SUBFOLDER/api/|g" \
      -e "s|href=\"/favicon|href=\"/$SUBFOLDER/favicon|g" \
      -e "s|\.href=\"/admin/|.href=\"/$SUBFOLDER/admin/|g" \
      -e "s|startsWith(\"/blog|startsWith(\"/$SUBFOLDER/blog|g" \
      "$file"
  done

  # Fix double-prefixed paths (in case Astro already added some)
  find "$OUTPUT_DIR" -name "*.html" -o -name "*.js" | while read -r file; do
    sed -i '' "s|/$SUBFOLDER/$SUBFOLDER/|/$SUBFOLDER/|g" "$file"
  done
fi

# 5. Create .htaccess for clean URLs
cat > "$OUTPUT_DIR/.htaccess" << 'HTEOF'
# Enable rewrite engine
RewriteEngine On

# Handle clean URLs — serve directory index.html for paths without extensions
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# If path is a directory, serve its index.html
DirectoryIndex index.html

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Block access to source maps in production
<FilesMatch "\.map$">
  Require all denied
</FilesMatch>
HTEOF

# 6. Remove server-only files that won't work on Apache
rm -rf "$OUTPUT_DIR/_worker.js" "$OUTPUT_DIR/.netlify" "$OUTPUT_DIR/_redirects" 2>/dev/null || true

# 7. Clean up temp config
rm "$TEMP_CONFIG"

echo ""
echo "Done! Static build ready at: dist-apache/"
echo ""
echo "Upload instructions:"
if [ -n "$SUBFOLDER" ]; then
  echo "  Upload the contents of dist-apache/ to the '/$SUBFOLDER/' folder on your server."
else
  echo "  Upload the contents of dist-apache/ to the root of your server."
fi
echo ""
echo "Note: The contact form requires Netlify and will not work on Apache."
echo "      All other features work as static pages."
