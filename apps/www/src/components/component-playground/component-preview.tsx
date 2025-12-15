"use client";

import * as React from "react";
import { ComponentInfo, PropValue } from "./props-editor";
import { Card } from "@fragment_ui/ui";

export interface ComponentPreviewProps {
  component: ComponentInfo;
  props: Record<string, PropValue>;
  propDefinitions: Array<{ name: string; type: string }>;
}

export function ComponentPreview({
  component,
  props,
  propDefinitions,
}: ComponentPreviewProps) {
  // All hooks must be declared unconditionally at the top
  const [PreviewComponent, setPreviewComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [WrapperComponents, setWrapperComponents] = React.useState<any>(null);

  // Load the main component
  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        setError(null);
        setWrapperComponents(null);
        
        // Dynamically import the component
        if (component?.package === "@fragment_ui/ui") {
          const module = await import("@fragment_ui/ui");
          // Handle different naming conventions
          // e.g., "button" -> "Button", "breadcrumbs" -> "Breadcrumbs", "carousel" -> "Carousel"
          const componentName = component.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
          
          // Try exact match first
          let Component = (module as any)[componentName];
          
          // If not found, try lowercase first letter
          if (!Component) {
            const altName = componentName.charAt(0).toLowerCase() + componentName.slice(1);
            Component = (module as any)[altName];
          }
          
          // If still not found, try all lowercase
          if (!Component) {
            Component = (module as any)[component.name];
          }
          
          if (Component) {
            setPreviewComponent(() => Component);
          } else {
            setError(`Component ${componentName} not found in @fragment_ui/ui. Available: ${Object.keys(module).slice(0, 5).join(", ")}...`);
          }
        } else if (component?.package === "@fragment_ui/blocks") {
          const module = await import("@fragment_ui/blocks");
          // Handle blocks: "authentication-block" -> "AuthenticationBlock"
          const componentName = component.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
          
          let Component = (module as any)[componentName];
          
          // Try with Block suffix
          if (!Component && !componentName.endsWith("Block")) {
            Component = (module as any)[`${componentName}Block`];
          }
          
          if (Component) {
            setPreviewComponent(() => Component);
          } else {
            setError(`Component ${componentName} not found in @fragment_ui/blocks. Available: ${Object.keys(module).slice(0, 5).join(", ")}...`);
          }
        }
      } catch (err) {
        setError(`Failed to load component: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    if (component) {
      loadComponent();
    }
  }, [component]);

  // Load wrapper components if needed (always runs, but conditionally loads)
  React.useEffect(() => {
    if (!component) {
      setWrapperComponents(null);
      return;
    }

    // Load wrapper components if needed
    if (component.name === "radio" || component.name === "radiogroupitem" || component.name === "radio-group-item") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({ RadioGroup: module.RadioGroup });
      });
    } else if (component.name === "dropdownmenuitem" || component.name === "dropdown-menu-item") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          DropdownMenu: module.DropdownMenu,
          DropdownMenuTrigger: module.DropdownMenuTrigger,
          DropdownMenuContent: module.DropdownMenuContent,
          Button: module.Button,
        });
      });
    } else if (component.name === "tabs" || component.name === "tabstrigger" || component.name === "tabs-trigger" || component.name === "tabscontent" || component.name === "tabs-content") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          Tabs: module.Tabs,
          TabsList: module.TabsList,
          TabsTrigger: module.TabsTrigger,
          TabsContent: module.TabsContent,
        });
      });
    } else if (component.name === "accordion" || component.name === "accordionitem" || component.name === "accordion-item" || component.name === "accordiontrigger" || component.name === "accordion-trigger" || component.name === "accordioncontent" || component.name === "accordion-content") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          Accordion: module.Accordion,
          AccordionItem: module.AccordionItem,
          AccordionTrigger: module.AccordionTrigger,
          AccordionContent: module.AccordionContent,
        });
      });
    } else if (component.name === "select" || component.name === "selecttrigger" || component.name === "select-trigger" || component.name === "selectcontent" || component.name === "select-content" || component.name === "selectitem" || component.name === "select-item") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          Select: module.Select,
          SelectTrigger: module.SelectTrigger,
          SelectValue: module.SelectValue,
          SelectContent: module.SelectContent,
          SelectItem: module.SelectItem,
        });
      });
    } else if (component.name === "contextmenuitem" || component.name === "context-menu-item") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          ContextMenu: module.ContextMenu,
          ContextMenuTrigger: module.ContextMenuTrigger,
          ContextMenuContent: module.ContextMenuContent,
        });
      });
    } else if (component.name === "togglegroupitem" || component.name === "toggle-group-item") {
      import("@fragment_ui/ui").then((module) => {
        setWrapperComponents({
          ToggleGroup: module.ToggleGroup,
        });
      });
    } else {
      setWrapperComponents(null);
    }
  }, [component?.name]);

  if (!component) {
    return (
      <div className="p-8 text-center text-[color:var(--color-fg-muted)] border border-[color:var(--color-border-base)] rounded-lg">
        Select a component to preview
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-[color:var(--color-accent-red)]/10 border border-[color:var(--color-accent-red)]/20">
        <p className="text-sm text-[color:var(--color-accent-red)]">{error}</p>
      </div>
    );
  }

  if (!PreviewComponent) {
    return (
      <div className="p-8 text-center text-[color:var(--color-fg-muted)] border border-[color:var(--color-border-base)] rounded-lg">
        Loading component...
      </div>
    );
  }

  // Prepare props for rendering
  const componentProps: Record<string, any> = {};
  let children: React.ReactNode = null;

  // Props that should be parsed as JSON (arrays or objects)
  const jsonProps = ["items", "tiers", "options", "data", "columns", "rows", "presets"];

  Object.entries(props).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key === "children") {
        children = value as string;
      } else if (jsonProps.includes(key) && typeof value === "string") {
        // Try to parse JSON for props that should be arrays/objects
        try {
          componentProps[key] = JSON.parse(value);
        } catch {
          // If parsing fails, try to provide a default value based on component
          if (key === "tiers" && component?.name === "pricing-table") {
            // Default pricing tiers for PricingTable
            componentProps[key] = [
              {
                name: "Basic",
                price: "$9",
                pricePeriod: "month",
                features: [{ name: "Feature 1" }, { name: "Feature 2" }],
                ctaText: "Get Started",
              },
            ];
          } else {
            componentProps[key] = value;
          }
        }
      } else {
        componentProps[key] = value;
      }
    }
  });

  // Provide default props for components that require specific props
  if (component?.name === "pricing-table" && !componentProps.tiers) {
    componentProps.tiers = [
      {
        name: "Basic",
        price: "$9",
        pricePeriod: "month",
        features: [{ name: "Feature 1" }, { name: "Feature 2" }],
        ctaText: "Get Started",
      },
    ];
  }

  // Render component with appropriate wrapper if needed
  const renderComponent = () => {
    if (!PreviewComponent) return null;

    const componentName = component?.name || "";

    // Radio requires RadioGroup wrapper
    if ((componentName === "radio" || componentName === "radiogroupitem" || componentName === "radio-group-item") && WrapperComponents?.RadioGroup) {
      const { RadioGroup } = WrapperComponents;
      return (
        <RadioGroup defaultValue={componentProps.value || "option1"}>
          <PreviewComponent {...componentProps} />
        </RadioGroup>
      );
    }

    // DropdownMenuItem requires DropdownMenu wrapper
    if ((componentName === "dropdownmenuitem" || componentName === "dropdown-menu-item") && WrapperComponents?.DropdownMenu) {
      const { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, Button } = WrapperComponents;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <PreviewComponent {...componentProps} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Tabs components require Tabs wrapper
    if ((componentName === "tabs" || componentName === "tabstrigger" || componentName === "tabs-trigger" || componentName === "tabscontent" || componentName === "tabs-content") && WrapperComponents?.Tabs) {
      const { Tabs, TabsList, TabsTrigger, TabsContent } = WrapperComponents;
      if (componentName === "tabs") {
        return (
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      }
      return (
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <PreviewComponent {...componentProps} />
          </TabsContent>
        </Tabs>
      );
    }

    // Accordion components require Accordion wrapper
    if ((componentName === "accordion" || componentName === "accordionitem" || componentName === "accordion-item" || componentName === "accordiontrigger" || componentName === "accordion-trigger" || componentName === "accordioncontent" || componentName === "accordion-content") && WrapperComponents?.Accordion) {
      const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = WrapperComponents;
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>
              <PreviewComponent {...componentProps} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    // Select components require Select wrapper
    if ((componentName === "select" || componentName === "selecttrigger" || componentName === "select-trigger" || componentName === "selectcontent" || componentName === "select-content" || componentName === "selectitem" || componentName === "select-item") && WrapperComponents?.Select) {
      const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = WrapperComponents;
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    // ContextMenuItem requires ContextMenu wrapper
    if ((componentName === "contextmenuitem" || componentName === "context-menu-item") && WrapperComponents?.ContextMenu) {
      const { ContextMenu, ContextMenuTrigger, ContextMenuContent } = WrapperComponents;
      return (
        <ContextMenu>
          <ContextMenuTrigger className="border p-4 rounded">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <PreviewComponent {...componentProps} />
          </ContextMenuContent>
        </ContextMenu>
      );
    }

    // ToggleGroupItem requires ToggleGroup wrapper
    if ((componentName === "togglegroupitem" || componentName === "toggle-group-item") && WrapperComponents?.ToggleGroup) {
      const { ToggleGroup } = WrapperComponents;
      return (
        <ToggleGroup type="single">
          <PreviewComponent {...componentProps} />
        </ToggleGroup>
      );
    }

    // Default rendering
    if (children !== null) {
      return <PreviewComponent {...componentProps}>{children}</PreviewComponent>;
    }
    return <PreviewComponent {...componentProps} />;
  };

  return (
    <div className="p-6 border border-[color:var(--color-border-base)] rounded-lg bg-[color:var(--color-surface-1)]">
      <div className="mb-2 text-xs text-[color:var(--color-fg-muted)]">
        Preview
      </div>
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-full">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

