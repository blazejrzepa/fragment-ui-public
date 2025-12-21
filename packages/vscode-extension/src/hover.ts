import * as vscode from "vscode";
import { getComponentInfo, getComponentImportPath } from "./registry";
import { getComponentProps, getRequiredProps } from "./prop-suggestions";

export class ComponentHoverProvider implements vscode.HoverProvider {
  constructor(private registry: Record<string, any>) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, /[\w-]+/);
    if (!range) {
      return null;
    }

    const word = document.getText(range);
    const componentName = this.toKebabCase(word);

    const info = getComponentInfo(this.registry, componentName);
    if (!info) {
      return null;
    }

    const importPath = getComponentImportPath(componentName, info.type);
    const componentType = info.type === "block" ? "Block" : "Component";
    const config = vscode.workspace.getConfiguration("fragment-ui");
    const docsUrl = config.get<string>("docsUrl", "https://fragment-ui.dev");
    const storybookUrl = config.get<string>(
      "storybookUrl",
      "https://6908c46a37e9c1c1fe40b48d-wcgdsyfvpg.chromatic.com"
    );

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    markdown.appendMarkdown(`### ${word} - Fragment UI ${componentType}\n\n`);
    markdown.appendMarkdown(
      `**Import:** \`import { ${word} } from "${importPath}";\`\n\n`
    );

    // Add props information
    const props = getComponentProps(componentName);
    if (props.length > 0) {
      markdown.appendMarkdown(`**Props:**\n\n`);
      
      const requiredProps = getRequiredProps(componentName);
      if (requiredProps.length > 0) {
        markdown.appendMarkdown(`*Required:* ${requiredProps.map(p => `\`${p}\``).join(", ")}\n\n`);
      }

      // Show first 5 props
      const propsToShow = props.slice(0, 5);
      for (const prop of propsToShow) {
        const required = prop.required ? " *(required)*" : "";
        const enumInfo = prop.enumValues 
          ? ` - Values: ${prop.enumValues.map(v => `\`${v}\``).join(", ")}`
          : "";
        markdown.appendMarkdown(
          `- \`${prop.name}\`: ${prop.type}${required}${enumInfo}\n`
        );
      }

      if (props.length > 5) {
        markdown.appendMarkdown(`\n*...and ${props.length - 5} more props*\n\n`);
      } else {
        markdown.appendMarkdown(`\n`);
      }
    }

    markdown.appendMarkdown(
      `[📚 Documentation](${docsUrl}/docs/components/${componentName}) | `
    );
    markdown.appendMarkdown(`[🎨 Storybook](${storybookUrl}) | `);
    markdown.appendMarkdown(
      `[🧪 Playground](${docsUrl}/docs/tools/playground?component=${componentName})\n\n`
    );

    return new vscode.Hover(markdown, range);
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }
}

