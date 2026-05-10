# Adduckivity — Immersive 3D Studio

Duck OS tools and content platform for neurodivergent creators.

**Live:** https://immersive.adduckivity.com  
**Stack:** Next.js 16.2 · React Three Fiber 9 · Cloudflare Pages + KV + R2

---

## Tools

| Tool | Route | Status |
|---|---|---|
| Momentum Protocol | `/momentum` | Live |
| The Atomizer | `/atomizer` | Live |
| Protocol Builder | `/protocol-builder` | Live |
| Ignition Sequence | `/ignition` | Live |
| OS Launchpad | `/os` | Localhost only |

---

## Commands

```bash
npm run dev       # localhost:3000
npm run test      # Vitest (94 tests, 11 files)
npm run deploy    # typecheck + build via next-on-pages → Cloudflare Pages
```

---

## Key Directories

```
src/
  app/
    page.tsx               # Homepage — pinned cards, hero, CTA, footer
    atomizer/page.tsx      # Atomizer tool
    protocol-builder/      # Protocol Builder tool
    ignition/              # Ignition sequence
    os/                    # OS Launchpad (localhost only)
    blog/                  # WordPress-powered blog list + post pages
    content/               # CMS (admin only)
    api/                   # Edge API routes
  components/
    shared/
      SystemBar.tsx         # Global fixed top bar
      SystemFooter.tsx      # Global compact bottom bar
      ControlCenter.tsx     # Energy/sensory panel
      SceneLoader.tsx       # Progress bar for 3D scenes
    ProtocolBuilder/
      ProtocolScene.tsx     # 3D constellation
      IntroSlides.tsx       # Onboarding slides
    AtomizerScene.tsx       # Three.js particle orb background
    FlywheelScene.tsx       # 3D momentum flywheel
    ShieldWeb.tsx           # 3D sensory check shield
    RoadmapWeb.tsx          # 3D roadmap visualization
    ToolNode.tsx            # 3D launchable tool node
  lib/
    theme.ts                # ET color palette (single source of truth)
    system-context.tsx      # Gradient lock model (React Context)
    posts.ts                # KV post CRUD
    wordpress.ts            # WordPress REST API integration
    atomizer.ts             # localStorage task persistence
    ignition-store.ts       # Zustand store for Ignition
    ignition-audio.ts       # Audio crossfade manager
    dev-kv.ts               # In-memory KV mock for local dev
public/
  uploads/
    emergency-recovery-cover.svg
    atomizer-cover.svg
    protocol-builder-cover.svg
```

---

## Theme

All colors flow from `src/lib/theme.ts` (`ET` object). Edit there to retheme the entire site.

```ts
ET.bg      // #0A0F1E  page background
ET.surface // #0F1829  cards, nav
ET.accent  // #00E5FF  cyan neon — primary brand
```

---

## Deployment

Cloudflare Pages via `@cloudflare/next-on-pages`. All API routes run as edge functions (`export const runtime = 'edge'`).  
Free tier has a 3 MiB worker bundle limit — avoid adding middleware or nodejs-only routes.  
See `AGENTS.md` in the repo root for full env vars, bindings, and integration specs.
