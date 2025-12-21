# Testing Plugin System

## Quick Test Guide

### 1. Build Plugin System and CLI

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
pnpm --filter @fragment_ui/plugin-system build
pnpm --filter @fragment_ui/cli build
```

### 2. Test Plugin List

```bash
cd test-plugin-system
node ../packages/cli/dist/index.js plugin list
```

### 3. Test Plugin Loading (Node.js)

Create a test file:

```javascript
// test-plugin.js
import { PluginLoader } from "./packages/plugin-system/dist/index.js";
import fs from "fs";

const registry = JSON.parse(
  fs.readFileSync("./packages/registry/registry.json", "utf-8")
);

const loader = new PluginLoader({ registry });

// Load plugins
const plugins = await loader.loadPluginsFromDirectory(
  "./test-plugin-system/.fragment/plugins"
);

console.log("Loaded plugins:", plugins.length);

// Get theme plugins
const themePlugins = loader.getPluginsByCapability("themePlugin");
console.log("Theme plugins:", themePlugins.length);

// Test theme transformation
if (themePlugins.length > 0) {
  const plugin = themePlugins[0];
  const transformed = await plugin.transformTheme(
    { colors: { primary: "#000" } },
    { preset: "ocean" }
  );
  console.log("Transformed theme:", transformed);
}
```

Run:
```bash
node test-plugin.js
```

### 4. Test Component Generator Plugin

Create another test plugin:

```bash
mkdir -p test-plugin-system/.fragment/plugins/component-generator-plugin
```

Create `plugin.json` and `index.js` similar to theme plugin.

### 5. Test via CLI

```bash
# List plugins
ds plugin list

# Run plugin (if it supports execute)
ds plugin run theme-preset-plugin transform
```

