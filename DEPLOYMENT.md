# 🚀 Cloudflare Pages Deployment Guide

**Last Updated:** 2026-04-22  
**Project:** Adduckivity Immersive 3D Content Studio  
**Status:** Production Ready

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Cloudflare account (free tier works)
- ✅ Wrangler CLI installed: `npm install -g wrangler`
- ✅ GitHub repository set up
- ✅ Next.js app built with static export

---

## 🔧 Initial Setup (One-Time)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser for OAuth authentication. Follow the prompts.

### Step 3: Verify Authentication

```bash
wrangler whoami
```

You should see your account details.

---

## 🏗️ Project Setup

### Step 1: Create Cloudflare Pages Project

```bash
wrangler pages project create immersive-adduckivity --production-branch=main
```

**Expected Output:**
```
✨ Successfully created the 'immersive-adduckivity' project
It will be available at https://immersive-adduckivity.pages.dev/
```

### Step 2: Configure Next.js for Static Export

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**Why static export?**
- Faster performance (no server-side rendering needed)
- Works perfectly with Cloudflare Pages
- Better SEO and caching
- Simpler deployment

---

## 📦 Build Process

### Step 1: Navigate to Project Directory

```bash
cd apps/immersive/momentum-3d
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 3: Build for Production

```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Generating static pages (5/5)
Route (app)
├ ○ /
├ ○ /_not-found
└ ○ /momentum
```

**Build Output:** `.next/` and `out/` directories

---

## 🚀 Deployment to Cloudflare Pages

### Step 1: Deploy Static Files

```bash
wrangler pages deploy out --project-name=immersive-adduckivity
```

**Expected Output:**
```
Uploading... (53/53)
✨ Success! Uploaded 32 files
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://a87a361c.immersive-adduckivity.pages.dev
```

### Step 2: Test Your Deployment

Open the provided URL in your browser:
- Test navigation
- Check 3D scenes load properly
- Verify mobile responsiveness
- Confirm all links work

---

## 🔄 Updating Your Deployment

### When You Make Changes:

1. **Build the changes:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare:**
   ```bash
   wrangler pages deploy out --project-name=immersive-adduckivity
   ```

3. **Test the new deployment URL**

### Git Workflow (Recommended):

```bash
# 1. Commit your changes
git add .
git commit -m "Update content/fix bugs"

# 2. Push to GitHub
git push origin main

# 3. Deploy
npm run build
wrangler pages deploy out --project-name=immersive-adduckivity
```

---

## 🌐 Custom Domain Setup

### Option A: Use Cloudflare Managed Domain

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Custom Domains"
3. Add your domain: `immersive.adduckivity.com`
4. Follow DNS instructions

**Time:** Propagation takes 5-30 minutes

### Option B: External Domain

1. Buy domain from any registrar
2. Add to Cloudflare Pages project
3. Update nameservers to Cloudflare

---

## 🔍 Troubleshooting

### Build Errors

**Error:** `Cannot find module 'next/font/google'`
**Solution:** 
```bash
npm install next@latest react@latest react-dom@latest
```

**Error:** TypeScript errors
**Solution:**
```bash
npm run build
# Fix errors shown
npm run build again
```

### Deployment Errors

**Error:** `ENOENT: no such file or directory`
**Solution:** Ensure you're in the correct directory and `out/` folder exists:
```bash
cd apps/immersive/momentum-3d
npm run build
ls -la out/  # Should show files
```

**Error:** SSL certificate errors
**Solution:** Wait 5-10 minutes for Cloudflare to provision SSL certificates

### 3D Scenes Not Loading

**Problem:** WebGL not working
**Solutions:**
1. Check browser console for errors
2. Verify Three.js dependencies installed
3. Ensure static export includes all assets
4. Test in different browsers (Chrome, Firefox, Safari)

---

## 📊 Performance Optimization

### Before Deployment:

1. **Optimize Images:**
   ```bash
   # Convert to WebP if needed
   # Keep images under 200KB
   # Use responsive images
   ```

2. **Minimize JavaScript:**
   ```bash
   npm run build
   # Check bundle size in output
   ```

3. **Test Locally:**
   ```bash
   npm run dev
   # Open http://localhost:3000
   # Test all functionality
   ```

### After Deployment:

1. **Check Page Speed:**
   - Use Google PageSpeed Insights
   - Target: 90+ score on mobile

2. **Monitor Analytics:**
   - Add Cloudflare Web Analytics (free)
   - Track 3D scene engagement

---

## 🔐 Security Checklist

- [ ] Environment variables never committed to Git
- [ ] API keys stored in Cloudflare Secrets
- [ ] HTTPS enforced (automatic with Cloudflare)
- [ ] No sensitive data in client-side code
- [ ] Regular dependency updates: `npm update`

---

## 💰 Cost Management

### Cloudflare Pages Free Tier Includes:
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ SSL certificates
- ✅ Global CDN

**When to upgrade:** Only when you exceed 500 builds/month (unlikely for personal projects)

---

## 📈 Production Workflow

### Recommended Process:

1. **Development:**
   ```bash
   npm run dev  # Local development
   ```

2. **Testing:**
   ```bash
   npm run build  # Production build test
   npm run start  # Test production build locally
   ```

3. **Deploy:**
   ```bash
   wrangler pages deploy out --project-name=immersive-adduckivity
   ```

4. **Monitor:**
   - Check deployment URL
   - Test critical functionality
   - Monitor analytics

---

## 🆘 Emergency Rollback

If deployment breaks something:

1. **Quick Fix:** Deploy previous working version
2. **Git Revert:**
   ```bash
   git revert HEAD
   npm run build
   wrangler pages deploy out --project-name=immersive-adduckivity
   ```

3. **Cloudflare Rollback:**
   - Go to Cloudflare Dashboard
   - Pages → Your Project → Deployments
   - Click on previous deployment → "Rollback"

---

## 📚 Quick Reference Commands

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
wrangler pages deploy out --project-name=immersive-adduckivity

# Check status
wrangler pages deployment list --project-name=immersive-adduckivity

# View logs
wrangler pages deployment tail --project-name=immersive-adduckivity

# Authentication check
wrangler whoami

# Project list
wrangler pages project list
```

---

## 🎯 Best Practices

1. **Always test locally before deploying**
2. **Keep deployments small and frequent** (easier to debug)
3. **Use Git for version control** (rollback easier)
4. **Monitor deployment logs** for errors
5. **Set up automated testing** when project grows
6. **Document environment variables** in `.env.example`

---

## 🔗 Useful Links

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/
- Next.js Deployment: https://nextjs.org/docs/deployment
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/

---

## ✅ Pre-Deployment Checklist

- [ ] Code tested locally
- [ ] No TypeScript errors
- [ ] All dependencies installed
- [ ] Build succeeds without errors
- [ ] Images optimized
- [ ] Links verified
- [ ] Mobile responsiveness checked
- [ ] 3D scenes working
- [ ] Git changes committed
- [ ] Deployment URL tested

---

**Last Updated:** 2026-04-22  
**Maintained By:** UDO + Human Partnership  
**Status:** Production Ready ✅

---

*"The system is the bridge between intention and deployment." — UDO*
