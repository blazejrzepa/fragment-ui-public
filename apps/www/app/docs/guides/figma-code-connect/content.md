---
title: Figma Code Connect Guide
---

This guide explains how to connect Fragment UI components with Figma designs using [Figma Code Connect](https://www.figma.com/developers/code-connect).

## Overview

Figma Code Connect allows designers and developers to:

- See which code component matches a Figma component
- Navigate from Figma to code (and vice versa)
- Keep design and code in sync
- Enable AI tools to understand component relationships

## Setup

### 1. Install Figma Code Connect CLI

```bash
npm install -g @figma/code-connect
```

Or use with npx:

```bash
npx @figma/code-connect
```

### 2. Create Code Connect Files

Code Connect files are TypeScript files that map Figma components to code components. 
They are located in the `figma-code-connect/` directory at the root of the project.

### 3. Configure Figma Plugin

1. Open your Figma file
2. Install the "Code Connect" plugin from Figma
3. Authenticate with your GitHub account (if connecting to GitHub)
4. Connect to your repository

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

### Generate Documentation

```bash
npx @figma/code-connect generate
```

This will generate a `code-connect.json` file that can be used by Figma.

### Validate Connections

```bash
npx @figma/code-connect validate
```

### Push to Figma

```bash
npx @figma/code-connect push
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
- Ensure the `code-connect.json` file is up to date

## Resources

- [Figma Code Connect Documentation](https://www.figma.com/developers/code-connect)
- [Code Connect GitHub](https://github.com/figma/code-connect)
- [Figma Plugin Marketplace](https://www.figma.com/community/plugins)

## See Also

- [Design to Code Workflow](/docs/guides/design-to-code)
- [Component Library](/components)

