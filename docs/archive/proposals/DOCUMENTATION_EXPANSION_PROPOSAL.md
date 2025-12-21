# 📚 Propozycja Rozbudowy Struktury Dokumentacji

**Data:** 2025-01-XX  
**Status:** Propozycja

---

## 🎯 Analiza Obecnej Struktury

### ✅ Co już mamy (w folderach, ale nie zawsze w nawigacji)

1. **Get Started** (✅ w nawigacji)
   - Introduction
   - Setup
   - Examples
   - Studio
   - MCP Server
   - Changelog

2. **Foundations** (✅ w nawigacji)
   - Design Tokens
   - Theming
   - Dark Mode
   - Semantic Colors

3. **Components** (✅ w nawigacji)
   - 63+ components

4. **Blocks** (✅ w nawigacji)
   - Pre-built blocks

5. **Resources** (✅ w nawigacji)
   - API Reference
   - Examples
   - Migrations
   - Changelog

6. **Guides** (❌ NIE MA W NAWIGACJI, ale istnieją!)
   - CLI Usage
   - Design to Code
   - Enterprise Features
   - Figma Code Connect
   - VS Code Extension Usage

7. **Testing** (❌ NIE MA W NAWIGACJI, ale istnieją!)
   - Test Guide
   - Performance Tests
   - Visual Regression

8. **Tools** (❌ NIE MA W NAWIGACJI, ale istnieje!)
   - Component Playground
   - Theme Builder
   - Bundle Tracking
   - Component Comparison

---

## 🚨 Problemy do Naprawienia

### 1. **Brakujące sekcje w nawigacji**

**Guides** - istnieją, ale nie są w sidebarze:
- `/docs/guides/cli-usage`
- `/docs/guides/design-to-code`
- `/docs/guides/enterprise-features`
- `/docs/guides/figma-code-connect`
- `/docs/guides/vscode-extension-usage`

**Testing** - istnieją, ale nie są w sidebarze:
- `/docs/testing/test-guide`
- `/docs/testing/performance-tests`
- `/docs/testing/visual-regression`

**Tools** - istnieją, ale nie są w sidebarze:
- `/docs/tools/playground`
- `/docs/tools/theme-builder`
- `/docs/tools/bundle-tracking`
- `/docs/tools/component-comparison`

### 2. **Puste sekcje (tylko struktura)**

- **Changelog** - struktura jest, ale brak danych o wersjach
- **Migrations** - struktura jest, ale brak przewodników migracji

### 3. **Brakujące sekcje (z raportu)**

- Performance optimization guide
- Contributing guide
- Deployment guide
- Best practices / Patterns
- Accessibility guide

---

## 💡 Propozycja Nowej Struktury

### Rozbudowana nawigacja:

```
📖 Get Started
  ├─ Introduction
  ├─ Setup
  ├─ Examples
  ├─ Studio
  ├─ MCP Server
  └─ Changelog

🎨 Foundations
  ├─ Design Tokens
  ├─ Theming
  ├─ Dark Mode
  ├─ Semantic Colors
  └─ Spacing (już istnieje, ale nie w nawigacji!)

🧩 Components
  └─ [All 63+ components]

🧱 Blocks
  └─ [All blocks]

📚 Guides (NOWA SEKCJA W NAWIGACJI)
  ├─ CLI Usage
  ├─ Design to Code
  ├─ VS Code Extension
  ├─ Figma Code Connect
  ├─ Studio Guides
  │  ├─ UI-DSL v2 Reference
  │  ├─ Conversational Editing
  │  └─ Patch Operations
  ├─ Best Practices
  │  ├─ Performance Optimization
  │  ├─ Accessibility
  │  └─ Patterns & Recipes
  └─ Enterprise Features

✅ Testing (NOWA SEKCJA W NAWIGACJI)
  ├─ Test Guide
  ├─ Performance Tests
  └─ Visual Regression

🛠️ Tools (NOWA SEKCJA W NAWIGACJI)
  ├─ Component Playground
  ├─ Theme Builder
  ├─ Bundle Tracking
  └─ Component Comparison

📦 Resources
  ├─ API Reference
  ├─ Examples
  ├─ Migrations
  └─ Changelog

🚀 Enterprise
  └─ [Enterprise features]

➕ Contributing (NOWA SEKCJA)
  ├─ Getting Started
  ├─ Code of Conduct
  ├─ Development Setup
  └─ Pull Request Process
```

