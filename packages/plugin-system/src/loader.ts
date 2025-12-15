/**
 * Plugin Loader
 * 
 * Loads and manages plugins
 */

import type {
  Plugin,
  PluginManifest,
  PluginContext,
  PluginLogger,
  PluginFileSystem,
} from "./types.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PluginLoader {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;

  constructor(context: Partial<PluginContext> = {}) {
    this.context = {
      registry: context.registry || {},
      logger: context.logger || this.createDefaultLogger(),
      fs: context.fs || this.createDefaultFileSystem(),
      config: context.config || {},
    };
  }

  /**
   * Load plugin from path
   */
  async loadPlugin(pluginPath: string): Promise<Plugin> {
    const manifestPath = path.join(pluginPath, "plugin.json");
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const manifest: PluginManifest = JSON.parse(manifestContent);

    // Load plugin module
    const entryPath = path.resolve(pluginPath, manifest.entry);
    const pluginModule = await import(entryPath);

    // Get plugin class/function
    const PluginClass = pluginModule.default || pluginModule[manifest.id] || pluginModule.Plugin;

    if (!PluginClass) {
      throw new Error(`Plugin entry point not found in ${entryPath}`);
    }

    // Instantiate plugin
    const plugin: Plugin =
      typeof PluginClass === "function" ? new PluginClass() : PluginClass;

    // Set manifest
    plugin.manifest = manifest;

    // Initialize plugin
    await plugin.initialize(this.context);

    // Register plugin
    this.plugins.set(manifest.id, plugin);

    this.context.logger.info(`Loaded plugin: ${manifest.name} (${manifest.version})`);

    return plugin;
  }

  /**
   * Load plugins from directory
   */
  async loadPluginsFromDirectory(pluginsDir: string): Promise<Plugin[]> {
    const plugins: Plugin[] = [];

    try {
      const entries = await fs.readdir(pluginsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginPath = path.join(pluginsDir, entry.name);
          try {
            const plugin = await this.loadPlugin(pluginPath);
            plugins.push(plugin);
          } catch (error) {
            this.context.logger.warn(
              `Failed to load plugin from ${pluginPath}: ${error}`
            );
          }
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      // Directory doesn't exist, return empty array
    }

    return plugins;
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by capability
   */
  getPluginsByCapability(capability: keyof NonNullable<PluginManifest["capabilities"]>): Plugin[] {
    return this.getAllPlugins().filter((plugin) => {
      return plugin.manifest.capabilities?.[capability] === true;
    });
  }

  /**
   * Unload plugin
   */
  async unloadPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (plugin) {
      if (plugin.cleanup) {
        await plugin.cleanup();
      }
      this.plugins.delete(id);
      this.context.logger.info(`Unloaded plugin: ${plugin.manifest.name}`);
    }
  }

  /**
   * Unload all plugins
   */
  async unloadAll(): Promise<void> {
    const pluginIds = Array.from(this.plugins.keys());
    for (const id of pluginIds) {
      await this.unloadPlugin(id);
    }
  }

  private createDefaultLogger(): PluginLogger {
    return {
      info: (message, ...args) => console.log(`[Plugin] ${message}`, ...args),
      warn: (message, ...args) => console.warn(`[Plugin] ${message}`, ...args),
      error: (message, ...args) => console.error(`[Plugin] ${message}`, ...args),
      debug: (message, ...args) => console.debug(`[Plugin] ${message}`, ...args),
    };
  }

  private createDefaultFileSystem(): PluginFileSystem {
    return {
      readFile: async (filePath: string) => {
        return await fs.readFile(filePath, "utf-8");
      },
      writeFile: async (filePath: string, content: string) => {
        await fs.writeFile(filePath, content, "utf-8");
      },
      exists: async (filePath: string) => {
        try {
          await fs.access(filePath);
          return true;
        } catch {
          return false;
        }
      },
      mkdir: async (dirPath: string, recursive = true) => {
        await fs.mkdir(dirPath, { recursive });
      },
    };
  }
}

