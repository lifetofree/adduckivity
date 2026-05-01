#!/bin/bash

# Quick script to check production posts and Facebook status
SITE_URL="${SITE_URL:-https://immersive.adduckivity.com}"

echo "🔍 Checking production posts at: $SITE_URL"
echo ""

# Fetch posts from production
RESPONSE=$(curl -s "$SITE_URL/api/posts")

# Check if we got valid JSON
if echo "$RESPONSE" | jq -e '.posts' > /dev/null 2>&1; then
  echo "✅ Successfully fetched posts"
  echo ""
  
  # Count posts by status
  TOTAL=$(echo "$RESPONSE" | jq '.posts | length')
  PUBLISHED=$(echo "$RESPONSE" | jq '[.posts[] | select(.status == "published")] | length')
  SCHEDULED=$(echo "$RESPONSE" | jq '[.posts[] | select(.status == "scheduled")] | length')
  NOT_POSTED=$(echo "$RESPONSE" | jq '[.posts[] | select(.status == "published" and .facebookPosted != true)] | length')
  
  echo "📊 Post Statistics:"
  echo "   Total posts: $TOTAL"
  echo "   Published: $PUBLISHED"
  echo "   Scheduled: $SCHEDULED"
  echo "   Published but NOT on Facebook: $NOT_POSTED"
  echo ""
  
  # Show published posts not on Facebook
  if [ "$NOT_POSTED" -gt 0 ]; then
    echo "📱 Published posts missing from Facebook:"
    echo "$RESPONSE" | jq -r '.posts[] | select(.status == "published" and .facebookPosted != true) | "   • \(.slug) - \(.title)"'
    echo ""
    echo "💡 To manually post one to Facebook, use:"
    FIRST_SLUG=$(echo "$RESPONSE" | jq -r '.posts[] | select(.status == "published" and .facebookPosted != true) | .slug' | head -1)
    echo "   curl -X PUT \"$SITE_URL/api/posts?slug=$FIRST_SLUG\" \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"status\":\"published\"}'"
  else
    echo "✨ All published posts are on Facebook!"
  fi
  
else
  echo "❌ Failed to fetch posts from production"
  echo "   Response: $RESPONSE"
fi
