/**
 * UI-DSL (UI Domain-Specific Language) Types
 * 
 * Intermediate format for AI-powered component generation.
 * Allows structured specification of UI components before code generation.
 */

/**
 * Field component types available in Fragment UI
 */
export type FieldComponentType =
  | "Input"
  | "Textarea"
  | "Select"
  | "Checkbox"
  | "Radio"
  | "Switch"
  | "Slider"
  | "DatePicker"
  | "FileUpload"
  | "MultiSelect"
  | "Combobox";

/**
 * Validation rule specification
 */
export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number;
  message?: string;
}

/**
 * Field specification
 */
export interface Field {
  name: string;
  label: string;
  component: FieldComponentType;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  validation?: ValidationRule[];
  defaultValue?: string | number | boolean;
  options?: Array<{ label: string; value: string }>; // For Select, Radio, etc.
}

/**
 * Action specification (buttons, links)
 */
export interface Action {
  type: "submit" | "button" | "link";
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  onClick?: string; // JavaScript code or function name
  href?: string; // For links
}

/**
 * Layout configuration
 */
export interface Layout {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  gap?: "2" | "4" | "6" | "8";
  columns?: 1 | 2 | 3 | 4;
  spacing?: "compact" | "normal" | "relaxed";
}

/**
 * Accessibility configuration
 */
export interface A11y {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  role?: string;
}

/**
 * Scaffold type
 */
export type ScaffoldType = "form-auth" | "two-column" | "settings-page" | "dashboard" | "default";

/**
 * UI-DSL specification
 */
export interface UIDSL {
  type: "form" | "screen" | "app";
  title?: string;
  description?: string;
  fields?: Field[];
  actions?: Action[];
  layout?: Layout;
  a11y?: A11y;
  scaffold?: ScaffoldType;
  metadata?: {
    version?: string;
    generatedAt?: string;
    source?: string; // Original prompt
  };
}

/**
 * Screen specification (for multi-screen apps)
 */
export interface Screen {
  id: string;
  name: string;
  title?: string;
  description?: string;
  dsl: UIDSL;
}

/**
 * App flow specification (multi-screen applications)
 */
export interface AppFlow {
  id: string;
  name: string;
  screens: Screen[];
  navigation?: {
    type: "tabs" | "sidebar" | "stepper" | "menu";
    items: Array<{ screenId: string; label: string; icon?: string }>;
  };
}

