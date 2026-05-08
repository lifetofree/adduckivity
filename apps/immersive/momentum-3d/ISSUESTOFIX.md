# ISSUESTOFIX.md
> Generated: 2026-05-08 | Status: [ ] open  [x] fixed  [-] out-of-scope

---

## CRITICAL

### C1 — IntroSlides: markIntroSeen() calls itself infinitely
- **File:** `src/components/ProtocolBuilder/IntroSlides.tsx:9`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Replaced `try { markIntroSeen() }` with `try { localStorage.setItem(STORAGE_KEY, 'true') }`.

---

### C2 — Upload: No file size limit
- **File:** `src/app/api/upload/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Added `MAX_FILE_SIZE = 10 MB` check on `file.size` before calling `arrayBuffer()`. Returns 400 if exceeded.

---

### C3 — Upload: File extension taken from client filename
- **File:** `src/app/api/upload/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Extension now derived from `file.type` via an `ALLOWED_TYPES` whitelist (`image/jpeg` → `jpg`, etc.). Unknown MIME types are rejected with 400.

---

### C4 — Posts API: Hardcoded `dev-key` fallback exposes production routes
- **File:** `src/app/api/posts/route.ts`, `src/app/api/posts/save/route.ts`, `src/app/api/posts/maintenance/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Fallback to `'dev-key'` only occurs when `NODE_ENV === 'development'`. In production, a missing env var returns 401 immediately.

---

### C5 — Posts API: Auth comparison is not constant-time (timing attack)
- **File:** `src/app/api/posts/route.ts`, `src/app/api/posts/save/route.ts`, `src/app/api/posts/maintenance/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Added `timingSafeEqual(a, b)` helper that XORs every character and the length difference, returning true only when both are zero. Used in all three auth guards.

---

## HIGH

### H1 — ShieldWeb: `new THREE.Vector3` allocated every frame in useFrame
- **File:** `src/components/ShieldWeb.tsx:130`
- **Category:** Performance
- **Status:** [x]
- **Fix:** Hoisted `const _shieldScaleTarget = new THREE.Vector3()` at module level; useFrame now calls `.set(t, t, t)` to reuse it.

---

### H2 — wordpress.ts: Unhandled rejection on malformed JSON response
- **File:** `src/lib/wordpress.ts:100`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Wrapped `response.json()` in try-catch; throws a typed error with the HTTP status code on non-JSON responses.

---

### H3 — posts.ts: Promise.all on KV list rejects on first failure
- **File:** `src/lib/posts.ts:207-211`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Changed to `Promise.allSettled`; filters out rejected entries so one bad KV key doesn't kill the entire post listing.

---

### H4 — Roadmap API: Host header spoofing bypasses localhost-only file read
- **File:** `src/app/api/roadmap/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Removed the file-system read path entirely. The edge worker always returns static roadmap data. No filesystem access, no host-header bypass possible.

---

### H5 — Atomize API: Dynamic import of `@google/generative-ai` on every request
- **File:** `src/app/api/ai/atomize/route.ts:234`
- **Category:** Performance
- **Status:** [x]
- **Fix:** Moved `import { GoogleGenerativeAI } from '@google/generative-ai'` to a static top-level import.

---

### H6 — AI route: In-memory rate limiter not shared across edge regions
- **File:** `src/app/api/ai/route.ts`
- **Category:** Security
- **Status:** [-]
- **Note:** Full fix requires KV-backed rate limiter or Cloudflare Rate Limiting rules — infra change, not code. Existing per-isolate limiter stays as a best-effort guard.

---

### H7 — Ignition audio: AudioContext.close() not awaited; potential stale contexts on HMR
- **File:** `src/lib/ignition-audio.ts`
- **Category:** Bug / Performance
- **Status:** [x]
- **Fix:** Made `cleanup()` async and awaits `audioContext.close()`; also nulls the reference after close so stale contexts don't accumulate.

---

### H8 — IgnitionOverlay: Interval restarts whenever `tick` reference changes
- **File:** `src/components/ProtocolBuilder/IgnitionOverlay.tsx:38-48`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Added `tickRef` (useRef) that mirrors the latest `tick` function. The `setInterval` effect depends only on `isActive`, reading from `tickRef.current` each tick instead of re-closing over `tick`.

---

## MEDIUM

### M1 — system-context.tsx: Crash-recovery effect may cause infinite setState loop
- **File:** `src/lib/system-context.tsx:88-96`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Collapsed the condition to `energy <= 2 && (sensory.water || sensory.light || sensory.noise)` and removed sensory fields from the dependency array (with `eslint-disable` comment explaining why). Effect only fires when energy or isLoaded changes.

---

### M2 — posts.ts: TOCTOU race condition on Facebook lock
- **File:** `src/lib/posts.ts:267-280`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Moved `kv.put(lockKey)` to before the `postToFacebook()` call, closing the race window between the `kv.get` check and the lock write.

---

### M3 — markdown.ts: Code block content not HTML-escaped
- **File:** `src/lib/markdown.ts:157`
- **Category:** Security
- **Status:** [x]
- **Fix:** Added `escapeCode()` helper that escapes `&`, `<`, `>` before wrapping in `<pre><code>`.

---

### M4 — markdown.ts: Protocol-relative URLs allowed without validation
- **File:** `src/lib/markdown.ts:94-96`
- **Category:** Security
- **Status:** [x]
- **Fix:** `sanitizeUrl()` now explicitly rejects `//`-prefixed URLs by mapping them to `'#'`. Only `https?:`, `mailto:`, root-relative (`/path`), hash (`#`), and query (`?`) prefixes are allowed.

