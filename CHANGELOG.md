# Changelog

All notable changes to Fragment UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** This is the main changelog for the `fragment-ui` monorepo. For a combined changelog covering all projects (fragment-ui, fragment-ui-public, fragment-ui-generative-copilot), see [CHANGELOG_COMBINED.md](./CHANGELOG_COMBINED.md).

## [1.8.0] - 2025-01-05

### 🎉 Components & Performance Release

#### Added

**New Components (5 components):**
- **Segmented Control** - iOS-style segmented control for selecting mutually exclusive options
- **Rating** - Star rating component with half-star support and read-only mode
- **File Upload / Dropzone** - File upload with drag & drop, preview, and validation
- **Split Button** - Button combining primary action with dropdown menu
- **Tag Input** - Input field for multiple tags with autocomplete

**Performance Optimizations:**
- **React.memo** - Applied to 18+ components to prevent unnecessary re-renders
- **useMemo/useCallback** - Optimized expensive calculations and event handlers
- **Loading States** - Consistent loading indicators across components
- **Error States** - Enhanced error handling and validation feedback

**Advanced Features:**
- **Component Usage Analytics Dashboard** - Track component installations, views, and popularity
- **Component Migration Assistant** - Automated migrations between versions using AST transformations
- **Design System Governance Dashboard** - Track compliance, metrics, and issues

**Developer Experience:**
- **Upstream Patches System** - Manage customizations to upstream (shadcn/ui) components
- **Rebase Process** - Documented process for managing upstream updates

**UI Improvements:**
- **Dark Mode as Default** - Dark mode is now the default theme
- **Improved Navigation** - Enhanced sidebar and top navigation with better spacing and layout
- **Table of Contents** - Dynamic table of contents in right sidebar for documentation pages
- **Consistent Headers** - Standardized headers and subtitles across all documentation pages

#### Changed

- **Default Theme** - Changed from "system" to "dark" mode
- **Navigation Layout** - Improved spacing and layout in sidebar and top navigation
- **Documentation Structure** - All example pages now have consistent headers and formatting

#### Technical Details

- **Total Components:** 58 → 63 (added 5 new components)
- **Performance:** 18+ components optimized with React.memo
- **Documentation:** 24 example pages updated with consistent formatting

---

## [1.7.0] - 2025-01-05

### 🎉 Advanced Developer Experience & Analytics Release

#### Added

**VS Code Extension v0.2.0:**
- **Advanced Prop Suggestions** - Type-aware prop suggestions with enum value completions and required props highlighting
- **Code Actions (Refactoring)** - Convert native HTML elements to Fragment UI components, extract components, and add missing props
- **Component Playground Integration** - Open components in playground directly from VS Code and copy playground code
- **Enhanced IntelliSense** - Improved autocomplete with better hover information showing props, required props, and enum values
- **Better Hover Documentation** - Enhanced hover tooltips with component props, required props, enum values, and links to playground

**Component Comparison Tool:**
- **Side-by-Side Comparison** - Visual comparison of components with props, usage examples, and visual previews
- **Props Comparison** - Detailed comparison of component props, highlighting differences and similarities
- **Usage Examples** - Side-by-side code examples showing when to use each component
- **When to Use Guide** - Clear guidance on component selection based on use cases
- **Interactive Preview** - Live preview of components for visual comparison

**Database Integration (ROI Metrics):**
- **SQLite Database** - Persistent storage for ROI metrics with historical data tracking
- **Historical Metrics** - Track metrics over time with date-based queries
- **Export Functionality** - Export ROI data to CSV/JSON for reporting
- **API Endpoints** - RESTful API for metrics history and export (`/api/roi`, `/api/roi/history`, `/api/roi/export`)
- **Schema Management** - Structured database schema for metrics, components, and repositories

**MCP Server (Model Context Protocol):**
- **AI-Native Workflow** - MCP server for Cursor/Copilot integration
- **Component Information** - Get component details, props, and usage examples via MCP
- **Code Validation** - Validate code against design system rules (no raw colors/spacing)
- **Code Generation** - Generate Fragment UI component code via MCP tools
- **Design Tokens Access** - Access design tokens programmatically

