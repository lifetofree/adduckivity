# ISSUESTOFIX

## Current Status

| Metric | Status |
|--------|--------|
| TypeScript | 0 errors |
| Tests | 118 passing (12 files) |
| Lint Errors | 0 (warnings only) |

---

## New Feature: Gradient Lock Model

Implemented a **gradient lock model** for Duck OS that adjusts sensory requirements based on energy level.

### Lock Logic

| Energy Level | Sensory Required | Behavior |
|--------------|------------------|----------|
| 7-10 (High) | 1 of 3 | Lenient — one habit is enough |
| 4-6 (Medium) | 2 of 3 | Moderate — need most support |
| 1-3 (Low) | 3 of 3 | Strict — full system required |
| 0-2 (Critical) | — | Hard lock always |

### Context Values (system-context.tsx)

```typescript
sensoryRequired: number  // 1, 2, or 3 based on energy
lockProximity: number   // 0-1, 1 = safe, 0 = about to lock
isLocked: boolean       // true if locked out
isProtected: boolean    // true when energy <= 3
```

### Fail-Safe Design
- Critical energy (≤2) always locks regardless of sensory
- `lockProximity` shows warning glow as user approaches lock threshold

---

## Quick Reference

### Environment Variables

| Name | Purpose |
|------|---------|
| `ADMIN_KEY` | Required on `x-admin-key` header for write endpoints |

### Deleted Files
- `src/app/api/debug/config/route.ts`
- `src/app/api/ai/debug/route.ts`
- `src/app/page-old.tsx`
- `src/app/blog/BlogClient.tsx`
- `src/app/blog/[slug]/BlogPostClient.tsx`
- `src/components/ToolGrid.tsx`
- `src/lib/content.ts`

---

## Fixed Issues

### Critical (All Resolved)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `lib/system-context.tsx` | Default sensory=false locks new users out | Changed defaults to `{ water: true, light: true, noise: true }` |
| 2 | `api/roadmap/route.ts` | Path traversal vulnerability | Added `path.resolve` guard rejecting paths outside `PROJECT_ROOT` |
| 3 | `lib/ignition-store.ts` | Extra tick clears `targetNodeId` | `tick()` now returns early on safety guard branch |
| 4 | `api/posts/route.ts` | PUT/DELETE had zero authentication | Added `requireAdmin` via `x-admin-key` header |
| 5 | `lib/posts.ts` | Facebook posting dead in CF Pages | Removed `CF_PAGES=1` guards; only `NODE_ENV==='development'` skips now |
| 6 | `lib/markdown.ts` | XSS via `javascript:` URIs | Added `sanitizeUrl()` allowing only http(s)/relative/hash |
| 7 | `lib/markdown.ts` | XSS via unsanitized `alt` | Added `escapeAttr()` for safe attribute insertion |
| 8 | `lib/wordpress.ts` | SSRF in `getPostSeoFromHtml` | Added host allowlist + `URL` parse guard |
| 9 | `components/ShieldWeb.tsx` | TypeScript error: string not assignable to never | Replaced lucide-react icons with inline SVGs |

### High Priority

| # | File | Issue | Fix |
|---|------|-------|-----|
| 10 | `api/ai/debug/route.ts` | Unauthenticated env exposure | File deleted |
| 11 | `api/debug/config/route.ts` | Exposed Facebook Page ID + Site URL | File deleted |
| 12 | Multiple API routes | 27 instances of console.log | Removed from `posts/route.ts`, `track/route.ts`, `atomize/route.ts`, `maintenance/route.ts` |
| 13 | `atomizer/page.tsx` | setState in useEffect warning | Used lazy initialization pattern |
| 14 | `content/ContentClient.tsx` | `setPosts(data)` shape mismatch | Now reads `data.posts ?? []` |
| 15 | `api/track/route.ts` | GET allowed unauthenticated event injection | Removed GET handler; POST validates against `ALLOWED_EVENTS` |
| 16 | `api/stats/route.ts` | `kv.list()` not paginated | Added cursor loop until `list_complete` |

### Medium Priority

