# Fragment UI

> **Code-first, AI-ready design system** built on React, TypeScript, shadcn/ui, and Tailwind.

Fragment UI is a comprehensive design system that combines the flexibility of shadcn/ui with enterprise-ready tooling, documentation, and AI-native workflows.

## 🎯 What is Public vs Experimental?

This repository contains:

- ✅ **Public Design System** (officially supported): `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`, and documentation
- 🧪 **Experimental Tooling** (not guaranteed stable): Studio, Playground, Copilot, and internal automation

**For external users:** Use the public Design System packages. Studio/Playground are experimental and may require special setup.

**See:** [Public Scope](PUBLIC_SCOPE.md) | [OSS FAQ](docs/OSS_FAQ.md)

## 📚 Ecosystem Documentation

Fragment UI consists of three related projects:

- **`fragment-ui`** - This repository (private, full stack)
- **`fragment-ui-public`** - Public design system (public repository)
- **`fragment-ui-generative-copilot`** - Experimental AI tool (experimental)

**See:** 
- [Projects Overview](./PROJECTS_OVERVIEW.md) - Complete overview of all projects and their relationships
- [Combined Changelog](./CHANGELOG_COMBINED.md) - Unified changelog for all projects
- [Roadmap](./ROADMAP.md) - Development roadmap for the entire ecosystem

## ✨ Features

- **🎨 Production-Ready Components** - Built on Radix UI primitives, fully accessible
- **📦 Code-First Distribution** - Install components via registry (`shadcn add`)
- **📚 Comprehensive Documentation** - Design System Portal with versioning and migration guides
- **🧩 Pre-Built Blocks** - Screen compositions ready to use (Dashboard, Forms, Navigation, Authentication, Pricing, etc.)
- **🎯 Design Tokens** - Extended token system with semantic colors, spacing, typography, density, motion, and i18n/RTL support
- **🌙 Theming & Modes** - Theme system with support for light, dark, and high-contrast modes
- **📱 Mobile Support** - React Native adapters (Button, Input, Checkbox, Radio, Switch)
- **🤖 AI-Native** - Optimized for AI-assisted development with MCP Server, VS Code Extension, and enforcement rules
- **✅ Fully Tested** - Comprehensive test coverage (unit, E2E, A11y, visual regression, performance)

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
- **[Changelog](https://fragmentui.com/docs/changelog)** - Version history and updates

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

## 🎯 Design Tokens

Fragment UI includes an extended design token system:

- **Colors**: Semantic color system (backgrounds, text, surfaces, status states)
- **Spacing**: Consistent spacing scale based on a 4px unit
- **Typography**: Font families, sizes, weights, line heights, and text styles for headings, body, and display text
- **Density, Motion, and i18n/RTL**: Extended tokens exposed as CSS variables

## 🛠️ Development

### Installation

```bash
pnpm install
```

### Development

```bash
# Run portal, demo, and Storybook in parallel
pnpm dev

# Design System Portal: http://localhost:3000
# Demo App: http://localhost:3002
# Storybook: http://localhost:6006
```

### Building

```bash
# Build design tokens
pnpm tokens:build

# Generate registry JSON files
pnpm registry:generate

# Build all packages
pnpm build

# Run tests
pnpm test
```

## 🧪 Testing

- **Unit Tests**: Vitest + React Testing Library
- **A11y Tests**: Automated accessibility testing (WCAG 2.1 compliance)
- **E2E Tests**: Playwright tests for core workflows
- **Visual Regression**: Chromatic integration
- **Performance Tests**: Lighthouse CI with performance budgets

## 📖 Versioning

Fragment UI follows [Semantic Versioning](https://semver.org/):
- **Major versions**: Breaking changes
- **Minor versions**: New features (backward compatible)
- **Patch versions**: Bug fixes

See the [changelog](https://fragmentui.com/docs/changelog) for version history and migration guides.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) first.

**Key points:**
- Public DS contributions must meet quality gates (tests, docs, a11y)
- See [Public DS Development Guidelines](docs/OSS_PUBLIC_DS_GUIDELINES.md) for detailed requirements
- Experimental tooling contributions are welcome but may evolve quickly

**Quick links:**
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [OSS FAQ](docs/OSS_FAQ.md)

## 📄 License

[Add your license here]

## 🙏 Credits

Built on top of:
- [shadcn/ui](https://ui.shadcn.com/) - Component primitives
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Next.js](https://nextjs.org/) - React framework
- [Storybook](https://storybook.js.org/) - Component development environment

---

**Version**: 0.1.0  
**Last Updated**: December 2025

## 🎉 What's New in v0.1.0

### First Public Release

This is the first public release of Fragment UI as a **code-first, AI-ready design system** built on React, TypeScript, shadcn/ui, and Tailwind.

#### Core Features

- **Design Tokens** - Color system with semantic tokens, spacing scale, typography tokens, and extended tokens (density, motion, i18n/RTL)
- **Theming & Modes** - Theme system with support for light, dark, and high-contrast modes, density modes, and system preference support
- **Component Library** - React components built on shadcn/ui and Radix primitives with consistent APIs and props
- **Setup & Tooling** - CLI for installing components and tokens, Tailwind configuration, and theme management utilities
- **Documentation** - Comprehensive documentation with foundations, getting started guides, and component overview pages

#### Updated Component Documentation

24 components have been updated with improved documentation and examples:
- Accordion, Activity Feed, Alert, Avatar, Badge, Breadcrumbs, Button, Card, Carousel, Checkbox, Collapsible, Combobox, Command Palette, Context Menu, Dialog, Dropdown Menu, File Upload, Hover Card, Input, Kbd, Label, Menubar, Metric Card, Navigation Menu
