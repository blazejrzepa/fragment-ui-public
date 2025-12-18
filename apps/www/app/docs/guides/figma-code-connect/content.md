---
title: Figma Code Connect
description: Connect Fragment UI components with Figma.
---

Figma Code Connect maps Figma components to your React components so designers (and tools) can jump between design and code.

## Requirements

- A Figma plan that supports Code Connect (typically Organization/Enterprise)
- The Code Connect plugin installed in Figma
- GitHub access to the repo you want to connect
- Code Connect mapping files committed and pushed

## Where mappings live

Mappings live in `figma-code-connect/` at the repo root (TypeScript files).

Each mapping must define at least:

- `figmaNode` (the Figma file/component reference)
- `figmaComponentName` (the component name as it appears in Figma)
- `codeComponent` (the React component)

## Example

```ts
import { codeConnect } from "figma-code-connect";
import { Button } from "../packages/ui/src/button";

codeConnect.define({
  figmaNode: "https://www.figma.com/file/...",
  figmaComponentName: "Button",
  codeComponent: Button,
});
```

## Running Code Connect

Use the official CLI:

```bash
npx @figma/code-connect validate
npx @figma/code-connect push
```

## Troubleshooting

- **Component not found**: check `figmaComponentName` matches exactly and the Figma file is accessible.
- **No repo access**: ensure the plugin is authenticated with the right GitHub account/org.
- **Nothing updates in Figma**: confirm your mapping files are committed and pushed.
