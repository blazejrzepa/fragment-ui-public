"use client";

import * as React from "react";
import { ComponentDisplayProps } from "./types";

/**
 * ComponentPreview - Unified preview renderer for components
 * 
 * This component provides a consistent way to render component previews
 * across all locations (documentation, library tab, left sidebar, inspector).
 * 
 * It wraps ReactLiveRenderer with consistent styling and error handling.
 */
export interface ComponentPreviewProps extends ComponentDisplayProps {
  onError?: (error: Error) => void;
  fullSize?: boolean;
}

// Dynamic import to avoid bundling ReactLiveRenderer in @fragment_ui/ui
// ReactLiveRenderer will be provided by the consuming app
let ReactLiveRenderer: React.ComponentType<any> | null = null;

// Function to set ReactLiveRenderer from consuming app
export function setReactLiveRenderer(renderer: React.ComponentType<any>) {
  ReactLiveRenderer = renderer;
}

export function ComponentPreview({
  componentName,
  componentInfo,
  previewCode,
  variant,
  showMetadata = false,
  showExamples = false,
  height = "300px",
  className = "",
  onError,
  fullSize = false,
}: ComponentPreviewProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  // Track mount state to avoid hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate preview code if not provided
  const code = React.useMemo(() => {
    let finalCode: string;
    
    if (previewCode) {
      // Debug: log preview code (only in development)
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && componentName === 'Accordion') {
        console.log('[ComponentPreview] Using previewCode for Accordion:', previewCode.substring(0, 200) + '...');
      }
      finalCode = previewCode;
    } else if (componentInfo?.examples && componentInfo.examples.length > 0) {
      // Basic fallback code generation
      const example = variant 
        ? componentInfo.examples.find(e => e.name === variant) || componentInfo.examples[0]
        : componentInfo.examples[0];
      finalCode = example.code;
    } else {
      // Generate basic component usage
      const componentNamePascal = componentName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      finalCode = `import { ${componentNamePascal} } from "${componentInfo?.package || "@fragment_ui/ui"}";

<${componentNamePascal} />`;
    }
    
    // Fix FormFieldEnhanced - must be wrapped in FormEnhanced
    // Apply to ALL code that uses FormFieldEnhanced, not just form-field-enhanced
    // More aggressive check: look for FormFieldEnhanced anywhere in the code
    const hasFormFieldEnhanced = /<FormFieldEnhanced[\s>]/.test(finalCode);
    const hasFormEnhanced = /<FormEnhanced[\s>]/.test(finalCode);
    
    if (hasFormFieldEnhanced && !hasFormEnhanced) {
      // Extract imports
      const importLines: string[] = finalCode.match(/^import\s+.*$/gm) || [];
      const restOfCode = finalCode.replace(/^import\s+.*$/gm, '').trim();
      
      // Add FormEnhanced to imports if not present
      if (!importLines.some(line => line.includes('FormEnhanced'))) {
        const packageName = componentInfo?.package || '@fragment_ui/ui';
        // Check if FormFieldEnhanced is already imported to determine import style
        const hasFormFieldEnhancedImport = importLines.some(line => line.includes('FormFieldEnhanced'));
        if (hasFormFieldEnhancedImport) {
          // Add FormEnhanced to existing import
          importLines.forEach((line, index) => {
            if (line.includes('FormFieldEnhanced') && !line.includes('FormEnhanced')) {
              importLines[index] = line.replace(
                /import\s*\{([^}]*FormFieldEnhanced[^}]*)\}\s*from/,
                (match, imports) => {
                  return `import { ${imports}, FormEnhanced } from`;
                }
              );
            }
          });
        } else {
          // Add new import line before the first import or at the beginning
          if (importLines.length > 0) {
            importLines.unshift(`import { FormEnhanced } from "${packageName}";`);
          } else {
            importLines.push(`import { FormEnhanced } from "${packageName}";`);
          }
        }
      }
      
      // More aggressive wrapping: wrap the entire component content if FormFieldEnhanced is found
      // First, try to find the return statement
      let wrappedCode = restOfCode;
      
      // Pattern 1: return (<FormFieldEnhanced ... />)
      if (restOfCode.match(/return\s*\([\s\S]*?<FormFieldEnhanced/)) {
        wrappedCode = restOfCode.replace(
          /(return\s*\([\s\S]*?)(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)([\s\S]*?\))/,
          (match, before, formField, after) => {
            return `${before}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>${after}`;
          }
        );
      }
      
      // Pattern 2: return <FormFieldEnhanced ... /> (no parentheses)
      if (wrappedCode === restOfCode && restOfCode.match(/return\s+<FormFieldEnhanced/)) {
        wrappedCode = restOfCode.replace(
          /(return\s+)(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/,
          (match, returnKeyword, formField) => {
            return `${returnKeyword}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>`;
          }
        );
      }
      
      // Pattern 3: Just <FormFieldEnhanced ... /> without return (JSX at top level)
      if (wrappedCode === restOfCode && restOfCode.match(/^[\s]*<FormFieldEnhanced/)) {
        wrappedCode = restOfCode.replace(
          /(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/,
          `<FormEnhanced onSubmit={(data) => console.log(data)}>
    $1
  </FormEnhanced>`
        );
      }
      
      // Pattern 4: Multiple FormFieldEnhanced instances - wrap each one
      if (wrappedCode === restOfCode) {
        wrappedCode = restOfCode.replace(
          /(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/g,
          `<FormEnhanced onSubmit={(data) => console.log(data)}>
    $1
  </FormEnhanced>`
        );
      }
      
      // If we still haven't wrapped, wrap the entire function body
      if (wrappedCode === restOfCode) {
        // Try to wrap the entire return statement or function body
        if (restOfCode.includes('export default function')) {
          wrappedCode = restOfCode.replace(
            /(export default function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\([\s\S]*?)(<FormFieldEnhanced[\s\S]*?)([\s\S]*?\)[\s\S]*?\})/,
            (match, before, formFieldContent, after) => {
              return `${before}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formFieldContent}
  </FormEnhanced>${after}`;
            }
          );
        }
      }
      
      // Final fallback: if still not wrapped, wrap the entire code block
      if (wrappedCode === restOfCode) {
        // Find where FormFieldEnhanced starts and wrap from there
        const formFieldIndex = wrappedCode.indexOf('<FormFieldEnhanced');
        if (formFieldIndex !== -1) {
          const beforeFormField = wrappedCode.substring(0, formFieldIndex);
          const formFieldAndAfter = wrappedCode.substring(formFieldIndex);
          
          // Find the closing tag
          const closingTagIndex = formFieldAndAfter.indexOf('</FormFieldEnhanced>');
          if (closingTagIndex !== -1) {
            const formField = formFieldAndAfter.substring(0, closingTagIndex + '</FormFieldEnhanced>'.length);
            const afterFormField = formFieldAndAfter.substring(closingTagIndex + '</FormFieldEnhanced>'.length);
            
            wrappedCode = `${beforeFormField}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>${afterFormField}`;
          }
        }
      }
      
      // Reconstruct the code with imports
      finalCode = [
        ...importLines,
        '',
        wrappedCode
      ].join('\n');
    }
    
    return finalCode;
  }, [previewCode, componentInfo, variant, componentName]);

  const handleError = React.useCallback((err: Error) => {
    setError(err.message);
    onError?.(err);
  }, [onError]);

  // During SSR or before mount, show consistent placeholder
  if (!isMounted || !ReactLiveRenderer) {
    // Debug: log if ReactLiveRenderer is not available (only in development)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && !ReactLiveRenderer && isMounted) {
      console.warn('[ComponentPreview] ReactLiveRenderer is not available for component:', componentName);
    }
    return (
      <div
        className={`component-preview ${className}`}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          className="rounded border overflow-hidden"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "var(--background-primary)",
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div className="text-sm text-center p-4" style={{ color: "var(--foreground-secondary)" }}>
            <p>Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`component-preview ${className}`}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className="rounded border overflow-hidden"
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "var(--background-primary)",
          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {error ? (
          <div className="p-4 text-sm text-center" style={{ color: "var(--color-danger)" }}>
            <p>Preview Error</p>
            <p className="text-xs mt-2" style={{ color: "var(--color-fg-muted)" }}>
              {error}
            </p>
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ReactLiveRenderer
              code={code}
              fullSize={fullSize}
              onError={(err: Error) => {
                // Debug: log errors (only in development)
                if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && componentName === 'Accordion') {
                  console.error('[ComponentPreview] Error rendering Accordion:', err);
                  console.error('[ComponentPreview] Code that failed:', code.substring(0, 500));
                }
                handleError(err);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

