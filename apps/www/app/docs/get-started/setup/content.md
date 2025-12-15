---
title: Setup
---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18 or higher installed
- **React** 18 or higher
- **Tailwind CSS** configured in your project
- A package manager (`npm`, `yarn`, `pnpm`, `bun`)

## Installation

### Option 1: Using the CLI (Recommended)

The easiest way to get started is using the Fragment UI CLI:

```bash
# Initialize your project
npx @fragment_ui/cli init
# Install a component
npx @fragment_ui/cli add button
# List all available components
npx @fragment_ui/cli list
# Check for updates
npx @fragment_ui/cli check
# Update a component
npx @fragment_ui/cli update button
```

**Note:** The package name is `@fragment_ui/cli` (not `@fragment-ui/cli`).

### Option 2: Using shadcn CLI

You can also install components using the shadcn CLI with our registry:

```bash
# Install a component from Fragment UI registry
npx shadcn@latest add https://fragmentui.com/r/button.json
```

**Registry URL:** `https://fragmentui.com/r/[component-name].json`

All registry files are hosted and automatically available. See [Registry Documentation](/docs/tools/registry/deployment) for more details.

### Option 3: Manual Installation

Download component files directly from the registry at `https://fragmentui.com/r/[component-name].json` and copy the files to your project.

## Configuration

### Tailwind CSS Setup

Make sure your `tailwind.config.js` includes the Fragment UI content paths:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add Fragment UI components path
    "./node_modules/@fragment_ui/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### CSS Variables

Import the Fragment UI tokens in your global CSS file:

```css
@import "@fragment_ui/tokens/dist/tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Theme Provider

Wrap your application with the ThemeProvider to enable theme switching:

```jsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Verifying Installation

Test your installation by creating a simple component:

```jsx
import { Button } from "@fragment_ui/ui";

export default function TestPage() {
  return (
    <div className="p-8">
      <Button>Click me</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
    </div>
  );
}
```

Or use the [Component Playground](/docs/tools/playground) to test components interactively without installation.

## Using Studio (No Installation Required)

If you want to try Fragment UI without installing anything locally, you can use Studio - our AI-powered web-based screen generator:

1. Navigate to [Studio](http://localhost:3002/studio)
2. Describe what you want to build in natural language
3. Preview and export the generated code
4. Copy the code to your project

Studio generates production-ready React/TSX code using Fragment UI components, which you can then install and customize in your project.

**Note:** Studio is perfect for rapid prototyping and learning Fragment UI patterns. For production projects, we recommend installing components locally using the methods above.

## Next Steps

- [Studio](http://localhost:3002/studio) - Try AI-powered screen generation without installation
- [Design Tokens](/docs/foundations/tokens) - Learn about the design token system
- [Examples](/docs/examples) - See components in action
- [MCP Server](/docs/get-started/mcp-server) - Set up AI integration

