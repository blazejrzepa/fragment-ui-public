---
title: VS Code Extension
description: Set up the Fragment UI extension in VS Code.
---

The Fragment UI VS Code Extension enhances your development workflow by providing 
intelligent autocomplete, hover documentation, code snippets, and quick actions 
for Fragment UI components. It helps you write code faster and with fewer errors 
by providing context-aware suggestions and documentation directly in your editor.

## Key Features

- Intelligent autocomplete for Fragment UI components
- Hover documentation with component details
- Pre-built code snippets for common components
- Quick actions (add component, open docs, open Storybook)
- Component search in command palette

## Installation

### From source (current)

```bash
cd packages/vscode-extension
pnpm install
pnpm build
pnpm package

# Install the .vsix file
code --install-extension fragment-ui-*.vsix
```

### From Marketplace (coming soon)

This extension is not guaranteed to be published yet. If/when it is available, the extension id will be:

```bash
code --install-extension fragment-ui.fragment-ui
```

## Features

### Autocomplete

Get intelligent autocomplete suggestions when typing Fragment UI component names:

```jsx
import { Bu| // Type "Bu" and see Button suggestion
import { Button } from "@fragment_ui/ui";
```

### Hover Documentation

Hover over any Fragment UI component to see its documentation, props, and usage examples:

```jsx
<Button variant="solid" size="sm">
  Click me
</Button>
// Hover over "Button" to see documentation
```

### Code Snippets

Use pre-built snippets for common components:

```jsx
// Type "fui-button" and press Tab
<Button variant="solid" size="md">
  Button
</Button>
```

### Quick Actions

Use Command Palette (Cmd+Shift+P / Ctrl+Shift+P) to access quick actions:

- **Fragment UI: Add Component** - Add a component to your project
- **Fragment UI: Open Documentation** - Open component docs in browser
- **Fragment UI: Open Storybook** - Open component in Storybook
- **Fragment UI: Search Components** - Search for components

## Configuration

Configure the extension in VS Code settings:

```json
{
  "fragment-ui.docsUrl": "http://localhost:3001",
  "fragment-ui.storybookUrl": "http://localhost:6006"
}
```

## Requirements

- VS Code **1.74.0+**

## Keyboard Shortcuts

- **Cmd+Shift+P** (Mac) / **Ctrl+Shift+P** (Windows/Linux) - Open Command Palette
- **Cmd+.** (Mac) / **Ctrl+.** (Windows/Linux) - Quick Actions

## Learn More

- [Extension Documentation](/docs/vscode-extension-usage)
- [Available Components](/components)
- [Storybook](https://storybook.fragment-ui.dev)


