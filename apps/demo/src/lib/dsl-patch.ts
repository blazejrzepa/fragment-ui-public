/**
 * UI-DSL v2 Patch Operations
 * 
 * Implements all patch operations for conversational editing
 */

import type {
  UiPage,
  UiNode,
  UiComponent,
  UiSection,
  UiGrid,
  Patch,
  Diagnostic,
} from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Find node by ID in DSL tree
 * Supports UUID, kebab-case ID, or data-ui-id
 */
export function findNodeById(dsl: UiPage, id: string): UiNode | null {
  if (dsl.id === id || dsl.dataUiId === id) {
    return dsl;
  }
  
  function search(nodes: UiNode[]): UiNode | null {
    for (const node of nodes) {
      // Match by UUID, kebab-case ID, or data-ui-id
      if (node.id === id || node.dataUiId === id) {
        return node;
      }
      
      if ("children" in node && Array.isArray(node.children)) {
        const found = search(node.children);
        if (found) return found;
      }
      
      if (node.type === "component" && node.slots) {
        for (const slotNodes of Object.values(node.slots)) {
          const found = search(slotNodes);
          if (found) return found;
        }
      }
    }
    return null;
  }
  
  return search(dsl.children);
}

/**
 * Find parent node of a given node
 */
export function findParentNode(
  dsl: UiPage,
  targetId: string
): { parent: UiPage | UiNode; childIndex: number; path: string } | null {
  function search(
    parent: UiPage | UiNode,
    nodes: UiNode[],
    index: number,
    path: string
  ): { parent: UiPage | UiNode; childIndex: number; path: string } | null {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === targetId) {
        return { parent, childIndex: i, path };
      }
      
      if ("children" in node && Array.isArray(node.children)) {
        const found = search(node, node.children, i, `${path}.children[${i}]`);
        if (found) return found;
      }
      
      if (node.type === "component" && node.slots) {
        for (const [slotName, slotNodes] of Object.entries(node.slots)) {
          for (let j = 0; j < slotNodes.length; j++) {
            if (slotNodes[j].id === targetId) {
              return { parent: node, childIndex: j, path: `${path}.slots.${slotName}[${j}]` };
            }
            const found = search(node, slotNodes, j, `${path}.slots.${slotName}[${j}]`);
            if (found) return found;
          }
        }
      }
    }
    return null;
  }
  
  return search(dsl, dsl.children, -1, "children");
}

/**
 * Apply patch operation to DSL
 */
export function applyPatch(
  dsl: UiPage,
  patch: Patch,
  registry?: any
): { dsl: UiPage; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const newDsl = JSON.parse(JSON.stringify(dsl)) as UiPage; // Deep clone
  
  const targetNode = findNodeById(newDsl, patch.targetId);
  if (!targetNode) {
    diagnostics.push({
      level: "error",
      message: `Node with id "${patch.targetId}" not found`,
      path: "targetId",
      code: "NODE_NOT_FOUND",
    });
    return { dsl: newDsl, diagnostics };
  }
  
  switch (patch.op) {
    case "setProp":
      applySetProp(targetNode, patch.args, diagnostics, registry);
      break;
    case "setCopy":
      applySetCopy(targetNode, patch.args, diagnostics);
      break;
    case "toggleVariant":
      applyToggleVariant(targetNode, patch.args, diagnostics, registry);
      break;
    case "addNode":
      applyAddNode(newDsl, targetNode, patch.args, diagnostics);
      break;
    case "removeNode":
      applyRemoveNode(newDsl, patch.targetId, diagnostics);
      break;
    case "moveNode":
      applyMoveNode(newDsl, patch.targetId, patch.args, diagnostics);
      break;
    case "wrapWith":
      applyWrapWith(newDsl, patch.targetId, patch.args, diagnostics);
      break;
    case "reorder":
      applyReorder(newDsl, patch.targetId, patch.args, diagnostics);
      break;
    case "rename":
      applyRename(targetNode, patch.args, diagnostics);
      break;
    case "setToken":
      applySetToken(targetNode, patch.args, diagnostics);
      break;
    case "setBinding":
      applySetBinding(targetNode, patch.args, diagnostics);
      break;
    case "setDataSource":
      applySetDataSource(newDsl, patch.args, diagnostics);
      break;
    default:
      diagnostics.push({
        level: "error",
        message: `Unknown patch operation: ${patch.op}`,
        code: "UNKNOWN_OPERATION",
      });
  }
  
  return { dsl: newDsl, diagnostics };
}

