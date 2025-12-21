# Figma Plugin - Copilot Implementation Guidelines

**Purpose:** Complete guidelines for AI assistants (Copilot, Cursor, Claude Code) to implement the Fragment UI Figma Plugin.

**Scope:** Full plugin implementation from project structure to MCP integration.

---

## 🎯 Act as a Senior Frontend Engineer

Act as a Senior Frontend Engineer specialized in Figma Plugin Development + Design Systems + TypeScript + AI tooling.

Your task is to create a complete Figma Plugin for the Fragment UI project, containing:

- ✔ Full project structure
- ✔ Parser Figma nodes → normalized model
- ✔ Mapping Figma → Fragment UI components
- ✔ Token extractor
- ✔ Layout analyzer
- ✔ DSL generator
- ✔ Integration with MCP server (already exists in repo)
- ✔ Plugin UI
- ✔ TypeScript + Vite/Build system
- ✔ Code documentation
- ✔ Unit tests for parser and DSL

Plugin should be a realistic PoC, but with complete structure, clean code, and good patterns.

---

## 1. Project Requirements

Create a plugin that:

1. Allows selecting elements in Figma and parses the entire layer tree
2. Maps Figma structures → Fragment UI Components:
   - Button
   - Input
   - Textarea
   - Card
   - Navbar / Sidebar
   - Simple Table
3. Exports React + Tailwind code compatible with Fragment UI
4. Extracts Tokens from Figma (colors, radius, typography)
5. Generates Fragment UI DSL (string)
6. Sends DSL to MCP server on local dev side
7. Contains Plugin UI with options:
   - Export TSX
   - Export DSL
   - Export Tokens
   - Preview mapping rules
8. Uses:
   - TypeScript
   - Vite
   - Strict TS types
   - Modular architecture
   - React for UI (preferred)

---

## 2. Folder Structure (Required)

Generate the following structure:

```
fragment-ui-figma-plugin/
  manifest.json
  package.json
  tsconfig.json
  vite.config.ts
  src/
    plugin/                   ← backend worker (Figma env)
      index.ts
      parser/
        normalize.ts
        inspect.ts
      mapping/
        components.ts
        infer.ts
      tokens/
        extract-colors.ts
        extract-radius.ts
      layout/
        autolayout.ts
        spacing.ts
      dsl/
        generate-dsl.ts
        builders.ts
      mcp/
        send-to-mcp.ts
      utils/
        types.ts
        helpers.ts
    ui/                       ← plugin UI panel
      index.html
      App.tsx
      components/
        Button.tsx
        CodeBlock.tsx
  dist/
```

---

## 3. Core Logic - Mandatory Implementation

### 3.1. Parser

Create function:

```typescript
export function normalizeNode(node: SceneNode): NormalizedNode
```

**NormalizedNode:**

```typescript
interface NormalizedNode {
  id: string;
  type: string;
  name: string;
  layout: LayoutProps;
  style: StyleProps;
  children: NormalizedNode[];
}
```

Parser must handle:
- AutoLayout
- padding
- gap
- fills
- text styles
- corner radius
- component sets (variants)

### 3.2. Component Mapper

Create function:

```typescript
export function mapToFragmentComponent(node: NormalizedNode): ComponentMatch | null
```

**Example Mapping Rules:**

**Button:**
- horizontal layout
- text + icon
- radius ≠ 0
- fixed height (32–48px)

**Input:**
- frame + text placeholder
- stroke color → token

**Card:**
- padding > 16
- background fill
- shadow

### 3.3. Layout Analyzer

Create:

```typescript
export function convertLayout(node: NormalizedNode): string
```

**Conversion AutoLayout → Tailwind:**
- horizontal → `flex flex-row`
- vertical → `flex flex-col`
- gap → `gap-x-X` or `gap-y-X`
- padding → `p-X` / `px-X` / `py-X`

### 3.4. Token Extraction

Required functions:

```typescript
extractColors(node: NormalizedNode): TokenSet
extractRadius(node: NormalizedNode): TokenSet
extractTypography(node: NormalizedNode): TokenSet
```

**TokenSet Format:**

```typescript
interface TokenSet {
  colors?: Record<string, string>;
  radius?: Record<string, string>;
  typography?: Record<string, TypographyToken>;
}
```

### 3.5. UI-DSL Generator

Write function:

```typescript
export function generateDSL(node: NormalizedNode): string
```

**Example DSL Output:**

```
Component LoginPage {
  Card {
    Title("Sign In")
    Input("Email")
    Input("Password")
    Button("Continue", variant="primary")
  }
}
```

### 3.6. Integration with MCP

Create module:

```typescript
export async function sendToMCP(dsl: string): Promise<MCPResponse>
```

Use:
- `fetch()`
- port 8765 (local MCP server from Fragment UI)

---

## 4. UI Plugin Requirements

Create panels:
- Export TSX
- Export DSL
- Export Tokens
- Preview mapping rules

Everything must communicate with backend:

```typescript
parent.postMessage({
  pluginMessage: {
    type: "export-tsx",
    payload
  }
}, "*");
```

---

## 5. Coding Standards

- TypeScript strict mode
- No implicit any
- Small pure functions
- No business logic in UI layer
- 100% modularity (parser ≠ mapping ≠ DSL)
- JSDoc on every exported function

---

## 6. Tests

Add tests:
- `src/plugin/parser/__tests__/normalize.test.ts`
- `src/plugin/dsl/__tests__/dsl.test.ts`
- `src/plugin/mapping/__tests__/mapping.test.ts`

Using Vitest or Jest.

---

## 7. Deliverables Copilot Must Generate

- ✔ manifest.json
- ✔ tsconfig.json
- ✔ vite.config.ts
- ✔ Full folder structure
- ✔ All TS files (parser, mapping, tokens, layout, DSL)
- ✔ UI plugin (React)
- ✔ Build scripts
- ✔ README.md with installation instructions
- ✔ Example designs (optional)

---

## 8. Quality Bar

Code must be:
- Clean
- Modular
- Easy to extend
- Compatible with Fragment UI design system architecture
- Compatible with principle "deterministic → AI assisted → developer refined"

---

## 9. Start

After providing the above guidelines, Copilot should execute:

> "Generate the full plugin scaffolding according to the specification. Create all necessary files."

---

**Last Updated:** 2025-01-XX  
**Status:** Ready for Implementation

