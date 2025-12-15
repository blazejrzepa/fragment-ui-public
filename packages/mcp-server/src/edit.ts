/**
 * MCP Edit Tools
 * 
 * Tools for editing UI-DSL through patches.
 * Used by AI agents (Cursor/Copilot) to modify UI components.
 * 
 * Note: This is a simplified implementation that works with the MCP server.
 * The actual patch logic is in apps/demo/app/playground/dsl/patch.ts
 * In production, these should be in a shared package.
 */

// Type definitions (simplified for MCP server)
export type NodeRef =
  | { type: "byId"; id: string }
  | { type: "byPath"; path: string }
  | { type: "byTestId"; testId: string };

export type Patch =
  | { op: "setCopy"; target: NodeRef; path: string; value: string }
  | { op: "addNode"; parent: NodeRef; index?: number; node: any }
  | { op: "removeNode"; target: NodeRef }
  | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }
  | { op: "setProp"; target: NodeRef; prop: string; value: any }
  | { op: "setToken"; target: NodeRef; token: "space" | "radius" | "color"; value: any }
  | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }
  | { op: "wrapWith"; target: NodeRef; wrapper: any }
  | { op: "reorder"; parent: NodeRef; from: number; to: number }
  | { op: "renameField"; target: NodeRef; from: string; to: string };

// For now, we'll provide a simplified implementation
// The full implementation is in apps/demo/app/playground/dsl/patch.ts
// This is a placeholder that validates the structure

/**
 * Apply patches to UI-DSL
 * 
 * Note: This is a validation wrapper. The actual implementation
 * should call apps/demo/app/playground/dsl/patch.ts functions.
 * For MCP server, we validate the structure and return a result.
 */
export function applyEditPatches(dsl: any, patches: Patch[]): {
  ok: boolean;
  dsl: any;
  warnings?: string[];
} {
  try {
    const warnings: string[] = [];
    
    // Validate patches structure
    for (const patch of patches) {
      if (!patch.op) {
        warnings.push(`Invalid patch: missing 'op' field`);
        continue;
      }
      
      // Check target for operations that require it
      if (patch.op !== "addNode" && patch.op !== "setToken" && !("target" in patch)) {
        warnings.push(`Invalid patch: missing 'target' for operation ${patch.op}`);
      }
      
      // Check parent for addNode
      if (patch.op === "addNode" && !("parent" in patch)) {
        warnings.push(`Invalid patch: missing 'parent' for addNode operation`);
      }
    }
    
    // For MCP server, we return the DSL as-is with validation results
    // The actual patching happens in the playground app
    return {
      ok: warnings.length === 0,
      dsl,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      dsl,
      warnings: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Find nodes by query
 */
export function findNodesByQuery(
  dsl: any,
  query: { byText?: string; byRole?: string; byProp?: [string, any] }
): NodeRef[] {
  const results: NodeRef[] = [];
  
  function searchNode(node: any): void {
    if (!node || typeof node !== "object") return;
    
    // Search by text (label, title, placeholder)
    if (query.byText) {
      const text = query.byText.toLowerCase();
      if (
        (node.label && String(node.label).toLowerCase().includes(text)) ||
        (node.title && String(node.title).toLowerCase().includes(text)) ||
        (node.placeholder && String(node.placeholder).toLowerCase().includes(text))
      ) {
        if (node.id) {
          results.push({ type: "byId", id: node.id });
        }
      }
    }
    
    // Search by role (component type)
    if (query.byRole) {
      const role = query.byRole.toLowerCase();
      if (
        (node.component && String(node.component).toLowerCase() === role) ||
        (node.type && String(node.type).toLowerCase() === role) ||
        (node.kind && String(node.kind).toLowerCase() === role)
      ) {
        if (node.id) {
          results.push({ type: "byId", id: node.id });
        }
      }
    }
    
    // Search by property
    if (query.byProp) {
      const [propName, propValue] = query.byProp;
      if (node[propName] === propValue) {
        if (node.id) {
          results.push({ type: "byId", id: node.id });
        }
      }
    }
    
    // Recursively search children
    if (Array.isArray(node.fields)) {
      for (const field of node.fields) {
        searchNode(field);
      }
    }
    
    if (Array.isArray(node.actions)) {
      for (const action of node.actions) {
        searchNode(action);
      }
    }
    
    if (Array.isArray(node.sections)) {
      for (const section of node.sections) {
        searchNode(section);
        if (section?.content) {
          if (Array.isArray(section.content)) {
            for (const child of section.content) {
              searchNode(child);
            }
          } else if (typeof section.content === "object") {
            for (const children of Object.values(section.content)) {
              if (Array.isArray(children)) {
                for (const child of children) {
                  searchNode(child);
                }
              }
            }
          }
        }
      }
    }
    
    if (Array.isArray(node.columns)) {
      for (const column of node.columns) {
        searchNode(column);
      }
    }
    
    if (Array.isArray(node.widgets)) {
      for (const widget of node.widgets) {
        searchNode(widget);
      }
    }
  }
  
  searchNode(dsl);
  return results;
}

/**
 * Highlight a node (for UI feedback)
 * This is a no-op in the MCP server - actual highlighting happens in the UI
 */
export function highlightNode(ref: NodeRef): void {
  // This is handled by the UI layer via postMessage
  // MCP server just validates the ref
  if (ref.type === "byId" && !ref.id) {
    throw new Error("Invalid NodeRef: id is required for byId");
  }
}