/**
 * Apply setProp operation
 */
function applySetProp(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[],
  registry?: any
): void {
  if (node.type !== "component") {
    diagnostics.push({
      level: "error",
      message: "setProp can only be applied to component nodes",
      code: "INVALID_NODE_TYPE",
    });
    return;
  }
  
  const { path, value } = args;
  if (!path) {
    diagnostics.push({
      level: "error",
      message: "path is required for setProp",
      code: "MISSING_ARG",
    });
    return;
  }
  
  // Validate prop against registry
  if (registry?.components?.[node.component]?.props) {
    const allowedProps = Object.keys(registry.components[node.component].props);
    const propName = path.replace("props.", "");
    if (!allowedProps.includes(propName)) {
      diagnostics.push({
        level: "warning",
        message: `Prop "${propName}" not found in registry for component "${node.component}"`,
        code: "UNKNOWN_PROP",
      });
    }
  }
  
  if (path.startsWith("props.")) {
    const propName = path.replace("props.", "");
    if (!node.props) {
      node.props = {};
    }
    node.props[propName] = value;
  } else {
    diagnostics.push({
      level: "error",
      message: `Invalid path for setProp: ${path}. Must start with "props."`,
      code: "INVALID_PATH",
    });
  }
}

/**
 * Apply setCopy operation
 */
function applySetCopy(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { copy } = args;
  if (copy === undefined) {
    diagnostics.push({
      level: "error",
      message: "copy is required for setCopy",
      code: "MISSING_ARG",
    });
    return;
  }
  
  if (node.type !== "component") {
    diagnostics.push({
      level: "error",
      message: "setCopy can only be applied to component nodes",
      code: "INVALID_NODE_TYPE",
    });
    return;
  }
  
  node.copy = copy;
}

/**
 * Apply toggleVariant operation
 */
function applyToggleVariant(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[],
  registry?: any
): void {
  if (node.type !== "component") {
    diagnostics.push({
      level: "error",
      message: "toggleVariant can only be applied to component nodes",
      code: "INVALID_NODE_TYPE",
    });
    return;
  }
  
  const { variant } = args;
  if (variant) {
    // Validate variant against registry
    if (registry?.components?.[node.component]?.variants) {
      const allowedVariants = registry.components[node.component].variants;
      if (!allowedVariants.includes(variant)) {
        diagnostics.push({
          level: "error",
          message: `Variant "${variant}" not found for component "${node.component}". Available: ${allowedVariants.join(", ")}`,
          code: "INVALID_VARIANT",
        });
        return;
      }
    }
    node.variant = variant;
  } else {
    // Toggle between variants if no specific variant provided
    const variants = registry?.components?.[node.component]?.variants || ["solid", "outline", "ghost"];
    const currentIndex = variants.indexOf(node.variant || variants[0]);
    const nextIndex = (currentIndex + 1) % variants.length;
    node.variant = variants[nextIndex];
  }
}

/**
 * Apply addNode operation
 */
