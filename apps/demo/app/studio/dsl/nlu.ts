/**
 * Natural Language Understanding (NLU) for UI-DSL
 * 
 * Interprets user utterances into sequences of patches.
 * Maps natural language commands to atomic patch operations.
 * 
 * v1.1: NLU engine for conversational UI editing.
 */

import type { UiDsl } from './types';
import type { Patch, NodeRef } from './patch';
import { findNode } from './patch';
import { generateId } from './types';

// Re-export findNodesByQuery if it exists, otherwise create a simple version
function findNodesByQuery(dsl: UiDsl, query: { byText?: string; byRole?: string; byProp?: [string, any] }): NodeRef[] {
  const results: NodeRef[] = [];
  
  function searchNode(node: any, path: string = ''): void {
    if (!node || typeof node !== "object") return;
    
    // Search by text
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
    
    // Search by role
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
    
    // Recursively search children
    if (Array.isArray(node.fields)) {
      node.fields.forEach((field: any) => searchNode(field, `${path}.fields`));
    }
    if (Array.isArray(node.actions)) {
      node.actions.forEach((action: any) => searchNode(action, `${path}.actions`));
    }
    if (Array.isArray(node.sections)) {
      node.sections.forEach((section: any) => searchNode(section, `${path}.sections`));
    }
  }
  
  searchNode(dsl);
  return results;
}

export interface Intent {
  type: string;
  confidence: number;
  patches: Patch[];
  targetRef?: NodeRef;
  metadata?: Record<string, any>;
}

/**
 * Parse user utterance into intent and patches
 */
export function parseIntent(
  utterance: string,
  currentDsl: UiDsl,
  selection?: NodeRef
): Intent {
  const lowerUtterance = utterance.toLowerCase().trim();
  
  // Use selection if provided, otherwise try to infer target
  const targetRef = selection || inferTarget(utterance, currentDsl);
  
  // Try different intent patterns
  const intents = [
    parseSetCopyIntent(lowerUtterance, currentDsl, targetRef),
    parseAddNodeIntent(lowerUtterance, currentDsl, targetRef),
    parseRemoveNodeIntent(lowerUtterance, currentDsl, targetRef),
    parseMoveNodeIntent(lowerUtterance, currentDsl, targetRef),
    parseSetPropIntent(lowerUtterance, currentDsl, targetRef),
    parseToggleVariantIntent(lowerUtterance, currentDsl, targetRef),
    parseReorderIntent(lowerUtterance, currentDsl, targetRef),
    parseRenameFieldIntent(lowerUtterance, currentDsl, targetRef),
    parseLayoutIntent(lowerUtterance, currentDsl, targetRef),
  ];
  
  // Return highest confidence intent
  const bestIntent = intents.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );
  
  return bestIntent;
}

/**
 * Infer target node from utterance
 */
function inferTarget(utterance: string, dsl: UiDsl): NodeRef | undefined {
  const lower = utterance.toLowerCase();
  
  // Try to find by text content
  if (lower.includes('email') || lower.includes('password') || lower.includes('name')) {
    const results = findNodesByQuery(dsl, { byText: lower.match(/\b(email|password|name)\b/i)?.[0] || '' });
    if (results.length > 0) {
      return results[0];
    }
  }
  
  // Try to find by role/component type
  const componentTypes = ['button', 'input', 'field', 'form', 'section'];
  for (const type of componentTypes) {
    if (lower.includes(type)) {
      const results = findNodesByQuery(dsl, { byRole: type });
      if (results.length > 0) {
        return results[0];
      }
    }
  }
  
  // Default to root
  return { type: "byId", id: dsl.id };
}

/**
 * Parse "set copy" intent (change text/label/placeholder)
 */
function parseSetCopyIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:change|set|update|make)\s+(?:the\s+)?(?:label|text|title|placeholder)\s+(?:of\s+)?(?:the\s+)?(.+?)\s+(?:to|as)\s+["'](.+?)["']/i,
    /(?:change|set|update)\s+(.+?)\s+(?:label|text|title|placeholder)\s+(?:to|as)\s+["'](.+?)["']/i,
    /(?:rename|call)\s+(.+?)\s+(?:to|as)\s+["'](.+?)["']/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, newValue] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      
      if (ref) {
        // Determine path based on context
        const path = utterance.includes('label') ? 'label' :
                    utterance.includes('title') ? 'title' :
                    utterance.includes('placeholder') ? 'placeholder' :
                    'label'; // default
        
        return {
          type: 'setCopy',
          confidence: 0.8,
          patches: [{
            op: 'setCopy',
            target: ref,
            path,
            value: newValue,
          }],
          targetRef: ref,
        };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "add node" intent
 */
function parseAddNodeIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:add|insert|create|new)\s+(?:a\s+)?(?:new\s+)?(.+?)(?:\s+field|\s+button|\s+section)?/i,
    /(?:add|insert)\s+(?:a\s+)?(.+?)\s+(?:to|in|into)\s+(?:the\s+)?(.+?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, componentType, parentDesc] = match;
      const parentRef = parentDesc ? inferTarget(parentDesc, dsl) : targetRef || { type: "byId", id: dsl.id };
      
      if (parentRef) {
        // Infer node structure from component type
        const node = inferNodeFromType(componentType);
        
        if (node) {
          return {
            type: 'addNode',
            confidence: 0.7,
            patches: [{
              op: 'addNode',
              parent: parentRef,
              node,
            }],
            targetRef: parentRef,
          };
        }
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "remove node" intent
 */
function parseRemoveNodeIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:remove|delete|drop)\s+(?:the\s+)?(.+?)(?:\s+field|\s+button|\s+section)?/i,
    /(?:remove|delete)\s+(.+?)\s+(?:from|in)\s+(?:the\s+)?(.+?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      
      if (ref) {
        return {
          type: 'removeNode',
          confidence: 0.8,
          patches: [{
            op: 'removeNode',
            target: ref,
          }],
          targetRef: ref,
        };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "move node" intent
 */
function parseMoveNodeIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:move|drag)\s+(?:the\s+)?(.+?)\s+(?:to|into|before|after)\s+(?:the\s+)?(.+?)/i,
    /(?:move|reorder)\s+(.+?)\s+(?:to|at)\s+(?:position|index)\s+(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, destinationDesc] = match;
      const target = targetRef || inferTarget(targetDesc, dsl);
      const toParent = inferTarget(destinationDesc, dsl) || { type: "byId", id: dsl.id };
      
      if (target && toParent) {
        return {
          type: 'moveNode',
          confidence: 0.7,
          patches: [{
            op: 'moveNode',
            target,
            toParent,
          }],
          targetRef: target,
        };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "set prop" intent
 */
function parseSetPropIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:set|change|make)\s+(?:the\s+)?(.+?)\s+(?:to|as)\s+["']?(.+?)["']?/i,
    /(?:set|change)\s+(.+?)\s+(?:property|prop)\s+(?:to|as)\s+["']?(.+?)["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, value] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      
      if (ref) {
        // Try to infer property name from context
        const prop = utterance.includes('variant') ? 'variant' :
                    utterance.includes('type') ? 'type' :
                    utterance.includes('required') ? 'required' :
                    'value'; // default
        
        return {
          type: 'setProp',
          confidence: 0.6,
          patches: [{
            op: 'setProp',
            target: ref,
            prop,
            value,
          }],
          targetRef: ref,
        };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "toggle variant" intent
 */
function parseToggleVariantIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:change|set|make)\s+(?:the\s+)?(.+?)\s+(?:to\s+)?(?:variant\s+)?(primary|secondary|ghost|outline|solid)/i,
    /(?:use|apply)\s+(primary|secondary|ghost|outline|solid)\s+(?:variant\s+)?(?:for|on)\s+(?:the\s+)?(.+?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, variant] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      
      if (ref) {
        return {
          type: 'toggleVariant',
          confidence: 0.8,
          patches: [{
            op: 'toggleVariant',
            target: ref,
            variant: 'variant',
            value: variant,
          }],
          targetRef: ref,
        };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "reorder" intent
 */
function parseReorderIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:move|reorder|swap)\s+(?:the\s+)?(.+?)\s+(?:to|at)\s+(?:position|index)\s+(\d+)/i,
    /(?:move|reorder)\s+(?:the\s+)?(.+?)\s+(?:before|after)\s+(?:the\s+)?(.+?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, positionOrTarget] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      const parentRef = ref ? findParentRef(dsl, ref) : undefined;
      
      if (ref && parentRef) {
        // Try to parse position
        const position = parseInt(positionOrTarget, 10);
        if (!isNaN(position)) {
          // Find current index
          const currentIndex = findNodeIndex(dsl, parentRef, ref);
          if (currentIndex !== -1) {
            return {
              type: 'reorder',
              confidence: 0.7,
              patches: [{
                op: 'reorder',
                parent: parentRef,
                from: currentIndex,
                to: position - 1, // Convert to 0-based
              }],
              targetRef: ref,
            };
          }
        }
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse "rename field" intent
 */
function parseRenameFieldIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const patterns = [
    /(?:rename|change\s+name)\s+(?:the\s+)?(.+?)\s+(?:field\s+)?(?:to|as)\s+["']?(.+?)["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match) {
      const [, targetDesc, newName] = match;
      const ref = targetRef || inferTarget(targetDesc, dsl);
      
      if (ref) {
        const node = findNode(dsl, ref);
        if (node && node.name) {
          return {
            type: 'renameField',
            confidence: 0.8,
            patches: [{
              op: 'renameField',
              target: ref,
              from: node.name,
              to: newName,
            }],
            targetRef: ref,
          };
        }
      }
    }
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Parse layout intent (Stack, Grid, Two-column)
 */
function parseLayoutIntent(
  utterance: string,
  dsl: UiDsl,
  targetRef?: NodeRef
): Intent {
  const lower = utterance.toLowerCase();
  
  // Check for layout type mentions
  if (lower.includes('stack') || lower.includes('vertical')) {
    const ref = targetRef || { type: "byId", id: dsl.id };
    return {
      type: 'setLayout',
      confidence: 0.7,
      patches: [{
        op: 'setToken',
        target: ref,
        token: 'space',
        value: 16, // default gap
      }],
      targetRef: ref,
      metadata: { layoutType: 'stack' },
    };
  }
  
  if (lower.includes('grid') || lower.includes('columns')) {
    const ref = targetRef || { type: "byId", id: dsl.id };
    const columnsMatch = lower.match(/(\d+)\s*(?:column|col)/);
    const columns = columnsMatch ? parseInt(columnsMatch[1], 10) : 2;
    
    return {
      type: 'setLayout',
      confidence: 0.7,
      patches: [{
        op: 'setToken',
        target: ref,
        token: 'space',
        value: 16,
      }],
      targetRef: ref,
      metadata: { layoutType: 'grid', columns },
    };
  }
  
  if (lower.includes('two-column') || lower.includes('two column') || lower.includes('side by side')) {
    const ref = targetRef || { type: "byId", id: dsl.id };
    return {
      type: 'setLayout',
      confidence: 0.8,
      patches: [{
        op: 'setToken',
        target: ref,
        token: 'space',
        value: 16,
      }],
      targetRef: ref,
      metadata: { layoutType: 'two-column' },
    };
  }
  
  return { type: 'unknown', confidence: 0, patches: [] };
}

/**
 * Infer node structure from component type string
 */
function inferNodeFromType(typeString: string): any | null {
  const lower = typeString.toLowerCase();
  
  if (lower.includes('email') || lower.includes('input')) {
    return {
      id: generateId(),
      name: 'email',
      label: 'Email',
      component: 'Input',
      validation: 'email|required',
    };
  }
  
  if (lower.includes('password')) {
    return {
      id: generateId(),
      name: 'password',
      label: 'Password',
      component: 'PasswordInput',
      validation: 'required',
    };
  }
  
  if (lower.includes('button') || lower.includes('submit')) {
    return {
      id: generateId(),
      type: 'submit',
      label: 'Submit',
      variant: 'primary',
    };
  }
  
  if (lower.includes('section') || lower.includes('card')) {
    return {
      id: generateId(),
      kind: 'card',
      title: 'New Section',
      content: [],
    };
  }
  
  return null;
}

/**
 * Find parent reference for a node
 */
function findParentRef(dsl: UiDsl, ref: NodeRef): NodeRef | undefined {
  // This is a simplified version - full implementation would traverse the tree
  // For now, return root as parent
  return { type: "byId", id: dsl.id };
}

/**
 * Find index of a node in its parent's children array
 */
function findNodeIndex(dsl: UiDsl, parentRef: NodeRef, targetRef: NodeRef): number {
  const parent = findNode(dsl, parentRef);
  const target = findNode(dsl, targetRef);
  
  if (!parent || !target) return -1;
  
  // Search in appropriate array
  if (parent.fields) {
    return parent.fields.findIndex((f: any) => f.id === target.id);
  }
  if (parent.actions) {
    return parent.actions.findIndex((a: any) => a.id === target.id);
  }
  if (parent.sections) {
    return parent.sections.findIndex((s: any) => s.id === target.id);
  }
  
  return -1;
}

