# Status Implementacji - Copilot Playground AI

## ✅ Zakończone (MVP - Faza 1)

### 1. Polityka CSS
- ✅ Plugin esbuild dla CSS (`apps/demo/app/api/bundle/route.ts`)
- ✅ CI check dla importów CSS (`scripts/check-no-css-imports.mjs`)
- ✅ Skrypt dodany do `package.json` (`check:no-css-imports`)
- ✅ Importy CSS usunięte z komponentów (`date-picker.tsx`, `calendar.tsx`)
- ✅ CSS dodany do `/api/bundle-css`
- ✅ `<link>` dodany w `iframe.html`

### 2. Podstawowa struktura
- ✅ `apps/demo/app/playground/dsl/types.ts` - Typy UI-DSL
- ✅ `apps/demo/app/playground/dsl/schema.ts` - JSON Schema dla walidacji
- ✅ `apps/demo/app/playground/dsl/generator.ts` - Generator UI-DSL → TSX
- ✅ `apps/demo/app/playground/runtime/bridge.ts` - postMessage API

### 3. Registry.json
- ✅ `packages/registry/registry.json` - Maszynowo-czytelny spis komponentów

### 4. Generator (podstawowy)
- ✅ Generator dla `UiForm` - działa z FormEnhanced
- ⚠️ Generator dla `UiPage` - placeholder (TODO)
- ⚠️ Generator dla `UiTable` - placeholder (TODO)
- ⚠️ Generator dla `UiDashboard` - placeholder (TODO)

## ⚠️ W trakcie / Do zrobienia

### 1. ESLint Rules
- ⚠️ `no-raw-elements` - ban na surowe elementy HTML
- ⚠️ `design-system-imports-only` - importy tylko z `@fragment_ui/ui/*`
- ⚠️ `no-inline-hardcoded-colors` - wymuszaj tokeny/klasy

### 2. Generator (rozszerzenia)
- ⚠️ Generator dla `UiPage` (two-column, tabs, card sections)
- ⚠️ Generator dla `UiTable` (z filtrami, paginacją)
- ⚠️ Generator dla `UiDashboard` (widgety, metryki, wykresy)

### 3. MCP (Narzędzia Copilota)
- ⚠️ `registry.server.ts` - registry.list/get
- ⚠️ `tokens.server.ts` - tokens.semantic/css()
- ⚠️ `scaffolds.server.ts` - scaffolds.list/create
- ⚠️ `storybook.server.ts` - (opcjonalnie) stories.json

### 4. Panel logów
- ⚠️ Parse → validate → generate → preview → a11y
- ⚠️ Akcje: "Zastosuj diff", "Utwórz story", "Otwórz PR"

### 5. Scaffolds
- ⚠️ `form-auth` - formularz autoryzacji
- ⚠️ `two-column` - layout dwukolumnowy
- ⚠️ `settings` - strona ustawień

### 6. Testy wizualne (CI)
- ⚠️ Auto-rejestracja story
- ⚠️ Playwright + baseline

## 📝 Uwagi

### Generator FormEnhanced
Generator używa `FormEnhanced` zamiast `react-hook-form`, ponieważ `FormEnhanced` ma własne zarządzanie stanem. Jeśli potrzebujemy `react-hook-form`, powinniśmy użyć podstawowego komponentu `Form`.

### Registry.json
Registry zawiera podstawowe komponenty. Można go rozszerzyć o więcej komponentów i szczegółowe propsy na podstawie rzeczywistych definicji TypeScript.

### Bridge.ts
Bridge jest gotowy do użycia, ale wymaga integracji z `page.tsx` i `worker.ts` w iframe.

## 🎯 Następne kroki

1. **Krótkoterminowe:**
   - Dodać ESLint rules
   - Rozszerzyć generator o Page, Table, Dashboard
   - Zintegrować bridge z playground UI

2. **Średnioterminowe:**
   - Zaimplementować MCP
   - Dodać panel logów
   - Utworzyć scaffolds

3. **Długoterminowe:**
   - Testy wizualne (CI)
   - Auto-story eksport
   - Integracja z Figma (opcjonalnie)

