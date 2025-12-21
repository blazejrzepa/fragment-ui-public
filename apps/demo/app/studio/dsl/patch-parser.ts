/**
 * Patch Command Parser
 * 
 * Parses natural language commands into Patch operations for conversational editing.
 * 
 * v1.1: Basic parser for common editing operations.
 */

import type { Patch, NodeRef } from './patch';
import type { UiDsl } from './types';

export interface ParseResult {
  patches: Patch[];
  confidence: number; // 0-1, how confident we are in the parse
  error?: string;
}

/**
 * Parse natural language command into Patch operations
 */
export function parseIntent(command: string, selectedElementId?: string, dsl?: UiDsl): ParseResult {
  const normalized = command.toLowerCase().trim();
  
  // If no DSL, we can't parse properly
  if (!dsl) {
    return {
      patches: [],
      confidence: 0,
      error: "DSL not available - cannot parse patch commands without DSL",
    };
  }

  // Try to match common patterns
  const patterns = [
    // Add header/heading and description above component (MUST BE FIRST - most specific)
    {
      regex: /(?:dodaj|daj|add|insert)\s+(?:nag[łl][óo]?wek|naglowek|header|heading|headline|tytu[łl]|title)\s+(?:i\s+|and\s+)?(?:opis|description|text)(?:\s*(?:nad|above|over|przed)\s+(?:komponentem|component))?/i,
      handler: (): Patch[] => {
        const patches: Patch[] = [];
        
        // For forms, set title and description on the form itself
        if (dsl.type === 'form') {
          // Always set form title (even if already set, we can update it)
          patches.push({
            op: "setProp",
            target: { type: "byId", id: dsl.id },
            prop: "title",
            value: "Nagłówek",
          });
          
          // Always set form description (even if already set, we can update it)
          patches.push({
            op: "setProp",
            target: { type: "byId", id: dsl.id },
            prop: "description",
            value: "Opis",
          });
        } else {
          // For pages/screens, add as separate components before existing content
          const parent: NodeRef = { type: "byId", id: dsl.id };
          
          // Create heading node
          const headingNode = {
            id: `heading-${Date.now()}`,
            type: 'component',
            component: 'Heading',
            title: 'Nagłówek',
            dataUiId: true,
          };

          // Create description node
          const descriptionNode = {
            id: `description-${Date.now() + 1}`,
            type: 'component',
            component: 'Text',
            copy: 'Opis',
            dataUiId: true,
          };

          patches.push({
            op: "addNode",
            parent,
            index: 0,
            node: headingNode,
          });
          patches.push({
            op: "addNode",
            parent,
            index: 1,
            node: descriptionNode,
          });
        }

        return patches;
      },
    },
    // Add header/heading only above component
    {
      regex: /(?:dodaj|daj|add|insert)\s+(?:nag[łl][óo]?wek|naglowek|header|heading|headline|tytu[łl]|title)(?:\s*(?:nad|above|over|przed)\s+(?:komponentem|component))?/i,
      handler: (): Patch[] => {
        // For forms, set title on the form itself
        if (dsl.type === 'form') {
          // Always set form title (even if already set, we can update it)
          return [{
            op: "setProp",
            target: { type: "byId", id: dsl.id },
            prop: "title",
            value: "Nagłówek",
          }];
        } else {
          // For pages/screens, add as component
          const parent = { type: "byId" as const, id: dsl.id };
          const headingNode = {
            id: `heading-${Date.now()}`,
            type: 'component',
            component: 'Heading',
            title: 'Nagłówek',
            dataUiId: true,
          };
          return [{
            op: "addNode",
            parent,
            index: 0,
            node: headingNode,
          }];
        }
      },
    },
    // Add description only above component
    {
      regex: /(?:dodaj|daj|add|insert)\s+(?:opis|description|text)(?:\s*(?:nad|above|over|przed)\s+(?:komponentem|component))?/i,
      handler: (): Patch[] => {
        // For forms, set description on the form itself
        if (dsl.type === 'form') {
          // Always set form description (even if already set, we can update it)
          return [{
            op: "setProp",
            target: { type: "byId", id: dsl.id },
            prop: "description",
            value: "Opis",
          }];
        } else {
          // For pages/screens, add as component
          const parent = { type: "byId" as const, id: dsl.id };
          const descriptionNode = {
            id: `description-${Date.now()}`,
            type: 'component',
            component: 'Text',
            copy: 'Opis',
            dataUiId: true,
          };
          return [{
            op: "addNode",
            parent,
            index: 0,
            node: descriptionNode,
          }];
        }
      },
    },
    // Add component with text (e.g., "add button with text 'Submit'")
    {
      regex: /(?:dodaj|add|insert)\s+(?:drugi|trzeci|czwarty|pi[ąa]ty|drugi|second|third|fourth|fifth)?\s*(?:przycisk|button|input|pole|field|komponent|component)\s+(?:z\s+)?(?:tekstem|text|label)?\s*(?:with\s+)?(?:text|label)?\s*["']([^"']+)["']/i,
      handler: (match: RegExpMatchArray): Patch[] => {
        const label = match[1];
        const componentType = determineComponentType(normalized);
        
        const parent = selectedElementId
          ? { type: "byId" as const, id: selectedElementId }
          : findParentContainer(dsl);

        if (!parent) {
          return [];
        }

        const newNode = createComponentNode(componentType, label, dsl);
        return [{
          op: "addNode",
          parent,
          node: newNode,
        }];
      },
    },
    // Add component without text (e.g., "add button", "dodaj drugi button")
    {
      regex: /(?:dodaj|add|insert)\s+(?:drugi|trzeci|czwarty|pi[ąa]ty|drugi|second|third|fourth|fifth)?\s*(?:przycisk|button|input|pole|field|komponent|component)(?:\s|$)/i,
      handler: (): Patch[] => {
        const componentType = determineComponentType(normalized);
        
        // For buttons, use default label based on component type
        let defaultLabel = "Button";
        if (componentType === "Button") {
          // If it's a form, try to determine button label from context
          if (dsl.type === "form") {
            const existingButtons = (dsl as any).actions || [];
            defaultLabel = existingButtons.length > 0 ? "Button" : "Submit";
          } else {
            defaultLabel = "Button";
          }
        } else if (componentType === "Input") {
          defaultLabel = "Input";
        }
        
        const parent = selectedElementId
          ? { type: "byId" as const, id: selectedElementId }
          : findParentContainer(dsl);

        if (!parent) {
          return [];
        }

        const newNode = createComponentNode(componentType, defaultLabel, dsl);
        return [{
          op: "addNode",
          parent,
          node: newNode,
        }];
      },
    },
    // Remove component
    {
      regex: /(?:usuń|remove|delete|usun)\s+(?:przycisk|button|input|pole|field|komponent|component|element)/i,
      handler: (): Patch[] => {
        if (!selectedElementId) {
          return [];
        }

        return [{
          op: "removeNode",
          target: { type: "byId" as const, id: selectedElementId },
        }];
      },
    },
    // Change variant
    {
      regex: /(?:zmień|change|set|ustaw)\s+(?:wariant|variant|styl|style)\s+(?:na|to|as)\s+["']?([^"'\s]+)["']?/i,
      handler: (match: RegExpMatchArray): Patch[] => {
        const variant = match[1];
        if (!selectedElementId) {
          return [];
        }

        return [{
          op: "toggleVariant",
          target: { type: "byId" as const, id: selectedElementId },
          variant: variant,
          value: variant,
        }];
      },
    },
    // Change property
    {
      regex: /(?:zmień|change|set|ustaw)\s+([a-z]+)\s+(?:na|to|as)\s+["']?([^"'\s]+)["']?/i,
      handler: (match: RegExpMatchArray): Patch[] => {
        const prop = match[1];
        const value = match[2];
        if (!selectedElementId) {
          return [];
        }

        return [{
          op: "setProp",
          target: { type: "byId" as const, id: selectedElementId },
          prop,
          value,
        }];
      },
    },
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const match = normalized.match(pattern.regex);
    if (match) {
      try {
        const patches = pattern.handler(match);
        if (patches.length > 0) {
          return {
            patches,
            confidence: 0.8,
          };
        }
      } catch (error) {
        return {
          patches: [],
          confidence: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  }

  // No pattern matched
  return {
    patches: [],
    confidence: 0,
    error: "Could not parse command - try: 'change title to X', 'add button with text Y', 'remove element', 'change variant to primary'",
  };
}

/**
 * Find first text node in DSL (for commands without selection)
 */
function findFirstTextNode(dsl: UiDsl): NodeRef | null {
  if (dsl.type === "form") {
    if (dsl.fields && dsl.fields.length > 0) {
      return { type: "byId", id: dsl.fields[0].id };
    }
    if (dsl.actions && dsl.actions.length > 0) {
      return { type: "byId", id: dsl.actions[0].id };
    }
  }
  // For other types, return root
  return { type: "byId", id: dsl.id };
}

/**
 * Determine text path (label, title, or text) for a node
 */
function determineTextPath(dsl: UiDsl, target: NodeRef): string | null {
  // This is a simplified version - in practice, we'd need to find the node and check its structure
  // For now, try common paths
  if (dsl.type === "form") {
    return "label"; // Form fields have labels
  }
  return "title"; // Default to title
}

/**
 * Find parent container for adding nodes
 */
function findParentContainer(dsl: UiDsl): NodeRef | null {
  // Return root DSL as parent
  return { type: "byId", id: dsl.id };
}

/**
 * Determine component type from command
 */
function determineComponentType(command: string): "Input" | "Button" {
  if (command.includes("button") || command.includes("przycisk")) {
    return "Button";
  }
  if (command.includes("input") || command.includes("pole") || command.includes("field")) {
    return "Input";
  }
  // Default to button
  return "Button";
}

/**
 * Create a new component node
 */
function createComponentNode(type: "Input" | "Button", label: string, dsl?: UiDsl): any {
  // Import generateId dynamically to avoid circular dependencies
  // For now, use a simple UUID-like generator
  function generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  if (type === "Button") {
    // For forms, create action structure
    if (dsl?.type === "form") {
      return {
        id: generateId(),
        type: "submit" as const,
        label,
        variant: "primary" as const,
      };
    } else {
      // For pages, create button component
      return {
        id: generateId(),
        type: "button",
        label,
        variant: "primary",
      };
    }
  } else {
    // For forms, create field structure
    if (dsl?.type === "form") {
      return {
        id: generateId(),
        name: label.toLowerCase().replace(/\s+/g, "_"),
        label,
        component: "Input" as const,
        placeholder: `Enter ${label}`,
      };
    } else {
      return {
        id: generateId(),
        name: label.toLowerCase().replace(/\s+/g, "_"),
        label,
        component: "Input",
        placeholder: `Enter ${label}`,
      };
    }
  }
}

