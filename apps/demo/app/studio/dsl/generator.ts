/**
 * UI-DSL Generator
 * 
 * Main entry point - exports types and re-exports core generator function.
 * Implementation is split across multiple modules to avoid circular dependencies.
 */

export interface GeneratorOptions {
  useFormEnhanced?: boolean; // Use FormEnhanced instead of basic Form
  includeImports?: boolean; // Include import statements
  includeValidation?: boolean; // Include zod validation (optional, FormEnhanced has its own validation)
}

// Re-export for backward compatibility
export { generateTSX } from './generator-core';
