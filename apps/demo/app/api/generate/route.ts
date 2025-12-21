import { NextRequest, NextResponse } from "next/server";
import { parsePromptToUIDSL, generateCodeFromUIDSL } from "@fragment_ui/ui-dsl";
import { parsePrompt } from "../../studio/dsl/parser";
import { generateTSX } from "../../studio/dsl/generator";
import { isUiDecision, generateId } from "../../studio/dsl/types";
import { generateApp, generateAppCode } from "./app-route";
import { detectScreenType, detectAppFlow, suggestComponents } from "./rules";
import OpenAI from "openai";
import { FORM_TEMPLATES } from "./templates/form-templates";
import type { GenerateRequest, FormField, FormTemplate } from "./types";
import { detectFormType, extractFieldsFromPrompt, parseFormPromptLegacy } from "./utils/form-detector";
import { FORM_COMPONENT_MAP } from "./utils/component-map";
import { checkIfDecisionPattern, checkIfSimple } from "./utils/prompt-utils";

/**
 * API Route for generating React components from AI prompts
 * 
 * This endpoint:
 * 1. Takes a prompt describing what component/form/app to build
 * 2. Uses hybrid approach: simple prompts → rule-based, complex → OpenAI API
 * 3. Recognizes form types, screen types, and app flows
 * 4. Uses professional templates and smart rules
 * 5. Returns complete React component code with validation and proper UX
 * 6. Can generate single forms, screens, or complete multi-screen applications
 */

// Initialize OpenAI client (if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Types and templates are now imported from separate modules
// See: ./types.ts, ./templates/form-templates.ts, ./utils/

// Form detection functions moved to ./utils/form-detector.ts
// Prompt utilities moved to ./utils/prompt-utils.ts
// Component mapping moved to ./utils/component-map.ts

/**
 * Generate validation code for a field
 */
function generateValidationCode(field: FormField): string {
  if (!field.validation) return "";
  
  const validations: string[] = [];
  
  if (field.validation.minLength) {
    validations.push(`if (value.length < ${field.validation.minLength}) {
      return "Must be at least ${field.validation.minLength} characters";
    }`);
  }
  
  if (field.validation.maxLength) {
    validations.push(`if (value.length > ${field.validation.maxLength}) {
      return "Must be no more than ${field.validation.maxLength} characters";
    }`);
  }
  
  if (field.validation.pattern === "email") {
    validations.push(`if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }`);
  }
  
  if (field.validation.pattern === "password") {
    validations.push(`if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(value)) {
      return "Password must contain uppercase, lowercase, and numbers";
    }`);
  }
  
  if (field.validation.pattern === "phone") {
    validations.push(`if (!/^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/.test(value)) {
      return "Please enter a valid phone number";
    }`);
  }
  
  if (field.validation.custom === "matchPassword") {
    // Password match validation is handled inline in validateField and handleSubmit
    // because it needs access to formData.password
    return ""; // Skip generating validation function for this
  }
  
  if (field.validation.custom === "age18") {
    validations.push(`const dateValue = value instanceof Date ? value : new Date(value);
    if (isNaN(dateValue.getTime())) {
      return "Please enter a valid date";
    }
    const age = new Date().getFullYear() - dateValue.getFullYear();
    const monthDiff = new Date().getMonth() - dateValue.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && new Date().getDate() < dateValue.getDate())) {
      return "You must be at least 18 years old";
    }`);
  }
  
  return validations.join("\n    ");
}

/**
 * Generate React component code from parsed prompt
 */
