/**
 * Code validation against Fragment UI design system rules
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getRepoRoot } from "./root.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = getRepoRoot();

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  rule: string;
  fix?: string;
}

export interface ValidationWarning {
  line?: number;
  column?: number;
  message: string;
  rule: string;
  suggestion?: string;
}

/**
 * Validate code against Fragment UI rules
 */
export async function validateCode(
  code: string,
  filePath?: string
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];

  // Rule 1: No raw color values (use tokens)
  const colorRegex = /#[0-9A-Fa-f]{3,6}\b/g;
  const colorMatches = code.matchAll(colorRegex);
  for (const match of colorMatches) {
    const line = code.substring(0, match.index).split("\n").length;
    errors.push({
      line,
      message: `Raw color value found: ${match[0]}. Use design tokens instead (e.g., var(--color-primary))`,
      rule: "no-raw-colors",
      fix: `Replace ${match[0]} with appropriate token from @fragment_ui/tokens`,
    });
  }

  // Rule 2: No raw spacing values (use tokens)
  const spacingRegex = /(\d+)px\b/g;
  const spacingMatches = code.matchAll(spacingRegex);
  for (const match of spacingMatches) {
    const line = code.substring(0, match.index).split("\n").length;
    warnings.push({
      line,
      message: `Raw spacing value found: ${match[0]}. Consider using design tokens (e.g., var(--space-4))`,
      rule: "prefer-token-spacing",
      suggestion: `Replace ${match[0]} with spacing token`,
    });
  }

  // Rule 3: Check for Fragment UI component imports
  if (!code.includes("@fragment_ui/ui") && !code.includes("@fragment_ui/blocks")) {
    warnings.push({
      message: "No Fragment UI components imported. Consider using Fragment UI components for consistency.",
      rule: "use-fragment-components",
      suggestion: "Import components from @fragment_ui/ui or @fragment_ui/blocks",
    });
  }

  // Rule 4: Check for proper TypeScript types
  if (code.includes("any") && !code.includes("// eslint-disable")) {
    warnings.push({
      message: "Found 'any' type. Use proper TypeScript types for better type safety.",
      rule: "no-any-types",
      suggestion: "Replace 'any' with specific types",
    });
  }

  // Rule 5: Check for accessibility attributes
  if (code.includes("<button") && !code.includes("aria-")) {
    warnings.push({
      message: "Button element found without ARIA attributes. Ensure accessibility.",
      rule: "a11y-required",
      suggestion: "Add aria-label or aria-labelledby to button",
    });
  }

  // Rule 6: Check for token imports
  if (code.includes("var(--") && !code.includes("@fragment_ui/tokens")) {
    suggestions.push(
      "Consider importing tokens from @fragment_ui/tokens for better type safety"
    );
  }

  // Rule 7: Check for proper component prop casing
  const propRegex = /(\w+)-(\w+)=/g;
  const propMatches = code.matchAll(propRegex);
  for (const match of propMatches) {
    if (match[1] && match[2]) {
      warnings.push({
        message: `Kebab-case prop found: ${match[0]}. Fragment UI uses camelCase for props.`,
        rule: "prop-casing",
        suggestion: `Use camelCase: ${match[1]}${match[2].charAt(0).toUpperCase() + match[2].slice(1)}=`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

