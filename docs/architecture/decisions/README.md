# Architecture Decision Records (ADRs)

**Purpose:** Document key architectural decisions  
**Audience:** Architects, maintainers  
**When to read:** When understanding why decisions were made

---

## What are ADRs?

Architecture Decision Records (ADRs) document important architectural decisions, their context, and consequences.

---

## ADR Format

Each ADR follows this structure:

```markdown
# ADR-XXXX: [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Deciders:** [Names]

## Context
[Background and problem statement]

## Decision
[What we decided]

## Consequences
[Positive and negative consequences]
```

---

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](./0001-record-architecture-decisions.md) | Record Architecture Decisions | Accepted | 2025-01-XX |
| [0002](./0002-monorepo-structure.md) | Use Monorepo with pnpm Workspaces | Accepted | 2025-01-XX |
| [0003](./0003-code-first-distribution.md) | Code-First Distribution Model | Accepted | 2025-01-XX |
| [0004](./0004-ai-native-architecture.md) | AI-Native Architecture for Studio | Accepted | 2025-01-XX |
| [0005](./0005-domain-driven-design.md) | Domain-Driven Design for Studio | Accepted | 2025-01-XX |

---

## How to Add an ADR

1. Create new file: `docs/architecture/decisions/00XX-title.md`
2. Use next available number
3. Follow ADR format
4. Update this README with new ADR
5. Set status to "Proposed" initially

---

## Status Definitions

- **Proposed:** Decision is under consideration
- **Accepted:** Decision is final and implemented
- **Deprecated:** Decision is no longer valid
- **Superseded:** Decision replaced by another ADR

---

**Last Updated:** 2025-01-XX

