# Duck OS — User Journey Map

**Last updated:** 2026-05-15  
**Owner:** Product Manager

---

## Primary Daily Flow

```
Homepage (/)
    │
    └─ "Start Your Day →" CTA
            │
            ▼
    Daily Protocol (/start)
    ├─ Returning user (<4h)? → skip to Diagnosis
    └─ New / reset:
        1. Energy tap (1–10)
        2. Water? (yes/no)
        3. Light? (comfortable/harsh)
            │
            ▼
         Diagnosis
    ┌────────────────────────────────────────────┐
    │ Energy 1–3 (any)  → /momentum              │
    │ Energy 4–6 locked → /momentum              │
    │ Energy 4–6 unlocked → /atomizer            │
    │ Energy 7–10 locked → /atomizer             │
    │ Energy 7–10 unlocked → /ignition           │
    └────────────────────────────────────────────┘
            │
            ▼
    Email Gate (non-blocking)
    - Appears AFTER routing
    - Once per device (duckos:start:email_shown)
    - Copy: Starter Kit (5 protocols + Notion template)
    - Source tag: daily-checkin
```

---

## High-Energy Path (7–10, unlocked)

```
/start → /ignition
    │
    Spark (0–200s) → Target (200–400s) → Launch (400–600s)
    │
    ▼
Completion
    ├─ Writes duckos:ignition:done:<date>
    └─ Auto-redirects → /protocol-builder (after 2s)
            │
            ▼
    Protocol Builder — Pre-flight nudge SKIPPED (ignition done)
    │
    ▼
    Architect Mode: build node graph
    └─ Pilot Mode: fly through nodes
        ├─ Timer node → countdown + auto-advance
        ├─ Tool node → launch Atomizer
        │       └─ /atomizer?returnTo=/protocol-builder
        │               → steps → completion → auto-return
        └─ Action node → manual completion
```

---

## Medium-Energy Path (4–6, unlocked)

```
/start → /atomizer
    │
    Input: "What's the scary task?"
    │
    AI call → 12–15 atomic steps
    │
    Focus Window: 3 steps visible at a time
    │
    Step completion → next step slides in
    │
    Every 6 steps → Energy Check interrupt
    │
    All done → localStorage cleared → fresh on return
    │
    If ?returnTo= → auto-redirect to Protocol Builder
```

---

## Low-Energy / Crash Path (1–3, or any locked)

```
/start → /momentum
    │
    5-step fail-safe:
    1. Breathe (box breathing)
    2. Hydrate (water check)
    3. Ground (sensory grounding)
    4. Reset (clear the slate)
    5. Start (one small action)
    │
    ▼
Completion CTA → /start?reset=true
    │
    Forces full re-check to capture updated state
```

---

## Protocol Builder Standalone Entry

```
User navigates directly to /protocol-builder
    │
    First visit?
    ├─ Yes → seed default nodes (Morning Ritual, Deep Work, Recovery Walk)
    │         show IntroSlides onboarding
    └─ No  → restore saved graph (or empty if never saved)
    │
    Ignition done today?
    ├─ Yes → no nudge, go straight to graph
    └─ No  → soft pre-flight interstitial:
              "Run Ignition (10 min)" | "Go straight to Builder"
              (NEVER a hard gate)
```

---

## Email Capture Funnel

| Entry Point | Trigger | Source Tag |
|---|---|---|
| `/start` | After routing decision | `daily-checkin` |
| `/momentum` | After 5-step recovery | `emergency-protocol` |
| Homepage | Hero section subscribe | `starter-kit-homepage` |

All subscribe calls POST to `/api/subscribe` with `source` field. Dev mode returns `{ success: true, dev: true }` without hitting SendFox.

---

## Revenue Funnel

```
/start (daily check-in)
    └─ Email gate → Starter Kit (free)
            └─ Recovery Protocol (299 THB early bird)
                    └─ Future: Membership ($29/mo)
```

---

## OS Launchpad (Developer / Owner Only)

```
localhost:3000/os
    │
    3D biological shield web (ShieldWeb)
    │
    ├─ Shield nodes: Hydration, Lighting, Acoustics
    │   (visible only when system is locked)
    │
    ├─ Tool nodes: launch shortcuts to all tools
    │
    └─ Roadmap Web: 3D visualization of project phases
```

Access: client-side hostname check — `localhost` or `127.0.0.1` only. Production shows lock message.

---

## UX Principles

| Principle | Implementation |
|---|---|
| Focus Window | Atomizer shows 3 steps max |
| Energy Check | Interrupt every 6 Atomizer steps |
| No Hard Gates | Pre-flight nudge, email gate — always skippable |
| Fail-Safe First | Critical energy (≤2) hard-locks; /momentum always accessible |
| Fresh Start | Atomizer clears on completion; default nodes seed once |
| Sensory Aware | Timer mutes when `isProtected`; lock model adjusts by energy |
| Auto-Return | Atomizer → Protocol Builder; Ignition → Protocol Builder |
