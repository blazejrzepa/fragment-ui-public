/**
 * Form generator - generates React form components from UI-DSL
 */

import type { UiForm, UiCommon } from "../types";
import type { GeneratorOptions } from "../generator";
import { toPascalCase, getComponentName } from "../utils/common";
import { generateFormField, generateZodRule } from "../utils/field-generator";
import { generateAction, createDefaultActionContract } from "../utils/action-generator";
import { generateReviewStep } from "../utils/form-helpers";

/**
 * Generate form component
 */
export function generateForm(dsl: UiForm, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  const zodFields: string[] = [];
  const formFields: string[] = [];
  const actions: string[] = [];

  // Collect imports
  if (options.useFormEnhanced) {
    importsFromUI.push('FormEnhanced', 'FormFieldEnhanced');
  } else {
    importsFromUI.push('Form', 'FormField');
  }

  // Process fields
  for (const field of dsl.fields) {
    // Component import
    const componentName = getComponentName(field.component);
    if (!importsFromUI.includes(componentName)) {
      importsFromUI.push(componentName);
    }

    // Zod validation
    if (options.includeValidation) {
      const zodRule = generateZodRule(field);
      zodFields.push(`  ${field.name}: ${zodRule},`);
    }

    // Form field JSX
    const fieldJSX = generateFormField(field, options);
    formFields.push(fieldJSX);
  }

  // Process actions
  let hasHardOrHighRiskAction = false;
  if (dsl.actions) {
    // Ensure we have Action Contracts for all actions
    const commonDsl = dsl as UiCommon;
    if (!commonDsl.actions) {
      commonDsl.actions = [];
    }
    
    for (const action of dsl.actions) {
      if (!importsFromUI.includes('Button')) {
        importsFromUI.push('Button');
      }
      // Find matching ActionContract if available, or create one automatically
      let actionContract = commonDsl.actions?.find(ac => ac.id === action.id);
      
      // Auto-generate Action Contract if missing
      if (!actionContract) {
        actionContract = createDefaultActionContract(action);
        if (!commonDsl.actions) {
          commonDsl.actions = [];
        }
        commonDsl.actions.push(actionContract);
      }
      
      // Check if this is a hard or high risk action (requires review step)
      if (actionContract.kind === 'hard' || actionContract.riskLevel === 'high') {
        hasHardOrHighRiskAction = true;
      }
      
      const actionJSX = generateAction(action, actionContract);
      actions.push(actionJSX);
    }
  }
  
  // Generate review step for hard/high risk actions
  const reviewStep = hasHardOrHighRiskAction ? generateReviewStep(dsl, options) : '';

  // Build imports
  if (options.includeImports) {
    imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    imports.push('import * as React from "react";');
    // Note: zod import is added in zodSchema if includeValidation is true
  }

  // Build component
  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedForm';

  const layoutClass = dsl.layout?.maxWidth 
    ? `max-w-${dsl.layout.maxWidth}` 
    : 'max-w-md';

  // Note: FormEnhanced uses its own validation (validateValue from form-validation)
  // Zod schema is optional and only for type safety/documentation
  // Since zod requires import map and may cause issues, we skip it for now
  // FormEnhanced will handle validation internally
  const zodSchema = ''; // Disabled for now - FormEnhanced doesn't need it

  // FormEnhanced doesn't need a hook - it manages state internally
  const onSubmit = dsl.onSubmit || '((data) => console.log(data))';

  // Add ACL attributes for form (intent)
  const formAclAttrs: string[] = [];
  const commonDsl = dsl as UiCommon;
  if (commonDsl.intent?.primary) {
    formAclAttrs.push(`data-intent="${commonDsl.intent.primary}"`);
  } else {
    // Auto-generate intent for forms
    formAclAttrs.push('data-intent="collect-input"');
  }
  const formAclAttrsStr = formAclAttrs.length > 0 ? ` ${formAclAttrs.join(' ')}` : '';

  return `${imports.join('\n')}${zodSchema}
export default function ${componentName}() {
  return (
    <div className="${layoutClass} mx-auto p-6" data-ui-id="${dsl.id}"${formAclAttrsStr}>
      ${dsl.title ? `<h1 className="text-2xl font-bold mb-6" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
      ${dsl.description ? `<p className="text-[color:var(--color-fg-muted)] mb-6" data-ui-id="${dsl.id}-description">${dsl.description}</p>` : ''}
      <${options.useFormEnhanced ? 'FormEnhanced' : 'Form'} onSubmit={${onSubmit}} data-ui-id="${dsl.id}-form">
${formFields.map(f => `        ${f}`).join('\n')}
${reviewStep}
${actions.length > 0 ? `\n        <div className="flex gap-2 mt-4" data-ui-id="${dsl.id}-actions">\n${actions.map(a => `          ${a}`).join('\n')}\n        </div>` : ''}
      </${options.useFormEnhanced ? 'FormEnhanced' : 'Form'}>
    </div>
  );
}
`;
}

