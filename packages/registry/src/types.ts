/**
 * Registry Types
 * 
 * Type definitions for the component registry
 */

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description?: string;
}

export interface ComponentA11y {
  role: string;
  notes: string;
  wcag?: string[]; // WCAG compliance levels (e.g., ["2.1.1", "4.1.2"])
}

export interface ComponentExample {
  name: string;
  code: string;
  preview?: string;
  description?: string;
}

export interface ComponentExamples {
  tsx: string;
  dsl: string;
  // Enhanced: array of examples for multiple variants
  examples?: ComponentExample[];
}

export type ComponentStability = "stable" | "experimental" | "deprecated";

export interface ComponentInfo {
  import: string;
  props?: Record<string, any | string[]>;
  variants?: ComponentVariant[];
  slots?: string[];
  a11y?: ComponentA11y;
  examples?: ComponentExamples | ComponentExample[]; // Support both old format (object) and new format (array)
  forbiddenHtml?: string[]; // HTML elements that should not be used in this component
  note?: string;
  // Enhanced fields for unified display
  description?: string; // Component description
  features?: string[]; // Feature list
  related?: string[]; // Related component names
  stability?: ComponentStability; // Component stability level (stable, experimental, deprecated)
  deprecationVersion?: string; // Version when component was deprecated (if stability === "deprecated")
  deprecationRemovalVersion?: string; // Version when component will be removed (if stability === "deprecated")
}

export interface Registry {
  $schema?: string;
  version: string;
  components: Record<string, ComponentInfo>;
  aliases?: Record<string, string>;
  rules?: {
    forbiddenHtml?: string[];
    prefer?: Record<string, string>;
  };
}