function applyAddNode(
  dsl: UiPage,
  targetNode: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { node, position = "after" } = args;
  if (!node) {
    diagnostics.push({
      level: "error",
      message: "node is required for addNode",
      code: "MISSING_ARG",
    });
    return;
  }
  
  // Check if targetNode has children - if so, add to its children
  if ("children" in targetNode && Array.isArray(targetNode.children)) {
    const newNode = { ...node, id: node.id || randomUUID() } as UiNode;
    if (position === "start") {
      targetNode.children.unshift(newNode);
    } else if (position === "before") {
      // For "before", we need to add relative to a specific child
      // This requires a referenceId, but for now, add to end
      targetNode.children.push(newNode);
    } else {
      // "after" or "end" - add to end
      targetNode.children.push(newNode);
    }
    return;
  }
  
  // Otherwise, add to parent's children (sibling of targetNode)
  const parentInfo = findParentNode(dsl, targetNode.id);
  if (!parentInfo) {
    diagnostics.push({
      level: "error",
      message: `Parent not found for node "${targetNode.id}"`,
      code: "PARENT_NOT_FOUND",
    });
    return;
  }
  
  const { parent, childIndex } = parentInfo;
  
  if ("children" in parent && Array.isArray(parent.children)) {
    const newNode = { ...node, id: node.id || randomUUID() } as UiNode;
    if (position === "before") {
      parent.children.splice(childIndex, 0, newNode);
    } else {
      parent.children.splice(childIndex + 1, 0, newNode);
    }
  } else {
    diagnostics.push({
      level: "error",
      message: "Parent node does not support children",
      code: "INVALID_PARENT",
    });
  }
}

/**
 * Apply removeNode operation
 */
function applyRemoveNode(
  dsl: UiPage,
  targetId: string,
  diagnostics: Diagnostic[]
): void {
  if (dsl.id === targetId) {
    diagnostics.push({
      level: "error",
      message: "Cannot remove root page node",
      code: "CANNOT_REMOVE_ROOT",
    });
    return;
  }
  
  const parentInfo = findParentNode(dsl, targetId);
  if (!parentInfo) {
    diagnostics.push({
      level: "error",
      message: `Node "${targetId}" not found`,
      code: "NODE_NOT_FOUND",
    });
    return;
  }
  
  const { parent, childIndex } = parentInfo;
  
  if ("children" in parent && Array.isArray(parent.children)) {
    parent.children.splice(childIndex, 1);
  } else if (parent.type === "component" && parent.slots) {
    // Handle slot removal
    for (const [slotName, slotNodes] of Object.entries(parent.slots)) {
      const index = slotNodes.findIndex((n) => n.id === targetId);
      if (index !== -1) {
        slotNodes.splice(index, 1);
        return;
      }
    }
  }
}

/**
 * Apply moveNode operation
 */
function applyMoveNode(
  dsl: UiPage,
  targetId: string,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { toParentId, position = "end" } = args;
  if (!toParentId) {
    diagnostics.push({
      level: "error",
      message: "toParentId is required for moveNode",
      code: "MISSING_ARG",
    });
    return;
  }
  
  const targetNode = findNodeById(dsl, targetId);
  const toParent = findNodeById(dsl, toParentId);
  
  if (!targetNode) {
    diagnostics.push({
      level: "error",
      message: `Target node "${targetId}" not found`,
      code: "NODE_NOT_FOUND",
    });
    return;
  }
  
  if (!toParent) {
    diagnostics.push({
      level: "error",
      message: `Parent node "${toParentId}" not found`,
      code: "PARENT_NOT_FOUND",
    });
    return;
  }
  
  if (!("children" in toParent)) {
    diagnostics.push({
      level: "error",
      message: "Target parent does not support children",
      code: "INVALID_PARENT",
    });
    return;
  }
  
  // Remove from current location
  applyRemoveNode(dsl, targetId, diagnostics);
  
  // Add to new location
  if (!toParent.children) {
    toParent.children = [];
  }
  if (position === "start") {
    toParent.children.unshift(targetNode);
  } else {
    toParent.children.push(targetNode);
  }
}

/**
 * Apply wrapWith operation
 */
