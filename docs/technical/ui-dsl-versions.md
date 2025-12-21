# UI-DSL Versions: v1 vs v2

**Last Updated:** 2025-01-XX

---

## 📋 Overview

Fragment UI uses different versions of UI-DSL (UI Domain-Specific Language) for different purposes. This document explains the differences and when to use each version.

---

## 🔍 Three DSL Variants

### 1. **UI-DSL v1 (Legacy)** - `packages/ui-dsl/src/types.ts`
**Purpose:** Original DSL for form generation  
**Status:** ⚠️ Legacy - maintained for backward compatibility  
**Used by:** Older form generation code

**Key Features:**
- Form-centric (`UIDSL` type with `fields`, `actions`, `layout`)
- Simple field types (Input, Textarea, Select, etc.)
- Basic validation rules
- Layout configuration (maxWidth, gap, columns)

**Example:**
```typescript
{
  type: "form",
  title: "Login Form",
  fields: [
    { name: "email", label: "Email", component: "Input" },
    { name: "password", label: "Password", component: "Input" }
  ],
  actions: [
    { type: "submit", label: "Sign In", variant: "primary" }
  ]
}
```

---

### 2. **Playground DSL** - `apps/demo/app/playground/dsl/types.ts`
**Purpose:** Playground-specific DSL with AXL (Agentic Experience Layer) extensions  
**Status:** ✅ Active - used by Playground  
**Used by:** `apps/demo/app/playground/` - current playground implementation

**Key Features:**
- Multiple types: `UiForm`, `UiPage`, `UiTable`, `UiDashboard`, `UiDecision`
- AXL extensions: Action Contracts, Intent, Constraints, Evaluation
- Layout operations: Stack, Grid, Two-column
- Conversational editing support (patch operations)

**Example:**
```typescript
{
  type: "form",
  id: "uuid-v4",
  fields: [...],
  actions: [
    {
      id: "submit-action",
      label: "Submit",
      kind: "soft",
      riskLevel: "low",
      sideEffects: ["sends-email"]
    }
  ],
  intent: {
    primary: "user-registration",
    secondary: ["collect-preferences"]
  }
}
```

**When to use:**
- Playground component generation
- Conversational editing
- AXL-enabled features

---

### 3. **UI-DSL v2 (Copilot)** - `packages/ui-dsl/src/types-v2.ts`
**Purpose:** Layout-first DSL for Copilot AI Studio  
**Status:** ✅ Active - new standard for Copilot  
**Used by:** Copilot Phase 1+ (`packages/ui-dsl/`)

**Key Features:**
- Layout-first approach (Page → Section → Grid → Component)
- Datasources (placeholder, static, URL)
- Slots support (header, content, footer)
- Block references (`@fragment_ui/blocks/*`)
- Binding system (datasource → prop mapping)
- Registry validation

**Example:**
```typescript
{
  type: "page",
  id: "uuid-v4",
  title: "Dashboard",
  children: [
    {
      type: "section",
      id: "hero-section",
      variant: "hero",
      children: [...]
    },
    {
      type: "grid",
      id: "metrics-grid",
      columns: 3,
      children: [...]
    }
  ],
  dataSources: [
    {
      id: "users-ds",
      kind: "placeholder",
      shape: "table"
    }
  ]
}
```

**When to use:**
- Copilot AI Studio
- Complex screen generation (dashboards, landing pages)
- Layout-first generation
- Datasource binding

---

## 🔄 Migration Path

### From Playground DSL to UI-DSL v2

**Current State:**
- Playground uses Playground DSL (with AXL)
- Copilot will use UI-DSL v2 (layout-first)

**Future:**
- Playground may migrate to UI-DSL v2 in Phase 1.7 (Inspector → Patch Integration)
- AXL features may be added to UI-DSL v2 as extensions

**Migration Strategy:**
1. Keep Playground DSL for now (it works)
2. Build Copilot with UI-DSL v2
3. Evaluate merging AXL into UI-DSL v2
4. Migrate Playground to UI-DSL v2 if beneficial

---

## 📊 Comparison Table

| Feature | UI-DSL v1 | Playground DSL | UI-DSL v2 |
|---------|-----------|----------------|-----------|
| **Purpose** | Forms | Playground | Copilot |
| **Layout** | Basic | Stack/Grid | Layout-first |
| **Datasources** | ❌ | ❌ | ✅ |
| **Slots** | ❌ | ❌ | ✅ |
| **Blocks** | ❌ | ❌ | ✅ |
| **AXL** | ❌ | ✅ | ❌ (future) |
| **Registry Validation** | ❌ | Partial | ✅ |
| **Patch Operations** | ❌ | ✅ | ✅ (planned) |

---

## 🎯 Recommendations

### For New Development

1. **Use UI-DSL v2** for:
   - Copilot features
   - New screen generation
   - Complex layouts
   - Datasource binding

2. **Use Playground DSL** for:
   - Current Playground features
   - AXL-enabled features
   - Conversational editing (until Phase 1.7)

3. **Avoid UI-DSL v1** for:
   - New features (legacy only)

### For Refactoring

- **Don't refactor now** - wait until Phase 1 is complete
- Evaluate merging Playground DSL AXL features into UI-DSL v2
- Consider migration in Phase 1.7 or Phase 2

---

## 📚 Related Documentation

- [Copilot Contract](../copilot/contract.md) - UI-DSL v2 specification
- [Copilot Implementation Plan](../copilot/implementation-plan.md) - Migration timeline
- [Playground Architecture](../../apps/demo/docs/PLAYGROUND_ARCHITECTURE_EXPLAINED.md) - Playground DSL usage

---

## ❓ FAQ

**Q: Which DSL should I use?**  
A: Use UI-DSL v2 for Copilot, Playground DSL for current Playground features.

**Q: Will Playground DSL be deprecated?**  
A: Not immediately. It may be migrated to UI-DSL v2 in Phase 1.7 or later.

**Q: Can I use UI-DSL v2 in Playground now?**  
A: Not yet. Playground DSL is still the standard for Playground. UI-DSL v2 will be integrated in Phase 1.7.

**Q: What about AXL features?**  
A: AXL (Action Contracts, Intent, Constraints) are currently only in Playground DSL. They may be added to UI-DSL v2 as extensions.

---

**Last Updated:** 2025-01-XX

