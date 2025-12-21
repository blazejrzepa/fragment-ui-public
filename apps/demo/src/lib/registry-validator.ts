/**
 * Registry Validator
 * 
 * Validates registry structure and component metadata
 */

import type { Registry, ValidationResult } from '@/types/registry';

export class RegistryValidator {
  /**
   * Validates registry before use
   */
  async validateRegistry(registry: Registry): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check aliases
    if (registry.aliases) {
      for (const [alias, actualName] of Object.entries(registry.aliases)) {
        if (!registry.components[actualName]) {
          errors.push(`Alias "${alias}" points to non-existent component "${actualName}"`);
        }
      }
    }

    // 2. Check components
    for (const [name, component] of Object.entries(registry.components)) {
      // Check if required subcomponents exist
      if (component.requiresSubcomponents) {
        for (const subcomponent of component.requiresSubcomponents) {
          if (!registry.components[subcomponent]) {
            errors.push(
              `Component "${name}" requires subcomponent "${subcomponent}" which doesn't exist`
            );
          }
        }
      }

      // Check if Context components have examples
      if (component.requiresContext && !component.example?.code) {
        warnings.push(
          `Component "${name}" requires Context but has no pre-generated example. ` +
          `This may cause rendering issues.`
        );
      }

      // Check if alias components have aliasFor
      if (component.type === 'alias' && !component.aliasFor) {
        warnings.push(
          `Component "${name}" is marked as alias but has no "aliasFor" property`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Checks if component is exported from @fragment_ui/ui
   * Note: This is a placeholder - actual validation would require dynamic import
   */
  async validateExports(componentName: string): Promise<boolean> {
    // In development, we could use dynamic import to check
    // In production, we assume everything is OK
    if (process.env.NODE_ENV === 'development') {
      try {
        // This would require actual import, which may not be available in all contexts
        // For now, we'll just return true and log a warning
        console.warn(
          `[RegistryValidator] Export validation for "${componentName}" skipped. ` +
          `This would require dynamic import which may not be available.`
        );
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }
}

