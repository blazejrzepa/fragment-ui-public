# 🚀 Public Release Priorities - Fragment UI Design System

**Last Updated:** 2025-01-XX  
**Status:** Focused on Public DS publication readiness  
**Based on:** `OSS_PUBLIC_DS_GUIDELINES.md` + `CURRENT_PLANS_SUMMARY.md`

---

## 📋 PRIORYTETY (Kolejność wykonania)

### 1. 🎯 Milestone B: Public Packages Configuration (1-3 dni) ⭐ **NAJPIERW**

**Status:** 📋 DO ZROBIENIA  
**Priorytet:** P0 - Critical  
**Czas:** 16-24h (1-3 dni)

#### B1: Package.json Updates (4-6h)

**Oznaczenie pakietów jako private/public:**

✅ **Public (publishable):**
- `@fragment_ui/ui` - React component library
- `@fragment_ui/tokens` - design tokens
- `@fragment_ui/blocks` - composable blocks/templates

⚠️ **Private (internal only) - dodać `"private": true`:**
- `@fragment_ui/mcp-server`
- `@fragment_ui/patches`
- `@fragment_ui/plugin-system`
- `@fragment_ui/scaffolds`
- `@fragment_ui/studio-core`
- `@fragment_ui/telemetry`
- `@fragment_ui/ui-dsl`
- `@fragment_ui/blocks-recipes` (już ma `private: true` ✅)
- `@fragment_ui/registry` (jeśli internal)
- `@fragment_ui/utils` (jeśli internal)

**Publiczne pakiety - sprawdzić/uzupełnić:**

✅ `@fragment_ui/ui` - już ma:
- ✅ `exports` → `dist/*`
- ✅ `files` (dist, README.md)
- ✅ `repository`, `homepage`, `bugs`, `license`
- ⚠️ **BRAKUJE:** `peerDependencies` dla react/react-dom

✅ `@fragment_ui/tokens` - już ma:
- ✅ `exports`
- ✅ `files` (dist, README.md)
- ✅ `repository`, `homepage`, `bugs`, `license`
- ⚠️ **BRAKUJE:** `peerDependencies` (jeśli potrzebne)

✅ `@fragment_ui/blocks` - już ma:
- ✅ `exports` → `dist/*`
- ✅ `files` (dist, README.md)
- ✅ `repository`, `homepage`, `bugs`, `license`
- ⚠️ **BRAKUJE:** `peerDependencies` dla react/react-dom

**Zadania:**
- [ ] Dodać `"private": true` do wszystkich internal packages
- [ ] Dodać `peerDependencies` do `@fragment_ui/ui` i `@fragment_ui/blocks`
- [ ] Dodać `LICENSE` do `files` w publicznych pakietach (jeśli brakuje)
- [ ] Sprawdzić czy wszystkie publiczne pakiety mają `prepublishOnly` script

#### B2: Changesets Setup (4-6h)

**Zadania:**
- [ ] Install `@changesets/cli`: `pnpm add -D -w @changesets/cli`
- [ ] Create `.changeset/config.json`:
  ```json
  {
    "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
    "changelog": "@changesets/cli/changelog",
    "commit": false,
    "fixed": [],
    "linked": [],
    "access": "public",
    "baseBranch": "main",
    "updateInternalDependencies": "patch",
    "ignore": [
      "@fragment_ui/mcp-server",
      "@fragment_ui/patches",
      "@fragment_ui/plugin-system",
      "@fragment_ui/scaffolds",
      "@fragment_ui/studio-core",
      "@fragment_ui/telemetry",
      "@fragment_ui/ui-dsl",
      "@fragment_ui/blocks-recipes"
    ]
  }
  ```
- [ ] Add scripts to root `package.json`:
  ```json
  {
    "scripts": {
      "changeset": "changeset",
      "version": "changeset version",
      "release": "pnpm build && changeset publish"
    }
  }
  ```
- [ ] Create initial changeset (if needed)

#### B3: Dependency Boundaries Enforcement (4-6h)

**Zgodnie z `OSS_PUBLIC_DS_GUIDELINES.md` §4:**

