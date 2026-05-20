# System Spec: Theme System

**Last updated:** 2026-05-15  
**File:** `src/lib/theme.ts`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Styling | Tailwind CSS 4 + inline styles |
| Architecture | Pure utility module (no framework dependency) |

---

## Purpose

Centralized color palette — single source of truth for all Duck OS theming. Ensures visual consistency across all tools and components.

---

## ET Color Palette

```typescript
export const ET = {
  bg:      '#0A0F1E',  // page background
  surface: '#0F1829',  // cards, sidebars, nav
  muted:   '#1A2840',  // subtle fills
  border:  '#1E3A5F',  // borders, dividers
  ink:     '#E8F4F8',  // primary text
  mid:     '#A8C8D8',  // secondary text
  sub:     '#6B9BB8',  // muted text, meta
  accent:  '#00E5FF',  // cyan neon — primary brand color
}
```

Plus derived helper: `ET.accentL` (`rgba(0,229,255,0.12)` — accent tint for backgrounds). Note: `accentD` does **not** exist in the codebase; do not reference it.

---

## Usage

```tsx
import { ET } from '@/lib/theme'

// Inline styles
<div style={{ backgroundColor: ET.surface, color: ET.ink }}>

// Tailwind (static classes)
<div className="text-[#E8F4F8]">

// Input form styling
import { inputCss } from '@/lib/theme'
<input className={inputCss(ET)} />
```

---

## Input CSS Helper

`inputCss(ET)` returns a **CSS string** (not Tailwind classes) that defines `.et-input` and `.et-select` class rules. It is injected via a `<style>` tag:

```typescript
// Generates:
// .et-input { width: 100%; font-size: 0.75rem; border-radius: 0.5rem; border: 1px solid <border>; ... }
// .et-select { ... }
```

Usage: inject the returned string into a `<style>` element, then apply `className="et-input"` to inputs.

---

## Component Patterns

- **Cards/surfaces:** `backgroundColor: ET.surface`
- **Borders/dividers:** `borderColor: ET.border`
- **Primary text:** `color: ET.ink`
- **Secondary text:** `color: ET.mid`
- **Muted/meta text:** `color: ET.sub`
- **Accent/CTAs:** `color: ET.accent` with `backgroundColor: ET.accent` for solid fills
- **Error states:** Red (`#ef4444`) or amber (`#ca8a04`)

---

## Additional Helpers

`energyBars(energy: number): number` — maps 1–10 energy to 1–5 bar count (`Math.ceil(energy / 2)`). Used by SystemBar and ControlCenter to stay in sync.

`statusColorClass(isLocked, isProtected): string` — returns `'red'` / `'amber'` / `'stable'` for SystemBar dot color class.

---

## Dark Mode Only

Duck OS is dark-mode-only. There is no light theme toggle. All components reference `ET` for colors — no hardcoded hex values should appear in component files.
