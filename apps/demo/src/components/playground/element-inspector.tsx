"use client";

import React, { useMemo } from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fragment_ui/ui";
import { ChevronDown } from "lucide-react";
import { foregroundMix } from "@/lib/styles";
import registry from "@fragment_ui/registry/registry.json";
import { TokenPicker } from "./token-picker";

interface ElementInspectorProps {
  selectedElementId: string | null;
  code: string;
  dsl?: any; // DSL object or null
  onClose: () => void;
  onUpdate?: (patch: { op: string; target: { type: string; id: string }; [key: string]: any }) => void;
}

/**
 * Extract element properties from TSX code by data-ui-id
 * Handles elements that span multiple lines
 */
function extractElementProps(code: string, elementId: string): Record<string, any> {
  const props: Record<string, any> = {};
  
  // Find element with this data-ui-id - handle multiline elements
  // Match from opening tag to closing tag (/> or >)
  const elementRegex = new RegExp(`<([A-Za-z]+)[^>]*data-ui-id=["']${elementId}["'][^>]*(?:/>|>)[\\s\\S]*?(?:</\\1>|/>)`, 'g');
  const match = code.match(elementRegex);
  
  if (match) {
    const element = match[0];
    
    // Extract common props (handle multiline)
    const propPatterns = [
      { name: 'variant', pattern: /variant=["']([^"']+)["']/ },
      { name: 'size', pattern: /size=["']([^"']+)["']/ },
      { name: 'type', pattern: /type=["']([^"']+)["']/ },
      { name: 'label', pattern: /label=["']([^"']+)["']/ },
      { name: 'placeholder', pattern: /placeholder=["']([^"']+)["']/ },
      { name: 'required', pattern: /\brequired\b/ },
      { name: 'disabled', pattern: /\bdisabled\b/ },
      { name: 'loading', pattern: /\bloading\b/ },
      { name: 'className', pattern: /className=["']([^"']+)["']/ },
    ];
    
    for (const { name, pattern } of propPatterns) {
      const propMatch = element.match(pattern);
      if (propMatch) {
        if (name === 'required' || name === 'disabled' || name === 'loading') {
          props[name] = true;
        } else {
          props[name] = propMatch[1];
        }
      }
    }
    
    // Extract text content (between opening and closing tags, handle multiline)
    const textMatch = element.match(/>([\s\S]*?)</);
    if (textMatch && textMatch[1].trim()) {
      // Remove JSX expressions and keep only text
      const text = textMatch[1].replace(/\{[^}]*\}/g, '').trim();
      if (text) {
        props.text = text;
      }
    }
  }
  
  return props;
}

/**
 * Get component props from registry
 */
function getComponentProps(componentName: string): Record<string, any> | null {
  if (!componentName || !registry.components) return null;
  
  const component = (registry.components as Record<string, any>)[componentName];
  return component?.props || null;
}

/**
 * Get allowed values for a prop from registry
 */
function getAllowedPropValues(componentName: string, propName: string): string[] | null {
  const props = getComponentProps(componentName);
  if (!props || !props[propName]) return null;
  
  const propDef = props[propName];
  // If prop is an array, it contains allowed values
  if (Array.isArray(propDef)) {
    return propDef;
  }
  // If prop is a string type, return null (any value allowed)
  return null;
}

/**
 * Check if a prop value is allowed
 */
function isPropValueAllowed(componentName: string, propName: string, value: any): boolean {
  const allowedValues = getAllowedPropValues(componentName, propName);
  if (!allowedValues) return true; // No restrictions
  return allowedValues.includes(value);
}

/**
 * Extract component name from TSX element
 * Handles both React components (capitalized) and HTML elements (lowercase)
 * Handles multiline elements
 */
