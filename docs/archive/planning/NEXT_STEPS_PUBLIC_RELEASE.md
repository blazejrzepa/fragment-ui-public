# 🚀 Następne Kroki - Public Release

**Data:** 2025-01-XX  
**Status:** Milestone B i C ukończone ✅

---

## ✅ Co zostało ukończone

### Milestone B: Public Packages Configuration ✅
- ✅ Package.json updates (private flags, peerDependencies)
- ✅ Changesets setup (config naprawiony)
- ✅ Dependency boundaries enforcement
- ✅ Release workflow (GitHub Actions)

### Milestone C: Release + Docs ✅
- ✅ Public Docs Portal Deployment (Vercel)
- ✅ Registry Hosting (Vercel static)
- ✅ Examples Directory (nextjs-dashboard, saas-settings)
- ✅ Getting Started Guide

### Public DS Contract Enforcement ✅
- ✅ Quality Gate Checks (CI)
- ✅ Component Stability Levels
- ✅ Definition of Done Enforcement

---

## 🎯 Następne kroki (kolejność wykonania)

### 1. Aktualizacja Komponentów - Stability Levels (2-3 dni) ⭐⭐⭐ **NAJPIERW**

**Priorytet:** P0 - Critical (część C6)  
**Czas:** 16-24h (2-3 dni)

**Status:** Infrastruktura gotowa, ale komponenty nie są oznaczone

#### Zadania:

1. **Oznaczyć wszystkie komponenty w registry:**
   - 87 komponentów w registry, żaden nie ma `stability`
   - Dodać `stability: "stable"` dla dojrzałych komponentów
   - Dodać `stability: "experimental"` dla nowych/eksperymentalnych
   - Dodać `stability: "deprecated"` dla przestarzałych (jeśli są)

2. **Dodać StabilityBadge do wszystkich stron dokumentacji:**
   - 87 stron komponentów (`apps/www/app/docs/components/*/page.tsx`)
   - Tylko Button ma badge (jako przykład)
   - Dodać badge do pozostałych 86 stron
   - Pobrać stability z registry lub ustawić domyślnie

3. **Kategoryzacja komponentów:**
   - **Stable:** Podstawowe komponenty (Button, Input, Card, Dialog, etc.)
   - **Experimental:** Nowe komponenty, które mogą się zmienić
   - **Deprecated:** Komponenty planowane do usunięcia (jeśli są)

#### Przykład implementacji:

```typescript
// W registry.json
{
  "button": {
    "stability": "stable",
    ...
  },
  "new-component": {
    "stability": "experimental",
    ...
  }
}

// W page.tsx
import { StabilityBadge } from "../../../../src/components/stability-badge";
import { getComponentInfo } from "@/lib/registry";

export default function ComponentPage() {
  const componentInfo = getComponentInfo("component-name");
  return (
    <div>
      <h1>Component Name</h1>
      <StabilityBadge stability={componentInfo?.stability || "stable"} />
      ...
    </div>
  );
}
```

---

### 2. Blocks & Templates Library Expansion (4-6 tygodni) ⭐⭐ **DRUGIE**

**Priorytet:** P0 - Strategic (Public DS adoption)  
**Czas:** 160-240h (4-6 tygodni)

**Status:** Plan istnieje, ale nie jest w priorytetach  
**Plan:** `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`

#### Obecny stan:

**Bloki (obecnie ~20):**
- ✅ `dashboard-layout`, `kpi-dashboard`, `analytics-dashboard`
- ✅ `data-table`, `card-grid`, `form-container`
- ✅ `navigation-header`, `settings-screen`, `pricing-table`
- ✅ `authentication-block`, `widget-container`
- ✅ I inne...

**Brakuje:**
- ❌ 18 P0 bloków (AppShell, TopNav, BreadcrumbHeader, KpiStrip, ChartCard, DataTableToolbar, BulkActionsBar, PaginationFooter, SettingsSection, ProfileForm, BillingForm, Auth blocks, EmptyState, etc.)
- ❌ 6-10 szablonów (DashboardTemplate, UsersListTemplate, SettingsTemplate, AuthLoginTemplate, etc.)
- ❌ 1 przykład aplikacji (`examples/ecommerce-admin` - `saas-settings` już istnieje)
- ❌ Dokumentacja bloków i szablonów w portalu