---

### M5 — upload/route.ts: MIME type taken from client request, not file bytes
- **File:** `src/app/api/upload/route.ts`
- **Category:** Security
- **Status:** [-]
- **Note:** Magic-byte validation requires reading the ArrayBuffer header — medium effort. C3 (whitelist-only MIME types) provides defense-in-depth. Full magic-byte check is a security hardening sprint item.

---

### M6 — stats API: Completely unauthenticated
- **File:** `src/app/api/stats/route.ts`
- **Category:** Security
- **Status:** [x]
- **Fix:** Added `requireAdmin` guard (constant-time comparison against `ADMIN_KEY` / dev fallback) on `GET /api/stats`. Updated analytics test to pass `x-admin-key: dev-key` header.

---

### M7 — track API: `Math.random()` ID insufficient for uniqueness
- **File:** `src/app/api/track/route.ts:33`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Changed to `crypto.randomUUID().replace(/-/g, '').slice(0, 12)` — uses the platform's CSPRNG.

---

### M8 — subscribe API: 422 "already subscribed" silently mapped to success
- **File:** `src/app/api/subscribe/route.ts:42-47`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Returns `{ success: true, alreadySubscribed: true }` when SendFox returns 422, so the client can show a "you're already subscribed" message.

---

### M9 — unsplash/route.ts: Unsafe property access on typed-cast response
- **File:** `src/app/api/unsplash/route.ts:22-33`
- **Category:** Bug
- **Status:** [x]
- **Fix:** All property accesses now use optional chaining (`urls?.small`, `user?.name`, `links?.html`) with `?? ''` fallbacks.

---

### M10 — atomizer.ts / protocol-store.ts: Unsafe JSON.parse from localStorage
- **File:** `src/lib/atomizer.ts:54`, `src/lib/protocol-store.ts:48`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Added runtime shape validators (`isValidAtomizerTask`, `isValidProtocolGraph`) that check required field types. Invalid data is cleared from localStorage and the default state is returned.

---

### M11 — EnergyCheck: Modal has no ARIA attributes
- **File:** `src/components/EnergyCheck.tsx:20`
- **Category:** Accessibility
- **Status:** [x]
- **Fix:** Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="energy-check-title"` to the modal root. Added `id="energy-check-title"` to the h2.

---

### M12 — EnergyCheck: Buttons have no disabled/loading state
- **File:** `src/components/EnergyCheck.tsx:26-39`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Added `submitting` state; buttons are `disabled` while submitting to prevent double-click. Visual feedback via `opacity-50 cursor-not-allowed`.

---

### M13 — SystemBar: Status color logic duplicated
- **File:** `src/components/shared/SystemBar.tsx:56-60, 67-70`
- **Category:** Redundant
- **Status:** [x]
- **Fix:** Added `statusColorClass(isLocked, isProtected)` helper to `lib/theme.ts`. Both SystemBar instances now derive colors from the same source. `energyBars()` helper also added to theme for M14.

---

### M14 — ControlCenter: Energy bar calculation duplicated from SystemBar
- **File:** `src/components/shared/ControlCenter.tsx`, `src/components/shared/SystemBar.tsx`
- **Category:** Redundant
- **Status:** [x]
- **Fix:** Added `energyBars(energy: number): number` to `lib/theme.ts`. SystemBar now imports and uses it instead of inline `Math.ceil(energy / 2)`.

---

### M15 — SystemFooter: Falsy `footerNode` falls through to default incorrectly
- **File:** `src/components/shared/SystemFooter.tsx:29-40`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Changed `footerNode || <default>` to `footerNode ?? <default>`. Now only `null`/`undefined` triggers the fallback.

---

### M16 — wordpress.ts: HTML entity decoding is incomplete
- **File:** `src/lib/wordpress.ts:107-118`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Added two replacement patterns to `decodeHtmlEntities()`: `&#(\d+);` (decimal) and `&#x([0-9a-f]+);` (hex) using `String.fromCharCode`.

