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
- **🎯 Design Tokens** - Extended token system with semantic colors, spacing, typography
- **🌙 Theming & Modes** - Theme system with support for light, dark, and high-contrast modes
- **🤖 AI-Native** - MCP Server for AI-assisted development (Cursor, Claude, etc.)
- **✅ Fully Tested** - Comprehensive test coverage (unit, E2E, A11y)

## 🚀 Quick Start

### Install Components in Your Project

```bash
# Install a component from the registry
npx shadcn@latest add https://fragmentui.com/r/button.json
```

### Use in Your Project

```bash
# Install Fragment UI packages
pnpm add @fragment_ui/ui @fragment_ui/tokens @fragment_ui/blocks

# Import tokens in your CSS
@import "@fragment_ui/tokens";

# Use components
import { Button } from "@fragment_ui/ui";
```

See the [Getting Started Guide](https://fragmentui.com/docs/get-started/introduction) for more details.

## 📚 Documentation

- **[Design System Portal](https://fragmentui.com)** - Complete documentation, guides, and examples
- **[Component Documentation](https://fragmentui.com/components)** - All components with examples
- **[Design Tokens](https://fragmentui.com/docs/foundations/tokens)** - Token system documentation
- **[Theming Guide](https://fragmentui.com/docs/foundations/theming)** - Theme configuration

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

- **Form Controls**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker, Slider
- **Data Display**: Table, DataTable, Card, Badge, Avatar, Progress, Spinner, Skeleton
- **Feedback**: Dialog, AlertDialog, Toast, Tooltip, Popover, HoverCard, Sheet
- **Navigation**: Tabs, Accordion, Dropdown Menu, Context Menu, Navigation Menu, Breadcrumbs
- **Forms**: FormField, Command Palette, Combobox, Multi-Select
- **Layout**: Pagination, Collapsible, Scroll Area, Resizable, Carousel

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
fragment-ui/
├── packages/
│   ├── ui/          # React components library
│   ├── tokens/      # Design tokens
│   ├── blocks/      # Pre-built screen compositions
│   └── mcp-server/  # MCP server for AI integration
├── apps/
│   └── www/         # Documentation site
└── examples/        # Example projects
```

## 📦 Publishing

Packages are published to npm:

- `@fragment_ui/ui` - [npm](https://www.npmjs.com/package/@fragment_ui/ui)
- `@fragment_ui/tokens` - [npm](https://www.npmjs.com/package/@fragment_ui/tokens)
- `@fragment_ui/blocks` - [npm](https://www.npmjs.com/package/@fragment_ui/blocks)
- `@fragment_ui/mcp-server` - [npm](https://www.npmjs.com/package/@fragment_ui/mcp-server)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📚 Documentation

- **[Quick Start Guide](docs/getting-started.md)** - Get started quickly
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Changelog](CHANGELOG.md)** - Version history
- **[Full Documentation](docs/README.md)** - Complete documentation index

### Setup & Deployment
- **[Deployment Guide](docs/setup/deployment.md)** - Deploy to production
- **[Setup Steps](docs/setup/setup-steps.md)** - Step-by-step setup
- **[Workflow Guide](docs/setup/workflow.md)** - Working with repositories
- **[Publishing Guide](docs/guides/publishing.md)** - Publish to npm

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🔗 Links

- **Website**: [fragmentui.com](https://fragmentui.com)
- **Documentation**: [fragmentui.com/docs](https://fragmentui.com/docs)
- **Components**: [fragmentui.com/components](https://fragmentui.com/components)
- **GitHub**: [github.com/blazejrzepa/fragment-ui-public](https://github.com/blazejrzepa/fragment-ui-public)
  
**Note:** This is the clean design system repository. For the full monorepo with Studio/Playground, see [fragment-ui](https://github.com/blazejrzepa/fragment-ui).

---

**Note:** This repository contains the public design system. Studio/Playground (experimental AI UI builder) and internal tooling are maintained in a separate private repository.

