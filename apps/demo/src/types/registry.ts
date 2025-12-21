/**
 * TypeScript types for Component Registry
 * Extended metadata structure for DS Components
 */

export type ComponentType = 'simple' | 'compound' | 'alias';

export type ExampleType = 'minimal' | 'full' | 'interactive';

export interface ComponentExample {
  type: ExampleType;
  code?: string; // Pre-generated example code
}

export interface ComponentInfo {
  import: string;
  type?: ComponentType;
  requiresSubcomponents?: string[];
  requiresContext?: boolean;
  selfClosing?: boolean;
  aliasFor?: string; // For alias components
  aliasProps?: Record<string, any>; // Props to add when using alias
  example?: ComponentExample;
  props?: Record<string, any>;
  note?: string;
}

export interface Registry {
  $schema?: string;
  version: string;
  components: Record<string, ComponentInfo>;
  aliases: Record<string, string>;
  rules?: {
    forbiddenHtml?: string[];
    prefer?: Record<string, string>;
  };
}

export interface ComponentMetadata {
  name: string; // Original name (may be alias)
  actualName: string; // Resolved name (after alias resolution)
  type: ComponentType;
  requiresSubcomponents?: string[];
  requiresContext: boolean;
  selfClosing: boolean;
  aliasProps?: Record<string, any>;
  example?: ComponentExample;
  props?: Record<string, any>;
  import: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

