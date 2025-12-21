# MCP Server Setup Guide

Complete guide for setting up and using the Fragment UI MCP Server with Cursor and GitHub Copilot.

## Overview

The Fragment UI MCP Server enables AI agents (Cursor, Copilot) to:
- Understand Fragment UI components and conventions
- Enforce design system rules automatically
- Generate code that follows best practices
- Access design tokens and component information

## Installation

```bash
# Install MCP server package
pnpm install @fragment_ui/mcp-server

# Build the server
cd packages/mcp-server
pnpm build
```

## Cursor Setup

### Step 1: Locate Cursor Settings

Cursor stores MCP server configuration in:
- **macOS/Linux**: `~/.cursor/mcp.json`
- **Windows**: `%APPDATA%\Cursor\mcp.json`

### Step 2: Add MCP Server Configuration

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "node",
      "args": [
        "/absolute/path/to/fragment-ui/packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

**Note:** Use absolute path to the MCP server executable.

### Step 3: Restart Cursor

Restart Cursor for changes to take effect.

### Step 4: Verify Connection

In Cursor, you should see Fragment UI MCP server available. You can test by asking:
- "What Fragment UI components are available?"
- "Generate a Button component"
- "Validate this code against Fragment UI rules"

## GitHub Copilot Setup

### Step 1: Install MCP Server

Ensure the MCP server is built and accessible.

### Step 2: Configure Copilot

Add MCP server configuration in Copilot settings (similar to Cursor).

## Usage Examples

### Get Component Information

Ask Cursor/Copilot:
```
Get information about the Button component in Fragment UI
```

The AI will use `get_component_info` tool to fetch component details.

### Suggest Components

Ask:
```
I need a form input with validation. What Fragment UI component should I use?
```

The AI will use `suggest_component` tool to recommend components.

### Validate Code

Ask:
```
Validate this code against Fragment UI rules:
const color = '#ff0000';
```

The AI will use `validate_code` tool and report violations.

### Generate Component Code

Ask:
```
Generate a Button component with variant="solid" and size="md"
```

The AI will use `generate_component` tool to create proper code.

### Get Design Tokens

Ask:
```
What color tokens are available in Fragment UI?
```

The AI will use `get_tokens` tool to fetch token information.

## Enforcement Rules

The MCP server automatically enforces these rules:

1. **No Raw Colors** - Must use design tokens
2. **No Raw Spacing** - Must use spacing tokens
3. **Use Fragment Components** - Prefer Fragment UI components
4. **TypeScript Types** - Avoid `any` types
5. **Accessibility** - Ensure ARIA attributes
6. **Prop Casing** - Use camelCase for props

## Troubleshooting

### MCP Server Not Found

- Check that the path in `mcp.json` is absolute
- Verify the server is built: `pnpm build` in `packages/mcp-server`
- Check file permissions

### Tools Not Available

- Restart Cursor/Copilot
- Check server logs for errors
- Verify registry.json exists

### Validation Not Working

- Ensure code is properly formatted
- Check that rules.json exists
- Verify token paths are correct

## Advanced Configuration

### Custom Rules

Edit `mcp/rules.json` to customize enforcement rules.

### Custom Resources

Add custom resources in `packages/mcp-server/src/index.ts`.

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Cursor Documentation](https://cursor.sh/docs)
- [Fragment UI Documentation](https://fragment-ui.dev)

---

*Last updated: 2025-01-05*

