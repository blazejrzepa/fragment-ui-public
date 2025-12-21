import * as fs from "fs";
import * as path from "path";

export function loadRegistry(): Record<string, any> {
  try {
    // Try multiple paths to find registry
    const possiblePaths = [
      // Production: bundled with extension
      path.join(__dirname, "./registry.json"),
      // Development: from dist/ to registry
      path.join(__dirname, "../../registry/registry.json"),
      // Production: from extension root
      path.join(__dirname, "../registry/registry.json"),
      // Workspace root
      path.join(__dirname, "../../../registry/registry.json"),
    ];

    for (const registryPath of possiblePaths) {
      if (fs.existsSync(registryPath)) {
        const registryContent = fs.readFileSync(registryPath, "utf-8");
        return JSON.parse(registryContent);
      }
    }

    // Fallback: return empty registry
    console.warn("Fragment UI registry not found, using empty registry");
    return {};
  } catch (error) {
    console.error("Error loading Fragment UI registry:", error);
    return {};
  }
}

export function getComponentNames(registry: Record<string, any>): string[] {
  return Object.keys(registry);
}

export function getComponentInfo(
  registry: Record<string, any>,
  componentName: string
): { name: string; type: "ui" | "block"; files: number } | null {
  const component = registry[componentName];
  if (!component) {
    return null;
  }

  const isBlock = component.files?.some((f: any) =>
    f.from?.includes("/blocks/")
  );

  return {
    name: componentName,
    type: isBlock ? "block" : "ui",
    files: component.files?.length || 0,
  };
}

export function getComponentImportPath(
  componentName: string,
  type: "ui" | "block"
): string {
  if (type === "block") {
    return `@fragment_ui/blocks`;
  }
  return `@fragment_ui/ui`;
}

