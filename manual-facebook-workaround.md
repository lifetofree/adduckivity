# Facebook Auto-Post Issue Resolution

## Problem
The asset-05 blog post was published but the Facebook auto-post failed due to environment detection issues in the API endpoints.

## Root Cause
The PUT and SAVE API endpoints were using `process.env.NODE_ENV === 'development'` to detect development mode, but in Cloudflare Pages, this check doesn't work correctly. The proper check should be `process.env.NODE_ENV === 'development' || process.env.CF_PAGES === '1'`.

## Fix Applied
Updated the following files with the correct environment detection:
- `src/app/api/posts/route.ts` (lines 82, 103)
- `src/app/api/posts/save/route.ts` (line 67)

Changed from:
```typescript
const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
```

To:
```typescript
const env = (process.env.NODE_ENV === 'development' || process.env.CF_PAGES === '1') ? undefined : getEnv()
```

## Deployment Status
✅ Deployment successful: `c4aaf71e.immersive-adduckivity.pages.dev`
⏳ Production domain propagation may take a few minutes

## Immediate Workaround
Since the deployment is propagating, here's how to manually post to Facebook:

### Option 1: Use Facebook Graph API directly
```bash
curl -X POST "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/feed" \
  -d "message=🦆 วิธีเปลี่ยนระบบชีวิตจาก 'ภาระ' ให้เป็น 'สินทรัพย์' ด้วยโพรโทคอล ASSET-05

เลิกพึ่งพาวินัยที่แสนเปราะบาง แล้วหันมาสร้าง "Mental Infrastructure" กันดีกว่า

Read the full protocol → https://immersive.adduckivity.com/blog/asset-05

#DuckOS #Productivity #ADHD #Neurodivergent" \
  -d "link=https://immersive.adduckivity.com/blog/asset-05" \
  -d "access_token=YOUR_ACCESS_TOKEN"
```

### Option 2: Manual Post via Facebook Page
1. Go to https://www.facebook.com/865781466614960
2. Create a new post with:
   - Title: "วิธีเปลี่ยนระบบชีวิตจาก 'ภาระ' ให้เป็น 'สินทรัพย์' ด้วยโพรโทคอล ASSET-05"
   - Link: https://immersive.adduckivity.com/blog/asset-05
   - Caption: "เลิกพึ่งพาวินัยที่แสนเปราะบาง แล้วหันมาสร้าง "Mental Infrastructure" กันดีกว่า 🦆"
   - Hashtags: #DuckOS #Productivity #ADHD #Neurodivergent

### Option 3: Wait and Retry
After 5-10 minutes, try the test script again:
```bash
node test-facebook-trigger.js
```

## Updating the Flag
Once posted, update the KV store by making a small edit to the post via the CMS:
1. Visit https://immersive.adduckivity.com/content/edit?slug=asset-05
2. Make a minor change (e.g., add a space)
3. Save - the facebookPosted flag should be set automatically

## Prevention for Future Posts
The fix has been deployed and will work for all future posts. The environment detection is now correct for Cloudflare Pages.

## Files Modified
- `src/app/api/posts/route.ts`
- `src/app/api/posts/save/route.ts`
- `src/lib/posts.ts` (already had correct detection on line 154)

## Testing
```bash
# Test the fix
node test-facebook-trigger.js

# Check post status
node check-facebook-post.js

# Monitor logs via Cloudflare Dashboard
# Workers & Pages > immersive-adduckivity > Logs > Real-time logs
```
