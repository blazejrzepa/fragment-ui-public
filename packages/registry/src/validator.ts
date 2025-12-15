/**
 * Registry Validator
 * 
 * Validates registry.json structure and content
 */

import type { Registry, ComponentInfo } from "./types";

export interface ValidationError {
  path: string;
  message: string;
  level: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate registry structure
 */
export function validateRegistry(registry: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!registry || typeof registry !== "object") {
    return {
      valid: false,
      errors: [{ path: "root", message: "Registry must be an object", level: "error" }],
      warnings: [],
    };
  }

  const reg = registry as Record<string, any>;

  // Check required fields
  if (!reg.version || typeof reg.version !== "string") {
    errors.push({ path: "version", message: "Version is required and must be a string", level: "error" });
  }

  if (!reg.components || typeof reg.components !== "object") {
    errors.push({ path: "components", message: "Components is required and must be an object", level: "error" });
    return { valid: false, errors, warnings };
  }

  // Validate each component
  Object.entries(reg.components).forEach(([componentName, componentInfo]) => {
    const path = `components.${componentName}`;
    validateComponent(componentName, componentInfo, path, errors, warnings);
  });

  // Validate aliases
  if (reg.aliases) {
    if (typeof reg.aliases !== "object") {
      errors.push({ path: "aliases", message: "Aliases must be an object", level: "error" });
    } else {
      Object.entries(reg.aliases).forEach(([alias, target]) => {
        if (!reg.components[target as string]) {
          warnings.push({
            path: `aliases.${alias}`,
            message: `Alias "${alias}" points to non-existent component "${target}"`,
            level: "warning",
          });
        }
      });
    }
  }

  // Validate rules
  if (reg.rules) {
    if (typeof reg.rules !== "object") {
      errors.push({ path: "rules", message: "Rules must be an object", level: "error" });
    } else {
      if (reg.rules.forbiddenHtml && !Array.isArray(reg.rules.forbiddenHtml)) {
        errors.push({ path: "rules.forbiddenHtml", message: "forbiddenHtml must be an array", level: "error" });
      }
      if (reg.rules.prefer && typeof reg.rules.prefer !== "object") {
        errors.push({ path: "rules.prefer", message: "prefer must be an object", level: "error" });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single component
 */
function validateComponent(
  name: string,
  info: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  if (!info || typeof info !== "object") {
    errors.push({ path, message: "Component info must be an object", level: "error" });
    return;
  }

  // Check required fields
  if (!info.import || typeof info.import !== "string") {
    errors.push({ path: `${path}.import`, message: "Import is required and must be a string", level: "error" });
  }

  // Validate variants
  if (info.variants) {
    if (!Array.isArray(info.variants)) {
      errors.push({ path: `${path}.variants`, message: "Variants must be an array", level: "error" });
    } else {
      info.variants.forEach((variant: any, index: number) => {
        const variantPath = `${path}.variants[${index}]`;
        if (!variant.name || typeof variant.name !== "string") {
          errors.push({ path: `${variantPath}.name`, message: "Variant name is required", level: "error" });
        }
        if (variant.props && typeof variant.props !== "object") {
          errors.push({ path: `${variantPath}.props`, message: "Variant props must be an object", level: "error" });
        }
      });
    }
  }

  // Validate slots
  if (info.slots) {
    if (!Array.isArray(info.slots)) {
      errors.push({ path: `${path}.slots`, message: "Slots must be an array", level: "error" });
    }
  }

  // Validate a11y
  if (info.a11y) {
    if (typeof info.a11y !== "object") {
      errors.push({ path: `${path}.a11y`, message: "A11y must be an object", level: "error" });
    } else {
      if (!info.a11y.role || typeof info.a11y.role !== "string") {
        errors.push({ path: `${path}.a11y.role`, message: "A11y role is required", level: "error" });
      }
      if (!info.a11y.notes || typeof info.a11y.notes !== "string") {
        warnings.push({ path: `${path}.a11y.notes`, message: "A11y notes are recommended", level: "warning" });
      }
    }
  }

  // Validate stability
  if (info.stability) {
    const validStabilities = ["stable", "experimental", "deprecated"];
    if (!validStabilities.includes(info.stability)) {
      errors.push({
        path: `${path}.stability`,
        message: `Stability must be one of: ${validStabilities.join(", ")}`,
        level: "error",
      });
    }
    
    // If deprecated, check for deprecation info
    if (info.stability === "deprecated") {
      if (!info.note && !info.description) {
        warnings.push({
          path: `${path}.note`,
          message: "Deprecated components should have a note explaining the deprecation",
          level: "warning",
        });
      }
    }
  }

  // Validate examples
  if (info.examples) {
    if (typeof info.examples !== "object") {
      errors.push({ path: `${path}.examples`, message: "Examples must be an object", level: "error" });
    } else {
      if (!info.examples.tsx || typeof info.examples.tsx !== "string") {
        warnings.push({ path: `${path}.examples.tsx`, message: "TSX example is recommended", level: "warning" });
      }
      if (!info.examples.dsl || typeof info.examples.dsl !== "string") {
        warnings.push({ path: `${path}.examples.dsl`, message: "DSL example is recommended", level: "warning" });
      }
    }
  }
}

/**
 * Load and validate registry from JSON
 */
export function loadAndValidateRegistry(json: string): { registry: Registry | null; result: ValidationResult } {
  try {
    const registry = JSON.parse(json) as Registry;
    const result = validateRegistry(registry);
    return { registry: result.valid ? registry : null, result };
  } catch (error) {
    return {
      registry: null,
      result: {
        valid: false,
        errors: [{ path: "root", message: `JSON parse error: ${error}`, level: "error" }],
        warnings: [],
      },
    };
  }
}

