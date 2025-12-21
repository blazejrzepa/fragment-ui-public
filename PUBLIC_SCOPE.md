# Public Scope for Fragment UI

This document identifies what should be included in the **public Fragment UI repository** vs what should remain private/experimental.

---

## ✅ Will be included in public repo

### Design System Packages (Core Public API)
- [x] **`packages/ui`** - `@fragment_ui/ui` - UI components library
  - Status: `publishConfig: { access: "public" }`
  - Contains: React components based on shadcn/ui + Radix UI
  - Dependencies: React, Radix UI, Tailwind, lucide-react

- [x] **`packages/tokens`** - `@fragment_ui/tokens` - Design tokens
  - Status: `publishConfig: { access: "public" }`
  - Contains: CSS variables, design tokens
  - Dependencies: None (pure CSS)

- [x] **`packages/blocks`** - `@fragment_ui/blocks` - Layout blocks
  - Status: `publishConfig: { access: "public" }`
  - Contains: Pre-built screen compositions (dashboards, forms, etc.)
  - Dependencies: `@fragment_ui/ui`

### MCP Server (AI Integration)
- [x] **`packages/mcp-server`** - `@fragment_ui/mcp-server` - MCP server for Fragment UI
  - Status: ✅ **Public** (`private: false`, `publishConfig: public`)
  - Contains: MCP server exposing Fragment UI components/tokens to LLM agents
  - Dependencies: `@modelcontextprotocol/sdk`
  - Note: ✅ No Studio dependencies - clean public package

### Documentation / Marketing Site
- [x] **`apps/www`** - `fragment-www` - Documentation and marketing website
  - Status: `private: true` (app, not package)
  - Contains: Next.js docs site, component examples, guides
  - Dependencies: `@fragment_ui/ui`, `@fragment_ui/blocks`, `@fragment_ui/registry`
  - ✅ **Cleanup completed**: Telemetry removed, no private dependencies

### Supporting Packages (May be needed)
- [x] **`packages/registry`** - `@fragment_ui/registry` - Component registry
  - Status: `private: true`, but needed by CLI and potentially public tooling
  - Contains: Registry JSON, component metadata
  - Note: May need to be public or bundled with CLI

- [x] **`packages/cli`** - `@fragment_ui/cli` - CLI tool
  - Status: `private: true`, but useful for public users
  - Contains: CLI commands for component generation, docs
  - Dependencies: `@fragment_ui/registry`, `@fragment_ui/plugin-system`, `@fragment_ui/patches`
  - Note: Consider making public or keeping as internal tool

- [x] **`packages/utils`** - `@fragment_ui/utils` - Shared utilities
  - Status: `private: true`
  - Contains: Utility functions (naming, etc.)
  - Note: May be needed by other public packages

- [x] **`packages/plugin-system`** - `@fragment_ui/plugin-system` - Plugin system
  - Status: `private: true`
  - Dependencies: `@fragment_ui/registry`
  - Note: Needed by CLI, may need to be public

- [x] **`packages/patches`** - `@fragment_ui/patches` - Patch system
  - Status: `private: true`
  - Note: Needed by CLI, may need to be public

### Root Configuration Files
- [x] **Root `package.json`** - Monorepo config (cleaned up)
- [x] **`pnpm-workspace.yaml`** - Workspace config
- [x] **`tsconfig.base.json`** - Shared TypeScript config
- [x] **`turbo.json`** - Turbo config (if used)
- [x] **`.gitignore`** - Git ignore rules
- [x] **`LICENSE`** - MIT License
- [x] **`README.md`** - Root README (to be created/updated)

### Documentation (Selective)
- [x] **`docs/`** - Documentation folder
  - Include: Getting started, guides, API docs
  - Exclude: Studio-specific docs, governance/internal docs
  - Note: Need to review and filter

### Examples
- [x] **`examples/`** - Example projects
  - Contains: `documentation-site` example
  - Note: Review for Studio dependencies

### Figma Integration
- [x] **`figma-code-connect/`** - Figma Code Connect configs
  - Contains: Button, Input code connect files

---

## ❌ Will NOT be included (private / experimental)

### Studio / Playground / AI Generation
- [ ] **`apps/demo`** - `fragment-demo` - Studio/Playground application
  - Contains: Studio UI, Playground, AI generation, submissions workflow
  - Routes: `/studio`, `/playground`, `/submissions`, `/variants`
  - Status: **PRIVATE** - Experimental AI UI builder