function extractComponentName(code: string, elementId: string): string | null {
  // First try React components (capitalized) - handle multiline
  const reactComponentRegex = new RegExp(`<([A-Z]\\w+)[\\s\\S]*?data-ui-id=["']${elementId}["']`, 'g');
  const reactMatch = code.match(reactComponentRegex);
  if (reactMatch) {
    const componentMatch = reactMatch[0].match(/<([A-Z]\w+)/);
    if (componentMatch) return componentMatch[1];
  }
  
  // Then try HTML elements (lowercase) - handle multiline
  const htmlElementRegex = new RegExp(`<([a-z]+)[\\s\\S]*?data-ui-id=["']${elementId}["']`, 'g');
  const htmlMatch = code.match(htmlElementRegex);
  if (htmlMatch) {
    const elementMatch = htmlMatch[0].match(/<([a-z]+)/);
    if (elementMatch) {
      const tagName = elementMatch[1];
      // Capitalize first letter for display
      return tagName.charAt(0).toUpperCase() + tagName.slice(1);
    }
  }
  
  return null;
}

/**
 * Find DSL node by ID (recursive search)
 */
function findDslNodeById(node: any, id: string): any | null {
  if (!node || typeof node !== "object") return null;
  
  if (node.id === id) {
    return node;
  }

  // Search in children/fields/actions/sections/columns/widgets
  const searchArrays = [
    node.fields,
    node.actions,
    node.sections,
    node.columns,
    node.filters,
    node.widgets,
  ];

  for (const arr of searchArrays) {
    if (Array.isArray(arr)) {
      for (const child of arr) {
        const found = findDslNodeById(child, id);
        if (found) return found;
      }
    }
  }

  // Search in section.content (can be array or object)
  if (node.sections) {
    for (const section of node.sections) {
      if (section.content) {
        if (Array.isArray(section.content)) {
          for (const child of section.content) {
            const found = findDslNodeById(child, id);
            if (found) return found;
          }
        } else if (typeof section.content === "object") {
          for (const children of Object.values(section.content)) {
            if (Array.isArray(children)) {
              for (const child of children) {
                const found = findDslNodeById(child, id);
                if (found) return found;
              }
            }
          }
        }
      }
    }
  }
  
  return null;
}