#### Zadania (wg planu):

**Sprint 1 (P0 foundation):**
- [ ] Utworzyć strukturę `packages/blocks/src/templates/`
- [ ] Harvest shadcn blocks do `packages/blocks`
- [ ] Zaimplementować `AppShell`, `KpiStrip`, `EmptyState`
- [ ] Dodać `DashboardTemplate` + strony dokumentacji

**Sprint 2 (Enterprise usability):**
- [ ] Zaimplementować `DataTable` + `DataTableToolbar` + `PaginationFooter`
- [ ] Dodać `UsersListTemplate`, `SettingsTemplate`
- [ ] Dodać strony dokumentacji dla table blocks/templates

**Sprint 3 (Auth + examples):**
- [ ] Auth blocks/templates (login/signup/otp/reset)
- [ ] Zaimplementować `examples/saas-admin` (lub ulepszyć istniejący)
- [ ] Poprawić dokumentację "Quickstart"

**Sprint 4 (Commerce + second example):**
- [ ] Commerce blocks/templates
- [ ] Zaimplementować `examples/ecommerce-admin`
- [ ] Stabilizacja API bloków + testy baseline

**Dokumentacja:**
- [ ] Dodać sekcje "Blocks" i "Templates" w portalu
- [ ] Strona dla każdego bloku (props, examples, a11y)
- [ ] Strona dla każdego szablonu (use case, customization)

**Registry:**
- [ ] Zaktualizować registry o bloki i szablony
- [ ] Dodać entrypoints dla instalacji

#### Definition of Done:
- [ ] Co najmniej **20 bloków** (obecnie ~20, trzeba dodać brakujące P0)
- [ ] Co najmniej **6 szablonów**
- [ ] Co najmniej **2 przykładowe aplikacje** działają z czystego klona
- [ ] Dokumentacja bloków i szablonów w portalu
- [ ] Registry zawiera bloki i szablony

**Szczegóły:** Zobacz `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`

---

### 3. Pierwszy Release (1-2 dni) ⭐

**Priorytet:** P0 - Critical  
**Czas:** 4-8h

#### Zadania:

1. **Utworzyć pierwszy changeset:**
   ```bash
   pnpm changeset add
   ```
   - Wybrać pakiety: `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`
   - Wybrać typ: `major` (pierwszy release)
   - Opisać zmiany

2. **Sprawdzić czy wszystko gotowe:**
   ```bash
   # Build
   pnpm build
   
   # Testy
   pnpm test:ui
   
   # Dependency boundaries
   pnpm check:public-ds-boundaries
   
   # Public DS Contract
   pnpm check:public-ds-contract
   ```

3. **Przygotować NPM_TOKEN:**
   - Dodać secret `NPM_TOKEN` w GitHub Settings → Secrets
   - Token z npmjs.com z uprawnieniami do publish

4. **Uruchomić release workflow:**
   - Opcja A: Automatycznie przez push do main (jeśli changeset istnieje)
   - Opcja B: Manualnie przez GitHub Actions → "Run workflow"

5. **Weryfikacja:**
   - Sprawdzić czy pakiety są dostępne na npmjs.com
   - Sprawdzić czy changelog został wygenerowany
   - Sprawdzić czy GitHub release został utworzony

---

### 5. Deployment do Produkcji (1 dzień) ⭐

**Priorytet:** P0 - Critical  
**Czas:** 2-4h

#### Zadania:

1. **Deploy docs portal:**
   - Sprawdzić czy `apps/www` jest już na Vercel
   - Jeśli nie, dodać projekt do Vercel
   - Skonfigurować custom domain (jeśli potrzebne)

