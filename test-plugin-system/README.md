# Plugin System Testing Guide

## Quick Start

### 1. Test via CLI

```bash
# From test-plugin-system directory
cd test-plugin-system

# List plugins
node ../packages/cli/dist/index.js plugin list
```

### 2. Test Programmatically

```bash
# Run test script
node test-plugin.js
```

## What's Tested

1. ✅ **Plugin Loading** - Loads plugins from directory
2. ✅ **Plugin Listing** - Lists all loaded plugins
3. ✅ **Capability Filtering** - Gets plugins by capability
4. ✅ **Theme Transformation** - Transforms themes with presets
5. ✅ **Preset Listing** - Gets available presets
6. ✅ **Plugin Lookup** - Gets plugin by ID

## Test Plugin Structure

```
.fragment/plugins/
└── theme-preset-plugin/
    ├── plugin.json
    └── index.js
```

## Creating Your Own Test Plugin

1. Create plugin directory:
```bash
mkdir -p .fragment/plugins/my-plugin
```

2. Create `plugin.json`:
```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "0.1.0",
  "description": "My test plugin",
  "entry": "./index.js",
  "capabilities": {
    "themePlugin": true
  }
}
```

3. Create `index.js`:
```javascript
export default class MyPlugin {
  manifest = {
    id: "my-plugin",
    name: "My Plugin",
    version: "0.1.0",
    entry: "./index.js",
    capabilities: { themePlugin: true },
  };

  async initialize(context) {
    context.logger.info("My plugin initialized");
  }

  async transformTheme(theme, options = {}) {
    return { ...theme, custom: "value" };
  }
}
```

4. Test it:
```bash
node ../packages/cli/dist/index.js plugin list
```

