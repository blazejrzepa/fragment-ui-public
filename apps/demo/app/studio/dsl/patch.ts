/**
 * Patch API for UI-DSL
 * 
 * Provides atomic operations for editing UI-DSL structure.
 * All patches are applied transactionally - either all succeed or none.
 * 
 * v1.1: Core patch operations for conversational UI editing.
 */

import type { UiDsl, UiForm, UiPage, UiTable, UiDashboard } from './types';
import { generateId } from './types';

/**
 * Node reference - identifies a node in the DSL tree
 */
export type NodeRef =
  | { type: "byId"; id: string }                    // Preferred: by UUID
  | { type: "byPath"; path: string }                // e.g., "page.sections[0].content[2]"
  | { type: "byTestId"; testId: string };            // by data-test-id

/**
 * Patch operations - atomic edits to DSL
 */
export type Patch =
  | { op: "setCopy"; target: NodeRef; path: string; value: string }                // Change text/label/placeholder
  | { op: "addNode"; parent: NodeRef; index?: number; node: any }                  // Add component
  | { op: "removeNode"; target: NodeRef }
  | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }         // Drag/drop
  | { op: "setProp"; target: NodeRef; prop: string; value: any }                  // e.g., variant="primary"
  | { op: "setToken"; target: NodeRef; token: "space" | "radius" | "color"; value: any }  // Style via tokens
  | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }     // Change variant
  | { op: "wrapWith"; target: NodeRef; wrapper: any }                              // e.g., wrap in Card
  | { op: "reorder"; parent: NodeRef; from: number; to: number }                   // Change order of children
  | { op: "renameField"; target: NodeRef; from: string; to: string }              // Refactor form fields
  | { op: "duplicateNode"; target: NodeRef }                                       // Duplicate a node
  | { op: "swap"; a: NodeRef; b: NodeRef }                                          // Swap two nodes
  | { op: "bindData"; target: NodeRef; data: import('./types').UiDataSource }      // Bind data source to node
  | { op: "renameSection"; target: NodeRef; value: string };                      // Rename section title

/**
 * Find a node in DSL by reference
 * Enhanced with better error messages and fallback search
 */
export function findNode(dsl: UiDsl, ref: NodeRef): any | null {
  let result: any | null = null;
  
  if (ref.type === "byId") {
    result = findNodeById(dsl, ref.id);
    
    // If not found, try fallback search by data-ui-id or similar identifiers
    if (!result && ref.id.includes("-")) {
      // Try to find by data-ui-id (common pattern: "dashboard-container" -> search for dashboard)
      result = findNodeByTestId(dsl, ref.id);
    }
    
    return result;
  } else if (ref.type === "byPath") {
    return findNodeByPath(dsl, ref.path);
  } else if (ref.type === "byTestId") {
    return findNodeByTestId(dsl, ref.testId);
  }
  return null;
}

/**
 * Get helpful error message when node is not found
 */
function getNodeNotFoundError(ref: NodeRef, dsl: UiDsl): string {
  const baseError = `Node not found: ${JSON.stringify(ref)}`;
  
  // Provide helpful suggestions based on DSL type
  if (ref.type === "byId") {
    const suggestions: string[] = [];
    
    // Check if it's a dashboard and suggest using dashboard.id
    if (dsl.type === "dashboard" && ref.id === "dashboard-container") {
      suggestions.push(`For dashboards, use the dashboard's id (${(dsl as any).id || "dashboard.id"}) instead of "dashboard-container"`);
      suggestions.push(`Available widgets: ${(dsl as any).widgets?.length || 0} widgets`);
    }
    
    // Check if it's a page and suggest sections
    if (dsl.type === "page" || dsl.type === "screen") {
      const page = dsl as any;
      if (page.sections) {
        suggestions.push(`Available sections: ${page.sections.length} sections`);
      }
      if (page.regions) {
        const regionKeys = Object.keys(page.regions);
        suggestions.push(`Available regions: ${regionKeys.join(", ")}`);
      }
    }
    
    if (suggestions.length > 0) {
      return `${baseError}\nSuggestions:\n${suggestions.map(s => `  - ${s}`).join("\n")}`;
    }
  }
  
  return baseError;
}

