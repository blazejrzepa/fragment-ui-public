---
title: MCP Server
---

## What is MCP?

The Model Context Protocol (MCP) is a standard protocol that allows AI assistants to interact
with external tools and services. Fragment UI’s MCP server runs over **stdio** (it does not open an HTTP port).

It provides:

- Component + registry information
- Design token access
- Code validation (basic DS checks)
- Code generation helpers (component + scaffolds)
- UI-DSL edit helpers (advanced)
- Read-only resources like `fragment://components`, `fragment://tokens`, `fragment://rules`

## Installation

### For Cursor

Add the Fragment UI MCP server to your Cursor configuration file (usually `~/.cursor/mcp.json` or in your project's `.cursor` directory).

**Recommended (works in the Fragment UI monorepo workspace):**

```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "npx",
      "args": [
        "-y",
        "@fragment_ui/mcp-server"
      ]
    }
  }
}
```

Alternative (pin to a local path, best for debugging):

```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "node",
      "args": [
        "/absolute/path/to/fragment-ui/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Notes:
- The package name is `@fragment_ui/mcp-server` (not `@fragment-ui/mcp-server`).
- The server reads files from your workspace (registry/tokens/rules). If your workspace is not the Fragment UI monorepo, point it at a compatible repo or set `FRAGMENT_UI_ROOT`.

## What tools does it expose?

Core tools:
- `get_component_info`
- `suggest_component`
- `validate_code`
- `generate_component`
- `get_tokens`

Additional tools:
- `list_registry`, `search_components`
- `list_scaffolds`, `get_scaffold_info`, `create_scaffold`
- `edit_apply`, `edit_find`

## Features

### Component Information

Get detailed information about any Fragment UI component:

```
// Ask AI: "What props does the Button component accept?"
// AI will provide complete prop documentation
```

### Component Generation

Generate components that follow Fragment UI patterns:

```
// Ask AI: "Create a form with validation using Fragment UI"
// AI will generate code using Fragment UI components
```

### Design Token Access

Access design tokens for consistent styling:

```
// Ask AI: "What spacing tokens are available?"
// AI will list all spacing tokens with values
```

### Code Validation

Validate your code against basic Fragment UI design system rules:

```
// Ask AI: "Validate this component code"
// AI will check for design system compliance
```

## Resources

The server also exposes read-only MCP resources:
- `fragment://components` (registry)
- `fragment://tokens` (design tokens)
- `fragment://rules` (rules from `mcp/rules.json`)

## Troubleshooting

### Server Not Starting

If the MCP server doesn't start, check:

- Node.js version is 18 or higher
- Configuration file syntax is correct
- If you use the local-path config, ensure `packages/mcp-server/dist/index.js` exists (run `pnpm --filter @fragment_ui/mcp-server build`)

### AI Not Recognizing Components

If AI doesn't recognize Fragment UI components:

- Restart your AI assistant after configuration
- Verify the MCP server is running
- Check server logs for errors

## Next Steps

- [Introduction](/docs/introduction) - Learn more about Fragment UI
- [Setup](/docs/setup) - Complete setup guide
- [Components](/docs/components) - Browse all components



