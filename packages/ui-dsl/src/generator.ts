/**
 * Generator: UI-DSL → React Code
 * 
 * Converts UI-DSL specification into React/Next.js component code
 * Uses Fragment UI components and design tokens
 */

import type { UIDSL, Field, Action, ValidationRule } from "./types";
import registry from "@fragment_ui/registry/registry.json";

/**
 * Generate React component code from UI-DSL
 * 
 * This is the main entry point for code generation. It orchestrates
 * the generation of imports, component structure, and JSX.
 * 
 * @param dsl - UI-DSL specification to convert to React code
 * @returns Complete React component code as a string
 */
export function generateCodeFromUIDSL(dsl: UIDSL): string {
  const imports = generateImports(dsl);
  const componentName = dsl.type === "form" ? "GeneratedForm" : 
                        dsl.type === "screen" ? "GeneratedScreen" : 
                        "GeneratedApp";
  
  const componentCode = generateComponentCode(dsl, componentName);
  
  return `${imports}

${componentCode}
`;
}

/**
 * Generate imports based on used components
 */
function generateImports(dsl: UIDSL): string {
  const imports = new Set<string>();
  
  // Always import FormField
  imports.add("FormField");
  
  // Import components based on fields
  if (dsl.fields) {
    dsl.fields.forEach(field => {
      imports.add(field.component);
      // Select needs additional components
      if (field.component === "Select") {
        imports.add("SelectTrigger");
        imports.add("SelectValue");
        imports.add("SelectContent");
        imports.add("SelectItem");
      }
    });
  }
  
  // Import actions (Button)
  if (dsl.actions && dsl.actions.length > 0) {
    imports.add("Button");
  }
  
  // Import scaffold components
  if (dsl.scaffold === "form-auth") {
    imports.add("Card");
    imports.add("CardHeader");
    imports.add("CardTitle");
    imports.add("CardDescription");
    imports.add("CardContent");
  }
  
  // Import validation functions (they're exported from @fragment_ui/ui)
  imports.add("validateValue");
  imports.add("ValidationRules");
  
  // Import React hooks
  const importsList = Array.from(imports).sort();
  
  return `import { useState } from "react";
import { ${importsList.join(", ")} } from "@fragment_ui/ui";`;
}

/**
 * Generate complete component code structure
 * 
 * Creates a functional React component with:
 * - State management (formData, errors)
 * - Validation rules
 * - Event handlers (handleSubmit, handleChange)
 * - JSX structure with fields and actions
 * 
 * @param dsl - UI-DSL specification
 * @param componentName - Name of the generated component
 * @returns Complete component code
 */
function generateComponentCode(dsl: UIDSL, componentName: string): string {
  const stateCode = generateStateCode(dsl);
  const validationCode = generateValidationCode(dsl);
  const fieldsCode = generateFieldsCode(dsl);
  const actionsCode = generateActionsCode(dsl);
  const scaffoldWrapper = generateScaffoldWrapper(dsl);
  
  // Generate success message based on form type
  const successMessage = dsl.title 
    ? `${dsl.title} submitted successfully!`
    : "Form submitted successfully!";
  
  return `/**
 * ${dsl.title || componentName}
 * ${dsl.description ? `\n * ${dsl.description}` : ""}
 * 
 * Generated from UI-DSL specification
 * @generated
 */
export default function ${componentName}() {
${stateCode}

${validationCode}

  /**
   * Handle form submission
   * Validates all fields before submitting
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
${generateValidationLogic(dsl)}
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    // Form is valid - handle submission
    console.log("Form submitted:", formData);
    alert("${successMessage}");
  };
  
  /**
   * Handle field value changes
   * Updates form data and clears field errors
   */
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
${scaffoldWrapper.start}
      <form onSubmit={handleSubmit} className="space-y-6">
${fieldsCode}
${actionsCode}
      </form>
${scaffoldWrapper.end}
  );
}`;
}

/**
 * Generate state initialization code
 * 
 * Creates useState hooks for form data and error state.
 * Initializes form data with default values based on field types.
 * 
 * @param dsl - UI-DSL specification
 * @returns State initialization code
 */
