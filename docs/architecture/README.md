# Architecture Documentation

**Purpose:** Deep technical architecture documentation  
**Audience:** Architects, senior engineers, maintainers  
**When to read:** When designing features or understanding system design

---

## 📋 Overview

This section contains comprehensive architecture documentation for Fragment UI, including system design, domain models, module boundaries, and architectural decisions.

---

## 🚀 Quick Navigation

1. **[System Overview](./system-overview.md)** - C4 Context diagram, high-level architecture
2. **[Monorepo Structure](./monorepo-structure.md)** - Package organization and dependencies
3. **[Domain Model](./domain-model.md)** - Core entities (Asset, Revision, Patch, etc.)
4. **[Module Boundaries](./module-boundaries.md)** - Studio module responsibilities
5. **[Data Flow](./data-flow.md)** - How data flows through the system
6. **[Context Engine Architecture](../roadmap/CONTEXT_ENGINE_STRATEGY.md)** 🆕 - Multi-agent AI-native layer
7. **[Architecture Decisions](./decisions/README.md)** - ADRs for key decisions

---

## 🎯 Key Concepts

### Domain-Driven Design

Fragment UI Studio follows DDD principles:

- **Core Domain:** Asset, Revision, Patch, CheckResult, Experiment
- **Bounded Contexts:** Studio, Library, Drafts, Releases, Experiments, Governance
- **Domain Events:** AssetCreated, RevisionCreated, SubmissionOpened, etc.

### Module Boundaries

Each module has:
- **Clear Responsibilities:** Single responsibility per module
- **ID-Based Integration:** All modules operate on shared IDs (assetId, revisionId)
- **Event-Driven Communication:** Modules communicate via domain events
- **No Direct Dependencies:** Modules don't import each other directly

---

## 🧠 Context Engine (AI-Native Layer)

Fragment UI Studio is evolving to include a **Context Engine** - a multi-agent AI-native layer that transforms the platform from prompt-based to context-driven UI generation.

**Key Features:**
- **Multi-Agent Architecture:** Specialized agents (Planner, Executor, Validator, Tracer) working in coordination
- **Semantic Blueprint Matching:** Intent → UI pattern matching using vector embeddings
- **Context-Aware Generation:** UIs generated with full understanding of user intent, domain context, and design patterns
- **Execution Transparency:** Full traceability of agent decisions and actions

**See:** [Context Engine Strategy](../roadmap/CONTEXT_ENGINE_STRATEGY.md) for detailed architecture and implementation plan.

---

## 📚 Related Documentation

- [Getting Started](../getting-started/README.md) - Quick onboarding
- [Development Guide](../development/README.md) - Development workflows
- [Studio Documentation](../studio/README.md) - Studio-specific features
- [Context Engine Strategy](../roadmap/CONTEXT_ENGINE_STRATEGY.md) 🆕 - AI-native layer strategy

---

**Last Updated:** 2025-01-XX