---

## 🎯 Konkretne Propozycje Dodania

### Priority 1: Dodaj istniejące do nawigacji

#### 1.1 Sekcja "Guides" w nawigacji

**Dodaj do sidebar-navigation.tsx:**

```typescript
{
  title: "Guides",
  items: [
    { title: "CLI Usage", href: "/docs/guides/cli-usage" },
    { title: "Design to Code", href: "/docs/guides/design-to-code" },
    { title: "VS Code Extension", href: "/docs/guides/vscode-extension-usage" },
    { title: "Figma Code Connect", href: "/docs/guides/figma-code-connect" },
    { title: "Enterprise Features", href: "/docs/guides/enterprise-features" },
  ],
}
```

#### 1.2 Sekcja "Testing" w nawigacji

**Dodaj do sidebar-navigation.tsx:**

```typescript
{
  title: "Testing",
  items: [
    { title: "Test Guide", href: "/docs/testing/test-guide" },
    { title: "Performance Tests", href: "/docs/testing/performance-tests" },
    { title: "Visual Regression", href: "/docs/testing/visual-regression" },
  ],
}
```

#### 1.3 Sekcja "Tools" w nawigacji

**Dodaj do sidebar-navigation.tsx:**

```typescript
{
  title: "Tools",
  items: [
    { title: "Component Playground", href: "/docs/tools/playground" },
    { title: "Theme Builder", href: "/docs/tools/theme-builder" },
    { title: "Bundle Tracking", href: "/docs/tools/bundle-tracking" },
    { title: "Component Comparison", href: "/docs/tools/component-comparison" },
  ],
}
```

#### 1.4 Dodaj "Spacing" do Foundations

`/docs/foundations/spacing` już istnieje, ale nie jest w nawigacji!

---

### Priority 2: Nowe sekcje w Guides

#### 2.1 Studio Guides

Utwórz nowe strony:

1. **`/docs/guides/studio/ui-dsl-v2`**
   - Pełna specyfikacja UI-DSL v2
   - Wszystkie typy węzłów
   - Przykłady struktur
   - Schema reference

2. **`/docs/guides/studio/conversational-editing`**
   - Jak działa conversational editing
   - Patch operations reference
   - Przykłady użycia
   - Best practices

3. **`/docs/guides/studio/patch-operations`**
   - Pełna lista operacji patch
   - Składnia i parametry
   - Przykłady dla każdej operacji
   - Inverse patches (undo)

#### 2.2 Best Practices

Utwórz nowe strony:

1. **`/docs/guides/best-practices/performance`**
   - Bundle size optimization
   - Code splitting
   - Lazy loading
   - Tree shaking tips

2. **`/docs/guides/best-practices/accessibility`**
   - A11y checklist
   - Keyboard navigation
   - Screen readers
   - ARIA patterns

3. **`/docs/guides/best-practices/patterns`**
   - Common patterns
   - Component composition
   - Layout patterns
   - Form patterns

---

### Priority 3: Nowe główne sekcje

#### 3.1 Contributing Section

Utwórz nową sekcję:

**`/docs/contributing/`**

1. **Getting Started** (`/docs/contributing/getting-started`)
   - Jak zacząć
   - Wymagania
   - Setup development environment

2. **Code of Conduct** (`/docs/contributing/code-of-conduct`)
   - Standardowy CoC

3. **Development Setup** (`/docs/contributing/development-setup`)
   - Monorepo structure
   - Running locally
   - Building
   - Testing

4. **Pull Request Process** (`/docs/contributing/pull-requests`)
   - PR guidelines
   - Review process
   - Commit conventions

5. **Adding Components** (`/docs/contributing/adding-components`)
   - Component standards
   - Testing requirements
   - Documentation requirements

#### 3.2 Deployment Guide

Utwórz nową stronę:

