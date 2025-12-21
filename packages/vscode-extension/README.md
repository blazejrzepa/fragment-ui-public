# Fragment UI - VS Code Extension

VS Code extension providing IntelliSense, snippets, and tools for Fragment UI components.

## Features

- 🎯 **Component Autocomplete** - IntelliSense for all Fragment UI components
- 📝 **Import Snippets** - Quick import statements for components
- 📚 **Documentation Hover** - View component documentation on hover
- ⚡ **Quick Actions** - Add components, open docs, open Storybook
- 🔍 **Component Search** - Search and insert components from command palette

## Installation

### From Source

```bash
# Build the extension
cd packages/vscode-extension
pnpm install
pnpm build

# Package for installation
pnpm package
```

Then install the `.vsix` file in VS Code:
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select the generated `.vsix` file

### From Marketplace (Coming Soon)

```bash
code --install-extension fragment-ui.fragment-ui
```

## Usage

### Component Autocomplete

Start typing a component name in JSX:

```tsx
<Button // Autocomplete suggests Fragment UI Button
```

### Import Autocomplete

When typing imports:

```tsx
import { Button } from "@fragment_ui/ui/button" // Autocomplete suggests components
```

### Hover Documentation

Hover over any Fragment UI component to see:
- Component description
- Import statement
- Links to documentation and Storybook

### Quick Actions

Use Command Palette (Cmd+Shift+P / Ctrl+Shift+P):

- **Fragment UI: Add Component** - Insert a component with import
- **Fragment UI: Open Documentation** - Open component docs
- **Fragment UI: Open Storybook** - Open Storybook
- **Fragment UI: Search Components** - Search and insert components

### Snippets

Type snippet prefixes:

- `fui-button` - Button component
- `fui-input` - Input component
- `fui-dialog` - Dialog component
- `fui-card` - Card component
- `fui-select` - Select component
- `fui-tabs` - Tabs component

## Configuration

Add to your VS Code settings:

```json
{
  "fragment-ui.storybookUrl": "https://your-storybook-url.com",
  "fragment-ui.docsUrl": "https://fragment-ui.dev"
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm watch

# Package
pnpm package

# Publish (requires vsce and marketplace access)
pnpm publish
```

## Requirements

- VS Code 1.74.0 or higher
- TypeScript/JavaScript projects

## License

[Add your license here]

