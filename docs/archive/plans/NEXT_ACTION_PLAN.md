# 🎯 Fragment UI - Następny Plan Działania

**Data:** 2025-01-XX  
**Status:** Po reorganizacji dokumentacji

---

## 📋 Co było następne do zrobienia?

### 🔴 PRIORYTET 0 (Krytyczne) - Do zrobienia TERAZ

#### 1. 🔧 Poprawa Quality Dashboard (1-2h) ✅ UKOŃCZONE
**Status:** ✅ Completed (2025-01-XX)

**Co zostało zrobione:**
- ✅ Quality Dashboard zaimplementowany
- ✅ Real-time status tracking działa
- ✅ Test history działa
- ✅ **Naprawiono:** E2E i Performance wyniki zapisują się poprawnie do heatmapy
- ✅ Dodano fallback do ładowania komponentów z istniejącej heatmapy
- ✅ Dodano obsługę Performance jako globalnych testów

**Pliki zmienione:**
- `apps/demo/app/api/tests/run/route.ts` - funkcja `generateQualityData` naprawiona

---

#### 2. 🤖 Copilot Phase 1: Foundation (2-3 tygodnie) 🎯 STRATEGICZNE
**Status:** 🚧 In Progress (1/8 tasks completed)

**1.1 UI-DSL v2 Types & Validation (8-12h) ✅ COMPLETED**
- [x] Utworzyć `packages/ui-dsl/src/types-v2.ts` z wszystkimi typami UI-DSL v2
- [x] Utworzyć `packages/ui-dsl/src/schema.ts` z schematami Zod
- [x] Utworzyć `packages/ui-dsl/src/validator.ts` z logiką walidacji
- [x] Dodać eksport JSON Schema (zod-to-json-schema)
- [x] Napisać testy jednostkowe

**Co trzeba zrobić (7 pozostałych zadań):**

**1.2 DSL Generation API (12-16h)**
- [ ] Utworzyć `apps/demo/app/api/dsl/generate/route.ts`
- [ ] Zaimplementować parsowanie promptów i wykrywanie intencji
- [ ] Zaimplementować logikę generowania layout-first
- [ ] Dodać generowanie datasource placeholder
- [ ] Dodać walidację registry

**1.3 DSL Patch Operations (16-20h)**
- [ ] Utworzyć `apps/demo/app/api/dsl/patch/route.ts`
- [ ] Zaimplementować wszystkie operacje patch (setProp, setCopy, addNode, etc.)
- [ ] Dodać walidację patch względem registry
- [ ] Zaimplementować inverse patches dla undo
- [ ] Napisać testy dla każdej operacji

**1.4 Code Generation (16-20h)**
- [ ] Utworzyć `apps/demo/app/api/code/gen/route.ts`
- [ ] Zaimplementować konwersję DSL → TSX
- [ ] Dodać generowanie importów z registry
- [ ] Dodać mirroring `data-ui-id`
- [ ] Dodać generowanie Storybook stories

**1.5 Quality Run API (20-24h)**
- [ ] Utworzyć `apps/demo/app/api/quality/run/route.ts`
- [ ] Zintegrować axe-core dla A11y checks
- [ ] Dodać sprawdzanie bundle size
- [ ] Dodać lint DS rules (noRawHtml, noHardcodedColors, importOnly)
- [ ] Dodać E2E smoke test runner
- [ ] Dodać visual snapshot checking (Chromatic)

**1.6 Registry Enhancement (8-12h)**
- [ ] Zaktualizować `packages/registry/registry.json`:
  - [ ] Wszystkie warianty dla każdego komponentu
  - [ ] Wszystkie sloty dla każdego komponentu
  - [ ] Wymagania A11y (role, notes)
  - [ ] Przykłady (TSX/DSL samples)
  - [ ] Forbidden HTML elements
- [ ] Dodać skrypt walidacji
- [ ] Dodać wersjonowanie registry

**1.7 Inspector → Patch Integration (12-16h)**
- [ ] Zaktualizować komponent Inspector do generowania patchów
- [ ] Połączyć Inspector z `/api/dsl/patch`
- [ ] Dodać refresh preview po patch
- [ ] Dodać wsparcie undo/redo
- [ ] Dodać wizualizację diff

**1.8 Lint DS in CI (4-6h)**
- [ ] Utworzyć `.github/workflows/lint-ds.yml`
- [ ] Dodać lint DS rules do ESLint config
- [ ] Dodać pre-commit hook
- [ ] Dodać CI gate dla lint DS

**Total Phase 1:** 96-130h (2-3 tygodnie)

---

### 🟠 PRIORYTET 1 (Wysoki) - Po P0

#### 3. 🎨 Figma Code Connect Coverage (8-12h)
**Status:** 🚧 Częściowo (2/5 komponentów - Button, Input)

**Co trzeba zrobić:**
- [ ] Dodać mapowania dla Card, Dialog, Select (minimum)
- [ ] Stretch: Tabs, Table
- [ ] Zautomatyzować generowanie Dev Resources