**`/docs/guides/deployment`**
- Production deployment
- Environment variables
- Build optimization
- CI/CD setup

---

## 📋 Plan Implementacji

### Faza 1: Napraw istniejące (1-2h)

1. ✅ Dodać "Guides" do nawigacji (5 istniejących)
2. ✅ Dodać "Testing" do nawigacji (3 istniejące)
3. ✅ Dodać "Tools" do nawigacji (4 istniejące)
4. ✅ Dodać "Spacing" do Foundations

**Wynik:** Użytkownicy znajdą istniejącą dokumentację!

---

### Faza 2: Studio Guides (2-3h)

1. ✅ Utworzyć `/docs/guides/studio/` folder
2. ✅ Utworzyć `ui-dsl-v2.md` z pełną specyfikacją
3. ✅ Utworzyć `conversational-editing.md`
4. ✅ Utworzyć `patch-operations.md`
5. ✅ Dodać do nawigacji pod "Guides"

**Wynik:** Kompletna dokumentacja Studio!

---

### Faza 3: Best Practices (2-3h)

1. ✅ Utworzyć `/docs/guides/best-practices/` folder
2. ✅ Utworzyć `performance.md`
3. ✅ Utworzyć `accessibility.md`
4. ✅ Utworzyć `patterns.md`
5. ✅ Dodać do nawigacji pod "Guides"

**Wynik:** Przewodniki best practices!

---

### Faza 4: Contributing (2-3h)

1. ✅ Utworzyć `/docs/contributing/` folder
2. ✅ Utworzyć `getting-started.md`
3. ✅ Utworzyć `development-setup.md`
4. ✅ Utworzyć `pull-requests.md`
5. ✅ Utworzyć `adding-components.md`
6. ✅ Dodać sekcję "Contributing" do nawigacji

**Wynik:** Łatwiejszy onboarding dla contributorów!

---

### Faza 5: Uzupełnienie pustych sekcji (1-2h)

1. ✅ Populacja Changelog (dodać wersje i zmiany)
2. ✅ Utworzyć przewodniki migracji (przynajmniej podstawowe)
3. ✅ Utworzyć deployment guide

**Wynik:** Kompletne Resources!

---

## 🎨 Sugerowana kolejność

### Najpierw (najważniejsze):

1. **Dodaj istniejące do nawigacji** ⚡ (1-2h)
   - Guides, Testing, Tools do sidebaru
   - Spacing do Foundations
   - **Efekt:** Użytkownicy znajdą dokumentację która już istnieje!

2. **Studio Guides** ⚡ (2-3h)
   - UI-DSL v2 reference
   - Conversational editing guide
   - Patch operations reference
   - **Efekt:** Kompletna dokumentacja Studio!

### Potem (warto):

3. **Best Practices** (2-3h)
   - Performance
   - Accessibility
   - Patterns

4. **Contributing** (2-3h)
   - Development setup
   - PR process
   - Component standards

### Na końcu (nice to have):

5. **Uzupełnienie pustych** (1-2h)
   - Changelog entries
   - Migration guides
   - Deployment guide

---

## 📊 Przewidywane korzyści

### Dla użytkowników:
- ✅ Znajdą istniejącą dokumentację (Guides, Testing, Tools)
- ✅ Kompletna dokumentacja Studio
- ✅ Przewodniki best practices
- ✅ Łatwiejszy onboarding

### Dla developerów:
- ✅ Contributing guide ułatwia współpracę
- ✅ Development setup guide
- ✅ Standards i requirements

### Dla projektu:
- ✅ Profesjonalna dokumentacja
- ✅ Lepszy onboarding
- ✅ Więcej contributorów
- ✅ Mniej pytań supportowych

---

## ✅ Rekomendacja

**Zacznij od Fazy 1** - dodaj istniejące sekcje do nawigacji (1-2h pracy).

To da natychmiastowy efekt - użytkownicy znajdą dokumentację która już istnieje, ale nie była widoczna w nawigacji.

**Potem Faza 2** - Studio Guides (2-3h), bo Studio to główna funkcja i zasługuje na kompletną dokumentację.

---

**Co sądzisz? Która faza jest najpilniejsza?**

