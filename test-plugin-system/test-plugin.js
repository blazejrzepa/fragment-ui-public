#!/usr/bin/env node
import { PluginLoader } from "../packages/plugin-system/dist/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

// Load registry
const registryPath = path.join(root, "packages/registry/registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

// Create plugin loader
const loader = new PluginLoader({ registry });

console.log("🔌 Testing Fragment UI Plugin System\n");

// Load plugins
const pluginsDir = path.join(__dirname, ".fragment/plugins");
console.log(`📁 Loading plugins from: ${pluginsDir}\n`);

const plugins = await loader.loadPluginsFromDirectory(pluginsDir);

console.log(`✅ Loaded ${plugins.length} plugin(s)\n`);

// Test 1: List all plugins
console.log("📋 Test 1: List all plugins");
plugins.forEach((plugin) => {
  console.log(`   - ${plugin.manifest.name} (${plugin.manifest.id})`);
});
console.log();

// Test 2: Get plugins by capability
console.log("📋 Test 2: Get theme plugins");
const themePlugins = loader.getPluginsByCapability("themePlugin");
console.log(`   Found ${themePlugins.length} theme plugin(s)`);
themePlugins.forEach((plugin) => {
  console.log(`   - ${plugin.manifest.name}`);
});
console.log();

// Test 3: Transform theme
if (themePlugins.length > 0) {
  console.log("📋 Test 3: Transform theme with plugin");
  const plugin = themePlugins[0];
  
  const originalTheme = {
    colors: {
      primary: "#000000",
      secondary: "#666666",
    },
  };

  console.log("   Original theme:", JSON.stringify(originalTheme, null, 2));
  
  const transformed = await plugin.transformTheme(originalTheme, {
    preset: "ocean",
  });

  console.log("   Transformed theme (ocean preset):", JSON.stringify(transformed, null, 2));
  console.log();
}

// Test 4: Get presets
if (themePlugins.length > 0) {
  console.log("📋 Test 4: Get available presets");
  const plugin = themePlugins[0];
  
  if (plugin.getPresets) {
    const presets = await plugin.getPresets();
    console.log(`   Available presets (${presets.length}):`);
    presets.forEach((preset) => {
      console.log(`   - ${preset.name}: ${preset.description || "No description"}`);
    });
    console.log();
  }
}

// Test 5: Get plugin by ID
console.log("📋 Test 5: Get plugin by ID");
const pluginById = loader.getPlugin("theme-preset-plugin");
if (pluginById) {
  console.log(`   ✅ Found plugin: ${pluginById.manifest.name}`);
} else {
  console.log(`   ❌ Plugin not found`);
}
console.log();

console.log("✅ All tests completed!\n");

