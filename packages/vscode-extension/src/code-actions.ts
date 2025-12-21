/**
 * Code Actions for Fragment UI
 * 
 * Provides refactoring actions:
 * - Convert to Fragment UI component
 * - Extract component
 * - Add missing props
 */

import * as vscode from "vscode";
import { getComponentInfo, getComponentImportPath } from "./registry";
import { getRequiredProps, getComponentProps } from "./prop-suggestions";

export class FragmentUICodeActionProvider
  implements vscode.CodeActionProvider
{
  constructor(private registry: Record<string, any>) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const actions: vscode.CodeAction[] = [];

    // Get selected text
    const selectedText = document.getText(range);
    const line = document.lineAt(range.start.line);
    const lineText = line.text;

    // Check if we're on a button element
    if (lineText.match(/<button/i)) {
      actions.push(this.createConvertToButtonAction(document, range));
    }

    // Check if we're on an input element
    if (lineText.match(/<input/i)) {
      actions.push(this.createConvertToInputAction(document, range));
    }

    // Check if we have a Fragment UI component selected
    const componentMatch = selectedText.match(/<(\w+)/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      const kebabName = this.toKebabCase(componentName);
      const info = getComponentInfo(this.registry, kebabName);

      if (info) {
        // Add missing required props
        const requiredProps = getRequiredProps(kebabName);
        if (requiredProps.length > 0) {
          actions.push(
            this.createAddMissingPropsAction(
              document,
              range,
              componentName,
              kebabName,
              requiredProps
            )
          );
        }
      }
    }

    return actions;
  }

  private createConvertToButtonAction(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Convert to Fragment UI Button",
      vscode.CodeActionKind.RefactorRewrite
    );

    action.command = {
      command: "fragment-ui.convertToButton",
      title: "Convert to Fragment UI Button",
      arguments: [document, range],
    };

    return action;
  }

  private createConvertToInputAction(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Convert to Fragment UI Input",
      vscode.CodeActionKind.RefactorRewrite
    );

    action.command = {
      command: "fragment-ui.convertToInput",
      title: "Convert to Fragment UI Input",
      arguments: [document, range],
    };

    return action;
  }

  private createAddMissingPropsAction(
    document: vscode.TextDocument,
    range: vscode.Range,
    componentName: string,
    kebabName: string,
    requiredProps: string[]
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `Add missing required props to ${componentName}`,
      vscode.CodeActionKind.QuickFix
    );

    action.command = {
      command: "fragment-ui.addMissingProps",
      title: "Add missing required props",
      arguments: [document, range, componentName, kebabName, requiredProps],
    };

    return action;
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }
}

export function registerCodeActionCommands(
  registry: Record<string, any>
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  // Convert to Button
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.convertToButton",
      async (document: vscode.TextDocument, range: vscode.Range) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== document) {
          return;
        }

        const text = document.getText(range);
        const buttonMatch = text.match(/<button([^>]*)>([\s\S]*?)<\/button>/i);

        if (!buttonMatch) {
          vscode.window.showErrorMessage("No button element found");
          return;
        }

        const attrs = buttonMatch[1];
        const content = buttonMatch[2];

        // Extract common attributes
        const className = attrs.match(/className=["']([^"']+)["']/)?.[1] || "";
        const onClick = attrs.match(/onClick={([^}]+)}/)?.[1] || "";
        const disabled = attrs.includes("disabled") ? "disabled" : "";

        // Check if Button is already imported
        const importPath = "@fragment_ui/ui";
        const importLine = `import { Button } from "${importPath}";`;

        const snippet = `<Button${className ? ` className="${className}"` : ""}${onClick ? ` onClick={${onClick}}` : ""}${disabled ? ` ${disabled}` : ""}>${content}</Button>`;

        // Replace the button
        await editor.edit((editBuilder) => {
          editBuilder.replace(range, snippet);
        });

        // Add import if not present
        const documentText = document.getText();
        if (!documentText.includes(importLine)) {
          const firstLine = document.lineAt(0);
          await editor.edit((editBuilder) => {
            editBuilder.insert(firstLine.range.start, importLine + "\n");
          });
        }

        vscode.window.showInformationMessage("Converted to Fragment UI Button");
      }
    )
  );

  // Convert to Input
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.convertToInput",
      async (document: vscode.TextDocument, range: vscode.Range) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== document) {
          return;
        }

        const text = document.getText(range);
        const inputMatch = text.match(/<input([^>]*)\/?>/i);

        if (!inputMatch) {
          vscode.window.showErrorMessage("No input element found");
          return;
        }

        const attrs = inputMatch[1];
        const type = attrs.match(/type=["']([^"']+)["']/)?.[1] || "text";
        const placeholder = attrs.match(/placeholder=["']([^"']+)["']/)?.[1] || "";
        const className = attrs.match(/className=["']([^"']+)["']/)?.[1] || "";
        const disabled = attrs.includes("disabled") ? "disabled" : "";

        const importPath = "@fragment_ui/ui";
        const importLine = `import { Input } from "${importPath}";`;

        const snippet = `<Input${type !== "text" ? ` type="${type}"` : ""}${placeholder ? ` placeholder="${placeholder}"` : ""}${className ? ` className="${className}"` : ""}${disabled ? ` ${disabled}` : ""} />`;

        await editor.edit((editBuilder) => {
          editBuilder.replace(range, snippet);
        });

        const documentText = document.getText();
        if (!documentText.includes(importLine)) {
          const firstLine = document.lineAt(0);
          await editor.edit((editBuilder) => {
            editBuilder.insert(firstLine.range.start, importLine + "\n");
          });
        }

        vscode.window.showInformationMessage("Converted to Fragment UI Input");
      }
    )
  );

  // Add missing props
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.addMissingProps",
      async (
        document: vscode.TextDocument,
        range: vscode.Range,
        componentName: string,
        kebabName: string,
        requiredProps: string[]
      ) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== document) {
          return;
        }

        const text = document.getText(range);
        const componentMatch = text.match(new RegExp(`<${componentName}([^>]*)>`, "i"));

        if (!componentMatch) {
          return;
        }

        const existingAttrs = componentMatch[1];
        const existingProps = Array.from(
          existingAttrs.matchAll(/(\w+)=/g)
        ).map((m) => m[1]);

        const missingProps = requiredProps.filter(
          (prop) => !existingProps.includes(prop)
        );

        if (missingProps.length === 0) {
          vscode.window.showInformationMessage("No missing required props");
          return;
        }

        // Get prop definitions
        const props = getComponentProps(kebabName);
        const propsToAdd = missingProps
          .map((propName) => {
            const prop = props.find((p) => p.name === propName);
            if (!prop) return null;

            if (prop.type === "boolean") {
              return `${propName}={false}`;
            } else if (prop.enumValues && prop.enumValues.length > 0) {
              return `${propName}="${prop.enumValues[0]}"`;
            } else {
              return `${propName}=""`;
            }
          })
          .filter((p) => p !== null)
          .join(" ");

        const newAttrs = existingAttrs.trim()
          ? `${existingAttrs.trim()} ${propsToAdd}`
          : propsToAdd;

        const newText = text.replace(
          new RegExp(`<${componentName}([^>]*)>`, "i"),
          `<${componentName} ${newAttrs}>`
        );

        await editor.edit((editBuilder) => {
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Added missing props: ${missingProps.join(", ")}`
        );
      }
    )
  );

  return disposables;
}

