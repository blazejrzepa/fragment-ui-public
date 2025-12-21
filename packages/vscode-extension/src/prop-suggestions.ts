/**
 * Advanced Prop Suggestions
 * 
 * Provides type-aware prop suggestions with enum values and required props highlighting
 */

import * as vscode from "vscode";
import { getComponentInfo } from "./registry";

// Component prop definitions extracted from source code
const componentProps: Record<string, {
  props: Array<{
    name: string;
    type: string;
    required?: boolean;
    defaultValue?: string;
    description?: string;
    enumValues?: string[];
  }>;
}> = {
  button: {
    props: [
      {
        name: "variant",
        type: "string",
        required: false,
        defaultValue: "solid",
        description: "Button variant style",
        enumValues: ["solid", "outline", "ghost"],
      },
      {
        name: "size",
        type: "string",
        required: false,
        defaultValue: "md",
        description: "Button size",
        enumValues: ["sm", "md", "lg"],
      },
      {
        name: "leadingIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed before button text",
      },
      {
        name: "trailingIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed after button text",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Whether the button is disabled",
      },
    ],
  },
  input: {
    props: [
      {
        name: "type",
        type: "string",
        required: false,
        defaultValue: "text",
        description: "Input type",
        enumValues: ["text", "email", "password", "number", "tel", "url"],
      },
      {
        name: "placeholder",
        type: "string",
        required: false,
        description: "Placeholder text",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Whether the input is disabled",
      },
      {
        name: "required",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Whether the input is required",
      },
    ],
  },
  dialog: {
    props: [
      {
        name: "open",
        type: "boolean",
        required: false,
        description: "Whether the dialog is open",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: false,
        description: "Callback when open state changes",
      },
    ],
  },
  select: {
    props: [
      {
        name: "value",
        type: "string",
        required: false,
        description: "Selected value",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when value changes",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Whether the select is disabled",
      },
    ],
  },
  checkbox: {
    props: [
      {
        name: "checked",
        type: "boolean",
        required: false,
        description: "Whether the checkbox is checked",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        required: false,
        description: "Callback when checked state changes",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Whether the checkbox is disabled",
      },
    ],
  },
  tabs: {
    props: [
      {
        name: "defaultValue",
        type: "string",
        required: false,
        description: "Default selected tab value",
      },
      {
        name: "value",
        type: "string",
        required: false,
        description: "Controlled selected tab value",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when tab changes",
      },
    ],
  },
};

export function getComponentProps(componentName: string) {
  return componentProps[componentName.toLowerCase()]?.props || [];
}

export function providePropSuggestions(
  componentName: string,
  propName: string
): vscode.CompletionItem[] {
  const props = getComponentProps(componentName);
  const prop = props.find((p) => p.name === propName);

  if (!prop) {
    return [];
  }

  const items: vscode.CompletionItem[] = [];

  // If prop has enum values, suggest them
  if (prop.enumValues && prop.enumValues.length > 0) {
    for (const enumValue of prop.enumValues) {
      const item = new vscode.CompletionItem(
        enumValue,
        vscode.CompletionItemKind.EnumMember
      );
      item.detail = `${propName}: ${prop.type}`;
      item.documentation = new vscode.MarkdownString(
        prop.description || `Value for ${propName} prop`
      );
      item.insertText = `"${enumValue}"`;
      item.sortText = `0_${enumValue}`;
      items.push(item);
    }
  } else if (prop.type === "boolean") {
    // Suggest boolean values
    ["true", "false"].forEach((value) => {
      const item = new vscode.CompletionItem(
        value,
        vscode.CompletionItemKind.Value
      );
      item.detail = `${propName}: boolean`;
      item.insertText = value;
      items.push(item);
    });
  }

  return items;
}

export function getRequiredProps(componentName: string): string[] {
  const props = getComponentProps(componentName);
  return props.filter((p) => p.required).map((p) => p.name);
}

export function provideAllPropSuggestions(
  componentName: string
): vscode.CompletionItem[] {
  const props = getComponentProps(componentName);
  const items: vscode.CompletionItem[] = [];

  for (const prop of props) {
    const item = new vscode.CompletionItem(
      prop.name,
      prop.required
        ? vscode.CompletionItemKind.Property
        : vscode.CompletionItemKind.Field
    );

    item.detail = `${prop.name}: ${prop.type}${prop.required ? " (required)" : ""}`;
    item.documentation = new vscode.MarkdownString(
      prop.description || `Prop: ${prop.name}`
    );

    // Add default value if available
    if (prop.defaultValue) {
      item.documentation.appendMarkdown(`\n\n**Default:** \`${prop.defaultValue}\``);
    }

    // Add enum values if available
    if (prop.enumValues && prop.enumValues.length > 0) {
      item.documentation.appendMarkdown(
        `\n\n**Values:** ${prop.enumValues.map((v) => `\`${v}\``).join(", ")}`
      );
    }

    // Insert appropriate value based on type
    if (prop.enumValues && prop.enumValues.length > 0) {
      item.insertText = new vscode.SnippetString(
        `${prop.name}="$1"$0`
      );
    } else if (prop.type === "boolean") {
      item.insertText = new vscode.SnippetString(
        `${prop.name}={$1}$0`
      );
    } else if (prop.type === "string") {
      item.insertText = new vscode.SnippetString(
        `${prop.name}="$1"$0`
      );
    } else {
      item.insertText = new vscode.SnippetString(
        `${prop.name}={$1}$0`
      );
    }

    // Highlight required props
    if (prop.required) {
      item.sortText = `0_${prop.name}`;
      item.preselect = true;
    } else {
      item.sortText = `1_${prop.name}`;
    }

    items.push(item);
  }

  return items;
}

