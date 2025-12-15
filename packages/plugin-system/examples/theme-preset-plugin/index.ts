import type {
  Plugin,
  PluginManifest,
  PluginContext,
  ThemePlugin,
  ThemePreset,
} from "../../src/types.js";

export default class ThemePresetPlugin implements ThemePlugin {
  manifest: PluginManifest = {
    id: "theme-preset-plugin",
    name: "Theme Preset Plugin",
    version: "0.1.0",
    description: "Provides theme presets for Fragment UI",
    entry: "./index.js",
    capabilities: {
      themePlugin: true,
    },
  };

  private presets: ThemePreset[] = [
    {
      name: "minimal",
      description: "Minimal theme with clean colors",
      theme: {
        colors: {
          brand: "#000000",
          background: "#ffffff",
          foreground: "#000000",
        },
      },
    },
    {
      name: "ocean",
      description: "Ocean-inspired blue theme",
      theme: {
        colors: {
          brand: "#0066cc",
          background: "#f0f8ff",
          foreground: "#003366",
        },
      },
    },
    {
      name: "forest",
      description: "Nature-inspired green theme",
      theme: {
        colors: {
          brand: "#228b22",
          background: "#f5f5f5",
          foreground: "#2d5016",
        },
      },
    },
  ];

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info("Theme Preset Plugin initialized");
  }

  async transformTheme(theme: any, options?: any): Promise<any> {
    const presetName = options?.preset || "minimal";
    const preset = this.presets.find((p) => p.name === presetName);

    if (!preset) {
      throw new Error(`Preset "${presetName}" not found`);
    }

    // Merge preset with existing theme
    return {
      ...theme,
      ...preset.theme,
    };
  }

  async getPresets(): Promise<ThemePreset[]> {
    return this.presets;
  }
}

