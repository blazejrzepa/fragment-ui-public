# Plan Wdrożenia Copilot Spec - Playground AI

## 🎯 Cel

Wdrożenie specyfikacji Copilota dla Playground AI zgodnie z `COPILOT_SPEC.md`, krok po kroku.

**📊 Stan projektu:** Zobacz `CURRENT_STATE_ANALYSIS.md` dla szczegółowej analizy.

---

## ✅ Co już mamy (nie trzeba robić)

- ✅ Registry.json (podstawowy) - `packages/registry/registry.json`
- ✅ Tokens (DTCG + build) - `packages/tokens/`
- ✅ UI-DSL types, parser, generator - `packages/ui-dsl/`
- ✅ API endpoints - `/api/bundle`, `/api/bundle-css`, `/api/generate`
- ✅ MCP registry i tokens (podstawowe) - `packages/mcp-server/`
- ✅ Blocks jako base dla scaffoldów - `packages/blocks/`

---

## 📋 Sprint 1 (Tydzień 1) - Fundamenty

### 1.1 Rozszerzyć Registry.json
- [x] ✅ `packages/registry/registry.json` istnieje
- [ ] **Dodać props/variants metadata** do każdego komponentu
- [ ] **Dodać aliases** zgodnie ze spec (Tab → TabTrigger, etc.)
- [ ] **Dodać rules** (forbiddenHtml, prefer)
- [ ] Utworzyć JSON Schema dla walidacji

### 1.2 Tokens (DTCG)
- [x] ✅ `packages/tokens/tokens.json` istnieje
- [x] ✅ Build do CSS vars działa (`dist/tokens.css`)
- [x] ✅ Integracja z Tailwind działa
- [ ] **Rozszerzyć MCP tokens** - dodać `tokens.semantic()` i `tokens.css()`

### 1.3 Scaffolds jako komponenty React
- [x] ✅ Blocks istnieją (`packages/blocks/src/`)
  - `authentication-block.tsx` → można użyć jako base dla `FormAuthLayout`
  - `settings-screen.tsx` → można użyć jako base dla `SettingsPageLayout`
  - `dashboard-layout.tsx` → już istnieje
- [ ] **Utworzyć `packages/scaffolds/`** (nowy pakiet lub w blocks)
- [ ] **FormAuthLayout** - wrapper używający authentication-block
- [ ] **TwoColumnLayout** - nowy layout (2 kolumny)
- [ ] **SettingsPageLayout** - wrapper używający settings-screen
- [ ] Każdy jako eksportowany React component

### 1.4 Iframe Preview (Same-Origin) - **PRIORYTET**
- [x] ✅ `/api/bundle` i `/api/bundle-css` działają
- [ ] **Utworzyć `apps/demo/app/playground/runtime/iframe.html`**
- [ ] **Zainstalować i zintegrować esbuild-wasm**
- [ ] **Dodać import map** dla `@fragment_ui/ui` i `@fragment_ui/tokens.css`
- [ ] **Wstrzyknąć CSS** z `/api/bundle-css` w iframe
- [ ] **Utworzyć worker.ts** do bundlowania kodu
- [ ] **Zastąpić React Live/Sandpack** same-origin iframe jako główne rozwiązanie

### 1.5 MCP Scaffolds
- [ ] **Utworzyć `packages/mcp-server/src/scaffolds.ts`**
- [ ] **Implementować `scaffolds.list()`** - zwraca listę dostępnych scaffoldów
- [ ] **Implementować `scaffolds.create(name, ui_dsl)`** - generuje TSX z layoutem
- [ ] **Zintegrować z generator.ts** - używać scaffoldów w generowaniu kodu

---

## 📋 Sprint 2 (Tydzień 2) - Generator i Walidacja

### 2.1 UI-DSL Schema
- [x] ✅ TypeScript types istnieją (`packages/ui-dsl/src/types.ts`)
- [ ] **Utworzyć `packages/ui-dsl/schema.json`** (JSON Schema dla walidacji)
- [ ] **Utworzyć walidator** używający JSON Schema
- [ ] **Dodać walidację** w parserze i generatorze

### 2.2 Rozszerzyć Generator (UI-DSL → TSX)
- [x] ✅ `packages/ui-dsl/src/generator.ts` istnieje i działa
- [x] ✅ Generuje formularze z Form + FormField
- [x] ✅ Dodaje walidację zod
- [ ] **Zintegrować scaffoldy** - używać FormAuthLayout, TwoColumnLayout, etc.
- [ ] **Dodać react-hook-form** resolver (obecnie tylko zod)
- [ ] **Implementować generowanie tabs** (jeśli nie ma)
- [ ] **Implementować generowanie tabel** (basic)
- [ ] **Upewnić się, że używa tylko tokenów** (Tailwind/CSS vars, zero hard-code)