function generateComponentCode(data: {
  fields: FormField[];
  title: string;
  description: string;
  submitText: string;
  successMessage: string;
}): string {
  const { fields, title, description, submitText, successMessage } = data;
  
  // Generate imports
  const imports = [
    `"use client";`,
    ``,
    `import { useState } from "react";`,
    `import {`,
    `  Button,`,
    `  Input,`,
    `  Card,`,
    `  CardContent,`,
    `  CardHeader,`,
    `  CardTitle,`,
    `  CardDescription,`,
    `  Toaster,`,
    `  toast,`,
  ];
  
  // Add specific imports based on fields - detect all needed components
  const neededComponents = new Set<string>(["Button", "Input", "Card"]);
  fields.forEach(field => {
    const componentType = FORM_COMPONENT_MAP[field.type] || "Input";
    neededComponents.add(componentType);
  });
  
  // Add imports for all needed components
  if (neededComponents.has("Select")) {
    imports.push(`  Select,`);
    imports.push(`  SelectTrigger,`);
    imports.push(`  SelectValue,`);
    imports.push(`  SelectContent,`);
    imports.push(`  SelectItem,`);
  }
  if (neededComponents.has("Textarea")) {
    imports.push(`  Textarea,`);
  }
  if (neededComponents.has("Checkbox")) {
    imports.push(`  Checkbox,`);
  }
  if (neededComponents.has("RadioGroup")) {
    imports.push(`  RadioGroup,`);
    imports.push(`  Radio,`);
  }
  if (neededComponents.has("Switch")) {
    imports.push(`  Switch,`);
  }
  if (neededComponents.has("DatePicker")) {
    imports.push(`  DatePicker,`);
  }
  if (neededComponents.has("Slider")) {
    imports.push(`  Slider,`);
  }
  if (neededComponents.has("FileUpload")) {
    imports.push(`  FileUpload,`);
  }
  if (neededComponents.has("MultiSelect")) {
    imports.push(`  MultiSelect,`);
  }
  if (neededComponents.has("Rating")) {
    imports.push(`  Rating,`);
  }
  if (neededComponents.has("ColorPicker")) {
    imports.push(`  ColorPicker,`);
  }
  if (neededComponents.has("TagInput")) {
    imports.push(`  TagInput,`);
  }
  if (neededComponents.has("Combobox")) {
    imports.push(`  Combobox,`);
  }
  
  imports.push(`} from "@fragment_ui/ui";`);
  
  // Generate initial state - handle different types
  const initialState = fields.map(f => {
    if (f.type === "datepicker" || f.type === "date") {
      return `    ${f.name}: undefined as Date | undefined`;
    } else if (f.type === "slider" || f.type === "range") {
      return `    ${f.name}: "0"`;
    } else {
      return `    ${f.name}: ""`;
    }
  }).join(",\n");
  
  // Generate validation functions - skip matchPassword as it's handled inline
  const validationFunctions = fields
    .filter(f => f.validation && f.validation.custom !== "matchPassword")
    .map(f => {
      const validationCode = generateValidationCode(f);
      if (!validationCode) return "";
      return `  const validate${f.name.charAt(0).toUpperCase() + f.name.slice(1)} = (value) => {
    ${validationCode}
    return undefined;
  };`;
    })
    .filter(Boolean)
    .join("\n\n");
  
  // Generate field rendering - support all Fragment UI components
  const fieldRendering = fields.map(field => {
    const componentType = FORM_COMPONENT_MAP[field.type] || "Input";
    
    // Checkbox
    if (field.type === "checkbox") {
      return `            <div className="flex items-start space-x-2" data-ui-id="field-${field.name}">
              <Checkbox
                id="${field.name}"
                data-ui-id="checkbox-${field.name}"
                checked={formData.${field.name} === "true"}
                onCheckedChange={(checked) => handleChange("${field.name}", checked ? "true" : "false")}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="${field.name}" className="text-sm font-medium cursor-pointer">
                  ${field.label}${field.required ? " *" : ""}
                </label>
                ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              </div>
            </div>`;
    }
    
    // Textarea
    if (field.type === "textarea") {
      return `            <div className="space-y-2" data-ui-id="field-${field.name}">
              <label htmlFor="${field.name}" className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <Textarea
                id="${field.name}"
                data-ui-id="textarea-${field.name}"
                value={formData.${field.name}}
                onChange={(e) => handleChange("${field.name}", e.target.value)}
                onBlur={() => validateField("${field.name}")}
                placeholder="${field.placeholder}"
                required={${field.required}}
                rows={5}
                className={errors.${field.name} ? "border-[color:var(--color-status-error-border)]" : ""}
              />
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)]">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)]">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // Select
    if (field.type === "select") {
      return `            <div className="space-y-2" data-ui-id="field-${field.name}">
              <label htmlFor="${field.name}" className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <Select onValueChange={(value) => handleChange("${field.name}", value)} data-ui-id="select-${field.name}">
                <SelectTrigger id="${field.name}" data-ui-id="select-trigger-${field.name}">
                  <SelectValue placeholder="${field.placeholder || "Select " + field.label.toLowerCase()}" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // DatePicker
    if (field.type === "datepicker" || field.type === "date") {
      return `            <div className="space-y-2">
              <label htmlFor="${field.name}" className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <DatePicker
                value={formData.${field.name} as Date | undefined}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, ${field.name}: date }));
                  if (errors.${field.name}) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.${field.name};
                      return newErrors;
                    });
                  }
                }}
                placeholder="${field.placeholder || "Select date"}"
              />
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // RadioGroup
    if (field.type === "radio") {
      return `            <div className="space-y-2">
              <label className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <RadioGroup value={formData.${field.name}} onValueChange={(value) => handleChange("${field.name}", value)}>
                <Radio value="option1" label="Option 1" />
                <Radio value="option2" label="Option 2" />
                <Radio value="option3" label="Option 3" />
              </RadioGroup>
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // Switch
    if (field.type === "switch") {
      return `            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <label htmlFor="${field.name}" className="text-sm font-medium">
                  ${field.label}${field.required ? " *" : ""}
                </label>
                ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              </div>
              <Switch
                id="${field.name}"
                checked={formData.${field.name} === "true"}
                onCheckedChange={(checked) => handleChange("${field.name}", checked ? "true" : "false")}
              />
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // Slider
    if (field.type === "slider" || field.type === "range") {
      return `            <div className="space-y-2">
              <label htmlFor="${field.name}" className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <Slider
                value={[parseInt(formData.${field.name}) || 0]}
                onValueChange={(values) => handleChange("${field.name}", values[0].toString())}
                min={0}
                max={100}
                step={1}
              />
              <div className="text-sm text-[color:var(--color-fg-muted)]">
                Value: {formData.${field.name} || 0}
              </div>
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)]">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)]">{errors.${field.name}}</p>
              )}
            </div>`;
    }
    
    // Default: Input (text, email, password, tel, number, etc.)
    return `            <div className="space-y-2" data-ui-id="field-${field.name}">
              <label htmlFor="${field.name}" className="text-sm font-medium">
                ${field.label}${field.required ? " *" : ""}
              </label>
              <Input
                id="${field.name}"
                data-ui-id="input-${field.name}"
                type="${field.type === "datepicker" ? "text" : field.type}"
                value={formData.${field.name}}
                onChange={(e) => handleChange("${field.name}", e.target.value)}
                onBlur={() => validateField("${field.name}")}
                placeholder="${field.placeholder}"
                required={${field.required}}
                className={errors.${field.name} ? "border-[color:var(--color-status-error-border)]" : ""}
              />
              ${field.helperText ? `<p className="text-xs text-[color:var(--color-fg-muted)] mt-1">${field.helperText}</p>` : ""}
              {errors.${field.name} && (
                <p className="text-xs text-[color:var(--color-status-error-base)] mt-1">{errors.${field.name}}</p>
              )}
            </div>`;
  }).join("\n");
  
  // Generate component code
  const componentCode = `
${imports.join("\n")}

export default function GeneratedForm() {
  const [formData, setFormData] = useState({
${initialState}
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

${validationFunctions}

  const validateField = (name) => {
    const value = formData[name];
    const field = ${JSON.stringify(fields)}.find((f) => f.name === name);
    
    if (!field) return;
    
    // Required validation - handle Date objects
    const isEmpty = field.type === "datepicker" || field.type === "date" 
      ? !value 
      : !value || value === "";
    
    if (field.required && isEmpty) {
      setErrors(prev => ({ ...prev, [name]: field.label + " is required" }));
      return;
    }
    
    // Skip other validations if empty and not required
    if (!value && !field.required) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return;
    }
    
    // Custom validation - convert Date to string for validation functions
${fields.filter(f => f.validation && f.validation.custom !== "matchPassword").map(f => {
  const validationCode = generateValidationCode(f);
  if (!validationCode) return "";
  const valueForValidation = f.type === "datepicker" || f.type === "date"
    ? `value instanceof Date ? value.toISOString().split('T')[0] : String(value || '')`
    : `String(value || '')`;
  
  return `    if (name === "${f.name}") {
      const error = validate${f.name.charAt(0).toUpperCase() + f.name.slice(1)}(${valueForValidation});
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
        return;
      }
    }`;
}).filter(Boolean).join("\n")}
    
    // Special handling for password match validation
${fields.filter(f => f.validation?.custom === "matchPassword").map(f => {
  return `    if (name === "${f.name}") {
      const passwordValue = String(value || '');
      const password = String(formData.password || '');
      if (passwordValue !== password) {
        setErrors(prev => ({ ...prev, [name]: "Passwords do not match" }));
        return;
      }
    }`;
}).filter(Boolean).join("\n")}
    
    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const fieldNames = ${JSON.stringify(fields.map(f => f.name))};
    const validationErrors = {};
    
    fieldNames.forEach(name => {
      const value = formData[name];
      const field = ${JSON.stringify(fields)}.find((f) => f.name === name);
      
      if (!field) return;
      
      // Required validation - handle Date objects
      const isEmpty = field.type === "datepicker" || field.type === "date" 
        ? !value 
        : !value || value === "";
      
      if (field.required && isEmpty) {
        validationErrors[name] = field.label + " is required";
        return;
      }
      
      // Skip other validations if empty and not required
      if (isEmpty && !field.required) return;
      
      // Custom validation - convert Date to string for validation functions
${fields.filter(f => f.validation && f.validation.custom !== "matchPassword").map(f => {
  const validationCode = generateValidationCode(f);
  if (!validationCode) return "";
  const valueForValidation = f.type === "datepicker" || f.type === "date"
    ? `value instanceof Date ? value.toISOString().split('T')[0] : String(value || '')`
    : `String(value || '')`;
  
  return `      if (name === "${f.name}") {
        const error = validate${f.name.charAt(0).toUpperCase() + f.name.slice(1)}(${valueForValidation});
        if (error) {
          validationErrors[name] = error;
          return;
        }
      }`;
}).filter(Boolean).join("\n")}
      
      // Special handling for password match validation
${fields.filter(f => f.validation?.custom === "matchPassword").map(f => {
  return `      if (name === "${f.name}") {
        const passwordValue = String(value || '');
        const password = String(formData.password || '');
        if (passwordValue !== password) {
          validationErrors[name] = "Passwords do not match";
          return;
        }
      }`;
}).filter(Boolean).join("\n")}
    });
    
    // Set errors
    setErrors(validationErrors);
    
    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("${successMessage}");
    console.log("Form data:", formData);
    
    // Reset form
    setFormData({
${fields.map(f => {
  if (f.type === "datepicker" || f.type === "date") {
    return `      ${f.name}: undefined as Date | undefined`;
  } else if (f.type === "slider" || f.type === "range") {
    return `      ${f.name}: "0"`;
  } else {
    return `      ${f.name}: ""`;
  }
}).join(",\n")}
    });
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6" data-ui-id="form-container">
      <Toaster />
      <Card className="w-full" data-ui-id="card-form">
        <CardHeader data-ui-id="card-header-form">
          <CardTitle className="text-2xl" data-ui-id="card-title-form">${title}</CardTitle>
          <CardDescription className="text-base mt-2" data-ui-id="card-description-form">
            ${description}
          </CardDescription>
        </CardHeader>
        <CardContent data-ui-id="card-content-form">
          <form onSubmit={handleSubmit} className="space-y-6" data-ui-id="form-main">
${fieldRendering}
            <div className="flex gap-3 pt-4" data-ui-id="form-actions">
              <Button 
                type="submit" 
                variant="solid" 
                disabled={isSubmitting}
                className="flex-1"
                data-ui-id="button-submit"
              >
                {isSubmitting ? "Submitting..." : "${submitText}"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData({
${initialState}
                  });
                  setErrors({});
                }}
                disabled={isSubmitting}
                data-ui-id="button-reset"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
`;

  return componentCode.trim();
}

/**
 * Check if prompt is simple enough for rule-based parsing
 */
/**
 * Check if prompt is requesting a decision pattern
 */


/**
 * Fix incorrect component imports and usages
 * E.g., Dropdown -> DropdownMenu (Dropdown doesn't exist in @fragment_ui/ui)
 */
/**
 * Remove TypeScript type annotations for react-live compatibility
 */
function removeTypeScriptAnnotations(code: string): string {
  let cleaned = code;
  
  // Remove generic type parameters (e.g., useState<Record<string, any>>)
  cleaned = cleaned.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_<>,\s\[\]|&{}?]*>/g, '$1');
  
  // Remove type annotations in variable declarations (e.g., const x: Type =)
  cleaned = cleaned.replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[=,;\)])/g, '$1');
  
  // Remove type annotations in function parameters (e.g., (param: Type) =>)
  cleaned = cleaned.replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[,\)\s]*=>)/g, '$1$2$3');
  cleaned = cleaned.replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*?)(\s*[,\)])/g, '$1$2$4');
  
  // Remove type annotations in function return types (e.g., function name(): Type {)
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*{)/g, ')$1');
  cleaned = cleaned.replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*=>)/g, ')$1');
  
  // Remove interface definitions
  cleaned = cleaned.replace(/interface\s+\w+\s*\{[^}]*\}\s*/g, '');
  
  // Remove type definitions
  cleaned = cleaned.replace(/type\s+\w+\s*=\s*[^;]+;\s*/g, '');
  
  return cleaned;
}

/**
 * Replace alert(), confirm(), and prompt() with toast notifications
 */
function replaceAlertWithToast(code: string): string {
  let cleaned = code;
  
  // Replace alert("message") with toast.success("message")
  cleaned = cleaned.replace(/alert\s*\(\s*["']([^"']+)["']\s*\)/g, 'toast.success("$1")');
  cleaned = cleaned.replace(/alert\s*\(\s*`([^`]+)`\s*\)/g, 'toast.success(`$1`)');
  
  // Replace confirm("message") with Dialog (keep for now, but log warning)
  // For now, just replace with toast.info
  cleaned = cleaned.replace(/confirm\s*\(\s*["']([^"']+)["']\s*\)/g, 'toast.info("$1")');
  cleaned = cleaned.replace(/confirm\s*\(\s*`([^`]+)`\s*\)/g, 'toast.info(`$1`)');
  
  // Replace prompt("message") with toast.info (not ideal, but better than prompt)
  cleaned = cleaned.replace(/prompt\s*\(\s*["']([^"']+)["']\s*\)/g, 'toast.info("$1")');
  cleaned = cleaned.replace(/prompt\s*\(\s*`([^`]+)`\s*\)/g, 'toast.info(`$1`)');
  
  // Ensure toast is imported if alert/confirm/prompt were used
  if (cleaned.includes('toast.') && !cleaned.includes('import') && !cleaned.includes('toast')) {
    // This will be handled by addMissingImports
  }
  
  return cleaned;
}

/**
 * Fix common syntax errors in generated code
 */
function fixSyntaxErrors(code: string): string {
  let cleaned = code;
  
  // Fix broken object literal: const emailRules = {} -> const emailRules = {
  // Pattern: const emailRules = {} \n required: -> const emailRules = {\n    required:
  // This handles the case where AI generates: const emailRules = {} \n required: ...
  cleaned = cleaned.replace(
    /const\s+(\w+Rules)\s*=\s*\{\}\s*\n(\s*)(\w+):/g,
    (match, varName, indent, firstProp) => {
      // Fix the first property and ensure proper indentation
      return `const ${varName} = {\n${indent}    ${firstProp}:`;
    }
  );
  
  // Fix broken object literal: const emailRules = {} required: -> const emailRules = { required:
  // This handles cases where there's no newline between {} and the property
  cleaned = cleaned.replace(
    /const\s+(\w+Rules)\s*=\s*\{\}\s+(\w+):/g,
    (match, varName, firstProp) => {
      return `const ${varName} = {\n    ${firstProp}:`;
    }
  );
  
  // Fix incomplete object spread in setErrors: setErrors({ email) -> setErrors({ email: error })
  cleaned = cleaned.replace(
    /setErrors\(\{\s*(\w+)\s*\)/g,
    (match, fieldName) => {
      return `setErrors({ ${fieldName}: error })`;
    }
  );
  
  // Fix incomplete object spread in setFormData: setFormData(prev => ({ ...prev, [name]))
  // Pattern: setFormData(prev => ({ ...prev, [name])) -> setFormData(prev => ({ ...prev, [name]: value }))
  // First, try to find the value parameter from handleChange function signature
  const handleChangeMatch = cleaned.match(/const\s+handleChange\s*=\s*\([^)]*?,\s*(\w+)[^)]*\)/);
  const valueParam = handleChangeMatch?.[1] || 'value';
  
  // Fix the incomplete object spread pattern
  cleaned = cleaned.replace(
    /setFormData\s*\(\s*prev\s*=>\s*\(\{\s*\.\.\.\s*prev\s*,\s*\[([^\]]+)\]\s*\)/g,
    `setFormData(prev => ({ ...prev, [$1]: ${valueParam} }))`
  );
  
  // Fix incomplete object spread in general: ({ ...prev, [name]) -> ({ ...prev, [name]: value })
  cleaned = cleaned.replace(
    /\(\{\s*\.\.\.\s*prev\s*,\s*\[([^\]]+)\]\s*\)/g,
    `({ ...prev, [$1]: ${valueParam} })`
  );
  
  // Fix incomplete object literals: const x = { -> const x = {}
  cleaned = cleaned.replace(/const\s+(\w+)\s*=\s*\{\s*$/gm, 'const $1 = {}');
  
  // Fix broken object literal: const chartData = {} labels: -> const chartData = { labels:
  // Pattern: const chartData = {} \n    labels: -> const chartData = {\n    labels:
  cleaned = cleaned.replace(
    /const\s+(\w+)\s*=\s*\{\}\s*\n(\s*)(\w+):/g,
    (match, varName, indent, firstProp) => {
      return `const ${varName} = {\n${indent}${firstProp}:`;
    }
  );
  
  // Fix broken object literal: const chartData = {} labels: (no newline)
  cleaned = cleaned.replace(
    /const\s+(\w+)\s*=\s*\{\}\s+(\w+):/g,
    (match, varName, firstProp) => {
      return `const ${varName} = {\n    ${firstProp}:`;
    }
  );
  
  // CRITICAL FIX: Fix double colons in object properties - MUST BE FIRST
  // Pattern: property: value: undefined -> property: value
  // Examples: id: 1: undefined -> id: 1, name: "John": undefined -> name: "John"
  // This handles cases where OpenAI generates invalid syntax like { id: 1: undefined, ... }
  // We need to match property: value: undefined and remove the : undefined part
  
  // MOST AGGRESSIVE FIX FIRST: Match any property: value: undefined pattern
  // This catches all cases including: { id: 1: undefined, name: "John": undefined }
  // Use a more permissive pattern that doesn't require lookahead (which can fail in some cases)
  // Process multiple times to catch all cases (some may be nested or in arrays)
  for (let i = 0; i < 5; i++) {
    const before = cleaned;
  cleaned = cleaned.replace(
    /(\w+):\s*([^:,\}]+?):\s*undefined/g,
    (match, propName, value) => {
      const trimmedValue = value.trim();
        // Remove any trailing whitespace and fix the value
        // Handle numbers
        if (/^\d+$/.test(trimmedValue)) {
        return `${propName}: ${trimmedValue}`;
      }
        // Handle quoted strings (double quotes)
        if (/^"[^"]*"$/.test(trimmedValue)) {
          return `${propName}: ${trimmedValue}`;
    }
        // Handle quoted strings (single quotes)
        if (/^'[^']*'$/.test(trimmedValue)) {
          return `${propName}: ${trimmedValue}`;
        }
        // Handle boolean
        if (/^(true|false)$/.test(trimmedValue)) {
          return `${propName}: ${trimmedValue}`;
        }
        // Handle identifiers (unquoted strings like "Active", "Inactive")
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmedValue)) {
          return `${propName}: ${trimmedValue}`;
        }
        // If we can't determine, try to fix it anyway (remove : undefined)
        return `${propName}: ${trimmedValue}`;
      }
    );
    // Stop if no more changes
    if (before === cleaned) break;
  }
  
  // Additional specific fixes for edge cases
  // Fix number values: id: 1: undefined -> id: 1
  cleaned = cleaned.replace(
    /(\w+):\s*(\d+):\s*undefined/g,
    '$1: $2'
  );
  
  // Fix string values: name: "John Doe": undefined -> name: "John Doe"
  cleaned = cleaned.replace(
    /(\w+):\s*"([^"]+)":\s*undefined/g,
    '$1: "$2"'
  );
  
  // Fix single-quoted strings: name: 'John Doe': undefined -> name: 'John Doe'
  cleaned = cleaned.replace(
    /(\w+):\s*'([^']+)':\s*undefined/g,
    "$1: '$2'"
  );
  
  // Fix boolean values: active: true: undefined -> active: true
  cleaned = cleaned.replace(
    /(\w+):\s*(true|false):\s*undefined/g,
    '$1: $2'
  );
  
  // Fix identifier values: status: Active: undefined -> status: Active
  cleaned = cleaned.replace(
    /(\w+):\s*([a-zA-Z_$][a-zA-Z0-9_$]*):\s*undefined/g,
    '$1: $2'
  );
  
  // Fix double colons with true: included: true: undefined -> included: true
  cleaned = cleaned.replace(
    /(\w+):\s*true:\s*undefined/g,
    '$1: true'
  );
  
  // Fix broken object literal: const chartData = {} labels: -> const chartData = { labels:
  // Pattern: const chartData = {} \n    labels: -> const chartData = {\n    labels:
  cleaned = cleaned.replace(
    /const\s+(\w+)\s*=\s*\{\}\s*\n(\s*)(\w+):/g,
    (match, varName, indent, firstProp) => {
      return `const ${varName} = {\n${indent}${firstProp}:`;
    }
  );
  
  // Fix broken object literal: const chartData = {} labels: (no newline)
  cleaned = cleaned.replace(
    /const\s+(\w+)\s*=\s*\{\}\s+(\w+):/g,
    (match, varName, firstProp) => {
      return `const ${varName} = {\n    ${firstProp}:`;
    }
  );
  
  // Fix double colons with false: disabled: false: undefined -> disabled: false
  cleaned = cleaned.replace(
    /(\w+):\s*false:\s*undefined/g,
    '$1: false'
  );
  
  // Fix fill: undefined -> remove the property (fill is optional in Chart.js)
  // Pattern: fill: undefined, -> remove entire property
  cleaned = cleaned.replace(
    /fill:\s*undefined\s*,?\s*/g,
    ''
  );
  
  // Also fix fill: undefined at end of object (no comma)
  cleaned = cleaned.replace(
    /,\s*fill:\s*undefined\s*/g,
    ''
  );
  cleaned = cleaned.replace(
    /fill:\s*undefined\s*/g,
    ''
  );
  
  // Fix incomplete object properties in Chart.js options
  // Pattern: responsive, -> responsive: true,
  // Note: fill is NOT included here because it's optional and should be removed if undefined
  cleaned = cleaned.replace(
    /(\s+)(responsive|maintainAspectRatio|enabled|display)(\s*),/g,
    '$1$2: true,'
  );
  
  // Fix: maintainAspectRatio: undefined -> maintainAspectRatio: false
  cleaned = cleaned.replace(
    /maintainAspectRatio:\s*undefined/g,
    'maintainAspectRatio: false'
  );
  
  // Fix: display: undefined -> display: true
  cleaned = cleaned.replace(
    /display:\s*undefined/g,
    'display: true'
  );
  
  // Fix: enabled, -> enabled: true,
  cleaned = cleaned.replace(
    /(\s+)enabled(\s*),/g,
    '$1enabled: true,'
  );
  
  // Fix: fill, -> (remove, fill is optional)
  // BUT: Don't remove fill: false or fill: true (these are valid Chart.js properties)
  // Only remove standalone "fill," without a value (not "fill: value,")
  // Pattern: "fill," but NOT "fill: false," or "fill: true,"
  cleaned = cleaned.replace(
    /(\s+)fill(\s*),/g,
    (match, before, after) => {
      // Check if there's a colon before "fill" in the same property (meaning it's "fill: value,")
      // Look backwards from the match position to find if there's a colon
      const matchIndex = cleaned.indexOf(match);
      const beforeMatch = cleaned.substring(Math.max(0, matchIndex - 50), matchIndex);
      // If we find "fill:" before this match, it means it's "fill: value," so don't remove
      if (beforeMatch.includes('fill:')) {
        return match; // Keep it (it's "fill: value,")
      }
      return ''; // Remove standalone "fill,"
    }
  );
  
  // Fix: responsive, maintainAspectRatio: undefined, -> responsive: true, maintainAspectRatio: false,
  cleaned = cleaned.replace(
    /responsive(\s*),(\s*)maintainAspectRatio:\s*undefined/g,
    'responsive: true,$2maintainAspectRatio: false'
  );
  
  // Fix incomplete plugins object: plugins: { legend: { display: undefined, tooltip: { enabled
  cleaned = cleaned.replace(
    /plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*undefined(\s*),(\s*)tooltip:\s*\{(\s*)enabled/g,
    'plugins: {$1legend: {$2display: true$3},$4tooltip: {$5enabled: true'
  );
  
  // Fix malformed plugins structure: legend: { display: true, tooltip: { enabled: true } } -> legend: { display: true }, tooltip: { enabled: true }
  // Pattern: legend: { display: true, tooltip: { enabled: true } } -> legend: { display: true }, tooltip: { enabled: true }
  cleaned = cleaned.replace(
    /legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}\s*\}/g,
    'legend: {$1display: true$2},$3tooltip: {$4enabled: true$5}$6}'
  );
  
  // Fix: legend: { display: true, tooltip: { enabled: true } -> legend: { display: true }, tooltip: { enabled: true }
  cleaned = cleaned.replace(
    /legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}/g,
    'legend: {$1display: true$2},$3tooltip: {$4enabled: true$5}'
  );
  
  // Fix malformed Chart.js options object
  // Pattern: options={{ responsive, maintainAspectRatio: undefined, plugins: { legend: { display: undefined, tooltip: { enabled
  cleaned = cleaned.replace(
    /options=\{\{\s*responsive(\s*),(\s*)maintainAspectRatio:\s*undefined(\s*),(\s*)plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*undefined(\s*),(\s*)tooltip:\s*\{(\s*)enabled/g,
    'options={{ responsive: true$1,$2maintainAspectRatio: false$3,$4plugins: {$5legend: {$6display: true$7},$8tooltip: {$9enabled: true'
  );
  
  // Fix: plugins: { legend: { display: true, tooltip: { enabled: true } } } -> plugins: { legend: { display: true }, tooltip: { enabled: true } }
  cleaned = cleaned.replace(
    /plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}\s*\}/g,
    'plugins: {$1legend: {$2display: true$3},$4tooltip: {$5enabled: true$6}$1}'
  );
  
  // Fix: legend: { display: true, tooltip: { enabled: true } -> legend: { display: true }, tooltip: { enabled: true }
  cleaned = cleaned.replace(
    /(\s*)legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}/g,
    '$1legend: {$2display: true$3},$4tooltip: {$5enabled: true$6}'
  );
  
  // Fix: legend: { display: true, tooltip: { enabled: true } } } -> legend: { display: true }, tooltip: { enabled: true } }
  // This handles cases where tooltip is nested inside legend with extra closing braces
  cleaned = cleaned.replace(
    /legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}\s*\}/g,
    'legend: {$1display: true$2},$3tooltip: {$4enabled: true$5}'
  );
  
  // Fix: plugins: { legend: { display: true, tooltip: { enabled: true } } } -> plugins: { legend: { display: true }, tooltip: { enabled: true } }
  // More aggressive fix for the exact pattern from the error
  cleaned = cleaned.replace(
    /plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}\s*\}/g,
    'plugins: {$1legend: {$2display: true$3},$4tooltip: {$5enabled: true$6}$1}'
  );
  
  // CRITICAL FIX: Fix the exact pattern from the error message
  // Pattern: options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, tooltip: { enabled: true, }}}}}
  // This is the most specific fix for the exact error we're seeing
  cleaned = cleaned.replace(
    /options=\{\{\s*responsive:\s*true(\s*),(\s*)maintainAspectRatio:\s*true(\s*),(\s*)plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*),?\s*\}\s*\}\s*\}\s*\}\s*\}\s*\}/g,
    'options={{ responsive: true$1,$2maintainAspectRatio: true$3,$4plugins: {$5legend: {$6display: true$7},$8tooltip: {$9enabled: true$10}$5}$4}}'
  );
  
  // Fix incomplete closing braces: }}} -> } } }
  cleaned = cleaned.replace(
    /(\s*)\}\}\}\s*$/gm,
    '$1}$2}$3}'
  );
  
  // Fix: enabled: true, }}} -> enabled: true } } }
  cleaned = cleaned.replace(
    /enabled:\s*true(\s*),?\s*\}\}\}/g,
    'enabled: true$1}$2}$3}'
  );
  
  // Fix: options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, tooltip: { enabled: true } } } }}
  // This is a more specific fix for the exact pattern in the error
  cleaned = cleaned.replace(
    /options=\{\{\s*responsive:\s*true(\s*),(\s*)maintainAspectRatio:\s*true(\s*),(\s*)plugins:\s*\{(\s*)legend:\s*\{(\s*)display:\s*true(\s*),(\s*)tooltip:\s*\{(\s*)enabled:\s*true(\s*)\}\s*\}\s*\}\s*\}\s*\}/g,
    (match, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10) => {
      return `options={{ responsive: true${s1},${s2}maintainAspectRatio: true${s3},${s4}plugins: {${s5}legend: {${s6}display: true${s7}},${s8}tooltip: {${s9}enabled: true${s10}}${s5}}${s4}}}`
    }
  );
  
  // Fix any remaining $N patterns that weren't replaced (fallback)
  cleaned = cleaned.replace(/\$(\d+)\}/g, '}');
  
  // Fix: enabled }} -> enabled: true } } }
  cleaned = cleaned.replace(
    /enabled(\s*)\}\}/g,
    'enabled: true$1}$2}'
  );
  
  // Fix: enabled }} -> enabled: true } } } (with proper closing)
  cleaned = cleaned.replace(
    /enabled(\s*)\}\s*\}/g,
    'enabled: true$1}$2}'
  );
  
  // Fix incomplete closing: enabled }} -> enabled: true } } }
  cleaned = cleaned.replace(
    /(\s+)enabled(\s*)\}\s*\}/g,
    '$1enabled: true$2}$3}'
  );
  
  // CRITICAL FIX: Fix the exact pattern from API response - tooltip nested in legend
  // Pattern: display: true, tooltip: { enabled: true, }}
  // Simple direct replacement - this is the most reliable approach
  cleaned = cleaned.replace(
    /display:\s*true\s*,\s*tooltip:\s*\{[\s\S]*?enabled:\s*true[\s\S]*?\}\s*\}\s*\}/g,
    (match) => {
      // Get indentation from the line with display: true
      const lines = match.split('\n');
      const displayLine = lines.find(l => l.includes('display: true'));
      const indent = displayLine ? displayLine.match(/^(\s*)/)?.[0] || '            ' : '            ';
      
      // Return fixed structure with proper indentation
      return `display: true},${indent}tooltip: {${indent}enabled: true}`;
    }
  );
  
  // Fix: plugins: { ... } - ensure proper closing after legend fix
  // Count braces in plugins section and add missing closing braces
  cleaned = cleaned.replace(
    /plugins:\s*\{[\s\S]*?\}\s*\}/g,
    (match) => {
      const openBraces = (match.match(/\{/g) || []).length;
      const closeBraces = (match.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        const lines = match.split('\n');
        const pluginsLine = lines.find(l => l.includes('plugins:'));
        const indent = pluginsLine ? pluginsLine.match(/^(\s*)plugins:/)?.[1] || '          ' : '          ';
        const missing = openBraces - closeBraces;
        return match.replace(/\}\s*$/, '}' + '}'.repeat(missing));
      }
      return match;
    }
  );
  
  // Fix: options={{ ... }} - ensure proper closing
  cleaned = cleaned.replace(
    /options=\{\{[\s\S]*?\}\s*\}/g,
    (match) => {
      const openBraces = (match.match(/\{/g) || []).length;
      const closeBraces = (match.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        const missing = openBraces - closeBraces;
        return match.replace(/\}\s*$/, '}' + '}'.repeat(missing));
      }
      return match;
    }
  );
  
  // ADDITIONAL FIX: Handle the case where the pattern appears without proper line breaks
  // Pattern: legend: { display: true, tooltip: { enabled: true, }}}
  cleaned = cleaned.replace(
    /legend:\s*\{[\s\S]*?display:\s*true\s*,\s*tooltip:\s*\{[\s\S]*?enabled:\s*true[\s\S]*?\}\s*\}\s*\}/g,
    (match) => {
      const lines = match.split('\n');
      const legendLine = lines.find(l => l.includes('legend:'));
      const indent = legendLine ? legendLine.match(/^(\s*)legend:/)?.[1] || '            ' : '            ';
      return `legend: {${indent}display: true},${indent}tooltip: {${indent}enabled: true}`;
    }
  );
  
  // CRITICAL FIX: Fix spread operator with undefined: { ...prev: undefined, ... } -> { ...prev, ... }
  // Pattern: { ...prev: undefined, email: ... } -> { ...prev, email: ... }
  // This handles cases where spread operator is incorrectly written with : undefined
  cleaned = cleaned.replace(
    /\{\s*\.\.\.\s*(\w+):\s*undefined\s*,/g,
    '{ ...$1,'
  );
  
  // Also fix without comma: { ...prev: undefined } -> { ...prev }
  cleaned = cleaned.replace(
    /\{\s*\.\.\.\s*(\w+):\s*undefined\s*\}/g,
    '{ ...$1 }'
  );
  
  // Fix missing values in object properties: { name: "Feature 1", included, { name: "Feature 2" }
  // Pattern: property name followed by comma and opening brace (missing value and closing brace)
  // This handles cases like: { name: "Feature 1", included, { name: "Feature 2" }
  // Handle both in regular objects and in arrays: features: [{ name: "...", included, { name: "..." }]
  cleaned = cleaned.replace(
    /(\{\s*[^}]*?)(\w+)\s*,\s*(\{)/g,
    (match, before, propName, nextBrace) => {
      // If property name is "included", "popular", or other boolean-like properties, add : true }, {
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true }, ${nextBrace}`;
        }
      }
      // Otherwise, add : undefined }, {
      if (!before.match(new RegExp(`${propName}\\s*:`))) {
        return `${before}${propName}: undefined }, ${nextBrace}`;
      }
      return match;
    }
  );
  
  // Fix missing values in object properties: { name: "Feature 1", included, ctaText: "..." }
  // Pattern: property name followed by comma (without value) before another property
  // This handles cases like: { name: "Feature 2", included, ctaText: "Sign Up" }
  cleaned = cleaned.replace(
    /(\{\s*[^}]*?)(\w+)\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/g,
    (match, before, propName, nextProp) => {
      // If property name is "included", "popular", or other boolean-like properties, add : true
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true, ${nextProp}`;
        }
      }
      // Otherwise, add : undefined
      if (!before.match(new RegExp(`${propName}\\s*:`))) {
        return `${before}${propName}: undefined, ${nextProp}`;
      }
      return match;
    }
  );
  
  // Fix double colons: included: true: undefined -> included: true
  cleaned = cleaned.replace(
    /(\w+):\s*true:\s*undefined/g,
    '$1: true'
  );
  
  // Fix nested tier objects in pricing tables: 
  // Problem: features: [{ name: "Feature 1" }, { name: "Premium", price: "$30", features: [...] }]
  // Should be: features: [{ name: "Feature 1" }] }, { name: "Premium", price: "$30", features: [...] }
  // Pattern: tier object (with name and price) nested inside features array
  // We need to close the features array, close the tier object, and start a new tier
  
  // Fix nested tier: when a tier object appears inside a features array within tiers
  // Pattern: features: [{ ... }, { name: "...", price: "...", features: [...] }]
  // Replace with: features: [{ ... }] }, { name: "...", price: "...", features: [...] }
  cleaned = cleaned.replace(
    /(features:\s*\[[^\]]*?)(\{\s*name:\s*"[^"]*",\s*price:\s*"[^"]*",\s*features:\s*\[)/g,
    (match, beforeFeatures, nextTier) => {
      // Close the features array with ], close the tier object with }, and start new tier
      return `${beforeFeatures}] }, ${nextTier}`;
    }
  );
  
  // Fix: tier object appearing after features array (simpler case)
  // Pattern: features: [...], { name: "...", price: "...", features: [...]
  cleaned = cleaned.replace(
    /(tiers\s*=\s*\[\s*\{[^}]*?features:\s*\[[^\]]*?\]\s*,\s*)(\{\s*name:\s*"[^"]*",\s*price:\s*"[^"]*",\s*features:)/g,
    (match, before, nextTier) => {
      // Close the previous tier object and start a new one
      return `${before}}, ${nextTier}`;
    }
  );
  
  // Fix missing values at end of object: { name: "...", included } -> { name: "...", included: true }
  cleaned = cleaned.replace(
    /(\{\s*[^}]*?)(\w+)\s*(\})/g,
    (match, before, propName, closing) => {
      // Only fix if it looks like a boolean property without a value at the end
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true${closing}`;
        }
      }
      return match;
    }
  );
  
  // Fix missing values before closing brace in arrays: [{ name: "...", included }] -> [{ name: "...", included: true }]
  cleaned = cleaned.replace(
    /(\[\s*\{[^}]*?)(\w+)\s*(\}\s*\])/g,
    (match, before, propName, closing) => {
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true${closing}`;
        }
      }
      return match;
    }
  );
  
  // Fix broken object literal: const app = {} "name": -> remove the invalid JSON object
  // Pattern: const app = {} followed by JSON-like object properties (not valid JS)
  // This handles cases where AI generates invalid object literals like:
  // const app = {}
  //   "name": "Landing Page",
  //   "screens": [...]
  cleaned = cleaned.replace(
    /const\s+app\s*=\s*\{\}\s*\n\s*"name":[\s\S]*?"navigation":\s*\[\]\s*\};?\s*\n?/g,
    ''
  );
  
  // More general fix: remove any const var = {} followed by JSON-like properties
  // This handles cases where AI generates invalid object literals with quoted keys
  cleaned = cleaned.replace(
    /const\s+\w+\s*=\s*\{\}\s*\n\s*"[^"]+":[\s\S]*?\};?\s*\n?/g,
    (match) => {
      // Only remove if it looks like JSON (starts with "key":) and contains common JSON patterns
      if (match.includes('"name":') || match.includes('"screens":') || match.includes('"navigation":') || 
          match.includes('"layout":') || match.includes('"component":')) {
        return '';
      }
      return match;
    }
  );
  
  // Fix recharts Tooltip and Legend: When recharts components (LineChart, BarChart, etc.) are used,
  // replace <Tooltip /> and <Legend /> with <RechartsTooltip /> and <RechartsLegend />
  // Pattern: Inside <LineChart>, <BarChart>, <AreaChart>, <PieChart>, <ComposedChart>, replace Tooltip/Legend
  const rechartsComponents = ['LineChart', 'BarChart', 'AreaChart', 'PieChart', 'ComposedChart'];
  rechartsComponents.forEach(component => {
    // Match the component opening tag and its children, then replace Tooltip/Legend within it
    cleaned = cleaned.replace(
      new RegExp(`(<${component}[^>]*>)([\\s\\S]*?)(</${component}>)`, 'g'),
      (match, openTag, content, closeTag) => {
        // Replace <Tooltip /> with <RechartsTooltip />
        let fixedContent = content.replace(/<Tooltip\s*([^>]*?)\s*\/?>/g, '<RechartsTooltip$1 />');
        // Replace <Legend /> with <RechartsLegend />
        fixedContent = fixedContent.replace(/<Legend\s*([^>]*?)\s*\/?>/g, '<RechartsLegend$1 />');
        return openTag + fixedContent + closeTag;
      }
    );
  });
  
  // Fix arrow functions in object literals that might be missing parentheses or have syntax errors
  // Pattern: accessor: row => row.name -> accessor: (row) => row.name
  // This ensures arrow functions in object properties have proper parentheses
  cleaned = cleaned.replace(
    /(\w+):\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*([^,}]+)/g,
    (match, propName, param, body) => {
      // Only fix if parameter doesn't have parentheses
      if (!param.includes('(') && !param.includes(')')) {
        return `${propName}: (${param}) => ${body}`;
      }
      return match;
    }
  );
  
  // NEW FIXES: React hooks and common patterns
  
  // Fix missing React import when hooks are used
  // Pattern: useState, useEffect, etc. used but no React import
  const hasHooks = /useState|useEffect|useCallback|useMemo|useRef|useContext/.test(cleaned);
  const hasReactImport = /import\s+.*\bReact\b.*from\s+["']react["']/.test(cleaned);
  const hasNamedImports = /import\s+\{[\s\S]*?\}\s+from\s+["']react["']/.test(cleaned);
  
  if (hasHooks && !hasReactImport && !hasNamedImports) {
    // Add React import at the top
    const firstImportMatch = cleaned.match(/^import\s+.*?from\s+["'][^"']+["']/m);
    if (firstImportMatch) {
      const firstImportIndex = cleaned.indexOf(firstImportMatch[0]);
      cleaned = cleaned.slice(0, firstImportIndex) + 
        "import React, { useState, useEffect } from \"react\";\n" + 
        cleaned.slice(firstImportIndex);
    } else {
      // No imports at all, add at the beginning
      cleaned = "import React, { useState, useEffect } from \"react\";\n" + cleaned;
    }
  }
  
  // Fix useState with missing initial value
  // Pattern: useState() -> useState(null) or useState([]) or useState({})
  cleaned = cleaned.replace(
    /useState\s*\(\s*\)/g,
    (match) => {
      // Try to infer type from variable name
      const context = cleaned.substring(Math.max(0, cleaned.indexOf(match) - 50), cleaned.indexOf(match));
      if (context.includes('data') || context.includes('items') || context.includes('list')) {
        return 'useState([])';
      }
      if (context.includes('form') || context.includes('state') || context.includes('config')) {
        return 'useState({})';
      }
      return 'useState(null)';
    }
  );
  
  // Fix useEffect with missing dependency array
  // Pattern: useEffect(() => { ... }) -> useEffect(() => { ... }, [])
  cleaned = cleaned.replace(
    /useEffect\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\}\s*\)(?!\s*,\s*\[)/g,
    (match) => {
      // Check if dependency array already exists
      if (!match.includes('],')) {
        return match.replace(/\}\s*\)$/, '}, [])');
      }
      return match;
    }
  );
  
  // Fix missing return statement in arrow functions used as props
  // Pattern: onClick={() => setValue(...)} -> onClick={() => { setValue(...); }}
  // This is usually fine, but if there's a syntax error, fix it
  cleaned = cleaned.replace(
    /onClick=\{\s*\([^)]*\)\s*=>\s*([^{][^}]+)\}/g,
    (match, body) => {
      // If body doesn't start with {, wrap it
      if (!body.trim().startsWith('{')) {
        return match.replace(body, `{ ${body} }`);
      }
      return match;
    }
  );
  
  // Fix template literals with missing backticks
  // Pattern: "text ${variable}" -> `text ${variable}`
  cleaned = cleaned.replace(
    /"([^"]*)\$\{([^}]+)\}([^"]*)"/g,
    (match, before, varName, after) => {
      return `\`${before}\${${varName}}${after}\``;
    }
  );
  
  // Fix async/await errors
  // Pattern: async function without await -> remove async if no await
  // Actually, keep async - it's fine even without await
  
  // Fix missing await in async functions
  // Pattern: fetch(...) in async function -> await fetch(...)
  // But be careful - only fix if it's in an async function context
  const asyncFunctionRegex = /async\s+(?:function\s+\w+|\([^)]*\))\s*=>\s*\{[\s\S]*?\}/g;
  let asyncMatch;
  while ((asyncMatch = asyncFunctionRegex.exec(cleaned)) !== null) {
    const asyncBody = asyncMatch[0];
    // Only fix fetch, axios, etc. that should be awaited
    const fixedBody = asyncBody.replace(
      /(fetch|axios\.(get|post|put|delete)|\.then\(|\.catch\()/g,
      (match) => {
        // Check if already has await
        const before = asyncBody.substring(0, asyncBody.indexOf(match));
        if (!before.includes('await')) {
          return `await ${match}`;
        }
        return match;
      }
    );
    if (fixedBody !== asyncBody) {
      cleaned = cleaned.replace(asyncBody, fixedBody);
    }
  }
  
  // Fix JSX self-closing tags
  // Pattern: <Component></Component> with no children -> <Component />
  cleaned = cleaned.replace(
    /<(\w+)([^>]*?)><\/\1>/g,
    (match, tagName, attrs) => {
      // Only fix if there are no children (empty tag)
      return `<${tagName}${attrs} />`;
    }
  );
  
  // Fix missing key prop in map functions
  // Pattern: {items.map(item => <Component />)} -> {items.map(item => <Component key={...} />)}
  cleaned = cleaned.replace(
    /\.map\s*\(\s*(\w+)\s*=>\s*<(\w+)([^>]*?)\s*\/>/g,
    (match, itemName, componentName, attrs) => {
      // Check if key already exists
      if (!attrs.includes('key=')) {
        // Try to find id or name property
        if (attrs.includes('id=')) {
          return match.replace(attrs, `${attrs} key={${itemName}.id}`);
        }
        return match.replace(attrs, `${attrs} key={${itemName}.id || ${itemName}.name || index}`);
      }
      return match;
    }
  );
  
  // Fix missing index parameter in map
  // Pattern: .map(item => ...) -> .map((item, index) => ...)
  cleaned = cleaned.replace(
    /\.map\s*\(\s*(\w+)\s*=>/g,
    (match, itemName) => {
      // Check if index is already used in the body
      const mapStart = cleaned.indexOf(match);
      const mapEnd = cleaned.indexOf(')', mapStart);
      const mapBody = cleaned.substring(mapStart, mapEnd);
      if (mapBody.includes('index') && !match.includes('index')) {
        return `.map((${itemName}, index) =>`;
      }
      return match;
    }
  );
  
  // Fix object destructuring errors
  // Pattern: const { prop } = obj; -> ensure obj exists
  // Actually, this is fine - no fix needed
  
  // Fix missing semicolons in critical places (optional, but helps)
  // Pattern: return <Component /> -> return <Component />; (not needed in JSX)
  // Actually, semicolons are optional in JSX returns
  
  // Fix console.log with template literals
  // Pattern: console.log("text " + variable) -> console.log(`text ${variable}`)
  cleaned = cleaned.replace(
    /console\.log\s*\(\s*"([^"]*)"\s*\+\s*(\w+)/g,
    (match, text, varName) => {
      return `console.log(\`${text}\${${varName}}\``;
    }
  );
  
  // Fix missing closing braces in JSX
  // Pattern: <div>{ -> ensure closing }
  // This is complex - we'll handle it with brace counting
  const braceCount = (cleaned.match(/\{/g) || []).length - (cleaned.match(/\}/g) || []).length;
  if (braceCount > 0) {
    // Add missing closing braces at the end (but be careful - this might break things)
    // Actually, don't auto-fix - let the user see the error
  }
  
  // Fix missing closing parentheses
  // Pattern: function call without closing )
  // Similar to braces - don't auto-fix
  
  // Fix React.Fragment shorthand
  // Pattern: <React.Fragment> -> <>
  cleaned = cleaned.replace(
    /<React\.Fragment>/g,
    '<>'
  );
  cleaned = cleaned.replace(
    /<\/React\.Fragment>/g,
    '</>'
  );
  
  // Fix Chart.register() -> ChartJS.register() (Chart is FragmentUI.Chart component, ChartJS is the class)
  // Pattern: Chart.register(...) -> ChartJS.register(...)
  cleaned = cleaned.replace(
    /Chart\.register\(/g,
    'ChartJS.register('
  );
  
  // Fix className with template literals
  // Pattern: className={"text " + variable} -> className={`text ${variable}`}
  cleaned = cleaned.replace(
    /className=\{\s*"([^"]*)"\s*\+\s*(\w+)\s*\}/g,
    (match, text, varName) => {
      return `className={\`${text}\${${varName}}\`}`;
    }
  );
  
  // Fix conditional rendering errors
  // Pattern: {condition && <Component />} -> ensure proper syntax
  // This is usually fine, but check for common errors
  cleaned = cleaned.replace(
    /\{\s*(\w+)\s*&&\s*<(\w+)/g,
    (match, condition, component) => {
      // Ensure condition is properly formatted
      return match;
    }
  );
  
  // Fix array methods chaining
  // Pattern: .map().filter() -> ensure proper syntax
  // Usually fine, but check for missing parentheses
  
  // Fix object property access errors
  // Pattern: obj.prop -> ensure obj exists (can't auto-fix)
  
  // Fix missing default export
  // Pattern: function Component() -> export default function Component()
  const hasDefaultExport = /export\s+default/.test(cleaned);
  const hasFunctionComponent = /^(export\s+)?(function|const)\s+[A-Z]\w*\s*[=\(]/.test(cleaned);
  if (!hasDefaultExport && hasFunctionComponent) {
    // Add export default before the first function/const component
    cleaned = cleaned.replace(
      /^((export\s+)?(function|const)\s+[A-Z]\w*)/m,
      'export default $1'
    );
  }
  
  return cleaned;
}

function fixIncorrectImports(code: string): string {
  let updatedCode = code;
  
  // Map of incorrect component names to correct ones
  const componentFixes: Record<string, string> = {
    'Dropdown': 'DropdownMenu',
    'DropdownTrigger': 'DropdownMenuTrigger',
    'DropdownContent': 'DropdownMenuContent',
    'DropdownItem': 'DropdownMenuItem',
    'DropdownLabel': 'DropdownMenuLabel',
    'DropdownSeparator': 'DropdownMenuSeparator',
  };
  
  // Components that don't exist and should be replaced with HTML elements
  const nonExistentComponents: Record<string, string> = {
    'CardImage': 'img', // CardImage doesn't exist, use <img> instead
  };
  
  // Fix imports
  for (const [incorrect, correct] of Object.entries(componentFixes)) {
    // Fix import statements: import { Dropdown } -> import { DropdownMenu }
    const importPattern = new RegExp(
      `(import\\s*\\{[^}]*?)\\b${incorrect}\\b([^}]*?\\}\\s*from\\s*["']@fragment_ui/ui["'])`,
      'g'
    );
    updatedCode = updatedCode.replace(importPattern, (match, before, after) => {
      // Check if correct name is already imported
      if (before.includes(correct)) {
        // Remove incorrect import
        return before.replace(new RegExp(`,\\s*${incorrect}\\s*|\\s*${incorrect}\\s*,`), '') + after;
      }
      // Replace incorrect with correct
      return before.replace(incorrect, correct) + after;
    });
    
    // Fix JSX usage: <Dropdown -> <DropdownMenu
    const jsxPattern = new RegExp(
      `(<|</)${incorrect}(\\s|>|/|$)`,
      'g'
    );
    updatedCode = updatedCode.replace(jsxPattern, `$1${correct}$2`);
  }
  
  // Fix non-existent components (remove from imports and replace with HTML elements)
  for (const [nonExistent, htmlElement] of Object.entries(nonExistentComponents)) {
    // Remove from imports
    const importPattern = new RegExp(
      `(import\\s*\\{[^}]*?)\\b${nonExistent}\\b([^}]*?\\}\\s*from\\s*["']@fragment_ui/ui["'])`,
      'g'
    );
    updatedCode = updatedCode.replace(importPattern, (match, before, after) => {
      // Remove the non-existent component from import
      const cleaned = before.replace(new RegExp(`,\\s*${nonExistent}\\s*|\\s*${nonExistent}\\s*,`), '');
      // If import becomes empty, remove the whole import line
      if (cleaned.trim() === 'import {') {
        return '';
      }
      return cleaned + after;
    });
    
    // Replace JSX usage: <CardImage src="..." /> -> <img src="..." />
    // Match opening tag with props
    const jsxOpenPattern = new RegExp(
      `<${nonExistent}(\\s+[^>]*?)(/?>)`,
      'g'
    );
    updatedCode = updatedCode.replace(jsxOpenPattern, (match, props, closing) => {
      // Preserve props but change component name to HTML element
      return `<${htmlElement}${props}${closing}`;
    });
    
    // Replace closing tag: </CardImage> -> </img>
    const jsxClosePattern = new RegExp(
      `</${nonExistent}>`,
      'g'
    );
    updatedCode = updatedCode.replace(jsxClosePattern, `</${htmlElement}>`);
  }
  
  return updatedCode;
}

/**
 * Automatically add missing data-ui-id attributes to components
 * This ensures element selection works even if OpenAI doesn't add data-ui-id
 */
function addMissingDataUiIds(code: string): string {
  let updatedCode = code;
  let counter = 0;
  const addedIds: string[] = [];
  
  // List of Fragment UI components that should have data-ui-id
  // IMPORTANT: Order matters - longer names first to avoid partial matches
  // e.g., "DialogTrigger" must come before "Dialog" to avoid matching "Dialog" in "DialogTrigger"
  const componentNames = [
    'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem',
    'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter',
    'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
    'TabsList', 'TabsTrigger', 'TabsContent',
    'DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter',
    'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
    'FormFieldEnhanced', 'FormEnhanced',
    'NavigationHeader', 'SettingsScreen', 'DashboardLayout', 'DataTable',
    'FormContainer', 'CardGrid', 'PricingTable', 'AuthenticationBlock',
    'Button', 'Input', 'Textarea', 'Select', 'Checkbox', 'RadioGroup', 'Radio', 'Switch', 
    'DatePicker', 'FileUpload', 'Slider', 'Rating', 'ColorPicker', 'TagInput',
    'Card', 'Table', 'Tabs', 'Dialog', 'Popover', 'Tooltip', 'Alert', 'Sheet', 'HoverCard',
    'Accordion', 'Avatar', 'Badge', 'Breadcrumbs', 'Carousel',
    'Progress', 'Spinner', 'Skeleton', 'Separator', 'Stepper', 'Timeline', 'AspectRatio',
    'Pagination', 'NavigationMenu', 'Menubar', 'Sidebar', 'Resizable',
    'Collapsible', 'ContextMenu', 'DropdownMenu', 'ScrollArea', 'SegmentedControl',
    'TreeView', 'VirtualList', 'SplitButton', 'Toggle', 'ToggleGroup', 'Kbd',
    'FormField', 'Form'
  ];
  
  // Sort by length (longest first) to avoid partial matches
  const sortedComponents = componentNames.sort((a, b) => b.length - a.length);
  
  // Pattern to match JSX elements without data-ui-id
  // Use word boundaries to ensure we match complete component names only
  for (const componentName of sortedComponents) {
    // Escape component name for regex
    const escapedName = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match opening tags: <ComponentName ... > or />
    // Use word boundary to ensure we match complete component names
    // Pattern: <ComponentName followed by whitespace, >, or /> (not another letter)
    // CRITICAL: We need to be very careful with onClick values that contain nested braces
    // The pattern [^>]*? can incorrectly match when onClick contains complex expressions
    // So we use a more sophisticated approach: match attributes one by one, avoiding onClick values
    const pattern = new RegExp(
      `(<${escapedName})(?![a-zA-Z])((?:(?!onClick\\s*=\\s*\\{)[^>])*?)(/?>)`,
      'g'
    );
    
    updatedCode = updatedCode.replace(pattern, (match, tagPart, rest, closing) => {
      // Skip if already has data-ui-id (check both in match and in rest)
      if (match.includes('data-ui-id') || rest.includes('data-ui-id')) {
        return match;
      }
      
      // Skip if this is a closing tag (starts with </)
      if (tagPart.includes('</')) {
        return match;
      }
      
      // Generate a unique ID
      const id = `${componentName.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}-${counter++}`;
      addedIds.push(id);
      
      // Check if rest contains onClick or other function props
      // We need to be VERY careful not to insert data-ui-id inside the onClick value
      // The regex [^>]*? can incorrectly match when onClick contains complex values
      // So we ALWAYS add data-ui-id at the end if we detect onClick or arrow functions
      const hasOnClick = rest && /onClick\s*=\s*\{/.test(rest);
      const hasArrowFunction = rest && (rest.includes('=>') || rest.includes('() =>'));
      
      // If rest contains onClick or arrow functions, we MUST add data-ui-id at the very end
      // after all attributes, never inside onClick={...}
      // We do this by always appending to the end of rest, which should be safe
      if (hasOnClick || hasArrowFunction) {
        // CRITICAL: Always add at the very end, after ALL props
        // Don't try to parse or insert in the middle - just append
        // The rest should end with whitespace or a quote/brace, so we add space + data-ui-id
        return `${tagPart}${rest} data-ui-id="${id}"${closing}`;
      }
      
      // Add data-ui-id right after component name
      if (rest && rest.trim()) {
        // Has props, add data-ui-id after first whitespace
        const whitespaceMatch = rest.match(/^(\s+)/);
        if (whitespaceMatch) {
          const whitespace = whitespaceMatch[1];
          const afterWhitespace = rest.substring(whitespace.length);
          // If whitespace contains newline, preserve it; otherwise add space
          if (whitespace.includes('\n')) {
            return `${tagPart}${whitespace}data-ui-id="${id}"${afterWhitespace}${closing}`;
          } else {
            return `${tagPart}${whitespace}data-ui-id="${id}" ${afterWhitespace}${closing}`;
          }
        }
        // No leading whitespace, add space before data-ui-id
        return `${tagPart} data-ui-id="${id}"${rest}${closing}`;
      } else {
        // No props, just add data-ui-id
        return `${tagPart} data-ui-id="${id}"${closing}`;
      }
    });
  }
  
  // Also add data-ui-id to container elements (div, form, section, header, nav, a, button) that don't have it
  // This ensures that internal HTML elements in blocks like NavigationHeader get data-ui-id attributes
  // Strategy: Add data-ui-id to HTML elements that are near Fragment UI components or block components
  const htmlContainerTags = ['div', 'form', 'section', 'header', 'nav', 'a', 'button', 'main', 'article', 'aside', 'footer'];
  const blockComponents = ['NavigationHeader', 'SettingsScreen', 'DashboardLayout', 'DataTable', 
                           'FormContainer', 'CardGrid', 'PricingTable', 'AuthenticationBlock'];
  
  // First, check if the code contains any block components
  const hasBlockComponents = blockComponents.some(name => 
    updatedCode.includes(`<${name}`) || updatedCode.includes(`<${name} `)
  );
  
  // If code contains block components, add data-ui-id to all HTML container elements that don't have it
  // This ensures internal elements in blocks are selectable
  if (hasBlockComponents) {
    for (const tag of htmlContainerTags) {
      const containerPattern = new RegExp(
        `(<${tag})(\\s+[^>]*?)?(?![^>]*data-ui-id=["'][^"']*["'])([^>]*?)(\\/?>)`,
        'g'
      );
      
      // Use a replacement function with a position tracker
      let lastIndex = 0;
      updatedCode = updatedCode.replace(containerPattern, (match, tagPart, props1, props2, closing, offset) => {
        // Skip if already has data-ui-id (check both in match and in props)
        if (match.includes('data-ui-id') || (props1 && props1.includes('data-ui-id')) || (props2 && props2.includes('data-ui-id'))) {
          return match;
        }
        
        // Check context: look around this match to see if we're in relevant code
        const contextStart = Math.max(0, offset - 200);
        const contextEnd = Math.min(updatedCode.length, offset + match.length + 500);
        const context = updatedCode.substring(contextStart, contextEnd);
        
        // Add data-ui-id if this element is near Fragment UI components or block components
        const hasNearbyComponents = sortedComponents.some(name => 
          context.includes(`<${name}`) || context.includes(`</${name}`)
        ) || blockComponents.some(name => 
          context.includes(`<${name}`) || context.includes(`</${name}`)
        );
        
        if (hasNearbyComponents) {
          const id = `${tag}-${counter++}`;
          addedIds.push(id);
          const allProps = (props1 || '') + (props2 || '');
          if (allProps.trim()) {
            return `<${tag}${allProps} data-ui-id="${id}"${closing}`;
          } else {
            return `<${tag} data-ui-id="${id}"${closing}`;
          }
        }
        
        return match;
      });
    }
  } else {
    // Original logic for non-block components: only add to containers that have Fragment components
    const containerPattern = /<(div|form|section)(\s+[^>]*?)?(?![^>]*data-ui-id=["'][^"']*["'])([^>]*?)(\/?>)/g;
    updatedCode = updatedCode.replace(containerPattern, (match, tag, props1, props2, closing, offset) => {
      // Skip if already has data-ui-id (check both in match and in props)
      if (match.includes('data-ui-id') || (props1 && props1.includes('data-ui-id')) || (props2 && props2.includes('data-ui-id'))) {
        return match;
      }
      
      // Check if this container likely contains Fragment UI components
      const contextStart = Math.max(0, offset - 100);
      const contextEnd = Math.min(updatedCode.length, offset + match.length + 500);
      const context = updatedCode.substring(contextStart, contextEnd);
      const hasFragmentComponents = sortedComponents.some(name => 
        context.includes(`<${name}`) || context.includes(`</${name}`)
      );
      
      if (hasFragmentComponents) {
        const id = `container-${counter++}`;
        addedIds.push(id);
        const allProps = (props1 || '') + (props2 || '');
        if (allProps.trim()) {
          return `<${tag}${allProps} data-ui-id="${id}"${closing}`;
        } else {
          return `<${tag} data-ui-id="${id}"${closing}`;
        }
      }
      
      return match;
    });
  }
  
  if (addedIds.length > 0) {
    console.log(`[API Generate] Added ${addedIds.length} missing data-ui-id attributes:`, addedIds.slice(0, 10));
  }
  
  return updatedCode;
}

/**
 * Automatically add missing imports to generated code
 */
function addMissingImports(code: string): string {
  // List of all available Fragment UI components (NOT blocks - blocks are separate)
  const availableComponents = [
    // Form & Input
    "Button", "Input", "Textarea", "Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem",
    "Checkbox", "RadioGroup", "Radio", "Switch", "DatePicker", "FileUpload", "Slider", "Rating", "ColorPicker", "TagInput",
    "Calendar", "MultiSelect", "Combobox", "CommandPalette",
    // Card
    "Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter",
    // Table
    "Table", "TableHeader", "TableBody", "TableRow", "TableHead", "TableCell", "DataTable", "VirtualTable",
    // Tabs
    "Tabs", "TabsList", "TabsTrigger", "TabsContent",
    // Dialog & Overlays
    "Dialog", "Popover", "Tooltip", "Alert", "Sheet", "HoverCard",
    // Display
    "Accordion", "Avatar", "Badge", "Breadcrumbs", "Carousel",
    "Progress", "Spinner", "Skeleton", "Separator", "Stepper", "Timeline", "AspectRatio",
    // Navigation & Layout
    "Pagination", "NavigationMenu", "Menubar", "Sidebar", "Resizable",
    "Collapsible", "ContextMenu", "DropdownMenu", "ScrollArea", "SegmentedControl",
    // Advanced
    "TreeView", "VirtualList", "SplitButton", "Toggle", "ToggleGroup", "Kbd",
    // Form utilities
    "FormField", "validateValue", "ValidationRules", "validators", "toast", "Toaster"
    // NOTE: NavigationHeader, SettingsScreen, DashboardLayout, etc. are in @fragment_ui/blocks, NOT @fragment_ui/ui
  ];
  
  // List of available Fragment UI Blocks
  const availableBlocks = [
    "SettingsScreen", "DashboardLayout", "DataTable", 
    "FormContainer", "CardGrid", "NavigationHeader", "PricingTable", "AuthenticationBlock"
  ];
  
  // Find all component usages in JSX (e.g., <Table>, <TableHeader>, etc.)
  const componentUsages = new Set<string>();
  const blockUsages = new Set<string>();
  const jsxPattern = /<(\w+)(?:\s|>|$)/g;
  let match;
  const htmlTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'form', 'label', 'ul', 'li', 'ol', 'a', 'img', 'svg', 'path', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'title', 'defs', 'clipPath', 'use', 'mask', 'pattern', 'linearGradient', 'radialGradient', 'stop', 'filter', 'feGaussianBlur', 'feColorMatrix', 'feOffset', 'feComposite', 'feMerge', 'feMergeNode', 'feFlood', 'feBlend', 'feImage', 'feConvolveMatrix', 'feDisplacementMap', 'feTurbulence', 'feMorphology', 'feTile', 'feDiffuseLighting', 'feSpecularLighting', 'feDistantLight', 'fePointLight', 'feSpotLight', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence'];
  
  while ((match = jsxPattern.exec(code)) !== null) {
    const componentName = match[1];
    // Check if it's a Fragment UI component
    if (availableComponents.includes(componentName) && !htmlTags.includes(componentName.toLowerCase())) {
      componentUsages.add(componentName);
    }
    // Check if it's a Fragment UI Block
    if (availableBlocks.includes(componentName)) {
      blockUsages.add(componentName);
    }
  }
  
  // Also check for function calls like toast.success(), validateValue(), etc.
  const functionPattern = /\b(toast|validateValue|validators)\./g;
  while ((match = functionPattern.exec(code)) !== null) {
    componentUsages.add(match[1]);
  }
  
  // Check for ValidationRules type usage
  if (code.includes('ValidationRules')) {
    componentUsages.add('ValidationRules');
  }
  
  // Find existing imports from @fragment_ui/ui
  const uiImportMatch = code.match(/import\s*\{([^}]+)\}\s*from\s*["']@fragment\/ui["'];?/s);
  const existingUIImports = new Set<string>();
  if (uiImportMatch) {
    const importContent = uiImportMatch[1];
    const importList = importContent
      .split(/[,\n]/)
      .map(imp => imp.trim())
      .filter(imp => imp && !imp.startsWith('//') && !imp.startsWith('/*'));
    importList.forEach(imp => existingUIImports.add(imp));
    // Remove any blocks that were incorrectly imported from @fragment_ui/ui
    availableBlocks.forEach(block => {
      if (existingUIImports.has(block)) {
        existingUIImports.delete(block);
      }
    });
  }
  
  // Find existing imports from @fragment_ui/blocks
  const blocksImportMatch = code.match(/import\s*\{([^}]+)\}\s*from\s*["']@fragment\/blocks["'];?/s);
  const existingBlocksImports = new Set<string>();
  if (blocksImportMatch) {
    const importContent = blocksImportMatch[1];
    const importList = importContent
      .split(/[,\n]/)
      .map(imp => imp.trim())
      .filter(imp => imp && !imp.startsWith('//') && !imp.startsWith('/*'));
    importList.forEach(imp => existingBlocksImports.add(imp));
  }
  
  // Find missing imports
  // Filter out blocks from UI imports (blocks should only be in blocks imports)
  const uiComponentUsages = Array.from(componentUsages).filter(comp => !availableBlocks.includes(comp));
  const missingUIImports = uiComponentUsages.filter(comp => !existingUIImports.has(comp));
  const missingBlocksImports = Array.from(blockUsages).filter(block => !existingBlocksImports.has(block));
  
  // Check if there are blocks incorrectly imported from @fragment_ui/ui
  const blocksInUIImports = Array.from(existingUIImports).filter(imp => availableBlocks.includes(imp));
  const needsCleanup = blocksInUIImports.length > 0;
  
  if (missingUIImports.length === 0 && missingBlocksImports.length === 0 && !needsCleanup) {
    return code; // No missing imports and no cleanup needed
  }
  
  let updatedCode = code;
  
  // Clean up blocks from UI imports (even if no missing imports)
  if (needsCleanup || missingUIImports.length > 0) {
    if (uiImportMatch) {
      // Remove blocks from UI imports
      const cleanedExisting = Array.from(existingUIImports).filter(imp => !availableBlocks.includes(imp));
      const allImports = missingUIImports.length > 0 
        ? Array.from(new Set([...cleanedExisting, ...missingUIImports])).sort()
        : Array.from(cleanedExisting).sort();
      
      if (allImports.length > 0) {
        const newImportStatement = `import {\n  ${allImports.join(",\n  ")}\n} from "@fragment_ui/ui";`;
        updatedCode = updatedCode.replace(uiImportMatch[0], newImportStatement);
      } else {
        // Remove the entire import if no components left
        updatedCode = updatedCode.replace(uiImportMatch[0], "");
      }
    }
  }
  
  // Add missing UI imports (if not already handled above)
  if (missingUIImports.length > 0 && !uiImportMatch) {
    missingUIImports.sort();
    // Create new import statement after "use client" or at the beginning
    const useClientMatch = updatedCode.match(/("use client";\s*\n)/);
    if (useClientMatch) {
      const newImportStatement = `import {\n  ${missingUIImports.join(",\n  ")}\n} from "@fragment_ui/ui";`;
      updatedCode = updatedCode.replace(useClientMatch[0], useClientMatch[0] + "\n" + newImportStatement + "\n");
    } else {
      // Add at the beginning
      const newImportStatement = `import {\n  ${missingUIImports.join(",\n  ")}\n} from "@fragment_ui/ui";\n\n`;
      updatedCode = newImportStatement + updatedCode;
    }
  }
  
  // Add missing Blocks imports
  if (missingBlocksImports.length > 0) {
    missingBlocksImports.sort();
    if (blocksImportMatch) {
      // Update existing import
      const allImports = Array.from(new Set([...Array.from(existingBlocksImports), ...missingBlocksImports])).sort();
      const newImportStatement = `import {\n  ${allImports.join(",\n  ")}\n} from "@fragment_ui/blocks";`;
      updatedCode = updatedCode.replace(blocksImportMatch[0], newImportStatement);
    } else {
      // Create new import statement after UI import or "use client"
      const useClientMatch = updatedCode.match(/("use client";\s*\n)/);
      const uiImportMatchAfter = updatedCode.match(/import\s*\{[^}]+\}\s*from\s*["']@fragment\/ui["'];?\s*\n/);
      
      if (uiImportMatchAfter) {
        // Add after UI import
        const newImportStatement = `import {\n  ${missingBlocksImports.join(",\n  ")}\n} from "@fragment_ui/blocks";\n`;
        updatedCode = updatedCode.replace(uiImportMatchAfter[0], uiImportMatchAfter[0] + newImportStatement);
      } else if (useClientMatch) {
        // Add after "use client"
        const newImportStatement = `import {\n  ${missingBlocksImports.join(",\n  ")}\n} from "@fragment_ui/blocks";\n`;
        updatedCode = updatedCode.replace(useClientMatch[0], useClientMatch[0] + "\n" + newImportStatement);
      } else {
        // Add at the beginning
        const newImportStatement = `import {\n  ${missingBlocksImports.join(",\n  ")}\n} from "@fragment_ui/blocks";\n\n`;
        updatedCode = newImportStatement + updatedCode;
      }
    }
  }
  
  return updatedCode;
}

/**
 * Generate code using OpenAI API
 */
async function generateWithOpenAI(prompt: string, existingCode?: string): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
  }

  const systemPrompt = `You are an expert React developer specializing in the Fragment UI design system.

Your task is to generate complete, working React components using Fragment UI components.

**CRITICAL REQUIREMENT - Element Selection (data-ui-id):**
- **MUST add data-ui-id attribute to EVERY Fragment UI component** (Button, Input, Card, Tabs, FormField, etc.)
- **MUST add data-ui-id to container elements** (form, div, section) that wrap related content
- **Format:** Use kebab-case with component type prefix: data-ui-id="button-submit", data-ui-id="input-email", data-ui-id="card-form"
- **Examples:**
  - <Button data-ui-id="button-submit">Submit</Button>
  - <Input data-ui-id="input-email" placeholder="Email" />
  - <Card data-ui-id="card-form"><CardContent data-ui-id="card-content-form">...</CardContent></Card>
  - <form data-ui-id="form-contact">...</form>
- **Why:** This enables element selection, inspection, and conversational editing in the playground
- **Rule:** Every Fragment UI component and major container MUST have a unique data-ui-id attribute

## FRAGMENT UI COMPONENT LIBRARY

### Core Components

**Button**
- Props: variant?: "solid" | "outline" | "ghost", size?: "sm" | "md" | "lg", leadingIcon?: ReactNode, trailingIcon?: ReactNode, loading?: boolean, loadingText?: string
- Example: <Button variant="solid" size="md">Click me</Button>

**Input**
- Props: size?: "sm" | "md" | "lg", loading?: boolean, error?: boolean, leadingIcon?: ReactNode, trailingIcon?: ReactNode
- Example: <Input placeholder="Enter text" error={hasError} />

**FormField**
- Props: label?: string, error?: string | boolean, helperText?: string, required?: boolean, children: ReactNode
- Wraps form inputs to provide labels, errors, and helper text
- Example: <FormField label="Email" error={emailError} required><Input /></FormField>

**Card Components**
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- IMPORTANT: CardImage does NOT exist - use regular <img> tag inside Card instead
- Example: <Card><img src="..." alt="..." /><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Content</CardContent></Card>

**Checkbox**
- Props: checked?: boolean, onCheckedChange?: (checked: boolean) => void, disabled?: boolean
- Example: <Checkbox checked={value} onCheckedChange={setValue} />

**Select Components**
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Example: <Select value={value} onValueChange={setValue}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">Option 1</SelectItem></SelectContent></Select>

**Textarea**
- Props: size?: "sm" | "md" | "lg", error?: boolean
- Example: <Textarea placeholder="Enter text" />

**Switch**
- Props: checked?: boolean, onCheckedChange?: (checked: boolean) => void
- Example: <Switch checked={value} onCheckedChange={setValue} />

**RadioGroup & Radio**
- Example: <RadioGroup value={value} onValueChange={setValue}><Radio value="1">Option 1</Radio></RadioGroup>

**Tabs Components**
- Components: Tabs (root), TabsList (container), TabsTrigger (tab button), TabsContent (tab content)
- Props: Tabs: defaultValue or value + onValueChange, TabsList: variant?: "default" | "pills" | "underline" | "boxed", TabsTrigger: value (required), TabsContent: value (required)
- IMPORTANT: Use Tabs, TabsList, TabsTrigger, TabsContent - NOT "Tab" component (it doesn't exist!)
- Example: 
  <Tabs defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>

### Form Validation

**validateValue(value, rules)**
- Validates a value against ValidationRules
- Returns: string | undefined (error message or undefined if valid)
- Import: import { validateValue, ValidationRules } from "@fragment_ui/ui"

**ValidationRules**
- Interface: { required?: { message?: string }, minLength?: { value: number; message?: string }, maxLength?: { value: number; message?: string }, email?: { message?: string }, pattern?: { value: RegExp; message?: string }, custom?: ValidationRule[] }
- Example: { required: { message: "Required" }, email: { message: "Invalid email" }, minLength: { value: 8, message: "Min 8 chars" } }

**validators** (helper functions)
- Import: import { validators } from "@fragment_ui/ui"
- validators.required(message), validators.email(message), validators.minLength(length, message), validators.maxLength(length, message), validators.pattern(regex, message), validators.compose(...rules)

### Toast Notifications

**CRITICAL: Toast is a FUNCTION, NOT a component!**
- Import: import { toast } from "@fragment_ui/ui"
- Usage: toast.success("Message"), toast.error("Message"), toast.info("Message"), toast.warning("Message")
- NEVER use <Toast /> as a component - it will cause errors!
- Toaster component must be added to layout: <Toaster />

### Additional Components Available

**Form & Input Components:**
- DatePicker, FileUpload, Slider, Rating, ColorPicker, TagInput
- Calendar, MultiSelect, Combobox, CommandPalette

**Display Components:**
- Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DataTable, VirtualTable
- Accordion, Alert, Avatar, Badge, Breadcrumbs, Carousel
- Progress, Spinner, Skeleton, Separator, Stepper, Timeline
- AspectRatio, HoverCard, Popover, Tooltip

**Navigation & Layout:**
- Pagination, NavigationMenu, Menubar, Sidebar, Resizable
- Dialog, Sheet, Collapsible, ContextMenu, DropdownMenu
- ScrollArea, SegmentedControl, Toggle, ToggleGroup

**Advanced Components:**
- TreeView, VirtualList, SplitButton, Kbd

**Fragment UI Blocks (from @fragment_ui/blocks):**

**SettingsScreen**
- Complete settings page with preferences and profile sections
- No props required
- Example: <SettingsScreen />

**DashboardLayout**
- Dashboard layout with sidebar, header, and main content area
- Props: sidebar?: ReactNode, header?: ReactNode, children?: ReactNode, defaultTab?: string
- Example: <DashboardLayout sidebar={<Sidebar />} header={<Header />}><Content /></DashboardLayout>

**DataTable**
- Advanced data table with sorting and filtering capabilities
- Props: data: Array<any>, columns: Array<{key: string, label: string, sortable?: boolean}>, onRowClick?: (row: any) => void
- Example: <DataTable data={users} columns={[{key: "name", label: "Name"}]} />

**FormContainer**
- Form wrapper with title, description, and submit handler
- Props: title?: string, description?: string, onSubmit?: (data: any) => void, children?: ReactNode
- Example: <FormContainer title="Contact Form" onSubmit={handleSubmit}><FormFields /></FormContainer>

**CardGrid**
- Responsive card grid layout for displaying cards
- Props: title?: string, cards?: Array<{title: string, description?: string, action?: {label: string, href?: string, onClick?: () => void}}>, columns?: 1 | 2 | 3 | 4
- Example: <CardGrid title="Features" cards={[{title: "Feature 1", description: "Description"}]} columns={3} />

**NavigationHeader**
- Navigation header with logo, links, and optional mobile menu
- Props: logo?: ReactNode, logoText?: string, logoHref?: string, links?: Array<{href: string, label: string}>, mobileMenu?: boolean
- Example: <NavigationHeader logoText="My App" links={[{href: "/", label: "Home"}]} />

**PricingTable**
- Pricing table component with multiple tiers
- Props: tiers: Array<{name: string, price: string, features: Array<{name: string, included?: boolean}>, ctaText: string, popular?: boolean}>
- Example: <PricingTable tiers={[{name: "Basic", price: "$10", features: [{name: "Feature 1"}], ctaText: "Get Started"}]} />

**AuthenticationBlock**
- Complete login/signup form with social login support
- Props: mode?: "login" | "signup", onModeChange?: (mode: string) => void, onSubmit?: (data: {email, password, name?, confirmPassword?}) => void, onSocialLogin?: (provider: string) => void, socialProviders?: Array<{name: string, onClick: () => void}>, showSocialLogin?: boolean, title?: string, description?: string, error?: string, loading?: boolean
- Example: <AuthenticationBlock mode="login" onSubmit={handleLogin} />

**IMPORTANT:**
- For Tabs, use Tabs, TabsList, TabsTrigger, TabsContent - NOT "Tab" (it doesn't exist!)
- Blocks are imported from "@fragment_ui/blocks", not "@fragment_ui/ui"
- Example: import { SettingsScreen, DashboardLayout, AuthenticationBlock } from "@fragment_ui/blocks"
- Use blocks for complete, ready-to-use UI patterns

## CODE GENERATION REQUIREMENTS

1. **Always use TypeScript** with proper types
2. **Always include proper imports** from "@fragment_ui/ui"
3. **Use "use client" directive** for all client components
4. **Form Validation Pattern:**
   - Use validateValue() for validation
   - Store errors in state: const [errors, setErrors] = useState<Record<string, string>>({})
   - Validate on blur or submit: const error = validateValue(value, rules)
   - Display errors via FormField: <FormField error={errors.email}>
5. **State Management:**
   - Use useState for form state
   - Use useState for errors: useState<Record<string, string>>({})
   - Use useState for loading states
6. **Error Handling:**
   - Always validate user input
   - Show user-friendly error messages
   - Use toast.success() / toast.error() for feedback (NOT <Toast /> component!)
7. **Component Structure:**
   - Export default the main component
   - Use descriptive component names (e.g., RegistrationForm, ContactForm)
   - Include proper TypeScript interfaces for props
8. **Best Practices:**
   - Use FormField to wrap inputs for consistent styling and error display
   - Use Card components for grouping related content
   - Use Button with loading state for async operations
   - Always handle form submission with preventDefault()
   - Include proper accessibility attributes (aria-*)
   - **CRITICAL: Never use alert(), confirm(), or prompt()** - use toast notifications instead
   - All user feedback must use toast.success(), toast.error(), toast.info(), or toast.warning()
   - **Form Width:** When generating forms, wrap them in a container with className="w-full max-w-md mx-auto p-6" and add className="w-full" to the Card component to ensure forms are not stretched full width
   - **CRITICAL: Element Selection - Add data-ui-id to ALL interactive and structural elements:**
     - **MUST add data-ui-id attribute to every Fragment UI component** (Button, Input, Card, Tabs, etc.)
     - **MUST add data-ui-id to container elements** (div, form, section) that wrap related content
     - **Format:** Use kebab-case with component type prefix: data-ui-id="button-submit", data-ui-id="input-email", data-ui-id="card-form", data-ui-id="tabs-settings"
     - **Examples:**
       - <Button data-ui-id="button-submit">Submit</Button>
       - <Input data-ui-id="input-email" placeholder="Email" />
       - <Card data-ui-id="card-form"><CardContent data-ui-id="card-content-form">...</CardContent></Card>
       - <Tabs data-ui-id="tabs-settings"><TabsTrigger data-ui-id="tabs-trigger-profile" value="profile">Profile</TabsTrigger></Tabs>
     - **Why:** This enables element selection, inspection, and conversational editing in the playground
     - **Rule:** Every Fragment UI component and major container MUST have a unique data-ui-id

## COMMON PATTERNS

**Form with Validation:**
\`\`\`tsx
"use client";
import { useState } from "react";
import { Input, Button, FormField, validateValue, ValidationRules, toast } from "@fragment_ui/ui";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const emailRules: ValidationRules = {
    required: { message: "Email is required" },
    email: { message: "Invalid email" }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateValue(email, emailRules);
    if (error) {
      setErrors({ email: error });
      return;
    }
    toast.success("Form submitted!");
  };
  
  return (
    <form onSubmit={handleSubmit} data-ui-id="form-contact">
      <FormField label="Email" error={errors.email} required>
        <Input 
          data-ui-id="input-email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            const error = validateValue(email, emailRules);
            setErrors(prev => ({ ...prev, email: error || "" }));
          }}
        />
      </FormField>
      <Button type="submit" data-ui-id="button-submit">Submit</Button>
    </form>
  );
}
\`\`\`

**Dashboard with Metrics and Table:**
\`\`\`tsx
"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, toast } from "@fragment_ui/ui";

export default function UserDashboard() {
  const [users] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
  ]);

  const handleAction = (userId: number) => {
    // NEVER use alert() - use toast instead
    toast.success(\`Action performed for user \${userId}\`);
  };

  return (
    <div className="space-y-6" data-ui-id="dashboard-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-ui-id="metrics-grid">
        <Card data-ui-id="card-metrics-total">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200</div>
          </CardContent>
        </Card>
        <Card data-ui-id="card-metrics-active">
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">800</div>
          </CardContent>
        </Card>
        <Card data-ui-id="card-metrics-revenue">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,000</div>
          </CardContent>
        </Card>
      </div>
      
      <Card data-ui-id="card-users-table">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table data-ui-id="table-users">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} data-ui-id={\`table-row-user-\${user.id}\`}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleAction(user.id)} data-ui-id={\`button-action-\${user.id}\`}>Action</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
\`\`\`

**CRITICAL: NEVER use alert(), confirm(), or prompt()**
- ❌ BAD: alert("Message") - doesn't work in sandboxed iframes
- ✅ GOOD: toast.success("Message") - works everywhere
- ❌ BAD: confirm("Are you sure?") - doesn't work in sandboxed iframes  
- ✅ GOOD: Use Dialog component for confirmations
- ❌ BAD: prompt("Enter value") - doesn't work in sandboxed iframes
- ✅ GOOD: Use Input component in a Dialog

${existingCode ? '\n## MODIFICATION MODE\n\nYou are modifying existing code. Here is the current code:\n\n' + existingCode + '\n\nModify it according to the user\'s request while:\n- Maintaining the existing structure and functionality\n- Preserving existing state management\n- Keeping the same component name\n- Only changing what\'s requested\n- **Remove any alert(), confirm(), or prompt() calls** and replace with toast notifications\n' : ''}

## OUTPUT FORMAT

Generate ONLY the component code in TypeScript/TSX format. Do not include explanations, markdown formatting, or code block markers unless the code itself contains them. The code should be ready to copy and paste directly.`;

  const userPrompt = existingCode 
    ? `Modify the existing component: ${prompt}`
    : prompt;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // Use gpt-4o-mini for cost efficiency
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let generatedCode = completion.choices[0].message.content || "";
    
    // Extract code from markdown code blocks if present
    const codeBlockMatch = generatedCode.match(/```(?:typescript|tsx|ts|javascript|jsx|js)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      generatedCode = codeBlockMatch[1].trim();
    }
    
    return generatedCode;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, demoName } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Extract modification request if code is present
    let cleanPrompt = prompt;
    let existingCode: string | undefined;
    
    // Check if prompt contains code block (modification request)
    const codeBlockMatch = prompt.match(/```(?:typescript|tsx|ts)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      existingCode = codeBlockMatch[1].trim();
      // Extract the modification request (text before code block)
      cleanPrompt = prompt.substring(0, prompt.indexOf('```')).trim();
      // Remove common modification phrases
      cleanPrompt = cleanPrompt.replace(/modify.*component.*:/i, '').replace(/current code.*:/i, '').trim();
    }

    // Hybrid approach: simple prompts → rule-based (UI-DSL), complex → OpenAI
    // Check for decision patterns FIRST (before checking if simple)
    const isDecisionPattern = checkIfDecisionPattern(cleanPrompt);
    const isLandingPage = /landing\s+page|hero.*pricing.*faq/i.test(cleanPrompt);
    const isSimple = checkIfSimple(cleanPrompt);
    console.log("[API Generate] Prompt analysis:", { 
      cleanPrompt: cleanPrompt.substring(0, 50), 
      isSimple, 
      isDecisionPattern,
      isLandingPage,
      hasExistingCode: !!existingCode,
      hasOpenAI: openai !== null 
    });
    // Use OpenAI only if: (1) prompt is NOT simple AND NOT decision pattern AND NOT landing page, OR (2) we're modifying existing code
    // For simple prompts, decision patterns, or landing pages without existing code, use UI-DSL (rule-based)
    const useOpenAI = (!isSimple && !isDecisionPattern && !isLandingPage || existingCode !== undefined) && openai !== null;
    console.log("[API Generate] Generation method:", { useOpenAI, isSimple, isDecisionPattern, isLandingPage, willUseUIDSL: !useOpenAI && (isSimple || isDecisionPattern || isLandingPage) });
    
    let code: string | undefined;
    let metadata: any;
    
    // Use OpenAI API for complex prompts or modifications
    if (useOpenAI) {
      try {
        code = await generateWithOpenAI(cleanPrompt, existingCode);
        // Automatically add missing imports
        code = addMissingImports(code);
        metadata = {
          type: "ai-generated",
          method: "openai",
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        // Fallback to rule-based if OpenAI fails
        console.warn("OpenAI generation failed, falling back to rule-based:", error);
        code = undefined; // Will trigger rule-based generation below
      }
    }
    
    // Rule-based generation (fallback or for simple prompts)
    if (!code) {
      // Check if it's a decision pattern, landing page, or dashboard (Screen DSL) FIRST
      // This should take priority over detectAppFlow/detectScreenType
      const isDashboard = /dashboard/i.test(cleanPrompt);
      if (checkIfDecisionPattern(cleanPrompt) || isLandingPage || isDashboard) {
        try {
          console.log("[API Generate] Using local parser for decision pattern or landing page");
          console.log("[API Generate] Clean prompt:", cleanPrompt.substring(0, 100));
          
          // Parse prompt to UI-DSL using local parser (supports decision patterns and Screen DSL)
          let parseResult;
          try {
            console.log("[API Generate] Calling parsePrompt with:", cleanPrompt.substring(0, 100));
            parseResult = parsePrompt(cleanPrompt);
            console.log("[API Generate] Parse result received:", { 
              hasParseResult: !!parseResult,
              hasDsl: !!parseResult?.dsl, 
              type: parseResult?.dsl?.type, 
              confidence: parseResult?.confidence,
              hasRegions: parseResult?.dsl?.type === 'page' && 'regions' in (parseResult?.dsl || {}),
              dslKeys: parseResult?.dsl ? Object.keys(parseResult.dsl) : []
            });
            
            if (!parseResult) {
              throw new Error("Parser returned undefined");
            }
            
            if (!parseResult.dsl) {
              console.error("[API Generate] ParseResult structure:", JSON.stringify(parseResult, null, 2).substring(0, 1000));
              console.error("[API Generate] ParseResult type:", typeof parseResult);
              console.error("[API Generate] ParseResult keys:", Object.keys(parseResult || {}));
              throw new Error("Parser returned no DSL");
            }
          } catch (parseError) {
            console.error("[API Generate] Parse error:", parseError);
            console.error("[API Generate] Parse error stack:", parseError instanceof Error ? parseError.stack : "No stack");
            throw new Error(`Failed to parse prompt: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
          }
          
          const dsl = parseResult.dsl;
          console.log("[API Generate] DSL generated:", { 
            type: dsl.type, 
            pattern: isUiDecision(dsl) ? dsl.pattern : undefined, 
            hasOptions: isUiDecision(dsl) ? !!dsl.options : false,
            optionsLength: isUiDecision(dsl) ? (dsl.options?.length || 0) : 0,
            hasRegions: dsl.type === 'page' && 'regions' in dsl ? !!dsl.regions : false
          });
          
          // Handle decision patterns
          if (isUiDecision(dsl)) {
            // Validate options exist
            if (!dsl.options || !Array.isArray(dsl.options) || dsl.options.length === 0) {
              console.warn("[API Generate] Decision pattern has no options, using defaults");
              // Fallback to default options if none parsed
              if (dsl.pattern === 'compare-3') {
                dsl.options = [
                  { id: generateId(), name: 'Starter', price: '$9', pricePeriod: 'month', features: [], ctaText: 'Get Started', actionContractId: generateId() },
                  { id: generateId(), name: 'Pro', price: '$29', pricePeriod: 'month', features: [], ctaText: 'Get Started', popular: true, actionContractId: generateId() },
                  { id: generateId(), name: 'Enterprise', price: '$99', pricePeriod: 'month', features: [], ctaText: 'Contact Sales', actionContractId: generateId() },
                ];
              }
            }
            
            console.log("[API Generate] Options before generation:", JSON.stringify(dsl.options?.slice(0, 1), null, 2));
            
            // Generate code from UI-DSL using local generator (supports decision patterns)
            let generatedCode;
            try {
              generatedCode = generateTSX(dsl, {
                includeImports: true,
                includeValidation: true,
                useFormEnhanced: true,
              });
              console.log("[API Generate] Code generated from DSL, length:", generatedCode.length);
            } catch (genError) {
              console.error("[API Generate] Generation error:", genError);
              console.error("[API Generate] Generation error stack:", genError instanceof Error ? genError.stack : "No stack");
              throw new Error(`Failed to generate code: ${genError instanceof Error ? genError.message : String(genError)}`);
            }
            
            code = generatedCode;
            
        metadata = {
              type: dsl.type,
              method: "ui-dsl-decision",
              pattern: dsl.pattern,
              title: dsl.title,
              description: dsl.description,
          createdAt: new Date().toISOString(),
              dsl: dsl, // Include DSL in metadata for conversational editing
            };
            console.log("[API Generate] Metadata created with DSL:", { method: metadata.method, hasDsl: !!metadata.dsl, pattern: metadata.pattern });
      }
          // Handle Screen DSL (landing page with regions and modules)
          else if (dsl.type === 'page' && 'regions' in dsl && dsl.regions) {
            console.log("[API Generate] Generating Screen DSL with regions");
            
            // Generate code from UI-DSL using local generator (supports Screen DSL)
            let generatedCode;
            try {
              generatedCode = generateTSX(dsl, {
                includeImports: true,
                includeValidation: true,
                useFormEnhanced: true,
              });
              console.log("[API Generate] Code generated from Screen DSL, length:", generatedCode.length);
            } catch (genError) {
              console.error("[API Generate] Generation error:", genError);
              console.error("[API Generate] Generation error stack:", genError instanceof Error ? genError.stack : "No stack");
              throw new Error(`Failed to generate code: ${genError instanceof Error ? genError.message : String(genError)}`);
            }
            
            code = generatedCode;
            
        metadata = {
              type: dsl.type,
              method: "ui-dsl-screen",
              title: dsl.title,
              description: dsl.description,
          createdAt: new Date().toISOString(),
              dsl: dsl, // Include DSL in metadata for conversational editing
            };
            console.log("[API Generate] Metadata created with Screen DSL:", { method: metadata.method, hasDsl: !!metadata.dsl });
          } else if (dsl.type === 'dashboard') {
            console.log("[API Generate] Generating Dashboard DSL");
            
            // Generate code from UI-DSL using local generator (supports Dashboard DSL)
            let generatedCode;
            try {
              generatedCode = generateTSX(dsl, {
                includeImports: true,
                includeValidation: true,
                useFormEnhanced: true,
              });
              console.log("[API Generate] Code generated from Dashboard DSL, length:", generatedCode.length);
            } catch (genError) {
              console.error("[API Generate] Generation error:", genError);
              console.error("[API Generate] Generation error stack:", genError instanceof Error ? genError.stack : "No stack");
              throw new Error(`Failed to generate code: ${genError instanceof Error ? genError.message : String(genError)}`);
            }
            
            code = generatedCode;
            
            metadata = {
              type: dsl.type,
              method: "ui-dsl-dashboard",
              title: dsl.title,
              description: dsl.description,
              createdAt: new Date().toISOString(),
              dsl: dsl, // Include DSL in metadata for conversational editing
            };
            console.log("[API Generate] Metadata created with Dashboard DSL:", { method: metadata.method, hasDsl: !!metadata.dsl });
          } else {
            throw new Error(`Unsupported DSL type: ${dsl.type}`);
          }
        } catch (error) {
          console.error("[API Generate] Error generating decision pattern:", error);
          console.error("[API Generate] Error details:", error instanceof Error ? error.stack : String(error));
          // Fallback to form generation if decision pattern fails
          console.log("[API Generate] Falling back to form generation");
          try {
            const fallbackDsl = parsePromptToUIDSL(cleanPrompt);
            code = generateCodeFromUIDSL(fallbackDsl);
            metadata = {
              type: fallbackDsl.type,
              method: "ui-dsl-fallback",
              title: fallbackDsl.title,
              description: fallbackDsl.description,
              createdAt: new Date().toISOString(),
              dsl: fallbackDsl,
            };
          } catch (fallbackError) {
            console.error("[API Generate] Fallback also failed:", fallbackError);
            throw error; // Re-throw original error if fallback fails
          }
        }
      }
      // Generate form using UI-DSL (new approach)
      else {
        console.log("[API Generate] Using UI-DSL generation for form");
        // Parse prompt to UI-DSL
        const dsl = parsePromptToUIDSL(cleanPrompt);
        console.log("[API Generate] DSL generated:", { type: dsl.type, hasFields: !!dsl.fields, hasActions: !!dsl.actions });
        
        // Generate code from UI-DSL
        code = generateCodeFromUIDSL(dsl);
        console.log("[API Generate] Code generated from DSL, length:", code.length);
        
        metadata = {
          type: dsl.type,
          method: "ui-dsl", // Changed from "rule-based" to "ui-dsl" to indicate DSL is available
          title: dsl.title,
          description: dsl.description,
          scaffold: dsl.scaffold,
          fields: dsl.fields,
          actions: dsl.actions,
          createdAt: new Date().toISOString(),
          dsl: dsl, // Include DSL in metadata for conversational editing
        };
        console.log("[API Generate] Metadata created with DSL:", { method: metadata.method, hasDsl: !!metadata.dsl });
      }
    }

    // Fix incorrect component imports (e.g., Dropdown -> DropdownMenu)
    code = fixIncorrectImports(code);
    
    // Remove TypeScript type annotations for react-live compatibility
    code = removeTypeScriptAnnotations(code);
    
    // Replace alert() with toast() for better UX
    code = replaceAlertWithToast(code);
    
    // Fix common syntax errors in generated code
    code = fixSyntaxErrors(code);
    
    // Fix broken component tags where data-ui-id was incorrectly inserted
    // e.g., <Dialog data-ui-id="dialog-0"Trigger> -> <Dialog data-ui-id="dialog-0"><DialogTrigger>
    code = code.replace(
      /(<(Dialog|Select|Card|Table|Tabs|DropdownMenu|FormField|Form)(?:\s+[^>]*?)?data-ui-id="[^"]*")([A-Z][a-zA-Z]+)(\s+[^>]*?)(\/?>)/g,
      (match, tagPart, componentName, brokenSuffix, props, closing) => {
        // Check if brokenSuffix is a valid component name (e.g., Trigger, Content, Header)
        const validSuffixes = ['Trigger', 'Content', 'Header', 'Title', 'Description', 'Footer', 'Value', 'Item', 'List'];
        if (validSuffixes.some(suffix => brokenSuffix === suffix || brokenSuffix.startsWith(suffix))) {
          // This is a broken tag - fix it by closing the first tag and opening a new one
          const fullComponentName = componentName + brokenSuffix;
          return `${tagPart}${closing}><${fullComponentName}${props}${closing}`;
        }
        return match;
      }
    );
    
    // Fix incorrect HTML tags that should be React components or HTML5 semantic tags
    // <navigation> -> <nav> (HTML5 semantic tag)
    code = code.replace(/<navigation(\s+[^>]*?)>/g, '<nav$1>');
    code = code.replace(/<\/navigation>/g, '</nav>');
    
    // <grid> -> <div> (grid is not a valid HTML tag, use div with grid classes)
    code = code.replace(/<grid(\s+[^>]*?)>/g, '<div$1>');
    code = code.replace(/<\/grid>/g, '</div>');
    
    // <card> -> <Card> (React component) - but only if it's empty or has data-ui-id
    // This is more complex, so we'll handle it with a more specific pattern
    code = code.replace(/<card(\s+[^>]*?)(\/?)>/g, (match, attrs, selfClose) => {
      // If it's a self-closing tag or empty, replace with Card component
      if (selfClose || match.includes('</card>')) {
        return `<Card${attrs}${selfClose || ''}>`;
      }
      return match;
    });
    code = code.replace(/<\/card>/g, '</Card>');
    
    // Fix chart data structure - ensure chartData has labels and datasets for Chart.js
    // Pattern: <Line data={chartData} /> but chartData is undefined or missing labels/datasets
    if (code.includes('<Line') || code.includes('<Bar') || code.includes('<Pie') || code.includes('<Doughnut')) {
      // Check if chartData/data is used in Line/Bar/Pie components
      const usesChartData = /<(Line|Bar|Pie|Doughnut)[^>]*data=\{([^}]+)\}/.test(code);
      
      if (usesChartData) {
        // Find the variable name used in data prop (could be chartData, data, chart, etc.)
        const dataVarMatch = code.match(/<(Line|Bar|Pie|Doughnut)[^>]*data=\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}/);
        const dataVarName = dataVarMatch ? dataVarMatch[2] : 'chartData';
        
        // Check if this variable is defined
        // Use multiline regex to match multi-line object definitions
        const varDefPattern = new RegExp(`const\\s+${dataVarName}\\s*=\\s*\\{[\\s\\S]*?\\}`, 'm');
        const hasVarDef = varDefPattern.test(code);
        
        // CRITICAL: If chartData is defined but not used, and there's an inline data object,
        // remove the unused chartData to avoid confusion and potential fill variable errors
        if (hasVarDef && code.includes(`data={{`)) {
          // chartData is defined but inline data is used - remove unused chartData
          code = code.replace(varDefPattern, '');
          // Also remove any trailing newlines after removing chartData
          code = code.replace(/\n\n\n+/g, '\n\n');
        }
        
        if (!hasVarDef) {
          // Variable is not defined - add it before the return statement
          const returnMatch = code.match(/(\s+)(return\s+\()/);
          if (returnMatch) {
            const indent = returnMatch[1];
            const insertPoint = returnMatch.index!;
            const defaultChartData = `${indent}const ${dataVarName} = {
${indent}  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
${indent}  datasets: [
${indent}    {
${indent}      label: 'Data',
${indent}      data: [65, 59, 80, 81, 56, 55],
${indent}      fill: false,
${indent}      borderColor: 'rgba(75,192,192,1)',
${indent}      backgroundColor: 'rgba(75,192,192,0.2)',
${indent}    },
${indent}  ],
${indent}};\n\n`;
            code = code.slice(0, insertPoint) + defaultChartData + code.slice(insertPoint);
          }
        } else {
          // Variable is defined - check if it has labels and datasets
          const varDefMatch = code.match(varDefPattern);
          if (varDefMatch) {
            const varDef = varDefMatch[0];
            const hasLabels = /labels\s*:/.test(varDef);
            const hasDatasets = /datasets\s*:/.test(varDef);
            
            if (!hasLabels || !hasDatasets) {
              // Variable is incomplete - fix it
              if (!hasLabels && !hasDatasets) {
                // Replace entire definition
                code = code.replace(
                  varDefPattern,
                  `const ${dataVarName} = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Data',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  }`
                );
              } else if (!hasLabels) {
                // Add labels at the beginning
                code = code.replace(
                  varDefPattern,
                  (match) => match.replace(/\{/, `{
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],`)
                );
              } else if (!hasDatasets) {
                // Add datasets at the end (before closing brace)
                code = code.replace(
                  varDefPattern,
                  (match) => match.replace(/\}$/, `,
    datasets: [
      {
        label: 'Data',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  }`)
                );
              }
            }
          }
        }
      }
    }
    
    // CRITICAL FIX: Remove data-ui-id that was incorrectly inserted inside onClick values
    // Pattern: onClick={() = data-ui-id="..."}> ... } -> onClick={() => ... }
    // Also handle cases like: onClick={() = data-ui-id="button-3"> handleAction("Dashboard")}
    code = code.replace(
      /onClick\s*=\s*\{\s*\(\)\s*=\s*data-ui-id\s*=\s*["'][^"']*["']\s*>\s*([^}]+)\}/g,
      (match, functionBody) => {
        // Clean up the function body and reconstruct proper onClick
        const cleanedBody = functionBody.trim();
        return `onClick={() => ${cleanedBody}}`;
      }
    );
    
    // Additional fix for malformed onClick with data-ui-id in the middle
    // Pattern: onClick={() = data-ui-id="button-X"> functionBody }
    code = code.replace(
      /onClick\s*=\s*\{\s*\(\)\s*=\s*data-ui-id\s*=\s*["'][^"']*["']\s*>\s*([^}]+)\}/g,
      (match, functionBody) => {
        const cleanedBody = functionBody.trim();
        return `onClick={() => ${cleanedBody}}`;
      }
    );
    
    // Add missing data-ui-id attributes to components that don't have them
    // This ensures element selection works even if OpenAI doesn't add data-ui-id
    const codeBefore = code;
    code = addMissingDataUiIds(code);
    
    // Log if data-ui-id were added
    const dataUiIdCountBefore = (codeBefore.match(/data-ui-id=["'][^"']*["']/g) || []).length;
    const dataUiIdCountAfter = (code.match(/data-ui-id=["'][^"']*["']/g) || []).length;
    if (dataUiIdCountAfter > dataUiIdCountBefore) {
      console.log(`[API Generate] Added ${dataUiIdCountAfter - dataUiIdCountBefore} data-ui-id attributes (total: ${dataUiIdCountAfter})`);
    } else if (dataUiIdCountAfter === 0) {
      console.warn(`[API Generate] WARNING: No data-ui-id attributes found in generated code!`);
    }

    // Format code with prettier (if available)
    let formattedCode = code;
    try {
      // Try to format with prettier - if not available, use original code
      const prettierModule = await import("prettier").catch(() => null);
      if (prettierModule?.default) {
        formattedCode = await prettierModule.default.format(code, {
          parser: "typescript",
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "es5",
          printWidth: 100,
        });
      }
    } catch (formatError) {
      // If formatting fails, use original code
      console.warn("Code formatting failed, using original code:", formatError);
    }

    // Generate a unique ID for this demo - always include timestamp for uniqueness
    const baseId = demoName 
      ? demoName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : "demo";
    const demoId = `${baseId}-${Date.now()}`;

    // Include DSL in response if available (for conversational editing)
    const response: any = {
      success: true,
      demoId,
      code: formattedCode,
      metadata,
    };
    
    // If DSL was generated, include it in response
    if (metadata?.dsl) {
      response.dsl = metadata.dsl;
      console.log("[API Generate] DSL included in response:", { dslType: metadata.dsl.type });
    } else {
      console.log("[API Generate] No DSL in metadata, method:", metadata?.method);
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating component:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to generate component";
    let errorDetails = error instanceof Error ? error.message : String(error);
    
    // Parse common errors and provide better messages
    if (errorDetails.includes("parse") || errorDetails.includes("parsing")) {
      errorMessage = "Unable to understand your prompt. Please try rephrasing it.";
      errorDetails = "The prompt could not be parsed. Try being more specific about what you want to build.";
    } else if (errorDetails.includes("validation") || errorDetails.includes("validate")) {
      errorMessage = "Validation error in generated code";
      errorDetails = "The generated code has validation issues. Please try a different prompt.";
    } else if (errorDetails.includes("import") || errorDetails.includes("module")) {
      errorMessage = "Component import error";
      errorDetails = "A required component could not be imported. This is an internal error.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        // Only include stack in development
        ...(process.env.NODE_ENV === "development" && {
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}
