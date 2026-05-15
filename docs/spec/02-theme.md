# System Spec: Theme System

**Last updated:** 2026-05-11  
**File:** `src/lib/theme.ts`

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

Plus derived helpers: `ET.accentL` (10% opacity accent background), `ET.accentD` (20% opacity).

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

`inputCss(ET)` returns a consistent Tailwind class string for form elements:

```typescript
'px-4 py-3 rounded-lg text-sm focus:outline-none'
```

Combined with inline style for `border` and `backgroundColor` per ET palette.

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

## Dark Mode Only

Duck OS is dark-mode-only. There is no light theme toggle. All components reference `ET` for colors — no hardcoded hex values should appear in component files.
