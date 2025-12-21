# fragment-ui-public Documentation

**Status:** Public Repository  
**GitHub:** `github.com/blazejrzepa/fragment-ui-public`  
**Website:** `fragmentui.com`

---

## Overview

`fragment-ui-public` is the public repository containing only the public parts of Fragment UI:
- Design system packages (ui, tokens, blocks)
- MCP Server for AI integration
- Documentation website
- Examples

**Key Difference:** No Studio, Playground, telemetry, or other private/experimental features.

---

## Structure

```
fragment-ui-public/
├── packages/
│   ├── ui/              ✅ Public (v1.0.1) - Published to npm
│   ├── tokens/          ✅ Public (v1.0.1) - Published to npm
│   ├── blocks/          ✅ Public (v1.0.1) - Published to npm
│   ├── mcp-server/      ✅ Public (v0.1.0) - Published to npm
│   └── ... (internal packages)
├── apps/
│   └── www/             📄 Documentation (bez telemetry)
└── examples/
```

---

## Public Packages

| Pakiet | Wersja | npm | Status |
|--------|--------|-----|--------|
| `@fragment_ui/ui` | 1.0.1 | ✅ | Published |
| `@fragment_ui/tokens` | 1.0.1 | ✅ | Published |
| `@fragment_ui/blocks` | 1.0.1 | ✅ | Published |
| `@fragment_ui/mcp-server` | 0.1.0 | ✅ | Published |

---

## Synchronization

Changes from `fragment-ui` are synchronized to `fragment-ui-public`:
- Public packages (ui, tokens, blocks, mcp-server)
- Documentation updates
- Examples
- Bug fixes
- Font rendering optimizations

**See:** [Sync Plan](../../SYNC_PLAN.md) for synchronization details.

---

## Usage

### Install Packages

```bash
npm install @fragment_ui/ui @fragment_ui/tokens @fragment_ui/blocks
# or
pnpm add @fragment_ui/ui @fragment_ui/tokens @fragment_ui/blocks
```

### Use MCP Server

```bash
npm install -g @fragment_ui/mcp-server
fragment-mcp-server
```

---

## Documentation

- **Website:** https://fragmentui.com
- **GitHub:** https://github.com/blazejrzepa/fragment-ui-public
- **npm:** https://www.npmjs.com/org/fragment_ui

---

## Related Documentation

- **[Projects Overview](../../PROJECTS_OVERVIEW.md)** - Complete ecosystem overview
- **[Sync Plan](../../SYNC_PLAN.md)** - Synchronization between projects
- **[Public Scope](../../PUBLIC_SCOPE.md)** - What's included in public repo

---

**Last Updated:** 2025-01-XX