**Telemetry & ROI Dashboard:**
- **GitHub Integration** - Track PRs, Figma links, and component usage via webhooks (`/api/github/webhook`)
- **ROI Metrics Tracking** - Lead time, adoption rate, reuse rate, time-to-ship, maintenance cost, onboarding time
- **ROI Dashboard UI** - Interactive dashboard with KPI cards, status indicators, and progress bars
- **Historical Data** - View metrics trends over time
- **Export Reports** - Export ROI data for leadership presentations

**UI Redesign:**
- **Fixed Sidebar Navigation** - Always-visible sidebar on desktop with scrollable navigation
- **Simplified Top Navigation** - Clean top bar with Components/Blocks/Examples links
- **Responsive Layout** - Improved mobile/desktop experience
- **Removed Hamburger Menu** - Hamburger menu only on mobile, always-visible sidebar on desktop

**Theme Improvements:**
- **Immediate Theme Switching** - Theme changes apply instantly without page refresh
- **Improved useTheme Hook** - Better state synchronization and theme management
- **Better UX** - Smoother theme transitions and state management

**Governance Framework:**
- **RFC Process** - Request for Comments process for proposing changes
- **Deprecation Policy** - Clear deprecation guidelines and timelines
- **Contributing Guide** - Comprehensive contribution guidelines
- **RACI Matrix** - Responsibility assignment matrix for design system management

#### Changed

- **Theme Toggle** - Now works immediately without page refresh
- **Navigation Layout** - Redesigned with fixed sidebar and simplified top navigation
- **VS Code Extension** - Upgraded from v0.1.0 to v0.2.0 with advanced features

#### Technical Details

- **New Package:** `@fragment_ui/mcp-server` (v0.1.0)
- **Database:** SQLite integration in `@fragment_ui/telemetry` package
- **VS Code Extension:** v0.1.0 → v0.2.0
- **New API Routes:** 4 new API endpoints for ROI metrics and GitHub integration
- **Documentation:** 10+ new guides and documentation pages

---

## [1.6.0] - 2025-01-05

### 🎉 Ecosystem & Tooling Release

#### Added

**CLI Enhancements:**
- **Enhanced CLI Commands** - New commands for better component management:
  - `ds list` - List all available components and blocks
  - `ds check [path]` - Check installed components and verify dependencies
  - `ds init [path]` - Initialize Fragment UI in a project
  - `ds update <component>` - Update component to latest version
  - `ds remove <component>` - Remove component from project
  - `ds plugin list` - List installed plugins
  - `ds plugin run <id>` - Run plugin actions
- **Dependency Checking** - Automatic verification of required dependencies (react, react-dom)
- **Component Discovery** - Easy discovery of available components and blocks

**VS Code Extension:**
- **Component Autocomplete** - IntelliSense for all Fragment UI components in JSX and imports
- **Hover Documentation** - View component documentation, import statements, and links to docs/Storybook on hover
- **Import Snippets** - Quick import statements for components
- **Quick Actions** - Commands for adding components, opening docs, and opening Storybook
- **Component Search** - Search and insert components from command palette
- **Component Snippets** - Pre-built snippets for common components (Button, Input, Dialog, Card, Select, Tabs)
- **Configuration** - Customizable Storybook and documentation URLs

**Plugin System:**
- **Plugin Architecture** - Extensible plugin system for Fragment UI
- **Plugin Loader** - Load and manage plugins from directories
- **Plugin Types** - Support for multiple plugin types:
  - Theme Plugins - Transform themes and provide presets
  - Component Generator Plugins - Generate components from templates
  - Integration Plugins - Integrate with external tools
- **Plugin Context** - Access to registry, logger, file system, and configuration
- **Example Plugins** - 3 example plugins:
  - Theme Preset Plugin - Provides theme presets (minimal, ocean, forest)
  - Component Generator Plugin - Generates components with tests and stories
  - Figma Integration Plugin - Integrates with Figma
- **CLI Integration** - Plugin management through CLI commands

#### Technical Details

- **New Packages:** `@fragment_ui/plugin-system` (v0.1.0), `fragment-ui` VS Code Extension (v0.1.0)
- **CLI Commands:** 6 new commands (list, check, init, update, remove, plugin)
- **VS Code Extension:** Packaged as `.vsix` file (16.99 KB)
- **Plugin System:** Full TypeScript support with type-safe API
- **Tests:** Unit tests for Plugin System (11 tests passing)

---

## [1.5.0] - 2025-01-05

### 🎉 Advanced Components & Developer Experience Release

#### Added

