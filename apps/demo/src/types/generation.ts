/**
 * Type definitions for code generation metadata
 */

export interface GenerationMetadata {
  method: "openai" | "ui-dsl" | "unknown";
  model?: string;
  timestamp?: number;
  duration?: number;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  [key: string]: unknown; // Allow additional properties
}

