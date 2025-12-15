---
title: MCP Server
---

## What is MCP?

The Model Context Protocol (MCP) is a standard protocol that allows AI assistants to interact
with external tools and services. The Fragment UI MCP server provides AI tools with:

- Access to component documentation and APIs
- Design token information
- Component generation capabilities
- Code validation against design system rules
- Component suggestions based on use cases

## Installation

### For Cursor

Add the Fragment UI MCP server to your Cursor configuration file (usually `~/.cursor/mcp.json` or in your project's `.cursor` directory):

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

**Note:** The package name is `@fragment_ui/mcp-server` (not `@fragment-ui/mcp-server`).

### For GitHub Copilot

Configure the MCP server in your Copilot settings (similar to Cursor):

```json
{
  "mcp": {
    "servers": {
      "fragment-ui": {
        "command": "npx",
        "args": ["-y", "@fragment_ui/mcp-server"]
      }
    }
  }
}
```

After configuration, restart your AI assistant to load the MCP server.

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

Validate your code against Fragment UI design system rules:

```
// Ask AI: "Validate this component code"
// AI will check for design system compliance
```

## Usage Examples

### Component Suggestions

Ask AI to suggest the right component for your use case:

```
// "I need a form input with validation"
// AI suggests: FormField component with validation props
```

### Theme Customization

Get help with theme customization:

```
// "How do I customize the primary color?"
// AI provides token override instructions
```

## Troubleshooting

### Server Not Starting

If the MCP server doesn't start, check:

- Node.js version is 18 or higher
- Package is installed: `npm list @fragment_ui/mcp-server`
- Configuration file syntax is correct

### AI Not Recognizing Components

If AI doesn't recognize Fragment UI components:

- Restart your AI assistant after configuration
- Verify the MCP server is running
- Check server logs for errors

## Next Steps

- [Introduction](/docs/get-started/introduction) - Learn more about Fragment UI
- [Setup](/docs/get-started/setup) - Complete setup guide
- [Components](/docs/components) - Browse all components

