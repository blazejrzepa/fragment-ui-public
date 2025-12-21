/**
 * Validation for UI-DSL
 * 
 * Validates DSL structure, ESLint rules, and accessibility.
 * Used after applying patches to ensure quality.
 * 
 * v1.1: Validation system for conversational UI editing.
 */

import type { UiDsl, UiForm, UiPage, UiTable, UiDashboard } from './types';
import { isUiForm, isUiPage, isUiTable, isUiDashboard } from './types';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;                   // Path to the invalid node (e.g., "fields[0].name")
  message: string;                 // Error message
  code: string;                    // Error code (e.g., "MISSING_ID", "INVALID_TYPE")
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

/**
 * Validate DSL structure
 */
export function validateDsl(dsl: UiDsl): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check root level
  if (!dsl.id) {
    errors.push({
      path: '',
      message: 'Root DSL node must have an id',
      code: 'MISSING_ID',
    });
  }

  if (!dsl.type) {
    errors.push({
      path: '',
      message: 'DSL must have a type',
      code: 'MISSING_TYPE',
    });
  }

  // Validate based on type
  if (isUiForm(dsl)) {
    validateForm(dsl, errors, warnings);
  } else if (isUiPage(dsl)) {
    validatePage(dsl, errors, warnings);
  } else if (isUiTable(dsl)) {
    validateTable(dsl, errors, warnings);
  } else if (isUiDashboard(dsl)) {
    validateDashboard(dsl, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate form structure
 */
function validateForm(
  form: UiForm,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  path: string = ''
): void {
  // Validate fields
  if (!form.fields || !Array.isArray(form.fields)) {
    errors.push({
      path: `${path}.fields`,
      message: 'Form must have a fields array',
      code: 'MISSING_FIELDS',
    });
    return;
  }

  form.fields.forEach((field, index) => {
    const fieldPath = `${path}.fields[${index}]`;
    
    if (!field.id) {
      errors.push({
        path: fieldPath,
        message: 'Field must have an id',
        code: 'MISSING_ID',
      });
    }

    if (!field.name) {
      errors.push({
        path: fieldPath,
        message: 'Field must have a name',
        code: 'MISSING_NAME',
      });
    }

    if (!field.label) {
      warnings.push({
        path: fieldPath,
        message: 'Field should have a label for accessibility',
        code: 'MISSING_LABEL',
      });
    }

    if (!field.component) {
      errors.push({
        path: fieldPath,
        message: 'Field must have a component type',
        code: 'MISSING_COMPONENT',
      });
    }
  });

  // Validate actions (optional)
  if (form.actions) {
    form.actions.forEach((action, index) => {
      const actionPath = `${path}.actions[${index}]`;
      
      if (!action.id) {
        errors.push({
          path: actionPath,
          message: 'Action must have an id',
          code: 'MISSING_ID',
        });
      }

      if (!action.kind) {
        errors.push({
          path: actionPath,
          message: 'Action must have a kind',
          code: 'MISSING_KIND',
        });
      }

      if (!action.label) {
        warnings.push({
          path: actionPath,
          message: 'Action should have a label',
          code: 'MISSING_LABEL',
        });
      }
    });
  }
}

/**
 * Validate page structure
 */
function validatePage(
  page: UiPage,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  path: string = ''
): void {
  if (!page.sections || !Array.isArray(page.sections)) {
    errors.push({
      path: `${path}.sections`,
      message: 'Page must have a sections array',
      code: 'MISSING_SECTIONS',
    });
    return;
  }

  page.sections.forEach((section, index) => {
    const sectionPath = `${path}.sections[${index}]`;
    
    if (!section.id) {
      errors.push({
        path: sectionPath,
        message: 'Section must have an id',
        code: 'MISSING_ID',
      });
    }

    if (!section.kind) {
      errors.push({
        path: sectionPath,
        message: 'Section must have a kind',
        code: 'MISSING_KIND',
      });
    }
  });
}

/**
 * Validate table structure
 */
function validateTable(
  table: UiTable,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  path: string = ''
): void {
  if (!table.columns || !Array.isArray(table.columns)) {
    errors.push({
      path: `${path}.columns`,
      message: 'Table must have a columns array',
      code: 'MISSING_COLUMNS',
    });
    return;
  }

  table.columns.forEach((column, index) => {
    const columnPath = `${path}.columns[${index}]`;
    
    if (!column.id) {
      errors.push({
        path: columnPath,
        message: 'Column must have an id',
        code: 'MISSING_ID',
      });
    }

    if (!column.key) {
      errors.push({
        path: columnPath,
        message: 'Column must have a key',
        code: 'MISSING_KEY',
      });
    }

    if (!column.label) {
      warnings.push({
        path: columnPath,
        message: 'Column should have a label',
        code: 'MISSING_LABEL',
      });
    }
  });

  if (table.filters) {
    table.filters.forEach((filter, index) => {
      const filterPath = `${path}.filters[${index}]`;
      
      if (!filter.id) {
        errors.push({
          path: filterPath,
          message: 'Filter must have an id',
          code: 'MISSING_ID',
        });
      }
    });
  }
}

/**
 * Validate dashboard structure
 */
function validateDashboard(
  dashboard: UiDashboard,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  path: string = ''
): void {
  if (!dashboard.widgets || !Array.isArray(dashboard.widgets)) {
    errors.push({
      path: `${path}.widgets`,
      message: 'Dashboard must have a widgets array',
      code: 'MISSING_WIDGETS',
    });
    return;
  }

  dashboard.widgets.forEach((widget, index) => {
    const widgetPath = `${path}.widgets[${index}]`;
    
    if (!widget.id) {
      errors.push({
        path: widgetPath,
        message: 'Widget must have an id',
        code: 'MISSING_ID',
      });
    }

    if (!widget.kind) {
      errors.push({
        path: widgetPath,
        message: 'Widget must have a kind',
        code: 'MISSING_KIND',
      });
    }
  });
}

/**
 * Validate DSL after applying patches
 * This is a convenience function that validates the DSL structure
 */
export function validateAfterPatch(dsl: UiDsl): ValidationResult {
  return validateDsl(dsl);
}

/**
 * Validate generated TSX code with ESLint rules
 * This is a simplified validation that checks for common issues
 */
export function validateCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for hardcoded colors (should use tokens)
  const colorPatterns = [
    /#[0-9a-fA-F]{3,6}/g,           // Hex colors
    /rgb\(/gi,                       // RGB colors
    /rgba\(/gi,                      // RGBA colors
    /hsl\(/gi,                       // HSL colors
  ];

  for (const pattern of colorPatterns) {
    const matches = code.match(pattern);
    if (matches) {
      warnings.push({
        path: 'code',
        message: `Found hardcoded colors: ${matches.join(', ')}. Use design tokens instead.`,
        code: 'HARDCODED_COLOR',
      });
    }
  }

  // Check for raw HTML elements that should use DS components
  const rawHtmlElements = ['<div', '<span', '<button', '<input', '<select', '<textarea'];
  for (const element of rawHtmlElements) {
    if (code.includes(element) && !code.includes('@fragment_ui/ui')) {
      // This is a warning, not an error, as some raw HTML might be necessary
      warnings.push({
        path: 'code',
        message: `Found raw HTML element: ${element}. Consider using Fragment UI components.`,
        code: 'RAW_HTML_ELEMENT',
      });
    }
  }

  // Check for missing imports from @fragment_ui/ui
  if (code.includes('Form') || code.includes('Button') || code.includes('Input')) {
    if (!code.includes('@fragment_ui/ui')) {
      errors.push({
        path: 'code',
        message: 'Code uses Fragment UI components but missing import from @fragment_ui/ui',
        code: 'MISSING_IMPORT',
      });
    }
  }

  // Check for react/jsx-runtime references (should be removed by bundler)
  if (code.includes('react/jsx-runtime')) {
    warnings.push({
      path: 'code',
      message: 'Code contains react/jsx-runtime references. This should be removed by bundler.',
      code: 'JSX_RUNTIME_REFERENCE',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate accessibility results from axe-core
 */
export function validateA11y(a11yResults: {
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl?: string;
  }>;
  passes: number;
  incomplete: number;
  inapplicable: number;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for critical/serious violations
  const criticalViolations = a11yResults.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  if (criticalViolations.length > 0) {
    for (const violation of criticalViolations) {
      errors.push({
        path: 'a11y',
        message: `${violation.impact.toUpperCase()}: ${violation.description}`,
        code: `A11Y_${violation.id.toUpperCase()}`,
      });
    }
  }

  // Check for moderate/minor violations (warnings)
  const moderateViolations = a11yResults.violations.filter(
    v => v.impact === 'moderate' || v.impact === 'minor'
  );

  if (moderateViolations.length > 0) {
    for (const violation of moderateViolations) {
      warnings.push({
        path: 'a11y',
        message: `${violation.impact.toUpperCase()}: ${violation.description}`,
        code: `A11Y_${violation.id.toUpperCase()}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive validation after patch
 * Validates DSL structure, generated code, and accessibility
 */
export async function validateAfterPatchComprehensive(
  dsl: UiDsl,
  generatedCode?: string,
  a11yResults?: {
    violations: Array<{
      id: string;
      impact: string;
      description: string;
      help: string;
      helpUrl?: string;
    }>;
    passes: number;
    incomplete: number;
    inapplicable: number;
  }
): Promise<ValidationResult> {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  // 1. Validate DSL structure
  const dslValidation = validateDsl(dsl);
  allErrors.push(...dslValidation.errors);
  allWarnings.push(...dslValidation.warnings);

  // 2. Validate generated code (if provided)
  if (generatedCode) {
    const codeValidation = validateCode(generatedCode);
    allErrors.push(...codeValidation.errors);
    allWarnings.push(...codeValidation.warnings);
  }

  // 3. Validate accessibility (if provided)
  if (a11yResults) {
    const a11yValidation = validateA11y(a11yResults);
    allErrors.push(...a11yValidation.errors);
    allWarnings.push(...a11yValidation.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

