# Figma Code Connect Files

This directory contains Code Connect mappings for Fragment UI components.

## Setup

1. Install Figma Code Connect CLI:
   ```bash
   npm install -g @figma/code-connect
   ```

2. Update the `figmaNode` URLs in each file with your actual Figma file URLs.

3. Generate the code-connect.json:
   ```bash
   npx @figma/code-connect generate
   ```

4. Push to Figma:
   ```bash
   npx @figma/code-connect push
   ```

## Files

- `button.ts` - Maps Figma Button to Fragment UI Button
- `input.ts` - Maps Figma Input to Fragment UI Input

## Adding New Mappings

1. Create a new `.ts` file in this directory
2. Import the component from `../packages/ui/src/`
3. Use `codeConnect.define()` to map Figma variants to code props
4. Run `generate` and `push` commands

For detailed instructions, see [`../docs/figma-code-connect.md`](../docs/figma-code-connect.md).

