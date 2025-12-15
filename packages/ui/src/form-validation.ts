/**
 * Form validation utilities
 */

export type ValidationRule<T = string> = {
  message: string;
  validate: (value: T) => boolean;
};

export interface ValidationRules {
  required?: { message?: string };
  minLength?: { value: number; message?: string };
  maxLength?: { value: number; message?: string };
  email?: { message?: string };
  pattern?: { value: RegExp; message?: string };
  custom?: ValidationRule[];
}

/**
 * Validate a single value against rules
 */
export function validateValue<T = string>(
  value: T,
  rules?: ValidationRules
): string | undefined {
  if (!rules) return undefined;

  // Required
  if (rules.required) {
    if (value === undefined || value === null || value === "") {
      return rules.required.message || "This field is required";
    }
  }

  // Skip other validations if value is empty (required handles empty)
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const stringValue = String(value);

  // Min length
  if (rules.minLength) {
    if (stringValue.length < rules.minLength.value) {
      return (
        rules.minLength.message ||
        `Must be at least ${rules.minLength.value} characters`
      );
    }
  }

  // Max length
  if (rules.maxLength) {
    if (stringValue.length > rules.maxLength.value) {
      return (
        rules.maxLength.message ||
        `Must be no more than ${rules.maxLength.value} characters`
      );
    }
  }

  // Email
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return rules.email.message || "Invalid email address";
    }
  }

  // Pattern
  if (rules.pattern) {
    if (!rules.pattern.value.test(stringValue)) {
      return rules.pattern.message || "Invalid format";
    }
  }

  // Custom validators
  if (rules.custom) {
    for (const rule of rules.custom) {
      // Type assertion needed because custom validators might have different generic types
      if (!rule.validate(value as any)) {
        return rule.message;
      }
    }
  }

  return undefined;
}

/**
 * Common validation presets
 */
export const validators = {
  required: (message = "This field is required"): ValidationRules => ({
    required: { message },
  }),

  email: (message = "Invalid email address"): ValidationRules => ({
    email: { message },
  }),

  minLength: (length: number, message?: string): ValidationRules => ({
    minLength: { value: length, message },
  }),

  maxLength: (length: number, message?: string): ValidationRules => ({
    maxLength: { value: length, message },
  }),

  pattern: (regex: RegExp, message = "Invalid format"): ValidationRules => ({
    pattern: { value: regex, message },
  }),

  compose: (...rules: ValidationRules[]): ValidationRules => {
    return rules.reduce((acc, rule) => ({ ...acc, ...rule }), {});
  },
};

