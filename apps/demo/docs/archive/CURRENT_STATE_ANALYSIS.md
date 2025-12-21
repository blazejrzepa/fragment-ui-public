# Analiza Obecnego Stanu Projektu - Copilot Spec

## 📊 Stan na dzień analizy

### ✅ Co już istnieje i działa

#### 1. Registry System
- ✅ **`packages/registry/registry.json`** - istnieje
  - Zawiera mapowanie komponentów do plików
  - **Brakuje:** props/variants metadata (tylko ścieżki plików)
  - **Brakuje:** aliases i rules zgodnie ze spec

#### 2. MCP Server
- ✅ **`packages/mcp-server/src/registry.ts`**
  - `listRegistry()` - ✅ działa
  - `getComponentInfo()` - ✅ działa (ale bez props metadata)
  - `searchComponents()` - ✅ działa
- ✅ **`packages/mcp-server/src/tokens.ts`**
  - `getTokens()` - ✅ działa
  - **Brakuje:** `tokens.semantic()` i `tokens.css()` zgodnie ze spec
- ❌ **`packages/mcp-server/src/scaffolds.ts`** - **NIE ISTNIEJE**
  - **Brakuje:** `scaffolds.list()` i `scaffolds.create()`
- ❌ **`packages/mcp-server/src/storybook.ts`** - **NIE ISTNIEJE** (opcjonalne)

#### 3. UI-DSL System
- ✅ **`packages/ui-dsl/src/types.ts`** - ✅ kompletne definicje TypeScript
  - `UIDSL` interface - ✅ zgodne ze spec
  - `ScaffoldType` - ✅ zawiera: "form-auth", "two-column", "settings-page", "dashboard"
- ✅ **`packages/ui-dsl/src/parser.ts`** - ✅ parser prompt → UI-DSL
  - Wykrywa scaffold types
  - Ekstrahuje fields, actions, validation
- ✅ **`packages/ui-dsl/src/generator.ts`** - ✅ generator UI-DSL → TSX
  - Generuje imports
  - Generuje komponenty z Form + FormField
  - Dodaje walidację (zod)
  - **Brakuje:** pełna integracja ze scaffoldami jako komponentami React

#### 4. API Endpoints
- ✅ **`/api/bundle`** - ✅ działa
  - Bundluje `@fragment_ui/ui` do ESM
  - Używa esbuild
- ✅ **`/api/bundle-css`** - ✅ działa
  - Zwraca tokens.css + ui.css
- ✅ **`/api/generate`** - ✅ działa
  - Hybrid approach (rule-based + OpenAI)
  - Generuje UI-DSL i kod
  - **Brakuje:** pełna integracja z MCP tools

#### 5. Tokens System
- ✅ **`packages/tokens/src/tokens.json`** - ✅ istnieje (DTCG format)
- ✅ **`packages/tokens/dist/tokens.css`** - ✅ build do CSS vars
- ✅ **`packages/tokens/dist/tokens.ts`** - ✅ build do TypeScript
- ✅ **`packages/ui/tailwind.config.ts`** - ✅ integracja z Tailwind

#### 6. Preview System
- ✅ **React Live Renderer** - ✅ działa
  - Renderuje komponenty
  - CSS jest aplikowany
  - ⚠️ Wymaga ręcznego czyszczenia TypeScript
- ⚠️ **Sandpack Renderer** - ⚠️ działa, ale CSS nie jest aplikowany
  - Cross-origin iframe problem
- ❌ **StackBlitz Renderer** - ❌ timeout przy łączeniu
- ❌ **Same-origin iframe z esbuild-wasm** - **NIE ISTNIEJE**
  - To jest wymagane w spec jako główne rozwiązanie

#### 7. Blocks/Scaffolds
- ✅ **`packages/blocks/src/form-container.tsx`** - ✅ istnieje
- ✅ **`packages/blocks/src/authentication-block.tsx`** - ✅ istnieje
- ✅ **`packages/blocks/src/settings-screen.tsx`** - ✅ istnieje
- ✅ **`packages/blocks/src/dashboard-layout.tsx`** - ✅ istnieje
- ⚠️ **Brakuje:** formalne scaffoldy jako komponenty layout (FormAuthLayout, TwoColumnLayout, SettingsPageLayout)
  - Blocks istnieją, ale nie są używane jako scaffoldy w generatorze

---

## ❌ Co nie istnieje (wymagane w spec)

### 1. Registry - rozszerzenia
- ❌ Props/variants metadata w registry.json
- ❌ Aliases zgodnie ze spec
- ❌ Rules (forbiddenHtml, prefer)

### 2. MCP Tools - brakujące
- ❌ `mcp-scaffolds` (scaffolds.list(), scaffolds.create())
- ❌ `tokens.semantic()` i `tokens.css()` w MCP
- ❌ `mcp-storybook` (opcjonalne)

