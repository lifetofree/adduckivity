// ─── Site-wide color palette ───────────────────────────────────────────────
// Edit these values to retheme the entire site at once.
export const ET = {
  bg:      '#0A0F1E',  // page background
  surface: '#0F1829',  // cards, sidebars, nav
  muted:   '#1A2840',  // subtle fills
  border:  '#1E3A5F',  // borders, dividers
  ink:     '#E8F4F8',  // primary text
  mid:     '#A8C8D8',  // secondary text
  sub:     '#6B9BB8',  // muted text, meta
  accent:  '#00E5FF',  // cyan neon — primary brand color
  accentL: 'rgba(0,229,255,0.12)', // accent tint for backgrounds
} as const

export const inputCss = (theme: typeof ET) => `
  .et-input {
    width: 100%; font-size: 0.75rem; border-radius: 0.5rem;
    border: 1px solid ${theme.border}; background: ${theme.bg}; color: ${theme.ink};
    padding: 0.375rem 0.625rem; outline: none; transition: box-shadow 0.15s;
  }
  .et-input:focus { box-shadow: 0 0 0 2px ${theme.accent}40; }
  .et-input::placeholder { color: ${theme.border}; }
  .et-select {
    width: 100%; font-size: 0.75rem; border-radius: 0.5rem;
    border: 1px solid ${theme.border}; background: ${theme.bg}; color: ${theme.ink};
    padding: 0.375rem 0.625rem; outline: none;
  }
`
