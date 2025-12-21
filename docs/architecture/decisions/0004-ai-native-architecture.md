# ADR-0004: AI-Native Architecture for Studio

**Status:** Accepted  
**Date:** 2025-01-XX  
**Deciders:** Architecture Team

---

## Context

Fragment UI Studio needs to support AI-powered UI generation and editing. We need to decide on the architecture.

**Options:**
1. Traditional form-based UI builder
2. AI-powered with conversational interface
3. Hybrid approach

---

## Decision

We will use an **AI-native architecture** with:
- **UI-DSL v2** as intermediate representation
- **Conversational editing** via patch operations
- **MCP Server** for AI agent integration
- **Domain-Driven Design** for module boundaries

**Rationale:**
- Enables natural language UI generation
- Supports iterative editing without full regeneration
- Clear separation of concerns
- Testable and maintainable

---

## Consequences

### Positive
- Natural language interface
- Iterative editing (patches)
- Clear module boundaries
- Testable architecture

### Negative
- More complex than traditional builders
- Requires DSL design and maintenance
- AI integration complexity

---

## Implementation

- UI-DSL v2 types in `packages/ui-dsl`
- Studio modules in `apps/demo/app/studio`
- MCP Server in `packages/mcp-server`
- Patch system in `apps/demo/src/lib/dsl-patch.ts`

---

**See Also:** 
- [Domain Model](../domain-model.md)
- [Module Boundaries](../module-boundaries.md)
- [Studio Documentation](../../studio/README.md)