### 2.3 A11y Quick Check
- [ ] Zainstalować `axe-core`
- [ ] Dodać a11y check w iframe preview
- [ ] Wyświetlać raport błędów/ostrzeżeń
- [ ] Blokować preview przy krytycznych błędach

### 2.4 ESLint Rules
- [ ] Utworzyć custom rule: ban raw HTML elements
- [ ] Utworzyć custom rule: import guard (tylko @fragment_ui/ui)
- [ ] Utworzyć custom rule: no inline styles z kolorami
- [ ] Dodać do konfiguracji ESLint

---

## 📋 Sprint 3 (Tydzień 3) - MCP i Automatyzacja

### 3.1 Rozszerzyć MCP Tools
- [x] ✅ `packages/mcp-server/src/registry.ts` - registry.list(), registry.get() działają
- [x] ✅ `packages/mcp-server/src/tokens.ts` - getTokens() działa
- [ ] **Rozszerzyć tokens.ts** - dodać `tokens.semantic()` i `tokens.css()`
- [x] ✅ `packages/mcp-server/src/scaffolds.ts` - będzie w Sprint 1
- [ ] (Opcjonalnie) `packages/mcp-server/src/storybook.ts` - storybook.stories(), storybook.open()

### 3.2 Auto-Story Export
- [ ] Integracja z Storybook
- [ ] Automatyczne tworzenie stories dla wygenerowanych widoków
- [ ] Export props/variants do JSON

### 3.3 Visual Tests
- [ ] Konfiguracja Playwright
- [ ] Integracja z percy/chromatic
- [ ] Snapshoty baseline dla wygenerowanych widoków

### 3.4 UI - Pane Logów i Diff
- [ ] Pane po prawej z logami procesu
- [ ] Przycisk "Zastosuj diff"
- [ ] Przycisk "Utwórz Story"
- [ ] Przycisk "Otwórz PR" (opcjonalnie)

---

## 📋 Sprint 4 (Tydzień 4) - Usprawnienia

### 4.1 Zaawansowane Funkcje
- [ ] Async walidacje (np. sprawdzanie dostępności username)
- [ ] Dynamiczne pola formularza
- [ ] i18n/RTL mode

### 4.2 Telemetria
- [ ] Tracking wygenerowanych widoków
- [ ] Tracking błędów
- [ ] Metryka Time-to-first-UI
- [ ] Dashboard z metrykami

### 4.3 Dokumentacja
- [ ] Dokumentacja dla użytkowników
- [ ] Przykłady promptów
- [ ] Troubleshooting guide

---

## 🚀 Rozpoczęcie - Priorytety

### Krok 1: Same-Origin Iframe Preview (NAJWAŻNIEJSZE)
To jest fundament dla spec - wszystko inne zależy od tego.

**Dlaczego:**
- Spec wymaga same-origin iframe (nie cross-origin jak Sandpack)
- Rozwiązuje problem z CSS (brak CORS)
- Umożliwia esbuild-wasm worker
- Import map dla lokalnych pakietów

**Zadania:**
1. Utworzyć `apps/demo/app/playground/runtime/iframe.html`
2. Zainstalować `esbuild-wasm`
3. Utworzyć worker do bundlowania
4. Dodać import map
5. Wstrzyknąć CSS

### Krok 2: Rozszerzyć Registry.json
Dodać metadata potrzebną dla MCP tools i generatora.

**Zadania:**
1. Dodać props/variants do każdego komponentu
2. Dodać aliases (Tab → TabTrigger, etc.)
3. Dodać rules (forbiddenHtml, prefer)
4. Utworzyć JSON Schema

### Krok 3: Utworzyć Scaffolds
Przekształcić blocks w formalne scaffoldy.

**Zadania:**
1. Utworzyć `FormAuthLayout` (użyć authentication-block)
2. Utworzyć `TwoColumnLayout` (nowy)
3. Utworzyć `SettingsPageLayout` (użyć settings-screen)
4. Eksportować jako komponenty React

### Krok 4: MCP Scaffolds
Dodać MCP tools dla scaffoldów.

**Zadania:**
1. Utworzyć `packages/mcp-server/src/scaffolds.ts`
2. Implementować `scaffolds.list()`
3. Implementować `scaffolds.create()`
4. Zintegrować z generatorem

---

## 📝 Notatki

- Wszystkie zmiany powinny być zgodne z istniejącą architekturą
- Używać TypeScript wszędzie gdzie to możliwe
- Testy dla każdego nowego modułu
- Dokumentacja inline + markdown

