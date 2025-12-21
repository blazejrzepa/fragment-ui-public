# Plan Migracji do Copilot Playground AI

## Status: Analiza i propozycje zmian

## 1. Analiza Obecnego Stanu

### 1.1 Co już działa

- ✅ Same-origin iframe preview (`apps/demo/app/playground/runtime/iframe.html`)
- ✅ Web Worker z esbuild-wasm (`apps/demo/app/playground/runtime/worker.ts`)
- ✅ API endpoint `/api/bundle` dla bundlowania `@fragment_ui/ui`
- ✅ API endpoint `/api/bundle-css` dla CSS
- ✅ Podstawowa struktura playground (`apps/demo/app/playground/`)

### 1.2 Co wymaga zmian

#### A. Polityka CSS (KRYTYCZNE)

**Problem:** Importy CSS w ESM (`packages/ui/src/date-picker.tsx`, `calendar.tsx`)

**Aktualny stan:**
- `packages/ui/src/date-picker.tsx` - linia 11: `import "react-day-picker/dist/style.css";` (USUNIĘTE)
- `packages/ui/src/calendar.tsx` - linia 7: `import "react-day-picker/dist/style.css";` (USUNIĘTE)

**Status:** ✅ Importy CSS zostały usunięte z komponentów.

**Co jeszcze trzeba zrobić:**
1. ✅ Dodać react-day-picker CSS do `/api/bundle-css` (ZROBIONE)
2. ✅ Dodać `<link>` w `iframe.html` (ZROBIONE)
3. ⚠️ Upewnić się, że plugin esbuild w `/api/bundle` działa poprawnie
4. ⚠️ Dodać CI check, który failuje jeśli znajdzie import CSS w bundle

#### B. Architektura Playground

**Obecna struktura:**
```
apps/demo/
  app/
    playground/
      page.tsx              # Główna strona playground
      runtime/
        iframe.html         # Same-origin iframe
        worker.ts           # Web Worker z esbuild
    api/
      bundle/route.ts       # Bundle @fragment_ui/ui
      bundle-css/route.ts  # CSS bundle
```

**Wymagana struktura (wg specyfikacji):**
```
apps/demo/
  app/
    playground/
      page.tsx              # Interfejs (prompt, edytor, logi)
      runtime/
        iframe.html         # Same-origin iframe
        worker.ts           # esbuild-wasm bundling
        bridge.ts           # postMessage API parent <-> iframe (NOWE)
      dsl/                  # NOWE
        schema.ts           # JSON schema UI-DSL
        types.ts            # Typy DSL
        generator.ts         # UI-DSL -> TSX
    api/
      bundle/route.ts       # Prebundle @fragment_ui/ui
      bundle-css/route.ts   # tokens.css / ui.css / vendor.css
```

**Zmiany wymagane:**
1. ✅ Utworzyć `apps/demo/app/playground/dsl/` (NOWE)
2. ✅ Utworzyć `apps/demo/app/playground/runtime/bridge.ts` (NOWE)
3. ⚠️ Refaktoryzacja `page.tsx` - dodać prompt box, edytor, logi

#### C. Registry.json

**Status:** ❌ Brak

**Wymagane:**
- Utworzyć `packages/registry/registry.json` lub `apps/demo/registry.json`
- Zdefiniować komponenty, propsy, aliasy, reguły

#### D. UI-DSL

**Status:** ❌ Brak

**Wymagane:**
- Utworzyć `apps/demo/app/playground/dsl/types.ts`
- Zdefiniować typy: `UiForm`, `UiPage`, `UiTable`, `UiDashboard`
- Utworzyć `apps/demo/app/playground/dsl/schema.ts` (JSON Schema)
- Utworzyć `apps/demo/app/playground/dsl/generator.ts` (UI-DSL → TSX)

#### E. Generator (UI-DSL → TSX)

**Status:** ❌ Brak

**Wymagane:**
- Implementacja generatora, który:
  - Buduje formularze przez `Form + FormField`
  - Używa `zod + react-hook-form`
  - Używa tylko tokenów (Tailwind)
  - Zapewnia a11y (label, aria-*)
  - Zakazuje surowych elementów HTML

#### F. MCP (Narzędzia Copilota)

**Status:** ⚠️ Częściowo (istnieje `packages/mcp-server/`)

**Wymagane:**
- `registry.server.ts` - registry.list/get
- `tokens.server.ts` - tokens.semantic/css()
- `scaffolds.server.ts` - scaffolds.list/create
- `storybook.server.ts` - (opcjonalnie) stories.json

#### G. ESLint Rules

**Status:** ❌ Brak

**Wymagane:**
- `no-raw-elements` - ban na `<input|button|select|textarea>`
- `design-system-imports-only` - importy tylko z `@fragment_ui/ui/*`
- `no-inline-hardcoded-colors` - wymuszaj tokeny/klasy

#### H. A11y Quick Check

**Status:** ⚠️ Częściowo (istnieje w worker.ts)

