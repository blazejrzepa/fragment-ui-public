---
title: Design to Code
---

Process of transitioning from Figma design to production code using Figma Code Connect.

## What is Figma Code Connect?

Figma Code Connect allows designers and developers to:

- See which code component matches a Figma component
- Navigate from Figma to code (and vice versa)
- Keep design and code in sync
- Enable AI tools to understand component relationships

## Getting Started

1. Install Figma Code Connect CLI: `npm install -g @figma/code-connect`
2. Review the mapping files in `figma-code-connect/` directory
3. Update Figma file URLs in the mapping files
4. Generate and push connections: `npx @figma/code-connect generate`

## Component Mappings

Fragment UI components are mapped to Figma components using Code Connect files. Each mapping file defines:

- Figma component name
- Code component reference
- Variant mappings (Figma variants → code props)
- Example usage

## Documentation

For detailed setup instructions, best practices, and troubleshooting, see the [Figma Code Connect Guide](/docs/figma-code-connect).

## Example Workflow

1. **Designer** creates components in Figma with proper naming and variants
2. **Developer** implements components in code matching Figma specs
3. **Developer** creates Code Connect file mapping Figma → Code
4. **Both** use Code Connect plugin in Figma to see live connections
5. **AI Tools** can reference both design and code for context

