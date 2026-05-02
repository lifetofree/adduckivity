# Facebook Auto-Post & Scheduled Posts Debugging Guide

**Created:** 2026-05-02  
**Status:** Enhanced with comprehensive logging and debugging tools

---

## Common Issues

### 1. Facebook Posts Not Appearing

**Symptoms:** Posts are published but not appearing on Facebook Page

**Debugging Steps:**

1. **Check Configuration**
   ```bash
   # Visit the debug endpoint
   https://immersive.adduckivity.com/api/debug/config
   ```
   
   Expected response:
   ```json
   {
     "environment": { "NODE_ENV": "production", "isDev": false },
     "facebook": {
       "hasAccessToken": true,
       "hasPageId": true,
       "hasSiteUrl": true
     }
   }
   ```

2. **Check Logs**
   - View Cloudflare Pages logs for:
     - `[Facebook] Posting to page:` messages
     - `[API/PUT] shouldPostToFacebook:` status
     - Any error messages

3. **Common Causes:**
   - **Environment Detection**: Code may think it's in development mode
   - **Missing Environment Variables**: FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID not set
   - **Facebook API Errors**: Invalid token, permissions, or API limits
   - **Already Posted**: `facebookPosted` flag prevents duplicate posts

### 2. Scheduled Posts Not Promoting

**Symptoms:** Posts with `status: 'scheduled'` are not becoming `published`

**Debugging Steps:**

1. **Check Maintenance Endpoint**
   ```bash
   # Test the maintenance endpoint
   curl -H "x-maintenance-key: YOUR_KEY" \
     https://immersive.adduckivity.com/api/posts/maintenance
   ```

2. **Check Scheduled Time**
   - Ensure `scheduledAt` is in ISO format: `2026-05-02T10:00:00Z`
   - Verify the time is actually in the past
   - Check timezone (use UTC for consistency)

3. **Check Logs for Promotion**
   ```
   [Scheduled Posts] ✅ PROMOTING: post-slug (scheduled for 2026-05-02T10:00:00.000Z)
   [Scheduled Posts] ✅ Saved promoted post: post-slug
   ```

4. **Common Causes:**
   - **Maintenance cron not running**: Endpoint not being called
   - **Invalid key**: `MAINTENANCE_KEY` mismatch
   - **Future dates**: `scheduledAt` is actually in the future
   - **Invalid date format**: `scheduledAt` is not valid ISO datetime

---

## Environment Variable Checklist

**Required in Cloudflare Dashboard:**

| Variable | Status | Notes |
|---|---|---|
| `FACEBOOK_PAGE_ACCESS_TOKEN` | ✅ Required | Never expires, has `pages_manage_posts` permission |
| `FACEBOOK_PAGE_ID` | ✅ Required | Your Facebook Page ID |
| `SITE_URL` | ✅ Required | `https://immersive.adduckivity.com` |
| `MAINTENANCE_KEY` | ✅ Required | Secret key for maintenance endpoint |

**How to Generate Facebook Access Token:**

1. Go to Facebook Developers → Graph API Explorer
2. Select your app and Page
3. Generate token with `pages_manage_posts` permission
4. Set "Never expire" on the token (important!)

---

## Debug Endpoints

### Configuration Check
```
GET /api/debug/config
```
Returns environment status and binding configuration without exposing secrets.

### Manual Maintenance Trigger
```
GET /api/posts/maintenance
Headers: x-maintenance-key: YOUR_SECRET_KEY
```
Manually triggers scheduled post promotion (useful for testing).

---

## Enhanced Logging

All key operations now log detailed information:

**Facebook Posting:**
- `[Facebook] Posting to page: PAGE_ID for post: SLUG`
- `[Facebook] Posted successfully: POST_ID`
- `[Facebook] Post failed: ERROR_MESSAGE`

**Scheduled Promotion:**
- `[Scheduled Posts] ✅ PROMOTING: slug (scheduled for TIMESTAMP)`
- `[Scheduled Posts] Attempting Facebook post for: slug`
- `[Scheduled Posts] ✅ Facebook post successful for: slug`
- `[Scheduled Posts] ✅ Saved promoted post: slug`

**API Operations:**
- `[API/PUT] Processing post: slug`
- `[API/PUT] shouldPostToFacebook: true/false`
- `[API/PUT] Facebook result: { ok: true/false }`

---

## Test Results

All 73 tests passing, including:
- ✅ Scheduled post promotion logic
- ✅ Facebook posting with various scenarios
- ✅ Duplicate prevention via `facebookPosted` flag
- ✅ Development mode detection

---

## Quick Fixes

### If Facebook posts aren't working:

1. **Verify token is valid:**
   ```bash
   curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID?access_token=YOUR_TOKEN"
   ```

2. **Check permissions:**
   - Token must have `pages_manage_posts` permission
   - Token must not be expired

3. **Test manual post:**
   - Create a test post and set status to `published`
   - Check logs for `[Facebook]` messages

### If scheduled posts aren't promoting:

1. **Manual trigger:**
   ```bash
   curl -H "x-maintenance-key: YOUR_KEY" \
     https://immersive.adduckivity.com/api/posts/maintenance
   ```

2. **Check post data:**
   ```bash
   # View post in KV
   # Look for correct scheduledAt format
   ```

3. **Set up cron:**
   - Add Cloudflare Workers Cron to call maintenance endpoint hourly
   - Or use external service like cron-job.org

---

## Recent Enhancements (2026-05-02)

- ✅ Added comprehensive logging to all Facebook operations
- ✅ Enhanced scheduled post promotion logging
- ✅ Created `/api/debug/config` endpoint for troubleshooting
- ✅ Improved environment detection logic
- ✅ Added detailed error messages
- ✅ All 73 tests passing with new logging

---

**Still having issues?** Check Cloudflare Pages logs for detailed error messages.
