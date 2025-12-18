# @fragment_ui/tokens

Design tokens for Fragment UI Design System.

## Installation

```bash
pnpm add @fragment_ui/tokens
```

## Quick Start

Import tokens in your CSS file:

```css
@import "@fragment_ui/tokens";
```

Or import in JavaScript/TypeScript:

```ts
import "@fragment_ui/tokens";
```

## Usage

Tokens are available as CSS variables:

```css
.my-component {
  color: var(--color-fg-base);
  background: var(--color-surface-1);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

## Documentation

- **[Design Tokens](https://fragment-ui.dev/docs/foundations/tokens)** - Complete token reference
- **[Theming](https://fragment-ui.dev/docs/foundations/theming)** - Customization guide
- **[Dark Mode](https://fragment-ui.dev/docs/foundations/dark-mode)** - Dark mode configuration

## Token Categories

- **Colors** - Semantic color system with light/dark themes
- **Spacing** - Consistent spacing scale
- **Typography** - Font families, sizes, and weights
- **Elevation** - Shadow and depth tokens
- **Motion** - Animation and transition tokens
- **Density** - Compact and comfortable density modes

## License

MIT

