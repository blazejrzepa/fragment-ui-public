# Registry Format

**Purpose:** Component registry JSON schema specification  
**Audience:** Engineers working with registry  
**When to read:** When creating or modifying registry entries

---

## Overview

The registry is a JSON file that describes all available components, their files, dependencies, and metadata.

**Location:** `packages/registry/registry.json`

---

## Schema

### Component Entry

```typescript
interface RegistryComponent {
  name: string;                    // Component name (kebab-case)
  type: "components:ui" | "components:block" | "components:form";
  files: string[];                 // File paths relative to package
  dependencies?: string[];         // NPM dependencies
  registryDependencies?: string[]; // Other registry components
  devDependencies?: string[];      // Dev dependencies
  peerDependencies?: string[];     // Peer dependencies
  variants?: Variant[];            // Component variants
  slots?: Slot[];                  // Component slots
  a11y?: A11yInfo;                 // Accessibility information
  examples?: Example[];            // Usage examples
  rules?: {
    forbiddenHtml?: string[];      // Forbidden HTML elements
  };
}
```

### Variant

```typescript
interface Variant {
  name: string;                    // Variant name
  props: Record<string, any>;      // Props for this variant
}
```

### Slot

```typescript
interface Slot {
  name: string;                    // Slot name
  description?: string;             // Slot description
  required?: boolean;               // Is slot required
}
```

### A11y Info

```typescript
interface A11yInfo {
  role?: string;                    // ARIA role
  notes?: string;                   // Accessibility notes
}
```

---

## Example

```json
{
  "name": "button",
  "type": "components:ui",
  "files": ["button.tsx"],
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": [],
  "variants": [
    {
      "name": "default",
      "props": { "variant": "default" }
    },
    {
      "name": "outline",
      "props": { "variant": "outline" }
    }
  ],
  "slots": [],
  "a11y": {
    "role": "button",
    "notes": "Accessible button with keyboard support"
  },
  "examples": [
    {
      "code": "<Button>Click me</Button>",
      "description": "Basic button usage"
    }
  ],
  "rules": {
    "forbiddenHtml": ["<button>"]
  }
}
```

---

## Registry API

### Public Endpoint

**URL:** `https://fragment-ui.dev/r/{component}.json`

**Example:** `https://fragment-ui.dev/r/button.json`

**Response:**
```json
{
  "name": "button",
  "type": "components:ui",
  "files": [
    {
      "path": "button.tsx",
      "content": "..."
    }
  ],
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": []
}
```

---

## Validation

### Validate Registry

```bash
# Validate registry structure
pnpm --filter @fragment_ui/registry validate
```

### Validation Rules

- All components must have `name` and `type`
- `files` must exist in package
- `dependencies` must be valid NPM packages
- `registryDependencies` must reference existing components

---

## Gotchas

- **File Paths:** Relative to package root
- **Dependencies:** Must match package.json
- **Variants:** Must match component props
- **Slots:** Must match component structure

---

## Next Steps

- [Component APIs](../api/) - Component API reference
- [UI-DSL Schema](./ui-dsl-schema.md) - DSL specification

---

**Last Updated:** 2025-01-XX

