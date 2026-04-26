# Deployment Guide

**Last updated:** 2026-04-26  
**Project:** immersive-adduckivity (Cloudflare Pages)  
**Production:** https://immersive.adduckivity.com

---

## Normal Deploy Flow

```bash
# 1. Develop on dev branch
git checkout dev

# 2. Run tests
cd apps/immersive/momentum-3d
npm run test

# 3. Merge to main
git checkout main && git merge dev

# 4. Deploy to production
cd apps/immersive/momentum-3d && npm run deploy
```

The `deploy` script runs `build:cf` (next-on-pages) then `wrangler pages deploy`.

---

## Environment Variables

Set in **Cloudflare Dashboard → Workers & Pages → immersive-adduckivity → Settings → Environment variables**.

> Always redeploy after adding/changing env vars — Cloudflare loads them at deploy time.

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini AI |
| `UNSPLASH_ACCESS_KEY` | Yes | Unsplash image search |
| `SENDFOX_API_TOKEN` | Yes | Newsletter subscribe |
| `SENDFOX_LIST_ID` | Yes | `614719` |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Yes | Auto-post on publish |
| `FACEBOOK_PAGE_ID` | Yes | `865781466614960` |
| `SITE_URL` | Yes | `https://immersive.adduckivity.com` |

---

## KV Namespace

Configured in `wrangler.toml` — no dashboard action needed.

```toml
[[kv_namespaces]]
binding = "POSTS_KV"
id = "a07209b5ad9a4972aa82a30d0af3071e"
preview_id = "f264112c6d4e408b973696fa6f6ddb8d"
```

---

## Local Development

```bash
cd apps/immersive/momentum-3d
npm run dev      # http://localhost:3000
```

Uses `.env.local` for secrets and `dev-kv.ts` in-memory mock for KV.

**`.env.local` keys needed:**
```
GEMINI_API_KEY=
UNSPLASH_ACCESS_KEY=
SENDFOX_API_TOKEN=
SENDFOX_LIST_ID=614719
```

---

## Rollback

Via Cloudflare Dashboard → Pages → immersive-adduckivity → Deployments → select previous → Rollback.

Or redeploy a previous git commit:
```bash
git checkout <commit-hash>
cd apps/immersive/momentum-3d && npm run deploy
```

---

## Branch → Environment Mapping

| Branch | Deployment URL |
|---|---|
| `main` | https://immersive.adduckivity.com (production) |
| `dev` | https://dev.immersive-adduckivity.pages.dev |

---

## Quick Reference

```bash
npm run dev          # local dev
npm run test         # run test suite (32 tests)
npm run build:cf     # build for Cloudflare
npm run deploy       # build + deploy
```
