# 📝 Combined Changelog - Fragment UI Ecosystem

**Last Updated:** 2025-01-XX  
**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
**Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

**Note:** This is a combined changelog covering all projects in the Fragment UI ecosystem (fragment-ui, fragment-ui-public, fragment-ui-generative-copilot). For the main changelog of the fragment-ui monorepo, see [CHANGELOG.md](./CHANGELOG.md).

---

## 📚 About This Changelog

This document contains the combined change history for all projects in the Fragment UI ecosystem:

- **fragment-ui** - Główny monorepo (private)
- **fragment-ui-public** - Publiczny design system (public)
- **fragment-ui-generative-copilot** - Eksperymentalne narzędzie AI (experimental)

### Legenda

- 🎉 **Added** - Nowe funkcje
- 🔄 **Changed** - Zmiany w istniejących funkcjach
- 🐛 **Fixed** - Naprawione błędy
- 🗑️ **Removed** - Usunięte funkcje
- 🔒 **Security** - Poprawki bezpieczeństwa
- 📦 **Packages** - Zmiany w pakietach npm
- 📚 **Docs** - Zmiany w dokumentacji
- 🔧 **Dev** - Zmiany dla developerów

---

## [Unreleased]

### 🔄 Synchronizacja

- ✅ Zsynchronizowano font rendering optimizations z fragment-ui do fragment-ui-public
- ✅ Dodano metadata (repository, homepage, bugs) do mcp-server w fragment-ui-public
- ✅ Zsynchronizowano viewport metadata w apps/www/layout.tsx

### 📚 Dokumentacja

- ✅ Stworzono `PROJECTS_OVERVIEW.md` - zbiorczy dokument opisujący wszystkie projekty
- ✅ Stworzono `CHANGELOG_COMBINED.md` - zbiorczy changelog
- ✅ Stworzono `ROADMAP.md` - plan rozwoju

---

## [2025-01-XX] - Synchronizacja i Dokumentacja

### 🎉 fragment-ui-public

#### Added
- ✅ Font rendering optimizations dla Chrome
  - `-webkit-font-smoothing: antialiased`
  - `text-rendering: auto` (zamiast optimizeLegibility)
  - `-webkit-text-stroke: 0.35px transparent`
  - `transform: translate3d(0, 0, 0)` dla hardware acceleration
- ✅ Viewport metadata w apps/www/app/layout.tsx
- ✅ Chrome-specific optimizations w `@supports` rules
- ✅ Metadata dla mcp-server (repository, homepage, bugs)

#### Changed
- 🔄 Animacje bez `transform` w keyframes (tylko opacity)
- 🔄 `will-change: auto` zamiast `will-change: contents`

#### Fixed
- 🐛 Blur i nieostrość tekstu w Chrome
- 🐛 Subpixel rendering issues

---

## [1.8.0] - 2025-01-05 - Components & Performance Release

### 🎉 fragment-ui

#### Added

**New Components (5 components):**
- 🎉 **Segmented Control** - iOS-style segmented control for selecting mutually exclusive options
- 🎉 **Rating** - Star rating component with half-star support and read-only mode
- 🎉 **File Upload / Dropzone** - File upload with drag & drop, preview, and validation
- 🎉 **Split Button** - Button combining primary action with dropdown menu
- 🎉 **Tag Input** - Input field for multiple tags with autocomplete

**Performance Optimizations:**
- 🎉 **React.memo** - Applied to 18+ components to prevent unnecessary re-renders
- 🎉 **useMemo/useCallback** - Optimized expensive calculations and event handlers
- 🎉 **Loading States** - Consistent loading indicators across components
- 🎉 **Error States** - Enhanced error handling and validation feedback

**Advanced Features:**
- 🎉 **Component Usage Analytics Dashboard** - Track component installations, views, and popularity
- 🎉 **Component Migration Assistant** - Automated migrations between versions using AST transformations
- 🎉 **Design System Governance Dashboard** - Track compliance, metrics, and issues