function generateStateCode(dsl: UIDSL): string {
  if (!dsl.fields || dsl.fields.length === 0) {
    return `  // Form state management
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});`;
  }
  
  const initialState: string[] = [];
  if (dsl.fields) {
    dsl.fields.forEach((field, index) => {
      // Determine default value based on component type
      const defaultValue = field.defaultValue !== undefined 
        ? JSON.stringify(field.defaultValue)
        : field.component === "Checkbox" 
          ? "false"
          : field.component === "DatePicker"
            ? "undefined"
            : '""';
      // Add comma after each field except the last one
      const comma = index < dsl.fields!.length - 1 ? "," : "";
      initialState.push(`    ${field.name}: ${defaultValue}${comma} // ${field.label}`);
    });
  }
  
  return `  // Form state management
  const [formData, setFormData] = useState<Record<string, any>>({
${initialState.join("\n")}
  });
  
  // Error state for validation messages
  const [errors, setErrors] = useState<Record<string, string>>({});`;
}

/**
 * Generate validation rules configuration
 * 
 * Creates a validation rules object that maps field names to their
 * validation rules. Used by validateValue function from @fragment_ui/ui.
 * 
 * @param dsl - UI-DSL specification
 * @returns Validation rules code
 */
function generateValidationCode(dsl: UIDSL): string {
  if (!dsl.fields || dsl.fields.length === 0) {
    return `  const validationRules: Record<string, ValidationRules> = {};`;
  }
  
  const rules: string[] = [];
  dsl.fields.forEach(field => {
    if (!field.validation || field.validation.length === 0) {
      return;
    }
    
    const fieldRules: string[] = [];
    
    field.validation.forEach(rule => {
      switch (rule.type) {
        case "required":
          fieldRules.push(`required: { message: "${rule.message || "This field is required"}" }`);
          break;
        case "email":
          fieldRules.push(`email: { message: "${rule.message || "Invalid email address"}" }`);
          break;
        case "minLength":
          fieldRules.push(`minLength: { value: ${rule.value}, message: "${rule.message || `Must be at least ${rule.value} characters`}" }`);
          break;
        case "maxLength":
          fieldRules.push(`maxLength: { value: ${rule.value}, message: "${rule.message || `Must be no more than ${rule.value} characters`}" }`);
          break;
        case "pattern":
          if (rule.value && typeof rule.value === "string") {
            // Use RegExp constructor instead of regex literal to avoid escaping issues
            // Escape backslashes and quotes in the pattern string
            const escapedPattern = rule.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            fieldRules.push(`pattern: { value: new RegExp("${escapedPattern}"), message: "${rule.message || "Invalid format"}" }`);
          }
          break;
      }
    });
    
    if (fieldRules.length > 0) {
      rules.push(`    ${field.name}: {
      ${fieldRules.join(",\n      ")}
    }`);
    }
  });
  
  if (rules.length === 0) {
    return `  const validationRules: Record<string, ValidationRules> = {};`;
  }
  
  // Add commas between rules, but not after the last one
  const rulesCode = rules.map((rule, index) => {
    return index < rules.length - 1 ? `${rule},` : rule;
  }).join("\n");
  
  return `  const validationRules: Record<string, ValidationRules> = {
${rulesCode}
  };`;
}

/**
 * Generate validation logic for handleSubmit
 */
function generateValidationLogic(dsl: UIDSL): string {
  if (!dsl.fields || dsl.fields.length === 0) {
    return `    // No fields to validate`;
  }
  
  return `    Object.entries(validationRules).forEach(([name, rules]) => {
      const error = validateValue(formData[name], rules);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });`;
}

/**
 * Generate fields JSX code
 */
function generateFieldsCode(dsl: UIDSL): string {
  if (!dsl.fields || dsl.fields.length === 0) {
    return `        {/* No fields defined */}`;
  }
  
  return dsl.fields.map(field => generateFieldCode(field)).join("\n");
}

/**
 * Generate code for a single field
 */
