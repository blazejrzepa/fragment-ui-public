---
title: Design Tokens
---

## Colors

All colors are available as CSS variables with semantic naming. Colors automatically adapt to light/dark/high-contrast themes.

### Background Colors

```css
/* Base backgrounds */
--color-bg-base: #FAFAFA; /* Light: #FAFAFA, Dark: #09090B */
--color-bg-inverse: #F4F4F5; /* Light: #F4F4F5, Dark: #18181B */
```

### Foreground Colors

```css
/* Text colors */
--color-fg-base: #27272A; /* Light: #27272A (Zinc-800), Dark: #E4E4E7 (Zinc-200) */
--color-fg-muted: #71717A; /* Light: #71717A (Zinc-500), Dark: #71717A (Zinc-500) */
```

### Brand Colors

```css
--color-brand-primary: #BE123C; /* Rose 700 */
--color-brand-primary-600: #FFE4E6; /* Rose 100 */
```

### Button Colors

```css
/* Solid button colors */
--color-button-solid-bg: #000000; /* Light: #000000, Dark: #ffffff */
--color-button-solid-hover: #171717; /* Light: #171717, Dark: #f5f5f5 */
--color-button-solid-text: #ffffff; /* Light: #ffffff, Dark: #000000 */
```

### Surface Colors

```css
--color-surface-1: #F4F4F5; /* Light: #F4F4F5, Dark: #121214 */
--color-surface-2: #E4E4E7; /* Light: #E4E4E7, Dark: #19191B */
```

### Accent Colors

```css
--color-accent-green: #22C55E;
--color-accent-red: #EF4444;
```

### Border Colors

```css
--color-border-base: #E4E4E7; /* Light: #E4E4E7, Dark: #27272A */
--color-border-muted: #F3F4F6; /* Light: #F3F4F6, Dark: #19191B */
```

### Semantic Status Colors

Status colors for success, error, warning, and info indicators. Each status has multiple variants (base, bg, fg, border, muted) that adapt to light/dark themes.

#### Success Colors

```css
--color-status-success-base: #22C55E;
--color-status-success-bg: #F0FDF4; /* Light: #F0FDF4, Dark: #052E16 */
--color-status-success-fg: #15803D; /* Light: #15803D, Dark: #86EFAC */
--color-status-success-border: #BBF7D0; /* Light: #BBF7D0, Dark: #166534 */
--color-status-success-muted: #86EFAC; /* Light: #86EFAC, Dark: #15803D */
```

#### Error Colors

```css
--color-status-error-base: #EF4444;
--color-status-error-bg: #FEF2F2; /* Light: #FEF2F2, Dark: #7F1D1D */
--color-status-error-fg: #DC2626; /* Light: #DC2626, Dark: #FCA5A5 */
--color-status-error-border: #FECACA; /* Light: #FECACA, Dark: #991B1B */
--color-status-error-muted: #FCA5A5; /* Light: #FCA5A5, Dark: #DC2626 */
```

#### Warning Colors

```css
--color-status-warning-base: #F59E0B;
--color-status-warning-bg: #FFFBEB; /* Light: #FFFBEB, Dark: #78350F */
--color-status-warning-fg: #D97706; /* Light: #D97706, Dark: #FCD34D */
--color-status-warning-border: #FDE68A; /* Light: #FDE68A, Dark: #92400E */
--color-status-warning-muted: #FCD34D; /* Light: #FCD34D, Dark: #D97706 */
```

#### Info Colors

```css
--color-status-info-base: #3B82F6;
--color-status-info-bg: #EFF6FF; /* Light: #EFF6FF, Dark: #1E3A8A */
--color-status-info-fg: #2563EB; /* Light: #2563EB, Dark: #93C5FD */
--color-status-info-border: #DBEAFE; /* Light: #DBEAFE, Dark: #1E40AF */
--color-status-info-muted: #93C5FD; /* Light: #93C5FD, Dark: #2563EB */
```

See [Semantic Colors documentation](/docs/foundations/semantic-colors) for detailed usage examples.

### High Contrast Mode

For better accessibility, high contrast colors are available:

