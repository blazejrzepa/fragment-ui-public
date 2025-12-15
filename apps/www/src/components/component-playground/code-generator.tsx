"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import { ComponentInfo, PropValue } from "./props-editor";

export function generateComponentCode(
  component: ComponentInfo,
  props: Record<string, PropValue>,
  propDefinitions: Array<{ name: string; type: string }>
): string {
  const importName = component.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // Separate children from other props
  const children = props.children;
  const otherProps = { ...props };
  delete otherProps.children;

  const propsString = Object.entries(otherProps)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => {
      if (typeof value === "string") {
        // Escape quotes in strings
        const escapedValue = value.replace(/"/g, '\\"');
        return `${key}="${escapedValue}"`;
      }
      if (typeof value === "boolean") {
        return value ? key : `${key}={false}`;
      }
      if (typeof value === "number") {
        return `${key}={${value}}`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(" ");

  const hasProps = propsString.length > 0;
  const hasChildren = children !== null && children !== undefined && children !== "";

  if (hasChildren) {
    return `import { ${importName} } from "${component.package}";

<${importName}${hasProps ? ` ${propsString}` : ""}>
  ${children}
</${importName}>
`;
  }

  return `import { ${importName} } from "${component.package}";

<${importName}${hasProps ? ` ${propsString}` : ""} />
`;
}

export interface CodeGeneratorProps {
  component: ComponentInfo;
  props: Record<string, PropValue>;
  propDefinitions: Array<{ name: string; type: string }>;
}

export function CodeGenerator({
  component,
  props,
  propDefinitions,
}: CodeGeneratorProps) {
  const code = React.useMemo(
    () => generateComponentCode(component, props, propDefinitions),
    [component, props, propDefinitions]
  );

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Generated Code</h3>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

