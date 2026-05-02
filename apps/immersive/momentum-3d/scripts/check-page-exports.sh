#!/bin/bash
# scripts/check-page-exports.sh
# Ensures edge runtime pages have explicit dynamic rendering exports.
# Cloudflare Pages requires 'force-dynamic' for KV access in edge runtime.

set -e

PAGES=(
  "src/app/blog/page.tsx"
  "src/app/blog/[slug]/page.tsx"
  "src/app/content/page.tsx"
  "src/app/content/edit/page.tsx"
  "src/app/content/new/page.tsx"
  "src/app/api/posts/route.ts"
  "src/app/api/posts/save/route.ts"
  "src/app/api/posts/maintenance/route.ts"
  "src/app/api/ai/route.ts"
  "src/app/api/ai/atomize/route.ts"
  "src/app/api/unsplash/route.ts"
  "src/app/api/upload/route.ts"
  "src/app/api/subscribe/route.ts"
  "src/app/api/stats/route.ts"
  "src/app/api/track/route.ts"
  "src/app/api/assets/[...key]/route.ts"
)

ERRORS=0

for page in "${PAGES[@]}"; do
  if [[ ! -f "$page" ]]; then
    continue
  fi

  # Check if file uses edge runtime AND is not an API route
  # API routes (src/app/api/*) are dynamic by default and don't need explicit export
  if grep -q "runtime.*edge" "$page" && [[ ! "$page" =~ /api/ ]]; then
    # Edge runtime requires explicit dynamic export
    if ! grep -q "dynamic.*force-dynamic" "$page"; then
      echo "ERROR: $page uses 'edge' runtime but missing 'export const dynamic = force-dynamic'"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

if [[ $ERRORS -gt 0 ]]; then
  echo ""
  echo "Found $ERRORS page(s) missing dynamic export. Add 'export const dynamic = force-dynamic' to edge runtime pages."
  exit 1
fi

echo "All pages have correct dynamic exports."
exit 0