**Zadania:**
- [ ] Update lint rule `tooling/lint/eslint-design-system-imports-only.js`:
  - Add check: public packages (`@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`) must not import from:
    - `apps/*`
    - internal packages marked `private: true`
    - Studio / Playground modules
- [ ] Add CI check (GitHub Actions):
  - Run lint check on public packages
  - Fail if public package imports from internal
- [ ] Test: verify `@fragment_ui/ui` doesn't import from `apps/*` or internal packages
- [ ] Test: verify `@fragment_ui/blocks` doesn't import from `apps/*` or internal packages

#### B4: Release Workflow (GitHub Actions) (4-6h)

**Zadania:**
- [ ] Create `.github/workflows/release.yml`:
  - Build all packages
  - Run minimal tests (unit tests for public packages)
  - Run dependency boundary checks
  - Publish to npm with `NPM_TOKEN` (only public packages)
  - Create GitHub release with changelog
- [ ] Setup NPM_TOKEN secret in GitHub
- [ ] Test workflow (dry-run)

---

### 2. 🎯 Milestone C: Release + Docs (1-3 dni)

**Status:** 📋 PLANOWANE  
**Priorytet:** P0 - Critical  
**Czas:** 16-24h (1-3 dni)

#### C1: Public Docs Portal Deployment (4-6h)

**Zadania:**
- [ ] Deploy `apps/www` to Vercel/Netlify
- [ ] Setup custom domain (if needed)
- [ ] Verify all public routes work
- [ ] Add link to docs in public packages README

#### C2: Registry Hosting (4-6h)

**Zadania:**
- [ ] Setup registry hosting (GH Pages or Vercel static)
- [ ] Ensure registry.json is accessible publicly
- [ ] Add registry endpoint to docs
- [ ] Test code-first installation flow

#### C3: Examples Directory (4-6h)

**Zadania:**
- [ ] Create `examples/nextjs-dashboard`:
  - Full Next.js app using `@fragment_ui/ui` + `@fragment_ui/blocks`
  - Shows real-world usage patterns
  - README with setup instructions
- [ ] Create `examples/saas-settings`:
  - SaaS settings page using blocks
  - Shows forms, data tables, navigation
  - README with setup instructions
- [ ] Link examples from main README

#### C4: Getting Started Guide (4-6h)

**Zadania:**
- [ ] Create "Getting Started" guide (10-min happy path):
  - Installation (`pnpm add @fragment_ui/ui @fragment_ui/tokens`)
  - Basic usage (import Button, add to page)
  - Using blocks (import from `@fragment_ui/blocks`)
  - Link to full docs
- [ ] Add to `apps/www` homepage
- [ ] Add to root README

---

### 3. 🎯 Public DS Contract Enforcement (CI) (2-3 dni)

**Status:** 📋 PLANOWANE  
**Priorytet:** P0 - Critical  
**Czas:** 16-24h (2-3 dni)

**Zgodnie z `OSS_PUBLIC_DS_GUIDELINES.md` §2 (Public DS Contract):**

#### C5: Quality Gate Checks (6-8h)

**Zadania:**
- [ ] Add CI check for Public DS Contract:
  - **Quality:**
    - Accessibility baseline (keyboard, roles, labels, focus states)
    - Unit tests or integration tests for core behavior
    - Visual sanity (Storybook or snapshots) where applicable
  - **Documentation:**
    - Usage examples
    - Props/API description
    - States & edge cases documented (disabled/loading/error/empty)
    - A11y notes
  - **Stability:**
    - Semantic versioning (SemVer) - enforced via Changesets
    - Changelog / release notes via changesets
    - Clear migration notes for breaking changes
- [ ] Create PR check script: `scripts/check-public-ds-contract.mjs`
- [ ] Add to GitHub Actions: run on PRs touching public packages
- [ ] Fail PR if any requirement missing

#### C6: Component Stability Levels (4-6h)

**Zgodnie z `OSS_PUBLIC_DS_GUIDELINES.md` §3:**

**Zadania:**
- [ ] Add stability level to component docs:
  - `experimental` – may change without migration guarantees
  - `stable` – SemVer-backed, migration notes for breaking changes
  - `deprecated` – includes deprecation notice and planned removal version/date