---

## LOW

### L1 — AtomizerScene: Trigonometric constants in useFrame
- **File:** `src/components/AtomizerScene.tsx`
- **Category:** Performance
- **Status:** [-]
- **Note:** All trig arguments include `state.clock.elapsedTime` which changes every frame. No fixable constants present. False positive.

---

### L2 — ArchitectSidebar: `nodes.find()` on every render
- **File:** `src/components/ProtocolBuilder/ArchitectSidebar.tsx:32`
- **Category:** Performance
- **Status:** [x]
- **Fix:** Wrapped in `useMemo(() => nodes.find(n => n.id === activeNodeId), [nodes, activeNodeId])`.

---

### L3 — atomizer/page.tsx: Duplicate shatter/timeout pattern
- **File:** `src/app/atomizer/page.tsx:73-91`
- **Category:** Redundant
- **Status:** [x]
- **Fix:** Extracted `triggerShatter(durationMs = 1000)` as a `useCallback`. Both call sites now use it.

---

### L4 — RoadmapWeb.tsx: `loading` state set but never consumed
- **File:** `src/components/RoadmapWeb.tsx:27`
- **Category:** Redundant
- **Status:** [-]
- **Note:** Inspection confirmed `loading` is already used at line 77 to render a loading skeleton. False positive from review.

---

### L5 — (Same root cause as H8)
- **Status:** See H8

---

### L6 — protocol-builder/page.tsx: Two overlapping `prevRef` effects
- **File:** `src/app/protocol-builder/page.tsx:249-280`
- **Category:** Bug
- **Status:** [-]
- **Note:** The two effects track different state changes (mode transition vs. activeNodeId change) and intentionally have separate dependency arrays. Merging them would create a single effect with a larger dep array and the same race risk. Current pattern is correct — the effects are not overlapping, they are orthogonal.

---

### L7 — posts.ts: `toSlug()` strips all non-ASCII characters
- **File:** `src/lib/posts.ts:65-74`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Added `normalize('NFD')` + strip combining diacritical marks (`̀-ͯ`) before the ASCII filter, preserving latin-with-diacritics (e.g., "Café" → "cafe").

---

### L8 — dev-kv.ts: ReadableStream consumed via busy `while(true)` loop
- **File:** `src/lib/dev-kv.ts:59-73`
- **Category:** Performance
- **Status:** [x]
- **Fix:** Replaced manual `reader.read()` loop with `for await (const chunk of stream as AsyncIterable<Uint8Array>)`.

---

### L9 — posts.ts: `readingTime()` strips characters not full markdown patterns
- **File:** `src/lib/posts.ts:51-55`
- **Category:** Bug
- **Status:** [x]
- **Fix:** Replaced character-stripping regex with proper pattern removal: fenced code blocks, inline code, images, links (keep text), headings, and formatting characters.

---

### L10 — OSLaunchpadScene: localhost check uses `window.location.hostname` instead of NODE_ENV
- **File:** `src/app/os/page.tsx:18-21`
- **Category:** Performance
- **Status:** [x]
- **Fix:** Changed to `process.env.NODE_ENV === 'development'`, which is inlined at build time by the bundler.

---

## OUT OF SCOPE / ACKNOWLEDGED

- **H6 — Rate limiting across regions:** Full fix requires KV-backed rate limiter or Cloudflare dashboard rules — infra change, not code.
- **M5 — Magic-byte file validation:** Reading file headers requires parsing ArrayBuffer — medium effort. Scheduled as security hardening sprint item.
- **L1 — AtomizerScene trig constants:** False positive — all trig arguments use elapsed time.
- **L4 — RoadmapWeb loading state:** False positive — `loading` is already used at line 77.
- **L6 — Protocol-builder prevRef effects:** False positive — the two effects are orthogonal, not duplicated.

---

## TEST RESULTS

```
Test Files  11 passed (11)
     Tests  94 passed (94)
  Duration  2.17s
```

All 94 tests pass after fixes.
