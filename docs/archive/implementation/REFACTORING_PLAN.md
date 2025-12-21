# 🔧 Plan Refaktoringu - Analiza Dużych Plików

**Data:** 2025-01-XX  
**Cel:** Zidentyfikowanie i optymalizacja dużych plików dla lepszej efektywności rozwoju

---

## 📊 Największe Pliki w Projekcie

| Plik | Linie | Priorytet | Status |
|------|-------|-----------|--------|
| `apps/demo/app/studio/page.tsx` | **4989** | 🔴 P0 | Wymaga refaktoringu |
| `apps/demo/app/api/generate/route.ts` | **2937** | 🔴 P0 | ✅ Ukończone (2170 linii, -26%) |
| `apps/demo/app/studio/dsl/generator.ts` | **2025** | 🟡 P1 | ✅ Ukończone (15 linii, -99.3%) |
| `apps/demo/src/components/playground/components-gallery.tsx` | **1729** | 🟡 P1 | Wymaga refaktoringu |
| `apps/demo/app/api/tests/run/route.ts` | **1538** | 🟡 P1 | Wymaga refaktoringu |
| `apps/demo/src/components/playground/playground-left-sidebar.tsx` | **1235** | 🟢 P2 | Opcjonalny |
| `apps/demo/src/lib/dsl-codegen.ts` | **1057** | 🟢 P2 | Opcjonalny |
| `apps/demo/src/components/react-live-renderer.tsx` | **970** | 🟢 P2 | Opcjonalny |
| `apps/demo/src/components/playground/playground-preview-code.tsx` | **909** | 🟢 P2 | Opcjonalny |

**Razem:** ~18,500 linii do refaktoringu

---

## 🎯 Priorytet 0 (P0) - Krytyczne

### 1. `apps/demo/app/studio/page.tsx` (4989 linii)

**Problem:**
- Monolityczny komponent Playground
- Mieszanie odpowiedzialności (UI, logika biznesowa, zarządzanie stanem)
- Trudne w utrzymaniu i testowaniu
- Wolne ładowanie (nawet z dynamic imports)

**Analiza struktury:**
- 1 główny komponent: `PlaygroundPage`
- 7 dynamic imports (już zoptymalizowane)
- Wiele handler functions
- Złożona synchronizacja stanu

**Plan refaktoringu:**

#### Krok 1: Wyekstrahowanie Custom Hooks ✅ (Częściowo zrobione)
- ✅ `usePlaygroundState` - centralne zarządzanie stanem UI
- ✅ `useCodeSync` - synchronizacja kodu
- ✅ `usePlaygroundActions` - wszystkie akcje
- ⚠️ **Uwaga:** Sprawdzić, czy te hooki są faktycznie używane

#### Krok 2: Podział na mniejsze komponenty (TODO)
**Stwórz:**
- `PlaygroundLayout.tsx` - główny layout (sidebar, preview, terminal)
- `PlaygroundHeader.tsx` - top bar z akcjami
- `PlaygroundSidebar.tsx` - lewa i prawa sidebar (wyekstrahować z page.tsx)
- `PlaygroundPreviewArea.tsx` - obszar preview i kod
- `PlaygroundDialogs.tsx` - wszystkie dialogi (GitHub, Settings, etc.)

**Struktura:**
```
playground/
  ├── page.tsx (~300 linii - orchestrator)
  ├── PlaygroundLayout.tsx (~200 linii)
  ├── PlaygroundHeader.tsx (~150 linii)
  ├── PlaygroundSidebar.tsx (~300 linii)
  ├── PlaygroundPreviewArea.tsx (~200 linii)
  └── PlaygroundDialogs.tsx (~150 linii)
```

#### Krok 3: Context API dla globalnego stanu (TODO)
**Stwórz:**
- `PlaygroundContext.tsx` - context dla stanu i akcji
- Eliminuje prop drilling
- Ułatwia testowanie

**Szacowany czas:** 3-4 dni  
**Oczekiwany rezultat:** 4989 → ~300-500 linii (-90%)

---

### 2. `apps/demo/app/api/generate/route.ts` (2937 linii)

**Problem:**
- Ogromna ilość form templates (3000+ linii)
- Mieszanie logiki biznesowej z danymi
- Trudne w utrzymaniu i rozszerzaniu

**Analiza struktury:**
- `FORM_TEMPLATES` - ~2000+ linii templates
- Funkcje pomocnicze (detectFormType, extractFieldsFromPrompt, etc.)
- Funkcje fixowania kodu (fixSyntaxErrors, fixIncorrectImports, etc.)
- Główny handler POST

**Plan refaktoringu:**

