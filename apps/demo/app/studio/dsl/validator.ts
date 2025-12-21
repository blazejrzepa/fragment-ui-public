/**
 * DSL Validator
 * 
 * Validates UI-DSL structure against schema and rules.
 * 
 * v1.1: Validation for conversational UI editing.
 * 
 * Note: This is a separate validator from validate.ts which handles
 * code and a11y validation. This focuses on DSL structure validation.
 */

import type { UiDsl, UiForm, UiPage, UiTable, UiDashboard, ActionContract, UiCommon } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
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
  
  // Check if DSL has required fields
  if (!dsl) {
    errors.push({
      path: '',
      message: 'DSL is null or undefined',
      code: 'DSL_NULL',
    });
    return { valid: false, errors, warnings };
  }
  
  // Check if DSL has type
  if (!dsl.type) {
    errors.push({
      path: '',
      message: 'DSL missing required field: type',
      code: 'MISSING_TYPE',
    });
    return { valid: false, errors, warnings };
  }
  
  // Check if DSL has ID
  if (!dsl.id) {
    errors.push({
      path: '',
      message: 'DSL missing required field: id',
      code: 'MISSING_ID',
    });
  } else if (!isValidUUID(dsl.id)) {
    errors.push({
      path: '',
      message: `DSL id is not a valid UUID: ${dsl.id}`,
      code: 'INVALID_ID',
    });
  }
  
  // Validate based on type
  switch (dsl.type) {
    case 'form':
      validateForm(dsl as UiForm, errors, warnings);
      break;
    case 'page':
    case 'screen': // Screen is alias for page with regions (Milestone 3.1)
      validatePage(dsl as UiPage, errors, warnings);
      break;
    case 'table':
      validateTable(dsl as UiTable, errors, warnings);
      break;
    case 'dashboard':
      validateDashboard(dsl as UiDashboard, errors, warnings);
      break;
    default:
      errors.push({
        path: '',
        message: `Unknown DSL type: ${(dsl as any).type}`,
        code: 'UNKNOWN_TYPE',
      });
  }
  
  // Validate AXL extensions (Action Contracts, Intent, Constraints, Evaluation)
  validateAxlExtensions(dsl as UiCommon, errors, warnings);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate form DSL
 */
function validateForm(
  form: UiForm,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Check fields
  if (!form.fields || !Array.isArray(form.fields)) {
    errors.push({
      path: 'fields',
      message: 'Form missing required field: fields (must be an array)',
      code: 'MISSING_FIELDS',
    });
    return;
  }
  
  if (form.fields.length === 0) {
    warnings.push({
      path: 'fields',
      message: 'Form has no fields',
      code: 'EMPTY_FIELDS',
    });
  }
  
  // Validate each field
  form.fields.forEach((field, index) => {
    const fieldPath = `fields[${index}]`;
    
    if (!field.id) {
      errors.push({
        path: fieldPath,
        message: 'Field missing required field: id',
        code: 'MISSING_FIELD_ID',
      });
    } else if (!isValidUUID(field.id)) {
      errors.push({
        path: fieldPath,
        message: `Field id is not a valid UUID: ${field.id}`,
        code: 'INVALID_FIELD_ID',
      });
    }
    
    if (!field.name) {
      errors.push({
        path: fieldPath,
        message: 'Field missing required field: name',
        code: 'MISSING_FIELD_NAME',
      });
    }
    
    if (!field.label) {
      warnings.push({
        path: fieldPath,
        message: 'Field missing label (accessibility concern)',
        code: 'MISSING_FIELD_LABEL',
      });
    }
    
    if (!field.component) {
      errors.push({
        path: fieldPath,
        message: 'Field missing required field: component',
        code: 'MISSING_FIELD_COMPONENT',
      });
    }
  });
  
  // Validate actions if present (form actions, not ActionContract[])
  // Check if actions is ActionContract[] (has 'kind' property) or form actions (has 'type' property)
  if (form.actions && Array.isArray(form.actions)) {
    // Check if first action has 'kind' property (ActionContract) or 'type' property (form action)
    const isActionContract = form.actions.length > 0 && 'kind' in form.actions[0];
    
    if (!isActionContract) {
      // These are form actions (buttony), validate them
      form.actions.forEach((action: any, index) => {
        const actionPath = `actions[${index}]`;
        
        if (!action.id) {
          errors.push({
            path: actionPath,
            message: 'Action missing required field: id',
            code: 'MISSING_ACTION_ID',
          });
        } else if (!isValidUUID(action.id)) {
          errors.push({
            path: actionPath,
            message: `Action id is not a valid UUID: ${action.id}`,
            code: 'INVALID_ACTION_ID',
          });
        }
        
        if (!action.type) {
          errors.push({
            path: actionPath,
            message: 'Action missing required field: type',
            code: 'MISSING_ACTION_TYPE',
          });
        }
        
        if (!action.label) {
          warnings.push({
            path: actionPath,
            message: 'Action missing label (accessibility concern)',
            code: 'MISSING_ACTION_LABEL',
          });
        }
      });
    }
    // If isActionContract, skip validation here - it will be validated in validateAxlExtensions
  }
}