**New Components (2 components):**
- **Tree View** - Hierarchical tree structure component with expandable/collapsible nodes, checkbox selection, custom icons, click/double-click handlers, and keyboard navigation support. Perfect for file explorers, navigation menus, and hierarchical data display
- **Color Picker** - Color selection component with HEX/RGB/HSL format support, visual color picker interface, text input for direct color entry, preset colors (customizable), and automatic format conversion

**Component Enhancements:**
- **Multi-Select Enhancements** - Added loading state support with spinner indicator and async options support for dynamically loaded options
- **Command Dialog Enhancements** - Enhanced command palette with nested commands support, command groups, recent commands with localStorage persistence, and improved grouping
- **Popover Enhancements** - Added custom positioning controls (alignOffset, collisionPadding), portal support, and improved collision detection

**Developer Experience:**
- **Component API Generator** - Automatic API documentation generator from TypeScript types. Extracts prop types, generates markdown documentation, supports union types, arrays, functions, and React types. Script: `pnpm api:generate`. Generates 35+ API documentation files

**Documentation:**
- Tree View documentation page with examples (basic usage, checkboxes, default expanded, callbacks)
- Color Picker documentation page with examples (different formats, presets, custom presets)
- Auto-generated API documentation in `docs/api/` directory (35 files)
- Updated component registry with Tree View and Color Picker

#### Changed

- Enhanced Multi-Select with loading state indicator
- Improved Command Palette with nested commands and recent commands
- Enhanced Popover with better positioning and collision detection
- Updated Storybook link mappings for Tree View and Color Picker

#### Technical Details

- **Dependencies Added:** `react-colorful` (for Color Picker), `@typescript-eslint/parser`, `@typescript-eslint/typescript-estree` (for API Generator)
- **Total Components:** 47 → 49 (added 2 new components)
- **API Documentation:** 35 auto-generated API docs files
- **Component API Generator:** New script `pnpm api:generate` for automatic documentation generation

---

## [1.4.0] - 2024-12-27

### 🎉 Component Expansion & Polish Release

#### Added

**New Components (7 components):**
- **Calendar** - Full calendar component with month/year view, multiple date selection, calendar events, and range selection
- **Collapsible** - Expandable content sections with smooth animations and icon indicators
- **Toggle** - Single toggle button component with variants and sizes
- **Toggle Group** - Group of toggle buttons with single/multiple selection support
- **Scroll Area** - Custom scrollable area with styled scrollbars and auto-hide option
- **Resizable** - Resizable panels and containers with drag handles and min/max sizes
- **Aspect Ratio** - Component for maintaining aspect ratios in responsive layouts

**Component Enhancements:**
- **DataTable** - Full-featured table with sorting, filtering, selection, column resizing, and pagination
- **Form Enhancements** - FormEnhanced, FormArray, ConditionalField with integrated validation
- **Dialog Enhancements** - Fullscreen variant and nested dialogs support
- **Tabs Enhancements** - Icon-only tabs and improved animations

**Documentation:**
- Component Examples Library - 24 real-world usage examples
- Migration Guides - Complete guides for version upgrades
- Troubleshooting Guide - Comprehensive guide for common issues

#### Changed

- Enhanced Table component with DataTable features
- Improved Form components with advanced features
- Enhanced Dialog with fullscreen support
- Improved Tabs with more variants

#### Technical Details

- **Total Components:** 40 → 47 (added 7 new components)
- **Dependencies Added:** `react-day-picker` (for Calendar), `@radix-ui/react-collapsible`, `@radix-ui/react-toggle-group`, `@radix-ui/react-scroll-area`, `react-resizable-panels` (for Resizable)
- **Documentation:** 24 new example pages

---

## [1.3.0] - 2024-12-20

### 🎉 Testing, Dark Mode & Semantic Colors Release

#### Added

**Testing & Quality:**
- **Enhanced A11y Tests** - Automated accessibility testing for all 49 components
- **Performance Tests** - Lighthouse CI, bundle size limits, Core Web Vitals
- **Visual Regression Tests** - Enhanced Chromatic integration with viewport and theme testing

**Design System:**
- **Dark Mode Tokens** - Complete dark mode support with automatic switching
- **Semantic Color Tokens** - Status colors system (success, error, warning, info)
- **Spacing Scale Visualizer** - Interactive spacing reference tool

**Components:**
- **Menubar** - Traditional application menubar with keyboard shortcuts

