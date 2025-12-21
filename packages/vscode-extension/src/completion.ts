import * as vscode from "vscode";
import { getComponentInfo, getComponentImportPath } from "./registry";
import {
  providePropSuggestions,
  provideAllPropSuggestions,
  getRequiredProps,
} from "./prop-suggestions";

export class ComponentCompletionProvider
  implements vscode.CompletionItemProvider
{
  constructor(private registry: Record<string, any>) {}

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const linePrefix = document
      .lineAt(position)
      .text.substr(0, position.character);

    const items: vscode.CompletionItem[] = [];

    // Check if we're in an import statement
    if (linePrefix.includes("from") && linePrefix.includes("@fragment")) {
      return this.provideImportCompletions();
    }

    // Check if we're typing a component tag
    if (linePrefix.match(/<[A-Z]?[a-z]*$/)) {
      return this.provideComponentCompletions();
    }

    // Check if we're typing a prop value (variant="|", size="|")
    const propValueMatch = linePrefix.match(/(\w+)=["']([^"']*)$/);
    if (propValueMatch) {
      const componentMatch = linePrefix.match(/<(\w+)/);
      if (componentMatch) {
        const componentName = componentMatch[1];
        const propName = propValueMatch[1];
        const kebabName = this.toKebabCase(componentName);
        return providePropSuggestions(kebabName, propName);
      }
    }

    // Check if we're typing props inside a component tag (<Button |)
    const componentPropsMatch = linePrefix.match(/<(\w+)([^>]*)\s+([\w-]*)$/);
    if (componentPropsMatch) {
      const componentName = componentPropsMatch[1];
      const kebabName = this.toKebabCase(componentName);
      const info = getComponentInfo(this.registry, kebabName);
      if (info) {
        return provideAllPropSuggestions(kebabName);
      }
    }

    return items;
  }

  private provideImportCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const [name, data] of Object.entries(this.registry)) {
      const info = getComponentInfo(this.registry, name);
      if (!info) continue;

      const importPath = getComponentImportPath(name, info.type);
      const componentName = this.toPascalCase(name);

      const item = new vscode.CompletionItem(
        componentName,
        vscode.CompletionItemKind.Class
      );
      item.detail = `Fragment UI ${info.type === "block" ? "Block" : "Component"}`;
      item.documentation = new vscode.MarkdownString(
        `Import ${componentName} from Fragment UI\n\n\`\`\`typescript\nimport { ${componentName} } from "${importPath}";\n\`\`\``
      );
      item.insertText = new vscode.SnippetString(
        `${componentName} from "${importPath}"`
      );
      item.sortText = `0_${componentName}`;

      items.push(item);
    }

    return items;
  }

  private provideComponentCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const [name] of Object.entries(this.registry)) {
      const info = getComponentInfo(this.registry, name);
      if (!info) continue;

      const componentName = this.toPascalCase(name);

      const item = new vscode.CompletionItem(
        componentName,
        vscode.CompletionItemKind.Class
      );
      item.detail = `Fragment UI ${info.type === "block" ? "Block" : "Component"}`;
      item.documentation = new vscode.MarkdownString(
        `Fragment UI ${componentName} component\n\n[Open Documentation](https://fragment-ui.dev/docs/components/${name})`
      );
      item.insertText = new vscode.SnippetString(
        `${componentName}$0></${componentName}>`
      );
      item.sortText = `0_${componentName}`;

      items.push(item);
    }

    return items;
  }

  private toPascalCase(str: string): string {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }
}

