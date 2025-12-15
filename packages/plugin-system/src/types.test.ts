import { describe, it, expect } from "vitest";
import type {
  PluginManifest,
  PluginCapabilities,
  ComponentGeneratorOptions,
  ThemeTransformOptions,
} from "./types.js";

describe("Plugin Types", () => {
  describe("PluginManifest", () => {
    it("should have required fields", () => {
      const manifest: PluginManifest = {
        id: "test-plugin",
        name: "Test Plugin",
        version: "0.1.0",
        entry: "./index.js",
      };

      expect(manifest.id).toBe("test-plugin");
      expect(manifest.name).toBe("Test Plugin");
      expect(manifest.version).toBe("0.1.0");
      expect(manifest.entry).toBe("./index.js");
    });

    it("should support optional capabilities", () => {
      const capabilities: PluginCapabilities = {
        componentGenerator: true,
        themePlugin: true,
        integration: false,
      };

      const manifest: PluginManifest = {
        id: "test-plugin",
        name: "Test Plugin",
        version: "0.1.0",
        entry: "./index.js",
        capabilities,
      };

      expect(manifest.capabilities).toEqual(capabilities);
    });
  });

  describe("ComponentGeneratorOptions", () => {
    it("should have required name field", () => {
      const options: ComponentGeneratorOptions = {
        name: "my-component",
      };

      expect(options.name).toBe("my-component");
    });

    it("should support optional fields", () => {
      const options: ComponentGeneratorOptions = {
        name: "my-component",
        type: "ui",
        template: "basic",
        options: { custom: "value" },
      };

      expect(options.type).toBe("ui");
      expect(options.template).toBe("basic");
      expect(options.options).toEqual({ custom: "value" });
    });
  });

  describe("ThemeTransformOptions", () => {
    it("should support format option", () => {
      const options: ThemeTransformOptions = {
        format: "css",
      };

      expect(options.format).toBe("css");
    });

    it("should support custom options", () => {
      const options: ThemeTransformOptions = {
        format: "json",
        options: { preset: "ocean" },
      };

      expect(options.format).toBe("json");
      expect(options.options).toEqual({ preset: "ocean" });
    });
  });
});

