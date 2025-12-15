import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PluginLoader } from "./loader.js";
import type { Plugin, PluginContext } from "./types.js";
import * as fs from "node:fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock plugin for testing
class MockPlugin implements Plugin {
  manifest = {
    id: "mock-plugin",
    name: "Mock Plugin",
    version: "0.1.0",
    entry: "./index.js",
  };

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info("Mock plugin initialized");
  }
}

describe("PluginLoader", () => {
  let loader: PluginLoader;
  let testPluginsDir: string;

  beforeEach(() => {
    loader = new PluginLoader({
      registry: {},
      config: {},
    });
    testPluginsDir = path.join(__dirname, "../test-fixtures/plugins");
  });

  afterEach(async () => {
    // Cleanup
    await loader.unloadAll();
  });

  describe("getAllPlugins", () => {
    it("should return empty array when no plugins loaded", () => {
      const plugins = loader.getAllPlugins();
      expect(plugins).toEqual([]);
    });
  });

  describe("getPlugin", () => {
    it("should return undefined for non-existent plugin", () => {
      const plugin = loader.getPlugin("non-existent");
      expect(plugin).toBeUndefined();
    });
  });

  describe("getPluginsByCapability", () => {
    it("should return empty array when no plugins match capability", () => {
      const plugins = loader.getPluginsByCapability("themePlugin");
      expect(plugins).toEqual([]);
    });
  });

  describe("unloadPlugin", () => {
    it("should not throw when unloading non-existent plugin", async () => {
      await expect(loader.unloadPlugin("non-existent")).resolves.not.toThrow();
    });
  });

  describe("unloadAll", () => {
    it("should not throw when no plugins loaded", async () => {
      await expect(loader.unloadAll()).resolves.not.toThrow();
    });
  });
});