**Pliki:**
- `figma-code-connect/card.ts` (nowy)
- `figma-code-connect/dialog.ts` (nowy)
- `figma-code-connect/select.ts` (nowy)
- `scripts/generate-figma-dev-resources.ts` (rozszerzyć)

---

#### 4. 🔄 Automatyzacja synchronizacji Figma ↔ Code (6-8h)
**Status:** ❌ Nie rozpoczęte

**Co trzeba zrobić:**
- [ ] Utworzyć `scripts/check-figma-parity.ts`
- [ ] CI script porównujący Figma variant schema z `@fragment_ui/ui` props
- [ ] Sync command do regeneracji mapowań + docs per release
- [ ] Failing check na mismatch

**Pliki:**
- `scripts/check-figma-parity.ts` (nowy)
- `.github/workflows/figma-parity-check.yml` (nowy)

---

#### 5. 📊 Telemetry ↔ GitHub Integration (4-6h)
**Status:** 🚧 W trakcie

**Co trzeba zrobić:**
- [ ] Dokończyć webhook pipeline
- [ ] Dodać lead-time tracking per PR
- [ ] Dodać component reuse metrics per PR

**Pliki:**
- `packages/telemetry/src/github-integration.ts` (nowy)
- `apps/demo/app/api/webhooks/github/route.ts` (nowy)

---

## 🎯 Rekomendowany Plan Działania

### Tydzień 1 (Aktualny)
1. ✅ **Dokończyć poprawę Quality Dashboard** (1-2h) - PRIORYTET
2. 🎯 **Rozpocząć Copilot Phase 1.1** (UI-DSL v2 Types) - jeśli czas pozwoli

### Tydzień 2-4 (Copilot Phase 1)
1. Dokończyć UI-DSL v2 (types, validation, schema)
2. Zaimplementować DSL generate/patch APIs
3. Zaimplementować code generation
4. Zaimplementować quality run API
5. Rozszerzyć registry (variants, slots, a11y)
6. Połączyć Inspector z patch operations

### Tydzień 5-6 (Copilot Phase 1 + Quality)
1. Dokończyć Copilot Phase 1 (lint DS in CI)
2. Rozpocząć Figma Code Connect (Card, Dialog, Select)

### Tydzień 7+ (Kontynuacja)
- Copilot Phase 2 (Variants & Blocks)
- Figma Code Connect finalizacja
- Automatyzacja synchronizacji Figma ↔ Code
- Telemetry ↔ GitHub Integration

---

## 🆕 NOWE: A/B Testing z PostHog (Strategiczne Wymaganie)

### Opcja D: Rozpocząć A/B Testing Infrastructure (3-4 tyg.) 🎯 STRATEGICZNE NOWE
**Status:** 📋 Strategiczne wymaganie - do implementacji po Phase 1

**Co:**
- PostHog client integration
- Experiment model + storage + CRUD API
- ExperimentRunner component
- Public route `/exp/[slug]` dla eksperymentów
- Experiment Wizard UI
- CTA Instrumentation w generatorze

**Dlaczego ważne:**
- Kluczowy differentiator - prawdziwe testy A/B dla wygenerowanych ekranów
- Zamknięcie pętli: Generate → Test → Measure → Promote
- Data-driven decisions dla UI

**Szczegóły:** `docs/copilot/ab-testing-spec.md`

---

## 📝 Decyzja: Co robimy teraz?

### Opcja A: Dokończyć Copilot Phase 1 (2-3 tyg.) 🎯 STRATEGICZNE
- Dokończyć Phase 1.3-1.8 (DSL Patch, Code Gen, Quality, Registry, Inspector, Lint)
- To jest fundament dla A/B Testing
- Rekomendowane przed rozpoczęciem A/B Testing

### Opcja B: Rozpocząć A/B Testing Infrastructure (3-4 tyg.) 🆕 STRATEGICZNE NOWE
- Rozpocząć Phase 3.2 (A/B Testing)
- Można rozpocząć po Phase 1.1-1.2 (już mamy)
- Wymaga minimum Phase 1.1-1.2 + Phase 3.1 (Submissions)

### Opcja C: Figma Code Connect (8-12h) 🎨 KEY DIFFERENTIATOR
- Szybsze niż Copilot Phase 1
- Wysoki priorytet biznesowy
- Można zrobić równolegle

---

## 💡 Rekomendacja (Zaktualizowana)

**Zacznij od Opcji A** (dokończyć Phase 1.3-1.8), potem przejdź do **Opcji B** (A/B Testing).

**Dlaczego:**
1. Phase 1.1-1.2 ✅ już zrobione - mamy fundament
2. Phase 1.3-1.8 dokończy fundament (DSL Patch, Code Gen, Quality)
3. A/B Testing wymaga solidnego fundamentu (Phase 1) + Submissions (Phase 3.1)
4. Po Phase 1 możemy rozpocząć A/B Testing równolegle z Phase 2

---

**Ostatnia aktualizacja:** 2025-01-XX  
**Następny krok:** Wybierz opcję A, B lub C i zacznij implementację