/**
 * Validate page DSL
 * Milestone 3.1: Extended to support regions and modules
 */
function validatePage(
  page: UiPage,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Milestone 3.1: Check if this is a screen with regions
  if (page.regions) {
    validateRegions(page.regions, errors, warnings);
    // Regions-based pages don't require sections
    if (page.sections && page.sections.length > 0) {
      warnings.push({
        path: 'sections',
        message: 'Page has both regions and sections - regions take precedence',
        code: 'REGIONS_AND_SECTIONS',
      });
    }
    return;
  }
  
  // Traditional page with sections
  if (!page.sections || !Array.isArray(page.sections)) {
    errors.push({
      path: 'sections',
      message: 'Page missing required field: sections (must be an array) or regions',
      code: 'MISSING_SECTIONS',
    });
    return;
  }
  
  if (page.sections.length === 0) {
    warnings.push({
      path: 'sections',
      message: 'Page has no sections',
      code: 'EMPTY_SECTIONS',
    });
  }
  
  page.sections.forEach((section, index) => {
    const sectionPath = `sections[${index}]`;
    
    if (!section.id) {
      errors.push({
        path: sectionPath,
        message: 'Section missing required field: id',
        code: 'MISSING_SECTION_ID',
      });
    } else if (!isValidUUID(section.id)) {
      errors.push({
        path: sectionPath,
        message: `Section id is not a valid UUID: ${section.id}`,
        code: 'INVALID_SECTION_ID',
      });
    }
    
    // Milestone 3.1: kind is optional if module is specified
    if (!section.kind && !section.module) {
      errors.push({
        path: sectionPath,
        message: 'Section missing required field: kind or module',
        code: 'MISSING_SECTION_KIND_OR_MODULE',
      });
    }
    
    // Milestone 3.1: Validate module if specified
    if (section.module) {
      validateModuleType(section.module, sectionPath, errors);
    }
  });
}

/**
 * Validate regions (Milestone 3.1)
 */