- [ ] Update component registry to include `stability` field
- [ ] Add stability badge to component docs in `apps/www`
- [ ] Document stability levels in main docs

#### C7: Definition of Done Enforcement (4-6h)

**Zgodnie z `OSS_PUBLIC_DS_GUIDELINES.md` §7:**

**Zadania:**
- [ ] Add PR check: "Definition of Done" for public packages:
  - [ ] tests pass
  - [ ] docs build passes
  - [ ] a changeset exists (if behavior/API changed)
  - [ ] A11y baseline is met
  - [ ] an example is included
- [ ] Create PR template checklist for public packages
- [ ] Add to GitHub Actions: fail if checklist incomplete

---

### 4. 🎯 Blocks & Templates Library Expansion (4-6 tygodni)

**Status:** 📋 PLANOWANE  
**Priorytet:** P0 - Strategic (Public DS adoption)  
**Czas:** 160-240h (4-6 tygodni)

**Szczegóły:** Zobacz `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`

#### Obecny stan:
- ✅ ~20 bloków już istnieje (`dashboard-layout`, `kpi-dashboard`, `data-table`, `navigation-header`, `settings-screen`, etc.)
- ❌ Brakuje 18 P0 bloków (AppShell, TopNav, BreadcrumbHeader, KpiStrip, ChartCard, DataTableToolbar, BulkActionsBar, PaginationFooter, SettingsSection, ProfileForm, BillingForm, Auth blocks, EmptyState, etc.)
- ❌ Brakuje 6-10 szablonów (DashboardTemplate, UsersListTemplate, SettingsTemplate, AuthLoginTemplate, etc.)
- ❌ Brakuje 1 przykład aplikacji (`examples/ecommerce-admin` - `saas-settings` już istnieje)
- ❌ Brakuje dokumentacji bloków i szablonów w portalu

#### Sprint 1 (P0 foundation) - 40-60h
- [ ] Utworzyć strukturę `packages/blocks/src/templates/`
- [ ] Harvest shadcn blocks do `packages/blocks`
- [ ] Zaimplementować `AppShell`, `KpiStrip`, `EmptyState`
- [ ] Dodać `DashboardTemplate` + strony dokumentacji

#### Sprint 2 (Enterprise usability) - 40-60h
- [ ] Zaimplementować `DataTable` + `DataTableToolbar` + `PaginationFooter`
- [ ] Dodać `UsersListTemplate`, `SettingsTemplate`
- [ ] Dodać strony dokumentacji dla table blocks/templates

#### Sprint 3 (Auth + examples) - 40-60h
- [ ] Auth blocks/templates (login/signup/otp/reset)
- [ ] Zaimplementować `examples/saas-admin` (lub ulepszyć istniejący)
- [ ] Poprawić dokumentację "Quickstart"

#### Sprint 4 (Commerce + second example) - 40-60h
- [ ] Commerce blocks/templates
- [ ] Zaimplementować `examples/ecommerce-admin`
- [ ] Stabilizacja API bloków + testy baseline

#### Definition of Done:
- [ ] Co najmniej **20 bloków** (obecnie ~20, trzeba dodać brakujące P0)
- [ ] Co najmniej **6 szablonów**
- [ ] Co najmniej **2 przykładowe aplikacje** działają z czystego klona
- [ ] Dokumentacja bloków i szablonów w portalu
- [ ] Registry zawiera bloki i szablony

---

### 5. 🎯 Design System Maturity - Foundation (Level 1-2) (2-3 tygodnie)

**Status:** 📋 PLANOWANE (można równolegle z Milestone B-C)  
**Priorytet:** P1 - Foundation  
**Czas:** 86-116h (2-3 tygodnie)

**Szczegóły:** Zobacz `docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md` - Iteration 5

#### EPIC L: UI Kit Foundation (44-60h)
- Token structure enhancement
- UI-Native component completion
- Styleguide DSL instances
- PreviewLayout component

#### EPIC M: Design Library (42-56h)
- Component Registry enhancement (status, version tracking)
- UX Patterns documentation
- Telemetry integration
- UX Guidelines documentation

---

## 📊 PRIORYTETOWA KOLEJNOŚĆ (Timeline)

