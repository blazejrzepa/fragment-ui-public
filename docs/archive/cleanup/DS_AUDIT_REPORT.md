# Fragment UI Design System - Raport Audytowy

**Data audytu:** 2025-01-XX  
**Gałąź:** main  
**Wersja:** 1.0.0

---

## Spis treści

1. [Executive Summary](#1-executive-summary)
2. [Architektura Systemu](#2-architektura-systemu)
3. [Inwentarz komponentów (Registry)](#3-inwentarz-komponentów-registry)
4. [Tokeny (DTCG)](#4-tokeny-dtcg)
5. [Polityka CSS (krytyczne)](#5-polityka-css-krytyczne)
6. [Playground Runtime](#6-playground-runtime)
7. [UI-DSL & Generator](#7-ui-dsl--generator)
8. [MCP Tools](#8-mcp-tools)
9. [Jakość: Lint/A11y/Visual](#9-jakość-linta11yvisual)
10. [Znane Problemy & Repro](#10-znane-problemy--repro)
11. [Metryki i Telemetria](#11-metryki-i-telemetria)
12. [Roadmapa techniczna](#12-roadmapa-techniczna)
13. [Załączniki (artefakty)](#13-załączniki-artefakty)

---

## 1. Executive Summary

Fragment UI to AI-native design system oparty na shadcn/ui, zintegrowany z Playground AI umożliwiającym generowanie komponentów React z promptów naturalnego języka. System składa się z monorepo zawierającego pakiety UI (`@fragment_ui/ui`), tokeny (`@fragment_ui/tokens`), bloki (`@fragment_ui/blocks`), MCP server oraz aplikacje demo (`apps/demo`) i dokumentacyjną (`apps/www`).

### Co działa

- **Generacja komponentów:** Prompt → UI-DSL → TSX działa end-to-end
- **Runtime preview:** Same-origin iframe z esbuild-wasm bundlowaniem
- **Tokeny:** Pipeline JSON → CSS vars + Tailwind działa poprawnie
- **Komponenty:** 60+ komponentów z Storybook stories i testami
- **MCP Server:** 5 narzędzi dostępnych dla Cursor/Copilot
- **A11y:** axe-core integracja w preview działa

### Co blokuje

- **CSS importy:** Polityka "zero import .css w ESM" jest częściowo wdrożona, ale wymaga pełnej weryfikacji
- **react/jsx-runtime:** Ciągłe problemy z usuwaniem referencji w bundle (wymaga agresywnego cleanup)
- **Bundle paths:** `/api/bundle` i `/api/bundle-blocks` wymagają wielu fallback paths dla różnych środowisk (dev/prod/Vercel)

### Główne ryzyka

1. **P0 - CSS importy w ESM:** Jeśli import `.css` pojawi się w bundle, runtime preview się zepsuje
2. **P1 - react/jsx-runtime:** Bundle może zawierać referencje do `react/jsx-runtime`, które powodują błędy w iframe
3. **P1 - Bundle resolution:** W produkcji (Vercel) bundle paths mogą nie działać bez wielu fallbacków
4. **P2 - A11y coverage:** Nie wszystkie komponenty mają pełne testy a11y
5. **P2 - ESLint rules:** Custom rules (`no-raw-elements`, `design-system-imports-only`) nie są włączone w demo app

### Quick Wins

1. **Dodać CI check:** Skrypt `check-no-css-imports.mjs` już istnieje - włączyć w pipeline
2. **Uprościć bundle cleanup:** Zastąpić wielokrotne replace() jednym regex w `/api/bundle`
3. **Włączyć ESLint rules:** Dodać custom rules do `apps/demo/eslint.config.mjs`

---

## 2. Architektura Systemu

### Diagram przepływu (ASCII)

```
┌─────────────────┐
│   User Prompt   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  /api/generate (route.ts)      │
│  - parsePromptToUIDSL()         │
│  - validateUiDsl()              │
│  - generateCodeFromUIDSL()      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│      UI-DSL (JSON)              │
│  { type: "form", fields: [...] }│
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Generator (generator.ts)       │
│  - generateTSX(dsl)              │
│  - generateForm/Page/Table()    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   TSX Code (React)              │
│   import { Button } from ...     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Playground Preview             │
│  - worker.ts (esbuild-wasm)      │
│  - bundleCode()                  │
│  - renderComponent()             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Same-Origin Iframe             │
│  - iframe.html (import map)      │
│  - /api/bundle (@fragment_ui/ui)   │
│  - /api/bundle-css (CSS)         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  A11y Check (axe-core)          │
│  - runA11yCheck()                │
│  - violations[]                  │
└─────────────────────────────────┘
```

### Moduły systemu

#### `packages/ui`
- **Lokalizacja:** `packages/ui/src/`
- **Komponenty:** 60+ komponentów React (Button, Input, Form, Card, etc.)
- **Eksport:** `dist/index.js` (ESM), `dist/index.d.ts` (types)
- **Zależności:** React 18, Radix UI, Tailwind CSS
- **Build:** `tsc -p tsconfig.json` → `dist/`

#### `packages/tokens`
- **Lokalizacja:** `packages/tokens/src/tokens.json`
- **Pipeline:** `scripts/build.mjs` → `dist/tokens.css` (CSS vars) + `dist/tokens.ts` (TypeScript)
- **Format:** DTCG-compatible JSON → CSS custom properties
- **Tematy:** light, dark, high-contrast

#### `packages/blocks`
- **Lokalizacja:** `packages/blocks/src/`
- **Zawartość:** Pre-built screen compositions (SettingsScreen, DashboardLayout, etc.)
- **Eksport:** `dist/index.js`
- **Zależności:** `@fragment_ui/ui` (workspace)

#### `apps/demo`
- **Lokalizacja:** `apps/demo/`
- **Funkcje:**
  - Playground AI (`/playground`) - prompt → component generation
  - API routes:
    - `/api/generate` - OpenAI + rule-based generation
    - `/api/bundle` - Bundle `@fragment_ui/ui` for iframe
    - `/api/bundle-blocks` - Bundle `@fragment_ui/blocks` for iframe
    - `/api/bundle-css` - Bundle CSS (tokens + UI styles + vendor)
  - Runtime: `app/playground/runtime/` - worker.ts, iframe.html

#### `apps/www`
- **Lokalizacja:** `apps/www/`
- **Funkcje:** Dokumentacja, Storybook integration, component examples

#### `packages/mcp-server`
- **Lokalizacja:** `packages/mcp-server/src/`
- **Funkcje:** MCP (Model Context Protocol) server dla Cursor/Copilot
- **Tools:** 5 narzędzi (get_component_info, suggest_component, validate_code, generate_component, get_tokens)

#### `tooling/lint`
- **Lokalizacja:** `tooling/lint/`
- **Custom ESLint rules:**
  - `eslint-no-raw-elements.js` - Ban raw HTML elements
  - `eslint-design-system-imports-only.js` - Only import from @fragment_ui/ui
  - `eslint-no-inline-hardcoded-colors.js` - Use design tokens

---

## 3. Inwentarz komponentów (Registry)

### Registry JSON

Plik `packages/registry/registry.json` zawiera definicje komponentów:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "version": "1.0.0",
  "components": {
    "Form": {
      "import": "@fragment_ui/ui/form-enhanced",
      "props": {
        "onSubmit": "function",
        "onError": "function",
        "validationMode": ["onChange", "onBlur", "onSubmit"],
        "validateOnMount": "boolean"
      }
    },
    "Button": {
      "import": "@fragment_ui/ui/button",
      "props": {
        "variant": ["solid", "outline", "ghost"],
        "type": ["button", "submit", "reset"],
        "disabled": "boolean",
        "size": ["sm", "md", "lg"]
      }
    },
    "Input": {
      "import": "@fragment_ui/ui/input",
      "props": {
        "type": ["text", "email", "password", "number", "tel", "url"],
        "invalid": "boolean",
        "placeholder": "string",
        "disabled": "boolean",
        "readOnly": "boolean"
      }
    }
  },
  "rules": {
    "forbiddenHtml": ["input", "button", "select", "textarea"],
    "prefer": {
      "input": "Input",
      "button": "Button",
      "select": "Select",
      "textarea": "Textarea"
    }
  }
}
```

### Tabela komponentów (wybrane core)

| Nazwa | Import | Kluczowe props/varianty | A11y | Story |
|-------|--------|-------------------------|------|-------|
| Button | `@fragment_ui/ui/button` | variant: solid/outline/ghost, size: sm/md/lg | ✅ | ✅ |
| Input | `@fragment_ui/ui/input` | type: text/email/password, invalid, disabled | ✅ | ✅ |
| FormEnhanced | `@fragment_ui/ui/form-enhanced` | onSubmit, validationMode, validateOnMount | ✅ | ✅ |
| FormField | `@fragment_ui/ui/form-field` | label, error, helperText, required | ✅ | ✅ |
| Card | `@fragment_ui/ui/card` | (wymaga CardHeader/CardTitle/CardContent) | ✅ | ✅ |
| Dialog | `@fragment_ui/ui/dialog` | open, onOpenChange | ✅ | ✅ |
| Select | `@fragment_ui/ui/select` | value, onValueChange (wymaga SelectTrigger/SelectValue/SelectContent/SelectItem) | ✅ | ✅ |
| Tabs | `@fragment_ui/ui/tabs` | defaultValue, value, onValueChange (wymaga TabsList/TabsTrigger/TabsContent) | ✅ | ✅ |
| Table | `@fragment_ui/ui/table` | (wymaga TableHeader/TableBody/TableRow/TableHead/TableCell) | ✅ | ✅ |
| Badge | `@fragment_ui/ui/badge` | variant: default/secondary/destructive/outline | ✅ | ✅ |
| Checkbox | `@fragment_ui/ui/checkbox` | checked, onCheckedChange, disabled | ✅ | ✅ |
| Switch | `@fragment_ui/ui/switch` | checked, onCheckedChange, disabled | ✅ | ✅ |
| Textarea | `@fragment_ui/ui/textarea` | placeholder, invalid, disabled, rows | ✅ | ✅ |
| DatePicker | `@fragment_ui/ui/date-picker` | value, onValueChange | ✅ | ✅ |
| Toast | `@fragment_ui/ui/toast` | toast.success/error/info/warning (funkcja, nie komponent) | ✅ | ✅ |

**Uwaga:** Pełna lista komponentów w `packages/ui/src/index.ts` - 60+ eksportów.

---

## 4. Tokeny (DTCG)

### Lokalizacja i pipeline

- **Źródło:** `packages/tokens/src/tokens.json`
- **Build script:** `packages/tokens/scripts/build.mjs`
- **Output:**
  - `packages/tokens/dist/tokens.css` - CSS custom properties
  - `packages/tokens/dist/tokens.ts` - TypeScript constants

### Pipeline build

```javascript
// packages/tokens/scripts/build.mjs
tokens.json → build.mjs → {
  tokens.css (CSS vars dla :root, [data-theme="dark"], etc.)
  tokens.ts (TypeScript export)
}
```

### Przykładowe tokeny

**Base tokens (tokens.json):**
```json
{
  "color": {
    "light": {
      "bg": { "base": "#FFFFFF", "inverse": "#0B0B0C" },
      "fg": { "base": "#0B0B0C", "muted": "#6B7280" },
      "brand": { "primary": "#6B8CFF", "primary-600": "#5B7AF0" },
      "surface": { "1": "#F9FAFB", "2": "#F3F4F6" }
    },
    "dark": { ... }
  },
  "space": { "0": 0, "1": 4, "2": 8, "3": 12, "4": 16 },
  "radius": { "sm": 8, "md": 12, "lg": 16, "xl": 24 }
}
```

**Semantic tokens (generowane w CSS):**
```css
:root {
  --background-primary: #fafafa;
  --foreground-primary: #0a0a0a;
  --color-brand-primary: #6B8CFF;
  --space-1: 4px;
  --radius-sm: 8px;
}

[data-theme="dark"] {
  --background-primary: #09090b;
  --foreground-primary: #fafafa;
  --color-brand-primary: #6B8CFF;
}
```

### Ładowanie w preview

**W iframe.html:**
```html
<link rel="stylesheet" href="/api/bundle-css" />
```

**W /api/bundle-css:**
- Czyta `packages/tokens/dist/tokens.css`
- Czyta `packages/ui/src/styles.css` (który importuje tokens)
- Czyta `react-day-picker/dist/style.css` z node_modules
- Łączy wszystko w jeden CSS bundle

**Endpoint:** `GET /api/bundle-css` → zwraca `text/css` z cache headers

---

## 5. Polityka CSS (krytyczne)

### Wykryte importy `.css` w kodzie ESM

**Znalezione wystąpienia:**

1. **`packages/ui/src/styles.css`** (linia 1):
   ```css
   @import "@fragment_ui/tokens/dist/tokens.css";
   ```
   ✅ **OK** - to jest plik CSS, nie ESM import

2. **`apps/demo/src/styles/globals.css`** (linie 1-2):
   ```css
   @import "@fragment_ui/tokens/dist/tokens.css";
   @import "@fragment_ui/ui/styles.css";
   ```
   ✅ **OK** - to jest plik CSS, nie ESM import

3. **`packages/ui/vitest.setup.ts`** (linia 26):
   ```typescript
   import "./src/styles.css";
   ```
   ⚠️ **UWAGA** - to jest import CSS w TypeScript, ale tylko w test setup (nie w bundle)

4. **`apps/demo/src/components/orb.tsx`** (linia 6):
   ```typescript
   import './orb.css';
   ```
   ⚠️ **UWAGA** - lokalny CSS import w komponencie demo (nie w `@fragment_ui/ui`)

**Wnioski:**
- ✅ W `packages/ui/src/**` **NIE MA** importów `.css` w komponentach ESM
- ✅ Wszystkie style są ładowane via `<link>` w iframe.html lub `/api/bundle-css`
- ⚠️ `vitest.setup.ts` importuje CSS, ale to tylko dla testów (nie trafia do bundle)

### Potwierdzenie external CSS w /api/bundle

**Plik:** `apps/demo/app/api/bundle/route.ts`

**Linie 221-242:** Plugin `remove-css-imports`:
```typescript
plugins: [
  {
    name: "remove-css-imports",
    setup(build: PluginBuild) {
      // Remove all CSS imports completely
      build.onResolve({ filter: /\.css$/ }, () => {
        return { path: "", namespace: "css-stub" };
      });
      build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
        if (args.path.endsWith('.css') || args.path.includes('/style.css')) {
          return { path: "", namespace: "css-stub" };
        }
        return undefined;
      });
      build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => {
        return { contents: "", loader: "js" };
      });
    },
  },
]
```

✅ **POTWIERDZONE:** `/api/bundle` ma plugin usuwający wszystkie importy CSS.

**Również w worker.ts (linie 212-227):**
```typescript
const cssExternalPlugin: EsbuildPlugin = {
  name: "external-css",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      return { path: args.path, external: true };
    });
  },
};
```

✅ **POTWIERDZONE:** Worker również oznacza CSS jako external.

### Vendor CSS

**react-day-picker:**
- **Lokalizacja:** `node_modules/react-day-picker/dist/style.css`
- **Ładowanie:** Via `/api/bundle-css` (linie 44-50 w `apps/demo/app/api/bundle-css/route.ts`)
- **Status:** ✅ Ładowane linkiem, nie importem ESM

**Inne vendor CSS:**
- Brak innych vendor CSS importów w kodzie
- Wszystkie style są w `/api/bundle-css`

---

## 6. Playground Runtime

### iframe.html

**Lokalizacja:** `apps/demo/app/playground/runtime/iframe.html`

**Import map (linie 9-56):**
```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom": "https://esm.sh/react-dom@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "@fragment_ui/ui": "/api/bundle",
    "@fragment_ui/blocks": "/api/bundle-blocks",
    "zod": "https://esm.sh/zod@3.23.8",
    "@fragment_ui/tokens.css": "/api/bundle-css",
    "@radix-ui/react-accordion": "https://esm.sh/@radix-ui/react-accordion@1.2.1",
    // ... więcej Radix UI packages
    "react-day-picker": "https://esm.sh/react-day-picker@9.11.1",
    "lucide-react": "https://esm.sh/lucide-react@0.552.0"
  }
}
</script>
```

**CSS loading (linia 60):**
```html
<link rel="stylesheet" href="/api/bundle-css" />
```

**Worker script (linia 224):**
```html
<script type="module" src="/playground/runtime/worker.js"></script>
```

### worker.ts

**Lokalizacja:** `apps/demo/app/playground/runtime/worker.ts`

**Pluginy esbuild:**
1. **cssExternalPlugin** (linie 212-227): Oznacza wszystkie `.css` jako external
2. **jsxRuntimePlugin** (linie 229-239): Zastępuje `react/jsx-runtime` → `react`

**Wejścia:**
- `code: string` - TSX kod z Playground
- `event.data.type === "render"` - postMessage od parent window

**Wyjścia:**
- `postMessage({ type: "render-success", code, a11y, componentSize })` - sukces
- `postMessage({ type: "render-error", error, stack })` - błąd
- `postMessage({ type: "a11y-results", a11y })` - wyniki a11y (async)

**Obsługa błędów:**
- Error Boundary w React (linie 557-605)
- Retry logic dla renderowania (linie 714-778)
- Cleanup react/jsx-runtime (linie 387-447)

### Kanał komunikacji postMessage

**API postMessage:**

1. **Parent → Worker:**
   - `{ type: "render", code: string }` - renderuj komponent
   - `{ type: "set-zoom", zoom: number }` - ustaw zoom preview

2. **Worker → Parent:**
   - `{ type: "render-success", code: string, a11y: null, componentSize: {width, height} }` - render zakończony
   - `{ type: "render-error", error: string, stack?: string }` - błąd renderowania
   - `{ type: "a11y-results", a11y: {violations, passes, incomplete, inapplicable} }` - wyniki a11y
   - `{ type: "iframe-ready" }` - iframe załadowany

3. **Worker → Iframe (internal):**
   - `{ type: "highlight", id: string }` - podświetl element

4. **Iframe → Parent:**
   - `{ type: "select", id: string }` - kliknięcie w element preview

---

## 7. UI-DSL & Generator

### Schemat DSL

**Lokalizacja:** `apps/demo/app/playground/dsl/types.ts`

**Typy:**
```typescript
export type UiDsl = UiForm | UiPage | UiTable | UiDashboard;

export type UiForm = UiCommon & {
  type: "form";
  fields: Array<{
    id: string;                    // UUID v4
    name: string;
    label: string;
    component: "Input" | "PasswordInput" | "Checkbox" | "Select" | "Switch" | "Textarea";
    validation?: string;            // "email|required" lub "min:8|required"
    placeholder?: string;
    required?: boolean;
  }>;
  actions?: Array<{
    id: string;
    type: "submit" | "reset" | "button";
    label: string;
    variant?: "primary" | "secondary" | "ghost";
  }>;
};

export type UiPage = UiCommon & {
  type: "page";
  sections: Array<{
    id: string;
    kind: "card" | "tabs" | "two-column";
    content: UiDsl[] | Record<string, UiDsl[]>;
  }>;
};

export type UiTable = UiCommon & {
  type: "table";
  columns: Array<{ id: string; key: string; label: string; kind?: "text" | "badge" | "date" | "actions" }>;
  dataSource: "placeholder" | "url" | "static";
  filters?: Array<{ id: string; type: "search" | "select" | "dateRange"; key: string }>;
  pagination?: { pageSize: number; showSizeChanger?: boolean };
};

export type UiDashboard = UiCommon & {
  type: "dashboard";
  widgets: Array<{ id: string; kind: "metric" | "chart" | "table"; title?: string; data?: any }>;
};
```

**Walidacja:** `apps/demo/app/playground/dsl/schema.ts` - JSON Schema + zod validation

### Przykład: prompt → DSL → TSX

**Prompt:**
```
Create a registration form with email, password, and confirm password fields
```

**UI-DSL (wygenerowany):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "form",
  "title": "Registration Form",
  "fields": [
    {
      "id": "field-1",
      "name": "email",
      "label": "Email",
      "component": "Input",
      "validation": "email|required",
      "required": true
    },
    {
      "id": "field-2",
      "name": "password",
      "label": "Password",
      "component": "PasswordInput",
      "validation": "min:8|required",
      "required": true
    },
    {
      "id": "field-3",
      "name": "confirmPassword",
      "label": "Confirm Password",
      "component": "PasswordInput",
      "required": true
    }
  ],
  "actions": [
    {
      "id": "action-1",
      "type": "submit",
      "label": "Register",
      "variant": "primary"
    }
  ]
}
```

**Wygenerowany TSX:**
```tsx
import { FormEnhanced, FormFieldEnhanced, Input, Button } from "@fragment_ui/ui";
import * as React from "react";

export default function RegistrationForm() {
  return (
    <div className="max-w-md mx-auto p-6" data-ui-id="550e8400-e29b-41d4-a716-446655440000">
      <h1 className="text-2xl font-bold mb-6" data-ui-id="550e8400-e29b-41d4-a716-446655440000-title">Registration Form</h1>
      <FormEnhanced onSubmit={((data) => console.log(data))} data-ui-id="550e8400-e29b-41d4-a716-446655440000-form">
        <FormFieldEnhanced name="email" label="Email" data-ui-id="field-1">
          <Input type="email" required data-ui-id="field-1-input" />
        </FormFieldEnhanced>
        <FormFieldEnhanced name="password" label="Password" data-ui-id="field-2">
          <Input type="password" required data-ui-id="field-2-input" />
        </FormFieldEnhanced>
        <FormFieldEnhanced name="confirmPassword" label="Confirm Password" data-ui-id="field-3">
          <Input type="password" required data-ui-id="field-3-input" />
        </FormFieldEnhanced>

        <div className="flex gap-2 mt-4" data-ui-id="550e8400-e29b-41d4-a716-446655440000-actions">
          <Button type="submit" variant="primary" data-ui-id="action-1">Register</Button>
        </div>
      </FormEnhanced>
    </div>
  );
}
```

### Reguły generatora

1. **Zakaz surowych elementów:** Generator używa tylko komponentów z `@fragment_ui/ui`
2. **Walidacja zod:** Opcjonalna (FormEnhanced ma własną walidację)
3. **Mapping tokenów:** Używa Tailwind classes (np. `max-w-md`, `p-6`) które mapują do CSS vars
4. **Variants:** Button używa `variant="primary"` zamiast hardcoded colors
5. **data-ui-id:** Wszystkie elementy mają `data-ui-id` dla patch operations

---

## 8. MCP Tools

### Dostępne narzędzia

**Lokalizacja:** `packages/mcp-server/src/index.ts`

**5 tools:**

1. **`get_component_info`**
   - **Input:** `{ componentName: string }`
   - **Output:** Props, variants, examples, documentation
   - **Endpoint:** MCP server (local)

2. **`suggest_component`**
   - **Input:** `{ description: string }`
   - **Output:** Suggested components with confidence scores
   - **Endpoint:** MCP server (local)

3. **`validate_code`**
   - **Input:** `{ code: string, filePath?: string }`
   - **Output:** Validation errors, warnings, suggestions
   - **Endpoint:** MCP server (local)

4. **`generate_component`**
   - **Input:** `{ componentName: string, props?: Record<string, any>, variant?: string }`
   - **Output:** Generated component code with imports
   - **Endpoint:** MCP server (local)

5. **`get_tokens`**
   - **Input:** `{ category?: string }`
   - **Output:** Design tokens (colors, spacing, typography, etc.)
   - **Endpoint:** MCP server (local)

**3 resources:**

1. **`fragment://components`** - Lista wszystkich komponentów
2. **`fragment://tokens`** - Design tokens
3. **`fragment://rules`** - Design system rules

### Uprawnienia i rate-limit

- **Auth:** Brak (local MCP server)
- **Rate-limit:** Brak (local execution)
- **Logi:** Console logs w development mode

### Konfiguracja

**Cursor (`~/.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "fragment-ui": {
      "command": "npx",
      "args": ["-y", "@fragment_ui/mcp-server"]
    }
  }
}
```

---

## 9. Jakość: Lint/A11y/Visual

### ESLint reguły DS

**Custom rules (lokalizacja: `tooling/lint/`):**

1. **`eslint-no-raw-elements.js`**
   - **Funkcja:** Ban raw HTML elements (`<input>`, `<button>`, `<select>`, `<textarea>`)
   - **Status:** ✅ Zdefiniowana, ⚠️ **NIE włączona** w `apps/demo/eslint.config.mjs`
   - **Gdzie włączona:** Brak (tylko definicja)

2. **`eslint-design-system-imports-only.js`**
   - **Funkcja:** Tylko importy z `@fragment_ui/ui/*`
   - **Status:** ✅ Zdefiniowana, ⚠️ **NIE włączona** w demo app
   - **Gdzie włączona:** Brak (tylko definicja)

3. **`eslint-no-inline-hardcoded-colors.js`**
   - **Funkcja:** Ban hardcoded colors (hex, rgb, etc.)
   - **Status:** ✅ Zdefiniowana, ⚠️ **NIE włączona**
   - **Gdzie włączona:** Brak (tylko definicja)

**Aktualna konfiguracja (`apps/demo/eslint.config.mjs`):**
```javascript
export default [
  {
    ignores: ["**/*.config.*", "**/node_modules/**", "**/.next/**", "**/dist/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
```

**GAP:** Custom rules nie są włączone w demo app.

### axe-core quick check

**Lokalizacja:** `apps/demo/app/playground/runtime/worker.ts` (linie 296-359)

**Status:** ✅ **Działa**

**Implementacja:**
```typescript
async function runA11yCheck() {
  await loadDependencies();
  if (!axe || !axe.run) return null;
  
  const results = await axe.run(document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
    },
  });
  
  return {
    violations: results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    inapplicable: results.inapplicable.length,
  };
}
```

**Gdzie odpalany:**
- W `renderComponent()` po renderowaniu (linie 847-926)
- Async (nie blokuje renderowania)
- Wyniki wysyłane via `postMessage({ type: "a11y-results" })`

### Testy wizualne

**Status:** ⚠️ **Częściowo**

**Playwright:**
- **Lokalizacja:** `apps/www/e2e/` (3 pliki)
- **Zasięg:** Ograniczony (tylko www app)

**Chromatic:**
- **Status:** ⚠️ **Nie znaleziono konfiguracji** w repo
- **GAP:** Brak integracji Chromatic/Percy

**Vitest:**
- **Lokalizacja:** `packages/ui/src/**/*.test.tsx` (41 plików)
- **Zasięg:** Komponenty UI (a11y, rendering, interactions)
- **Status:** ✅ **Działa**

---

## 10. Znane Problemy & Repro

### Problem 1: react/jsx-runtime w bundle

**Opis:** Bundle `/api/bundle` może zawierać referencje do `react/jsx-runtime`, które powodują błędy w iframe.

**Plik:** `apps/demo/app/api/bundle/route.ts`

**Linie:** 291-365 (agresywny cleanup)

**Repro:**
1. Wygeneruj komponent w Playground
2. Sprawdź console w iframe
3. Błąd: `Failed to resolve module specifier "react/jsx-runtime"`

**Rozwiązanie:** Plugin `replace-jsx-runtime` + wielokrotne replace() w post-process

**Status:** ⚠️ **Częściowo naprawione** (wymaga ciągłego cleanup)

### Problem 2: CSS import w vitest.setup.ts

**Opis:** `packages/ui/vitest.setup.ts` importuje CSS, ale to tylko dla testów.

**Plik:** `packages/ui/vitest.setup.ts` (linia 26)

**Repro:** N/A (nie trafia do bundle)

**Status:** ✅ **OK** (nie wpływa na bundle)

### Problem 3: Bundle resolution w produkcji

**Opis:** `/api/bundle` wymaga wielu fallback paths dla różnych środowisk.

**Plik:** `apps/demo/app/api/bundle/route.ts` (linie 68-97)

**Repro:**
1. Deploy na Vercel
2. Bundle może nie znaleźć `packages/ui/dist/index.js`
3. Błąd: `UI package not found`

**Rozwiązanie:** 20+ fallback paths (dev/prod/Vercel/AWS Lambda)

**Status:** ⚠️ **Działa, ale kruche**

### Problem 4: react-day-picker CSS

**Opis:** `react-day-picker/dist/style.css` był importowany w `date-picker.tsx` i `calendar.tsx` (USUNIĘTE).

**Status:** ✅ **Naprawione** - CSS ładowane via `/api/bundle-css`

**Gdzie jeszcze może wystąpić:**
- Sprawdź wszystkie komponenty używające `react-day-picker`
- Sprawdź `packages/blocks/src/**` dla importów CSS

---

## 11. Metryki i Telemetria

### TTFUI (Time to First UI)

**Status:** ⚠️ **Nie logowane**

**GAP:** Brak metryk TTFUI w Playground

### Acceptance rate

**Status:** ⚠️ **Nie logowane**

**GAP:** Brak śledzenia % udanych generacji

### Violation rate

**Status:** ✅ **Częściowo** - a11y violations są logowane w preview

**Gdzie:** `worker.ts` → `postMessage({ type: "a11y-results" })`

**GAP:** Brak agregacji i dashboardu

### ROI Metrics (Telemetry package)

**Lokalizacja:** `packages/telemetry/`

**Metryki:**
- Lead Time (Figma → PR)
- Adoption Rate (% nowych widoków z DS)
- Reuse Rate (% komponentów reuse)
- Time-to-Ship (redukcja %)
- Maintenance Cost (redukcja %)
- Onboarding Time

**Status:** ✅ **Zdefiniowane**, ⚠️ **Wymaga integracji z GitHub webhooks**

---

## 12. Roadmapa techniczna (MVP → v1)

### P0 (Krytyczne)

1. **Włączyć CI check dla CSS imports**
   - **Estymacja:** S
   - **Zależności:** Brak
   - **Plik:** `.github/workflows/ci.yml` → dodać `pnpm check-no-css-imports`

2. **Uprościć react/jsx-runtime cleanup**
   - **Estymacja:** M
   - **Zależności:** Brak
   - **Plik:** `apps/demo/app/api/bundle/route.ts` → zastąpić wielokrotne replace() jednym regex

3. **Włączyć ESLint custom rules w demo app**
   - **Estymacja:** S
   - **Zależności:** Brak
   - **Plik:** `apps/demo/eslint.config.mjs` → dodać custom rules

### P1 (Wysokie)

4. **Stabilizować bundle resolution**
   - **Estymacja:** M
   - **Zależności:** Brak
   - **Plik:** `apps/demo/app/api/bundle/route.ts` → użyć `require.resolve()` jako primary

5. **Dodać Chromatic/Percy integration**
   - **Estymacja:** L
   - **Zależności:** Chromatic account
   - **Plik:** `.github/workflows/chromatic.yml` (już istnieje, sprawdzić konfigurację)

6. **Agregować a11y violations w dashboard**
   - **Estymacja:** M
   - **Zależności:** Brak
   - **Plik:** Nowy endpoint `/api/a11y-stats`

### P2 (Średnie)

7. **Dodać TTFUI metryki**
   - **Estymacja:** M
   - **Zależności:** Brak
   - **Plik:** `apps/demo/app/playground/runtime/worker.ts` → dodać timing

8. **Integrować ROI telemetry z GitHub**
   - **Estymacja:** L
   - **Zależności:** GitHub webhook setup
   - **Plik:** `packages/telemetry/` → dodać webhook handler

9. **Rozszerzyć testy Playwright**
   - **Estymacja:** M
   - **Zależności:** Brak
   - **Plik:** `apps/demo/e2e/` → dodać testy Playground

10. **Dodać Storybook dla blocks**
    - **Estymacja:** M
    - **Zależności:** Brak
    - **Plik:** `packages/blocks/src/**/*.stories.tsx`

---

## 13. Załączniki (artefakty)

### registry.json (realny)

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "version": "1.0.0",
  "components": {
    "Form": {
      "import": "@fragment_ui/ui/form-enhanced",
      "props": {
        "onSubmit": "function",
        "onError": "function",
        "validationMode": ["onChange", "onBlur", "onSubmit"],
        "validateOnMount": "boolean"
      }
    },
    "FormField": {
      "import": "@fragment_ui/ui/form-field",
      "props": {
        "name": "string",
        "label": "string",
        "error": "string | boolean",
        "helperText": "string",
        "required": "boolean"
      }
    },
    "Input": {
      "import": "@fragment_ui/ui/input",
      "props": {
        "type": ["text", "email", "password", "number", "tel", "url"],
        "invalid": "boolean",
        "placeholder": "string",
        "disabled": "boolean",
        "readOnly": "boolean"
      }
    },
    "Button": {
      "import": "@fragment_ui/ui/button",
      "props": {
        "variant": ["solid", "outline", "ghost"],
        "type": ["button", "submit", "reset"],
        "disabled": "boolean",
        "size": ["sm", "md", "lg"]
      }
    },
    "Card": {
      "import": "@fragment_ui/ui/card",
      "props": {
        "className": "string"
      },
      "note": "Requires CardHeader, CardTitle, CardContent, CardFooter"
    },
    "Tabs": {
      "import": "@fragment_ui/ui/tabs",
      "props": {
        "defaultValue": "string",
        "value": "string",
        "onValueChange": "function"
      },
      "note": "Requires TabsList, TabsTrigger, TabsContent"
    },
    "Table": {
      "import": "@fragment_ui/ui/table",
      "props": {},
      "note": "Requires TableHeader, TableBody, TableRow, TableHead, TableCell"
    },
    "Badge": {
      "import": "@fragment_ui/ui/badge",
      "props": {
        "variant": ["default", "secondary", "destructive", "outline"]
      }
    }
  },
  "aliases": {
    "Tab": "TabTrigger",
    "TabsHeader": "TabsList"
  },
  "rules": {
    "forbiddenHtml": ["input", "button", "select", "textarea"],
    "prefer": {
      "input": "Input",
      "button": "Button",
      "select": "Select",
      "textarea": "Textarea"
    }
  }
}
```

### ui-dsl.schema/typy

**Plik:** `apps/demo/app/playground/dsl/types.ts`

```typescript
export type UiDsl = UiForm | UiPage | UiTable | UiDashboard;

export type UiCommon = {
  id: string;                    // UUID v4
  key?: string;
  name?: string;
  "data-test-id"?: string;
  title?: string;
  layout?: { 
    maxWidth?: "sm" | "md" | "lg" | "xl"; 
    gap?: number;
    type?: "stack" | "grid" | "two-column";
    columns?: number;
    colSpan?: number;
  };
  a11y?: { 
    ariaDescribedBy?: string;
    ariaLabel?: string;
  };
};

export type UiForm = UiCommon & {
  type: "form";
  fields: Array<{
    id: string;
    name: string;
    label: string;
    component: "Input" | "PasswordInput" | "Checkbox" | "Select" | "Switch" | "Textarea";
    options?: string[];
    validation?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
  }>;
  actions?: Array<{ 
    id: string;
    type: "submit" | "reset" | "button"; 
    label: string; 
    variant?: "primary" | "secondary" | "ghost";
    onClick?: string;
  }>;
  onSubmit?: string;
};

export type UiPage = UiCommon & {
  type: "page";
  sections: Array<{ 
    id: string;
    kind: "card" | "tabs" | "two-column"; 
    content: UiDsl[] | Record<string, UiDsl[]>;
    title?: string;
  }>;
};

export type UiTable = UiCommon & {
  type: "table";
  columns: Array<{ 
    id: string;
    key: string; 
    label: string; 
    kind?: "text" | "badge" | "date" | "actions";
    width?: string;
  }>;
  dataSource: "placeholder" | "url" | "static";
  data?: Array<Record<string, any>>;
  filters?: Array<{ 
    id: string;
    type: "search" | "select" | "dateRange"; 
    key: string; 
    options?: string[];
    placeholder?: string;
  }>;
  pagination?: { 
    pageSize: number;
    showSizeChanger?: boolean;
  };
};

export type UiDashboard = UiCommon & {
  type: "dashboard";
  widgets: Array<{ 
    id: string;
    kind: "metric" | "chart" | "table"; 
    title?: string;
    data?: any;
  }>;
};
```

### iframe.html fragment <head>

**Plik:** `apps/demo/app/playground/runtime/iframe.html` (linie 1-60)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fragment UI Playground Preview</title>
  
  <!-- Import map for local packages and dependencies -->
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react-dom": "https://esm.sh/react-dom@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
      "react/jsx-runtime": "https://esm.sh/react@18.3.1",
      "react/jsx-dev-runtime": "https://esm.sh/react@18.3.1",
      "@fragment_ui/ui": "/api/bundle",
      "@fragment_ui/blocks": "/api/bundle-blocks",
      "zod": "https://esm.sh/zod@3.23.8",
      "@fragment_ui/tokens.css": "/api/bundle-css",
      "@radix-ui/react-accordion": "https://esm.sh/@radix-ui/react-accordion@1.2.1",
      "@radix-ui/react-alert-dialog": "https://esm.sh/@radix-ui/react-alert-dialog@1.1.15",
      // ... więcej Radix UI packages
      "react-day-picker": "https://esm.sh/react-day-picker@9.11.1",
      "lucide-react": "https://esm.sh/lucide-react@0.552.0"
    }
  }
  </script>
  
  <!-- Load CSS via <link> tags (not ESM imports) -->
  <link rel="stylesheet" href="/api/bundle-css" />
  
  <!-- CSS will also be injected by worker for dynamic updates -->
  <style id="fragment-ui-styles"></style>
</head>
```

### Fragment /api/bundle z external CSS

**Plik:** `apps/demo/app/api/bundle/route.ts` (linie 221-242)

```typescript
plugins: [
  {
    name: "remove-css-imports",
    setup(build: PluginBuild) {
      // Remove all CSS imports completely - they're loaded via <link> tags
      build.onResolve({ filter: /\.css$/ }, () => {
        return { path: "", namespace: "css-stub" };
      });
      build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
        if (args.path.endsWith('.css') || args.path.includes('/style.css') || args.path.includes('react-day-picker')) {
          return { path: "", namespace: "css-stub" };
        }
        return undefined;
      });
      build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => {
        return { contents: "", loader: "js" };
      });
    },
  },
]
```

### Reprezentatywny wygenerowany widok (TSX)

**Przykład:** Formularz rejestracyjny wygenerowany z promptu

```tsx
"use client";
import { FormEnhanced, FormFieldEnhanced, Input, Button } from "@fragment_ui/ui";
import * as React from "react";

export default function RegistrationForm() {
  return (
    <div className="max-w-md mx-auto p-6" data-ui-id="550e8400-e29b-41d4-a716-446655440000">
      <h1 className="text-2xl font-bold mb-6" data-ui-id="550e8400-e29b-41d4-a716-446655440000-title">
        Registration Form
      </h1>
      <FormEnhanced 
        onSubmit={((data) => console.log(data))} 
        data-ui-id="550e8400-e29b-41d4-a716-446655440000-form"
      >
        <FormFieldEnhanced name="email" label="Email" data-ui-id="field-1">
          <Input type="email" required data-ui-id="field-1-input" />
        </FormFieldEnhanced>
        <FormFieldEnhanced name="password" label="Password" data-ui-id="field-2">
          <Input type="password" required data-ui-id="field-2-input" />
        </FormFieldEnhanced>
        <FormFieldEnhanced name="confirmPassword" label="Confirm Password" data-ui-id="field-3">
          <Input type="password" required data-ui-id="field-3-input" />
        </FormFieldEnhanced>

        <div className="flex gap-2 mt-4" data-ui-id="550e8400-e29b-41d4-a716-446655440000-actions">
          <Button type="submit" variant="primary" data-ui-id="action-1">
            Register
          </Button>
        </div>
      </FormEnhanced>
    </div>
  );
}
```

---

**Koniec raportu**

Wygenerowano: `docs/DS_AUDIT_REPORT.md`

