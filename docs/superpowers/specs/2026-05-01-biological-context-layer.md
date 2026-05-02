# Design Spec: Biological Context Layer (System Diagnostic)

**Date:** 2026-05-01  
**Status:** Implemented  
**Topic:** Sensory Sync + Energy-Match Selector  
**Goal:** Implement the "Protect the System" mandate via biological and energy state management.

---

## 1. Background & Motivation

Duck OS operates on the principle of **"Systems over Willpower."** However, even the best systems fail if the biological hardware (the user) is compromised.

The **Biological Context Layer** introduces a "Firmware" layer that checks the body's status (Sensory Sync) and battery levels (Energy Score) before allowing "Software" (tools) to execute. This prevents stealth burnout and ensures that the user is physically prepared for the cognitive load of the OS tools.

---

## 2. Technical Architecture

### A. The State Engine (`SystemContext`)
A global React context that serves as the single source of truth for the user's biological state.

- **State Model:**
  - `energy`: Number (1-10). Determines "Protected Mode" vs "Performance Mode".
  - `sensory`: Object `{ water: boolean, light: boolean, noise: boolean }`.
  - `lastCheck`: ISO Timestamp. Used for cache invalidation (stale state management).
- **Persistence:**
  - Key: `duck_os_system_v1` in `localStorage`.
  - State survives refreshes and session restarts.
- **Derived Logic:**
  - `isLocked`: `true` if any sensory check is `false`. Access to "Executive" tools is blocked.
  - `isProtected`: `true` if `energy <= 3`. Triggers defensive UI and task filtering.

### B. Core Components

1. **`SystemProvider`**: Wraps the root layout to provide state access to all pages and components.
2. **`ControlCenter`**: 
   - A persistent UI panel triggered from the `SystemBar`.
   - Features an energy slider and sensory toggles.
   - Includes real-time alerts for "System Lock" and "Protected Mode".
3. **`SystemGate`**:
   - A wrapper component that enforces sensory requirements.
   - Redirects/Overlays a mandatory diagnostic check if the system is "Locked".
4. **`ToolGrid`**:
   - A dynamic layout for the homepage that filters tools based on `isProtected`.
   - Displays 🔒 indicators on tools when `isLocked`.

---

## 3. System Behaviors

### The System Lock (Hardware Protection)
When the user indicates they haven't met basic biological needs (e.g., no water, poor lighting):
- Access to **The Atomizer** and **Protocol Builder** is strictly blocked.
- The user is presented with a "System Lock Active" overlay detailing the missing hardware requirements.
- The `SystemBar` displays a red "System Locked" status.

### Protected Mode (Battery Management)
When energy is critically low (≤ 3/10):
- **Homepage Filtering:** High-complexity tools (Builder/Atomizer) are hidden or de-emphasized. "Emergency Recovery" is prioritized.
- **Execution Constraints:** The Atomizer reduces its "Energy Check" interrupt threshold from every 6 steps to every 3 steps.
- **Visual Cues:** Energy indicators shift from Cyan (Performance) to Amber (Protected).

---

## 4. UI/UX Principles

- **Aesthetic:** High-contrast, technical, "Kernel" style. Dark mode by default.
- **Micro-interactions:** Framer Motion transitions for the Control Center slide-in and status alert pulsing.
- **Philosophy:** Firm but non-shaming. The system acts as a protective boundary, not a judge.

---

## 5. Verification Plan

- **Unit Testing:** `src/__tests__/system.test.tsx` verifies persistence, initialization, and derived state logic.
- **Build Integrity:** Verified via `npm run build:cf` to ensure 3D canvas and state context compatibility.
- **Manual Flow:** 
  1. Set energy to 2 -> Verify homepage hides Builder.
  2. Toggle Water to OFF -> Verify Atomizer page shows System Gate.
  3. Toggle Water to ON -> Verify Atomizer page unlocks instantly.
