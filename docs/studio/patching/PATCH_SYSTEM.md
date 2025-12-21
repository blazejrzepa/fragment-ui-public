# Patch System - Conversational Editing

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

The Patch System enables conversational editing of UI without full regeneration. Users can iteratively modify screens through natural language commands that translate to atomic patch operations.

---

## 🎯 Goals

1. **Iterative Editing:** Modify UI without regenerating from scratch
2. **Conversational:** Natural language → Patch operations
3. **Deterministic:** Same patches produce same results
4. **Traceable:** Patch history enables undo/redo

---

## 📦 Patch Operations

### setCopy

**Purpose:** Change text content (labels, placeholders, copy).

```typescript
interface SetCopyPatch {
  op: "setCopy";
  target: NodeRef;              // data-ui-id reference
  path: string;                 // e.g., "label", "placeholder", "copy"
  value: string;                // New text value
}
```

**Example:**
- Command: "Change button text to 'Book demo'"
- Patch: `{ op: "setCopy", target: { type: "byId", id: "btn_123" }, path: "label", value: "Book demo" }`

---

### setProp

**Purpose:** Change component property.

```typescript
interface SetPropPatch {
  op: "setProp";
  target: NodeRef;
  prop: string;                 // e.g., "size", "variant"
  value: any;                   // New property value
}
```

**Example:**
- Command: "Make button outline and large"
- Patches:
  - `{ op: "setProp", target: { type: "byId", id: "btn_123" }, prop: "variant", value: "outline" }`
  - `{ op: "setProp", target: { type: "byId", id: "btn_123" }, prop: "size", value: "lg" }`

---

### addNode

**Purpose:** Add new component.

```typescript
interface AddNodePatch {
  op: "addNode";
  parent: NodeRef;              // Parent container
  index?: number;               // Position (optional)
  node: UiComponent;            // Component to add
}
```

**Example:**
- Command: "Add a second CTA button next to the first one"
- Patch: `{ op: "addNode", parent: { type: "byId", id: "cta_container" }, index: 1, node: { ... } }`

---

### removeNode

**Purpose:** Remove component.

```typescript
interface RemoveNodePatch {
  op: "removeNode";
  target: NodeRef;
}
```

**Example:**
- Command: "Remove the FAQ section"
- Patch: `{ op: "removeNode", target: { type: "byId", id: "faq_section" } }`

---

### moveNode

**Purpose:** Move component to different location.

```typescript
interface MoveNodePatch {
  op: "moveNode";
  target: NodeRef;
  toParent: NodeRef;            // New parent
  index?: number;               // New position
}
```

**Example:**
- Command: "Move FAQ section above pricing"
- Patch: `{ op: "moveNode", target: { type: "byId", id: "faq_section" }, toParent: { type: "byId", id: "page_content" }, index: 2 }`

---

### wrapWith

**Purpose:** Wrap component in container.

```typescript
interface WrapWithPatch {
  op: "wrapWith";
  target: NodeRef;
  wrapper: UiComponent;         // Container component (e.g., Card)
}
```

**Example:**
- Command: "Wrap the pricing table in a Card"
- Patch: `{ op: "wrapWith", target: { type: "byId", id: "pricing_table" }, wrapper: { type: "component", component: "Card", ... } }`

---

### reorder

**Purpose:** Change order of children.

```typescript
interface ReorderPatch {
  op: "reorder";
  parent: NodeRef;
  from: number;                 // Current index
  to: number;                   // New index
}
```

**Example:**
- Command: "Move the third section to first position"
- Patch: `{ op: "reorder", parent: { type: "byId", id: "page_sections" }, from: 2, to: 0 }`

---

### rename

**Purpose:** Rename field/section.

```typescript
interface RenamePatch {
  op: "rename";
  target: NodeRef;
  from: string;                 // Old name
  to: string;                  // New name
}
```

**Example:**
- Command: "Rename 'Email' field to 'Email Address'"
- Patch: `{ op: "rename", target: { type: "byId", id: "email_field" }, from: "Email", to: "Email Address" }`

---

### setToken

**Purpose:** Change design token.

```typescript
interface SetTokenPatch {
  op: "setToken";
  target: NodeRef;
  token: "space" | "radius" | "color";
  value: any;                   // Token value
}
```

**Example:**
- Command: "Increase spacing to large"
- Patch: `{ op: "setToken", target: { type: "byId", id: "section_123" }, token: "space", value: "lg" }`

---

### toggleVariant

**Purpose:** Change component variant.

```typescript
interface ToggleVariantPatch {
  op: "toggleVariant";
  target: NodeRef;
  variant: string;              // Variant name
  value?: string;               // Optional value
}
```

