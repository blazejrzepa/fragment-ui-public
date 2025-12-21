# Studio Documentation

**Purpose:** Documentation for Fragment UI Studio (AI-powered UI generation)  
**Audience:** Engineers working on Studio features  
**When to read:** When implementing or using Studio features

---

## 📋 Overview

Fragment UI Studio is an AI-native system for generating and editing complex screens through conversational interface.

---

## 🚀 Quick Navigation

1. **[DSL Documentation](./dsl/)** - UI-DSL v2 specification
2. **[Patch System](./patching/)** - Conversational editing
3. **[Submissions](./submissions/)** - Review workflow
4. **[Experiments](./experiments/)** - A/B testing
5. **[Copilot](./copilot/)** - Full Copilot specification

---

## 🎯 Key Features

### 1. AI-Powered Generation

- **Prompt → DSL:** Natural language to UI-DSL conversion
- **DSL → TSX:** Code generation from DSL
- **Preview:** Real-time preview rendering

### 2. Conversational Editing

- **Patch Operations:** Atomic edits (setCopy, setProp, addNode, etc.)
- **No Full Regeneration:** Edit without recreating entire UI
- **Undo/Redo:** Patch history enables undo/redo

### 3. Quality Gates

- **Submissions:** Review workflow with quality checks
- **Governance:** Policy enforcement
- **Releases:** Versioning and publishing

### 4. A/B Testing

- **PostHog Integration:** Feature flags for variant assignment
- **Experiment Runner:** Renders variants based on assignment
- **Winner Promotion:** Promote winning variant to submission

---

## 🏗️ Architecture

Studio follows **Domain-Driven Design** principles:

- **Core Domain:** Asset, Revision, Patch, CheckResult, Experiment
- **Bounded Contexts:** Studio, Library, Drafts, Releases, Experiments, Governance
- **Domain Events:** Event-driven communication

See [Architecture Documentation](../architecture/README.md) for details.

### Code Generator Architecture

The **DSL → TSX Code Generator** (`apps/demo/app/studio/dsl/generator.ts`) has been refactored into a modular architecture:

```
studio/dsl/
├── generator.ts (15 linii - entry point)
├── generator-core.ts (42 linie - dispatcher)
├── generators/
│   ├── form-generator.ts
│   ├── page-generator.ts
│   ├── table-generator.ts
│   ├── dashboard-generator.ts
│   ├── sections/ (section generators)
│   ├── layouts/ (layout generators)
│   └── modules/ (module generators)
└── utils/ (field, action, form, data utilities)
```

**Benefits:**
- Modular structure (19 specialized modules)
- No circular dependencies
- Better maintainability and testability
- 99.3% reduction in main file size (2029 → 15 lines)

See [Refactoring Progress](../REFACTORING_PROGRESS.md) for details.

---

## 📚 Related Documentation

- [Architecture - Domain Model](../architecture/domain-model.md) - Core entities
- [Architecture - Module Boundaries](../architecture/module-boundaries.md) - Module responsibilities
- [Development Guide](../development/README.md) - Development workflows

---

**Last Updated:** 2025-01-XX