**Wymagane:**
- Upewnić się, że axe-core działa poprawnie
- Krytyczne błędy → blokada "Apply"

---

## 2. Propozycje Zmian

### 2.1 Priorytet 1: Polityka CSS (KRYTYCZNE)

#### A. Upewnić się, że plugin esbuild działa

**Plik:** `apps/demo/app/api/bundle/route.ts`

**Aktualny stan:** Plugin `remove-css-imports` istnieje, ale może nie działać poprawnie dla wszystkich przypadków.

**Propozycja:**
```typescript
{
  name: "remove-css-imports",
  setup(build) {
    // Przechwytuj wszystkie .css (włącznie z side-effect imports)
    build.onResolve({ filter: /\.css$/ }, () => {
      return { path: "", namespace: "css-stub" };
    });
    // Przechwytuj CSS w ścieżkach (np. "react-day-picker/dist/style.css")
    build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
      if (args.path.endsWith('.css') || args.path.includes('/style.css') || args.path.includes('react-day-picker')) {
        return { path: "", namespace: "css-stub" };
      }
      return undefined;
    });
    // Zwróć pusty moduł
    build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => ({
      contents: "",
      loader: "js"
    }));
  }
}
```

**Status:** ✅ Plugin już istnieje w kodzie.

#### B. Dodać CI check dla importów CSS

**Plik:** `scripts/check-no-css-imports.mjs` (NOWY)

**Propozycja:**
```javascript
#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const buildDir = path.resolve(process.cwd(), 'packages/ui/dist');
const srcDir = path.resolve(process.cwd(), 'packages/ui/src');

// Sprawdź build artefakty
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir, { recursive: true });
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.mjs')) {
      const content = fs.readFileSync(path.join(buildDir, file), 'utf-8');
      if (content.match(/import\s+.*from\s+["'][^"']*\.css["']/)) {
        console.error(`❌ Found CSS import in build artifact: ${file}`);
        process.exit(1);
      }
    }
  }
}

// Sprawdź źródła (opcjonalnie - tylko warning)
const srcFiles = fs.readdirSync(srcDir, { recursive: true });
for (const file of srcFiles) {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    if (content.match(/import\s+.*from\s+["'][^"']*\.css["']/)) {
      console.warn(`⚠️ Found CSS import in source: ${file}`);
    }
  }
}

console.log('✅ No CSS imports found in build artifacts');
```

**Dodać do:** `package.json` scripts:
```json
{
  "scripts": {
    "check:no-css-imports": "node scripts/check-no-css-imports.mjs"
  }
}
```

### 2.2 Priorytet 2: Registry.json

**Plik:** `packages/registry/registry.json` (NOWY)

**Propozycja struktury:**
- Utworzyć `packages/registry/` directory
- Wygenerować `registry.json` na podstawie istniejących komponentów
- Dodać walidator JSON Schema

**Kroki:**
1. Skanować `packages/ui/src/` i wyciągnąć komponenty
2. Analizować propsy z TypeScript types
3. Generować `registry.json`

### 2.3 Priorytet 3: UI-DSL

**Pliki:**
- `apps/demo/app/playground/dsl/types.ts` (NOWY)
- `apps/demo/app/playground/dsl/schema.ts` (NOWY)
- `apps/demo/app/playground/dsl/generator.ts` (NOWY)

**Propozycja:**
- Zaimplementować typy zgodnie ze specyfikacją
- Utworzyć JSON Schema dla walidacji
- Zaimplementować generator UI-DSL → TSX

### 2.4 Priorytet 4: Generator (UI-DSL → TSX)

**Plik:** `apps/demo/app/playground/dsl/generator.ts`

**Propozycja:**
- Używać `registry.json` do mapowania komponentów
- Generować kod zgodnie z zasadami (Form + FormField, zod, tokeny, a11y)
- Zakazywać surowych elementów HTML

### 2.5 Priorytet 5: Bridge (postMessage API)

**Plik:** `apps/demo/app/playground/runtime/bridge.ts` (NOWY)

**Propozycja:**
- Zdefiniować typy wiadomości (render, error, a11y-results)
- Zaimplementować komunikację parent ↔ iframe

### 2.6 Priorytet 6: ESLint Rules

**Pliki:**
- `tooling/lint/eslint-no-raw-elements.js` (NOWY)
- `tooling/lint/eslint-design-system-imports-only.js` (NOWY)
- `tooling/lint/eslint-no-inline-hardcoded-colors.js` (NOWY)

**Propozycja:**
- Zaimplementować custom rules zgodnie ze specyfikacją
- Dodać do ESLint config

---

## 3. Plan Implementacji

### Faza 1: Podstawy (Tydzień 1 - MVP)

1. ✅ **Polityka CSS**
   - ✅ Usunąć importy CSS z komponentów
   - ✅ Dodać CSS do `/api/bundle-css`
   - ✅ Dodać `<link>` w `iframe.html`
   - ⚠️ Upewnić się, że plugin esbuild działa
   - ⚠️ Dodać CI check

