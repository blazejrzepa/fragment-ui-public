import * as vscode from "vscode";
import { ComponentCompletionProvider } from "./completion";
import { ComponentHoverProvider } from "./hover";
import { registerCommands } from "./commands";
import { loadRegistry } from "./registry";
import { FragmentUICodeActionProvider, registerCodeActionCommands } from "./code-actions";

let registry: Record<string, any> = {};

export function activate(context: vscode.ExtensionContext) {
  console.log("Fragment UI extension is now active!");

  // Load component registry
  registry = loadRegistry();

  // Register completion provider
  const completionProvider = new ComponentCompletionProvider(registry);
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    [
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
    ],
    completionProvider,
    "<", // Trigger on <
    " " // Trigger on space
  );

  // Register hover provider
  const hoverProvider = new ComponentHoverProvider(registry);
  const hoverDisposable = vscode.languages.registerHoverProvider(
    [
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
    ],
    hoverProvider
  );

  // Register commands
  const commandDisposables = registerCommands(registry);

  // Register code actions
  const codeActionProvider = new FragmentUICodeActionProvider(registry);
  const codeActionDisposable = vscode.languages.registerCodeActionsProvider(
    [
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
    ],
    codeActionProvider,
    {
      providedCodeActionKinds: [
        vscode.CodeActionKind.QuickFix,
        vscode.CodeActionKind.RefactorRewrite,
      ],
    }
  );

  // Register code action commands
  const codeActionCommandDisposables = registerCodeActionCommands(registry);

  context.subscriptions.push(
    completionDisposable,
    hoverDisposable,
    codeActionDisposable,
    ...commandDisposables,
    ...codeActionCommandDisposables
  );
}

export function deactivate() {}

