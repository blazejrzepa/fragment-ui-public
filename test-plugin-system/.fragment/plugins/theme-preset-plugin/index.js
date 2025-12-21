// Simple plugin for testing
export default class ThemePresetPlugin {
  manifest = {
    id: "theme-preset-plugin",
    name: "Theme Preset Plugin",
    version: "0.1.0",
    description: "Provides theme presets for Fragment UI",
    entry: "./index.js",
    capabilities: {
      themePlugin: true,
    },
  };

  async initialize(context) {
    context.logger.info("Theme Preset Plugin initialized");
  }

  async transformTheme(theme, options = {}) {
    const presetName = options?.preset || "minimal";
    const presets = {
      minimal: {
        colors: {
          brand: "#000000",
          background: "#ffffff",
          foreground: "#000000",
        },
      },
      ocean: {
        colors: {
          brand: "#0066cc",
          background: "#f0f8ff",
          foreground: "#003366",
        },
      },
    };

    const preset = presets[presetName];
    if (!preset) {
      throw new Error(`Preset "${presetName}" not found`);
    }

    return {
      ...theme,
      ...preset,
    };
  }

  async getPresets() {
    return [
      { name: "minimal", description: "Minimal theme" },
      { name: "ocean", description: "Ocean theme" },
    ];
  }
}