function validateRegions(
  regions: NonNullable<UiPage['regions']>,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  const validRegions: Array<'header' | 'sidebar' | 'content' | 'footer' | 'main'> = ['header', 'sidebar', 'content', 'footer', 'main'];
  
  Object.entries(regions).forEach(([regionName, region]) => {
    if (!validRegions.includes(regionName as any)) {
      warnings.push({
        path: `regions.${regionName}`,
        message: `Unknown region name: ${regionName}`,
        code: 'UNKNOWN_REGION',
      });
    }
    
    if (!region.id) {
      errors.push({
        path: `regions.${regionName}`,
        message: 'Region missing required field: id',
        code: 'MISSING_REGION_ID',
      });
    } else if (!isValidUUID(region.id)) {
      errors.push({
        path: `regions.${regionName}`,
        message: `Region id is not a valid UUID: ${region.id}`,
        code: 'INVALID_REGION_ID',
      });
    }
    
    // Validate modules in region
    if (region.modules) {
      region.modules.forEach((module, index) => {
        const modulePath = `regions.${regionName}.modules[${index}]`;
        validateModule(module, modulePath, errors, warnings);
      });
    }
    
    // Validate content in region
    if (region.content) {
      region.content.forEach((contentItem, index) => {
        const contentPath = `regions.${regionName}.content[${index}]`;
        // Basic validation - content should be a valid DSL
        if (!contentItem || typeof contentItem !== 'object' || !('type' in contentItem)) {
          errors.push({
            path: contentPath,
            message: 'Region content item must be a valid DSL object',
            code: 'INVALID_REGION_CONTENT',
          });
        }
      });
    }
  });
}

/**
 * Validate module (Milestone 3.1)
 */
function validateModule(
  module: import('./types').UiModule,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!module.id) {
    errors.push({
      path,
      message: 'Module missing required field: id',
      code: 'MISSING_MODULE_ID',
    });
  } else if (!isValidUUID(module.id)) {
    errors.push({
      path,
      message: `Module id is not a valid UUID: ${module.id}`,
      code: 'INVALID_MODULE_ID',
    });
  }
  
  if (!module.type) {
    errors.push({
      path,
      message: 'Module missing required field: type',
      code: 'MISSING_MODULE_TYPE',
    });
  } else {
    validateModuleType(module.type, path, errors);
  }
}

/**
 * Validate module type (Milestone 3.1)
 */
function validateModuleType(
  moduleType: string,
  path: string,
  errors: ValidationError[]
): void {
  const validModuleTypes: Array<'hero' | 'pricing' | 'faq' | 'testimonials' | 'data-table-section' | 'kpi-header' | 'features' | 'proof' | 'cta' | 'navigation' | 'footer' | 'breadcrumbs'> = [
    'hero', 'pricing', 'faq', 'testimonials', 'data-table-section', 'kpi-header',
    'features', 'proof', 'cta', 'navigation', 'footer', 'breadcrumbs'
  ];
  
  if (!validModuleTypes.includes(moduleType as any)) {
    errors.push({
      path,
      message: `Invalid module type: ${moduleType}. Valid types: ${validModuleTypes.join(', ')}`,
      code: 'INVALID_MODULE_TYPE',
    });
  }
}

/**
 * Validate table DSL
 */
function validateTable(
  table: UiTable,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!table.columns || !Array.isArray(table.columns)) {
    errors.push({
      path: 'columns',
      message: 'Table missing required field: columns (must be an array)',
      code: 'MISSING_COLUMNS',
    });
    return;
  }
  
  if (table.columns.length === 0) {
    warnings.push({
      path: 'columns',
      message: 'Table has no columns',
      code: 'EMPTY_COLUMNS',
    });
  }
  
  table.columns.forEach((column, index) => {
    const columnPath = `columns[${index}]`;
    
    if (!column.id) {
      errors.push({
        path: columnPath,
        message: 'Column missing required field: id',
        code: 'MISSING_COLUMN_ID',
      });
    } else if (!isValidUUID(column.id)) {
      errors.push({
        path: columnPath,
        message: `Column id is not a valid UUID: ${column.id}`,
        code: 'INVALID_COLUMN_ID',
      });
    }
    
    if (!column.key) {
      errors.push({
        path: columnPath,
        message: 'Column missing required field: key',
        code: 'MISSING_COLUMN_KEY',
      });
    }
    
    if (!column.label) {
      warnings.push({
        path: columnPath,
        message: 'Column missing label (accessibility concern)',
        code: 'MISSING_COLUMN_LABEL',
      });
    }
  });
  
  if (!table.dataSource) {
    errors.push({
      path: 'dataSource',
      message: 'Table missing required field: dataSource',
      code: 'MISSING_DATA_SOURCE',
    });
  }
}

