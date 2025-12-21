# Playground AI v1.1 - API Documentation

## Table of Contents

1. [Patch API](#patch-api)
2. [History API](#history-api)
3. [NLU API](#nlu-api)
4. [Layout API](#layout-api)
5. [i18n API](#i18n-api)
6. [Selection API](#selection-api)
7. [Validator API](#validator-api)
8. [AST Sync API](#ast-sync-api)
9. [MCP Tools](#mcp-tools)

## Patch API

### Types

```typescript
type NodeRef =
  | { type: "byId"; id: string }
  | { type: "byPath"; path: string }
  | { type: "byTestId"; testId: string };

type Patch =
  | { op: "setCopy"; target: NodeRef; path: string; value: string }
  | { op: "addNode"; parent: NodeRef; index?: number; node: any }
  | { op: "removeNode"; target: NodeRef }
  | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }
  | { op: "setProp"; target: NodeRef; prop: string; value: any }
  | { op: "setToken"; target: NodeRef; token: "space" | "radius" | "color"; value: any }
  | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }
  | { op: "wrapWith"; target: NodeRef; wrapper: any }
  | { op: "reorder"; parent: NodeRef; from: number; to: number }
  | { op: "renameField"; target: NodeRef; from: string; to: string };
```

### Functions

#### `findNode(dsl: UiDsl, ref: NodeRef): any | null`

Finds a node in DSL by reference.

**Parameters:**
- `dsl`: The UI-DSL structure
- `ref`: Node reference (byId, byPath, or byTestId)

**Returns:** The found node or `null`

#### `applyPatch(dsl: UiDsl, patch: Patch): UiDsl`

Applies a single patch to DSL.

**Parameters:**
- `dsl`: The UI-DSL structure
- `patch`: The patch operation to apply

**Returns:** New DSL with patch applied

#### `applyPatches(dsl: UiDsl, patches: Patch[]): UiDsl`

Applies multiple patches transactionally.

**Parameters:**
- `dsl`: The UI-DSL structure
- `patches`: Array of patch operations

**Returns:** New DSL with all patches applied

## History API

### Types

```typescript
interface Commit {
  id: string;                    // UUID v4
  timestamp: number;             // Unix timestamp
  message?: string;              // Optional commit message
  author?: string;                // Optional author
  patches: Patch[];               // Patches applied
  dslBefore: UiDsl;              // DSL state before
  dslAfter: UiDsl;               // DSL state after
  parentId?: string;              // Parent commit ID
  branch?: string;                // Branch name
}

interface History {
  commits: Commit[];
  currentIndex: number;
  branches: Record<string, number>;
  currentBranch: string;
}
```

### Functions

#### `createHistory(): History`

Creates a new history instance.

**Returns:** Empty history

#### `commitPatches(history: History, patches: Patch[], currentDsl: UiDsl, options?: CommitOptions): CommitResult`

Applies patches and creates a commit.

**Parameters:**
- `history`: History state
- `patches`: Patches to apply
- `currentDsl`: Current DSL state
- `options`: Optional commit metadata

**Returns:** `{ history: History; dsl: UiDsl; commit: Commit }`

#### `undo(history: History): UndoResult`

Goes back one commit.

**Returns:** `{ history: History; dsl: UiDsl | null }`

#### `redo(history: History): RedoResult`

Goes forward one commit.

**Returns:** `{ history: History; dsl: UiDsl | null }`

#### `checkout(history: History, commitId: string): CheckoutResult`

Checkouts a specific commit.

**Returns:** `{ history: History; dsl: UiDsl | null }`

#### `getCommits(history: History, options?: CommitListOptions): Commit[]`

Gets list of commits with optional filtering.

**Parameters:**
- `history`: History state
- `options`: Optional filters (branch, limit, offset)

**Returns:** Array of commits

## NLU API

### Types

```typescript
interface Intent {
  type: string;
  confidence: number;
  patches: Patch[];
  targetRef?: NodeRef;
  metadata?: Record<string, any>;
}
```

### Functions

#### `parseIntent(utterance: string, currentDsl: UiDsl, selection?: NodeRef): Intent`

Parses user utterance into intent and patches.

**Parameters:**
- `utterance`: User's natural language command
- `currentDsl`: Current DSL state
- `selection`: Optional current selection

**Returns:** Intent with patches

**Supported Commands:**
- "change label to 'X'"
- "add a [component] field"
- "remove the [component]"
- "move [component] to [position]"
- "change variant to [variant]"
- "arrange in [layout]"

## Layout API

### Types

```typescript
type LayoutType = 'stack' | 'grid' | 'two-column';

interface LayoutConfig {
  type: LayoutType;
  gap?: number;
  columns?: number;
  colSpan?: number;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### Functions

#### `createStackLayout(targetId: string, gap?: number): Patch[]`

Creates patches for stack layout.

**Returns:** Array of patches

#### `createGridLayout(targetId: string, columns?: number, gap?: number): Patch[]`

Creates patches for grid layout.

**Returns:** Array of patches

#### `createTwoColumnLayout(targetId: string, gap?: number): Patch[]`

Creates patches for two-column layout.

**Returns:** Array of patches

#### `layoutToClasses(layout: LayoutConfig): string`

Converts layout config to CSS classes.

**Returns:** Space-separated CSS class names

## i18n API

### Types

```typescript
type Locale = string;

interface CopyStore {
  [key: string]: {
    [locale: Locale]: string;
  };
}
```

### Functions

#### `createCopyStore(): CopyStore`

Creates a new copy store.

**Returns:** Empty copy store

#### `setCopy(store: CopyStore, key: string, locale: Locale, value: string): CopyStore`

Sets copy for a key and locale.

**Returns:** New copy store

#### `getCopy(store: CopyStore, key: string, locale?: Locale): string | undefined`

Gets copy for a key and locale.

**Returns:** Copy value or `undefined`

#### `setCopyMulti(store: CopyStore, key: string, copies: Record<Locale, string>): CopyStore`

Sets copy for multiple locales at once.

**Returns:** New copy store

## Selection API

### Types

```typescript
interface SelectionState {
  current: NodeRef | null;
  history: NodeRef[];
}
```

### Functions

#### `createSelection(): SelectionState`

Creates a new selection state.

**Returns:** Empty selection state

#### `setSelection(selection: SelectionState, ref: NodeRef): SelectionState`

Sets the current selection.

**Returns:** New selection state

#### `clearSelection(selection: SelectionState): SelectionState`

Clears the current selection.

**Returns:** New selection state

#### `getCurrentSelection(selection: SelectionState): NodeRef | null`

Gets the current selection.

**Returns:** Current NodeRef or `null`

## Validator API

### Types

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  path: string;
  message: string;
  code: string;
}

interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}
```

### Functions

#### `validateDsl(dsl: UiDsl): ValidationResult`

Validates DSL structure.

**Returns:** Validation result with errors and warnings

#### `validateAfterPatchComprehensive(dsl: UiDsl, generatedCode?: string, a11yResults?: A11yResults): Promise<ValidationResult>`

Comprehensive validation after patch (DSL + code + a11y).

**Returns:** Promise of validation result

## AST Sync API

### Types

```typescript
interface ASTSyncResult {
  success: boolean;
  patches: Patch[];
  warnings: string[];
  errors: string[];
}
```

### Functions

#### `syncTSXToDSL(tsxCode: string, currentDsl: UiDsl): ASTSyncResult`

Syncs TSX code changes back to DSL.

**Note:** This is a placeholder implementation. Full AST parsing requires @babel/parser.

**Returns:** Sync result with patches

## MCP Tools

### Edit Tools

#### `edit_apply`

Applies patches to UI-DSL structure.

**Input:**
```json
{
  "patches": [/* Patch[] */],
  "dsl": { /* UiDsl */ }
}
```

**Output:**
```json
{
  "ok": true,
  "dsl": { /* Updated UiDsl */ },
  "warnings": [/* string[] */]
}
```

#### `edit_find`

Finds nodes in UI-DSL by query.

**Input:**
```json
{
  "query": {
    "byText": "email",
    "byRole": "input",
    "byProp": ["name", "email"]
  },
  "dsl": { /* UiDsl */ }
}
```

**Output:**
```json
[
  { "type": "byId", "id": "field-123" }
]
```

### History Tools

#### `history_list`

Lists commits in history.

**Input:**
```json
{
  "history": { /* History */ },
  "options": {
    "branch": "main",
    "limit": 10,
    "offset": 0
  }
}
```

**Output:**
```json
[/* Commit[] */]
```

#### `history_checkout`

Checkouts a specific commit.

**Input:**
```json
{
  "history": { /* History */ },
  "commitId": "commit-uuid-123"
}
```

**Output:**
```json
{
  "ok": true,
  "history": { /* Updated History */ },
  "dsl": { /* UiDsl */ }
}
```

#### `history_get`

Gets a specific commit by ID.

**Input:**
```json
{
  "history": { /* History */ },
  "commitId": "commit-uuid-123"
}
```

**Output:**
```json
{ /* Commit */ }
```

#### `history_branches`

Gets list of branches.

**Input:**
```json
{
  "history": { /* History */ }
}
```

**Output:**
```json
["main", "feature/new-form"]
```

### Selection Tools

#### `selection_set`

Sets the current selection.

**Input:**
```json
{
  "selection": { /* SelectionState */ },
  "ref": {
    "type": "byId",
    "id": "field-123"
  }
}
```

**Output:**
```json
{ /* Updated SelectionState */ }
```

#### `selection_clear`

Clears the current selection.

**Input:**
```json
{
  "selection": { /* SelectionState */ }
}
```

**Output:**
```json
{ /* Updated SelectionState */ }
```

#### `selection_get`

Gets the current selection.

**Input:**
```json
{
  "selection": { /* SelectionState */ }
}
```

**Output:**
```json
{ "type": "byId", "id": "field-123" }
```

## Error Handling

All functions throw errors for invalid inputs:
- `Node not found` - When target node doesn't exist
- `Invalid patch operation` - When patch structure is invalid
- `Parent not found` - When parent node doesn't exist for addNode
- `Validation failed` - When DSL structure is invalid

Always wrap calls in try-catch blocks:

```typescript
try {
  const updatedDsl = applyPatch(dsl, patch);
} catch (error) {
  console.error('Patch failed:', error.message);
}
```

