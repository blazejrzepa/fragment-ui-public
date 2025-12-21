# Fragment UI – OSS FAQ

## Why is Studio/Playground marked as experimental?

Studio/Playground includes AI workflows, code generation, and interactive builders that evolve quickly and may be unstable. External users should not depend on it to use the Design System.

---

## What is the "official public product"?

The official public product is the Design System:

- `@fragment_ui/ui`
- `@fragment_ui/tokens`
- optional `@fragment_ui/blocks`
- Docs portal (`apps/www`)
- optional registry for code-first installs

---

## Can I still use Studio?

Yes — if it's open in the repo, you can run it locally, but it may require optional env vars and it is not guaranteed stable.

---

## Do I need AI keys to use Fragment UI?

No. Using the component library and tokens should not require any AI keys. AI keys are only for experimental Copilot flows.

---

## How do releases work?

Public packages follow SemVer and are released via changesets. Experimental tooling may change faster.

---

## How do I contribute a component?

Open an issue (proposal), then implement with tests + docs + a11y baseline. See `CONTRIBUTING.md`.

---

## What's the difference between public and internal packages?

**Public packages** (`@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`):
- Follow SemVer
- Have quality gates (tests, docs, a11y)
- Are published to npm
- Are officially supported

**Internal packages** (Studio, MCP, patches, etc.):
- May change frequently
- Not published to npm
- Not officially supported
- May require special setup

---

## Can I use Fragment UI in production?

Yes, for the public Design System packages. We recommend:
- Using stable components (marked in docs)
- Following migration guides for updates
- Testing your integration

Studio/Playground should not be used in production environments.

---

## How do I report a bug?

For public DS packages: Open an issue with:
- Package name and version
- Steps to reproduce
- Expected vs actual behavior

For experimental tooling: Issues are welcome but may not be prioritized.

---

## How do I request a new component?

Open an issue describing:
- Use case and problem
- Target users
- Expected states/variants
- Accessibility requirements

See `CONTRIBUTING.md` for the full proposal process.

