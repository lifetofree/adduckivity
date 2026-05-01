# Scheduled Posts & Facebook Auto-Post Setup Guide

## Problem Identified
Your scheduled posts weren't publishing because **no CRON job was set up** to trigger the maintenance endpoint. The system has a "lazy fallback" that promotes posts when people visit your site, but without a CRON job, posts only publish sporadically.

## Solution Implemented

### Files Created/Modified:
1. **`public/_worker.js`** - Cloudflare Pages Function that handles CRON triggers
2. **`wrangler.toml`** - Updated with CRON schedule (runs every hour)
3. **`scripts/test-scheduled-posts.js`** - Test script to verify everything works

## Setup Instructions

### Step 1: Verify Environment Variables
Make sure these are set in your Cloudflare Pages dashboard:
- `MAINTENANCE_KEY` - A secret key to protect the maintenance endpoint
- `FACEBOOK_PAGE_ACCESS_TOKEN` - Your Facebook page access token
- `FACEBOOK_PAGE_ID` - Your Facebook page ID
- `SITE_URL` - Your site URL (https://immersive.adduckivity.com)

### Step 2: Deploy Changes
```bash
cd apps/immersive/momentum-3d
npm run deploy
```

### Step 3: Set Up CRON Trigger in Cloudflare
After deployment, you need to configure the CRON trigger:

**Option A: Via Cloudflare Dashboard (Recommended)**
1. Go to Cloudflare Dashboard → Pages → immersive-adduckivity
2. Go to Settings → Functions → Cron Triggers
3. Add a new cron trigger with schedule: `0 * * * *` (every hour)
4. Set the path to: `/api/posts/maintenance`

**Option B: Via Wrangler (Advanced)**
The `wrangler.toml` file already includes the cron schedule, but Cloudflare Pages CRON triggers require dashboard configuration.

### Step 4: Test the Setup

**Test locally:**
```bash
npm run dev
node scripts/test-scheduled-posts.js
```

**Test in production:**
```bash
# Replace YOUR_KEY with your actual MAINTENANCE_KEY value
curl -H "x-maintenance-key: YOUR_KEY" https://immersive.adduckivity.com/api/posts/maintenance
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-04-30T10:00:00.000Z",
  "publishedCount": 5
}
```

## How It Works

### The Promotion System:
1. **CRON Job** (runs hourly) → Calls `/api/posts/maintenance`
2. **Maintenance Endpoint** → Finds overdue scheduled posts
3. **Facebook Integration** → Posts to Facebook if not already posted
4. **KV Storage** → Updates post status to `published` with `facebookPosted: true`

### The Safety Systems:
- **Duplicate Prevention**: `facebookPosted` flag prevents double-posting
- **Lock Mechanism**: 10-minute KV lock prevents race conditions
- **Error Handling**: Failed promotions don't break other posts

## Testing Checklist

- [ ] Deploy `_worker.js` and updated `wrangler.toml`
- [ ] Configure CRON trigger in Cloudflare dashboard
- [ ] Set `MAINTENANCE_KEY` in environment variables
- [ ] Run test script to verify endpoint works
- [ ] Create a test scheduled post with past date
- [ ] Run maintenance manually to test promotion
- [ ] Check Facebook page for the test post
- [ ] Verify the post shows as published in your CMS

## Troubleshooting

**Scheduled posts still not publishing?**
1. Check CRON trigger is active in Cloudflare dashboard
2. Verify `MAINTENANCE_KEY` matches between env vars and test
3. Check Cloudflare Workers logs for errors
4. Make sure Facebook credentials are valid

**Facebook not posting?**
1. Verify `FACEBOOK_PAGE_ACCESS_TOKEN` has `pages_manage_posts` permission
2. Check token hasn't expired (tokens expire after 60 days)
3. Test with Facebook Graph API Explorer first

**CRON not working?**
1. Make sure you're using Cloudflare Pages (not Workers)
2. CRON triggers must be configured via dashboard, not wrangler.toml alone
3. Check the schedule format: `0 * * * *` = every hour at minute 0

## Next Steps

Once this is working:
- Scheduled posts will automatically publish every hour
- Facebook posts will happen automatically on first publish
- You can schedule content in advance and forget about it

*Last updated: 2026-04-30*
