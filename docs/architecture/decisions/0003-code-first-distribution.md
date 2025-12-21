# ADR-0003: Code-First Distribution Model

**Status:** Accepted  
**Date:** 2025-01-XX  
**Deciders:** Architecture Team

---

## Context

We need to decide how to distribute Fragment UI components to users.

**Options:**
1. NPM package (traditional)
2. Code-first registry (shadcn-style)
3. Hybrid approach

---

## Decision

We will use a **code-first distribution model** via registry JSON files, similar to shadcn/ui.

**Rationale:**
- Users own the code (can customize)
- No version conflicts
- Better for AI-assisted development
- Aligns with Fragment UI philosophy

---

## Consequences

### Positive
- Users can customize components
- No dependency version conflicts
- Better for enterprise use
- AI can modify code directly

### Negative
- Users must manage updates manually
- No automatic security patches
- Requires migration tooling

---

## Implementation

- Registry JSON files at `/r/{component}.json`
- CLI tool (`@fragment_ui/cli`) for installation
- Migration assistant for updates

---

**See Also:** [Registry Format](../../reference/registry-format.md)

