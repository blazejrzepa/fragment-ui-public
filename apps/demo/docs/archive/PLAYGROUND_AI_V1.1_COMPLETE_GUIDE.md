# Playground AI v1.1 - Complete Guide

## Overview

Playground AI v1.1 implements a conversational UI editing system where users can modify React components using natural language commands. The system uses UI-DSL (UI Domain-Specific Language) as an intermediate representation, enabling precise editing through atomic patch operations.

## Architecture

### Core Components

1. **UI-DSL** - JSON-based intermediate representation
   - Every element has a stable UUID v4 `id`
   - Supports forms, pages, tables, dashboards
   - Includes layout metadata and accessibility info

2. **Patch API** - Atomic operations for editing
   - `setCopy`, `addNode`, `removeNode`, `moveNode`
   - `setProp`, `setToken`, `toggleVariant`
   - `wrapWith`, `reorder`, `renameField`

3. **History System** - Undo/Redo and versioning
   - Commits with metadata (message, author, timestamp)
   - Branch support for experimentation
   - Checkout any commit to restore state

4. **NLU Engine** - Natural language understanding
   - Parses user utterances into patch sequences
   - Uses selection context when available
   - Supports layout operations (Stack, Grid, Two-column)

5. **Validation** - Quality gates
   - DSL schema validation
   - ESLint rules enforcement
   - Accessibility checks (axe-core)

6. **Preview System** - Live rendering
   - Same-origin iframe for isolation
   - Web Worker for bundling (esbuild-wasm)
   - Click-to-select for context

## Workflow

### 1. User Input → DSL

```
User: "Create a login form"
  ↓
Parser: parsePrompt() → UiForm DSL
  ↓
DSL: { id: "uuid", type: "form", fields: [...] }
```

### 2. DSL → TSX

```
DSL: { id: "uuid", fields: [...] }
  ↓
Generator: generateCode() → TSX
  ↓
TSX: <FormEnhanced data-ui-id="uuid">...</FormEnhanced>
```

### 3. TSX → Preview

```
TSX Code
  ↓
Web Worker: Bundle with esbuild-wasm
  ↓
Iframe: Render React component
  ↓
Preview: Live UI with data-ui-id attributes
```

### 4. User Modification

```
User clicks element in preview
  ↓
Selection: { type: "byId", id: "field-123" }
  ↓
User: "change label to 'Email Address'"
  ↓
NLU: parseIntent() → Intent with patches
  ↓
History: commitPatches() → New commit
  ↓
DSL: Updated with patches
  ↓
Validation: validateDsl() → Check structure
  ↓
Regenerate TSX → Update preview
```

## Key Features

### 1. Stable IDs

Every node in DSL has a UUID v4 `id` that persists across edits:

```typescript
{
  id: "fe690b71-6a39-4fda-9434-1d453e40578f",
  type: "form",
  fields: [{
    id: "0a87c5be-31e2-42dc-b8a8-74e523a209a9",
    name: "email",
    // ...
  }]
}
```

### 2. Data-UI-ID in Generated Code

All generated TSX elements have `data-ui-id` attributes:

```tsx
<FormFieldEnhanced 
  data-ui-id="0a87c5be-31e2-42dc-b8a8-74e523a209a9"
  name="email"
  label="Email"
>
  <Input data-ui-id="0a87c5be-31e2-42dc-b8a8-74e523a209a9-input" />
</FormFieldEnhanced>
```

### 3. Selection Context

Users can click elements in preview to set selection:

```typescript
// Click in preview → postMessage
{ type: "select", id: "field-123" }

// NLU uses selection as target
parseIntent("change this", dsl, { type: "byId", id: "field-123" })
```

### 4. History and Undo/Redo

Every change creates a commit:

```typescript
const result = commitPatches(history, patches, dsl, {
  message: "User: change label to 'Email'",
  author: "user",
});

// Undo
const undoResult = undo(history);

// Redo
const redoResult = redo(history);
```

### 5. Validation Gates

After each edit, system validates:

