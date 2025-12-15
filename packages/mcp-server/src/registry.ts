/**
 * MCP Server: Registry Tools
 * 
 * Provides access to Fragment UI component registry
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../../..");
const REGISTRY_PATH = path.join(ROOT, "packages/registry/registry.json");

let cachedRegistry: any = null;

function loadRegistry() {
  if (cachedRegistry) {
    return cachedRegistry;
  }
  const content = fs.readFileSync(REGISTRY_PATH, "utf-8");
  cachedRegistry = JSON.parse(content);
  return cachedRegistry;
}

/**
 * List all components in the registry
 */
export function listRegistry() {
  return loadRegistry();
}

/**
 * Get component information from registry
 */
export function getComponentInfo(componentName: string) {
  const registry = loadRegistry();
  // Normalize component name (handle both "Form" and "form")
  const componentKey = Object.keys(registry.components || {}).find(
    (key) => key.toLowerCase() === componentName.toLowerCase()
  );
  
  if (!componentKey) {
    return null;
  }
  
  const component = registry.components[componentKey as keyof typeof registry.components];
  
  if (!component || typeof component === 'string') {
    return null;
  }
  
  return {
    name: componentKey,
    import: (component as any).import,
    props: (component as any).props || {},
    note: 'note' in component ? (component as any).note : undefined,
  };
}

/**
 * Search components in registry
 */
export function searchComponents(query: string) {
  const registry = loadRegistry();
  const lowerQuery = query.toLowerCase();
  const results: Array<{ name: string; import?: string; props?: any }> = [];
  
  if (!registry.components) {
    return results;
  }
  
  Object.entries(registry.components).forEach(([key, value]) => {
    if (key.toLowerCase().includes(lowerQuery)) {
      if (typeof value === 'object' && value !== null) {
        results.push({
          name: key,
          import: (value as any).import,
          props: (value as any).props,
        });
      }
    }
  });
  
  return results;
}

