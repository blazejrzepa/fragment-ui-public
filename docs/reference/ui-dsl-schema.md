# UI-DSL v2 Schema

**Purpose:** UI-DSL v2 JSON Schema specification  
**Audience:** Engineers working with DSL  
**When to read:** When implementing DSL generation or validation

---

## Overview

UI-DSL v2 is a domain-specific language for representing UI structures. It serves as an intermediate representation between natural language prompts and generated TSX code.

**Package:** `@fragment_ui/ui-dsl`

---

## Schema Export

### JSON Schema

The UI-DSL v2 schema is exported as JSON Schema:

```typescript
import { exportJsonSchema } from '@fragment_ui/ui-dsl'

const schema = exportJsonSchema()
// Returns JSON Schema for UI-DSL v2
```

### Usage

```bash
# Export schema
node -e "require('@fragment_ui/ui-dsl').exportJsonSchema()"
```

---

## Core Types

### UiPage

```typescript
interface UiPage {
  type: "page";
  id: string;                    // UUID v4
  name?: string;
  sections?: UiSection[];
  layout?: Layout;
  metadata?: Metadata;
}
```

### UiSection

```typescript
interface UiSection {
  type: "section";
  kind: "hero" | "pricing" | "faq" | "dataTable" | ...;
  id: string;
  title?: string;
  content?: UiNode[];
  layout?: Layout;
}
```

### UiComponent

```typescript
interface UiComponent {
  type: "component";
  component: string;             // Component name (e.g., "Button")
  id: string;
  props?: Record<string, any>;
  children?: UiNode[];
  variant?: string;
  slots?: Record<string, UiNode[]>;
}
```

### DataSource

```typescript
interface DataSource {
  type: "placeholder" | "static" | "url";
  data?: any;                    // For static
  url?: string;                  // For URL
  placeholder?: string;          // For placeholder
}
```

### Binding

```typescript
interface Binding {
  datasource: DataSource;
  path: string;                  // JSON path (e.g., "data.items")
  prop: string;                  // Component prop name
}
```

---

## Validation

### Validate DSL

```typescript
import { validatePage } from '@fragment_ui/ui-dsl'

const result = validatePage(dsl, registry)
// Returns { valid: boolean, errors: Diagnostic[] }
```

### Validation Rules

- All IDs must be UUID v4
- Component names must exist in registry
- Props must match component schema
- Variants must be valid for component
- Data sources must be properly formatted

---

## Example

```json
{
  "type": "page",
  "id": "page_123",
  "name": "Login Page",
  "sections": [
    {
      "type": "section",
      "kind": "hero",
      "id": "hero_123",
      "title": "Welcome",
      "content": [
        {
          "type": "component",
          "component": "Button",
          "id": "btn_123",
          "props": {
            "variant": "default",
            "size": "lg"
          },
          "children": [
            {
              "type": "text",
              "content": "Sign In"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Schema Files

- **Types:** `packages/ui-dsl/src/types-v2.ts`
- **Zod Schemas:** `packages/ui-dsl/src/schema.ts`
- **Validator:** `packages/ui-dsl/src/validator.ts`

---

## Gotchas

- **Circular References:** Schema uses `z.lazy()` for circular types
- **Validation:** Must validate against registry
- **Immutability:** DSL should be treated as immutable

---

## Next Steps

- [DSL Documentation](../studio/dsl/) - DSL usage guides
- [Patch System](../studio/patching/) - DSL editing
- [Code Generation](../development/code-generation.md) - DSL to TSX

---

**Last Updated:** 2025-01-XX

