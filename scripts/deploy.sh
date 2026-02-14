#!/bin/bash
#
# Deploy changes to both Netlify and InMotion.
# Commits any staged/unstaged changes in src/assets/images/,
# pulls CMS changes, and pushes to trigger both deploys.
#
# Usage:
#   ./scripts/deploy.sh                    # Auto-generates commit message
#   ./scripts/deploy.sh "my commit message" # Custom message

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE_ROOT"

MSG="${1:-}"

# Pull CMS changes first (blog posts created via Decap)
echo "Pulling latest changes..."
git pull origin main --rebase

# Check for uncommitted image changes
IMAGE_CHANGES=$(git status --short src/assets/images/ | wc -l | tr -d ' ')
OTHER_CHANGES=$(git status --short | grep -v 'src/assets/images/' | wc -l | tr -d ' ')

if [ "$IMAGE_CHANGES" -eq 0 ] && [ "$OTHER_CHANGES" -eq 0 ]; then
  echo "No changes to deploy."
  exit 0
fi

# Stage images
if [ "$IMAGE_CHANGES" -gt 0 ]; then
  echo "Staging $IMAGE_CHANGES image changes..."
  git add src/assets/images/
fi

# Stage other changes if any
if [ "$OTHER_CHANGES" -gt 0 ]; then
  echo "Staging $OTHER_CHANGES other changes..."
  git add -A
fi

# Generate commit message if not provided
if [ -z "$MSG" ]; then
  # Build a message from what changed
  PARTS=()
  if [ "$IMAGE_CHANGES" -gt 0 ]; then
    # List which image folders changed
    FOLDERS=$(git diff --cached --name-only src/assets/images/ | sed 's|src/assets/images/||' | cut -d'/' -f1-2 | sort -u | tr '\n' ', ' | sed 's/,$//')
    PARTS+=("update images: $FOLDERS")
  fi
  if [ "$OTHER_CHANGES" -gt 0 ]; then
    PARTS+=("update site content")
  fi
  MSG=$(IFS=', '; echo "feat: ${PARTS[*]}")
fi

echo "Committing: $MSG"
git commit -m "$MSG"

echo "Pushing to GitHub..."
git push origin main

echo ""
echo "Deployed! Both sites will update within ~2 minutes:"
echo "  Netlify:  https://swp-site.netlify.app"
echo "  Apache:   https://simonwickes.com"