### 3. Scaffolds jako komponenty
- ❌ `packages/scaffolds/form-auth/FormAuthLayout.tsx`
- ❌ `packages/scaffolds/two-column/TwoColumnLayout.tsx`
- ❌ `packages/scaffolds/settings-page/SettingsPageLayout.tsx`
- ⚠️ Blocks istnieją, ale nie są używane jako scaffoldy

### 4. Preview Runtime (same-origin)
- ❌ `apps/demo/app/playground/runtime/iframe.html`
- ❌ `apps/demo/app/playground/runtime/worker.ts` (esbuild-wasm)
- ❌ Import map dla `@fragment_ui/ui`
- ❌ Same-origin iframe zamiast cross-origin

### 5. A11y Gate
- ❌ axe-core w preview
- ❌ Raportowanie błędów a11y
- ❌ Blokowanie preview przy krytycznych błędach

### 6. ESLint Rules
- ❌ Custom rule: ban raw HTML elements
- ❌ Custom rule: import guard (tylko @fragment_ui/ui)
- ❌ Custom rule: no inline styles z kolorami

### 7. Visual Tests
- ❌ Auto-Story export
- ❌ Playwright + percy/chromatic
- ❌ Snapshoty baseline

### 8. UI Features
- ❌ Pane logów (parse → validate → generate → preview → a11y)
- ❌ Przycisk "Zastosuj diff"
- ❌ Przycisk "Utwórz Story"
- ❌ Przycisk "Otwórz PR"
- ❌ Komentarze `@agent` w kodzie

### 9. Telemetria
- ❌ Tracking wygenerowanych widoków
- ❌ Metryka Time-to-first-UI
- ❌ Dashboard z metrykami

---

## 📊 Mapa zgodności ze spec

| Komponent Spec | Status | Uwagi |
|----------------|--------|-------|
| **Registry.json** | ⚠️ Częściowo | Brakuje props/variants/aliases/rules |
| **Tokens (DTCG)** | ✅ Gotowe | Wszystko działa |
| **UI-DSL Types** | ✅ Gotowe | Zgodne ze spec |
| **UI-DSL Parser** | ✅ Gotowe | Działa |
| **UI-DSL Generator** | ⚠️ Częściowo | Brakuje integracji ze scaffoldami |
| **MCP Registry** | ✅ Gotowe | Działa |
| **MCP Tokens** | ⚠️ Częściowo | Brakuje semantic() i css() |
| **MCP Scaffolds** | ❌ Brakuje | Wymagane |
| **MCP Storybook** | ❌ Brakuje | Opcjonalne |
| **Scaffolds Components** | ⚠️ Częściowo | Blocks istnieją, ale nie jako scaffoldy |
| **API /api/bundle** | ✅ Gotowe | Działa |
| **API /api/bundle-css** | ✅ Gotowe | Działa |
| **API /api/generate** | ✅ Gotowe | Działa |
| **Preview (React Live)** | ✅ Gotowe | Działa, ale nie jest w spec |
| **Preview (Sandpack)** | ⚠️ Częściowo | CSS nie działa |
| **Preview (Same-origin iframe)** | ❌ Brakuje | **Wymagane w spec** |
| **A11y Gate** | ❌ Brakuje | Wymagane |
| **ESLint Rules** | ❌ Brakuje | Wymagane |
| **Visual Tests** | ❌ Brakuje | Wymagane |
| **UI - Pane logów** | ❌ Brakuje | Wymagane |
| **UI - Diff/PR** | ❌ Brakuje | Wymagane |
| **Telemetria** | ❌ Brakuje | Wymagane |

---

## 🎯 Priorytety wdrożenia (zaktualizowane)

### Sprint 1 - Fundamenty (Tydzień 1)

#### ✅ Już zrobione:
- Registry.json (podstawowy)
- Tokens (DTCG + build)
- UI-DSL types, parser, generator
- API endpoints (/api/bundle, /api/bundle-css)
- MCP registry i tokens (podstawowe)

#### 🔨 Do zrobienia:
1. **Rozszerzyć registry.json**
   - [ ] Dodać props/variants metadata
   - [ ] Dodać aliases
   - [ ] Dodać rules (forbiddenHtml, prefer)

2. **Utworzyć scaffoldy jako komponenty**
   - [ ] `FormAuthLayout` (można użyć `authentication-block` jako base)
   - [ ] `TwoColumnLayout`
   - [ ] `SettingsPageLayout` (można użyć `settings-screen` jako base)

