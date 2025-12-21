"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Package, Code, Copy, Check, FileText, ExternalLink } from "lucide-react";
import { Button, Input } from "@fragment_ui/ui";

interface ComponentInfo {
  import: string;
  props?: Record<string, any>;
  note?: string;
}

interface Registry {
  components: Record<string, ComponentInfo>;
  aliases?: Record<string, string>;
  rules?: {
    forbiddenHtml?: string[];
    prefer?: Record<string, string>;
  };
}

interface ComponentLibraryBrowserProps {
  registry: Registry;
  onInsertCode?: (code: string) => void;
  initialSelectedComponent?: string | null;
}

/**
 * Component Library Browser - displays available components from registry
 */
export const ComponentLibraryBrowser = React.memo(function ComponentLibraryBrowser({
  registry,
  onInsertCode,
  initialSelectedComponent = null,
}: ComponentLibraryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(initialSelectedComponent);
  
  // Update selected component when initialSelectedComponent changes
  useEffect(() => {
    if (initialSelectedComponent !== null) {
      setSelectedComponent(initialSelectedComponent);
    }
  }, [initialSelectedComponent]);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);

  // Filter components based on search query
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) {
      return Object.keys(registry.components);
    }
    
    const query = searchQuery.toLowerCase();
    return Object.keys(registry.components).filter(name => {
      const component = registry.components[name];
      return (
        name.toLowerCase().includes(query) ||
        component.import?.toLowerCase().includes(query) ||
        component.note?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, registry.components]);

  // Get component info
  const getComponentInfo = (name: string): ComponentInfo => {
    return registry.components[name] || {};
  };

  // Generate code snippet for component
  const generateCodeSnippet = (name: string): string => {
    const component = getComponentInfo(name);
    const importPath = component.import || `@fragment_ui/ui/${name.toLowerCase()}`;
    
    // Basic import statement
    let code = `import { ${name} } from "${importPath}";\n\n`;
    
    // Basic usage example
    if (component.props) {
      const props = Object.keys(component.props).slice(0, 3); // Show first 3 props
      const propsString = props.map(prop => {
        const propType = component.props![prop];
        if (Array.isArray(propType)) {
          return `${prop}="${propType[0]}"`;
        }
        return `${prop}={/* ${propType} */}`;
      }).join(" ");
      
      code += `<${name}${propsString ? ` ${propsString}` : ""} />`;
    } else {
      code += `<${name} />`;
    }
    
    return code;
  };

  // Copy code to clipboard
  const handleCopyCode = async (componentName: string) => {
    const code = generateCodeSnippet(componentName);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedComponent(componentName);
      setTimeout(() => setCopiedComponent(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Insert code into editor
  const handleInsertCode = (componentName: string) => {
    const code = generateCodeSnippet(componentName);
    onInsertCode?.(code);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--foreground-tertiary)" }} />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: "var(--background-primary)",
              color: "var(--foreground-primary)",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Components List */}
        <div className="w-1/3 border-r overflow-y-auto" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
          <div className="p-2 space-y-1">
            {filteredComponents.length === 0 ? (
              <div className="p-4 text-center text-sm" style={{ color: "var(--foreground-tertiary)" }}>
                No components found
              </div>
            ) : (
              filteredComponents.map((name) => {
                const component = getComponentInfo(name);
                const isSelected = selectedComponent === name;
                
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedComponent(name)}
                    className="w-full text-left px-3 py-2 rounded transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)"
                        : "transparent",
                      color: isSelected ? "var(--foreground-primary)" : "var(--foreground-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 3%, transparent)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    {component.note && (
                      <div className="text-xs mt-1" style={{ color: "var(--foreground-tertiary)" }}>
                        {component.note}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Component Details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedComponent ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Component Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-6 h-6" style={{ color: "var(--foreground-primary)" }} />
                      <h2 className="text-xl font-semibold" style={{ color: "var(--foreground-primary)" }}>
                        {selectedComponent}
                      </h2>
                    </div>
                    {getComponentInfo(selectedComponent).note && (
                      <p className="text-sm mt-2" style={{ color: "var(--foreground-secondary)" }}>
                        {getComponentInfo(selectedComponent).note}
                      </p>
                    )}
                  </div>

                  {/* Import */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "var(--foreground-primary)" }}>
                      <Code className="w-4 h-4" />
                      Import
                    </h3>
                    <div className="p-3 rounded" style={{ 
                      backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}>
                      <code style={{ color: "var(--foreground-primary)" }}>
                        import {`{ ${selectedComponent} }`} from "{getComponentInfo(selectedComponent).import || `@fragment_ui/ui/${selectedComponent.toLowerCase()}`}";
                      </code>
                    </div>
                  </div>

                  {/* Props */}
                  {getComponentInfo(selectedComponent).props && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "var(--foreground-primary)" }}>
                        <FileText className="w-4 h-4" />
                        Props
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(getComponentInfo(selectedComponent).props || {}).map(([prop, type]) => (
                          <div key={prop} className="p-3 rounded" style={{ 
                            backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
                          }}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <code className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>
                                  {prop}
                                </code>
                                <div className="text-xs mt-1" style={{ color: "var(--foreground-tertiary)" }}>
                                  {Array.isArray(type) ? type.join(" | ") : type}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Example */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "var(--foreground-primary)" }}>
                      <Code className="w-4 h-4" />
                      Example
                    </h3>
                    <div className="p-3 rounded relative" style={{ 
                      backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}>
                      <code style={{ color: "var(--foreground-primary)" }}>
                        {generateCodeSnippet(selectedComponent)}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t p-4 flex items-center gap-2" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(selectedComponent)}
                  className="flex items-center gap-2"
                >
                  {copiedComponent === selectedComponent ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>
                {onInsertCode && (
                  <Button
                    variant="solid"
                    size="sm"
                    onClick={() => handleInsertCode(selectedComponent)}
                    className="flex items-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    Insert into Code
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--foreground-tertiary)" }} />
                <p className="text-sm" style={{ color: "var(--foreground-tertiary)" }}>
                  Select a component to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});