- [ ] **`packages/studio-core`** - `@fragment_ui/studio-core` - Studio domain model
  - Status: `private: true`
  - Contains: Asset, Revision, Patch entities, domain events
  - Dependencies: `@fragment_ui/ui-dsl`
  - Note: Core of Studio system, not needed for public DS

- [ ] **`packages/ui-dsl`** - `@fragment_ui/ui-dsl` - UI DSL for AI generation
  - Status: `private: true`
  - Contains: DSL schema, validation, normalization
  - Dependencies: `@fragment_ui/registry`, `@fragment_ui/tokens`
  - Note: Used by Studio for AI generation, not public API

### Telemetry / Analytics
- [ ] **`packages/telemetry`** - `@fragment_ui/telemetry` - Telemetry and analytics
  - Status: `private: true`
  - Contains: Analytics, ROI metrics, database schema
  - Dependencies: `better-sqlite3`
  - Note: Internal analytics, not for public consumption
  - ⚠️ **Action required**: Remove from `apps/www` dependencies

### Other Private Packages
- [ ] **`packages/scaffolds`** - Scaffolds for Studio
  - Status: Likely private, used by Studio

- [ ] **`packages/blocks-recipes`** - Block recipes
  - Status: Likely private, used by Studio

- [ ] **`packages/ui-native`** - Native UI components
  - Status: Likely experimental/private

- [ ] **`packages/vscode-extension`** - VSCode extension
  - Status: Separate project, may be public but separate repo

### Internal Scripts / Tooling
- [ ] **`scripts/`** - Build scripts, generators
  - Note: Some may be needed, review selectively

- [ ] **`test-*.js`, `test-*.mjs`** - Test scripts
  - Note: Internal testing scripts

- [ ] **`tooling/`** - Linting tooling
  - Note: May keep if needed for public repo

### Internal Documentation
- [ ] **`docs/studio/`** - Studio-specific docs
- [ ] **`docs/governance/`** - Governance/internal docs
- [ ] **`docs/copilot/`** - Copilot/Studio implementation plans
- [ ] **`docs/archive/`** - Archived docs
- [ ] **`docs/roadmap/`** - Internal roadmap (may keep public-facing parts)

---

## ✅ Cleanup Status

### Completed Cleanup
1. ✅ **`apps/www`** - Telemetry removed
   - ✅ Removed from `package.json`
   - ✅ Removed from `next.config.mjs` (transpilePackages, webpack aliases)
   - ✅ Removed API routes: `/api/roi/*` (3 files), `/api/github/webhook`
   - ✅ Created no-op telemetry stub for compatibility
   - ✅ Updated components to work without telemetry

2. ✅ **`packages/mcp-server`** - Made public
   - ✅ Changed `private: false`
   - ✅ Added `publishConfig: { access: "public" }`
   - ✅ Added repository, homepage, bugs fields
   - ✅ Verified no Studio dependencies

### Remaining Considerations
3. **`packages/cli`** - If making public, ensure no Studio dependencies
   - Currently depends on `@fragment_ui/plugin-system`, `@fragment_ui/registry`, `@fragment_ui/patches`
   - These may need to be public or CLI stays private

### Path Aliases to Update
- Check `tsconfig.json` files for references to private packages
- Update imports in public packages to use public package names only

### Documentation Cleanup
- Remove references to Studio/Playground in public docs
- Update getting started guides to focus on design system usage
- Add note about Studio being separate/private

---

## 📋 Summary

**Public Repo Will Contain:**
- 3 core design system packages (ui, tokens, blocks)
- 1 MCP server package (for AI integration)
- 1 documentation website (apps/www)
- Supporting packages (registry, cli, utils, plugin-system, patches) - TBD if public
- Root config files
- Public documentation
- Examples

**Public Repo Will NOT Contain:**
- Studio/Playground application (apps/demo)
- Studio domain model (studio-core)
- UI DSL (ui-dsl)
- Telemetry/analytics (telemetry)
- Internal governance/submissions workflows
- Experimental/R&D code

**Estimated Public Repo Size:**
- ~5-7 packages (vs current ~15 packages)
- 1 app (www) vs 2 apps (www + demo)
- Cleaner, focused structure

---

## 🎯 Next Steps

1. ✅ Create this `PUBLIC_SCOPE.md` file (done)
2. ✅ Create `fragment-ui-public` structure (done)
3. ✅ Copy public packages (done)
4. ✅ Clean up dependencies (done)
5. ✅ Make mcp-server public (done)
6. ✅ Remove telemetry from apps/www (done)
7. ⏳ Sync updates from fragment-ui → fragment-ui-public
8. ⏳ Test build and dev server
9. ⏳ Publish packages to npm (if needed)

