/**
 * Patch Intent Parser
 * 
 * Parses natural language instructions into Patch operations
 * Supports all patch operations: setProp, addNode, removeNode, moveNode, wrapWith, etc.
 */

import type { Patch, PatchOp } from "@fragment_ui/ui-dsl";
import type { UiPage, UiNode, Diagnostic } from "@fragment_ui/ui-dsl";
import { findNodeById } from "../dsl-patch";
import { validatePatch } from "@fragment_ui/ui-dsl";

export interface ParsedPatch {
  patches: Patch[];
  confidence: number;
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string }>;
}

/**
 * Parse natural language to patch operations
 */
export function parsePatchIntent(
  message: string,
  dsl: UiPage,
  targetId?: string
): ParsedPatch {
  const lowerMessage = message.toLowerCase().trim();
  const originalMessage = message.trim(); // Keep original for extracting quoted strings
  const patches: Patch[] = [];
  const diagnostics: ParsedPatch["diagnostics"] = [];
  let confidence = 0.7;

  // Helper to find node by kebab-case ID or data-ui-id
  function findNodeByKebabId(dsl: UiPage, kebabId: string): UiNode | null {
    function search(nodes: UiNode[]): UiNode | null {
      for (const node of nodes) {
        // Check if node.id matches (UUID) or dataUiId matches (kebab-case)
        if (node.id === kebabId || node.dataUiId === kebabId) {
          return node;
        }
        // Check if kebab-case ID matches the end of UUID (for partial matches)
        if (node.id.endsWith(kebabId) || node.dataUiId === kebabId) {
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
    return search(dsl.children || []);
  }

  // Try to find target node
  let effectiveTargetId = targetId;
  if (!effectiveTargetId) {
    // Try to extract from message
    const idMatch = lowerMessage.match(/(?:button|section|component|element|node)[\s-]?([a-z0-9-]+)/i) ||
                   lowerMessage.match(/#([a-z0-9-]+)/i) ||
                   lowerMessage.match(/data-ui-id="([^"]+)"/i);
    const extractedId = idMatch ? idMatch[1] : undefined;
    
    // If we extracted a kebab-case ID, find the actual UUID from DSL
    if (extractedId) {
      const foundNode = findNodeByKebabId(dsl, extractedId);
      if (foundNode) {
        effectiveTargetId = foundNode.id; // Use actual UUID
      } else {
        effectiveTargetId = extractedId; // Fallback to extracted ID
      }
    }
  }
  
  // If still no target ID, try to find first component in DSL
  if (!effectiveTargetId && dsl.children && dsl.children.length > 0) {
    // Find first component node
    function findFirstComponent(nodes: UiNode[]): string | undefined {
      for (const node of nodes) {
        if (node.type === "component") {
          return node.id; // Return actual UUID
        }
        if ("children" in node && Array.isArray(node.children)) {
          const found = findFirstComponent(node.children);
          if (found) return found;
        }
      }
      return undefined;
    }
    effectiveTargetId = findFirstComponent(dsl.children);
  }

  // If we have a target ID, verify it exists
  if (effectiveTargetId) {
    const targetNode = findNodeById(dsl, effectiveTargetId);
    if (!targetNode) {
      diagnostics.push({
        level: "warning",
        message: `Target node "${effectiveTargetId}" not found in DSL`,
      });
      // Try to find by data-ui-id or partial match
      const foundByDataUiId = findNodeByKebabId(dsl, effectiveTargetId);
      if (foundByDataUiId) {
        effectiveTargetId = foundByDataUiId.id; // Use actual UUID
      }
    }
  }

  // Parse different patch operations

  // 1. setCopy - change text content (check this FIRST before setProp)
  if (matchesPattern(lowerMessage, [
    /change\s+text\s+to\s+["']([^"']+)["']/i,
    /set\s+text\s+to\s+["']([^"']+)["']/i,
    /change\s+label\s+to\s+["']([^"']+)["']/i,
    /zmień\s+tekst\s+na\s+["']([^"']+)["']/i,
  ])) {
    // Use original message to preserve case in quoted strings
    const textMatch = originalMessage.match(/(?:change|set)\s+(?:text|label)\s+to\s+["']([^"']+)["']/i);
    if (textMatch && effectiveTargetId) {
      patches.push({
        targetId: effectiveTargetId,
        op: "setCopy",
        args: {
          value: textMatch[1], // Preserve original case
        },
      });
      confidence = 0.9;
    }
  }
  // 2. setProp - change property value (after setCopy check)
  else if (matchesPattern(lowerMessage, [
    /change\s+(\w+)\s+to\s+["']?([^"'\s]+)["']?/i,
    /set\s+(\w+)\s+(?:to|as|=)\s+["']?([^"'\s]+)["']?/i,
    /make\s+(\w+)\s+["']?([^"'\s]+)["']?/i,
    /zmień\s+(\w+)\s+na\s+["']?([^"'\s]+)["']?/i,
    /ustaw\s+(\w+)\s+na\s+["']?([^"'\s]+)["']?/i,
  ])) {
    const propMatch = lowerMessage.match(/(?:change|set|make|zmień|ustaw)\s+(\w+)\s+(?:to|as|=|na)\s+["']?([^"'\s]+)["']?/i);
    if (propMatch && effectiveTargetId) {
      const propName = propMatch[1];
      let propValue: any = propMatch[2];
      
      // Convert string values to appropriate types
      if (propValue === "true" || propValue === "false") {
        propValue = propValue === "true";
      } else if (!isNaN(Number(propValue)) && propValue !== "") {
        propValue = Number(propValue);
      }
      
      patches.push({
        targetId: effectiveTargetId,
        op: "setProp",
        args: {
          path: `props.${propName}`,
          value: propValue,
        },
      });
      confidence = 0.85;
    }
  }

  // 3. removeNode - remove component
  if (matchesPattern(lowerMessage, [
    /remove\s+(?:the\s+)?(?:button|component|section|element)/i,
    /delete\s+(?:the\s+)?(?:button|component|section|element)/i,
    /usuń\s+(?:przycisk|komponent|sekcję|element)/i,
  ])) {
    if (effectiveTargetId) {
      patches.push({
        targetId: effectiveTargetId,
        op: "removeNode",
        args: {},
      });
      confidence = 0.9;
    } else {
      diagnostics.push({
        level: "error",
        message: "Cannot remove node: target ID not specified",
      });
    }
  }

  // 4. addNode - add new component
  if (matchesPattern(lowerMessage, [
    /add\s+(?:a\s+)?(?:button|component|section|element)/i,
    /insert\s+(?:a\s+)?(?:button|component|section|element)/i,
    /dodaj\s+(?:przycisk|komponent|sekcję|element)/i,
  ])) {
    const componentMatch = lowerMessage.match(/add\s+(?:a\s+)?(\w+)/i) ||
                          lowerMessage.match(/insert\s+(?:a\s+)?(\w+)/i) ||
                          lowerMessage.match(/dodaj\s+(\w+)/i);
    
    if (componentMatch) {
      const componentName = capitalizeFirst(componentMatch[1]);
      const parentId = effectiveTargetId || dsl.id;
      
      patches.push({
        targetId: parentId,
        op: "addNode",
        args: {
          node: {
            type: "component",
            id: generateId(),
            component: componentName,
            props: {},
          },
          position: "end", // Default to end
        },
      });
      confidence = 0.8;
    }
  }

  // 5. toggleVariant - change variant
  if (matchesPattern(lowerMessage, [
    /change\s+variant\s+to\s+["']?([^"'\s]+)["']?/i,
    /set\s+variant\s+to\s+["']?([^"'\s]+)["']?/i,
    /make\s+it\s+["']?([^"'\s]+)["']?/i,
  ])) {
    const variantMatch = lowerMessage.match(/(?:change|set)\s+variant\s+to\s+["']?([^"'\s]+)["']?/i) ||
                        lowerMessage.match(/make\s+it\s+["']?([^"'\s]+)["']?/i);
    if (variantMatch && effectiveTargetId) {
      patches.push({
        targetId: effectiveTargetId,
        op: "toggleVariant",
        args: {
          variant: variantMatch[1],
        },
      });
      confidence = 0.85;
    }
  }

  // 6. moveNode - move component
  if (matchesPattern(lowerMessage, [
    /move\s+(?:the\s+)?(?:button|component|section)\s+(?:to|before|after)/i,
    /przenieś\s+(?:przycisk|komponent|sekcję)\s+(?:do|przed|po)/i,
  ])) {
    const moveMatch = lowerMessage.match(/move\s+(?:the\s+)?\w+\s+(?:to|before|after)\s+["']?([^"'\s]+)["']?/i);
    if (moveMatch && effectiveTargetId) {
      const targetPositionId = moveMatch[1];
      patches.push({
        targetId: effectiveTargetId,
        op: "moveNode",
        args: {
          newParentId: targetPositionId,
          position: lowerMessage.includes("before") ? "before" : lowerMessage.includes("after") ? "after" : "end",
        },
      });
      confidence = 0.75;
    }
  }

  // 7. wrapWith - wrap component
  if (matchesPattern(lowerMessage, [
    /wrap\s+(?:the\s+)?(?:button|component)\s+with\s+["']?([^"'\s]+)["']?/i,
    /opakuj\s+(?:przycisk|komponent)\s+w\s+["']?([^"'\s]+)["']?/i,
  ])) {
    const wrapMatch = lowerMessage.match(/wrap\s+(?:the\s+)?\w+\s+with\s+["']?([^"'\s]+)["']?/i) ||
                     lowerMessage.match(/opakuj\s+\w+\s+w\s+["']?([^"'\s]+)["']?/i);
    if (wrapMatch && effectiveTargetId) {
      const wrapperComponent = capitalizeFirst(wrapMatch[1]);
      patches.push({
        targetId: effectiveTargetId,
        op: "wrapWith",
        args: {
          wrapper: {
            type: "component",
            id: generateId(),
            component: wrapperComponent,
            props: {},
          },
        },
      });
      confidence = 0.8;
    }
  }

  // If no patches were generated, try to infer from context
  if (patches.length === 0 && effectiveTargetId) {
    // Generic property change
    const genericPropMatch = lowerMessage.match(/(\w+)\s+(?:is|should be|ma być)\s+["']?([^"'\s]+)["']?/i);
    if (genericPropMatch) {
      const propName = genericPropMatch[1];
      let propValue: any = genericPropMatch[2];
      
      if (propValue === "true" || propValue === "false") {
        propValue = propValue === "true";
      } else if (!isNaN(Number(propValue)) && propValue !== "") {
        propValue = Number(propValue);
      }
      
      patches.push({
        targetId: effectiveTargetId,
        op: "setProp",
        args: {
          path: `props.${propName}`,
          value: propValue,
        },
      });
      confidence = 0.6;
    }
  }

  // Validate patches
  const validatedPatches: Patch[] = [];
  for (const patch of patches) {
    const validation = validatePatch(patch);
    if (validation.valid) {
      validatedPatches.push(patch);
    } else {
      diagnostics.push(...validation.diagnostics);
      // Still add patch but with warning
      validatedPatches.push(patch);
      diagnostics.push({
        level: "warning",
        message: `Patch validation failed for ${patch.op}, but will attempt to apply`,
      });
    }
  }

  return {
    patches: validatedPatches,
    confidence,
    diagnostics,
  };
}

/**
 * Helper: Check if message matches any pattern
 */
function matchesPattern(message: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(message));
}

/**
 * Helper: Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Helper: Generate UUID
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Helper: Find node by partial ID match
 */
function findNodeByPartialId(dsl: UiPage, partialId: string): string | undefined {
  function search(nodes: UiNode[]): string | undefined {
    for (const node of nodes) {
      if (node.id.includes(partialId) || partialId.includes(node.id)) {
        return node.id;
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
    return undefined;
  }
  
  return search(dsl.children);
}

