/**
 * Field generation utilities
 */

import type { UiForm } from "../types";
import type { GeneratorOptions } from "../generator";
import { getComponentName } from "./common";

/**
 * Generate form field JSX
 */
export function generateFormField(field: UiForm['fields'][0], options: GeneratorOptions): string {
  const componentName = getComponentName(field.component);
  const props: string[] = [];

  // Add type for Input
  if (field.component === 'Input' && field.validation?.includes('email')) {
    props.push('type="email"');
  } else if (field.component === 'Input') {
    props.push('type="text"');
  }

  // Add placeholder
  if (field.placeholder) {
    props.push(`placeholder="${field.placeholder}"`);
  }

  // Add options for Select
  if (field.component === 'Select' && field.options) {
    // Select will need options passed differently
    props.push(`options={${JSON.stringify(field.options)}}`);
  }

  // Add required
  if (field.required) {
    props.push('required');
  }

  const componentProps = props.length > 0 ? ` ${props.join(' ')}` : '';
  const description = field.description ? `\n            <p className="text-sm text-muted-foreground">${field.description}</p>` : '';

  return `<FormField${options.useFormEnhanced ? 'Enhanced' : ''} name="${field.name}" label="${field.label}" data-ui-id="${field.id}">
          <${componentName}${componentProps} data-ui-id="${field.id}-input" />
          ${description}
        </FormField${options.useFormEnhanced ? 'Enhanced' : ''}>`;
}

/**
 * Generate zod validation rule
 */
export function generateZodRule(field: UiForm['fields'][0]): string {
  if (field.component === 'Checkbox') {
    return 'z.boolean().refine((val) => val === true, { message: "This field is required" })';
  }

  // Start with z.string()
  let rule = 'z.string()';
  const validations: string[] = [];

  if (field.validation) {
    const validationParts = field.validation.split('|');
    
    for (const validation of validationParts) {
      if (validation === 'email') {
        validations.push('.email("Invalid email address")');
      } else if (validation.startsWith('min:')) {
        const min = validation.split(':')[1];
        validations.push(`.min(${min}, "Minimum ${min} characters required")`);
      } else if (validation.startsWith('max:')) {
        const max = validation.split(':')[1];
        validations.push(`.max(${max}, "Maximum ${max} characters allowed")`);
      } else if (validation === 'required') {
        validations.push('.min(1, "This field is required")');
      }
    }
  }

  return rule + validations.join('');
}

