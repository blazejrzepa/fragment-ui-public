# Quick Start

**Purpose:** Build your first component in 5 minutes  
**Audience:** New developers  
**When to read:** After installation

---

## 🎯 Goal

Create a simple Button component and use it in the Demo app.

---

## Step 1: Create Component

```bash
# Navigate to UI package
cd packages/ui/src

# Create component file
touch button-example.tsx
```

Add basic component:

```tsx
// packages/ui/src/button-example.tsx
import * as React from "react"

export function ButtonExample({ children, ...props }) {
  return (
    <button {...props}>
      {children}
    </button>
  )
}
```

---

## Step 2: Export Component

Add to `packages/ui/src/index.ts`:

```tsx
export { ButtonExample } from "./button-example"
```

---

## Step 3: Use in Demo App

```tsx
// apps/demo/app/page.tsx
import { ButtonExample } from "@fragment_ui/ui"

export default function Page() {
  return <ButtonExample>Hello World</ButtonExample>
}
```

---

## Step 4: View Result

```bash
pnpm dev
```

Visit http://localhost:3002 to see your component.

---

## ✅ Success!

You've created and used your first component. Next:

- [Architecture Overview](./architecture-overview.md) - Understand the system
- [Component Implementation Guide](../development/component-implementation.md) - Build production components
- [Testing Guide](../development/testing.md) - Add tests

---

## Gotchas

- **Import Path:** Use `@fragment_ui/ui` not relative paths
- **Build Required:** Some packages need `pnpm build` before use
- **TypeScript:** All components must be TypeScript

---

**Last Updated:** 2025-01-XX

