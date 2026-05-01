# Adduckivity — Immersive 3D Studio

Duck OS tools and content platform for neurodivergent creators.

**Live:** https://immersive.adduckivity.com  
**Stack:** Next.js 16 · React Three Fiber · Cloudflare Pages + KV + R2

---

## Tools

| Tool | Route | Status |
|---|---|---|
| Momentum Protocol | `/momentum` | ✅ Live |
| The Atomizer | `/atomizer` | ✅ Live |
| Protocol Builder | `/protocol-builder` | ✅ Live |

---

## Commands

```bash
npm run dev       # localhost:3000
npm run test      # Vitest (42 tests)
npm run deploy    # build via next-on-pages → Cloudflare Pages
```

---

## Key Directories

```
src/
  app/
    page.tsx               # Homepage — pinned cards, hero, CTA, footer
    atomizer/page.tsx      # Atomizer tool
    protocol-builder/      # Protocol Builder tool
    blog/                  # Blog list + post pages
    content/               # CMS (admin only)
    api/                   # Edge API routes
  components/
    ProtocolBuilder/
      SystemBar.tsx         # Shared fixed top bar for tools
      SystemFooter.tsx      # Shared compact bottom bar for tools
    AtomizerScene.tsx       # Three.js particle orb background
    AtomizerList.tsx        # Step checklist
    EmailCTA.tsx            # Newsletter capture
  lib/
    theme.ts                # ET color palette (single source of truth)
    posts.ts                # KV post CRUD
    atomizer.ts             # localStorage task persistence
public/
  uploads/
    emergency-recovery-cover.svg   # SVG card cover
    atomizer-cover.svg             # SVG card cover
    protocol-builder-cover.svg     # SVG card cover
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

Cloudflare Pages via `@cloudflare/next-on-pages`. All routes run as edge functions.  
See `AGENTS.md` in the repo root for full env vars, bindings, and integration specs.
