# Scripts Directory

**Purpose:** Utility scripts for building, testing, documentation, and maintenance  
**Organization:** Scripts are categorized into subdirectories by purpose

---

## 📁 Directory Structure

```
scripts/
├── build/          # Build and generation scripts
├── test/           # Testing and validation scripts
├── utils/          # Utility and maintenance scripts
├── docs/           # Documentation generation and maintenance
├── figma/          # Figma integration scripts
└── README.md       # This file
```

---

## 🔨 Build Scripts (`build/`)

Scripts for building, generating, and analyzing the project.

### Scripts

- **`generate-registry-json.mjs`** - Generate component registry JSON files
- **`generate-runtime-manifest.mjs`** - Generate runtime manifest
- **`generate-versions-from-git.ts`** - Generate version information from git
- **`generate-api-docs.mjs`** - Generate API documentation from TypeScript types
- **`analyze-bundle-size.mjs`** - Analyze bundle sizes for components

### Usage

```bash
# Generate registry
node scripts/build/generate-registry-json.mjs

# Generate API docs
node scripts/build/generate-api-docs.mjs

# Analyze bundle size
node scripts/build/analyze-bundle-size.mjs
```

---

## 🧪 Test Scripts (`test/`)

Scripts for testing components, running validations, and browser testing.

### Scripts

- **`test-storybook.js`** - Test Storybook setup and configuration
- **`automated-component-tester.mjs`** - Automated component testing
- **`browser-test-components.mjs`** - Browser-based component testing
- **`test-component-in-browser.mjs`** - Test individual component in browser
- **`run-full-component-test.mjs`** - Run full component test suite
- **`test-components-automation.mjs`** - Component testing automation
- **`test-components-list.mjs`** - List components for testing
- **`test-element-context.mjs`** - Test element context
- **`test-runtime-manifest.mjs`** - Test runtime manifest
- **`mcp-browser-test-loop.mjs`** - MCP browser test loop
- **`test-all-components-browser.mjs`** - Test all components in browser

### Usage

```bash
# Test Storybook
node scripts/test/test-storybook.js

# Run component tests
node scripts/test/run-full-component-test.mjs

# Browser test
node scripts/test/browser-test-components.mjs
```

---

## 🛠️ Utility Scripts (`utils/`)

Utility scripts for maintenance, checks, and general operations.

### Scripts

- **`check-docs.js`** - Check documentation for issues
- **`check-no-css-imports.mjs`** - Check for CSS imports (should use tokens)
- **`check-public-ds-boundaries.mjs`** - Check public DS dependency boundaries
- **`check-public-ds-contract.mjs`** - Check public DS contract compliance
- **`add-missing-components-to-registry.mjs`** - Add missing components to registry
- **`auto-fix-components.mjs`** - Auto-fix component issues
- **`create-github-release.mjs`** - Create GitHub release
- **`create-github-release.sh`** - Create GitHub release (shell version)

### Usage

```bash
# Check documentation
node scripts/utils/check-docs.js

# Check public DS boundaries
node scripts/utils/check-public-ds-boundaries.mjs

# Check public DS contract
node scripts/utils/check-public-ds-contract.mjs
```

---

## 📚 Documentation Scripts (`docs/`)

Scripts for generating and maintaining documentation.

### Scripts

- **`add-edit-on-github.mjs`** - Add "Edit on GitHub" links to docs
- **`add-stability-badges-to-docs.mjs`** - Add stability badges to documentation
- **`add-stability-to-registry.mjs`** - Add stability levels to registry
- **`add-navigation-buttons.mjs`** - Add navigation buttons to docs
- **`fix-navigation-buttons.mjs`** - Fix navigation buttons in docs
- **`update-all-navigation.mjs`** - Update all navigation
- **`update-block-descriptions.mjs`** - Update block descriptions
- **`update-component-descriptions.mjs`** - Update component descriptions
- **`update-docs-template.mjs`** - Update documentation templates
- **`convert-docs-to-preview-pattern.mjs`** - Convert docs to preview pattern
- **`fix-documentcontent-imports.mjs`** - Fix DocumentContent imports
- **`reorder-sections.mjs`** - Reorder documentation sections

### Usage

```bash
# Add stability badges
node scripts/docs/add-stability-badges-to-docs.mjs

# Update navigation
node scripts/docs/update-all-navigation.mjs

# Update component descriptions
node scripts/docs/update-component-descriptions.mjs
```

---

## 🎨 Figma Scripts (`figma/`)

Scripts for Figma integration and Code Connect.

### Scripts

- **`generate-figma-dev-resources.ts`** - Generate Figma dev resources
- **`add-figma-dev-resources-api.ts`** - Add Figma dev resources via API
- **`publish-figma-code-connect.mjs`** - Publish Figma Code Connect configs

### Usage

```bash
# Generate Figma dev resources
tsx scripts/figma/generate-figma-dev-resources.ts

# Publish Code Connect
node scripts/figma/publish-figma-code-connect.mjs
```

---

## 📋 Scripts Called from package.json

Many scripts are called directly from root `package.json`:

```json
{
  "scripts": {
    "registry:generate": "node scripts/build/generate-registry-json.mjs",
    "api:generate": "node scripts/build/generate-api-docs.mjs",
    "bundle:analyze": "node scripts/build/analyze-bundle-size.mjs",
    "check:docs": "node scripts/utils/check-docs.js",
    "check:public-ds-boundaries": "node scripts/utils/check-public-ds-boundaries.mjs",
    "check:public-ds-contract": "node scripts/utils/check-public-ds-contract.mjs",
    "figma:dev-resources": "tsx scripts/figma/generate-figma-dev-resources.ts",
    "figma:publish:script": "node scripts/figma/publish-figma-code-connect.mjs"
  }
}
```

---

## 🔍 Finding Scripts

### By Purpose

- **Build/Generate:** `scripts/build/`
- **Testing:** `scripts/test/`
- **Checks/Validation:** `scripts/utils/`
- **Documentation:** `scripts/docs/`
- **Figma:** `scripts/figma/`

### By File Type

- **`.mjs`** - ES modules (most scripts)
- **`.ts`** - TypeScript (use with `tsx`)
- **`.js`** - JavaScript (legacy)
- **`.sh`** - Shell scripts

---

## 📝 Adding New Scripts

When adding a new script:

1. **Choose the right category:**
   - Build/generation → `scripts/build/`
   - Testing → `scripts/test/`
   - Documentation → `scripts/docs/`
   - Figma → `scripts/figma/`
   - Other utilities → `scripts/utils/`

2. **Use appropriate file extension:**
   - `.mjs` for ES modules (preferred)
   - `.ts` for TypeScript (if needed)
   - `.js` for JavaScript (legacy)

3. **Update this README:**
   - Add script to appropriate section
   - Document purpose and usage

4. **Update package.json if needed:**
   - Add script command if commonly used
   - Use relative path from root

---

## 🚀 Common Workflows

### Generate Registry and API Docs

```bash
pnpm registry:generate
pnpm api:generate
```

### Run All Checks

```bash
pnpm check:docs
pnpm check:public-ds-boundaries
pnpm check:public-ds-contract
```

### Update Documentation

```bash
node scripts/docs/add-stability-badges-to-docs.mjs
node scripts/docs/update-all-navigation.mjs
```

### Test Components

```bash
node scripts/test/test-storybook.js
node scripts/test/run-full-component-test.mjs
```

---

**Last Updated:** 2025-01-XX

