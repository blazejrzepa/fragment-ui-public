/**
 * Common utility functions for generators
 */

import { generateId as generateIdFromTypes } from "../types";

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Get component name from DSL component type
 */
export function getComponentName(component: any): string {
  const mapping: Record<string, string> = {
    'Input': 'Input',
    'PasswordInput': 'Input', // Use Input with type="password"
    'Checkbox': 'Checkbox',
    'Select': 'Select',
    'Switch': 'Switch',
    'Textarea': 'Textarea',
  };

  if (typeof component === 'string') {
    return mapping[component] || component;
  }
  if (component && typeof component === 'object' && 'component' in component) {
    const comp = component.component as string;
    return mapping[comp] || comp;
  }
  return 'Input'; // Default
}

/**
 * Re-export generateId from types
 */
export { generateIdFromTypes as generateId };

