# ADR-0005: Domain-Driven Design for Studio

**Status:** Accepted  
**Date:** 2025-01-XX  
**Deciders:** Architecture Team

---

## Context

Fragment UI Studio has multiple modules (Studio, Library, Drafts, Releases, Experiments, Governance). We need to decide on architecture pattern.

**Options:**
1. Monolithic application
2. Microservices
3. Domain-Driven Design (modular monolith)
4. Feature-based organization

---

## Decision

We will use **Domain-Driven Design (DDD)** principles with a **modular monolith** structure.

**Rationale:**
- Clear module boundaries
- Shared domain model (Asset, Revision, Patch)
- Event-driven communication
- Testable and maintainable
- No operational complexity of microservices

---

## Consequences

### Positive
- Clear responsibilities per module
- Testable modules
- Scalable architecture
- No network overhead

### Negative
- Requires discipline for boundaries
- Shared domain model must be well-designed
- Event system adds complexity

---

## Implementation

- Core Domain in `packages/studio-core` (planned)
- Modules in `apps/demo/app/studio` with clear boundaries
- Domain events for cross-module communication
- ID-based integration (assetId, revisionId)

---

**See Also:**
- [Domain Model](../domain-model.md)
- [Module Boundaries](../module-boundaries.md)
- [Studio Development Plan](../../roadmap/current-plan.md)

