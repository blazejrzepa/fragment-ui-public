---
title: Setup
---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18.18+ (Node 20 recommended)
- **React** 18 or higher
- **Tailwind CSS** configured in your project (Fragment UI components use Tailwind classes + CSS variables)
- A package manager (`npm`, `yarn`, `pnpm`, `bun`)

## 1) Install design tokens (required)

Fragment UI relies on design tokens exposed as CSS variables. Install the tokens package and import it once in your global CSS:

```bash
pnpm add @fragment_ui/tokens
# or: npm i @fragment_ui/tokens
# or: yarn add @fragment_ui/tokens
```

```css
/* app/globals.css (Next.js) or src/index.css (Vite/CRA) */
@import "@fragment_ui/tokens";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 2) Install components

### Option A: Fragment UI CLI (recommended)

The CLI installs components from the registry into your repo (code-first distribution, similar to shadcn).

```bash
# Initialize (creates ./components/ui, ./components/blocks, and components.json)
npx fragmentui@latest init

# Install a component (downloads from https://fragmentui.com/r/<name>.json)
npx fragmentui@latest add button

# List all available components
npx fragmentui@latest list

# Check what's installed in the current directory
npx fragmentui@latest check
```

Notes:
- To reinstall over existing files, use `--overwrite` (example: `npx fragmentui@latest add button --overwrite`).
- The CLI also ships an alias binary `ds` (useful if you install it globally).

### Option B: shadcn CLI (direct registry install)

You can install files directly from the registry using `shadcn`:

```bash
npx shadcn@latest add https://fragmentui.com/r/button.json
```

Registry URL pattern: `https://fragmentui.com/r/[component-name].json`

### Option C: Packages (use as a library)

If you prefer using Fragment UI as a regular component library (instead of copying files into your repo), install the packages:

```bash
pnpm add @fragment_ui/ui @fragment_ui/blocks @fragment_ui/tokens
```

## Tailwind configuration notes

Make sure Tailwind scans the files where Fragment UI classes live:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // If you use Fragment UI as packages, also include:
    "./node_modules/@fragment_ui/ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@fragment_ui/blocks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
```

## Using components

### If you installed via CLI / registry

Components are written into your repo (by default: `components/ui` and `components/blocks`). Import them from your local path (adjust to your project aliases):

```tsx
import { Button } from "@/components/ui/Button";
```

### If you installed packages

```tsx
import { Button } from "@fragment_ui/ui";
```

## Theme & modes

Fragment UI theming is driven by CSS variables. You can switch modes via data attributes (see [Theming & Modes](/docs/foundations/theming)).

## Dependency notes (important)

When you install a component, make sure your project has the dependencies it imports (for example `clsx`, `lucide-react`, or Radix packages). If a component imports other local components (for example `./Spinner`), install those too.

## Next Steps

- [Design Tokens](/docs/foundations/tokens) - Learn about the design token system
- [Examples](/docs/examples) - See components in action
- [MCP Server](/docs/mcp-server) - Set up AI integration


