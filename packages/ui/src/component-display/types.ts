/**
 * Types for unified component display system
 */

export interface ComponentExample {
  name: string;
  code: string;
  preview?: string;
  description?: string;
}

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description?: string;
}

export interface PropDefinition {
  name: string;
  type: string;
  default?: any;
  required?: boolean;
  description?: string;
}

export interface Slot {
  name: string;
  description?: string;
  required?: boolean;
}

export interface AccessibilityInfo {
  role?: string;
  notes?: string;
  wcag?: string[];
}

export interface EnhancedComponentInfo {
  name: string;
  import: string;
  package: "@fragment_ui/ui" | "@fragment_ui/blocks";
  note?: string;
  
  // Enhanced fields for unified display
  description?: string;
  examples?: ComponentExample[];
  variants?: ComponentVariant[];
  features?: string[];
  accessibility?: AccessibilityInfo;
  props?: PropDefinition[];
  slots?: Slot[];
  related?: string[];
  stability?: "stable" | "experimental" | "deprecated";
  deprecationVersion?: string;
  deprecationRemovalVersion?: string;
}

export interface ComponentDisplayProps {
  componentName: string;
  componentInfo?: Partial<EnhancedComponentInfo>;
  previewCode?: string;
  variant?: string;
  showMetadata?: boolean;
  showExamples?: boolean;
  height?: string | number;
  className?: string;
}

