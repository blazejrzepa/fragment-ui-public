# Playground AI v1.1 - Usage Examples

## Overview

This document provides practical examples of using the Playground AI v1.1 features:
- Patch API
- History API
- NLU (Natural Language Understanding)
- Layout Operations
- i18n Copy Store
- Selection Management

## 1. Patch API Examples

### Example 1: Change Label Text

```typescript
import { applyPatch } from './dsl/patch';
import type { UiDsl } from './dsl/types';

const dsl: UiDsl = {
  id: 'form-123',
  type: 'form',
  fields: [{
    id: 'field-456',
    name: 'email',
    label: 'Email',
    component: 'Input',
  }],
};

// Change label from "Email" to "Email Address"
const updatedDsl = applyPatch(dsl, {
  op: 'setCopy',
  target: { type: 'byId', id: 'field-456' },
  path: 'label',
  value: 'Email Address',
});
```

### Example 2: Add a New Field

```typescript
import { applyPatch } from './dsl/patch';
import { generateId } from './dsl/types';

const newField = {
  id: generateId(),
  name: 'phone',
  label: 'Phone Number',
  component: 'Input',
  validation: 'required',
};

const updatedDsl = applyPatch(dsl, {
  op: 'addNode',
  parent: { type: 'byId', id: 'form-123' },
  node: newField,
});
```

### Example 3: Remove a Field

```typescript
const updatedDsl = applyPatch(dsl, {
  op: 'removeNode',
  target: { type: 'byId', id: 'field-456' },
});
```

### Example 4: Change Button Variant

```typescript
const updatedDsl = applyPatch(dsl, {
  op: 'toggleVariant',
  target: { type: 'byId', id: 'button-789' },
  variant: 'variant',
  value: 'secondary',
});
```

### Example 5: Reorder Fields

```typescript
const updatedDsl = applyPatch(dsl, {
  op: 'reorder',
  parent: { type: 'byId', id: 'form-123' },
  from: 0,  // Current position
  to: 2,    // New position
});
```

## 2. History API Examples

### Example 1: Create History and Commit Changes

```typescript
import { createHistory, commitPatches } from './dsl/history';
import type { Patch } from './dsl/patch';

// Create new history
let history = createHistory();

// Apply patches and create commit
const patches: Patch[] = [{
  op: 'setCopy',
  target: { type: 'byId', id: 'field-456' },
  path: 'label',
  value: 'Email Address',
}];

const result = commitPatches(history, patches, currentDsl, {
  message: 'Updated email field label',
  author: 'user',
});

history = result.history;
const newDsl = result.dsl;
```

### Example 2: Undo/Redo

```typescript
import { undo, redo } from './dsl/history';

// Undo last change
const undoResult = undo(history);
history = undoResult.history;
const previousDsl = undoResult.dsl;

// Redo
const redoResult = redo(history);
history = redoResult.history;
const nextDsl = redoResult.dsl;
```

### Example 3: List Commits

```typescript
import { getCommits } from './dsl/history';

// Get all commits
const allCommits = getCommits(history);

// Get last 5 commits
const recentCommits = getCommits(history, { limit: 5 });

// Get commits from a specific branch
const branchCommits = getCommits(history, { branch: 'feature/new-form' });
```

### Example 4: Checkout a Commit

```typescript
import { checkout } from './dsl/history';

// Checkout specific commit
const checkoutResult = checkout(history, 'commit-uuid-123');
history = checkoutResult.history;
const commitDsl = checkoutResult.dsl;
```

### Example 5: Create and Switch Branches

```typescript
import { createBranch, switchBranch } from './dsl/history';

// Create new branch
history = createBranch(history, 'feature/new-layout');

// Switch to branch
const switchResult = switchBranch(history, 'feature/new-layout');
history = switchResult.history;
const branchDsl = switchResult.dsl;
```

## 3. NLU (Natural Language Understanding) Examples

### Example 1: Parse Simple Command

```typescript
import { parseIntent } from './dsl/nlu';

const utterance = "Change the email field label to 'Email Address'";
const intent = parseIntent(utterance, currentDsl);

console.log(intent);
// {
//   type: 'setCopy',
//   confidence: 0.8,
//   patches: [{
//     op: 'setCopy',
//     target: { type: 'byId', id: 'field-456' },
//     path: 'label',
//     value: 'Email Address',
//   }],
// }
```

### Example 2: Add Field Command

```typescript
const utterance = "Add a phone number field";
const intent = parseIntent(utterance, currentDsl);

// Apply patches from intent
if (intent.patches.length > 0) {
  const updatedDsl = applyPatches(currentDsl, intent.patches);
}
```

### Example 3: Remove Field Command

```typescript
const utterance = "Remove the password field";
const intent = parseIntent(utterance, currentDsl);
```

### Example 4: Change Variant Command

```typescript
const utterance = "Change the submit button to secondary variant";
const intent = parseIntent(utterance, currentDsl);
```

### Example 5: Layout Command

```typescript
const utterance = "Arrange fields in a two-column layout";
const intent = parseIntent(utterance, currentDsl);
```

## 4. Layout Operations Examples

### Example 1: Create Stack Layout

```typescript
import { createStackLayout, applyPatches } from './dsl/layouts';
import { applyPatches as applyPatchesToDsl } from './dsl/patch';

const patches = createStackLayout('form-123', 16);
const updatedDsl = applyPatchesToDsl(currentDsl, patches);
```

### Example 2: Create Grid Layout

