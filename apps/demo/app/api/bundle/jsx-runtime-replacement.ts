/**
 * JSX Runtime Replacement - Testable implementation
 * 
 * This module provides a testable, deterministic implementation of the custom
 * jsx-runtime replacement used in the bundle route. The replacement handles
 * both function and object components (like Radix UI primitives).
 * 
 * This is extracted from the esbuild plugin to make it testable and maintainable.
 */

/**
 * Generates the custom jsx-runtime replacement code
 * This code replaces react/jsx-runtime imports during bundling
 */
export function generateJsxRuntimeReplacement(): string {
  return `
import React from "react";

// Get the REACT_ELEMENT_TYPE symbol from React
// We need to use the exact same symbol that React uses
const REACT_ELEMENT_TYPE = (() => {
  // Create a test element to get the real symbol
  const testElement = React.createElement('div');
  return testElement.$$typeof;
})();

/**
 * Custom jsx function that handles both function and object components
 * This is needed for Radix UI components like AccordionPrimitive.Root
 * which are objects, not functions.
 */
function jsx(type, props, key) {
  // IMPORTANT: React.createElement does NOT support objects as types
  // Radix UI components like AccordionPrimitive.Root are objects, not functions
  // The standard react/jsx-runtime jsx function CAN handle objects
  
  // If type is an object (like AccordionPrimitive.Root), handle it specially
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    // Check if it's already a React element (has $$typeof)
    if (type.$$typeof) {
      return type;
    }
    
    // Normalize props - handle children
    const normalizedProps = props || {};
    if (normalizedProps.children === undefined && key !== undefined) {
      normalizedProps.children = key;
    }
    
    // Create a React element object directly with the object as the type
    // This is what the real jsx function from react/jsx-runtime does
    const element = {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,  // The object itself is the type
      key: key === null ? null : String(key),
      ref: null,
      props: normalizedProps,
      _owner: null,
    };
    
    return element;
  }
  
  // For function components and string types, use standard React.createElement
  return React.createElement(type, props, key);
}

export { jsx };
export const jsxs = jsx;
export const jsxDEV = jsx;
export const Fragment = React.Fragment;
`.trim();
}

/**
 * Creates an esbuild plugin for replacing react/jsx-runtime
 */
export function createJsxRuntimeReplacementPlugin() {
  return {
    name: "replace-jsx-runtime",
    setup(build: any) {
      // Intercept react/jsx-runtime imports and provide custom implementation
      build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => {
        return { path: "react", namespace: "jsx-runtime-replacement" };
      });
      build.onLoad({ filter: /.*/, namespace: "jsx-runtime-replacement" }, () => {
        return {
          contents: generateJsxRuntimeReplacement(),
          loader: "js",
        };
      });
    },
  };
}

