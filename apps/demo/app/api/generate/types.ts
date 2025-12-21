/**
 * Types for generate API
 */

export interface GenerateRequest {
  prompt: string;
  demoName?: string;
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  helperText?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: string;
  };
}

export interface FormTemplate {
  title: string;
  description: string;
  fields: FormField[];
  submitText: string;
  successMessage: string;
}