function generateFieldCode(field: Field): string {
  const errorDisplay = `{errors.${field.name} && (
          <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
        )}`;
  
  // Special handling for Select component
  if (field.component === "Select") {
    const options = field.options && field.options.length > 0 
      ? field.options.map(opt => `                <SelectItem value="${opt.value}">${opt.label}</SelectItem>`).join("\n")
      : `                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>`;
    
    // Escape quotes in label and helperText for JSX attributes
    // Only escape if label actually contains quotes, to avoid double-escaping
    const escapedLabel = field.label.includes('"') ? field.label.replace(/"/g, '\\"') : field.label;
    const escapedHelperText = field.helperText && field.helperText.includes('"') 
      ? field.helperText.replace(/"/g, '\\"') 
      : field.helperText;
    
    return `        <FormField
          label="${escapedLabel}"
          required={${field.required || false}}
          error={errors.${field.name}}
          helperText={${escapedHelperText ? `"${escapedHelperText}"` : "undefined"}}
        >
          <Select value={formData.${field.name}} onValueChange={(value) => handleChange("${field.name}", value)}>
            <SelectTrigger>
              <SelectValue placeholder="${field.placeholder || "Select..."}" />
            </SelectTrigger>
            <SelectContent>
${options}
            </SelectContent>
          </Select>
        </FormField>
        ${errorDisplay}`;
  }
  
  // Standard field rendering
  const componentProps = generateComponentProps(field);
  
  // Escape quotes in label and helperText for JSX attributes
  // Only escape if label actually contains quotes, to avoid double-escaping
  const escapedLabel = field.label.includes('"') ? field.label.replace(/"/g, '\\"') : field.label;
  const escapedHelperText = field.helperText && field.helperText.includes('"') 
    ? field.helperText.replace(/"/g, '\\"') 
    : field.helperText;
  
  return `        <FormField
          label="${escapedLabel}"
          required={${field.required || false}}
          error={errors.${field.name}}
          helperText={${escapedHelperText ? `"${escapedHelperText}"` : "undefined"}}
        >
          <${field.component}
            ${componentProps}
          />
        </FormField>
        ${errorDisplay}`;
}

/**
 * Generate component props based on field type
 */
function generateComponentProps(field: Field): string {
  const props: string[] = [];
  
  props.push(`value={formData.${field.name} || ""}`);
  
  // Component-specific props
  switch (field.component) {
    case "Input":
      if (field.name.includes("email")) {
        props.push('type="email"');
      } else if (field.name.includes("phone") || field.name.includes("tel")) {
        props.push('type="tel"');
      } else {
        props.push('type="text"');
      }
      props.push(`placeholder="${field.placeholder || ""}"`);
      props.push(`onChange={(e) => handleChange("${field.name}", e.target.value)}`);
      break;
      
    case "Textarea":
      props.push(`placeholder="${field.placeholder || ""}"`);
      props.push(`onChange={(e) => handleChange("${field.name}", e.target.value)}`);
      break;
      
    case "Select":
      props.push(`onValueChange={(value) => handleChange("${field.name}", value)}`);
      if (field.options && field.options.length > 0) {
        // Options will be in SelectContent
      }
      break;
      
    case "Checkbox":
      props.push(`checked={formData.${field.name} === true || formData.${field.name} === "true"}`);
      props.push(`onCheckedChange={(checked) => handleChange("${field.name}", checked)}`);
      break;
      
    case "DatePicker":
      props.push(`value={formData.${field.name} as Date | undefined}`);
      props.push(`onChange={(date) => handleChange("${field.name}", date)}`);
      props.push(`placeholder="${field.placeholder || "Select date"}"`);
      break;
      
    default:
      props.push(`onChange={(value) => handleChange("${field.name}", value)}`);
  }
  
  return props.join("\n            ");
}

/**
 * Generate actions (buttons) code
 */
function generateActionsCode(dsl: UIDSL): string {
  if (!dsl.actions || dsl.actions.length === 0) {
    return `        <Button type="submit" variant="primary">Submit</Button>`;
  }
  
  return dsl.actions.map(action => {
    const variant = action.variant || "primary";
    if (action.type === "submit") {
      return `        <Button type="submit" variant="${variant}">${action.label}</Button>`;
    } else if (action.type === "link") {
      return `        <a href="${action.href || "#"}" className="text-[color:var(--color-brand-primary)] hover:underline">${action.label}</a>`;
    } else {
      return `        <Button type="button" variant="${variant}" onClick={() => { ${action.onClick || "console.log('clicked')"} }}>${action.label}</Button>`;
    }
  }).join("\n");
}

/**
 * Generate scaffold wrapper
 */
function generateScaffoldWrapper(dsl: UIDSL): { start: string; end: string } {
  if (dsl.scaffold === "form-auth") {
    return {
      start: `    <Card className="mx-auto w-full max-w-md p-6">
      <CardHeader>
        <CardTitle>${dsl.title || "Form"}</CardTitle>
        ${dsl.description ? `<CardDescription>${dsl.description}</CardDescription>` : ""}
      </CardHeader>
      <CardContent>`,
      end: `      </CardContent>
    </Card>`
    };
  }
  
  // Default wrapper
  return {
    start: `    <div className="max-w-${dsl.layout?.maxWidth || "md"} mx-auto p-6">`,
    end: `    </div>`
  };
}