/**
 * Find node by ID (recursive search)
 * Enhanced for dashboard widgets and better error context
 */
function findNodeById(node: any, id: string, path: string = ""): any | null {
  if (!node) return null;
  
  if (node?.id === id) {
    return node;
  }

  // Search in children/fields/actions/sections/columns/widgets
  if (node.fields) {
    for (let i = 0; i < node.fields.length; i++) {
      const field = node.fields[i];
      const found = findNodeById(field, id, `${path}.fields[${i}]`);
      if (found) return found;
    }
  }

  if (node.actions) {
    for (let i = 0; i < node.actions.length; i++) {
      const action = node.actions[i];
      const found = findNodeById(action, id, `${path}.actions[${i}]`);
      if (found) return found;
    }
  }

  if (node.sections) {
    for (let i = 0; i < node.sections.length; i++) {
      const section = node.sections[i];
      const currentPath = `${path}.sections[${i}]`;
      const found = findNodeById(section, id, currentPath);
      if (found) return found;
      
      if (section.content) {
        if (Array.isArray(section.content)) {
          for (let j = 0; j < section.content.length; j++) {
            const child = section.content[j];
            const found = findNodeById(child, id, `${currentPath}.content[${j}]`);
            if (found) return found;
          }
        } else {
          // Handle Record<string, UiDsl[]> case (regions)
          for (const [regionKey, children] of Object.entries(section.content)) {
            if (Array.isArray(children)) {
              for (let j = 0; j < children.length; j++) {
                const child = children[j];
                const found = findNodeById(child, id, `${currentPath}.content.${regionKey}[${j}]`);
                if (found) return found;
              }
            }
          }
        }
      }
    }
  }

  if (node.columns) {
    for (let i = 0; i < node.columns.length; i++) {
      const column = node.columns[i];
      const found = findNodeById(column, id, `${path}.columns[${i}]`);
      if (found) return found;
    }
  }

  if (node.filters) {
    for (let i = 0; i < node.filters.length; i++) {
      const filter = node.filters[i];
      const found = findNodeById(filter, id, `${path}.filters[${i}]`);
      if (found) return found;
    }
  }

  // Enhanced widget search for dashboards
  if (node.widgets) {
    for (let i = 0; i < node.widgets.length; i++) {
      const widget = node.widgets[i];
      const found = findNodeById(widget, id, `${path}.widgets[${i}]`);
      if (found) return found;
      
      // Also search in widget's nested content if it exists
      if (widget.content && Array.isArray(widget.content)) {
        for (let j = 0; j < widget.content.length; j++) {
          const child = widget.content[j];
          const found = findNodeById(child, id, `${path}.widgets[${i}].content[${j}]`);
          if (found) return found;
        }
      }
    }
  }

  // Search in regions (for page/screen layouts)
  if (node.regions) {
    for (const [regionKey, region] of Object.entries(node.regions)) {
      const regionObj = region as any;
      const regionPath = `${path}.regions.${regionKey}`;
      
      // Search in modules
      if (regionObj.modules && Array.isArray(regionObj.modules)) {
        for (let i = 0; i < regionObj.modules.length; i++) {
          const module = regionObj.modules[i];
          const found = findNodeById(module, id, `${regionPath}.modules[${i}]`);
          if (found) return found;
        }
      }
      
      // Search in content
      if (regionObj.content && Array.isArray(regionObj.content)) {
        for (let i = 0; i < regionObj.content.length; i++) {
          const child = regionObj.content[i];
          const found = findNodeById(child, id, `${regionPath}.content[${i}]`);
          if (found) return found;
        }
      }
    }
  }

  return null;
}

