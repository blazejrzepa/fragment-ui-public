# Public Design System Development Guidelines (Fragment UI)

This repository contains two different "worlds":

1. **The Public Design System** (what external users install and rely on)
2. **Internal / Experimental Tooling** (Studio, Playground, Copilot experiments)

To keep the project stable and trustworthy for external teams, we follow a **Public DS-first** approach.

---

## 1. What is Public vs Internal

### ✅ Public (Supported for external usage)

- `@fragment_ui/ui` – React component library
- `@fragment_ui/tokens` – design tokens (CSS variables / JSON)
- `@fragment_ui/blocks` – optional composable blocks / templates
- DS Registry (for code-first installation)
- `apps/www` – documentation portal

### 🧪 Internal / Experimental (Not guaranteed stable)

- Studio / Playground / Copilot / patch workflows
- MCP server, internal automation tools
- Any "prototype" packages

**Rule:** Internal tooling can depend on the Public DS, but the Public DS must never depend on internal tooling.

---

## 2. Public DS Contract (Quality Gate)

Every change to public packages must meet the following requirements:

### ✅ Quality

- Accessibility baseline (keyboard, roles, labels, focus states)
- Unit tests or integration tests for core behavior
- Visual sanity (Storybook or snapshots) where applicable

### ✅ Documentation

- Usage examples
- Props/API description
- States & edge cases documented (disabled/loading/error/empty)
- A11y notes (what we support and how)

### ✅ Stability

- Semantic versioning (SemVer)
- Changelog / release notes via changesets
- Clear migration notes for breaking changes

If any item is missing, the PR is not ready to merge.

---

## 3. Component Stability Levels

Every component in docs must declare a stability level:

- `experimental` – may change without migration guarantees
- `stable` – SemVer-backed, migration notes for breaking changes
- `deprecated` – includes a deprecation notice and planned removal version/date

---

## 4. Dependency Boundaries

### 4.1 No internal deps from public packages

Public packages (`@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`) must not import from:

- `apps/*`
- internal packages marked `private: true`
- Studio / Playground modules

### 4.2 Allowed direction

✅ `apps/demo-mvp` → `@fragment_ui/ui`  
❌ `@fragment_ui/ui` → `apps/demo-mvp`

We enforce this via lint rules and CI checks.

---

## 5. Contribution Workflow (Public DS)

### Step 1: Proposal

Open an issue describing:

- what problem the component solves
- target users / use cases
- expected variants and states

### Step 2: Build

- implement component
- add tests
- add documentation

### Step 3: Review

Focus on:

- API design (props shape, composition)
- accessibility
- token usage (no "raw" styling that bypasses tokens)
- backwards compatibility

### Step 4: Release

Add a changeset and publish via CI.

---

## 6. Studio & Playground Policy

Studio/Playground exists to accelerate exploration and demos.

It may contain unstable code and AI features.

**External users should not be required to run Studio to use the DS.**

---

## 7. Definition of Done (Public DS PR)

A PR touching public packages is done when:

- tests pass
- docs build passes
- a changeset exists (if behavior/API changed)
- A11y baseline is met
- an example is included