```typescript
import { createGridLayout } from './dsl/layouts';

// Create 3-column grid with 24px gap
const patches = createGridLayout('form-123', 3, 24);
const updatedDsl = applyPatchesToDsl(currentDsl, patches);
```

### Example 3: Create Two-Column Layout

```typescript
import { createTwoColumnLayout } from './dsl/layouts';

const patches = createTwoColumnLayout('form-123', 20);
const updatedDsl = applyPatchesToDsl(currentDsl, patches);
```

## 5. i18n Copy Store Examples

### Example 1: Create and Use Copy Store

```typescript
import { createCopyStore, setCopy, getCopy } from './dsl/i18n';

// Create store
let copyStore = createCopyStore();

// Set copy for English
copyStore = setCopy(copyStore, 'email.label', 'en', 'Email');

// Set copy for Polish
copyStore = setCopy(copyStore, 'email.label', 'pl', 'E-mail');

// Get copy
const englishLabel = getCopy(copyStore, 'email.label', 'en'); // "Email"
const polishLabel = getCopy(copyStore, 'email.label', 'pl');  // "E-mail"
```

### Example 2: Set Multiple Locales at Once

```typescript
import { setCopyMulti } from './dsl/i18n';

copyStore = setCopyMulti(copyStore, 'submit.button', {
  en: 'Submit',
  pl: 'Wyślij',
  de: 'Absenden',
});
```

### Example 3: Use Copy Store with setCopy Patch

```typescript
// When applying setCopy patch, update copy store
const patch = {
  op: 'setCopy',
  target: { type: 'byId', id: 'field-456' },
  path: 'label',
  value: 'Email Address',
};

// Update copy store for current locale
copyStore = setCopy(copyStore, 'field-456.label', 'en', 'Email Address');
```

## 6. Selection Management Examples

### Example 1: Set Selection

```typescript
import { createSelection, setSelection } from './dsl/selection';

let selection = createSelection();

// Set selection to a field
selection = setSelection(selection, {
  type: 'byId',
  id: 'field-456',
});
```

### Example 2: Use Selection with NLU

```typescript
import { parseIntent } from './dsl/nlu';

// User clicks on email field in preview
const selectedRef = { type: 'byId', id: 'field-456' };

// User says "change this to 'Email Address'"
const utterance = "change this to 'Email Address'";
const intent = parseIntent(utterance, currentDsl, selectedRef);

// Intent will use selectedRef as target
```

### Example 3: Clear Selection

```typescript
import { clearSelection } from './dsl/selection';

selection = clearSelection(selection);
```

## 7. Complete Workflow Example

```typescript
import { createHistory, commitPatches } from './dsl/history';
import { parseIntent } from './dsl/nlu';
import { applyPatches } from './dsl/patch';
import { validateDsl } from './dsl/validator';
import { createSelection, setSelection } from './dsl/selection';

// 1. Initialize
let history = createHistory();
let selection = createSelection();
let dsl = initialDsl;

// 2. User clicks on email field in preview
selection = setSelection(selection, { type: 'byId', id: 'email-field-id' });

// 3. User says "change label to 'Email Address'"
const utterance = "change label to 'Email Address'";
const intent = parseIntent(utterance, dsl, selection.current || undefined);

// 4. Apply patches
if (intent.patches.length > 0) {
  const result = commitPatches(history, intent.patches, dsl, {
    message: `User: ${utterance}`,
    author: 'user',
  });
  
  history = result.history;
  dsl = result.dsl;
  
  // 5. Validate
  const validation = validateDsl(dsl);
  if (!validation.valid) {
    console.error('Validation errors:', validation.errors);
    // Undo if validation fails
    const undoResult = undo(history);
    history = undoResult.history;
    dsl = undoResult.dsl || dsl;
  }
}

// 6. Generate TSX and render
const code = generateCode(dsl);
// ... render in preview
```

## 8. MCP Tools Usage Examples

### Example 1: Apply Patches via MCP

```json
{
  "tool": "edit_apply",
  "arguments": {
    "dsl": { /* UI-DSL object */ },
    "patches": [
      {
        "op": "setCopy",
        "target": { "type": "byId", "id": "field-123" },
        "path": "label",
        "value": "New Label"
      }
    ]
  }
}
```

### Example 2: Find Nodes via MCP

```json
{
  "tool": "edit_find",
  "arguments": {
    "dsl": { /* UI-DSL object */ },
    "query": {
      "byText": "email",
      "byRole": "input"
    }
  }
}
```

### Example 3: List History via MCP

```json
{
  "tool": "history_list",
  "arguments": {
    "history": { /* History object */ },
    "options": {
      "limit": 10,
      "branch": "main"
    }
  }
}
```

### Example 4: Set Selection via MCP

```json
{
  "tool": "selection_set",
  "arguments": {
    "selection": { /* Selection state */ },
    "ref": {
      "type": "byId",
      "id": "field-123"
    }
  }
}
```

## 9. Integration with Playground UI

The Playground UI automatically:
1. Generates DSL with UUIDs for all nodes
2. Adds `data-ui-id` to all generated TSX elements
3. Handles clicks in preview to set selection
4. Sends selection to NLU when processing user commands
5. Applies patches and creates history commits
6. Validates after each change
7. Regenerates TSX and updates preview

## Next Steps

- See `PLAYGROUND_AI_V1.1_IMPLEMENTATION_PLAN.md` for architecture details
- See API documentation for full function signatures
- Check MCP server tools for AI agent integration