function applyWrapWith(
  dsl: UiPage,
  targetId: string,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { wrapper } = args;
  if (!wrapper) {
    diagnostics.push({
      level: "error",
      message: "wrapper is required for wrapWith",
      code: "MISSING_ARG",
    });
    return;
  }
  
  const targetNode = findNodeById(dsl, targetId);
  if (!targetNode) {
    diagnostics.push({
      level: "error",
      message: `Target node "${targetId}" not found`,
      code: "NODE_NOT_FOUND",
    });
    return;
  }
  
  const parentInfo = findParentNode(dsl, targetId);
  if (!parentInfo) {
    diagnostics.push({
      level: "error",
      message: `Parent not found for node "${targetId}"`,
      code: "PARENT_NOT_FOUND",
    });
    return;
  }
  
  const { parent, childIndex } = parentInfo;
  const wrapperNode = {
    ...wrapper,
    id: wrapper.id || randomUUID(),
    children: [targetNode],
  } as UiNode;
  
  if ("children" in parent && Array.isArray(parent.children)) {
    parent.children[childIndex] = wrapperNode;
  }
}

/**
 * Apply reorder operation
 */
function applyReorder(
  dsl: UiPage,
  targetId: string,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { direction = "down" } = args;
  
  const parentInfo = findParentNode(dsl, targetId);
  if (!parentInfo) {
    diagnostics.push({
      level: "error",
      message: `Parent not found for node "${targetId}"`,
      code: "PARENT_NOT_FOUND",
    });
    return;
  }
  
  const { parent, childIndex } = parentInfo;
  
  if (!("children" in parent) || !Array.isArray(parent.children)) {
    diagnostics.push({
      level: "error",
      message: "Parent does not support children",
      code: "INVALID_PARENT",
    });
    return;
  }
  
  const newIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
  if (newIndex < 0 || newIndex >= parent.children.length) {
    diagnostics.push({
      level: "error",
      message: `Cannot move node ${direction}: already at ${direction === "up" ? "start" : "end"}`,
      code: "INVALID_POSITION",
    });
    return;
  }
  
  const node = parent.children[childIndex];
  parent.children.splice(childIndex, 1);
  parent.children.splice(newIndex, 0, node);
}

/**
 * Apply rename operation
 */
function applyRename(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { name } = args;
  if (!name) {
    diagnostics.push({
      level: "error",
      message: "name is required for rename",
      code: "MISSING_ARG",
    });
    return;
  }
  
  node.name = name;
}

/**
 * Apply setToken operation
 */
function applySetToken(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { path, value } = args;
  if (!path || value === undefined) {
    diagnostics.push({
      level: "error",
      message: "path and value are required for setToken",
      code: "MISSING_ARG",
    });
    return;
  }
  
  // Tokens are typically in layout or props
  if (path.startsWith("layout.")) {
    if (!node.layout) {
      node.layout = {};
    }
    const tokenPath = path.replace("layout.", "");
    (node.layout as any)[tokenPath] = value;
  } else {
    diagnostics.push({
      level: "error",
      message: `Invalid token path: ${path}. Must start with "layout."`,
      code: "INVALID_PATH",
    });
  }
}

/**
 * Apply setBinding operation
 */
function applySetBinding(
  node: UiNode,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  if (node.type !== "component") {
    diagnostics.push({
      level: "error",
      message: "setBinding can only be applied to component nodes",
      code: "INVALID_NODE_TYPE",
    });
    return;
  }
  
  const { binding } = args;
  if (!binding) {
    diagnostics.push({
      level: "error",
      message: "binding is required for setBinding",
      code: "MISSING_ARG",
    });
    return;
  }
  
  if (!node.bind) {
    node.bind = [];
  }
  
  // Add or update binding
  const existingIndex = node.bind.findIndex((b) => b.prop === binding.prop);
  if (existingIndex !== -1) {
    node.bind[existingIndex] = binding;
  } else {
    node.bind.push(binding);
  }
}

/**
 * Apply setDataSource operation
 */
