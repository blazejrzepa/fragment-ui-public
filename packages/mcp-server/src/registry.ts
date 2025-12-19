/**
 * MCP Server: Registry Tools
 * 
 * Provides access to Fragment UI component registry
 */

import registry from "@fragment_ui/registry/registry.json";

/**
 * List all components in the registry
 */
export function listRegistry(): typeof registry {
  return registry;
}

/**
 * Get component information from registry
 */
export function getComponentInfo(componentName: string) {
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
    import: component.import,
    props: component.props || {},
    note: 'note' in component ? component.note : undefined,
  };
}

/**
 * Search components in registry
 */
export function searchComponents(query: string) {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ name: string; import?: string; props?: any }> = [];
  
  if (!registry.components) {
    return results;
  }
  
  Object.entries(registry.components).forEach(([key, value]) => {
    if (key.toLowerCase().includes(lowerQuery)) {
      if (typeof value === 'object' && value !== null && 'import' in value) {
        results.push({
          name: key,
          import: (value as { import?: string; props?: any }).import,
          props: (value as { import?: string; props?: any }).props,
        });
      }
    }
  });
  
  return results;
}

