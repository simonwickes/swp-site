#!/bin/bash
#
# Add images to the Simon Wickes Photography site.
#
# Usage:
#   ./scripts/add-images.sh <target> <source_folder>
#
# Targets:
#   services/<slug>  — Gallery images for a service page (e.g., services/weddings)
#   hero             — Hero carousel slides (exactly 4 images)
#   featured         — Homepage featured grid images
#
# Examples:
#   ./scripts/add-images.sh services/outdoor-portraits ~/Photos/portraits/
#   ./scripts/add-images.sh hero ~/Photos/hero-picks/
#   ./scripts/add-images.sh featured ~/Photos/best-of/
#
# Images are copied and numbered sequentially (01.jpg, 02.jpg, ...).
# Existing placeholder images are removed first.
# Supports: jpg, jpeg, png, webp

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS_DIR="$SITE_ROOT/src/assets/images"

usage() {
  echo "Usage: $0 <target> <source_folder>"
  echo ""
  echo "Targets:"
  echo "  services/<slug>  Gallery images (e.g., services/weddings)"
  echo "  hero             Hero carousel (4 images)"
  echo "  featured         Homepage featured grid"
  echo ""
  echo "Available service slugs:"
  for dir in "$ASSETS_DIR/services"/*/; do
    [ -d "$dir" ] && echo "  $(basename "$dir")"
  done
  exit 1
}

[ $# -lt 2 ] && usage

TARGET="$1"
SOURCE="$2"

if [ ! -d "$SOURCE" ]; then
  echo "Error: Source folder '$SOURCE' does not exist."
  exit 1
fi

# Count source images
IMG_COUNT=$(find "$SOURCE" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | wc -l | tr -d ' ')

if [ "$IMG_COUNT" -eq 0 ]; then
  echo "Error: No images found in '$SOURCE'."
  echo "Supported formats: jpg, jpeg, png, webp"
  exit 1
fi

case "$TARGET" in
  services/*)
    SLUG="${TARGET#services/}"
    DEST="$ASSETS_DIR/services/$SLUG"
    if [ ! -d "$DEST" ]; then
      echo "Error: Service '$SLUG' not found."
      echo ""
      echo "Available services:"
      for dir in "$ASSETS_DIR/services"/*/; do
        [ -d "$dir" ] && echo "  $(basename "$dir")"
      done
      exit 1
    fi
    echo "Adding $IMG_COUNT images to service: $SLUG"
    echo "Target: $DEST"
    ;;
  hero)
    DEST="$ASSETS_DIR/hero"
    if [ "$IMG_COUNT" -ne 4 ]; then
      echo "Warning: Hero carousel expects exactly 4 images, got $IMG_COUNT."
      read -p "Continue anyway? (y/n) " -n 1 -r
      echo
      [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
    fi
    echo "Adding $IMG_COUNT images to hero carousel"
    echo "Target: $DEST"
    ;;
  featured)
    DEST="$ASSETS_DIR/featured"
    echo "Adding $IMG_COUNT images to featured grid"
    echo "Target: $DEST"
    ;;
  *)
    echo "Error: Unknown target '$TARGET'."
    usage
    ;;
esac

# Confirm before replacing
EXISTING=$(find "$DEST" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | wc -l | tr -d ' ')
if [ "$EXISTING" -gt 0 ]; then
  echo ""
  echo "This will replace $EXISTING existing images."
  read -p "Continue? (y/n) " -n 1 -r
  echo
  [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
  # Remove existing images
  find "$DEST" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -delete
  echo "Removed existing images."
fi

# Copy and number images sequentially
COUNT=0
if [ "$TARGET" = "featured" ]; then
  # Featured images keep descriptive names — copy as-is
  for img in $(find "$SOURCE" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | sort); do
    BASENAME=$(basename "$img")
    cp "$img" "$DEST/$BASENAME"
    COUNT=$((COUNT + 1))
  done
else
  # Service and hero images get numbered names
  for img in $(find "$SOURCE" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | sort); do
    COUNT=$((COUNT + 1))
    EXT="${img##*.}"
    EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
    # Normalize jpeg to jpg
    [ "$EXT" = "jpeg" ] && EXT="jpg"
    NUM=$(printf "%02d" "$COUNT")
    if [ "$TARGET" = "hero" ]; then
      cp "$img" "$DEST/slide-$COUNT.$EXT"
    else
      cp "$img" "$DEST/$NUM.$EXT"
    fi
  done
fi

echo ""
echo "Done! Added $COUNT images to $DEST"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to preview"
echo "  2. Commit: git add $DEST && git commit -m 'feat: add $TARGET images'"