2. **Weryfikacja registry:**
   - Sprawdzić czy registry URLs działają:
     - `https://fragment-ui.dev/r/button.json`
     - `https://fragment-ui-www.vercel.app/r/button.json`
   - Przetestować instalację:
     ```bash
     npx shadcn@latest add https://fragment-ui.dev/r/button.json
     ```

3. **Test examples:**
   - Sprawdzić czy examples działają
   - Zaktualizować linki jeśli potrzebne

---

### 4. Deployment do Produkcji (1 dzień) ⭐

**Priorytet:** P0 - Strategic (Public DS adoption)  
**Czas:** 160-240h (4-6 tygodni)

**Status:** Plan istnieje, ale nie jest w priorytetach  
**Plan:** `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`

#### Obecny stan:

**Bloki (obecnie ~20):**
- ✅ `dashboard-layout`, `kpi-dashboard`, `analytics-dashboard`
- ✅ `data-table`, `card-grid`, `form-container`
- ✅ `navigation-header`, `settings-screen`, `pricing-table`
- ✅ `authentication-block`, `widget-container`
- ✅ I inne...

**Brakuje:**
- ❌ 18 P0 bloków (AppShell, TopNav, BreadcrumbHeader, KpiStrip, ChartCard, DataTableToolbar, BulkActionsBar, PaginationFooter, SettingsSection, ProfileForm, BillingForm, Auth blocks, EmptyState, etc.)
- ❌ 6-10 szablonów (DashboardTemplate, UsersListTemplate, SettingsTemplate, AuthLoginTemplate, etc.)
- ❌ 1 przykład aplikacji (`examples/ecommerce-admin` - `saas-settings` już istnieje)
- ❌ Dokumentacja bloków i szablonów w portalu

#### Zadania (wg planu):

**Sprint 1 (P0 foundation):**
- [ ] Utworzyć strukturę `packages/blocks/src/templates/`
- [ ] Harvest shadcn blocks do `packages/blocks`
- [ ] Zaimplementować `AppShell`, `KpiStrip`, `EmptyState`
- [ ] Dodać `DashboardTemplate` + strony dokumentacji

**Sprint 2 (Enterprise usability):**
- [ ] Zaimplementować `DataTable` + `DataTableToolbar` + `PaginationFooter`
- [ ] Dodać `UsersListTemplate`, `SettingsTemplate`
- [ ] Dodać strony dokumentacji dla table blocks/templates

**Sprint 3 (Auth + examples):**
- [ ] Auth blocks/templates (login/signup/otp/reset)
- [ ] Zaimplementować `examples/saas-admin` (lub ulepszyć istniejący)
- [ ] Poprawić dokumentację "Quickstart"

**Sprint 4 (Commerce + second example):**
- [ ] Commerce blocks/templates
- [ ] Zaimplementować `examples/ecommerce-admin`
- [ ] Stabilizacja API bloków + testy baseline

**Dokumentacja:**
- [ ] Dodać sekcje "Blocks" i "Templates" w portalu
- [ ] Strona dla każdego bloku (props, examples, a11y)
- [ ] Strona dla każdego szablonu (use case, customization)

**Registry:**
- [ ] Zaktualizować registry o bloki i szablony
- [ ] Dodać entrypoints dla instalacji

#### Definition of Done:
- [ ] Co najmniej **20 bloków** (obecnie ~20, trzeba dodać brakujące P0)
- [ ] Co najmniej **6 szablonów**
- [ ] Co najmniej **2 przykładowe aplikacje** działają z czystego klona
- [ ] Dokumentacja bloków i szablonów w portalu
- [ ] Registry zawiera bloki i szablony

**Szczegóły:** Zobacz `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`

---

### 6. Dokumentacja Release (opcjonalnie, 2-4h)

**Priorytet:** P1  
**Czas:** 2-4h

#### Zadania:

1. **Aktualizować dokumentację:**
   - Dodać informację o pierwszym release
   - Zaktualizować wersje w dokumentacji
   - Dodać migration guide (jeśli breaking changes)

2. **Blog post / Announcement (opcjonalnie):**
   - Napisać post o pierwszym publicznym release
   - Opublikować na GitHub Discussions / Twitter / LinkedIn