**Developer Experience:**
- 🎉 **Upstream Patches System** - Manage customizations to upstream (shadcn/ui) components
- 🎉 **Rebase Process** - Documented process for managing upstream updates

**UI Improvements:**
- 🎉 **Dark Mode as Default** - Dark mode is now the default theme
- 🎉 **Improved Navigation** - Enhanced sidebar and top navigation with better spacing and layout
- 🎉 **Table of Contents** - Dynamic table of contents in right sidebar for documentation pages
- 🎉 **Consistent Headers** - Standardized headers and subtitles across all documentation pages

#### Changed

- 🔄 **Default Theme** - Changed from "system" to "dark" mode
- 🔄 **Navigation Layout** - Improved spacing and layout in sidebar and top navigation
- 🔄 **Documentation Structure** - All example pages now have consistent headers and formatting

#### Technical Details

- 📦 **Total Components:** 58 → 63 (added 5 new components)
- 📦 **Performance:** 18+ components optimized with React.memo
- 📦 **Documentation:** 100+ pages with consistent structure

---

## [1.0.1] - 2025-01-XX - Public Release Update

### 🎉 fragment-ui-public

#### Added
- ✅ Public release na npm
- ✅ MCP Server jako public package
- ✅ Documentation website (bez telemetry)

#### Changed
- 🔄 Wersje pakietów: ui, tokens, blocks → 1.0.1

#### Fixed
- 🐛 Usunięto telemetry dependencies z apps/www
- 🐛 Cleanup next.config.mjs (usunięto telemetry aliases)

---

## [1.0.0] - 2024-XX-XX - Initial Public Release

### 🎉 fragment-ui-public

#### Added
- ✅ **Design System Packages**
  - `@fragment_ui/ui` - UI components library
  - `@fragment_ui/tokens` - Design tokens
  - `@fragment_ui/blocks` - Pre-built screen compositions
- ✅ **MCP Server** - `@fragment_ui/mcp-server` - AI integration
- ✅ **Documentation Website** - Kompletna dokumentacja publiczna
- ✅ **Examples** - Przykłady użycia
- ✅ **Figma Integration** - Code Connect configs

---

## [0.1.0] - 2024-XX-XX - MCP Server Initial Release

### 🎉 fragment-ui-public

#### Added
- ✅ **MCP Server** - Model Context Protocol server dla Fragment UI
- ✅ **AI Integration** - Integracja z LLM agents (Cursor, Claude, etc.)
- ✅ **Component Registry** - Exposed via MCP dla AI agents

---

## [Experimental] - fragment-ui-generative-copilot

### 🧪 Experimental Features

#### Added
- 🧪 **Streaming UI Generation** - Używa Vercel AI SDK streamUI
- 🧪 **Real-time Preview** - Live preview podczas generowania
- 🧪 **Conversational Editing** - Edycja przez rozmowę
- 🧪 **Alternative Approach** - streamUI vs UI-DSL

#### Status
- 📋 Experimental - nie jest częścią głównego projektu
- 📋 Może być zintegrowany w przyszłości lub pozostawiony jako alternatywa

---

## 📊 Statystyki

### fragment-ui
- **Total Components:** 63
- **Public Packages:** 3 (ui, tokens, blocks)
- **Private Packages:** 10+
- **Apps:** 2 (www, demo)

### fragment-ui-public
- **Total Components:** 63 (synchronized)
- **Public Packages:** 4 (ui, tokens, blocks, mcp-server)
- **Published to npm:** ✅
- **Apps:** 1 (www)

### fragment-ui-generative-copilot
- **Status:** Experimental
- **Dependencies:** Uses public packages from npm
- **Approach:** streamUI (alternative to UI-DSL)

---

## 🔗 Linki

- **fragment-ui:** Private repository
- **fragment-ui-public:** https://github.com/blazejrzepa/fragment-ui-public
- **fragment-ui-generative-copilot:** Private experimental repository
- **Website:** https://fragmentui.com
- **npm:** https://www.npmjs.com/org/fragment_ui

---

**Ostatnia aktualizacja:** 2025-01-XX