2. **Registry.json**
   - Utworzyć `packages/registry/registry.json`
   - Wygenerować z istniejących komponentów
   - Dodać walidator

3. **UI-DSL**
   - Utworzyć `apps/demo/app/playground/dsl/types.ts`
   - Utworzyć `apps/demo/app/playground/dsl/schema.ts`
   - Utworzyć `apps/demo/app/playground/dsl/generator.ts`

4. **Generator (podstawowy)**
   - Zaimplementować generator dla `UiForm`
   - Zaimplementować generator dla `UiPage` (two-column)
   - Zaimplementować generator dla `UiTable` (basic)

5. **ESLint Rules**
   - `no-raw-elements`
   - `design-system-imports-only`

6. **A11y Quick Check**
   - Upewnić się, że axe-core działa
   - Dodać blokadę "Apply" dla krytycznych błędów

### Faza 2: Rozszerzenia (Tydzień 2 - v1)

1. **MCP**
   - `registry.server.ts`
   - `tokens.server.ts`
   - `scaffolds.server.ts`

2. **Bridge**
   - `apps/demo/app/playground/runtime/bridge.ts`
   - Integracja z `page.tsx`

3. **Panel logów**
   - Parse → validate → generate → preview → a11y
   - Akcje: "Zastosuj diff", "Utwórz story", "Otwórz PR"

4. **Scaffolds**
   - `form-auth`
   - `two-column`
   - `settings`

5. **Testy wizualne (CI)**
   - Auto-rejestracja story
   - Playwright + baseline

---

## 4. Checklist Migracji

### A. MVP (Tydzień 1)

- [ ] ✅ Usunąć importy CSS z komponentów
- [ ] ✅ Dodać CSS do `/api/bundle-css`
- [ ] ✅ Dodać `<link>` w `iframe.html`
- [ ] ⚠️ Upewnić się, że plugin esbuild działa
- [ ] ⚠️ Dodać CI check dla importów CSS
- [ ] Utworzyć `registry.json`
- [ ] Utworzyć UI-DSL types
- [ ] Utworzyć UI-DSL schema
- [ ] Zaimplementować generator (form, two-column, table-basic)
- [ ] Dodać ESLint rule `no-raw-elements`
- [ ] Dodać ESLint rule `design-system-imports-only`
- [ ] Upewnić się, że axe-core działa
- [ ] Dodać blokadę "Apply" dla krytycznych błędów a11y

### B. v1 (Tydzień 2)

- [ ] Zaimplementować MCP: registry/tokens/scaffolds
- [ ] Utworzyć bridge.ts (postMessage API)
- [ ] Zaimplementować panel logów
- [ ] Dodać scaffolds (form-auth, two-column, settings)
- [ ] Zaimplementować auto-story eksport
- [ ] Dodać testy wizualne (CI)
- [ ] Przygotować zestaw promptów użytkownika (30+)

---

## 5. Uwagi i Ostrzeżenia

### 5.1 Plugin esbuild dla CSS

**Problem:** Esbuild może nie przechwytywać wszystkich przypadków importów CSS, szczególnie side-effect imports.

**Rozwiązanie:** Używać pluginu, który przechwytuje wszystkie `.css` i zwraca pusty moduł. Dodatkowo, dodać post-processing regex jako backup.

### 5.2 Registry.json

**Problem:** Trzeba wygenerować `registry.json` z istniejących komponentów.

**Rozwiązanie:** Utworzyć skrypt, który skanuje `packages/ui/src/` i generuje `registry.json` na podstawie TypeScript types.

### 5.3 Generator UI-DSL → TSX

**Problem:** Generator musi być zgodny z zasadami (Form + FormField, zod, tokeny, a11y).

**Rozwiązanie:** Używać `registry.json` do mapowania komponentów i ich props. Generować kod zgodnie z szablonami.

### 5.4 ESLint Rules

**Problem:** Custom rules wymagają konfiguracji ESLint.

**Rozwiązanie:** Utworzyć `tooling/lint/` directory i dodać rules do ESLint config.

---

## 6. Następne Kroki

1. **Natychmiast:**
   - ✅ Zatrzymać prace nad CSS (zrobione)
   - ⚠️ Upewnić się, że plugin esbuild działa poprawnie
   - ⚠️ Dodać CI check dla importów CSS

2. **Krótkoterminowe (Tydzień 1):**
   - Utworzyć `registry.json`
   - Utworzyć UI-DSL types i schema
   - Zaimplementować generator (podstawowy)
   - Dodać ESLint rules

3. **Średnioterminowe (Tydzień 2):**
   - Zaimplementować MCP
   - Utworzyć bridge.ts
   - Zaimplementować panel logów
   - Dodać scaffolds

4. **Długoterminowe:**
   - Testy wizualne (CI)
   - Auto-story eksport
   - Integracja z Figma (opcjonalnie)