| # | File | Issue | Fix |
|---|------|-------|-----|
| 17 | `app/atomizer/page.tsx` | `energyCheckCount` never incremented | `handleComplete` now computes and persists |
| 18 | `lib/atomizer.ts` | `JSON.parse` crash on corrupted storage | Wrapped in try/catch, clears corrupted storage |
| 19 | `app/atomizer/page.tsx` | Silent failure — no error shown | Added `error` state with `<p role="alert">` |
| 20 | `AtomizerList.tsx` | `scale` CSS prop has no effect | Replaced with `transform: 'scale(1.05)'` |
| 21 | `api/ai/atomize/route.ts` | MiniMax response parsed wrong | Now parses `choices[0].message.content` |
| 22 | `app/atomizer/page.tsx` | `substr` deprecated | Replaced with `slice` |
| 23 | `app/atomizer/page.tsx` | Input not cleared after atomization | Fixed |
| 24 | `app/protocol-builder/page.tsx` | "Protocol Complete" button not disabled | Added `disabled={isActuallyLast}` |
| 25 | `IgnitionOverlay.tsx` | Audio cleanup fires each phase | Moved to unmount-only `useEffect` |
| 26 | `IgnitionOverlay.tsx` | Dynamic Tailwind classes purged | Replaced with static lookup maps |
| 27 | `ShieldWeb.tsx` | 3x duplicate Audio per shield mount | Module-singleton `_bioAudio` |
| 28 | `ShieldWeb.tsx` | `AnimatePresence` wrapping `<group>` | Removed (was no-op) |
| 29 | `IntroSlides.tsx` | `localStorage.setItem` not guarded | Added `markIntroSeen()` with try/catch |
| 30 | `EmergencyProtocol.tsx` | `allDone` misnamed | Renamed to `anyDone` |
| 31 | `EmergencyProtocol.tsx` | `trackEvent` not awaited | Uses `.catch(...)` directly |
| 32 | `RoadmapWeb.tsx` | Empty phases render as complete | Added length guard |
| 33 | `RoadmapWeb.tsx` | Rollback uses stale closure | Changed to functional `setPhases(prev => ...)` |
| 34 | `ControlCenter.tsx` | Tailwind dynamic-class purge | Added `border` to `getEnergyLabel` |
| 35 | `ProtocolScene.tsx` | Background click passed `''` | Changed to `null` |
| 36 | — | **Task 6: Reviewer Rules** | Audited for Edge-Safe compliance, Vitest coverage (94/94), and Sensory-Aware UX. |

### Minor/Performance

| # | File | Issue | Fix |
|---|------|-------|-----|
| 36 | `AtomizerScene.tsx` | `useMemo` depends on constant | Fixed |
| 37 | `AtomizerList.tsx` | Blurred steps keyboard-accessible | Added `aria-hidden`, `tabIndex={-1}`, `pointer-events: none` |
| 38 | `ToolNode.tsx`, `RoadmapNode.tsx` | `new THREE.Vector3` per frame | Hoisted reusable vectors |
| 39 | `ToolNode.tsx` | Audio never cleaned up | Cleanup function pauses + nulls audio |
| 40 | `EmergencyProtocol.tsx` | QR image not optimized | Changed to `<Image>` |
| 41 | `app/blog/page.tsx` | N+1 HTTP for SEO | Removed `getPostSeoFromHtml` call |
| 42 | `lib/ignition-audio.ts` | Overly broad `(window as any)` | Fixed type |
| 43 | `api/roadmap/route.ts` | Task IDs unstable | Now SHA-1 of task text |
| 44 | `app/ignition/page.tsx` | Redundant `wasStarted` ref | Removed |
| 45 | `IgnitionOverlay.tsx` | Timer drifts over 600s | Now derives from `Date.now() - startTime` |

---

## Documented (Not Actionable)

| # | Issue | Reason |
|---|-------|--------|
| 46 | In-memory rate limiter non-functional | Cannot fix without infra change (KV-backed required) |
| 47 | Audio files missing | Requires uploading MP3 files; code handles gracefully via `.catch()` |
| 48 | ~600 lines duplicated UI | Large refactor; recommended for follow-up PR |
| 49 | EditPostInner stale eslint-disable | Left untouched to avoid merge conflicts |

---

## Test Coverage

| File | Tests |
|------|-------|
| `src/lib/posts.test.ts` | 6 |
| `src/__tests__/posts.pure.test.ts` | 12 |
| `src/__tests__/posts.kv.test.ts` | 14 |
| `src/__tests__/posts.schedule.test.ts` | 4 |
| `src/__tests__/posts.utils.test.ts` | 22 |
| `src/__tests__/ignition.test.ts` | 6 |
| `src/__tests__/protocol.test.ts` | 4 |
| `src/__tests__/analytics.test.ts` | 4 |
| `src/__tests__/system.test.tsx` | 6 |
| `src/lib/atomizer.test.ts` | 4 |
| `src/lib/markdown.test.ts` | 10 |
| `src/__tests__/protocol-router.test.ts` | 24 |
| **Total** | **118** |

---

## ESLint Configuration

The following are ignored in `eslint.config.mjs`:

```javascript
globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  ".vercel/**",
  "scripts/**",       // CommonJS require for wrangler
  "src/__tests__/**", // Explicit any for mocking
])
```

---

## Known Warnings (Acceptable)

The following warnings are intentionally left as-is:

1. **React setState in effect** — Used in `ControlCenter.tsx` and `system-context.tsx` for animation feedback and localStorage sync. These are intentional patterns documented with eslint directives.

2. **Unused variables** — Some exist in API routes (e.g., `friendlyError` in `atomize/route.ts`) where they serve as future API expansion placeholders.

3. **Escaped characters** — JSX quotes/apostrophes that don't affect functionality.
