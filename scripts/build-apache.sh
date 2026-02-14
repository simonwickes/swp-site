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
# Note: This script is for manual builds with custom subfolder paths.
# The GitHub Action handles automated deploys on push to main.

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SUBFOLDER="${1:-}"
OUTPUT_DIR="$SITE_ROOT/dist-apache"

echo "Building static site for Apache..."
[ -n "$SUBFOLDER" ] && echo "Subfolder: /$SUBFOLDER/"

# 1. Create a temporary astro config by copying the real one and injecting base path
TEMP_CONFIG="$SITE_ROOT/astro.config.apache.mjs"
cp "$SITE_ROOT/astro.config.mjs" "$TEMP_CONFIG"

if [ -n "$SUBFOLDER" ]; then
  # Inject base path after the site: line in the real config
  sed "s|site: \"https://simonwickes.com\"|site: \"https://simonwickes.com\",\n  base: \"/$SUBFOLDER\"|" \
    "$SITE_ROOT/astro.config.mjs" > "$TEMP_CONFIG"
fi

# 2. Build with the temporary config (or original if no subfolder)
echo "Running Astro build (static output)..."
if [ -n "$SUBFOLDER" ]; then
  npx astro build --config astro.config.apache.mjs 2>&1
else
  npx astro build 2>&1
fi

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

# 5. Copy .htaccess from source (single source of truth for server config)
cp "$SITE_ROOT/public/.htaccess" "$OUTPUT_DIR/.htaccess"

# 6. Clean up temp config if created
[ -n "$SUBFOLDER" ] && rm -f "$TEMP_CONFIG"

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
echo "All features work as static pages (contact form uses EmailJS client-side)."