```css
/* High contrast background */
--color-high-contrast-bg-base: #000000;
--color-high-contrast-bg-inverse: #FFFFFF;

/* High contrast foreground */
--color-high-contrast-fg-base: #FFFFFF;
--color-high-contrast-fg-muted: #CCCCCC;

/* High contrast button */
--color-high-contrast-button-solid-bg: #FFFFFF;
--color-high-contrast-button-solid-hover: #CCCCCC;
--color-high-contrast-button-solid-text: #000000;

/* High contrast border */
--color-high-contrast-border: #FFFFFF;

/* High contrast status colors */
--color-high-contrast-status-success-base: #00FF00;
--color-high-contrast-status-success-bg: #000000;
--color-high-contrast-status-success-fg: #00FF00;
--color-high-contrast-status-success-border: #00FF00;
--color-high-contrast-status-success-muted: #00FF00;

--color-high-contrast-status-error-base: #FF0000;
--color-high-contrast-status-error-bg: #000000;
--color-high-contrast-status-error-fg: #FF0000;
--color-high-contrast-status-error-border: #FF0000;
--color-high-contrast-status-error-muted: #FF0000;

--color-high-contrast-status-warning-base: #FFFF00;
--color-high-contrast-status-warning-bg: #000000;
--color-high-contrast-status-warning-fg: #FFFF00;
--color-high-contrast-status-warning-border: #FFFF00;
--color-high-contrast-status-warning-muted: #FFFF00;

--color-high-contrast-status-info-base: #00FFFF;
--color-high-contrast-status-info-bg: #000000;
--color-high-contrast-status-info-fg: #00FFFF;
--color-high-contrast-status-info-border: #00FFFF;
--color-high-contrast-status-info-muted: #00FFFF;
```

Enable high contrast mode by adding `data-theme="high-contrast"` to your root element.

## Spacing

Consistent spacing scale based on 4px base unit:

```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

See [Spacing Scale Visualizer](/docs/foundations/spacing) for interactive examples and usage guidelines.

## Density

Density tokens control the spacing and sizing of components for different use cases:

- **Compact**: 75% of normal spacing, smaller fonts - ideal for data-dense interfaces
- **Normal**: Default spacing and sizing - standard interface density
- **Comfortable**: 125% of normal spacing, larger fonts - ideal for touch interfaces

### Compact Density

```css
--density-compact-space-multiplier: 0.75;
--density-compact-space-base: 2px;
--density-compact-typography-line-height: 1.3;
--density-compact-typography-size-multiplier: 0.875;
--density-compact-component-height-multiplier: 0.875;
--density-compact-component-padding-multiplier: 0.75;
```

### Normal Density (Default)

```css
--density-normal-space-multiplier: 1;
--density-normal-space-base: 4px;
--density-normal-typography-line-height: 1.5;
--density-normal-typography-size-multiplier: 1;
--density-normal-component-height-multiplier: 1;
--density-normal-component-padding-multiplier: 1;
```

### Comfortable Density

```css
--density-comfortable-space-multiplier: 1.25;
--density-comfortable-space-base: 5px;
--density-comfortable-typography-line-height: 1.7;
--density-comfortable-typography-size-multiplier: 1.125;
--density-comfortable-component-height-multiplier: 1.15;
--density-comfortable-component-padding-multiplier: 1.25;
```

Apply density by adding `data-density="compact"` or `data-density="comfortable"` to your root element. The default is `data-density="normal"`.

## Motion & Animations

Motion tokens provide consistent animation timing and easing functions. All motion respects `prefers-reduced-motion` and can be disabled with `data-motion="reduced"`.

### Duration

```css
--motion-duration-fast: 150ms;
--motion-duration-base: 200ms;
--motion-duration-slow: 300ms;
--motion-duration-slower: 500ms;
```

### Easing Functions

```css
--motion-easing-linear: linear;
--motion-easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--motion-easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--motion-easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--motion-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Pre-built Transitions

```css
--motion-transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--motion-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--motion-transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations

Pre-built animation keyframes ready to use:

```css
/* Fade animations */
animation: var(--motion-animation-fade-in);
animation: var(--motion-animation-fade-out);

/* Slide animations */
animation: var(--motion-animation-slide-in);
animation: var(--motion-animation-slide-out);
```

Available animations:
- `--motion-animation-fade-in`: `fadeIn 200ms ease-in`
- `--motion-animation-fade-out`: `fadeOut 200ms ease-out`
- `--motion-animation-slide-in`: `slideIn 300ms ease-out`
- `--motion-animation-slide-out`: `slideOut 300ms ease-in`

### Reduced Motion

When `data-motion="reduced"` is set or `prefers-reduced-motion` is enabled, all motion durations become `0ms` and animations become `none`.

## Border Radius

Border radius scale for consistent rounded corners:

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
```

## Shadows

Elevation shadows for depth and layering:

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,.1);
--shadow-md: 0 4px 10px rgba(0,0,0,.15);
```

## Typography

### Font Family

```css
/* Sans-serif font (default) */
--typography-font-sans: ui-sans-serif, system-ui;

/* Monospace font */
--typography-font-mono: ui-monospace, SFMono-Regular;
```

### Font Sizes

```css
--typography-size-sm: 14px;
--typography-size-md: 16px;
--typography-size-lg: 18px;
```

### Display Styles

Large display text styles for headings and hero sections:

```css
/* Display 2xl - 72px */
.text-display-2xl {
  font-size: 72px;
  line-height: 110%;
  letter-spacing: -1.44px;
  font-family: Geist, sans-serif;
}

/* Display xl - 60px */
.text-display-xl {
  font-size: 60px;
  line-height: 110%;
  letter-spacing: -1.2px;
  font-family: Geist, sans-serif;
}