1. **DSL Schema** - Structure is valid
2. **ESLint Rules** - Code follows design system
3. **Accessibility** - No critical a11y violations

If validation fails, changes can be reverted.

## File Structure

```
apps/demo/app/playground/dsl/
  ├── types.ts          # UI-DSL type definitions
  ├── parser.ts         # Prompt → DSL parser
  ├── generator.ts     # DSL → TSX generator
  ├── patch.ts          # Patch API operations
  ├── history.ts        # History and undo/redo
  ├── validator.ts      # DSL structure validation
  ├── validate.ts       # Code and a11y validation
  ├── nlu.ts            # Natural language understanding
  ├── layouts.ts        # Layout operations
  ├── i18n.ts           # Internationalization
  └── ast-sync.ts       # TSX → DSL sync (placeholder)

packages/mcp-server/src/
  ├── edit.ts           # MCP Edit Tools
  ├── history.ts        # MCP History Tools
  └── selection.ts      # MCP Selection Tools
```

## Integration Points

### Playground UI

The main playground page (`apps/demo/app/playground/page.tsx`) integrates:

1. **DSL Generation** - Parses prompts to DSL
2. **Code Generation** - Converts DSL to TSX
3. **Preview Rendering** - Shows live UI
4. **Selection Handling** - Manages user clicks
5. **History Management** - Tracks changes
6. **Validation** - Ensures quality

### MCP Server

The MCP server (`packages/mcp-server`) exposes tools for AI agents:

- `edit_apply` - Apply patches
- `edit_find` - Find nodes
- `history_list` - List commits
- `history_checkout` - Checkout commit
- `selection_set` - Set selection

## Best Practices

### 1. Always Use UUIDs

```typescript
// ✅ Good
const field = {
  id: generateId(),
  name: "email",
  // ...
};

// ❌ Bad
const field = {
  id: "email", // Not a UUID
  // ...
};
```

### 2. Validate After Patches

```typescript
const updatedDsl = applyPatches(dsl, patches);
const validation = validateDsl(updatedDsl);

if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
  // Revert or fix
}
```

### 3. Use Selection Context

```typescript
// When user clicks element, set selection
const selection = setSelection(currentSelection, clickedRef);

// Use selection in NLU
const intent = parseIntent(utterance, dsl, selection.current);
```

### 4. Commit Related Changes Together

```typescript
// ✅ Good - single commit for related changes
const patches = [
  { op: 'setCopy', target: ref1, path: 'label', value: 'Email' },
  { op: 'setCopy', target: ref2, path: 'label', value: 'Password' },
];
commitPatches(history, patches, dsl, { message: 'Update labels' });

// ❌ Bad - separate commits for related changes
commitPatches(history, [patch1], dsl);
commitPatches(history, [patch2], dsl);
```

## Troubleshooting

### Issue: Preview UI Disappears

**Cause:** React root recreation or a11y check interference

**Solution:** 
- Check worker.ts for proper root management
- Ensure a11y check runs asynchronously
- Verify component references are stored globally

### Issue: Patches Not Applying

**Cause:** Invalid NodeRef or missing node

**Solution:**
- Verify node exists: `findNode(dsl, ref)`
- Check NodeRef format (byId, byPath, byTestId)
- Ensure UUIDs are valid

### Issue: NLU Low Confidence

**Cause:** Unclear utterance or missing context

**Solution:**
- Provide selection context
- Use more specific commands
- Check supported command patterns in nlu.ts

## Next Steps

1. **Extend NLU** - Add more command patterns
2. **Improve AST Sync** - Implement full Babel parsing
3. **Add Tests** - Unit tests for all APIs
4. **Performance** - Optimize large DSL operations
5. **UI Polish** - Better selection highlighting

## References

- [Usage Examples](./PLAYGROUND_AI_V1.1_USAGE_EXAMPLES.md)
- [API Documentation](./PLAYGROUND_AI_V1.1_API_DOCUMENTATION.md)
- [Implementation Plan](./PLAYGROUND_AI_V1.1_IMPLEMENTATION_PLAN.md)

