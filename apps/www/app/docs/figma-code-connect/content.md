---
title: Figma Code Connect
---

Connect Fragment UI components with Figma.

## Overview

Figma Code Connect allows designers and developers to:

- See which code component matches a Figma component
- Navigate from Figma to code (and vice versa)
- Keep design and code in sync
- Enable AI tools to understand component relationships

## Requirements (important)

- **Figma plan**: Code Connect availability depends on your Figma plan (typically Organization/Enterprise).
- **Repo access**: the Code Connect plugin needs access to your repository (GitHub recommended).
- **Committed mappings**: `figma-code-connect/*.ts` must be committed and pushed for the plugin to see them.

## Setup

### 1. Use the mapping files in this repo

This repo keeps mappings in `figma-code-connect/` (see `figma-code-connect/button.ts` and `figma-code-connect/input.ts`).

Update these fields:
- `figmaNode`: URL to the exact Figma component node (must include `node-id=...`)
- `figmaComponentName`: must match the component name in Figma (case-sensitive)

Note: `figma-code-connect/input.ts` currently contains placeholder values and needs to be updated before it can be used.

### 2. Install Figma Code Connect CLI (optional)

```bash
npm install -g @figma/code-connect
```

Or use with npx:

```bash
npx @figma/code-connect
```

### 3. Recommended: configure the Code Connect plugin in Figma

1. In Figma, install the **Code Connect** plugin
2. Connect it to your repository (the plugin will look for `figma-code-connect/*.ts`)
3. Verify a component shows the linked code + variants

## Code Connect File Structure

Each Code Connect file follows this structure:

```typescript
import { codeConnect } from "figma-code-connect";
import { Button } from "../packages/ui/src/button";

codeConnect.define({
  figmaNode: "https://www.figma.com/file/YOUR_FILE_ID",
  figmaComponentName: "Button",
  codeComponent: Button,
  example: {
    props: {
      variant: "solid",
      size: "md",
      children: "Button",
    },
  },
});
```

## Component Mappings

### Button Example

```typescript
// figma-code-connect/button.ts
import { codeConnect } from "figma-code-connect";
import { Button } from "../packages/ui/src/button";

codeConnect.define({
  figmaNode: "https://www.figma.com/file/...",
  figmaComponentName: "Button",
  codeComponent: Button,
  variants: {
    variant: {
      "Solid": { variant: "solid" },
      "Outline": { variant: "outline" },
      "Ghost": { variant: "ghost" },
    },
    size: {
      "Small": { size: "sm" },
      "Medium": { size: "md" },
      "Large": { size: "lg" },
    },
  },
  example: {
    props: {
      variant: "solid",
      size: "md",
      children: "Button",
    },
  },
});
```

## Running Code Connect

This repository includes ready-made scripts:

```bash
# Parse mappings
pnpm figma:parse

# Publish (requires token)
export FIGMA_TOKEN="..."
pnpm figma:publish

# Alternative: publish dev resources via Figma API (custom script)
pnpm figma:publish:script
```

## Best Practices

1. **Keep Figma and Code in Sync**: Update Code Connect files when component props or Figma variants change.
2. **Use Descriptive Examples**: Provide clear example props that demonstrate typical usage.
3. **Map All Variants**: Ensure all Figma variants have corresponding code props.
4. **Document Complex Components**: For composite components (like Dialog), use render functions to show proper composition.
5. **Version Control**: Commit Code Connect files to your repository to maintain a history of component mappings.

## Example Workflow

1. **Designer** creates components in Figma with proper naming and variants
2. **Developer** implements components in code matching Figma specs
3. **Developer** creates Code Connect file mapping Figma → Code
4. **Both** use Code Connect plugin in Figma to see live connections
5. **AI Tools** can reference both design and code for context

## Troubleshooting

### Component Not Found

- Verify the `figmaComponentName` matches the exact name in Figma (case-sensitive)
- Check that the Figma file URL is correct and accessible

### Props Not Mapping

- Ensure variant property names match between Figma and code
- Check that the code component accepts the props you're mapping

### Code Connect Not Loading

- Verify you're authenticated with Figma
- Check that the plugin has access to your repository
- Ensure the `figma-code-connect/*.ts` files are committed and pushed

## Resources

- [Figma Code Connect Documentation](https://www.figma.com/developers/code-connect)
- [Code Connect GitHub](https://github.com/figma/code-connect)
- [Figma Plugin Marketplace](https://www.figma.com/community/plugins)

## See Also

- [Design to Code Workflow](/docs/guides/design-to-code)
- [Component Library](/components)


