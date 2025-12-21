/**
 * UI-DSL v2 Validator
 * 
 * Validates UI-DSL v2 structures against schemas and registry rules
 */

import { z } from "zod";
import type {
  UiNode,
  UiPage,
  UiComponent,
  Diagnostic,
  ValidationResult,
  Patch,
} from "./types-v2";
import {
  UiNodeSchema,
  UiPageSchema,
  UiSectionSchema,
  UiGridSchema,
  UiBlockRefSchema,
  UiComponentSchema,
  DataSourceSchema,
  BindingSchema,
  PatchSchema,
  DiagnosticSchema,
  ValidationResultSchema,
} from "./schema";

// Import schemas to ensure they're initialized
import "./schema";

/**
 * Registry interface (to be provided by registry package)
 */
export interface ComponentRegistry {
  components: Record<string, {
    import: string;
    variants?: string[];
    props?: Record<string, any>;
    slots?: string[];
    a11y?: {
      role?: string;
      notes?: string;
    };
  }>;
}

/**
 * Default empty registry (for testing)
 */
const defaultRegistry: ComponentRegistry = {
  components: {},
};

/**
 * Validate a UI node against schema
 */
export function validateNode(
  node: unknown,
  registry: ComponentRegistry = defaultRegistry
): ValidationResult {
  const diagnostics: Diagnostic[] = [];

  try {
    // Schema validation
    UiNodeSchema.parse(node);
  } catch (error) {
    if (isZodError(error)) {
      error.errors.forEach((err: z.ZodIssue) => {
        diagnostics.push({
          level: "error",
          message: err.message,
          path: err.path.join("."),
          code: "SCHEMA_VALIDATION_ERROR",
        });
      });
    } else {
      diagnostics.push({
        level: "error",
        message: `Validation error: ${error}`,
        code: "UNKNOWN_ERROR",
      });
    }
  }

  // Additional registry validation
  if (diagnostics.length === 0 && isUiNode(node)) {
    validateAgainstRegistry(node, registry, diagnostics);
  }

  return {
    valid: diagnostics.filter((d) => d.level === "error").length === 0,
    diagnostics,
  };
}

/**
 * Validate a UI page (root node)
 */
export function validatePage(
  page: unknown,
  registry: ComponentRegistry = defaultRegistry
): ValidationResult {
  const diagnostics: Diagnostic[] = [];

  try {
    // First check if it's a valid object
    if (!page || typeof page !== "object") {
      diagnostics.push({
        level: "error",
        message: "Page must be an object",
        code: "INVALID_TYPE",
      });
      return {
        valid: false,
        diagnostics,
      };
    }

    // Try to parse with schema
    UiPageSchema.parse(page);
  } catch (error) {
    if (isZodError(error)) {
      error.errors.forEach((err: z.ZodIssue) => {
        diagnostics.push({
          level: "error",
          message: err.message,
          path: err.path.join("."),
          code: "SCHEMA_VALIDATION_ERROR",
        });
      });
    } else {
      const errorMessage = getErrorMessage(error);
      diagnostics.push({
        level: "error",
        message: `Validation error: ${errorMessage}`,
        code: "UNKNOWN_ERROR",
      });
    }
  }

  // Additional registry validation
  if (diagnostics.length === 0 && isUiPage(page)) {
    validateAgainstRegistry(page, registry, diagnostics);
  }

  return {
    valid: diagnostics.filter((d) => d.level === "error").length === 0,
    diagnostics,
  };
}

/**
 * Validate a patch operation
 */
export function validatePatch(patch: unknown): ValidationResult {
  const diagnostics: Diagnostic[] = [];

  try {
    PatchSchema.parse(patch);
  } catch (error) {
    if (isZodError(error)) {
      error.errors.forEach((err: z.ZodIssue) => {
        diagnostics.push({
          level: "error",
          message: err.message,
          path: err.path.join("."),
          code: "PATCH_VALIDATION_ERROR",
        });
      });
    } else {
      diagnostics.push({
        level: "error",
        message: `Patch validation error: ${getErrorMessage(error)}`,
        code: "UNKNOWN_ERROR",
      });
    }
  }

  return {
    valid: diagnostics.filter((d) => d.level === "error").length === 0,
    diagnostics,
  };
}

/**
 * Type guard: check if value is a UI node
 */
function isUiNode(value: unknown): value is UiNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "id" in value
  );
}

/**
 * Type guard: check if value is a UI page
 */
