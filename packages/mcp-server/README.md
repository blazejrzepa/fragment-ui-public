# Fragment UI MCP Server

MCP (Model Context Protocol) server for Fragment UI that enables AI-native workflow integration with Cursor and GitHub Copilot.

## Features

- **Component Information** - Get details about Fragment UI components
- **Component Suggestions** - AI-powered component recommendations
- **Code Validation** - Validate code against design system rules
- **Code Generation** - Generate component code with proper imports
- **Token Access** - Access design tokens programmatically
- **Enforcement Rules** - Enforce design system conventions

## Installation

```bash
pnpm install @fragment_ui/mcp-server
```

## Configuration

### Cursor

Add to your Cursor settings (`~/.cursor/mcp.json` or Cursor settings):

```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "node",
      "args": [
        "/path/to/fragment-ui/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

### GitHub Copilot

Configure in Copilot settings to use MCP server.

## Available Tools

### `get_component_info`

Get information about a Fragment UI component.

```typescript
{
  componentName: "button"
}
```

Returns component props, variants, examples, and documentation links.

### `suggest_component`

Suggest components based on description.

```typescript
{
  description: "form input with validation"
}
```

Returns suggested components with confidence scores.

### `validate_code`

Validate code against Fragment UI rules.

```typescript
{
  code: "const color = '#ff0000';",
  filePath: "src/components/MyComponent.tsx"
}
```

Returns validation errors, warnings, and suggestions.

### `generate_component`

Generate component code.

```typescript
{
  componentName: "button",
  props: { children: "Click me" },
  variant: "solid"
}
```

Returns generated code with proper imports.

### `get_tokens`

Get design tokens.

```typescript
{
  category: "color" // optional
}
```

Returns design tokens (colors, spacing, typography, etc.).

## Enforcement Rules

The MCP server enforces the following rules:

1. **No Raw Colors** - Use design tokens instead of hex colors
2. **No Raw Spacing** - Use spacing tokens instead of px values
3. **Use Fragment Components** - Prefer Fragment UI components
4. **TypeScript Types** - Avoid `any` types
5. **Accessibility** - Ensure ARIA attributes
6. **Prop Casing** - Use camelCase for props

## Resources

- `fragment://components` - List of all components
- `fragment://tokens` - Design tokens
- `fragment://rules` - Design system rules

## Development

```bash
# Build
pnpm build

# Run
pnpm start
```

## License

MIT

