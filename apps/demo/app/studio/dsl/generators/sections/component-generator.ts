/**
 * Simple component JSX generator
 */

import type { UiCommon, ActionContract } from "../../types";
import { generateTSX } from "../../generator-core";
import { createDefaultActionContract, actionAclAttrs } from "../../utils/action-generator";

/**
 * Generate JSX for a simple component (button, input, etc.)
 */
export function generateSimpleComponentJSX(component: any, dsl?: UiCommon): string {
  const props: string[] = [];
  const styleProps: string[] = [];
  const componentId = component.id || 'component';
  
  // Add data-ui-id
  props.push(`data-ui-id="${componentId}"`);
  
  // Handle layout tokens (spacing, radius) if present
  if (component.layout) {
    if (component.layout.radius !== undefined) {
      styleProps.push(`borderRadius: "${component.layout.radius}px"`);
    }
  }
  
  // Handle button component
  if (component.type === 'button' || component.component === 'Button') {
    if (component.variant) {
      props.push(`variant="${component.variant}"`);
    }
    if (component.size) {
      props.push(`size="${component.size}"`);
    }
    if (component.disabled) {
      props.push('disabled');
    }
    if (component.type === 'submit') {
      props.push('type="submit"');
    }
    
    // Auto-generate Action Contract for buttons if missing
    let actionContract: ActionContract | undefined;
    if (dsl) {
      if (!dsl.actions) {
        dsl.actions = [];
      }
      
      actionContract = dsl.actions.find(ac => ac.id === componentId);
      
      if (!actionContract) {
        const formAction = {
          id: componentId,
          type: component.type === 'submit' ? 'submit' as const : 'button' as const,
          label: component.label || component.text || 'Button',
          variant: component.variant || 'primary' as const,
        };
        actionContract = createDefaultActionContract(formAction as any);
        dsl.actions.push(actionContract);
      }
      
      if (actionContract) {
        const aclAttrs = actionAclAttrs(actionContract);
        props.push(...aclAttrs);
      }
    }
    
    if (styleProps.length > 0) {
      props.push(`style={{${styleProps.join(', ')}}}`);
    }
    
    const label = component.label || component.text || '';
    return `<Button ${props.join(' ')}>${label}</Button>`;
  }
  
  // Handle input component
  if (component.component === 'Input' || component.type === 'input') {
    if (component.type === 'email') {
      props.push('type="email"');
    } else {
      props.push('type="text"');
    }
    if (component.placeholder) {
      props.push(`placeholder="${component.placeholder}"`);
    }
    if (component.required) {
      props.push('required');
    }
    if (component.disabled) {
      props.push('disabled');
    }
    
    return `<Input ${props.join(' ')} />`;
  }
  
  // Fallback: try to generate as generic component
  // Map common component names to React components
  const rawComponentName = component.component || component.type || 'div';
  const componentNameMap: Record<string, string> = {
    'navigation': 'nav', // HTML5 semantic tag
    'card': 'Card', // React component
    'button': 'Button',
    'input': 'Input',
    'form': 'form', // HTML5 semantic tag
    'section': 'section', // HTML5 semantic tag
    'header': 'header', // HTML5 semantic tag
    'footer': 'footer', // HTML5 semantic tag
    'main': 'main', // HTML5 semantic tag
    'aside': 'aside', // HTML5 semantic tag
    'grid': 'div', // grid is not a valid HTML tag, use div
  };
  
  // Use mapped name if available, otherwise use raw name
  // If it's a lowercase HTML tag, use it as-is
  // If it starts with uppercase, assume it's a React component
  let componentName = componentNameMap[rawComponentName.toLowerCase()] || rawComponentName;
  
  // If component name is lowercase and not in map, it's likely an HTML tag - use as-is
  // If it's uppercase or PascalCase, it's a React component
  if (rawComponentName === rawComponentName.toLowerCase() && !componentNameMap[rawComponentName.toLowerCase()]) {
    // It's a lowercase HTML tag, use as-is
    componentName = rawComponentName;
  }
  
  const children = component.label || component.text || '';
  
  return `<${componentName} ${props.join(' ')}>${children}</${componentName}>`;
}

