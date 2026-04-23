export const ET = {
  bg:      '#F5EFE3',
  surface: '#FAF5EC',
  muted:   '#EDE5D8',
  border:  '#D8C9B0',
  ink:     '#2C1F14',
  mid:     '#5A4030',
  sub:     '#7B6248',
  accent:  '#C07850',
  accentL: 'rgba(192,120,80,0.12)',
} as const

export const inputCss = (ET: typeof import('./theme').ET) => `
  .et-input {
    width: 100%; font-size: 0.75rem; border-radius: 0.5rem;
    border: 1px solid ${ET.border}; background: ${ET.bg}; color: ${ET.ink};
    padding: 0.375rem 0.625rem; outline: none; transition: box-shadow 0.15s;
  }
  .et-input:focus { box-shadow: 0 0 0 2px ${ET.accent}40; }
  .et-input::placeholder { color: ${ET.border}; }
  .et-select {
    width: 100%; font-size: 0.75rem; border-radius: 0.5rem;
    border: 1px solid ${ET.border}; background: ${ET.bg}; color: ${ET.ink};
    padding: 0.375rem 0.625rem; outline: none;
  }
`
