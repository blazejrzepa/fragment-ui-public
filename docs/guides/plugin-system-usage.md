# Plugin System - Usage Guide

Complete guide for using and creating plugins for Fragment UI.

## Overview

The Fragment UI Plugin System allows you to extend Fragment UI with custom functionality through plugins.

## Plugin Types

### 1. Theme Plugins

Transform themes and provide presets.

### 2. Component Generator Plugins

Generate components from templates.

### 3. Integration Plugins

Integrate with external tools (Figma, etc.).

## Creating a Plugin

### Step 1: Create Plugin Directory

```
my-plugin/
├── plugin.json
└── index.js
```

### Step 2: Define Plugin Manifest

`plugin.json`:
```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "0.1.0",
  "description": "My custom plugin",
  "entry": "./index.js",
  "capabilities": {
    "themePlugin": true
  }
}
```

### Step 3: Implement Plugin

`index.js`:
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

## Using Plugins

### Via CLI

```bash
# List plugins
ds plugin list

# Run plugin
ds plugin run my-plugin action
```

### Programmatically

```typescript
import { PluginLoader } from "@fragment_ui/plugin-system";

const loader = new PluginLoader({
  registry: myRegistry,
});

// Load plugins
const plugins = await loader.loadPluginsFromDirectory("./plugins");

// Get theme plugins
const themePlugins = loader.getPluginsByCapability("themePlugin");

// Use plugin
const plugin = themePlugins[0];
const transformed = await plugin.transformTheme(theme, { preset: "ocean" });
```

## Example Plugins

See `packages/plugin-system/examples/` for example plugins:
- `theme-preset-plugin` - Theme presets
- `component-generator-plugin` - Component generation
- `integration-figma-plugin` - Figma integration

## Plugin API

### Plugin Context

Plugins receive a context object with:
- `registry` - Component registry
- `logger` - Logger for messages
- `fs` - File system utilities
- `config` - Configuration

### Theme Plugin API

```typescript
interface ThemePlugin {
  transformTheme(theme: any, options?: ThemeTransformOptions): Promise<any>;
  getPresets?(): Promise<ThemePreset[]>;
}
```

### Component Generator Plugin API

```typescript
interface ComponentGeneratorPlugin {
  generateComponent(options: ComponentGeneratorOptions): Promise<ComponentGeneratorResult>;
  getTemplates?(): Promise<string[]>;
}
```

### Integration Plugin API

```typescript
interface IntegrationPlugin {
  execute(action: string, options?: Record<string, any>): Promise<any>;
  getActions?(): Promise<string[]>;
}
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```javascript
async transformTheme(theme, options = {}) {
  try {
    // Transform theme
    return transformedTheme;
  } catch (error) {
    context.logger.error("Theme transformation failed:", error);
    return theme; // Return original on error
  }
}
```

### 2. Logging

Use context logger for messages:

```javascript
async initialize(context) {
  context.logger.info("Plugin initialized");
  context.logger.debug("Debug information");
  context.logger.warn("Warning message");
  context.logger.error("Error message");
}
```

### 3. Validation

Validate plugin data:

```javascript
async initialize(context) {
  if (!this.manifest.id) {
    throw new Error("Plugin ID is required");
  }
}
```

## Plugin Distribution

### Local Plugins

Place plugins in `.fragment/plugins/` directory:

```
project/
└── .fragment/
    └── plugins/
        └── my-plugin/
            ├── plugin.json
            └── index.js
```

### Published Plugins

Plugins can be published as npm packages:

```json
{
  "name": "@my-org/fragment-ui-theme-plugin",
  "version": "1.0.0",
  "main": "./dist/index.js"
}
```

---

*Last updated: 2025-01-05*