#### Krok 1: Wyekstrahowanie Templates (TODO)
**Stwórz:**
- `apps/demo/app/api/generate/templates/form-templates.ts` - wszystkie form templates
- `apps/demo/app/api/generate/templates/app-templates.ts` - app templates
- `apps/demo/app/api/generate/templates/index.ts` - eksport

#### Krok 2: Wyekstrahowanie Utility Functions (TODO)
**Stwórz:**
- `apps/demo/app/api/generate/utils/form-detector.ts` - detectFormType, extractFieldsFromPrompt
- `apps/demo/app/api/generate/utils/code-fixer.ts` - fixSyntaxErrors, fixIncorrectImports, etc.
- `apps/demo/app/api/generate/utils/validation.ts` - generateValidationCode, etc.

#### Krok 3: Wyekstrahowanie Handlers (TODO)
**Stwórz:**
- `apps/demo/app/api/generate/handlers/form-handler.ts` - logika generowania formularzy
- `apps/demo/app/api/generate/handlers/app-handler.ts` - logika generowania aplikacji
- `apps/demo/app/api/generate/handlers/decision-handler.ts` - logika decision patterns

**Struktura:**
```
api/generate/
  ├── route.ts (~200 linii - orchestrator)
  ├── templates/
  │   ├── form-templates.ts (~1500 linii)
  │   ├── app-templates.ts (~300 linii)
  │   └── index.ts
  ├── utils/
  │   ├── form-detector.ts (~200 linii)
  │   ├── code-fixer.ts (~400 linii)
  │   └── validation.ts (~200 linii)
  └── handlers/
      ├── form-handler.ts (~300 linii)
      ├── app-handler.ts (~200 linii)
      └── decision-handler.ts (~150 linii)
```

**Szacowany czas:** 2-3 dni  
**Oczekiwany rezultat:** 2937 → ~200 linii w route.ts (-93%)

---

## 🟡 Priorytet 1 (P1) - Ważne

### 3. `apps/demo/app/studio/dsl/generator.ts` (2025 linii) ✅

**Status:** ✅ UKOŃCZONE (2025-01-XX)

**Osiągnięte rezultaty:**
- ✅ Redukcja z 2029 do 15 linii (-99.3%)
- ✅ Podział na moduły według odpowiedzialności
- ✅ Naprawione circular dependencies
- ✅ 19 nowych plików utworzonych (~1853 linii łącznie)

**Utworzona struktura:**
```
studio/dsl/
  ├── generator.ts (15 linii - entry point)
  ├── generator-core.ts (42 linie - dispatcher)
  ├── generators/
  │   ├── form-generator.ts
  │   ├── page-generator.ts
  │   ├── table-generator.ts
  │   ├── dashboard-generator.ts
  │   ├── sections/
  │   │   ├── section-generators.ts
  │   │   └── component-generator.ts
  │   ├── layouts/
  │   │   └── layout-generators.ts
  │   ├── modules/
  │   │   ├── module-generator.ts
  │   │   └── module-types.ts
  │   └── types.ts
  └── utils/
      ├── field-generator.ts
      ├── action-generator.ts
      ├── form-helpers.ts
      ├── common.ts
      ├── data-utils.ts
      └── screen-utils.ts
```

**Szczegóły:** Zobacz `docs/REFACTORING_PROGRESS.md` sekcja "2. generator.ts"

---

### 4. `apps/demo/src/components/playground/components-gallery.tsx` (1729 linii)

**Problem:**
- Duża lista komponentów w jednym pliku
- Trudne w nawigacji i utrzymaniu
- Możliwa duplikacja z registry

**Plan refaktoringu:**

#### Krok 1: Podział na Kategorie (TODO)
**Stwórz:**
- `components/playground/gallery/FormComponentsGallery.tsx`
- `components/playground/gallery/DataComponentsGallery.tsx`
- `components/playground/gallery/FeedbackComponentsGallery.tsx`
- `components/playground/gallery/NavigationComponentsGallery.tsx`
- `components/playground/gallery/LayoutComponentsGallery.tsx`
- `components/playground/gallery/ComponentsGallery.tsx` - orchestrator (~200 linii)

#### Krok 2: Wyekstrahowanie Component Data (TODO)
**Stwórz:**
- `components/playground/gallery/component-data.ts` - wszystkie definicje komponentów
- `components/playground/gallery/use-component-filter.ts` - logika filtrowania

**Szacowany czas:** 2 dni  
**Oczekiwany rezultat:** 1729 → ~200 linii w głównym komponencie (-88%)

---

### 5. `apps/demo/app/api/tests/run/route.ts` (1538 linii)

