import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PluginLoader } from "@fragment_ui/plugin-system";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "../../../..");
const registryPath = path.join(root, "packages/registry/registry.json");

export async function listPlugins(pluginsDir?: string) {
  const defaultPluginsDir = path.join(process.cwd(), ".fragment", "plugins");
  const targetDir = pluginsDir || defaultPluginsDir;

  try {
    const loader = new PluginLoader({
      registry: JSON.parse(fs.readFileSync(registryPath, "utf-8")),
    });

    const plugins = await loader.loadPluginsFromDirectory(targetDir);

    console.log("\n🔌 Fragment UI Plugins\n");

    if (plugins.length === 0) {
      console.log("No plugins found.");
      console.log(`\n💡 Plugins directory: ${targetDir}`);
      console.log(`   Create plugins in this directory to get started.\n`);
      return;
    }

    console.log(`Total: ${plugins.length} plugin${plugins.length !== 1 ? "s" : ""}\n`);

    plugins.forEach((plugin) => {
      const manifest = plugin.manifest;
      console.log(`📦 ${manifest.name} (${manifest.id})`);
      console.log(`   Version: ${manifest.version}`);
      if (manifest.description) {
        console.log(`   ${manifest.description}`);
      }
      if (manifest.capabilities) {
        const caps = Object.entries(manifest.capabilities)
          .filter(([_, value]) => value === true)
          .map(([key]) => key);
        if (caps.length > 0) {
          console.log(`   Capabilities: ${caps.join(", ")}`);
        }
      }
      console.log();
    });

    console.log(`💡 Plugin directory: ${targetDir}\n`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("\n⚠️  Plugins directory not found.");
      console.log(`   Expected: ${targetDir}`);
      console.log(`   Create this directory and add plugins to get started.\n`);
    } else {
      console.error(`❌ Error loading plugins: ${error}`);
      process.exit(1);
    }
  }
}

export async function runPlugin(pluginId: string, action: string, options?: Record<string, any>) {
  const pluginsDir = path.join(process.cwd(), ".fragment", "plugins");

  try {
    const loader = new PluginLoader({
      registry: JSON.parse(fs.readFileSync(registryPath, "utf-8")),
    });

    await loader.loadPluginsFromDirectory(pluginsDir);
    const plugin = loader.getPlugin(pluginId);

    if (!plugin) {
      console.error(`❌ Plugin "${pluginId}" not found.`);
      console.log(`\n💡 Run 'ds plugin list' to see available plugins.\n`);
      process.exit(1);
    }

    // Handle different plugin types
    if ("execute" in plugin && typeof plugin.execute === "function") {
      const result = await plugin.execute(action, options);
      console.log(result);
    } else {
      console.error(`❌ Plugin "${pluginId}" does not support execution.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error running plugin: ${error}`);
    process.exit(1);
  }
}

