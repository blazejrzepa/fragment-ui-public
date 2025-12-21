# ADR-0002: Use Monorepo with pnpm Workspaces

**Status:** Accepted  
**Date:** 2025-01-XX  
**Deciders:** Architecture Team

---

## Context

Fragment UI consists of multiple packages (UI components, blocks, tokens, CLI, etc.) and applications (Portal, Studio). We need to decide on repository structure.

**Options:**
1. Monorepo (single repository)
2. Multi-repo (separate repositories)
3. Polyrepo (hybrid approach)

---

## Decision

We will use a **monorepo** with **pnpm workspaces** and **Turborepo** for task orchestration.

**Rationale:**
- Atomic changes across packages
- Shared tooling and configuration
- Easier dependency management
- Better developer experience

---

## Consequences

### Positive
- Single source of truth
- Atomic commits across packages
- Shared TypeScript config
- Centralized CI/CD

### Negative
- Larger repository size
- More complex build system
- Requires discipline for package boundaries

---

## Implementation

- `pnpm-workspace.yaml` defines workspace packages
- `turbo.json` configures Turborepo tasks
- Packages in `packages/`, apps in `apps/`

---

**See Also:** [Monorepo Structure](../monorepo-structure.md)