**Enhancements:**
- **Toast Enhancements** - Action buttons, promise toasts, custom positioning
- **Progress Enhancements** - Circular progress, step progress, custom colors
- **More Native Components** - React Native support (Checkbox, Radio, Switch)
- **Mobile Block Examples** - Mobile-first patterns and examples

#### Technical Details

- **Total Components:** 39 → 40 (added Menubar)
- **Tests:** 94+ unit tests, E2E tests, A11y tests, visual regression tests
- **Performance:** Lighthouse CI integration, bundle size tracking

---

## [1.2.0] - 2024-12-15

### 🎉 Medium Priority Components & Developer Experience Release

#### Added

**Components (5 new):**
- **Breadcrumbs** - Navigation breadcrumb component with separators and links
- **Enhanced Tabs** - Enhanced Tabs with variants (pills, underline, boxed), vertical orientation, icons, and badges
- **Authentication Block** - Ready-to-use login/signup/password reset forms with validation
- **Pricing Table Block** - Complete pricing table with tiers, features, and CTAs
- **Carousel** - Image/content carousel with navigation, dots, auto-play, and touch support

**Developer Experience Tools (3):**
- **Component Playground** - Interactive component testing tool with live preview, props editor, and code generation
- **Theme Builder** - Visual theme customization tool with color pickers and live preview
- **Bundle Size Tracking** - Component bundle size tracking with version comparison and history

**Performance Optimizations (3):**
- **Lazy Loading for Docs** - Dynamic imports for documentation pages with code splitting
- **Image Optimization** - Next.js Image component with WebP/AVIF support and lazy loading
- **Virtual Scrolling** - VirtualList and VirtualTable components for efficient rendering of large datasets

**Documentation:**
- Documentation organization - All 45+ documentation files organized into structured `/docs` directory

#### Technical Details

- **Total Components:** 34 → 39 (added 5 new components)
- **Total Blocks:** 7 → 9 (added 2 new blocks)
- **Developer Tools:** 3 new tools
- **Performance:** 3 major optimizations

---

## [1.1.0] - 2024-12-10

### 🎉 Component Expansion Release

#### Added

**Components (10 new):**
- **Slider** - Range input component for numeric values
- **Combobox** - Advanced select with search and custom filtering
- **Alert/AlertDialog** - Important notifications and confirmations
- **Command Palette** - Modern command menu (Cmd+K pattern)
- **Data Table Block** - Complete data table with sorting and filtering
- **Hover Card** - Rich tooltips with more content
- **Context Menu** - Right-click menus for advanced interactions
- **Pagination** - Pagination component for large datasets
- **Sheet/Sidebar** - Slide-out panels and sidebars
- **Navigation Menu** - Complex navigation menus with dropdowns

#### Technical Details

- **Total Components:** 24 → 34 (added 10 new components)
- **Dependencies Added:** `@radix-ui/react-slider`, `@radix-ui/react-combobox`, `cmdk`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-hover-card`, `@radix-ui/react-context-menu`, `@radix-ui/react-navigation-menu`

---

## [1.0.0] - 2024-12-01

### 🎉 Initial Production Release

#### Added

**Core Components (24 components):**
- Form Controls: Button, Input, Textarea, Radio, Checkbox, Switch, Select, DatePicker
- Data Display: Table, Card, Badge, Avatar, Progress, Spinner, Skeleton, Separator
- Feedback: Dialog, Toast, Tooltip, Popover
- Navigation: Tabs, Accordion, Dropdown Menu
- Forms: FormField

**Pre-Built Blocks (6 blocks):**
- Dashboard Layout, Form Container, Card Grid, Navigation Header, Settings Screen

**Infrastructure:**
- Monorepo setup (pnpm + turbo)
- Design tokens system
- Registry system
- CI/CD pipeline
- Telemetry system

**Documentation:**
- Design System Portal
- Storybook integration
- Versioning system
- Migration guides

**Testing:**
- 64+ unit tests
- E2E tests
- Visual regression (Chromatic)
- A11y testing
- Performance tests (Lighthouse CI)
- Bundle size tracking

**Deployment:**
- Portal on Vercel
- Storybook on Chromatic
- Registry via Vercel
- Monitoring & Analytics

#### Technical Details

- **Total Components:** 24
- **Total Blocks:** 6
- **Tests:** 64+ unit tests + E2E
- **Coverage:** Comprehensive documentation, Storybook, CI/CD