3. **Same-origin iframe preview**
   - [ ] `apps/demo/app/playground/runtime/iframe.html`
   - [ ] `apps/demo/app/playground/runtime/worker.ts` (esbuild-wasm)
   - [ ] Import map
   - [ ] CSS injection

4. **MCP Scaffolds**
   - [ ] `packages/mcp-server/src/scaffolds.ts`
   - [ ] `scaffolds.list()`
   - [ ] `scaffolds.create()`

### Sprint 2 - Generator i Walidacja (Tydzień 2)

#### 🔨 Do zrobienia:
1. **Rozszerzyć generator**
   - [ ] Integracja ze scaffoldami jako komponentami
   - [ ] Użycie FormAuthLayout, TwoColumnLayout, etc.
   - [ ] Pełna walidacja zod + react-hook-form

2. **A11y Gate**
   - [ ] Zainstalować axe-core
   - [ ] Dodać a11y check w preview
   - [ ] Raportowanie błędów
   - [ ] Blokowanie przy krytycznych błędach

3. **ESLint Rules**
   - [ ] Custom rule: ban raw HTML elements
   - [ ] Custom rule: import guard
   - [ ] Custom rule: no inline styles

4. **UI-DSL Schema JSON**
   - [ ] Utworzyć JSON Schema dla walidacji
   - [ ] Dodać walidator

### Sprint 3 - MCP i Automatyzacja (Tydzień 3)

#### 🔨 Do zrobienia:
1. **Rozszerzyć MCP Tokens**
   - [ ] `tokens.semantic()`
   - [ ] `tokens.css()`

2. **Auto-Story Export**
   - [ ] Integracja z Storybook
   - [ ] Automatyczne tworzenie stories

3. **Visual Tests**
   - [ ] Playwright setup
   - [ ] Percy/Chromatic integration
   - [ ] Snapshoty

4. **UI - Pane logów i diff**
   - [ ] Pane z logami procesu
   - [ ] Przycisk "Zastosuj diff"
   - [ ] Przycisk "Utwórz Story"
   - [ ] Przycisk "Otwórz PR"

### Sprint 4 - Usprawnienia (Tydzień 4)

#### 🔨 Do zrobienia:
1. **Zaawansowane funkcje**
   - [ ] Async walidacje
   - [ ] Dynamiczne pola
   - [ ] i18n/RTL mode

2. **Telemetria**
   - [ ] Tracking użycia
   - [ ] Metryki (TTFUI, acceptance rate)
   - [ ] Dashboard

3. **Vibe Coding**
   - [ ] Komentarze `@agent` w kodzie
   - [ ] Parsowanie komentarzy
   - [ ] Integracja z promptem

---

## 🔄 Migracja z obecnego stanu

### Co zachować:
- ✅ React Live jako fallback (działa stabilnie)
- ✅ Obecny generator UI-DSL (działa, tylko trzeba rozszerzyć)
- ✅ API endpoints (działają)
- ✅ MCP registry i tokens (działają, tylko trzeba rozszerzyć)

### Co zmienić:
- ⚠️ Preview: dodać same-origin iframe jako główne rozwiązanie
- ⚠️ Generator: zintegrować ze scaffoldami jako komponentami
- ⚠️ Registry: dodać metadata (props/variants)

### Co dodać:
- ❌ Scaffolds jako komponenty React
- ❌ MCP scaffolds
- ❌ A11y gate
- ❌ ESLint rules
- ❌ Visual tests
- ❌ UI features (pane logów, diff, PR)

---

## 📝 Następne kroki (natychmiastowe)

1. **Rozszerzyć registry.json** - dodać props/variants metadata
2. **Utworzyć scaffoldy** - FormAuthLayout, TwoColumnLayout, SettingsPageLayout
3. **Same-origin iframe** - to jest kluczowe dla spec
4. **MCP Scaffolds** - scaffolds.list() i scaffolds.create()

---

## 🎯 Metryki sukcesu (obecny stan)

- **Time-to-first-UI:** ~10-15s (cel: <5s) - ⚠️ Do poprawy
- **First pass acceptance:** Nie mierzone - ❌ Wymaga telemetrii
- **A11y violations:** Nie sprawdzane - ❌ Wymaga a11y gate
- **Adoption:** Nie mierzone - ❌ Wymaga telemetrii
- **Coverage:** Nie mierzone - ❌ Wymaga telemetrii

---

## 💡 Rekomendacje

1. **Zacznij od same-origin iframe** - to jest fundament dla spec
2. **Rozszerz registry.json** - potrzebne dla MCP tools
3. **Utwórz scaffoldy** - potrzebne dla generatora
4. **Dodaj MCP scaffolds** - potrzebne dla Copilota
5. **A11y gate** - ważne dla jakości

**Kolejność:** Same-origin iframe → Registry → Scaffolds → MCP → A11y → Reszta