export const ElementInspector = React.memo(function ElementInspector({
  selectedElementId,
  code,
  dsl,
  onClose,
  onUpdate,
}: ElementInspectorProps) {
  const elementProps = useMemo(() => {
    if (!selectedElementId || !code) return null;
    return extractElementProps(code, selectedElementId);
  }, [selectedElementId, code]);

  const componentName = useMemo(() => {
    if (!selectedElementId || !code) return null;
    return extractComponentName(code, selectedElementId);
  }, [selectedElementId, code]);

  const dslNode = useMemo(() => {
    if (!selectedElementId || !dsl) return null;
    const parsedDsl = typeof dsl === 'string' ? JSON.parse(dsl) : dsl;
    return findDslNodeById(parsedDsl, selectedElementId);
  }, [selectedElementId, dsl]);

  // Get component props from registry
  const registryProps = useMemo(() => {
    if (!componentName) return null;
    return getComponentProps(componentName);
  }, [componentName]);

  // Get allowed variant values from registry
  const allowedVariants = useMemo(() => {
    if (!componentName) return null;
    return getAllowedPropValues(componentName, "variant");
  }, [componentName]);

  if (!selectedElementId || !elementProps) {
    return null;
  }


  const handlePropChange = async (propName: string, value: any) => {
    if (!onUpdate || !selectedElementId) return;
    
    // Create patch operation in the format expected by /api/dsl/patch
    // Format: { op, targetId, args }
    const patch = {
      op: "setProp",
      target: { type: "byId", id: selectedElementId },
      prop: propName,
      value: value,
    };
    
    // Call onUpdate with patch (parent will handle API call and conversion to v2 format)
    onUpdate(patch);
  };

  const handleTokenChange = async (tokenType: "space" | "radius", value: string) => {
    if (!onUpdate || !selectedElementId) return;
    
    // Get token value from tokens
    const tokens = tokenType === "space" 
      ? { "0": 0, "1": 4, "2": 8, "3": 12, "4": 16, "6": 24, "8": 32 }
      : { "sm": 8, "md": 12, "lg": 16, "xl": 24 };
    
    const tokenValue = tokens[value as keyof typeof tokens];
    if (tokenValue === undefined) return;
    
    // Create patch operation for setToken
    const patch = {
      op: "setToken",
      target: { type: "byId", id: selectedElementId },
      token: tokenType,
      value: tokenValue,
    };
    
    // Call onUpdate with patch (parent will handle API call)
    onUpdate(patch);
  };

  // Get current token values from DSL for display
  const currentSpaceToken = useMemo(() => {
    if (!dslNode?.layout?.gap) return undefined;
    const gap = dslNode.layout.gap;
    const spaceTokens = { 0: "0", 4: "1", 8: "2", 12: "3", 16: "4", 24: "6", 32: "8" };
    return spaceTokens[gap as keyof typeof spaceTokens];
  }, [dslNode]);

  const currentRadiusToken = useMemo(() => {
    if (!dslNode?.layout?.radius) return undefined;
    const radius = dslNode.layout.radius;
    const radiusTokens = { 8: "sm", 12: "md", 16: "lg", 24: "xl" };
    return radiusTokens[radius as keyof typeof radiusTokens];
  }, [dslNode]);

  const handleCopyChange = async (path: string, value: string) => {
    if (!onUpdate || !selectedElementId) return;
    
    // Create patch operation for setCopy
    const patch = {
      op: "setCopy",
      target: { type: "byId", id: selectedElementId },
      path: path,
      value: value,
    };
    
    // Call onUpdate with patch (parent will handle API call)
    onUpdate(patch);
  };

  return (
    <div
      className="flex-shrink-0 bg-[color:var(--color-surface-base)]"
      style={{
        width: "320px",
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
          {/* Global styles for SelectTrigger when open */}
          <style dangerouslySetInnerHTML={{__html: `
            [data-state="open"] {
              border-color: color-mix(in srgb, var(--foreground-primary) 5%, transparent) !important;
            }
            /* Remove focus outline from all inputs in Inspector */
            input:focus,
            input:focus-visible {
              outline: none !important;
              box-shadow: none !important;
            }
          `}} />
          {/* Element Info - Enhanced */}
          <div className="space-y-3 pb-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--foreground-secondary)]">Component:</span>
                <span className="text-xs font-semibold text-[color:var(--foreground-primary)]">{componentName || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--foreground-secondary)]">Element ID:</span>
                <code className="text-xs font-mono text-[color:var(--foreground-tertiary)] bg-[color:var(--color-surface-1)] px-1.5 py-0.5 rounded">
                  {selectedElementId.length > 25 ? `${selectedElementId.substring(0, 25)}...` : selectedElementId}
                </code>
              </div>
              {elementProps.type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[color:var(--foreground-secondary)]">Type:</span>
                  <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{elementProps.type}</span>
                </div>
              )}
              {elementProps.className && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-[color:var(--foreground-secondary)] flex-shrink-0">Classes:</span>
                  <code className="text-xs font-mono text-[color:var(--foreground-tertiary)] bg-[color:var(--color-surface-1)] px-1.5 py-0.5 rounded break-all text-right">
                    {elementProps.className.length > 40 ? `${elementProps.className.substring(0, 40)}...` : elementProps.className}
                  </code>
            </div>
              )}
            </div>
          </div>

          {/* All Fields - Props, Tokens, Copy */}
          <div className="space-y-6">
            {/* Props Section */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-[color:var(--foreground-primary)] uppercase tracking-wide">Props</div>
              {/* Variant */}
              {elementProps.variant !== undefined && (
                <div>
                  <label htmlFor="variant" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Variant</label>
                  <Select
                    value={elementProps.variant || ""}
                    onValueChange={(value) => {
                      // Validate against registry
                      if (isPropValueAllowed(componentName || "", "variant", value)) {
                        handlePropChange("variant", value);
                      }
                    }}
                  >
                    <SelectTrigger 
                      id="variant" 
                      className="h-8 text-xs"
                      style={{
                        borderRadius: "8px",
                        borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                      }}
                    >
                      <SelectValue />
                      <ChevronDown className="w-4 h-4 opacity-50" style={{ color: "var(--foreground-secondary)" }} />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      sideOffset={4}
                      align="start"
                      className="!w-[var(--radix-select-trigger-width)]"
                      style={{
                        borderRadius: "8px",
                        width: 'var(--radix-select-trigger-width)',
                        minWidth: 'var(--radix-select-trigger-width)',
                        maxWidth: 'var(--radix-select-trigger-width)',
                      }}
                    >
                      {allowedVariants ? (
                        // Use values from registry
                        allowedVariants.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {variant.charAt(0).toUpperCase() + variant.slice(1)}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback to default values if not in registry
                        <>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size */}
              {elementProps.size !== undefined && (
                <div>
                  <label htmlFor="size" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Size</label>
                  <Select
                    value={elementProps.size || ""}
                    onValueChange={(value) => handlePropChange("size", value)}
                  >
                    <SelectTrigger 
                      id="size" 
                      className="h-8 text-xs"
                      style={{
                        borderRadius: "8px",
                        borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                      }}
                    >
                      <SelectValue />
                      <ChevronDown className="w-4 h-4 opacity-50" style={{ color: "var(--foreground-secondary)" }} />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      sideOffset={4}
                      align="start"
                      className="!w-[var(--radix-select-trigger-width)]"
                      style={{
                        borderRadius: "8px",
                        width: 'var(--radix-select-trigger-width)',
                        minWidth: 'var(--radix-select-trigger-width)',
                        maxWidth: 'var(--radix-select-trigger-width)',
                      }}
                    >
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Label - use setCopy for text content */}
              {elementProps.label !== undefined && (
                <div>
                  <label htmlFor="label" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Label</label>
                  <Input
                    id="label"
                    value={elementProps.label || ""}
                    onChange={(e) => {
                      // Use setCopy for label (text content), not setProp
                      handleCopyChange("label", e.target.value);
                    }}
                    className="h-8 text-xs"
                    style={{
                      borderRadius: "4px",
                      borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    }}
                  />
                </div>
              )}

              {/* Placeholder */}
              {elementProps.placeholder !== undefined && (
                <div>
                  <label htmlFor="placeholder" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Placeholder</label>
                  <Input
                    id="placeholder"
                    value={elementProps.placeholder || ""}
                    onChange={(e) => handlePropChange("placeholder", e.target.value)}
                    className="h-8 text-xs"
                    style={{
                      borderRadius: "4px",
                      borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    }}
                  />
                </div>
              )}

              {/* Text Content - use setCopy for text content */}
              {elementProps.text !== undefined && (
                <div>
                  <label htmlFor="text" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Text Content</label>
                  <Input
                    id="text"
                    value={elementProps.text || ""}
                    onChange={(e) => {
                      // Use setCopy for text (text content), not setProp
                      // Try "text" first, fallback to "label" if text doesn't exist in DSL
                      handleCopyChange("text", e.target.value);
                    }}
                    className="h-8 text-xs"
                    style={{
                      borderRadius: "6px",
                      borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              )}

              {/* Boolean Props */}
              <div className="space-y-2">
                {elementProps.required !== undefined && (
                  <div className="flex items-center justify-between">
                    <label htmlFor="required" className="text-xs text-[color:var(--foreground-secondary)]">Required</label>
                    <input
                      id="required"
                      type="checkbox"
                      checked={elementProps.required || false}
                      onChange={(e) => handlePropChange("required", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                )}
                {elementProps.disabled !== undefined && (
                  <div className="flex items-center justify-between">
                    <label htmlFor="disabled" className="text-xs text-[color:var(--foreground-secondary)]">Disabled</label>
                    <input
                      id="disabled"
                      type="checkbox"
                      checked={elementProps.disabled || false}
                      onChange={(e) => handlePropChange("disabled", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                )}
                {elementProps.loading !== undefined && (
                  <div className="flex items-center justify-between">
                    <label htmlFor="loading" className="text-xs text-[color:var(--foreground-secondary)]">Loading</label>
                    <input
                      id="loading"
                      type="checkbox"
                      checked={elementProps.loading || false}
                      onChange={(e) => handlePropChange("loading", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tokens Section */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
              <div className="text-xs font-semibold text-[color:var(--foreground-primary)] uppercase tracking-wide">Tokens</div>
              <TokenPicker
                tokenType="space"
                value={currentSpaceToken}
                onChange={(value) => handleTokenChange("space", value)}
                label="Spacing (Gap)"
              />
              <TokenPicker
                tokenType="radius"
                value={currentRadiusToken}
                onChange={(value) => handleTokenChange("radius", value)}
                label="Border Radius"
              />
            </div>

            {/* Copy Section */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
              <div className="text-xs font-semibold text-[color:var(--foreground-primary)] uppercase tracking-wide">Copy</div>
              {/* Extract copy fields from DSL node */}
              {dslNode && (
                <>
                  {dslNode.label !== undefined && (
                    <div>
                      <label htmlFor="copy-label" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Label</label>
                      <Input
                        id="copy-label"
                        value={dslNode.label || ""}
                        onChange={(e) => handleCopyChange("label", e.target.value)}
                        className="h-8 text-xs"
                        style={{
                          borderRadius: "4px",
                          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}
                      />
                    </div>
                  )}
                  {dslNode.title !== undefined && (
                    <div>
                      <label htmlFor="copy-title" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Title</label>
                      <Input
                        id="copy-title"
                        value={dslNode.title || ""}
                        onChange={(e) => handleCopyChange("title", e.target.value)}
                        className="h-8 text-xs"
                        style={{
                          borderRadius: "4px",
                          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}
                      />
                    </div>
                  )}
                  {dslNode.placeholder !== undefined && (
                    <div>
                      <label htmlFor="copy-placeholder" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Placeholder</label>
                      <Input
                        id="copy-placeholder"
                        value={dslNode.placeholder || ""}
                        onChange={(e) => handleCopyChange("placeholder", e.target.value)}
                        className="h-8 text-xs"
                        style={{
                          borderRadius: "4px",
                          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}
                      />
                    </div>
                  )}
                  {dslNode.description !== undefined && (
                    <div>
                      <label htmlFor="copy-description" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Description</label>
                      <Input
                        id="copy-description"
                        value={dslNode.description || ""}
                        onChange={(e) => handleCopyChange("description", e.target.value)}
                        className="h-8 text-xs"
                        style={{
                          borderRadius: "4px",
                          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}
                      />
                    </div>
                  )}
                  {dslNode.copy !== undefined && (
                    <div>
                      <label htmlFor="copy-text" className="text-xs text-[color:var(--foreground-secondary)] block mb-1">Copy</label>
                      <Input
                        id="copy-text"
                        value={dslNode.copy || ""}
                        onChange={(e) => handleCopyChange("copy", e.target.value)}
                        className="h-8 text-xs"
                        style={{
                          borderRadius: "4px",
                          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
              {!dslNode && (
                <div className="text-xs text-[color:var(--foreground-tertiary)] text-center py-4">
                  No DSL node found. Copy editing requires DSL structure.
                </div>
              )}
            </div>
          </div>

          {/* DSL Preview */}
          {dslNode && (
            <div className="pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
              <div className="text-xs font-medium text-[color:var(--foreground-secondary)] mb-2">DSL Node</div>
              <pre className="text-xs p-2 rounded bg-[color:var(--color-surface-1)] overflow-auto max-h-48 font-mono" style={{ 
                color: "var(--foreground-primary)",
                lineHeight: "1.4",
              }}>
                {JSON.stringify(dslNode, null, 2)}
              </pre>
            </div>
          )}

          {/* Raw Props (for debugging) */}
          {process.env.NODE_ENV === "development" && (
            <div className="pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
              <div className="text-xs font-medium text-[color:var(--foreground-secondary)] mb-2">Raw Props</div>
              <pre className="text-xs p-2 rounded bg-[color:var(--color-surface-1)] overflow-auto max-h-32">
                {JSON.stringify(elementProps, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

