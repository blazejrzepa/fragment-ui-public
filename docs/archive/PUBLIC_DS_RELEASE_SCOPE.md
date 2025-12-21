# Public Release Scope (Fragment UI)

This document defines what we officially support for external usage.

---

## ✅ Supported Public Surface

### Packages

- `@fragment_ui/ui`
- `@fragment_ui/tokens`
- `@fragment_ui/blocks` (optional)

### Documentation

- `apps/www` (public docs portal)

### Registry (optional but recommended)

- a public registry endpoint (for code-first installs)
- stable component metadata

---

## 🧪 Experimental / Internal

The following are not part of the official public release and may be unstable:

- Studio / Playground
- Copilot features (DSL generation, patch operations)
- MCP server or internal automation
- internal developer tooling

We may publish these as open-source eventually, but they are not guaranteed stable.

---

## Versioning Policy

- Public DS follows SemVer
- Experimental tooling can move faster and may not follow SemVer guarantees

---

## Support Expectations

We aim to:

- keep public components stable
- document changes
- ship migration notes for breaking changes

We do not guarantee:

- stability of internal tooling
- stability of AI-generated outputs

