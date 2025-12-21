import * as vscode from "vscode";
import { getComponentNames, getComponentInfo } from "./registry";

export function registerCommands(
  registry: Record<string, any>
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  // Command: Add Component
  disposables.push(
    vscode.commands.registerCommand("fragment-ui.addComponent", async () => {
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter component name",
        placeHolder: "e.g., button, input, dialog",
      });

      if (!componentName) {
        return;
      }

      const info = getComponentInfo(registry, componentName);
      if (!info) {
        vscode.window.showErrorMessage(
          `Component "${componentName}" not found in Fragment UI registry`
        );
        return;
      }

      const importPath =
        info.type === "block" ? `@fragment_ui/blocks` : `@fragment_ui/ui`;

      const componentPascal = componentName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");

      const snippet = `import { ${componentPascal} } from "${importPath}";\n\n<${componentPascal}>\n  $0\n</${componentPascal}>`;

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.insertSnippet(new vscode.SnippetString(snippet));
      }
    })
  );

  // Command: Open Documentation
  disposables.push(
    vscode.commands.registerCommand("fragment-ui.openDocs", async () => {
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter component name",
        placeHolder: "e.g., button, input, dialog",
      });

      if (!componentName) {
        return;
      }

      const config = vscode.workspace.getConfiguration("fragment-ui");
      const docsUrl = config.get<string>("docsUrl", "https://fragment-ui.dev");
      const url = `${docsUrl}/docs/components/${componentName}`;
      vscode.env.openExternal(vscode.Uri.parse(url));
    })
  );

  // Command: Open Storybook
  disposables.push(
    vscode.commands.registerCommand("fragment-ui.openStorybook", async () => {
      const config = vscode.workspace.getConfiguration("fragment-ui");
      const storybookUrl = config.get<string>(
        "storybookUrl",
        "https://6908c46a37e9c1c1fe40b48d-wcgdsyfvpg.chromatic.com"
      );

      vscode.env.openExternal(vscode.Uri.parse(storybookUrl));
    })
  );

  // Command: Search Components
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.searchComponents",
      async () => {
        const components = getComponentNames(registry);
        const componentNames = components.map((name) => {
          const info = getComponentInfo(registry, name);
          const label = name
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return {
            label: label,
            description: info?.type === "block" ? "Block" : "Component",
            detail: `Import from: ${
              info?.type === "block"
                ? `@fragment_ui/blocks`
                : `@fragment_ui/ui`
            }`,
            name: name,
          };
        });

        const selected = await vscode.window.showQuickPick(componentNames, {
          placeHolder: "Search Fragment UI components...",
        });

        if (selected) {
          const info = getComponentInfo(registry, selected.name);
          if (info) {
            const importPath =
              info.type === "block" ? `@fragment_ui/blocks` : `@fragment_ui/ui`;

            const componentPascal = selected.name
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("");

            const snippet = `import { ${componentPascal} } from "${importPath}";\n\n<${componentPascal}>\n  $0\n</${componentPascal}>`;

            const editor = vscode.window.activeTextEditor;
            if (editor) {
              editor.insertSnippet(new vscode.SnippetString(snippet));
            }
          }
        }
      }
    )
  );

  // Command: Open Component in Playground
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.openInPlayground",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor");
          return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        // Try to extract component name from selection
        const componentMatch = selectedText.match(/<(\w+)/);
        if (!componentMatch) {
          vscode.window.showErrorMessage(
            "Please select a Fragment UI component"
          );
          return;
        }

        const componentName = componentMatch[1];
        const kebabName = componentName
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase();

        const config = vscode.workspace.getConfiguration("fragment-ui");
        const docsUrl = config.get<string>(
          "docsUrl",
          "https://fragment-ui.dev"
        );

        const playgroundUrl = `${docsUrl}/docs/tools/playground?component=${kebabName}`;
        vscode.env.openExternal(vscode.Uri.parse(playgroundUrl));

        // Copy code to clipboard
        await vscode.env.clipboard.writeText(selectedText);
        vscode.window.showInformationMessage(
          `Opened ${componentName} in playground. Code copied to clipboard.`
        );
      }
    )
  );

  // Command: Copy Component Code
  disposables.push(
    vscode.commands.registerCommand(
      "fragment-ui.copyComponentCode",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor");
          return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
          vscode.window.showErrorMessage("Please select code to copy");
          return;
        }

        await vscode.env.clipboard.writeText(selectedText);
        vscode.window.showInformationMessage("Code copied to clipboard");
      }
    )
  );

  return disposables;
}

