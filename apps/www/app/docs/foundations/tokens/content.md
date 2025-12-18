---
title: Design Tokens
---

## Install & Import

Tokens are shipped as CSS variables. Install `@fragment_ui/tokens` and import it once in your global CSS:

```css
@import "@fragment_ui/tokens";
```

## Colors

All colors are available as CSS variables with semantic naming. Colors automatically adapt to light/dark/high-contrast themes.

### Background Colors

```css
/* Semantic tokens (change with theme) */
background: var(--color-bg-base);
background: var(--color-bg-inverse);

/* Raw palette (fixed values) */
background: var(--palette-zinc-50);
```

### Foreground Colors

```css
color: var(--color-fg-base);
color: var(--color-fg-muted);
```

### Brand Colors

```css
color: var(--color-brand-primary);
background: var(--color-brand-primary-600);
```

### Button Colors

```css
/* Solid button colors */
background: var(--color-button-solid-bg);
color: var(--color-button-solid-text);
```

### Surface Colors

```css
background: var(--color-surface-1);
background: var(--color-surface-2);
```

### Accent Colors

```css
--color-accent-green: green 500;
--color-accent-red: red 500;
```

### Border Colors

```css
border-color: var(--color-border-base);
border-color: var(--color-border-muted);
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

Note: the effective (active) density variables used by components are:

```css
--density-space-multiplier: 1;
--density-space-base: 4px;
--density-typography-line-height: 1.5;
--density-typography-size-multiplier: 1;
--density-component-height-multiplier: 1;
--density-component-padding-multiplier: 1;
```

## Motion & Animations

Motion tokens provide consistent animation timing and easing functions. Motion can be disabled with `data-motion="reduced"`. By default, tokens also follow `prefers-reduced-motion` unless you explicitly set `data-motion="normal"`.

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
--typography-font-sans: Geist, ui-sans-serif, system-ui, sans-serif;

/* Monospace font */
--typography-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

### Font Sizes

```css
--typography-size-xs: 12px;
--typography-size-intro: 15px;
--typography-size-sm: 14px;
--typography-size-md: 16px;
--typography-size-lg: 18px;
--typography-size-xl: 20px;
--typography-size-2xl: 22px;
```

For the complete typography scale (display/text styles), weights, and usage examples, see [Typography documentation](/docs/foundations/typography).

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

const spacing = tokens.space["4"]; // 16 (px)
const primaryColor = tokens.color.light.brand.primary; // "#6366F1"
const compactMultiplier = tokens.density.compact.space.multiplier; // 0.75
const radiusMd = tokens.radius.md; // 12
const shadowSm = tokens.shadow.sm; // "0 1px 2px rgba(0,0,0,.1)"
```

## Theme Switching

Switch between themes using data attributes:

```html
/* Light theme */
<html data-theme="light">

/* Dark theme */
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
