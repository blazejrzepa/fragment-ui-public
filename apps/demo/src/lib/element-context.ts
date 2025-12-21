/**
 * Element Context Utilities
 * 
 * Functions to extract context about selected elements for AI/chat:
 * - Subtree snapshot (DSL node + children)
 * - Allowed props from registry
 * - Component metadata
 */

import registry from "@fragment_ui/registry/registry.json";

/**
 * Find DSL node by ID (recursive search)
 */
export function findDslNodeById(node: any, id: string): any | null {
  if (!node || typeof node !== "object") return null;
  
  if (node.id === id) {
    return node;
  }

  // Search in children/fields/actions/sections/columns/widgets
  const searchArrays = [
    node.fields,
    node.actions,
    node.sections,
    node.columns,
    node.filters,
    node.widgets,
    node.children,
  ];

  for (const arr of searchArrays) {
    if (Array.isArray(arr)) {
      for (const child of arr) {
        const found = findDslNodeById(child, id);
        if (found) return found;
      }
    }
  }

  // Search in section.content (can be array or object)
  if (node.sections) {
    for (const section of node.sections) {
      if (section.content) {
        if (Array.isArray(section.content)) {
          for (const child of section.content) {
            const found = findDslNodeById(child, id);
            if (found) return found;
          }
        } else if (typeof section.content === "object") {
          for (const children of Object.values(section.content)) {
            if (Array.isArray(children)) {
              for (const child of children) {
                const found = findDslNodeById(child, id);
                if (found) return found;
              }
            }
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Extract subtree snapshot from DSL
 * Returns the selected node with its direct children (limited depth for context)
 */
export function extractSubtreeSnapshot(dsl: any, elementId: string, maxDepth: number = 2): any | null {
  const node = findDslNodeById(dsl, elementId);
  if (!node) return null;

  // Create a snapshot with limited depth
  function createSnapshot(n: any, depth: number): any {
    if (depth > maxDepth) {
      return { id: n.id, type: n.type, _truncated: true };
    }

    const snapshot: any = {
      id: n.id,
      type: n.type,
      component: n.component,
      label: n.label,
      variant: n.variant,
      size: n.size,
    };

    // Include children/fields/actions (limited)
    if (n.fields && Array.isArray(n.fields)) {
      snapshot.fields = n.fields.slice(0, 5).map((f: any) => createSnapshot(f, depth + 1));
      if (n.fields.length > 5) snapshot._fieldsTruncated = true;
    }
    if (n.actions && Array.isArray(n.actions)) {
      snapshot.actions = n.actions.slice(0, 5).map((a: any) => createSnapshot(a, depth + 1));
      if (n.actions.length > 5) snapshot._actionsTruncated = true;
    }
    if (n.children && Array.isArray(n.children)) {
      snapshot.children = n.children.slice(0, 5).map((c: any) => createSnapshot(c, depth + 1));
      if (n.children.length > 5) snapshot._childrenTruncated = true;
    }
    if (n.sections && Array.isArray(n.sections)) {
      snapshot.sections = n.sections.slice(0, 3).map((s: any) => ({
        id: s.id,
        kind: s.kind,
        title: s.title,
        _contentTruncated: !!s.content,
      }));
      if (n.sections.length > 3) snapshot._sectionsTruncated = true;
    }

    return snapshot;
  }

  return createSnapshot(node, 0);
}

/**
 * Get component props from registry
 */
export function getComponentProps(componentName: string): Record<string, any> | null {
  if (!componentName || !registry.components) return null;
  
  const component = (registry.components as Record<string, any>)[componentName];
  return component?.props || null;
}

/**
 * Get allowed values for a prop from registry
 */
export function getAllowedPropValues(componentName: string, propName: string): string[] | null {
  const props = getComponentProps(componentName);
  if (!props || !props[propName]) return null;
  
  const propDef = props[propName];
  // If prop is an array, it contains allowed values
  if (Array.isArray(propDef)) {
    return propDef;
  }
  // If prop is an object with enum/values
  if (propDef && typeof propDef === 'object' && propDef.values) {
    return propDef.values;
  }
  // If prop is a string type, return null (any value allowed)
  return null;
}

/**
 * Get all allowed props for a component (with their types and allowed values)
 */
export function getAllowedProps(componentName: string): Record<string, {
  type: string;
  allowedValues?: string[];
  required?: boolean;
  description?: string;
}> | null {
  const props = getComponentProps(componentName);
  if (!props) return null;

  const allowedProps: Record<string, any> = {};
  
  for (const [propName, propDef] of Object.entries(props)) {
    if (Array.isArray(propDef)) {
      // Array means enum values
      allowedProps[propName] = {
        type: 'enum',
        allowedValues: propDef,
      };
    } else if (propDef && typeof propDef === 'object') {
      allowedProps[propName] = {
        type: propDef.type || 'string',
        allowedValues: propDef.values || propDef.enum,
        required: propDef.required,
        description: propDef.description,
      };
    } else {
      // String or other type
      allowedProps[propName] = {
        type: typeof propDef === 'string' ? propDef : 'any',
      };
    }
  }

  return allowedProps;
}

/**
 * Extract component name from TSX code by data-ui-id
 */
export function extractComponentNameFromCode(code: string, elementId: string): string | null {
  // First try React components (capitalized) - handle multiline
  const reactComponentRegex = new RegExp(`<([A-Z]\\w+)[\\s\\S]*?data-ui-id=["']${elementId}["']`, 'g');
  const reactMatch = code.match(reactComponentRegex);
  if (reactMatch) {
    const componentMatch = reactMatch[0].match(/<([A-Z]\w+)/);
    if (componentMatch) return componentMatch[1];
  }
  
  // Then try HTML elements (lowercase) - handle multiline
  const htmlElementRegex = new RegExp(`<([a-z]+)[\\s\\S]*?data-ui-id=["']${elementId}["']`, 'g');
  const htmlMatch = code.match(htmlElementRegex);
  if (htmlMatch) {
    const elementMatch = htmlMatch[0].match(/<([a-z]+)/);
    if (elementMatch) {
      const tagName = elementMatch[1];
      // Capitalize first letter for display
      return tagName.charAt(0).toUpperCase() + tagName.slice(1);
    }
  }
  
  return null;
}