/* Display lg - 48px */
.text-display-lg {
  font-size: 48px;
  line-height: 110%;
  letter-spacing: -0.96px;
  font-family: Geist, sans-serif;
}

/* Display md - 36px */
.text-display-md {
  font-size: 36px;
  line-height: 110%;
  letter-spacing: -0.72px;
  font-family: Geist, sans-serif;
}

/* Display sm - 24px */
.text-display-sm {
  font-size: 24px;
  line-height: 110%;
  font-family: Geist, sans-serif;
}

/* Display xs - 20px */
.text-display-xs {
  font-size: 20px;
  line-height: 110%;
  font-family: Geist, sans-serif;
}
```

### Text Styles

Body text styles for paragraphs and content:

```css
/* Text 2xl - 22px */
.text-2xl {
  font-size: 22px;
  line-height: 150%;
  font-family: Geist, sans-serif;
}

/* Text xl - 20px */
.text-xl {
  font-size: 20px;
  line-height: 150%;
  font-family: Geist, sans-serif;
}

/* Text lg - 18px */
.text-lg {
  font-size: 18px;
  line-height: 150%;
  font-family: Geist, sans-serif;
}

/* Text md - 16px */
.text-md {
  font-size: 16px;
  line-height: 160%;
  font-family: Geist, sans-serif;
}

/* Text sm - 14px */
.text-sm {
  font-size: 14px;
  line-height: 160%;
  font-family: Geist, sans-serif;
}

/* Text xs - 12px */
.text-xs {
  font-size: 12px;
  line-height: 160%;
  font-family: Geist, sans-serif;
}
```

### Font Weights

Available font weights for all text styles:

```css
font-weight: 400; /* Regular */
font-weight: 500; /* Medium */
font-weight: 600; /* Semibold */
font-weight: 700; /* Bold */
```

## Internationalization & RTL

Fragment UI supports internationalization and right-to-left (RTL) languages through logical properties:

### Direction

```css
--i18n-direction-ltr: ltr;
--i18n-direction-rtl: rtl;
```

### Logical Properties

Use logical properties that automatically adapt to text direction:

```css
/* These automatically switch in RTL */
padding-inline-start: var(--space-4);
margin-inline-end: var(--space-2);
border-inline-start: 1px solid var(--color-fg-muted);
```

### Logical Property Helpers

For compatibility, CSS variables provide logical property mappings:

```css
/* Logical start/end */
--i18n-logical-start: left; /* RTL: right */
--i18n-logical-end: right; /* RTL: left */

/* Border logical properties */
--i18n-border-start: border-left; /* RTL: border-right */
--i18n-border-end: border-right; /* RTL: border-left */

/* Margin logical properties */
--i18n-margin-start: margin-left; /* RTL: margin-right */
--i18n-margin-end: margin-right; /* RTL: margin-left */

/* Padding logical properties */
--i18n-padding-start: padding-left; /* RTL: padding-right */
--i18n-padding-end: padding-right; /* RTL: padding-left */
```

### Enabling RTL

Add `dir="rtl"` to your root element or HTML tag:

```html
<html dir="rtl" lang="ar">
  <!-- All logical properties will automatically flip -->
</html>
```

## Usage Examples

### Using Tokens in CSS

```css
.my-component {
  background: var(--color-surface-1);
  color: var(--color-fg-base);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: var(--motion-transition-base);
}
```

### Using Tokens in Tailwind

```jsx
<div className="bg-[color:var(--color-surface-1)] p-[var(--space-4)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
  Content
</div>
```

### Using Tokens in TypeScript

```typescript
import tokens from "@fragment_ui/tokens/json";

const spacing = tokens.space[4]; // 16
const primaryColor = tokens.color.brand.primary; // "#6B8CFF"
const compactMultiplier = tokens.density.compact.space.multiplier; // 0.75
const radiusMd = tokens.radius.md; // 12
const shadowSm = tokens.shadow.sm; // "0 1px 2px rgba(0,0,0,.1)"
```

## Theme Switching

Switch between themes using data attributes:

```html
/* Light theme */
<html data-theme="light">

/* Dark theme (default) */
<html data-theme="dark">

/* High contrast mode */
<html data-theme="high-contrast">

/* Combined with density */
<html data-theme="dark" data-density="comfortable">

/* Combined with reduced motion */
<html data-theme="dark" data-motion="reduced">
```

### System Preference

By default, the theme respects system preference (`prefers-color-scheme`). To override, explicitly set `data-theme`:

```html
<!-- Respects system preference -->
<html>

<!-- Force light theme -->
<html data-theme="light">

<!-- Force dark theme -->
<html data-theme="dark">
```

## Related Documentation

- [Theming & Modes](/docs/foundations/theming)
- [Semantic Colors](/docs/foundations/semantic-colors)
- [Spacing Scale](/docs/foundations/spacing)
- [Typography](/docs/foundations/typography)