**Problem:**
- Mieszanie logiki różnych typów testów
- Duplikacja kodu między test runners
- Trudne w utrzymaniu

**Plan refaktoringu:**

#### Krok 1: Wyekstrahowanie Test Runners (TODO)
**Stwórz:**
- `apps/demo/app/api/tests/runners/vitest-runner.ts`
- `apps/demo/app/api/tests/runners/playwright-runner.ts`
- `apps/demo/app/api/tests/runners/lighthouse-runner.ts`
- `apps/demo/app/api/tests/runners/visual-runner.ts`

#### Krok 2: Wyekstrahowanie Data Processors (TODO)
**Stwórz:**
- `apps/demo/app/api/tests/processors/quality-data-processor.ts` - generateQualityData
- `apps/demo/app/api/tests/processors/result-formatter.ts` - formatowanie wyników

#### Krok 3: Wyekstrahowanie Types (TODO)
**Stwórz:**
- `apps/demo/app/api/tests/types.ts` - wszystkie typy związane z testami

**Struktura:**
```
api/tests/
  ├── route.ts (~200 linii - orchestrator)
  ├── runners/
  │   ├── vitest-runner.ts (~300 linii)
  │   ├── playwright-runner.ts (~250 linii)
  │   ├── lighthouse-runner.ts (~200 linii)
  │   └── visual-runner.ts (~150 linii)
  ├── processors/
  │   ├── quality-data-processor.ts (~300 linii)
  │   └── result-formatter.ts (~150 linii)
  └── types.ts (~100 linii)
```

**Szacowany czas:** 2-3 dni  
**Oczekiwany rezultat:** 1538 → ~200 linii w route.ts (-87%)

---

## 🟢 Priorytet 2 (P2) - Opcjonalne

### 6-9. Pozostałe pliki (1235, 1057, 970, 909 linii)

Te pliki są mniejsze i mogą być refaktorowane później, ale warto rozważyć:

- `playground-left-sidebar.tsx` - podzielić na mniejsze komponenty (ProjectTree, SessionList, etc.)
- `dsl-codegen.ts` - wyekstrahować utility functions
- `react-live-renderer.tsx` - wyekstrahować logikę renderowania do hooków
- `playground-preview-code.tsx` - podzielić na mniejsze komponenty

---

## 📋 Ogólny Plan Działania

### Faza 1: Priorytet 0 (1-2 tygodnie)
1. ✅ Sprawdzenie, czy istniejące hooki są używane w `page.tsx`
2. 🔄 Refaktoring `page.tsx` - podział na komponenty
3. 🔄 Refaktoring `generate/route.ts` - wyekstrahowanie templates i utils

### Faza 2: Priorytet 1 (1-2 tygodnie)
4. ✅ ~~Refaktoring `generator.ts`~~ - Ukończone
5. 🔄 Refaktoring `components-gallery.tsx` - podział na kategorie
6. 🔄 Refaktoring `tests/run/route.ts` - wyekstrahowanie runners

### Faza 3: Priorytet 2 (opcjonalne, 1 tydzień)
7. 🔄 Refaktoring pozostałych plików

---

## ✅ Checklist dla każdego refaktoringu

- [ ] Utworzyć nowe pliki/foldery
- [ ] Przenieść kod do nowych plików
- [ ] Zaktualizować importy
- [ ] Uruchomić testy (jeśli istnieją)
- [ ] Sprawdzić linting
- [ ] Sprawdzić, czy aplikacja działa
- [ ] Zaktualizować dokumentację
- [ ] Usunąć stary kod

---

## 📊 Metryki Sukcesu

### Przed refaktoringiem:
- Największy plik: 4989 linii
- 5 plików > 1500 linii
- 9 plików > 900 linii
- Łącznie: ~18,500 linii w dużych plikach

### Po refaktoringu (cel):
- Największy plik: < 500 linii
- 0 plików > 1500 linii
- Maksymalnie 1-2 pliki > 900 linii
- Lepsza czytelność i testowalność
- Łatwiejsze w utrzymaniu

---

## ⚠️ Uwagi

1. **Refaktoring stopniowy** - każdy plik osobno, testować po każdej zmianie
2. **Zachować funkcjonalność** - nie zmieniać API/powierzchni publicznej
3. **Dodać testy** - jeśli nie istnieją, dodać przed refaktoringiem
4. **Code review** - każda zmiana powinna być przejrzana
5. **Dokumentacja** - zaktualizować dokumentację po refaktoringu

---

## 📚 Referencje

- [Existing Refactoring Proposals](./apps/demo/docs/archive/REFACTORING_PROPOSALS.md)
- [Refactoring Analysis](./apps/demo/docs/archive/REFACTORING_ANALYSIS.md)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