function isUiPage(value: unknown): value is UiPage {
  return isUiNode(value) && value.type === "page";
}

/**
 * Validate node against registry rules
 */
function validateAgainstRegistry(
  node: UiNode,
  registry: ComponentRegistry,
  diagnostics: Diagnostic[]
): void {
  if (node.type === "component") {
    const component = (node as UiComponent).component;
    
    // Check if component exists in registry
    if (!registry.components[component]) {
      diagnostics.push({
        level: "error",
        message: `Component "${component}" not found in registry`,
        path: "component",
        code: "INVALID_COMPONENT",
      });
      return;
    }

    const registryComponent = registry.components[component];

    // Validate variant
    if (node.variant && registryComponent.variants) {
      if (!registryComponent.variants.includes(node.variant)) {
        diagnostics.push({
          level: "error",
          message: `Variant "${node.variant}" not found for component "${component}". Available: ${registryComponent.variants.join(", ")}`,
          path: "variant",
          code: "INVALID_VARIANT",
        });
      }
    }

    // Validate props (basic check - registry should provide full schema)
    if (node.props && registryComponent.props) {
      const propKeys = Object.keys(node.props);
      const registryPropKeys = Object.keys(registryComponent.props);
      
      // Warn about unknown props (but don't error - registry might be incomplete)
      propKeys.forEach((propKey) => {
        if (!registryPropKeys.includes(propKey)) {
          diagnostics.push({
            level: "warning",
            message: `Prop "${propKey}" not found in registry for component "${component}"`,
            path: `props.${propKey}`,
            code: "UNKNOWN_PROP",
          });
        }
      });
    }

    // Validate slots
    if (node.slots && registryComponent.slots) {
      const slotKeys = Object.keys(node.slots);
      const availableSlots = registryComponent.slots;
      slotKeys.forEach((slotKey) => {
        if (!availableSlots.includes(slotKey)) {
          diagnostics.push({
            level: "error",
            message: `Slot "${slotKey}" not found for component "${component}". Available: ${availableSlots.join(", ")}`,
            path: `slots.${slotKey}`,
            code: "INVALID_SLOT",
          });
        }
      });
    }
  }

  // Recursively validate children
  if ("children" in node && Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      if (isUiNode(child)) {
        validateAgainstRegistry(child, registry, diagnostics);
      }
    });
  }

  // Validate slots
  if ("slots" in node && node.slots) {
    Object.entries(node.slots).forEach(([slotName, slotNodes]) => {
      slotNodes.forEach((slotNode, index) => {
        if (isUiNode(slotNode)) {
          validateAgainstRegistry(slotNode, registry, diagnostics);
        }
      });
    });
  }
}

/**
 * Export JSON Schema (for external validation)
 */
export function exportJsonSchema(): object {
  // Convert Zod schemas to JSON Schema using zod-to-json-schema
  // This allows external tools to validate UI-DSL v2 structures
  try {
    // Dynamic import to avoid issues if zod-to-json-schema is not available
    const { zodToJsonSchema } = require("zod-to-json-schema");
    
    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "https://fragment-ui.dev/schemas/ui-dsl-v2.json",
      title: "UI-DSL v2 Schema",
      description: "Schema for Fragment UI DSL v2 (layout-first, datasources, slots)",
      definitions: {
        UiNode: zodToJsonSchema(UiNodeSchema),
        UiPage: zodToJsonSchema(UiPageSchema),
        UiSection: zodToJsonSchema(UiSectionSchema),
        UiGrid: zodToJsonSchema(UiGridSchema),
        UiBlockRef: zodToJsonSchema(UiBlockRefSchema),
        UiComponent: zodToJsonSchema(UiComponentSchema),
        DataSource: zodToJsonSchema(DataSourceSchema),
        Binding: zodToJsonSchema(BindingSchema),
        Patch: zodToJsonSchema(PatchSchema),
        Diagnostic: zodToJsonSchema(DiagnosticSchema),
        ValidationResult: zodToJsonSchema(ValidationResultSchema),
      },
      // Main schema is UiPage
      ...zodToJsonSchema(UiPageSchema),
    };
  } catch (error) {
    // Fallback if zod-to-json-schema is not available
    console.warn("[UI-DSL] zod-to-json-schema not available, returning basic schema");
    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        type: { type: "string", enum: ["page", "section", "grid", "block", "component"] },
        id: { type: "string", format: "uuid" },
      },
      required: ["type", "id"],
    };
  }
}

function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

