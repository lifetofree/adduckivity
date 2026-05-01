# Deployment Guide

**Last updated:** 2026-05-01  
**Project:** immersive-adduckivity (Cloudflare Pages)  
**Production:** https://immersive.adduckivity.com

---

## Normal Deploy Flow

```bash
# 1. Develop on main branch
git checkout main

# 2. Run tests
cd apps/immersive/momentum-3d
npm run test

# 3. Commit and push changes
git add .
git commit -m "feat: description"
git push origin main

# 4. Cloudflare Pages auto-deploys on push
# Or manually deploy:
npm run deploy
```

The `deploy` script runs `build:cf` (next-on-pages) then `wrangler pages deploy`.

---

## Environment Variables

Set in **Cloudflare Dashboard → Workers & Pages → immersive-adduckivity → Settings → Environment variables**.

> Always redeploy after adding/changing env vars — Cloudflare loads them at deploy time.

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini 1.5 Flash (AI assistant + Atomizer fallback) |
| `MINIMAX_API_KEY` | Yes | MiniMax abab6.5s-chat (primary AI for Atomizer + CMS) |
| `UNSPLASH_ACCESS_KEY` | Yes | Unsplash image search proxy |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Yes | Facebook Graph API for auto-posting |
| `FACEBOOK_PAGE_ID` | Yes | Facebook Page ID (`865781466614960`) |
| `SITE_URL` | Yes | Production URL (`https://immersive.adduckivity.com`) |
| `SENDFOX_API_TOKEN` | Yes | SendFox newsletter subscription API |
| `SENDFOX_LIST_ID` | Yes | SendFox list ID (`614719`) |
| `MAINTENANCE_KEY` | Yes | Key for scheduled post maintenance endpoint |

---

## Cloudflare Bindings

Configured in `wrangler.toml` — no dashboard action needed.

```toml
[[kv_namespaces]]
binding = "POSTS_KV"
id = "a07209b5ad9a4972aa82a30d0af3071e"
preview_id = "f264112c6d4e408b973696fa6f6ddb8d"

[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "immersive-assets"
```

**KV Namespace:** Post storage and metadata  
**R2 Bucket:** Image uploads and assets

---

## Local Development

```bash
cd apps/immersive/momentum-3d
npm run dev      # http://localhost:3000
```

Uses `.env.local` for secrets and `dev-kv.ts` in-memory mock for KV.

**`.env.local` keys needed:**
```
GEMINI_API_KEY=your_key_here
MINIMAX_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
SENDFOX_API_TOKEN=your_token_here
SENDFOX_LIST_ID=614719
FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
FACEBOOK_PAGE_ID=865781466614960
SITE_URL=http://localhost:3000
MAINTENANCE_KEY=your_secret_key_here
```

---

## Initial Setup

### 1. Cloudflare Pages Project

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect to GitHub repository
3. Configure build settings:
   - **Build directory:** `apps/immersive/momentum-3d`
   - **Build command:** `npm run build`
   - **Output directory:** `.vercel/output/static`
4. Add environment variables (see above)
5. Configure bindings (see `wrangler.toml`)

### 2. KV Namespace Setup

```bash
# Create KV namespace
wrangler kv:namespace create "POSTS_KV"

# Create preview namespace
wrangler kv:namespace create "POSTS_KV" --preview
```

Update `wrangler.toml` with the returned IDs.

### 3. R2 Bucket Setup

```bash
# Create R2 bucket
wrangler r2 bucket create "immersive-assets"
```

Update `wrangler.toml` with the bucket name.

### 4. Facebook Page Integration

1. Create Facebook Page and App
2. Generate Page Access Token with `pages_manage_posts` permission
3. Note your Page ID from Facebook Page settings
4. Add `FACEBOOK_PAGE_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` to environment variables

### 5. SendFox Newsletter Setup

1. Get SendFox API token from account settings
2. Find your list ID in SendFox dashboard
3. Add `SENDFOX_API_TOKEN` and `SENDFOX_LIST_ID` to environment variables

---

## Rollback

### Via Dashboard
Cloudflare Dashboard → Pages → immersive-adduckivity → Deployments → select previous → Rollback

### Via Git
```bash
# Checkout previous commit
git checkout <commit-hash>

# Redeploy
cd apps/immersive/momentum-3d && npm run deploy

# Return to main
git checkout main
```

---

## Scheduled Post Automation

Set up external cron job to hit maintenance endpoint:

```bash
# Every hour
curl "https://immersive.adduckivity.com/api/posts/maintenance?key=YOUR_MAINTENANCE_KEY"
```

Or use Cloudflare Workers Cron:
```javascript
// worker.js
export default {
  async scheduled(event, env, ctx) {
    await fetch(`${env.SITE_URL}/api/posts/maintenance?key=${env.MAINTENANCE_KEY}`)
  }
}
```

---

## Troubleshooting

### Build Failures
- Check Node.js version (use 20.x)
- Verify all dependencies installed: `npm install`
- Check build logs in Cloudflare Dashboard

### Runtime Errors
- Verify all environment variables set
- Check KV/R2 bindings configured
- Enable debug logging in production if needed

### Tests Failing Locally
- Ensure all dependencies installed
- Clear cache: `rm -rf node_modules .next && npm install`
- Check Node.js version compatibility

---

## Branch Strategy

| Branch | Deployment URL | Auto-Deploy |
|---|---|---|
| `main` | https://immersive.adduckivity.com | Yes |
| Pull Requests | Preview URL | Yes |

---

## Quick Reference

```bash
# Development
cd apps/immersive/momentum-3d
npm run dev          # http://localhost:3000

# Testing
npm run test         # Run 42 tests

# Build
npm run build        # Production build
npm run build:cf     # Build for Cloudflare

# Deployment
npm run deploy       # Build + deploy to Cloudflare Pages
```
