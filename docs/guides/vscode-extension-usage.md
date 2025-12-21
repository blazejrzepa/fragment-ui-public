# VS Code Extension - Usage Guide

Complete guide for using the Fragment UI VS Code Extension.

## Installation

### From VSIX File

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select `fragment-ui-0.1.0.vsix`

### From Marketplace (Coming Soon)

```bash
code --install-extension fragment-ui.fragment-ui
```

## Features

### Component Autocomplete

Start typing a component name in JSX:

```tsx
<Button // Autocomplete suggests Fragment UI Button
```

The extension provides:
- Component name suggestions
- Import statement suggestions
- Component documentation

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

**Example:**
```
Button - Fragment UI Component

Import: import { Button } from "@fragment_ui/ui/button"

📚 Documentation | 🎨 Storybook
```

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

**Example:**
Type `fui-button` and press Tab:

```tsx
import { Button } from "@fragment_ui/ui/button";

<Button variant="solid" size="md">
  $0
</Button>
```

## Configuration

Add to your VS Code settings (`.vscode/settings.json` or User Settings):

```json
{
  "fragment-ui.storybookUrl": "https://your-storybook-url.com",
  "fragment-ui.docsUrl": "https://fragment-ui.dev"
}
```

## Usage Examples

### Adding a Component

1. Open Command Palette (Cmd+Shift+P)
2. Type "Fragment UI: Add Component"
3. Enter component name (e.g., "button")
4. Component code is inserted at cursor

### Opening Documentation

1. Open Command Palette
2. Type "Fragment UI: Open Documentation"
3. Enter component name
4. Documentation opens in browser

### Searching Components

1. Open Command Palette
2. Type "Fragment UI: Search Components"
3. Search and select component
4. Component code is inserted

## Troubleshooting

### Autocomplete not working

1. Ensure file is TypeScript/JavaScript/TSX/JSX
2. Check extension is enabled
3. Reload VS Code window

### Hover not showing

1. Ensure component name matches Fragment UI component
2. Check extension is active
3. Try hovering over component in JSX

### Snippets not appearing

1. Ensure file type is correct (TSX/JSX)
2. Type snippet prefix exactly (e.g., `fui-button`)
3. Press Tab to expand

---

*Last updated: 2025-01-05*

