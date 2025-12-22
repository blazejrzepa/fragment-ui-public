# Fragment UI

> **Code-first, AI-ready design system** built on React, TypeScript, shadcn/ui, and Tailwind.

[![npm version](https://img.shields.io/npm/v/@fragment_ui/ui.svg)](https://www.npmjs.com/package/@fragment_ui/ui)
[![npm version](https://img.shields.io/npm/v/@fragment_ui/tokens.svg)](https://www.npmjs.com/package/@fragment_ui/tokens)
[![npm version](https://img.shields.io/npm/v/@fragment_ui/blocks.svg)](https://www.npmjs.com/package/@fragment_ui/blocks)
[![npm version](https://img.shields.io/npm/v/@fragment_ui/mcp-server.svg)](https://www.npmjs.com/package/@fragment_ui/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fragment UI is a comprehensive design system that combines the flexibility of shadcn/ui with enterprise-ready tooling, documentation, and AI-native workflows.

## 🎯 What's in This Repository?

This **public repository** contains:

- ✅ **Design System Packages**:
  - `@fragment_ui/ui` - React components library (Button, Input, Dialog, etc.)
  - `@fragment_ui/tokens` - Design tokens (colors, spacing, typography)
  - `@fragment_ui/blocks` - Pre-built screen compositions (dashboards, forms, etc.)
- ✅ **MCP Server** (`@fragment_ui/mcp-server`) - AI integration for Cursor, Claude, and other AI tools
- ✅ **Documentation Site** (`apps/www`) - Complete documentation and examples
- ✅ **Examples** - Example projects showing how to use Fragment UI

**Note:** Studio/Playground (experimental AI UI builder) and governance dashboards are **not** included in this public repository. They are part of a separate private project.

## ✨ Features

- **🎨 Production-Ready Components** - Built on Radix UI primitives, fully accessible
- **📦 Code-First Distribution** - Install components via registry (`shadcn add`)
- **📚 Comprehensive Documentation** - Design System Portal with versioning and migration guides
- **🧩 Pre-Built Blocks** - Screen compositions ready to use (Dashboard, Forms, Navigation, Authentication, Pricing, etc.)
- **🎯 Design Tokens** - Extended token system with semantic colors, spacing, typography, density, motion, and i18n/RTL support
- **🌙 Theming & Modes** - Theme system with support for light, dark, and high-contrast modes
- **📱 Mobile Support** - React Native adapters (Button, Input, Checkbox, Radio, Switch)
- **🤖 AI-Native** - MCP Server for AI-assisted development (Cursor, Claude, etc.)
- **✅ Fully Tested** - Comprehensive test coverage (unit, E2E, A11y, visual regression, performance)

## 🚀 Quick Start

### Step 1: Install Design Tokens (Required)

Fragment UI relies on design tokens exposed as CSS variables. Install the tokens package first:

```bash
pnpm add @fragment_ui/tokens
# or: npm i @fragment_ui/tokens
# or: yarn add @fragment_ui/tokens
```

Then import tokens in your global CSS:

```css
/* app/globals.css (Next.js) or src/index.css (Vite/CRA) */
@import "@fragment_ui/tokens";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 2: Install Components

You have three options:

#### Option A: Fragment UI CLI (Recommended)

The CLI installs components from the registry into your repo (code-first distribution, similar to shadcn):

```bash
# Initialize (creates ./components/ui, ./components/blocks, and components.json)
npx fragmentui@latest init

# Install a component
npx fragmentui@latest add button

# List all available components
npx fragmentui@latest list
```

#### Option B: shadcn CLI (Direct Registry Install)

You can install files directly from the registry using `shadcn`:

```bash
npx shadcn@latest add https://fragmentui.com/r/button.json
```

#### Option C: Packages (Use as a Library)

If you prefer using Fragment UI as a regular component library:

```bash
pnpm add @fragment_ui/ui @fragment_ui/blocks @fragment_ui/tokens
```

Then import components:

```tsx
import { Button } from "@fragment_ui/ui";
```

See the [Setup Guide](https://fragmentui.com/docs/setup) for detailed instructions and Tailwind configuration.

## 📚 Documentation

- **[Design System Portal](https://fragmentui.com)** - Complete documentation, guides, and examples
- **[Component Documentation](https://fragmentui.com/components)** - All components with examples
- **[Design Tokens](https://fragmentui.com/docs/foundations/tokens)** - Token system documentation
- **[Theming Guide](https://fragmentui.com/docs/foundations/theming)** - Theme configuration
- **[Changelog](CHANGELOG.md)** - Version history and updates

## 🤖 AI & MCP Integration

Fragment UI includes an **MCP Server** (`@fragment_ui/mcp-server`) that exposes components, tokens, and design system rules to AI tools like Cursor and Claude.

### Setup MCP Server

1. Install the package:
```bash
pnpm add @fragment_ui/mcp-server
```

2. Configure in your MCP client (e.g., Cursor settings):
```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "node",
      "args": ["node_modules/@fragment_ui/mcp-server/dist/index.js"]
    }
  }
}
```

3. The MCP server provides:
   - Component information and suggestions
   - Design token access
   - Code validation against design system rules
   - Component code generation

**Note:** A full Studio UI for AI-powered component generation is not included in this public repository. The MCP server provides programmatic access to the design system for AI tools.

## 🎨 Components

### Core UI Components

- **Form Controls**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker, Slider, Tag Input, File Upload
- **Data Display**: Table, DataTable, Card, Badge, Avatar, Progress, Spinner, Skeleton, Tree View, Timeline
- **Feedback**: Dialog, AlertDialog, Toast, Tooltip, Popover, HoverCard, Sheet
- **Navigation**: Tabs, Accordion, Dropdown Menu, Context Menu, Navigation Menu, Breadcrumbs, Menubar, Separator
- **Forms**: FormField, Command Palette, Combobox, Multi-Select
- **Layout**: Pagination, Collapsible, Scroll Area, Resizable, Carousel
- **Interactive**: Toggle, Toggle Group, Calendar, Color Picker, Rating, Split Button

### Blocks

Pre-built screen compositions including Dashboard Layout, Form Container, Card Grid, Navigation Header, Settings Screen, Authentication Block, Pricing Table, and more.

See the [full component catalog](https://fragmentui.com/components) for details.

## 🛠️ Development

### Installation

```bash
pnpm install
```

### Development

```bash
# Run documentation site
pnpm dev:www

# (Optional) Generate shadcn-style registry files (served from /r/*.json on the website)
pnpm registry:generate

# Run Storybook for UI components
pnpm storybook

# Build all packages
pnpm build

# Type check
pnpm type-check

# Run tests
pnpm test
```

### Package Structure

```
fragment-ui-public/
├── packages/
│   ├── ui/          # React components library
│   ├── tokens/      # Design tokens
│   ├── blocks/      # Pre-built screen compositions
│   └── mcp-server/  # MCP server for AI integration
├── apps/
│   └── www/         # Documentation site
└── examples/         # Example projects
```

## 📦 Publishing

Packages are published to npm:

- `@fragment_ui/ui` - [npm](https://www.npmjs.com/package/@fragment_ui/ui)
- `@fragment_ui/tokens` - [npm](https://www.npmjs.com/package/@fragment_ui/tokens)
- `@fragment_ui/blocks` - [npm](https://www.npmjs.com/package/@fragment_ui/blocks)
- `@fragment_ui/mcp-server` - [npm](https://www.npmjs.com/package/@fragment_ui/mcp-server)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Key points:**
- Public DS contributions must meet quality gates (tests, docs, a11y)
- See [Public DS Development Guidelines](docs/OSS_PUBLIC_DS_GUIDELINES.md) for detailed requirements
- Experimental tooling contributions are welcome but may evolve quickly

## 🔗 Links

- **Website**: [fragmentui.com](https://fragmentui.com)
- **Documentation**: [fragmentui.com/docs](https://fragmentui.com/docs)
- **Components**: [fragmentui.com/components](https://fragmentui.com/components)
- **GitHub**: [github.com/blazejrzepa/fragment-ui-public](https://github.com/blazejrzepa/fragment-ui-public)

---

**Note:** This repository contains the public design system. Studio/Playground (experimental AI UI builder) and internal tooling are maintained in a separate private repository.
