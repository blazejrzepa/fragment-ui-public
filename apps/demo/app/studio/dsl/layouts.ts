/**
 * Layout Operations for UI-DSL
 * 
 * Handles advanced layout operations: Stack, Grid, Two-column.
 * 
 * v1.1: Layout operations for conversational UI editing.
 */

import type { UiDsl } from './types';
import type { Patch } from './patch';
import { applyPatches } from './patch';

export type LayoutType = 'stack' | 'grid' | 'two-column';

export interface LayoutConfig {
  type: LayoutType;
  gap?: number;
  columns?: number;        // For grid
  colSpan?: number;        // For grid items
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Apply layout to a DSL node
 */
export function applyLayout(
  dsl: UiDsl,
  targetId: string,
  layout: LayoutConfig
): UiDsl {
  const patches: Patch[] = [];
  
  // Set layout type
  patches.push({
    op: 'setProp',
    target: { type: 'byId', id: targetId },
    prop: 'layout',
    value: {
      type: layout.type,
      gap: layout.gap || 16,
      columns: layout.columns,
      maxWidth: layout.maxWidth,
    },
  });
  
  // Apply patches
  return applyPatches(dsl, patches);
}

/**
 * Convert layout type to CSS classes
 */
export function layoutToClasses(layout: LayoutConfig): string {
  const classes: string[] = [];
  
  switch (layout.type) {
    case 'stack':
      classes.push('flex', 'flex-col');
      if (layout.gap) {
        classes.push(`gap-${layout.gap}`);
      }
      break;
      
    case 'grid':
      classes.push('grid');
      if (layout.columns) {
        classes.push(`grid-cols-${layout.columns}`);
      }
      if (layout.gap) {
        classes.push(`gap-${layout.gap}`);
      }
      break;
      
    case 'two-column':
      classes.push('grid', 'grid-cols-2');
      if (layout.gap) {
        classes.push(`gap-${layout.gap}`);
      }
      break;
  }
  
  if (layout.maxWidth) {
    classes.push(`max-w-${layout.maxWidth}`);
  }
  
  return classes.join(' ');
}

/**
 * Create Stack layout patches
 */
export function createStackLayout(
  targetId: string,
  gap: number = 16
): Patch[] {
  return [{
    op: 'setToken',
    target: { type: 'byId', id: targetId },
    token: 'space',
    value: gap,
  }, {
    op: 'setProp',
    target: { type: 'byId', id: targetId },
    prop: 'layout',
    value: {
      type: 'stack',
      gap,
    },
  }];
}

/**
 * Create Grid layout patches
 */
export function createGridLayout(
  targetId: string,
  columns: number = 2,
  gap: number = 16
): Patch[] {
  return [{
    op: 'setToken',
    target: { type: 'byId', id: targetId },
    token: 'space',
    value: gap,
  }, {
    op: 'setProp',
    target: { type: 'byId', id: targetId },
    prop: 'layout',
    value: {
      type: 'grid',
      columns,
      gap,
    },
  }];
}

/**
 * Create Two-column layout patches
 */
export function createTwoColumnLayout(
  targetId: string,
  gap: number = 16
): Patch[] {
  return [{
    op: 'setToken',
    target: { type: 'byId', id: targetId },
    token: 'space',
    value: gap,
  }, {
    op: 'setProp',
    target: { type: 'byId', id: targetId },
    prop: 'layout',
    value: {
      type: 'two-column',
      gap,
    },
  }];
}