**Example:**
- Command: "Change button to outline variant"
- Patch: `{ op: "toggleVariant", target: { type: "byId", id: "btn_123" }, variant: "outline" }`

---

### setBinding

**Purpose:** Bind datasource to component.

```typescript
interface SetBindingPatch {
  op: "setBinding";
  target: NodeRef;
  binding: Binding;             // Datasource binding
}
```

**Example:**
- Command: "Connect table to users API"
- Patch: `{ op: "setBinding", target: { type: "byId", id: "users_table" }, binding: { datasource: { type: "url", url: "/api/users" }, path: "data" } }`

---

### setDataSource

**Purpose:** Set datasource for component.

```typescript
interface SetDataSourcePatch {
  op: "setDataSource";
  target: NodeRef;
  datasource: DataSource;       // Datasource definition
}
```

**Example:**
- Command: "Use static data for pricing tiers"
- Patch: `{ op: "setDataSource", target: { type: "byId", id: "pricing_table" }, datasource: { type: "static", data: [...] } }`

---

## 🔄 Patch Workflow

### 1. Intent Detection

```typescript
function detectPatchIntent(prompt: string, currentDsl: UiDsl): PatchIntent {
  // Parse natural language
  // Identify target element (by text, role, data-ui-id)
  // Determine operation type
  // Extract parameters
}
```

**Examples:**
- "Change button text to 'Book demo'" → setCopy
- "Add second CTA" → addNode
- "Move FAQ up" → moveNode/reorder

---

### 2. Patch Generation

```typescript
function generatePatches(intent: PatchIntent, dsl: UiDsl): Patch[] {
  // Generate one or more patches
  // Validate patches against DSL schema
  // Resolve target references
}
```

---

### 3. Patch Application

```typescript
function applyPatches(dsl: UiDsl, patches: Patch[]): UiDsl {
  // Apply patches in order
  // Validate after each patch
  // Return new DSL (immutable)
}
```

---

### 4. Code Regeneration

```typescript
function regenerateCode(patchedDsl: UiDsl): string {
  // Generate TSX from patched DSL
  // Preserve data-ui-id
  // Update imports if needed
}
```

---

### 5. Revision Creation

```typescript
function createRevision(assetId: string, dsl: UiDsl, patches: Patch[]): Revision {
  // Create new Revision
  // Link to parent Revision
  // Store patches for history
  // Generate TSX
}
```

---

## 🎨 Integration with Chat

### Chat Orchestrator

**File:** `apps/demo/src/lib/chat-orchestrator.ts`

```typescript
class ChatOrchestrator {
  async processMessage(
    message: string,
    session: ChatSession,
    currentRevision?: Revision
  ): Promise<ChatResponse> {
    // Detect mode: generate vs edit
    if (currentRevision && this.isEditIntent(message)) {
      return this.handleEdit(message, currentRevision);
    } else {
      return this.handleGenerate(message);
    }
  }
  
  private async handleEdit(message: string, revision: Revision): Promise<ChatResponse> {
    // Parse patch intent
    const patches = await this.parsePatchIntent(message, revision.dslJson);
    
    // Apply patches
    const newDsl = applyPatches(revision.dslJson, patches);
    
    // Regenerate code
    const newCode = await this.regenerateCode(newDsl);
    
    // Create new revision
    const newRevision = await this.createRevision(
      revision.assetId,
      newDsl,
      patches,
      revision.revisionId // parent
    );
    
    return {
      type: "edit",
      revision: newRevision,
      patches,
    };
  }
}
```

---

## 🔍 Conflict Resolution

### Patch Conflicts

**Scenario:** Multiple patches modify same element.

**Resolution:**
1. Apply patches in order
2. Last patch wins for same property
3. Log conflicts for review

---

### Validation Conflicts

**Scenario:** Patch creates invalid DSL.

**Resolution:**
1. Validate after each patch
2. Rollback if validation fails
3. Return error with suggestion

---

## 📝 Acceptance Criteria

1. ✅ "Change button text to 'Book demo'" → setCopy patch applied
2. ✅ "Add second CTA" → addNode patch applied
3. ✅ "Change button variant to outline" → toggleVariant patch applied
4. ✅ "Move FAQ section up" → moveNode/reorder patch applied
5. ✅ Patches create new Revision (immutable)
6. ✅ Patch history enables undo/redo
7. ✅ Preview updates without full reload

---

## 🔗 Related Documents

- [DSL Patch Operations](../../apps/demo/src/lib/dsl-patch.ts) - Implementation
- [Patch API](../../apps/demo/app/api/dsl/patch/route.ts) - API endpoint
- [STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Domain model

---

**Last Updated:** 2025-01-XX