### Tydzień 1: Milestone B (Public Packages) ✅ UKOŃCZONE
**Dzień 1-2:**
- ✅ B1: Package.json updates (private flags, peerDependencies)
- ✅ B2: Changesets setup

**Dzień 3:**
- ✅ B3: Dependency boundaries enforcement
- ✅ B4: Release workflow (GitHub Actions)

### Tydzień 2: Milestone C + Contract Enforcement ✅ UKOŃCZONE
**Dzień 1-2:**
- ✅ C1: Public docs portal deployment
- ✅ C2: Registry hosting

**Dzień 3-4:**
- ✅ C3: Examples directory
- ✅ C4: Getting Started guide

**Dzień 5:**
- ✅ C5: Quality Gate Checks (CI)
- ✅ C6: Component Stability Levels (infrastruktura)
- ✅ C7: Definition of Done Enforcement

### Tydzień 3: Aktualizacja Komponentów - Stability Levels ⭐⭐⭐ **NAJPIERW**
**Dzień 1-2:**
- Oznaczenie wszystkich 87 komponentów w registry (stability levels)
- Kategoryzacja: stable/experimental/deprecated

**Dzień 3:**
- Dodanie StabilityBadge do wszystkich 87 stron dokumentacji
- Weryfikacja wyświetlania badge'ów

### Tydzień 4-9: Blocks & Templates Library Expansion ⭐⭐ **DRUGIE**
**Tydzień 4-5:**
- Sprint 1: P0 foundation (AppShell, KpiStrip, EmptyState, DashboardTemplate)
- Sprint 2: Enterprise usability (DataTable, DataTableToolbar, UsersListTemplate, SettingsTemplate)

**Tydzień 6-7:**
- Sprint 3: Auth + examples (Auth blocks/templates, examples/saas-admin)
- Sprint 4: Commerce + second example (Commerce blocks, examples/ecommerce-admin)

**Tydzień 8-9:**
- Dokumentacja bloków i szablonów w portalu
- Registry update (bloki i szablony)
- Stabilizacja API + testy

### Tydzień 10: Release ⭐
**Dzień 1:**
- Pierwszy Release (changeset, npm publish)

**Dzień 2:**
- Deployment do produkcji, weryfikacja

### Tydzień 11-13: Design System Maturity Level 1-2 (opcjonalnie)
**Równolegle z Release (jeśli czas pozwala):**
- EPIC L: UI Kit Foundation
- EPIC M: Design Library

---

## ✅ DEFINICJA "DONE" DLA PUBLIKACJI

### Milestone B - Done gdy:
- ✅ Wszystkie internal packages mają `"private": true`
- ✅ Publiczne pakiety mają `peerDependencies` dla react/react-dom
- ✅ Changesets działa (`pnpm changeset` tworzy changeset)
- ✅ Release workflow działa (GitHub Actions publikuje do npm)
- ✅ Dependency boundaries enforced (lint + CI)

### Milestone C - Done gdy:
- ✅ Docs portal dostępny publicznie
- ✅ Registry hosting działa
- ✅ Examples działają (2 przykłady)
- ✅ Getting Started guide dostępny

### Public DS Contract - Done gdy:
- ✅ CI sprawdza Quality Gate (Quality, Documentation, Stability)
- ✅ Component stability levels w dokumentacji
- ✅ Definition of Done enforced w PR checks

---

## 🔗 KLUCZOWE DOKUMENTY

- `docs/OSS_PUBLIC_DS_GUIDELINES.md` - Wytyczne Public DS (główny dokument)
- `docs/PUBLIC_DS_RELEASE_SCOPE.md` - Co jest oficjalnie wspierane
- `docs/OSS_FAQ.md` - FAQ dla użytkowników open-source
- `CURRENT_PLANS_SUMMARY.md` - Ogólne plany projektu

---

## 📝 NOTATKI

- **Copilot Stabilization wstrzymane** - skupiamy się na publikacji DS
- **Public DS-first approach** - external users nie potrzebują Studio
- **Dependency boundaries** - public packages NIE mogą importować z internal
- **Quality Gate** - każda zmiana w public packages musi spełniać kontrakt

---

**Następny krok:** Rozpoczęcie Milestone B1 (Package.json updates)

