---
title: Changelog
description: Release notes and updates.
---

##  December 2025 - Theme Editor & Documentation Refactoring (0.1.1)

**Theme Editor:**
- **Live Design Token Customization** - New Theme Editor panel accessible from the header palette icon
- **Real-time Preview** - Customize design tokens (colors, spacing, typography, radius) and see changes instantly on the page
- **Token Categories** - Edit tokens by category: Colors, Typography, Spacing, Radius, and Font Families
- **Color Picker Integration** - Visual color picker for easy color customization
- **Font Selection** - Choose from 30+ Google Fonts or use system fonts
- **Theme Persistence** - Customizations are saved to localStorage and persist across sessions
- **Reset Functionality** - One-click reset to default theme values
- **Export Theme** - Copy CSS variables for your custom theme

**Documentation Refactoring:**
- **Complete Documentation Overhaul** - Refactored 90+ documentation pages to comply with Design System standards
- **Design Token Migration** - Replaced all hardcoded values with design tokens
- **Consistent Styling** - All pages use consistent Tailwind classes with design tokens
- **Improved Code Quality** - All pages follow best practices and pass linting

**Components Documentation:**
- **API Tables Standardization** - All component API reference tables now use consistent styling
- **Header Consistency** - Standardized headers across all documentation pages
- **Spacing Consistency** - Unified spacing using design tokens throughout documentation



## December 2025 – First public release (0.1.0)

This is the first public release of Fragment UI as a **code-first, AI-ready design system** built on React, TypeScript, shadcn/ui, and Tailwind.

### Added

- **Core design tokens**
  - Color system with semantic tokens (backgrounds, text, surfaces, status states).
  - Spacing scale based on a 4px unit.
  - Typography tokens and text styles for headings, body, and display text.
  - Density, motion, and i18n/RTL tokens exposed as CSS variables.

- **Theming & modes**
  - Theme system with support for light and dark modes.
  - Density modes and system preference support.

- **Component library (code-first)**
  - React components built on shadcn/ui and Radix primitives.
  - Consistent APIs and props, ready to customize in your own repository.
  - Tailwind-based styling wired to Fragment UI tokens.

- **Setup & tooling**
  - CLI for installing components and tokens.
  - Tailwind configuration and token imports.
  - Theme management utilities.

- **Documentation**
  - Foundations: Design Tokens, Theming & Modes, Colors, Typography, Spacing.
  - Getting Started: Introduction and Setup.
  - Overview pages for Components and Blocks.

### Updated

- **Component documentation and examples**
  - Accordion
  - Activity Feed
  - Alert
  - Avatar
  - Badge
  - Breadcrumbs
  - Button
  - Card
  - Carousel
  - Checkbox
  - Collapsible
  - Combobox
  - Command Palette
  - Context Menu
  - Dialog
  - Dropdown Menu
  - File Upload
  - Hover Card
  - Input
  - Kbd
  - Label
  - Menubar
  - Metric Card
  - Navigation Menu
