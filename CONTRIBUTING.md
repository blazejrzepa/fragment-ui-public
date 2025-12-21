# Contributing to Fragment UI

Thanks for your interest in contributing! This repo contains both a **public Design System** and **internal/experimental tooling**. Please read the guidelines below to keep the project stable for external users.

---

## 1) What we accept

### ✅ Public Design System contributions (supported)

- New components or improvements in `@fragment_ui/ui`
- Token updates in `@fragment_ui/tokens`
- Blocks/templates in `@fragment_ui/blocks`
- Documentation improvements in `apps/www`
- Bug fixes, performance improvements, a11y fixes

### 🧪 Internal / experimental contributions

- Studio/Playground/Copilot features are welcome, but may evolve quickly
- These changes are not part of the "official public product" unless explicitly promoted later

---

## 2) Ground rules (Public DS Contract)

If your PR touches any public DS package (`@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`), it must include:

- **Accessibility baseline** (keyboard navigation, focus, roles/labels)
- **Tests** (unit/integration for core behavior)
- **Docs** (usage example + states/edge cases)
- **Token usage** (avoid hardcoded styles without justification)
- **SemVer awareness** + changeset when needed

If any of the above is missing, reviewers will request changes.

**See:** [Public DS Development Guidelines](docs/OSS_PUBLIC_DS_GUIDELINES.md) for detailed requirements.

---

## 3) How to propose a new component

Before implementing, open an issue describing:

- the problem and use cases
- which teams/users benefit
- expected states (default, hover, focus, disabled, loading, error, empty)
- any accessibility requirements
- existing references (Material/Polaris/Lightning/Carbon/Atlassian) if helpful

---

## 4) Local setup

### Install

```bash
pnpm install
```

### Run docs (public portal)

```bash
pnpm --filter www dev
```

### Run component tests

```bash
pnpm test
```

### Run lint

```bash
pnpm lint
```

**Note:** Studio/Playground may require optional env vars (AI keys). Public DS does not.

---

## 5) Changesets (releases)

We use changesets for versioning public packages.

If your change affects public behavior or API:

1. Add a changeset:
   ```bash
   pnpm changeset
   ```
2. Pick package(s) and write a short summary

---

## 6) Pull Request checklist

Please fill the PR template. For DS changes, include:

- screenshots or Storybook link if relevant
- notes about A11y
- migration notes if this is breaking

---

## 7) Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 8) More information

- [Public DS Development Guidelines](docs/OSS_PUBLIC_DS_GUIDELINES.md) - Detailed quality gates
- [Public Release Scope](docs/PUBLIC_SCOPE.md) - What's officially supported
- [OSS FAQ](docs/OSS_FAQ.md) - Common questions about open-source usage

