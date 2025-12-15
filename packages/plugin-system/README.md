# Fragment UI Plugin System

Plugin system for extending Fragment UI with custom functionality.

## Features

- 🔌 **Plugin Architecture** - Extensible plugin system
- 🎨 **Theme Plugins** - Custom theme transformations and presets
- 🧩 **Component Generators** - Generate components from templates
- 🔗 **Integration Plugins** - Integrate with external tools

## Installation

```bash
pnpm add @fragment_ui/plugin-system
```

## Usage

### Basic Usage

```typescript
import { PluginLoader } from "@fragment_ui/plugin-system";

// Create plugin loader
const loader = new PluginLoader({
  registry: myRegistry,
  config: { /* your config */ },
});

// Load plugins from directory
const plugins = await loader.loadPluginsFromDirectory("./plugins");

// Get plugins by capability
const themePlugins = loader.getPluginsByCapability("themePlugin");
const generatorPlugins = loader.getPluginsByCapability("componentGenerator");
```

### Creating a Plugin

#### 1. Create Plugin Directory

```
my-plugin/
├── plugin.json
└── index.ts
```

#### 2. Define Plugin Manifest

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

#### 3. Implement Plugin

`index.ts`:
```typescript
import type { Plugin, PluginContext, ThemePlugin } from "@fragment_ui/plugin-system";

export default class MyPlugin implements ThemePlugin {
  manifest = {
    id: "my-plugin",
    name: "My Plugin",
    version: "0.1.0",
    entry: "./index.js",
    capabilities: { themePlugin: true },
  };

  async initialize(context: PluginContext) {
    context.logger.info("My plugin initialized");
  }

  async transformTheme(theme: any) {
    // Transform theme
    return { ...theme, custom: "value" };
  }
}
```

## Plugin Types

### Theme Plugin

Transform themes and provide presets:

```typescript
interface ThemePlugin extends Plugin {
  transformTheme(theme: any, options?: ThemeTransformOptions): Promise<any>;
  getPresets?(): Promise<ThemePreset[]>;
}
```

### Component Generator Plugin

Generate components from templates:

```typescript
interface ComponentGeneratorPlugin extends Plugin {
  generateComponent(options: ComponentGeneratorOptions): Promise<ComponentGeneratorResult>;
  getTemplates?(): Promise<string[]>;
}
```

### Integration Plugin

Integrate with external tools:

```typescript
interface IntegrationPlugin extends Plugin {
  execute(action: string, options?: Record<string, any>): Promise<any>;
  getActions?(): Promise<string[]>;
}
```

## Examples

See `examples/` directory for example plugins:
- `theme-preset-plugin` - Theme presets
- `component-generator-plugin` - Component generation

## API Reference

### PluginLoader

#### Methods

- `loadPlugin(pluginPath: string): Promise<Plugin>` - Load single plugin
- `loadPluginsFromDirectory(pluginsDir: string): Promise<Plugin[]>` - Load all plugins from directory
- `getPlugin(id: string): Plugin | undefined` - Get plugin by ID
- `getAllPlugins(): Plugin[]` - Get all loaded plugins
- `getPluginsByCapability(capability: string): Plugin[]` - Get plugins by capability
- `unloadPlugin(id: string): Promise<void>` - Unload plugin
- `unloadAll(): Promise<void>` - Unload all plugins

## License

MIT

