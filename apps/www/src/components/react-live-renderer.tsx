"use client";

import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as FragmentUI from "@fragment_ui/ui";
import * as FragmentBlocks from "@fragment_ui/blocks";
import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

interface ReactLiveRendererProps {
  code: string;
  onError?: (error: Error) => void;
  fullSize?: boolean;
}

export function ReactLiveRenderer({ code, onError, fullSize = false }: ReactLiveRendererProps) {
  const scope = {
    ...FragmentUI,
    ...FragmentBlocks,
    React,
    useState,
    useEffect,
    useRef,
    useCallback,
  };

  // Clean up code - ensure it has a render function for noInline mode
  // react-live with noInline={true} requires calling render()
  let cleanCode = code.trim();
  
  // Remove import statements (they're provided in scope)
  // Handle both single-line and multi-line imports
  // First, remove multi-line imports (with line breaks in braces)
  cleanCode = cleanCode.replace(/import\s+\{[\s\S]*?\}\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  // Then remove single-line imports
  cleanCode = cleanCode.replace(/import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  
  // Clean up any extra blank lines
  cleanCode = cleanCode.replace(/\n{3,}/g, '\n\n').trim();
  
  // Check if code already has render()
  const hasRender = cleanCode.includes("render(");
  
  if (!hasRender) {
    // Remove export default if present
    const hasExportDefault = cleanCode.includes("export default");
    if (hasExportDefault) {
      // Try: export default function Preview
      const exportDefaultFunctionMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
      if (exportDefaultFunctionMatch) {
        const componentName = exportDefaultFunctionMatch[1];
        // Remove export default, keep function
        cleanCode = cleanCode.replace(/export\s+default\s+function\s+/, "function ");
        cleanCode = `${cleanCode}\n\nrender(React.createElement(${componentName}))`;
      } else {
        // Try: export default Preview (for const declarations)
        const exportDefaultMatch = cleanCode.match(/export\s+default\s+([A-Z][a-zA-Z0-9]*)/);
        if (exportDefaultMatch) {
          const componentName = exportDefaultMatch[1];
          // Verify component exists
          if (cleanCode.includes(`function ${componentName}`) || 
              cleanCode.includes(`const ${componentName}`) ||
              cleanCode.includes(`class ${componentName}`)) {
            cleanCode = cleanCode.replace(/export\s+default\s+/, "");
            cleanCode = `${cleanCode}\n\nrender(React.createElement(${componentName}))`;
          } else {
            // Component not found, find any component
            const componentMatch = cleanCode.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=(]/);
            if (componentMatch) {
              const foundComponentName = componentMatch[1];
              cleanCode = cleanCode.replace(/export\s+default\s+/, "");
              cleanCode = `${cleanCode}\n\nrender(React.createElement(${foundComponentName}))`;
            } else {
              // Fallback: wrap in Preview
              cleanCode = cleanCode.replace(/export\s+default\s+/, "");
              cleanCode = `const Preview = () => { return (${cleanCode}); };\nrender(React.createElement(Preview))`;
            }
          }
        } else {
          // No component name after export default, find any component
          const componentMatch = cleanCode.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=(]/);
          if (componentMatch) {
            const componentName = componentMatch[1];
            cleanCode = cleanCode.replace(/export\s+default\s+/, "");
            cleanCode = `${cleanCode}\n\nrender(React.createElement(${componentName}))`;
          } else {
            // Fallback: wrap entire code
            cleanCode = cleanCode.replace(/export\s+default\s+/, "");
            cleanCode = `const Preview = () => { return (${cleanCode}); };\nrender(React.createElement(Preview))`;
          }
        }
      }
    } else {
      // No export default, try to find component
      // Look for React components (uppercase first letter)
      const componentMatch = cleanCode.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=(]/);
      if (componentMatch) {
        const componentName = componentMatch[1];
        // Verify component exists
        if (cleanCode.includes(`function ${componentName}`) || 
            cleanCode.includes(`const ${componentName}`) ||
            cleanCode.includes(`class ${componentName}`)) {
          cleanCode = `${cleanCode}\n\nrender(React.createElement(${componentName}))`;
        } else {
          // Component not found, wrap code
          cleanCode = `const Preview = () => { return (${cleanCode}); };\nrender(React.createElement(Preview))`;
        }
      } else {
        // No component found, wrap entire code in Preview
        if (cleanCode.includes("<") && cleanCode.includes(">")) {
          // Looks like JSX, wrap it
          cleanCode = `const Preview = () => { return (${cleanCode}); };\nrender(React.createElement(Preview))`;
        } else {
          // Not JSX, might be a statement, wrap it
          cleanCode = `const Preview = () => { return (${cleanCode}); };\nrender(React.createElement(Preview))`;
        }
      }
    }
  }

  return (
    <LiveProvider 
      code={cleanCode}
      scope={scope}
      noInline={true}
    >
      <div 
        className={fullSize ? "w-full h-full" : "w-full"}
        style={{
          backgroundColor: "var(--background-primary)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: "100%",
          maxWidth: "100%",
          position: "relative",
        }}
      >
        <div style={{ 
          flex: 1, 
          width: "100%", 
          minWidth: "100%",
          maxWidth: "100%",
          height: fullSize ? "100%" : "auto",
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <LivePreview />
        </div>
        <LiveError
          style={{
            color: "var(--color-status-error-base)",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "var(--color-surface-1)",
            border: "1px solid var(--color-status-error-border)",
            fontFamily: "Monaco, Consolas, monospace",
            fontSize: "13px",
            marginTop: "8px",
          }}
        />
      </div>
    </LiveProvider>
  );
}

