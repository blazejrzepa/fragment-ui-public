"use client";

import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fragment_ui/ui";
import registry from "@fragment_ui/registry/registry.json";

// ComponentInfo is defined in props-editor.tsx
import type { ComponentInfo } from "./props-editor";

export function ComponentSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange: (component: ComponentInfo | null) => void;
}) {
  const components = React.useMemo<ComponentInfo[]>(() => {
    // Components with hyphens that are UI components (not blocks)
    const uiComponentExceptions = [
      "multi-select",
      "command-palette",
      "date-picker",
      "toggle-group",
      "tree-view",
      "dropdown-menu",
      "context-menu",
      "hover-card",
      "navigation-menu",
      "scroll-area",
      "aspect-ratio",
      "data-table",
      "virtual-list",
      "virtual-table",
      "form-array",
      "form-conditional",
      "form-enhanced",
      "form-field",
    ];

    const uiComponents = Object.keys(registry)
      .filter((k) => !k.includes("-") || uiComponentExceptions.includes(k))
      .map((name) => ({
        name,
        package: "@fragment_ui/ui" as const,
        displayName: name,
      }));

    const blocks = Object.keys(registry)
      .filter((k) => k.includes("-") && !uiComponentExceptions.includes(k))
      .map((name) => ({
        name,
        package: "@fragment_ui/blocks" as const,
        displayName: name,
      }));

    return [...uiComponents, ...blocks].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  const handleChange = (selectedName: string) => {
    const component = components.find((c) => c.name === selectedName);
    onChange(component || null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Component</label>
      <Select value={value || ""} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a component..." />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs font-semibold text-[color:var(--color-fg-muted)]">
            UI Components
          </div>
          {components
            .filter((c) => c.package === "@fragment_ui/ui")
            .map((component) => (
              <SelectItem key={component.name} value={component.name}>
                {component.name}
              </SelectItem>
            ))}
          <div className="px-2 py-1.5 text-xs font-semibold text-[color:var(--color-fg-muted)] mt-2 border-t border-[color:var(--color-border-base)]">
            Blocks
          </div>
          {components
            .filter((c) => c.package === "@fragment_ui/blocks")
            .map((component) => (
              <SelectItem key={component.name} value={component.name}>
                {component.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