/**
 * Find node by path (e.g., "page.sections[0].content[2]")
 */
function findNodeByPath(dsl: UiDsl, path: string): any | null {
  const parts = path.split('.');
  let current: any = dsl;

  for (const part of parts) {
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      if (current[key] && Array.isArray(current[key])) {
        current = current[key][parseInt(index, 10)];
      } else {
        return null;
      }
    } else {
      current = current[part];
    }

    if (!current) return null;
  }

  return current;
}

/**
 * Find node by data-test-id
 */
function findNodeByTestId(node: any, testId: string): any | null {
  if (node?.["data-test-id"] === testId) {
    return node;
  }

  // Recursive search (same as findNodeById)
  return findNodeById(node, testId); // Fallback to ID search for now
}

/**
 * Apply a single patch to DSL
 */
export function applyPatch(dsl: UiDsl, patch: Patch): UiDsl {
  // Deep clone to avoid mutating original
  const newDsl = JSON.parse(JSON.stringify(dsl));

  switch (patch.op) {
    case "setCopy":
      return applySetCopy(newDsl, patch);
    case "addNode":
      return applyAddNode(newDsl, patch);
    case "removeNode":
      return applyRemoveNode(newDsl, patch);
    case "moveNode":
      return applyMoveNode(newDsl, patch);
    case "setProp":
      return applySetProp(newDsl, patch);
    case "setToken":
      return applySetToken(newDsl, patch);
    case "toggleVariant":
      return applyToggleVariant(newDsl, patch);
    case "wrapWith":
      return applyWrapWith(newDsl, patch);
    case "reorder":
      return applyReorder(newDsl, patch);
    case "renameField":
      return applyRenameField(newDsl, patch);
    case "duplicateNode":
      return applyDuplicateNode(newDsl, patch);
    case "swap":
      return applySwap(newDsl, patch);
    case "bindData":
      return applyBindData(newDsl, patch);
    case "renameSection":
      return applyRenameSection(newDsl, patch);
    default:
      throw new Error(`Unknown patch operation: ${(patch as any).op}`);
  }
}

/**
 * Apply multiple patches transactionally
 */
export function applyPatches(dsl: UiDsl, patches: Patch[]): UiDsl {
  let result = dsl;
  for (const patch of patches) {
    result = applyPatch(result, patch);
  }
  return result;
}

/**
 * Apply setCopy patch - change text/label/placeholder
 */
