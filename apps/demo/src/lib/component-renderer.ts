/**
 * Component Renderer
 * 
 * Handles rendering of components with error handling and fallback
 */

import type { ComponentMetadata } from '@/types/registry';
import { ComponentCodeGenerator, ComponentNotFoundError, SubcomponentNotFoundError } from './component-code-generator';

export interface RenderOptions {
  code: string;
  metadata: ComponentMetadata;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export class ComponentRenderer {
  constructor(
    private generator: ComponentCodeGenerator
  ) {}

  /**
   * Converts camelCase to PascalCase for JSX component names
   */
  private toPascalCase(name: string): string {
    if (!name) return name;
    // If already PascalCase (starts with uppercase), return as is
    if (name[0] === name[0].toUpperCase()) return name;
    // Convert camelCase to PascalCase
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Ensures that the generated code has a render() call for react-live's noInline mode
   */
  private ensureRenderCall(code: string): string {
    // First, fix any existing render() calls that use function calls instead of JSX
    // Pattern: render(ComponentName()) -> render(<ComponentName />)
    // Also convert camelCase to PascalCase for JSX
    code = code.replace(/render\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*\)\s*\)/g, (match, componentName) => {
      const pascalCaseName = this.toPascalCase(componentName);
      return `render(<${pascalCaseName} />)`;
    });
    
    // Fix existing render() calls with JSX that use camelCase
    // Pattern: render(<activityFeedExample />) -> render(<ActivityFeedExample />)
    code = code.replace(/render\s*\(\s*<([a-z][a-zA-Z0-9_$]*)\s*\/>\s*\)/g, (match, componentName) => {
      const pascalCaseName = this.toPascalCase(componentName);
      return `render(<${pascalCaseName} />)`;
    });
    
    // Check if code already has render() call (more robust check)
    const hasRenderCall = /render\s*\(/s.test(code);
    if (hasRenderCall) {
      return code;
    }
    
    // Check if code is just React.createElement(...) without a function wrapper
    // Pattern: React.createElement(Component, {...}) or /*#__PURE__*/React.createElement(...)
    const reactCreateElementMatch = code.match(/(?:\/\*#__PURE__\*\/)?React\.createElement\(([A-Z][a-zA-Z0-9_$]*)/);
    if (reactCreateElementMatch && !code.includes('function ') && !code.includes('const ') && !code.includes('export ')) {
      // Code is just React.createElement(...), wrap it in render()
      return `${code}\n\nrender(${code.trim()});`;
    }
    
    // Extract component name from export default function (supports camelCase, PascalCase, etc.)
    // Pattern: export default function componentName()
    const defaultExportMatch = code.match(/export\s+default\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (defaultExportMatch) {
      const componentName = defaultExportMatch[1];
      const pascalCaseName = this.toPascalCase(componentName);
      // Add render call at the end using JSX syntax (required for hooks to work)
      // Use PascalCase for JSX component name
      return `${code}\n\nrender(<${pascalCaseName} />);`;
    }
    
    // Try to find const/function component export
    // Pattern: export default const componentName =
    const constExportMatch = code.match(/export\s+default\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
    if (constExportMatch) {
      const componentName = constExportMatch[1];
      const pascalCaseName = this.toPascalCase(componentName);
      return `${code}\n\nrender(<${pascalCaseName} />);`;
    }
    
    // Try to find any exported function component (supports camelCase, PascalCase)
    // Pattern: function ComponentName() or export function ComponentName()
    const functionMatch = code.match(/(?:export\s+default\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (functionMatch) {
      const componentName = functionMatch[1];
      const pascalCaseName = this.toPascalCase(componentName);
      return `${code}\n\nrender(<${pascalCaseName} />);`;
    }
    
    // Try to find any exported const component (supports arrow functions)
    // Pattern: const ComponentName = () => or const ComponentName = function()
    const constComponentMatch = code.match(/(?:export\s+default\s+)?const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\(|function)/);
    if (constComponentMatch) {
      const componentName = constComponentMatch[1];
      const pascalCaseName = this.toPascalCase(componentName);
      return `${code}\n\nrender(<${pascalCaseName} />);`;
    }
    
    // Last resort: try to find Preview component (most common pattern)
    if (code.includes('function Preview') || code.includes('const Preview')) {
      return `${code}\n\nrender(<Preview />);`;
    }
    
    // Final fallback: if code contains React.createElement(...), wrap it in render()
    if (code.includes('React.createElement(') && !hasRenderCall) {
      return `${code}\n\nrender(${code.trim()});`;
    }
    
    // Final fallback: try to render the last exported component or add a generic render
    // But this is risky, so we'll let ReactLiveRenderer handle it with a warning
    console.warn('[ComponentRenderer] Could not find component to render, code may fail:', code.substring(0, 100));
    return code;
  }

  /**
   * Renders component with error handling and fallback
   */
  async render(componentName: string, options: Partial<RenderOptions> = {}): Promise<string> {
    try {
      // 1. Generate code (this already handles Context components and uses pre-generated examples)
      let code = await this.generator.generateCode(componentName);
      
      // 2. Ensure render() call is present for react-live's noInline mode
      code = this.ensureRenderCall(code);
      
      // 3. Get metadata for logging
      const metadata = this.generator.resolveComponent(componentName);
      
      // 4. Log if Context component
      if (metadata.requiresContext) {
        console.log(`[ComponentRenderer] Rendering Context component "${componentName}"`, {
          hasPreGeneratedExample: !!metadata.example?.code,
          codeLength: code.length
        });
      }

      // 5. Return generated code with render() call
      options.onSuccess?.();
      return code;
    } catch (error) {
      if (error instanceof ComponentNotFoundError) {
        return this.generateFallback(
          `Component "${error.componentName}" not found.`,
          `Available components: ${this.getAvailableComponents().join(', ')}`,
          options
        );
      }
      
      if (error instanceof SubcomponentNotFoundError) {
        return this.generateFallback(
          `Subcomponent "${error.subcomponent}" not found.`,
          `Please add "${error.subcomponent}" to registry.`,
          options
        );
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.generateFallback(
        'Failed to render component.',
        errorMessage,
        options
      );
    }
  }

  // Note: renderWithContextSupport is no longer needed since ComponentCodeGenerator
  // already handles Context components and uses pre-generated examples with correct function names

  /**
   * Generates fallback code with error information
   */
  private generateFallback(
    title: string,
    message: string,
    options: Partial<RenderOptions>
  ): string {
    const fallbackCode = `
"use client";
import React from "react";

export default function ComponentError() {
  return (
    <div style={{
      padding: "2rem",
      textAlign: "center",
      color: "var(--foreground-primary)",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h3 style={{ 
        marginBottom: "1rem",
        fontSize: "1.25rem",
        fontWeight: 600
      }}>
        ${title}
      </h3>
      <p style={{ 
        color: "var(--foreground-secondary)",
        fontSize: "0.875rem",
        lineHeight: "1.5"
      }}>
        ${message}
      </p>
    </div>
  );
}`;

    // Call error handler if provided
    if (options.onError) {
      options.onError(new Error(`${title}: ${message}`));
    }

    return fallbackCode;
  }

  /**
   * Gets list of available components from registry
   */
  private getAvailableComponents(): string[] {
    // Access registry through generator
    const registry = (this.generator as any).registry;
    if (!registry || !registry.components) {
      return [];
    }
    return Object.keys(registry.components);
  }
}