/**
 * Validate dashboard DSL
 */
function validateDashboard(
  dashboard: UiDashboard,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!dashboard.widgets || !Array.isArray(dashboard.widgets)) {
    errors.push({
      path: 'widgets',
      message: 'Dashboard missing required field: widgets (must be an array)',
      code: 'MISSING_WIDGETS',
    });
    return;
  }
  
  if (dashboard.widgets.length === 0) {
    warnings.push({
      path: 'widgets',
      message: 'Dashboard has no widgets',
      code: 'EMPTY_WIDGETS',
    });
  }
  
  dashboard.widgets.forEach((widget, index) => {
    const widgetPath = `widgets[${index}]`;
    
    if (!widget.id) {
      errors.push({
        path: widgetPath,
        message: 'Widget missing required field: id',
        code: 'MISSING_WIDGET_ID',
      });
    } else if (!isValidUUID(widget.id)) {
      errors.push({
        path: widgetPath,
        message: `Widget id is not a valid UUID: ${widget.id}`,
        code: 'INVALID_WIDGET_ID',
      });
    }
    
    if (!widget.kind) {
      errors.push({
        path: widgetPath,
        message: 'Widget missing required field: kind',
        code: 'MISSING_WIDGET_KIND',
      });
    }
  });
}

/**
 * Validate AXL extensions (Action Contracts, Intent, Constraints, Evaluation)
 */
function validateAxlExtensions(
  dsl: UiCommon,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Validate Action Contracts
  if (dsl.actions && Array.isArray(dsl.actions)) {
    dsl.actions.forEach((action, index) => {
      const actionPath = `actions[${index}]`;
      validateActionContract(action, actionPath, errors, warnings);
    });
  }
}

/**
 * Validate Action Contract
 * Rules:
 * - kind="hard" ⇒ requiresConfirmation=true
 * - riskLevel="high" ⇒ requiresConfirmation=true
 * - preauthAllowed=true tylko dla kind="soft"
 */
function validateActionContract(
  action: ActionContract,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Check required fields
  if (!action.id) {
    errors.push({
      path,
      message: 'Action Contract missing required field: id',
      code: 'MISSING_ACTION_CONTRACT_ID',
    });
  } else if (!isValidUUID(action.id)) {
    errors.push({
      path,
      message: `Action Contract id is not a valid UUID: ${action.id}`,
      code: 'INVALID_ACTION_CONTRACT_ID',
    });
  }
  
  if (!action.label) {
    errors.push({
      path,
      message: 'Action Contract missing required field: label',
      code: 'MISSING_ACTION_CONTRACT_LABEL',
    });
  }
  
  if (!action.kind) {
    errors.push({
      path,
      message: 'Action Contract missing required field: kind',
      code: 'MISSING_ACTION_CONTRACT_KIND',
    });
  } else {
    // Rule: kind="hard" ⇒ requiresConfirmation=true
    if (action.kind === 'hard' && !action.requiresConfirmation) {
      errors.push({
        path,
        message: 'Hard action must require confirmation (kind="hard" ⇒ requiresConfirmation=true)',
        code: 'HARD_ACTION_MISSING_CONFIRMATION',
      });
    }
    
    // Rule: preauthAllowed=true tylko dla kind="soft"
    if (action.preauthAllowed && action.kind !== 'soft') {
      errors.push({
        path,
        message: 'preauthAllowed=true is only allowed for soft actions (kind="soft")',
        code: 'PREAUTH_ONLY_FOR_SOFT',
      });
    }
  }
  
  // Rule: riskLevel="high" ⇒ requiresConfirmation=true
  if (action.riskLevel === 'high' && !action.requiresConfirmation) {
    errors.push({
      path,
      message: 'High risk action must require confirmation (riskLevel="high" ⇒ requiresConfirmation=true)',
      code: 'HIGH_RISK_MISSING_CONFIRMATION',
    });
  }
}

/**
 * Check if string is a valid UUID v4
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