function applySetCopy(dsl: UiDsl, patch: Extract<Patch, { op: "setCopy" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // Update field in path (e.g., "label", "title", "placeholder")
  const pathParts = patch.path.split(".");
  let current: any = node;
  for (let i = 0; i < pathParts.length - 1; i++) {
    current = current[pathParts[i]];
    if (!current) {
      throw new Error(`Invalid path: ${patch.path}`);
    }
  }
  current[pathParts[pathParts.length - 1]] = patch.value;

  return dsl;
}

/**
 * Apply addNode patch - add a new component
 * Enhanced with better dashboard support and error messages
 */
function applyAddNode(dsl: UiDsl, patch: Extract<Patch, { op: "addNode" }>): UiDsl {
  const parent = findNode(dsl, patch.parent);
  if (!parent) {
    // Provide helpful error message with suggestions
    let errorMsg = getNodeNotFoundError(patch.parent, dsl);
    
    // Special handling for dashboard
    if (dsl.type === "dashboard" && patch.parent.type === "byId") {
      const dashboard = dsl as any;
      if (patch.parent.id === "dashboard-container") {
        errorMsg += `\n\nFor dashboards, use the dashboard's id (${dashboard.id}) as the parent, not "dashboard-container".`;
        errorMsg += `\nExample: { "type": "byId", "id": "${dashboard.id}" }`;
      }
    }
    
    throw new Error(errorMsg);
  }

  // Ensure node has ID
  if (!patch.node.id) {
    patch.node.id = generateId();
  }

  // Add to appropriate array based on parent type
  if (parent.fields) {
    // Adding to form fields
    if (patch.index !== undefined) {
      parent.fields.splice(patch.index, 0, patch.node);
    } else {
      parent.fields.push(patch.node);
    }
  } else if (parent.type === "form" && (patch.node.type === "submit" || patch.node.type === "button" || patch.node.type === "reset")) {
    // Adding button/action to form - create actions array if it doesn't exist
    if (!parent.actions) {
      parent.actions = [];
    }
    if (patch.index !== undefined) {
      parent.actions.splice(patch.index, 0, patch.node);
    } else {
      parent.actions.push(patch.node);
    }
  } else if (parent.actions) {
    // Adding to form actions (if actions already exists)
    if (patch.index !== undefined) {
      parent.actions.splice(patch.index, 0, patch.node);
    } else {
      parent.actions.push(patch.node);
    }
  } else if (parent.content && Array.isArray(parent.content)) {
    // Adding to section content (for page sections)
    if (patch.index !== undefined) {
      parent.content.splice(patch.index, 0, patch.node);
    } else {
      parent.content.push(patch.node);
    }
  } else if (parent.sections) {
    // Adding to page sections (only if parent is the page root)
    if (patch.index !== undefined) {
      parent.sections.splice(patch.index, 0, patch.node);
    } else {
      parent.sections.push(patch.node);
    }
  } else if (parent.columns) {
    // Adding to table columns
    if (patch.index !== undefined) {
      parent.columns.splice(patch.index, 0, patch.node);
    } else {
      parent.columns.push(patch.node);
    }
  } else if (parent.widgets) {
    // Adding to dashboard widgets
    if (patch.index !== undefined) {
      parent.widgets.splice(patch.index, 0, patch.node);
    } else {
      parent.widgets.push(patch.node);
    }
  } else if (parent.type === "dashboard") {
    // For dashboard, if parent is the dashboard root, we need to add to widgets or create a new structure
    // If the node is a widget (metric, chart, table), add to widgets
    if (patch.node.kind === "metric" || patch.node.kind === "chart" || patch.node.kind === "table") {
      if (!parent.widgets) {
        parent.widgets = [];
      }
      // Ensure the node has the required widget structure
      if (!patch.node.id) {
        patch.node.id = generateId();
      }
      if (patch.index !== undefined) {
        parent.widgets.splice(patch.index, 0, patch.node);
      } else {
        parent.widgets.push(patch.node);
      }
    } else {
      // For other nodes (like navigation), we need to convert dashboard to page with regions
      // This is a more complex transformation - for now, throw an error with a helpful message
      const nodeType = patch.node.type || patch.node.component || patch.node.kind || 'node';
      throw new Error(
        `Cannot add ${nodeType} to dashboard. ` +
        `Dashboard only supports widgets with kind: "metric", "chart", or "table". ` +
        `Received: ${JSON.stringify(patch.node.kind || 'no kind')}. ` +
        `To add navigation or other components, consider converting the dashboard to a page layout with regions.`
      );
    }
  } else {
    // Provide more context about what parent types are supported
    const supportedTypes = ['form', 'page', 'screen', 'dashboard', 'table', 'section'];
    const parentType = parent.type || 'unknown';
    throw new Error(
      `Cannot add node to parent type: ${parentType}. ` +
      `Supported parent types: ${supportedTypes.join(', ')}. ` +
      `Parent structure: ${JSON.stringify(Object.keys(parent).slice(0, 5))}`
    );
  }

  return dsl;
}

/**
 * Apply removeNode patch - remove a component
 */
function applyRemoveNode(dsl: UiDsl, patch: Extract<Patch, { op: "removeNode" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // Find parent and remove from array
  const parent = findParent(dsl, patch.target);
  if (!parent) {
    throw new Error(
      `Parent not found for node: ${JSON.stringify(patch.target)}. ` +
      `This usually means the node is at the root level or the DSL structure is invalid.`
    );
  }

  // Remove from appropriate array
  if (parent.fields) {
    const index = parent.fields.findIndex((f: any) => f.id === node.id);
    if (index !== -1) parent.fields.splice(index, 1);
  } else if (parent.actions) {
    const index = parent.actions.findIndex((a: any) => a.id === node.id);
    if (index !== -1) parent.actions.splice(index, 1);
  } else if (parent.sections) {
    const index = parent.sections.findIndex((s: any) => s.id === node.id);
    if (index !== -1) parent.sections.splice(index, 1);
  } else if (parent.columns) {
    const index = parent.columns.findIndex((c: any) => c.id === node.id);
    if (index !== -1) parent.columns.splice(index, 1);
  } else if (parent.widgets) {
    const index = parent.widgets.findIndex((w: any) => w.id === node.id);
    if (index !== -1) parent.widgets.splice(index, 1);
  }

  return dsl;
}

/**
 * Apply moveNode patch - move component to different parent/position
 */
function applyMoveNode(dsl: UiDsl, patch: Extract<Patch, { op: "moveNode" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  const toParent = findNode(dsl, patch.toParent);
  if (!toParent) {
    throw new Error(getNodeNotFoundError(patch.toParent, dsl));
  }

  // Remove from current location
  const removedDsl = applyRemoveNode(dsl, { op: "removeNode", target: patch.target });

  // Add to new location
  return applyAddNode(removedDsl, {
    op: "addNode",
    parent: patch.toParent,
    index: patch.index,
    node: node,
  });
}

/**
 * Apply setProp patch - set a property value
 */
function applySetProp(dsl: UiDsl, patch: Extract<Patch, { op: "setProp" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  node[patch.prop] = patch.value;
  return dsl;
}

/**
 * Apply setToken patch - set a layout token
 */
function applySetToken(dsl: UiDsl, patch: Extract<Patch, { op: "setToken" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  if (!node.layout) {
    node.layout = {};
  }

  // Map token to layout property
  if (patch.token === "space") {
    node.layout.gap = patch.value;
  } else if (patch.token === "radius") {
    // Radius would be in a different location, for now just store it
    (node.layout as any).radius = patch.value;
  } else if (patch.token === "color") {
    // Color would be in a different location, for now just store it
    (node.layout as any).color = patch.value;
  }

  return dsl;
}

/**
 * Apply toggleVariant patch - change variant
 */
function applyToggleVariant(dsl: UiDsl, patch: Extract<Patch, { op: "toggleVariant" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // For actions/buttons, variant is a direct property
  if (node.variant !== undefined) {
    node.variant = patch.value || (node.variant === patch.variant ? undefined : patch.variant);
  } else {
    // For other nodes, store in props
    if (!node.props) node.props = {};
    node.props[patch.variant] = patch.value;
  }

  return dsl;
}

/**
 * Apply wrapWith patch - wrap node in a wrapper component
 */
function applyWrapWith(dsl: UiDsl, patch: Extract<Patch, { op: "wrapWith" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // Find parent of the node
  const parent = findParent(dsl, patch.target);
  if (!parent) {
    throw new Error(
      `Parent not found for node: ${JSON.stringify(patch.target)}. ` +
      `This usually means the node is at the root level or the DSL structure is invalid.`
    );
  }

  // Create wrapper with the node as content
  const wrapper = {
    ...patch.wrapper,
    id: patch.wrapper.id || generateId(),
    content: [node], // Wrap the node
  };

  // Replace node with wrapper in parent
  if (parent.fields) {
    const index = parent.fields.findIndex((f: any) => f.id === node.id);
    if (index !== -1) {
      parent.fields[index] = wrapper;
    }
  } else if (parent.actions) {
    const index = parent.actions.findIndex((a: any) => a.id === node.id);
    if (index !== -1) {
      parent.actions[index] = wrapper;
    }
  } else if (parent.sections) {
    const index = parent.sections.findIndex((s: any) => s.id === node.id);
    if (index !== -1) {
      parent.sections[index] = wrapper;
    }
  } else if (parent.columns) {
    const index = parent.columns.findIndex((c: any) => c.id === node.id);
    if (index !== -1) {
      parent.columns[index] = wrapper;
    }
  } else if (parent.widgets) {
    const index = parent.widgets.findIndex((w: any) => w.id === node.id);
    if (index !== -1) {
      parent.widgets[index] = wrapper;
    }
  }

  return dsl;
}

/**
 * Apply reorder patch - change order of children
 */
function applyReorder(dsl: UiDsl, patch: Extract<Patch, { op: "reorder" }>): UiDsl {
  const parent = findNode(dsl, patch.parent);
  if (!parent) {
    throw new Error(getNodeNotFoundError(patch.parent, dsl));
  }

  // Find the array to reorder
  let array: any[] | null = null;
  if (parent.fields) array = parent.fields;
  else if (parent.actions) array = parent.actions;
  else if (parent.sections) array = parent.sections;
  else if (parent.columns) array = parent.columns;
  else if (parent.widgets) array = parent.widgets;

  if (!array) {
    throw new Error(`Cannot reorder children of parent type: ${parent.type || 'unknown'}`);
  }

  // Reorder
  const [moved] = array.splice(patch.from, 1);
  array.splice(patch.to, 0, moved);

  return dsl;
}

/**
 * Apply renameField patch - rename a form field
 */
function applyRenameField(dsl: UiDsl, patch: Extract<Patch, { op: "renameField" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  if (node.name !== patch.from) {
    throw new Error(`Field name mismatch: expected ${patch.from}, got ${node.name}`);
  }

  node.name = patch.to;
  return dsl;
}

/**
 * Apply duplicateNode patch - duplicate a node
 */
function applyDuplicateNode(dsl: UiDsl, patch: Extract<Patch, { op: "duplicateNode" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  const parent = findParent(dsl, patch.target);
  if (!parent) {
    throw new Error(
      `Parent not found for node: ${JSON.stringify(patch.target)}. ` +
      `This usually means the node is at the root level or the DSL structure is invalid.`
    );
  }

  // Deep clone the node
  const cloned = JSON.parse(JSON.stringify(node));
  cloned.id = generateId(); // New ID for duplicate

  // Find the array containing the node
  let array: any[] | null = null;
  if (parent.fields) array = parent.fields;
  else if (parent.actions) array = parent.actions;
  else if (parent.sections) array = parent.sections;
  else if (parent.columns) array = parent.columns;
  else if (parent.widgets) array = parent.widgets;
  else if (Array.isArray(parent.content)) array = parent.content;
  else {
    // Search in section content if parent is a section
    if (parent.content && typeof parent.content === 'object' && !Array.isArray(parent.content)) {
      // Handle Record<string, UiDsl[]> case
      for (const key of Object.keys(parent.content)) {
        const contentArray = parent.content[key];
        if (Array.isArray(contentArray) && contentArray.some((item: any) => item.id === node.id)) {
          array = contentArray;
          break;
        }
      }
    }
  }

  if (!array) {
    throw new Error(`Cannot duplicate node: parent does not have an array property`);
  }

  // Find index of original node
  const index = array.findIndex((item: any) => item.id === node.id);
  if (index === -1) {
    throw new Error(`Node not found in parent array`);
  }

  // Insert duplicate after original
  array.splice(index + 1, 0, cloned);

  return dsl;
}

/**
 * Apply swap patch - swap positions of two nodes
 */
function applySwap(dsl: UiDsl, patch: Extract<Patch, { op: "swap" }>): UiDsl {
  const nodeA = findNode(dsl, patch.a);
  const nodeB = findNode(dsl, patch.b);
  
  if (!nodeA || !nodeB) {
    const errors: string[] = [];
    if (!nodeA) errors.push(getNodeNotFoundError(patch.a, dsl));
    if (!nodeB) errors.push(getNodeNotFoundError(patch.b, dsl));
    throw new Error(`One or both nodes not found:\n${errors.join('\n')}`);
  }

  const parentA = findParent(dsl, patch.a);
  const parentB = findParent(dsl, patch.b);

  if (!parentA || !parentB) {
    throw new Error(`Parent not found for one or both nodes`);
  }

  // Both nodes must be in the same parent
  if (parentA !== parentB) {
    throw new Error(`Cannot swap nodes from different parents`);
  }

  // Find which arrays contain the nodes
  let arrayA: any[] | null = null;
  let arrayB: any[] | null = null;
  
  // Check all possible array properties
  if (parentA.fields && parentA.fields.some((item: any) => item.id === nodeA.id)) arrayA = parentA.fields;
  if (parentA.fields && parentA.fields.some((item: any) => item.id === nodeB.id)) arrayB = parentA.fields;
  if (parentA.actions && parentA.actions.some((item: any) => item.id === nodeA.id)) arrayA = parentA.actions;
  if (parentA.actions && parentA.actions.some((item: any) => item.id === nodeB.id)) arrayB = parentA.actions;
  if (parentA.sections && parentA.sections.some((item: any) => item.id === nodeA.id)) arrayA = parentA.sections;
  if (parentA.sections && parentA.sections.some((item: any) => item.id === nodeB.id)) arrayB = parentA.sections;
  if (parentA.columns && parentA.columns.some((item: any) => item.id === nodeA.id)) arrayA = parentA.columns;
  if (parentA.columns && parentA.columns.some((item: any) => item.id === nodeB.id)) arrayB = parentA.columns;
  if (parentA.widgets && parentA.widgets.some((item: any) => item.id === nodeA.id)) arrayA = parentA.widgets;
  if (parentA.widgets && parentA.widgets.some((item: any) => item.id === nodeB.id)) arrayB = parentA.widgets;
  if (Array.isArray(parentA.content)) {
    if (parentA.content.some((item: any) => item.id === nodeA.id)) arrayA = parentA.content;
    if (parentA.content.some((item: any) => item.id === nodeB.id)) arrayB = parentA.content;
  }
  
  // If nodes are in different arrays, they're in different logical parents
  if (arrayA && arrayB && arrayA !== arrayB) {
    throw new Error(`Cannot swap nodes from different parents`);
  }
  
  // Use the array that contains both nodes (should be the same)
  let array: any[] | null = arrayA || arrayB;
  
  // If not found in standard arrays, search in section content
  if (!array && parentA.content && typeof parentA.content === 'object' && !Array.isArray(parentA.content)) {
    // Handle Record<string, UiDsl[]> case - find which key contains both nodes
    for (const key of Object.keys(parentA.content)) {
      const contentArray = parentA.content[key];
      if (Array.isArray(contentArray)) {
        const hasA = contentArray.some((item: any) => item.id === nodeA.id);
        const hasB = contentArray.some((item: any) => item.id === nodeB.id);
        if (hasA && hasB) {
          array = contentArray;
          break;
        }
      }
    }
  }

  if (!array) {
    throw new Error(`Cannot swap nodes: parent does not have an array property`);
  }

  const indexA = array.findIndex((item: any) => item.id === nodeA.id);
  const indexB = array.findIndex((item: any) => item.id === nodeB.id);

  if (indexA === -1 || indexB === -1) {
    throw new Error(`One or both nodes not found in parent array`);
  }

  // Swap positions
  [array[indexA], array[indexB]] = [array[indexB], array[indexA]];

  return dsl;
}

/**
 * Apply bindData patch - bind data source to a node
 */
function applyBindData(dsl: UiDsl, patch: Extract<Patch, { op: "bindData" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // Bind data to node - for sections in UiPage, data goes directly on the section
  // For other nodes, add data property
  node.data = patch.data;

  return dsl;
}

/**
 * Apply renameSection patch - rename a section title
 */
function applyRenameSection(dsl: UiDsl, patch: Extract<Patch, { op: "renameSection" }>): UiDsl {
  const node = findNode(dsl, patch.target);
  if (!node) {
    throw new Error(getNodeNotFoundError(patch.target, dsl));
  }

  // Update title property (sections have title)
  if (node.title !== undefined) {
    node.title = patch.value;
  } else if (node.label !== undefined) {
    // Fallback to label if title doesn't exist
    node.label = patch.value;
  } else {
    // Create title property if it doesn't exist
    node.title = patch.value;
  }

  return dsl;
}

/**
 * Find parent of a node
 * Enhanced with better dashboard widget support
 */
export function findParent(dsl: UiDsl, ref: NodeRef): any | null {
  const node = findNode(dsl, ref);
  if (!node) return null;

  // Search for parent by checking all arrays
  function searchParent(current: any, targetId: string): any | null {
    if (!current) return null;
    
    if (current.fields) {
      if (current.fields.some((f: any) => f.id === targetId)) return current;
      for (const field of current.fields) {
        const found = searchParent(field, targetId);
        if (found) return found;
      }
    }

    if (current.actions) {
      if (current.actions.some((a: any) => a.id === targetId)) return current;
      for (const action of current.actions) {
        const found = searchParent(action, targetId);
        if (found) return found;
      }
    }

    if (current.sections) {
      if (current.sections.some((s: any) => s.id === targetId)) return current;
      for (const section of current.sections) {
        const found = searchParent(section, targetId);
        if (found) return found;
        
        // Also search in section content
        if (section.content) {
          if (Array.isArray(section.content)) {
            if (section.content.some((c: any) => c.id === targetId)) return section;
            for (const child of section.content) {
              const found = searchParent(child, targetId);
              if (found) return found;
            }
          } else if (typeof section.content === 'object') {
            // Handle Record<string, UiDsl[]> case (regions)
            for (const children of Object.values(section.content)) {
              if (Array.isArray(children)) {
                if (children.some((c: any) => c.id === targetId)) return section;
                for (const child of children) {
                  const found = searchParent(child, targetId);
                  if (found) return found;
                }
              }
            }
          }
        }
      }
    }

    if (current.columns) {
      if (current.columns.some((c: any) => c.id === targetId)) return current;
      for (const column of current.columns) {
        const found = searchParent(column, targetId);
        if (found) return found;
      }
    }

    // Enhanced widget search for dashboards
    if (current.widgets) {
      if (current.widgets.some((w: any) => w.id === targetId)) return current;
      for (const widget of current.widgets) {
        const found = searchParent(widget, targetId);
        if (found) return found;
        
        // Also search in widget content if it exists
        if (widget.content && Array.isArray(widget.content)) {
          if (widget.content.some((c: any) => c.id === targetId)) return widget;
          for (const child of widget.content) {
            const found = searchParent(child, targetId);
            if (found) return found;
          }
        }
      }
    }
    
    // Search in regions (for page/screen layouts)
    if (current.regions) {
      for (const [regionKey, region] of Object.entries(current.regions)) {
        const regionObj = region as any;
        
        // Search in modules
        if (regionObj.modules && Array.isArray(regionObj.modules)) {
          if (regionObj.modules.some((m: any) => m.id === targetId)) return regionObj;
          for (const module of regionObj.modules) {
            const found = searchParent(module, targetId);
            if (found) return found;
          }
        }
        
        // Search in content
        if (regionObj.content && Array.isArray(regionObj.content)) {
          if (regionObj.content.some((c: any) => c.id === targetId)) return regionObj;
          for (const child of regionObj.content) {
            const found = searchParent(child, targetId);
            if (found) return found;
          }
        }
      }
    }

    return null;
  }

  return searchParent(dsl, node.id);
}