function applySetDataSource(
  dsl: UiPage,
  args: Record<string, any>,
  diagnostics: Diagnostic[]
): void {
  const { dataSource } = args;
  if (!dataSource) {
    diagnostics.push({
      level: "error",
      message: "dataSource is required for setDataSource",
      code: "MISSING_ARG",
    });
    return;
  }
  
  if (!dsl.dataSources) {
    dsl.dataSources = [];
  }
  
  // Add or update datasource
  const existingIndex = dsl.dataSources.findIndex((ds) => ds.id === dataSource.id);
  if (existingIndex !== -1) {
    dsl.dataSources[existingIndex] = dataSource;
  } else {
    dsl.dataSources.push(dataSource);
  }
}

/**
 * Generate inverse patch (for undo)
 * 
 * For operations that modify state, we capture the previous state before applying the patch.
 * For operations that add/remove nodes, we generate the inverse operation.
 */
export function generateInversePatch(
  dsl: UiPage,
  patch: Patch
): Patch | null {
  const targetNode = findNodeById(dsl, patch.targetId);
  if (!targetNode) {
    return null;
  }
  
  switch (patch.op) {
    case "setProp": {
      const propName = patch.args.path?.replace("props.", "");
      const previousValue = (targetNode as UiComponent).props?.[propName];
      return {
        targetId: patch.targetId,
        op: "setProp",
        args: {
          path: patch.args.path,
          value: previousValue, // Restore previous value
        },
      };
    }
    case "setCopy": {
      return {
        targetId: patch.targetId,
        op: "setCopy",
        args: {
          copy: (targetNode as UiComponent).copy, // Restore previous copy
        },
      };
    }
    case "toggleVariant": {
      // Restore previous variant
      return {
        targetId: patch.targetId,
        op: "toggleVariant",
        args: {
          variant: (targetNode as UiComponent).variant,
        },
      };
    }
    case "addNode": {
      // Inverse: remove the added node
      // Note: We need to know the ID of the added node, which should be in patch.args.node.id
      const addedNodeId = patch.args.node?.id;
      if (!addedNodeId) {
        return null; // Cannot generate inverse without node ID
      }
      return {
        targetId: addedNodeId,
        op: "removeNode",
        args: {},
      };
    }
    case "removeNode": {
      // Inverse: add back the removed node
      // Note: We need to store the removed node data, which is not available here
      // This is a limitation - we'd need to capture the node before removal
      // For now, return null to indicate this operation cannot be easily inverted
      return null;
    }
    case "moveNode": {
      // Inverse: move back to original position
      const parentInfo = findParentNode(dsl, patch.targetId);
      if (!parentInfo) {
        return null;
      }
      // Find original parent (this is complex - we'd need to track original position)
      // For now, return null - this would require storing original position
      return null;
    }
    case "wrapWith": {
      // Inverse: unwrap (remove wrapper, restore original)
      // This is complex - we'd need to store the original parent structure
      return null;
    }
    case "reorder": {
      // Inverse: reverse the reorder direction
      return {
        targetId: patch.targetId,
        op: "reorder",
        args: {
          direction: patch.args.direction === "up" ? "down" : "up",
        },
      };
    }
    case "rename": {
      // Inverse: restore previous name
      return {
        targetId: patch.targetId,
        op: "rename",
        args: {
          name: targetNode.name, // Restore previous name
        },
      };
    }
    case "setToken": {
      // Inverse: restore previous token value
      const tokenPath = patch.args.path?.replace("layout.", "");
      const previousValue = (targetNode.layout as any)?.[tokenPath];
      return {
        targetId: patch.targetId,
        op: "setToken",
        args: {
          path: patch.args.path,
          value: previousValue,
        },
      };
    }
    case "setBinding": {
      // Inverse: remove or restore previous binding
      // This is complex - we'd need to track previous bindings
      // For now, return null
      return null;
    }
    case "setDataSource": {
      // Inverse: restore previous datasource
      // This is complex - we'd need to track previous datasource
      // For now, return null
      return null;
    }
    default:
      return null;
  }
}

