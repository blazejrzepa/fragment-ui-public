# Design Tokens

**Purpose:** Design token system specification  
**Audience:** Designers, engineers  
**When to read:** When working with design tokens

---

## Overview

Fragment UI uses a comprehensive design token system for colors, spacing, typography, and more.

**Package:** `@fragment_ui/tokens`

---

## Token Categories

### Colors

- **Semantic Colors:** Primary, secondary, accent, etc.
- **Theme Colors:** Light/dark mode variants
- **State Colors:** Success, warning, error, info

### Spacing

- **Scale (px):** 0, 4, 8, 12, 16, 24, 32
- **Units:** Pixels

### Typography

- **Font Families:** System fonts, custom fonts
- **Font Sizes:** xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Font Weights:** 400, 500, 600, 700
- **Line Heights:** Tight, normal, relaxed

### Other

- **Border Radius:** sm, md, lg, xl, full
- **Shadows:** sm, md, lg, xl
- **Z-Index:** Layering system

---

## Token Format

### JSON Format

```json
{
  "colors": {
    "primary": {
      "50": "#...",
      "100": "#...",
      ...
      "900": "#..."
    }
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    ...
  }
}
```

### CSS Variables

Tokens are converted to CSS variables:

```css
:root {
  --color-primary-50: #...;
  --color-primary-100: #...;
  --space-1: 4px;
  --space-2: 8px;
}
```

---

## Usage

### In Components

```tsx
import { Button } from '@fragment_ui/ui'

<Button className="bg-primary-500 text-white px-4 py-2">
  Click me
</Button>
```

### In CSS

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--space-4) var(--space-8);
}
```

---

## Theme Support

### Light/Dark Mode

Tokens support both light and dark themes:

```css
[data-theme="light"] {
  --color-background: #ffffff;
  --color-foreground: #000000;
}

[data-theme="dark"] {
  --color-background: #000000;
  --color-foreground: #ffffff;
}
```

### System Preference

Dark mode is default and respects system preference:

```tsx
// Automatically switches based on system preference
<ThemeProvider>
  <App />
</ThemeProvider>
```

---

## Token Generation

### Build Tokens

```bash
# Build tokens (generates CSS variables and TypeScript types)
pnpm tokens:build
```

### Output

- **CSS Variables:** `packages/tokens/dist/tokens.css`
- **TypeScript Tokens:** `packages/tokens/dist/tokens.ts`
- **JSON:** `packages/tokens/src/tokens.json`

---

## Gotchas

- **Token Names:** Use kebab-case
- **CSS Variables:** Prefixed with `--color-`, `--space-`, etc.
- **Theme Switching:** Requires `data-theme` attribute

---

## Next Steps

- [Semantic Colors](./design-tokens-semantic.md) - Semantic color system
- [Component APIs](../api/) - Component usage

---

**Last Updated:** 2025-01-XX