---

### 7. Design System Maturity - Foundation (opcjonalnie, 2-3 tygodnie)

**Priorytet:** P1 - Foundation  
**Czas:** 86-116h (2-3 tygodnie)

**Status:** Można równolegle z release

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

**Szczegóły:** Zobacz `docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md` - Iteration 5

---

## 📊 Timeline

### Tydzień 1: Aktualizacja Komponentów
- **Dzień 1-2:** Oznaczenie wszystkich komponentów w registry (stability levels)
- **Dzień 3:** Dodanie StabilityBadge do wszystkich stron dokumentacji

### Tydzień 2-7: Blocks & Templates Library Expansion
- **Tydzień 2-3:** Sprint 1-2 (P0 foundation + Enterprise usability)
- **Tydzień 4-5:** Sprint 3-4 (Auth + Commerce + Examples)
- **Tydzień 6-7:** Dokumentacja + Registry + Stabilizacja

### Tydzień 8: Release
- **Dzień 1:** Pierwszy Release (changeset, npm publish)
- **Dzień 2:** Deployment do produkcji, weryfikacja

### Tydzień 9-11: Design System Maturity (opcjonalnie)
- EPIC L: UI Kit Foundation
- EPIC M: Design Library

---

## ✅ Checklist przed pierwszym release

- [ ] Changeset utworzony
- [ ] Build przechodzi (`pnpm build`)
- [ ] Testy przechodzą (`pnpm test:ui`)
- [ ] Dependency boundaries OK (`pnpm check:public-ds-boundaries`)
- [ ] Public DS Contract OK (`pnpm check:public-ds-contract`)
- [ ] NPM_TOKEN dodany w GitHub Secrets
- [ ] Release workflow przetestowany (dry-run lub manual)
- [ ] README w publicznych pakietach zaktualizowany
- [ ] LICENSE w publicznych pakietach

## ✅ Checklist dla Aktualizacji Komponentów

- [ ] Wszystkie 87 komponentów mają `stability` w registry
- [ ] Wszystkie 87 stron dokumentacji mają StabilityBadge
- [ ] Kategoryzacja komponentów (stable/experimental/deprecated)
- [ ] Dokumentacja stability levels zaktualizowana
- [ ] Test: sprawdzić czy badge'y wyświetlają się poprawnie

---

## 🔗 Kluczowe dokumenty

- `docs/PUBLIC_RELEASE_PRIORITIES.md` - Główny plan
- `docs/OSS_PUBLIC_DS_GUIDELINES.md` - Wytyczne Public DS
- `docs/MILESTONE_C_COMPLETE.md` - Status ukończenia
- `.changeset/config.json` - Konfiguracja Changesets
- `.github/workflows/release.yml` - Release workflow

---

## 📝 Notatki

- **Changesets config naprawiony** - dodano `fragment-www` i `fragment-demo` do ignore
- **Wszystkie milestone B i C ukończone** - gotowe do release
- **Public DS Contract enforced** - CI sprawdza jakość
- **Registry działa** - dostępny przez Vercel
- **Blocks & Templates plan istnieje** - `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md` ale nie jest w priorytetach
- **Obecnie ~20 bloków** - trzeba dodać 18 P0 bloków + 6-10 szablonów + 1 przykład aplikacji

---

## 🎯 Priorytetyzacja zadań

### Najpierw (P0 - Critical):
1. **Aktualizacja Komponentów** (2-3 dni) - stability levels ⭐⭐⭐
2. **Blocks & Templates Library** (4-6 tygodni) - Public DS adoption ⭐⭐
3. **Pierwszy Release** (1-2 dni) - publikacja do npm ⭐
4. **Deployment do Produkcji** (1 dzień) - weryfikacja ⭐

### Opcjonalnie (P1):
5. **Dokumentacja Release** (2-4h)
6. **Design System Maturity** (2-3 tygodnie)

---

**Następny krok:** Utworzyć pierwszy changeset i przygotować release 🚀

