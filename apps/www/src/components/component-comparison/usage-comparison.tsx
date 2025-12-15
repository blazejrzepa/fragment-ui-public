"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import type { ComponentInfo } from "../component-playground/props-editor";

interface UsageComparisonProps {
  component1: ComponentInfo;
  component2: ComponentInfo;
}

// Predefined usage examples for common components
const usageExamples: Record<string, { code1: string; code2: string }> = {
  "button-toggle": {
    code1: `import { Button } from "@fragment_ui/ui";

<Button variant="solid" onClick={handleClick}>
  Submit
</Button>`,
    code2: `import { Toggle } from "@fragment_ui/ui";

<Toggle
  pressed={isPressed}
  onPressedChange={setIsPressed}
>
  Enable notifications
</Toggle>`,
  },
  "dialog-sheet": {
    code1: `import { Dialog } from "@fragment_ui/ui";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogDescription>
      Are you sure you want to proceed?
    </DialogDescription>
  </DialogContent>
</Dialog>`,
    code2: `import { Sheet } from "@fragment_ui/ui";

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>
    <SheetTitle>Settings</SheetTitle>
    {/* Settings content */}
  </SheetContent>
</Sheet>`,
  },
  "select-combobox": {
    code1: `import { Select } from "@fragment_ui/ui";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
    code2: `import { Combobox } from "@fragment_ui/ui";

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Search or select..."
/>`,
  },
};

export function UsageComparison({
  component1,
  component2,
}: UsageComparisonProps) {
  const key1 = component1.name.toLowerCase();
  const key2 = component2.name.toLowerCase();
  const key = `${key1}-${key2}`;
  const reverseKey = `${key2}-${key1}`;
  
  const examples = usageExamples[key] || usageExamples[reverseKey];
  const isReversed = !!usageExamples[reverseKey];

  const code1 = examples ? (isReversed ? examples.code2 : examples.code1) : generateBasicExample(component1);
  const code2 = examples ? (isReversed ? examples.code1 : examples.code2) : generateBasicExample(component2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{component1.name}</CardTitle>
          <CardDescription>Usage example</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm">
            <code>{code1}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{component2.name}</CardTitle>
          <CardDescription>Usage example</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm">
            <code>{code2}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function generateBasicExample(component: ComponentInfo): string {
  const componentName = component.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const importPath =
    component.package === "@fragment_ui/blocks"
      ? `@fragment_ui/blocks/${component.name}`
      : `@fragment_ui/ui/${component.name}`;

  return `import { ${componentName} } from "${importPath}";

<${componentName}>
  {/* ${component.name} content */}
</${componentName}>`;
}

